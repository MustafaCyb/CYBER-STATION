---
itemSlug: "pagefile-deleted-contact-dfir"
title: "استخراج الأدلة من ملف Pagefile.sys في نظام Windows: دراسة حالة حقيقية"
description: "دراسة حالة حقيقية في الاستجابة للحوادث والتحقيق الجنائي الرقمي (DFIR) حول كيفية استرجاع بيانات مفقودة من ملف pagefile.sys في نظام Windows."
date: 2026-07-13
locale: "ar"
tags: ["dfir", "forensics", "memory-forensics", "windows", "pagefile"]
cover: "/images/articles/pagefile-deleted-contact-dfir/Theme.png"
---

تتعدد الطرق القياسية لاستخراج الأدلة الرقمية من الأجهزة، واختيار الطريقة الصحيحة يعتمد دائماً على نوع البيانات المفقودة.

إذا فقدت ملفاً تم حذفه من نظام الملفات (File System)، فإن الوسيلة المناسبة هي استخدام أدوات استرجاع البيانات على مستوى القرص الصلب (Disk-level Recovery)، مثل أداة **Autopsy**.

أما إذا قمت بنسخ نص إلى الحافظة (Clipboard) ولم تقم بحفظه كملف، ثم تم فقدانه، فإن الحل يكمن في الاستحواذ المباشر على الذاكرة الحية (Live Memory) وأخذ نسخة كاملة من ذاكرة الوصول العشوائي (RAM) عبر أدوات مثل **WinPMEM** أو **Magnet RAM Capture**، ومن ثم تحليلها باستخدام أداة **Volatility** لاستخراج النص المفقود.

ولكن ماذا لو لم تنطبق أي من هذه الحالات؟ ماذا لو تم إيقاف تشغيل الجهاز بالفعل، ولم يتم حفظ أي بيانات، ولم يتم أخذ نسخة من الذاكرة؟

هذا بالضبط ما سنتناوله في هذا المقال. إنه سيناريو واقعي تماماً، وليس مجرد افتراض.

## خارطة الطريق
1. كيف يدير نظام Windows الذاكرة.
2. أهمية ملف `pagefile.sys` والأدلة التي يمكن استخراجها منه.
3. المش المشكلة المطروحة، ولماذا بدت وكأنها بلا حل.
4. الأدوات التي جعلت الاسترجاع ممكناً.
5. خطوة بخطوة: الاستحواذ على ملفات الـ Pagefiles وتحليلها.
6. العثور على الدليل، وسبب وجود الرقم في الذاكرة في المقام الأول.
7. الخاتمة: المفهوم الحقيقي للبيانات "المؤقتة".

## 1. كيف يدير نظام Windows الذاكرة

![إدارة الذاكرة في ويندوز](/CYBER-STATION/images/articles/pagefile-deleted-contact-dfir/image1.jpg)

يعتمد نظام Windows على نظام متطور لإدارة الذاكرة. يجب أولاً إدراك أن "الذاكرة" ليست كياناً واحداً؛ فهناك الذاكرة الفيزيائية المتمثلة في (Physical Memory/RAM)، وهناك الذاكرة الافتراضية (Virtual Memory) التي تُخزن على القرص الصلب (Disk).

عندما يظل تطبيق يعمل في الخلفية خاملاً لفترة، أو عندما تبدأ الـ RAM بالامتلاء، يقوم Windows بتخفيف الضغط عبر أخذ صفحات الذاكرة (Memory Pages) الخاصة بذلك التطبيق من الـ RAM ونقلها إلى القرص الصلب وتحديداً إلى ملف يُدعى `pagefile.sys`. تُعرف هذه العملية بـ **Paging**.

![إعدادات الذاكرة الافتراضية](/CYBER-STATION/images/articles/pagefile-deleted-contact-dfir/image2.jpg)

يمكنك التحقق من إعدادات الـ Pagefile في نظامك من خلال المسار التالي:
`System Properties → Advanced → Performance (Settings) → Advanced → Virtual Memory (Change)`

في هذه الحالة، لوحظ وجود ملفي `pagefile.sys` منفصلين، أحدهما على محرك الأقراص `C:` والآخر على `F:`. هذا أمر طبيعي جداً، حيث يمكن لنظام Windows الحفاظ على أكثر من ملف عبر محركات أقراص مختلفة. معرفة موقع هذه الملفات أمر حاسم، لأنه يتوجب الاستحواذ عليها وتحليلها معاً للحصول على صورة كاملة لما كان موجوداً في الذاكرة.

![أماكن ملفات الـ Pagefile](/CYBER-STATION/images/articles/pagefile-deleted-contact-dfir/image3.jpg)
![حجم ملفات الـ Pagefile](/CYBER-STATION/images/articles/pagefile-deleted-contact-dfir/image4.jpg)

## 2. أهمية ملف Pagefile.sys في التحقيق الرقمي (Forensics)

كما ذكرنا سابقاً، يحتوي ملف الـ Pagefile على أجزاء من البيانات المتطايرة التي كانت موجودة مسبقاً في الذاكرة. وتكمن أهميته في أن هذه البيانات تبقى موجودة حتى بعد إعادة تشغيل النظام (Reboot)، وذلك لأن البيانات المخزنة على القرص الصلب دائمة وليست متطايرة كالـ RAM. بمجرد انتقال البيانات إلى `pagefile.sys`، فإنها تبقى هناك حتى يتم الكتابة فوقها (Overwritten).

بناءً على نشاط المستخدم، قد يحتوي الـ Pagefile على أجزاء من:
- محتويات الحافظة (Clipboard payloads).
- نصوص محادثات غير مشفرة (Unencrypted chat text).
- عناوين المواقع (URLs) وطلبات (DNS).
- شظايا من قواعد بيانات SQLite.
- أرقام هواتف وعناوين بريد إلكتروني.
- وغيرها...

ليس هناك ضمان بوجود بيانات محددة، كما أنها ليست منظمة، لكنها موجودة متناثرة داخل الملف بانتظار الأداة المناسبة لاستخراجها.

## 3. المشكلة المطروحة

إليك السيناريو (وهو سيناريو حقيقي):
كان لدى أحد الأشخاص رقم هاتف صديقه محفوظاً في تطبيق Telegram. لاحقاً، قام هذا الصديق بحذف حسابه. ولكن قبل ذلك بأيام، كان الرقم ظاهراً على الشاشة، بل وتم نسخه والبحث عنه في تطبيق آخر. 
بعد ذلك تم إيقاف تشغيل الجهاز. لم يتم أخذ أي صورة للذاكرة (Memory Image). وعند إعادة تشغيل النظام، اختفت الأدلة الحية.

الأمل الوحيد المتبقي: كان النظام يحتوي على ملفات Pagefiles متعددة، مما يعني أن هناك فرصة لاستخراج الرقم المفقود من البيانات التي نُقلت إلى القرص الصلب قبل إيقاف التشغيل.

## 4. الأدوات المستخدمة

اعتمدت عملية الاسترجاع بأكملها على أداتين:

- **RawCopy**: لا يمكن نسخ ملف `pagefile.sys` بالطريقة المعتادة نظراً لأنه يكون مقفلاً (Locked) طالما أن نظام Windows يعمل. تعمل أداة RawCopy على مستوى قطاعات محرك الأقراص (Drive-sector level)، مما يتيح لها تجاوز هذا القفل تماماً. ([رابط الأداة](https://github.com/jschicht/RawCopy))
- **bulk_extractor**: أداة مخصصة لاستخراج الأدلة الجنائية من صور الأقراص وتفريغات الذاكرة. تأتي مزودة بالعديد من وحدات الاستخراج (Extraction Modules) التي تسهل عملية تحليل ملفات الـ Pagefile بشكل كبير. ([رابط الأداة](https://digitalcorpora.s3.amazonaws.com/s3_browser.html#downloads/bulk_extractor/))

## 5. خطوة بخطوة: الاستحواذ والتحليل

![تشغيل RawCopy](/CYBER-STATION/images/articles/pagefile-deleted-contact-dfir/image5.jpg)
![عملية النسخ](/CYBER-STATION/images/articles/pagefile-deleted-contact-dfir/image6.jpg)

ابدأ بفتح PowerShell أو موجه الأوامر (Terminal) بصلاحيات المسؤول (Administrator). نظراً لوجود ملفي Pagefile (في `C:` و `F:`)، يجب الحصول على كليهما وتحليلهما معاً.

نسخ ملف الـ Pagefile من القرص `C:`:
```powershell
.\RawCopy64.exe /FileNamePath:C:\pagefile.sys /OutputPath:F:\Lost_Phone_number_Restore\pagefile.sys
```
*ملاحظة: تختلف مسارات الإخراج (Output Path) من جهاز لآخر، لذا تأكد من تعديلها بما يتناسب مع بيئتك.*

بما أننا سنحصل على نسخة أخرى من القرص `F:` وسيكون لها نفس الاسم، يجب إعادة تسمية الملف الأول لتجنب الكتابة فوقه.

![إعادة التسمية](/CYBER-STATION/images/articles/pagefile-deleted-contact-dfir/image7.jpg)
![الملفات جاهزة](/CYBER-STATION/images/articles/pagefile-deleted-contact-dfir/image8.jpg)

بمجرد تأمين النسختين، حان وقت تحليلها باستخدام `bulk_extractor`.

![تشغيل bulk_extractor](/CYBER-STATION/images/articles/pagefile-deleted-contact-dfir/image9.jpg)

```powershell
.\bulk_extractor64.exe -e base16 -e hiberfile -e outlook -e wordlist -e xor -S ssn_mode=2 -S scan_aes_192=1 -S strings=1 -x zip -x rar -x pdf -o .\c_drive_pagefile_analysis_full .\pagefile1.sys

.\bulk_extractor64.exe -e base16 -e hiberfile -e outlook -e wordlist -e xor -S ssn_mode=2 -S scan_aes_192=1 -S strings=1 -x zip -x rar -x pdf -o .\f_drive_pagefile_analysis_full .\pagefile2.sys
```
التعليمات متطابقة للملفين، الاختلاف فقط في اسم الملف ومسار مجلد الإخراج.

<video controls style="width: 100%; border-radius: 8px; margin-top: 1rem;">
  <source src="/CYBER-STATION/images/articles/pagefile-deleted-contact-dfir/video.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

![نتائج التحليل](/CYBER-STATION/images/articles/pagefile-deleted-contact-dfir/image10.jpg)

## 6. العثور على الدليل

![المجلدات الناتجة](/CYBER-STATION/images/articles/pagefile-deleted-contact-dfir/image11.jpg)

بعد انتهاء `bulk_extractor`، يتم إنشاء مجلد يحتوي على مخرجات مصنفة (Histograms، نصوص، وأدلة مبوبة حسب النوع). من هنا، يبدأ البحث عن شيء واحد: الرقم المفقود.

لحسن الحظ، تحتوي أداة `bulk_extractor` على وحدة استخراج مخصصة تسحب أرقام الهواتف تلقائياً. بعد بحث قصير داخل ملف `telephone_histogram.txt`، ظهر الرقم المطلوب!

![مثال للبيانات](/CYBER-STATION/images/articles/pagefile-deleted-contact-dfir/image12.jpg)
![الرقم المستخرج](/CYBER-STATION/images/articles/pagefile-deleted-contact-dfir/image13.jpg)

**لماذا وُجد الرقم هناك في المقام الأول؟**
قبل أن يحذف الصديق حسابه على Telegram، تم نسخ رقمه ولصقه في شريط بحث تطبيق WhatsApp للتحقق مما إذا كان يمتلك حساباً هناك. في تلك اللحظة بالذات، كان تطبيق WhatsApp موجوداً في الذاكرة الحية (RAM). ووفقاً لروتين إدارة الذاكرة، قام نظام Windows بنقل جزء من تلك الذاكرة إلى القرص الصلب (Paging). استقر ذلك الجزء في `pagefile.sys`، حاملاً معه الرقم. الأمر لم يكن له علاقة بحذف حساب Telegram؛ بل نجا الرقم بسبب نشاط منفصل تماماً، وشبه عابر، في تطبيق آخر.

*ملاحظة هامة:* غالباً ما يُظهر ملف الـ Pagefile أرقام هواتف متعددة (الكثير من الضوضاء الناتجة عن تطبيقات أخرى). من الضروري مطابقة الرقم المحتمل مع أدوات مثل Truecaller أو إجراء بحث عبر المصادر المفتوحة (OSINT) لتأكيد هويته قبل اعتباره دليلاً قاطعاً.

## 7. ماذا تعني كلمة "مؤقت" حقاً؟

الدرس الأهم من هذا كله: ما يبدو "مؤقتاً" على نظام يعمل، نادراً ما يكون كذلك في الواقع. كل ما يحدث داخل النظام يتم تدوينه في مكان ما، بطريقة أو بأخرى. من السهل أن نفترض - كمستخدمين عاديين أو حتى كتقنيين - أن العمليات التي تتم في الخلفية هي عمليات عابرة ومؤقتة. لكن عملياً، هي تترك أثراً دائماً تقريباً على القرص الصلب، في انتظار من يبحث عنه.

ملفات مثل `pagefile.sys` هي بالضبط هذا النوع من الأثر: منجم ذهب مهمل قد يعيد لك ما ظننته ضاع إلى الأبد، سواء كان جهة اتصال محذوفة، أو جزءاً من محادثة، أو صورة أوضح لما حدث بالفعل على الجهاز.

نأمل أن يكون هذا الشرح واضحاً ومفيداً، وانتظرونا في دراسات حالة قادمة من أرض الواقع. 🤍


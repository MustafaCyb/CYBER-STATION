---
itemSlug: "digipi-memory-forensics-platform"
title: "مشروع DiGiPi: منصة متكاملة للتحقيق الجنائي الرقمي في الذاكرة العشوائية عبر Raspberry Pi والذكاء الاصطناعي"
description: "استعراض شامل ومعمق لمشروع DiGiPi للتحقيق الجنائي الرقمي في الذاكرة العشوائية (Memory Forensics)، يغطي مراحل الاستحواذ الميداني، الإدارة المركزية للأدلة، التحليل الآلي عبر الذكاء الاصطناعي، وبيئات التحقيق التفاعلية."
date: 2026-08-08
locale: "ar"
tags: ["dfir", "memory-forensics", "volatility", "linux", "windows", "raspberry-pi", "ai"]
cover: "/images/articles/digipi-memory-forensics-platform/cover.jpg"
---

## مقدمة عن المشروع

يُعد التحقيق الجنائي الرقمي والاستجابة للحوادث السيبرانية (**DFIR - Digital Forensics and Incident Response**) ركيزة أساسية في هندسة الأمن السيبراني الحديث؛ حيث يُمكّن الفرق الأمنية وفرق صيد التهديدات من إعادة بناء سيناريوهات الهجمات، وتفكيك آليات المهاجمين، والاستحواذ على الأدلة الرقمية الدقيقة التي تترك في مسرح الحادث لإثبات الإدانة أو سد الثغرات وتطهير البيئة المخترقة.

تتوزع الأدلة الرقمية عبر مستويات متعددة:
1. **أدلة على مستوى وسائط التخزين (Disk Forensics):** تشمل استعادة الملفات المحذوفة، وتحليل الكتل غير المهيكلة، وفحص نظم الملفات وسجلات الأحداث.
2. **أدلة على مستوى الشبكة (Network Forensics):** تشمل فحص ملفات التقاط الحزم (PCAP)، وإعادة بناء جلسات الاتصال، واكتشاف حركة مرور خوادم التحكم والسيطرة (C2).
3. **أدلة على مستوى الذاكرة العشوائية (Memory Forensics):** استخراج الحالة التشغيلية اللحظية من **الذاكرة العشوائية (RAM)** — بما في ذلك كشف البرمجيات الخبيثة غير المستندة لملفات (Fileless Malware)، والحقن البرمجي (Reflective DLL Injection)، والمنافذ والاتصالات النشطة، والمفاتيح المشفرة المفكوكة، وأوامر المهاجم غير المحفوظة على القرص.

يرتكز مشروع **DiGiPi (Digital Forensics via Raspberry Pi)** بشكل رئيسي على **التحقيق الجنائي في الذاكرة العشوائية (Memory Forensics)**، وهو المسار الأكثر حساسية وتعقيداً نظراً للطبيعة المتطايرة للذاكرة (**Volatile Memory**)؛ فكل ثانية تأخير تهدد بفقدان الأدلة أو استبدالها عبر التبديل (Paging)، بينما يؤدي انقطاع الطاقة أو إعادة التشغيل إلى محو الأدلة المتطايرة نهائياً دون رجعة.

---

## خارطة الطريق وهيكل مراحل المشروع

تم تصميم وهندسة مشروع **DiGiPi** على أربع مراحل معيارية متكاملة، حيث تعمل كل مرحلة كنظام فرعي مستقل ومغذٍ للمرحلة التي تليها:

![جدول مراحل وتخطيط مشروع DiGiPi](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_684@04-08-2026_16-20-00.jpg)

| المرحلة | التسمية | الدور والوظيفة الأساسية |
| :--- | :--- | :--- |
| **Phase 0** | **الاستحواذ الميداني المنفصل (Offline Acquisition)** | حزمة أدوات ميدانية مستقلة ومعزولة للاستحواذ على الذاكرة والبيانات المتطايرة موقعياً عبر وسائط USB مؤتمتة دون اشتراط اتصال بالشبكة. |
| **Phase 1** | **خادم استقبال وإدارة الأدلة (Server Ingestion)** | بيئة خادم مركزية تستقبل صور الذاكرة عبر الشبكة، وتحسب البصمات التشفيرية، وتنظم القضايا وتهيئ الأدلة للمعالجة. |
| **Phase 2** | **التحليل الآلي الموجه بالذكاء الاصطناعي (AI Analysis)** | خط معالجة آلي مستند إلى Volatility 3، يوظف تمثيل TOON لضغط الـ Tokens وتوليد تقارير تنفيذية شاملة بصيغة HTML عبر نماذج اللغة الكبيرة. |
| **Phase 3** | **منصة التحقيق وبيئات العمل الذكية (Investigation Platform)** | منصة ويب تعاونية متكاملة توفر بيئات معزولة للمحققين، وطرفية سطر أوامر تفاعلية، ورسوماً بيانية للعمليات، ومساعد ذكاء اصطناعي تفاعلي (RAG & Tool Calling). |

---

## الأسس التقنية وإدارة الذاكرة في أنظمة التشغيل

![الجانب التقني والأسس الهندسية](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_735@08-08-2026_01-39-59.jpg)

قبل الخوض في آليات عمل المنصة، من الضروري فهم كيفية إدارة أنظمة التشغيل للذاكرة وكيفية استغلال هذه البنية جنائياً.

### 1. إدارة الذاكرة في نظام Windows

تعمل عمليات Windows داخل **فضاء عنونة افتراضي خاص (Virtual Address Space - VAS)** يتوزع بين الذاكرة الفيزيائية والقرص. تحتوي كل عملية على كود تنفيذي، ومكتبات DLL مربوطة، ومكدسات مسارات التنفيذ (Thread Stacks)، وكتل الـ Heap. وتكشف هذه التخصيصات سلوك البرمجيات الخبيثة لحظة التنفيذ بدقة تامة.

![إدارة الذاكرة في Windows](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_736@08-08-2026_01-39-59.jpg)

بالإضافة إلى RAM الفيزيائية، يُفرغ Windows صفحات الذاكرة إلى ملفات ثابتة على القرص:

| الأثر الجنائي على القرص | الآلية التقنية | القيمة والأهمية الجنائية |
| :--- | :--- | :--- |
| **Pagefile.sys** | ملف التبديل الذي يعمل كامتداد لـ RAM؛ ينقل Windows صفحات الذاكرة الخاملة للقرص عند امتلاء الذاكرة. | يحتوي على بقايا من ذاكرة العمليات المنتهية، ونصوص مفكوكة التشفير، ومخازن الاتصالات الشبكية. |
| **Swapfile.sys** | ملف مبادلة مخصص لإدارة وحفظ حالة تطبيقات Windows الحديثة (UWP). | يضم بقايا التطبيقات المعلقة وذاكرة التخزين المؤقت للخدمات الحديثة. |
| **hiberfil.sys** | تفريغ كامل لذاكرة النظام يُكتب على القرص عند دخول النظام في وضع الإسبات. | يوفر لقطة شبه كاملة لمحتويات RAM لحظة الإسبات، وتبقى محفوظة حتى بعد إيقاف التشغيل. |

---

### 2. إدارة الذاكرة في نظام Linux

يدير Linux ذاكرة العمليات عبر مناطق متجاورة تُسمى **Virtual Memory Areas (VMAs)** يجري تتبعها داخل هياكل النواة مثل `mm_struct` و `vm_area_struct`. وتتولى جداول الصفحات (**Page Tables**) ترجمة العناوين الافتراضية إلى إطارات فيزيائية في RAM.

![إدارة الذاكرة وهياكل النواة في Linux](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_737@08-08-2026_01-39-59.jpg)

على مستوى النواة، يعتمد Linux على خوارزمية **Slab/SLUB Allocator** لإدارة كائنات النواة المتكررة (مثل واصفات الملفات، وواصفات العمليات، ومقابس الشبكة) عبر مخازن مخصصة. ويسمح التحليل الجنائي للذاكرة بتتبع هياكل النواة وإعادة بناء شجرة العمليات، ووحدات النواة المحملة (**LKMs**)، ومقابس الاتصال الخام.

---

### 3. منهجيات وأدوات الاستحواذ على الذاكرة

يُقصد بـ **الاستحواذ على الذاكرة (Memory Acquisition)** إنشاء صورة مطابقة بت بت للذاكرة الفيزيائية مع تقليل التأثير على النظام والالتزام بـ **ترتيب التطاير (Order of Volatility)**:

#### أدوات الاستحواذ لنظام Windows:
- **WinPmem:** مشغل نواة مفتوح المصدر يوفر وصولاً مباشراً للذاكرة الفيزيائية لإنشاء نسخ خام غير مضغوطة (`.raw`).
- **Magnet DumpIt:** أداة احترافية تدعم ضغط الذاكرة أثناء النقل (`.zdmp`) لتقليل استهلاك حزم البيانات عبر الشبكة.

#### أدوات الاستحواذ لنظام Linux:
- **LiME (Linux Memory Extractor):** وحدة نواة (LKM) مخصصة لالتقاط الذاكرة الفيزيائية مباشرة، وتدعم البث عبر شبكة TCP أو الحفظ المحلي بصيغة raw أو lime.
- **AVML (Acquire Volatile Memory for Linux):** أداة مستقلة من مايكروسوفت تعمل في فضاء المستخدم دون اشتراط ترجمة مشغلات مسبقة على التوزيعات الحديثة.

---

### 4. ملفات الرموز (Symbol Files) ودورها المحوري

تُمثل **Symbol Files** المخطط المعماري الذي يُترجم العناوين الست عشرية الصماء إلى كائنات وهياكل برمجية ذات معنى:

```text
Memory Dump (بيانات ثنائية خام)
       ↓
Raw Hex Addresses (عناوين ست عشرية غير مهيكلة)
       ↓
Symbol Files (جداول الأنواع وتعاريف الهياكل)
       ↓
Kernel Structures (هياكل النواة: _EPROCESS / task_struct)
       ↓
Reconstructed Artifacts (الأدلة المستخرجة: العمليات، المسارات، الاتصالات)
```

| نظام التشغيل | المصدر الأساسي للرموز | القدرة على الترجمة الجنائية |
| :--- | :--- | :--- |
| **Windows** | ملفات **PDB (Program Database)** | تُعين هياكل النواة الداخلية مثل `_EPROCESS` و `_ETHREAD` لاستخراج معرفات العمليات والرموز والوحدات. |
| **Linux** | رموز **Kernel Debug / DWARF** | تُعالج عبر أداة `dwarf2json` لإنتاج جداول **ISF JSON** التي تكشف `task_struct` والـ VMAs ومقابس الشبكة. |
| **Volatility 3** | **Intermediate Symbol Format (ISF)** | توحد رموز الأنظمة المختلفة في جداول JSON متجانسة وتلغي الحاجة للملفات التعريفية القديمة (Static Profiles). |

---

### 5. إطار عمل التحليل Volatility 3

يُمثل **Volatility 3** المعيار العالمي في التحليل الجنائي للذاكرة؛ حيث يعتمد على منظومة إضافات برمجية (**Plugins**) متخصصة لاستنطاق الذاكرة:

```text
Acquired Memory Image (memory.raw / memory.zdmp)
                    ↓
             Volatility 3 Core
                    ↓
┌───────────────────┬───────────────────┬───────────────────┐
│  windows.pslist   │  windows.netscan  │    linux.bash     │
│  (العمليات النشطة) │  (اتصالات الشبكة) │  (تاريخ الطرفية)  │
└───────────────────┴───────────────────┴───────────────────┘
```

أمر تشغيل نموذجي عبر سطر الأوامر:
```bash
python3 vol.py -f memory.raw windows.pslist
```

---

### 6. حزمة التقنيات المستخدمة في تطوير المنصة

بُنيت منصة DiGiPi بالاعتماد على حزمة برمجية متكاملة تجمع بين لغات البرمجة منخفضة المستوى، والبنية التحتية للحاويات، والواجهات السحابية، ونماذج الذكاء الاصطناعي:

![حزمة التقنيات المستخدمة في تطوير DiGiPi](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_738@08-08-2026_01-39-59.jpg)

---

## المرحلة 0: الاستحواذ الميداني المنفصل (Phase 0)

![المرحلة صفر - الاستحواذ المنفصل](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_685@04-08-2026_16-20-00.jpg)

### التعريف والهدف
تمثل المرحلة 0 حزمة أدوات مستقلة ومعزولة تُمكّن فرق الاستجابة للحوادث من الاستحواذ على الذاكرة والبيانات المتطايرة موقعياً عبر وسيط **USB** مهيأ مسبقاً، مع دعم كامل لأنظمة Windows و Linux دون اشتراط اتصال بالشبكة.

### مخطط مسار العمل (Logic Flow)
![مخطط سير العمل للمرحلة صفر](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_686@04-08-2026_16-20-00.jpg)

---

### الاستحواذ على أجهزة Windows

1. **هيكلية ملفات وسيط USB:**
   يحتوي وسيط التخزين على سكربتات التنفيذ وحزم الأدوات التنفيذية:
   ![هيكلية ملفات USB في Windows](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_687@04-08-2026_16-20-00.jpg)

2. **تنفيذ سكربت الاستحواذ:**
   يتم تشغيل `RunForensics.bat` بصلاحيات المسؤول، لتبدأ عملية استخراج الذاكرة وتوثيق البيانات المتطايرة وتوليد البصمات التشفيرية:
   ![بدء عملية الاستحواذ في Windows](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_688@04-08-2026_16-20-00.jpg)

3. **إنشاء مجلد القضية بالختم الزمني:**
   تُحفظ مخرجات كل فحص داخل مجلد مؤرخ بدقة (**Timestamp**) لضمان سلامة سلسلة الحيازة الجنائية (**Chain of Custody**):
   ![مجلد القضية الميدانية](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_689@04-08-2026_16-20-00.jpg)

4. **الأدلة المستخرجة والتحقق من النزاهة:**
   ![الأدلة المستحوذ عليها في Windows](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_690@04-08-2026_16-20-00.jpg)

| اسم الملف | الوصف الجنائي والدور في التحقيق |
| :--- | :--- |
| `acquisition_log.txt` | سجل تنفيذي شامل يوثق أوقات البدء والانتهاء، وإزاحات الذاكرة، ورموز الخروج. |
| `image_<timestamp>.zdmp` | صورة الذاكرة المضغوطة التي تحتوي على الحالة التشغيلية الكاملة للـ RAM. |
| `image_<timestamp>.sha256` | البصمة التشفيرية SHA-256 المحسوبة فور اكتمال تفريغ الذاكرة. |
| `manifest.sha256` | سجل التحقق التشفيري لكافة الملفات التوثيقية والبيانات المساعدة. |
| `system_info.txt` | تقرير شامل عن مواصفات العتاد، وإصدار النظام، والتحديثات، والمستخدمين. |
| `volatile_info.txt` | لقطة لحظية للمقابس الشبكية، والخدمات النشطة، والمهام المجدولة. |

5. **معاينة ملفات المعلومات:**
   - استعراض بيانات النظام `system_info.txt`:
     ![استعراض ملف system_info.txt](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_691@04-08-2026_16-20-00.jpg)
   - استعراض البيانات المتطايرة `volatile_info.txt`:
     ![استعراض ملف volatile_info.txt](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_692@04-08-2026_16-20-00.jpg)

---

### الاستحواذ على أجهزة Linux

1. **هيكلية ملفات وسيط USB في Linux:**
   ![هيكلية ملفات USB في Linux](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_693@04-08-2026_16-20-00.jpg)

2. **التنفيذ وتهيئة بيئة النواة:**
   يتم تشغيل `RunForensics.sh` (مع إمكانية تهيئة بيئة النواة مسبقاً عبر `Linux_Setup.sh`):
   ![تنفيذ الاستحواذ في Linux](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_694@04-08-2026_16-20-00.jpg)

3. **هيكلية المخرجات والأدلة المحفوظة في Linux:**
   - مجلد القضية بالختم الزمني:
     ![عرض القضية في Linux](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_695@04-08-2026_16-20-00.jpg)
   - ملفات الأدلة الجنائية:
     ![الأدلة الجنائية في Linux](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_696@04-08-2026_16-20-00.jpg)

---

## المرحلة 1: خادم استقبال الأدلة وإدارتها (Phase 1)

![المرحلة الأولى - خادم الأدلة](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_697@06-08-2026_16-00-40.jpg)

### نظرة عامة والميزات الرئيسية
تُشكل المرحلة 1 الخادم المركزي عالي الأداء المخصص لاستقبال الأدلة المرفوعة عبر الشبكة من مختلف الأجهزة المستهدفة، والتحقق التلقائي من سلامتها وهيكلتها تمهيداً لنقلها للمرحلة 2:

1. **اكتشاف القرص الأسرع:** تحديد وسيط التخزين الأسرع بالجهاز المستهدف (NVMe / SSD) للكتابة المؤقتة وتقليل زمن التجميد.
2. **ضغط الأدلة أثناء الإرسال:** ضغط صور الذاكرة فورياً لتفادي استنزاف حزم قنوات الشبكة.
3. **التحقق الآلي من النزاهة (Integrity Check):** مقارنة قيمة الـ SHA-256 الأصلية بالبصمة المحسوبة فور اكتمال الاستلام بالخادم.
4. **خادم التخزين المؤقت لرموز Linux:** توفير مخزن مركزي لجداول ISF لتسريع عمليات التحليل اللاحقة.
5. **الكشف التلقائي عن معمارية النظام (32-bit / 64-bit):** توجيه حزم الأدوات المطابقة للبيئة الهدف تلقائياً.

### مخطط المعمارية وسير البيانات
![مخطط سير العمل للمرحلة الأولى](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_698@06-08-2026_16-00-40.jpg)

---

### الاستحواذ المباشر والنقل عبر الشبكة للخادم

1. **خدمة مراقبة الخادم واستقبال التدفقات:**
   تعمل خدمة المراقبة على الخادم للاستماع المستمر للحزم والملفات الواردة:
   ![سكربت مراقبة الخادم](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_699@06-08-2026_16-00-40.jpg)

2. **الاستحواذ والإرسال الشبكي من Windows:**
   ![استحواذ وإرسال Windows عبر الشبكة](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_700@06-08-2026_16-00-40.jpg)

3. **استلام الدليل وتأكيد سلامته على الخادم:**
   ![استلام الدليل على الخادم](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_701@06-08-2026_16-00-40.jpg)

4. **الاستحواذ والإرسال الشبكي من Linux:**
   ![استحواذ وإرسال Linux عبر الشبكة](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_702@06-08-2026_16-00-40.jpg)

5. **استلام دليل Linux وتوثيق البصمة على الخادم:**
   ![استلام دليل Linux على الخادم](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_703@06-08-2026_16-00-40.jpg)

6. **الهيكلية المنظمة للقضايا داخل الخادم:**
   ![تنظيم القضايا داخل الخادم](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_704@06-08-2026_16-00-40.jpg)

---

## المرحلة 2: التحليل الآلي المدعوم بالذكاء الاصطناعي (Phase 2)

![المرحلة الثانية - التحليل الآلي بالذكاء الاصطناعي](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_705@06-08-2026_22-53-38.jpg)

### نظرة عامة والابتكارات التقنية
تنطلق المرحلة 2 تلقائياً فور اكتمال رفع الدليل والتحقق منه. وتقوم بتشغيل منظومة إضافات Volatility 3 بالتوازي، ثم تحويل مخرجات التحليل الضخمة إلى صيغة **TOON** المبتكرة، وتوظيف نماذج الذكاء الاصطناعي لتوليد تقارير تنفيذية شاملة.

### مخطط خط معالجة التحليل
![مخطط تدفق التحليل للمرحلة الثانية](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_706@06-08-2026_22-53-38.jpg)

### ابتكار بروتوكول TOON وتقنية التقطيع (Prompt Chunking)
عند إرسال مخرجات Volatility الخام (التي تضم آلاف الأسطر من العمليات والاتصالات) بصيغة JSON التقليدية إلى نماذج الذكاء الاصطناعي، يتم استنزاف حدود السياق بسرعة وتتكبد تكاليف باهظة في الـ Tokens بسبب تكرار أسماء الحقول:

```json
[
  {"id": 1, "name": "Ali", "age": 25, "city": "Baghdad"},
  {"id": 2, "name": "Sara", "age": 30, "city": "Erbil"},
  {"id": 3, "name": "Omar", "age": 28, "city": "Basra"}
]
```

لحل هذه المعضلة، ابتكر المشروع صيغة **TOON (Token-Oriented Object Notation)** — وهي تمثيل مصفوفي يحدد المخطط في السطر الأول ويتبعه بالقيم:

```text
users[3]{id,name,age,city}:
1,Ali,25,Baghdad
2,Sara,30,Erbil
3,Omar,28,Basra
```

يحقق هذا التمثيل خفضاً في استهلاك الـ Tokens يتجاوز **60%**، وعند دمجه مع تقنية **التقطيع الذكي (Prompt Chunking)**، يتيح تحليل صور الذاكرة الضخمة عبر نماذج اللغة الكبيرة دون انقطاع أو تجاوز لحدود السياق.

---

### تنفيذ التحليل والمعالجة المتوازية للإضافات

1. **انطلاق محرك التحليل الذاتي (`auto_analyzer`):**
   ![بدء التحليل الآلي للقضايا](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_707@06-08-2026_22-53-38.jpg)

2. **التشغيل المتوازي للإضافات:**
   بدلاً من الانتظار التسلسلي المرهق، تُنفذ إضافات Volatility في مسارات تفرعية متوازية:
   ![التحليل التفرعي المتوازي](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_708@06-08-2026_22-53-38.jpg)

3. **استقبال البيانات وتقييم الذكاء الاصطناعي:**
   ![معالجة المخرجات](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_709@06-08-2026_22-53-38.jpg)

4. **اكتمال التحليل وتوليد التقرير النهائي:**
   ![اكتمال التحليل](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_710@06-08-2026_22-53-38.jpg)

---

### التقرير الجنائي التنفيذي (Executive HTML Report)

يصدر النظام تقريراً تفاعلياً مصمماً وفق أعلى المعايير الجنائية يوضح كافة النتائج:

- **الملخص التنفيذي وبيانات النظام:**
  ![التقرير التنفيذي - الصفحة 1](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_711@06-08-2026_22-53-38.jpg)
- **العمليات والأنشطة المشبوهة:**
  ![التقرير التنفيذي - الصفحة 2](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_712@06-08-2026_22-53-38.jpg)
- **عناوين الشبكة ومؤشرات التهديد (IOCs):**
  ![التقرير التنفيذي - الصفحة 3](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_713@06-08-2026_22-53-38.jpg)
- **تحليل الذاكرة المحقونة والـ Dumps:**
  ![التقرير التنفيذي - الصفحة 4](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_714@06-08-2026_22-53-38.jpg)

---

## المرحلة 3: المنصة المتكاملة وبيئات التحقيق الذكية (Phase 3)

![المرحلة الثالثة - منصة التحقيق المتكاملة](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_739@07-08-2026_19-36-29.jpg)

### نظرة عامة والميزات الأساسية
تُمثل المرحلة 3 قمة النضج الهندسي لمنصة DiGiPi — وهي بيئة ويب تعاونية متعددة المستخدمين تقدم إدارة للقضايا، والتحكم بالصلاحيات، ورسوماً بيانية تفاعلية، وطرفية مباشرة في المتصفح، ومساعد تحقيق ذكي يعمل بنظام **RAG** والاستدعاء الآلي للأدوات (**Tool Calling**).

---

### 1. لوحة التحكم المركزية (Dashboard)

توفر رؤية تشغيلية شاملة لكافة القضايا النشطة، وتخصيص المساحات، وحالة عقد الفحص:

![لوحة التحكم الرئيسية 1](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_740@07-08-2026_19-36-29.jpg)
![لوحة التحكم الرئيسية 2](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_741@07-08-2026_19-36-29.jpg)
![لوحة التحكم الرئيسية 3](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_742@07-08-2026_19-36-29.jpg)

---

### 2. إدارة واستعراض القضايا الجنائية (Case Management)

1. **مستودع وقائمة القضايا:**
   ![استعراض القضايا](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_743@07-08-2026_19-36-29.jpg)

2. **دراسة حالة واقعية: استغلال متصفح Yandex على Windows:**
   اختيار قضية نشطة تحقق في إصابة خفية تستغل خدمات تحديث المتصفح:
   ![تفاصيل قضية البرمجية الخبيثة](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_744@07-08-2026_19-36-29.jpg)

3. **اكتشاف استغلال عمليات `Svchost.exe`:**
   ![رصد العملية المشبوهة](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_745@07-08-2026_19-36-29.jpg)

4. **شجرة العمليات التفاعلية (Interactive Process Tree):**
   ![شجرة العمليات](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_746@07-08-2026_19-36-29.jpg)

5. **مخطط اتصالات الشبكة وتحديد المواقع الجغرافية:**
   ![اتصالات الشبكة المشبوهة](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_747@07-08-2026_19-36-29.jpg)

6. **مركز مؤشرات الاختراق (IOCs Hub):**
   كشف استغلال خدمة التحديث `yupdate-exec-y` وتشغيل حمولات Java الضارة:
   ![مؤشرات الاختراق IOCs](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_748@07-08-2026_19-36-29.jpg)
   ![تفاصيل مؤشرات الاختراق](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_749@07-08-2026_19-36-29.jpg)
   ![تحليل استغلال Yandex Update](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_750@07-08-2026_19-36-29.jpg)

7. **استعراض التقرير المولد من المرحلة 2 داخل المنصة:**
   ![عرض التقرير داخل المنصة](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_751@07-08-2026_19-36-29.jpg)

8. **مشاركة القضايا وتخصيص الصلاحيات بين فرق التحقيق:**
   ![مشاركة القضايا](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_752@07-08-2026_19-36-29.jpg)

9. **خيارات المعالجة المرنة (محلياً أو عبر خادم المنصة):**
   ![خيارات بيئة التحليل](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_753@07-08-2026_19-36-29.jpg)

10. **المساعد الآلي العام للمنصة:**
    ![المساعد الآلي للمنصة](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_754@07-08-2026_19-36-29.jpg)

---

### 3. بيئات التحقيق التفاعلية المخصصة (Investigation Environment)

تُخصص المنصة لكل محقق حاوية عمل معزولة ومجهزة بكافة الأدوات الجنائية:

![بيئة التحقيق التفاعلية المخصصة](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_755@07-08-2026_19-36-29.jpg)

#### أ. مشغل إضافات Volatility 3 التفاعلي
واجهة رسومية لتشغيل إضافات التحليل بنقرة واحدة ودون الحاجة لحفظ أوامر سطر الأوامر:
![مشغل إضافات التحليل](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_756@07-08-2026_19-36-29.jpg)

#### ب. استعراض نتائج المهام وفلترة البيانات
- فحص مخرجات إضافة `cmdline` مع أدوات فلترة نصية فورية:
  ![استعراض نتائج cmdline](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_757@07-08-2026_19-36-29.jpg)
- تصدير مجموعات البيانات لتدريب نماذج الذكاء الاصطناعي:
  ![تصدير النتائج](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_758@07-08-2026_19-36-29.jpg)
  ![خيارات التصدير المتقدمة](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_759@07-08-2026_19-36-29.jpg)
- الرسم البياني الهيكلي للعمليات (`psscan` / `pslist` TreeGraph):
  ![الرسم الهيكلي للعمليات](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_760@07-08-2026_19-36-29.jpg)

#### ج. متصفح ملفات البيئة المدمج
تصفح وتحميل ومقارنة الملفات الثنائية المستخرجة والتقارير التنفيذية:
![متصفح ملفات بيئة التحقيق](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_761@07-08-2026_19-36-29.jpg)

#### د. الطرفية التفاعلية المباشرة (Web Shell)
إتاحة سطر أوامر كامل للمحققين للتحقق اليدوي وتنفيذ سكربتات خاصة:
- واجهة الطرفية:
  ![الطرفية المباشرة في المتصفح](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_762@07-08-2026_19-36-29.jpg)
- اللصق التلقائي للأوامر من واجهة الإضافات إلى الطرفية:
  ![اللصق التلقائي للأوامر](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_763@07-08-2026_19-36-29.jpg)
- مخرجات التنفيذ الحية في الطرفية:
  ![مخرجات الطرفية](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_764@07-08-2026_19-36-29.jpg)

---

### 4. وكيل التحقيق الجنائي الذكي المستقل (AI Forensic Agent - Beta)

تتضمن بيئة العمل وكيلاً ذكياً متطوراً يمتلك وصولاً مباشراً لنظام الملفات وقادراً على تنفيذ العمليات الجنائية ذاتياً:

1. **المساعد الذكي داخل بيئة العمل:**
   ![المساعد الذكي للتحقيق](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_765@07-08-2026_19-36-29.jpg)

2. **الاستدعاء الذاتي للأدوات (Tool Calling / MCP):**
   ينفذ المساعد الإضافات ويفحص البصمات ويحلل مخرجات الذاكرة تلقائياً استجابةً لطلبات المحقق:
   ![استدعاء الأدوات بواسطة الذكاء الاصطناعي](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_766@07-08-2026_19-36-29.jpg)

3. **دعم مزودي الذكاء الاصطناعي المتعددين (Google Gemini, Ollama Cloud, Ollama Local):**
   ![خيارات مزودي الذكاء الاصطناعي](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_767@07-08-2026_19-36-29.jpg)

4. **الاستنتاج الجنائي واكتشاف العمليات المخفية:**
   مقارنة مخرجات `pslist` و `psscan` لكشف العمليات المفكوكة من القائمة (Unlinked Processes) بدقة:
   ![الاستنتاج الجنائي وكشف العمليات المخفية](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_768@07-08-2026_19-36-29.jpg)
   ![تحليل سلوك التهديد](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_769@07-08-2026_19-36-29.jpg)

5. **تفكيك وتحليل أوامر سطر الأوامر المشبوهة:**
   ![تحليل سطر الأوامر](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_770@07-08-2026_19-36-29.jpg)

6. **نظام استرجاع المعلومات الجنائي المعزز (Forensic RAG):**
   مطابقة الأدلة المكتشفة مع تكتيكات MITRE ATT&CK وقواعد Yara:
   ![نظام RAG الجنائي](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_771@07-08-2026_19-36-29.jpg)

---

### 5. الاستيراد والرفع المباشر للأدلة الجنائية (Direct Ingestion)

تتيح المنصة رفع وتدقيق صور الذاكرة الملتقطة مسبقاً عبر أدوات خارجية:

1. **اختيار ملف صورة الذاكرة المستهدفة:**
   ![اختيار ملف الذاكرة](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_772@07-08-2026_19-36-29.jpg)

2. **تحديد ملف التعريف ونمط التحليل:**
   ![تحديد نمط التحليل](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_773@07-08-2026_19-36-29.jpg)

3. **إطلاق خط المعالجة والتحليل الآلي:**
   ![بدء المعالجة الآلية](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_774@07-08-2026_19-36-29.jpg)

4. **اكتمال الإدراج وظهور القضية جاهزة للتحقيق:**
   ![اكتمال إدراج القضية](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_775@07-08-2026_19-36-29.jpg)

---

## خاتمة وخلاصة المشروع

يمثل مشروع **DiGiPi** نموذجاً هندسياً رائداً لسد الفجوة بين تعقيدات التحقيق الجنائي الرقمي في الذاكرة العشوائية وسرعة الاستجابة المطلوبة أثناء الحوادث السيبرانية؛ فمن خلال الجمع المتناغم بين:
- أدوات الاستحواذ الميداني المنفصلة (**المرحلة 0**)
- خوادم الاستقبال والتحقق من النزاهة التشفيرية (**المرحلة 1**)
- محركات التحليل الآلي المحسنة لصيغ ونماذج الذكاء الاصطناعي (**المرحلة 2**)
- منصة التحقيق التفاعلية المجهزة ببيئات العمل السحابية المعزولة ووكلاء الذكاء الاصطناعي بنظام RAG (**المرحلة 3**)

يبرهن المشروع كيف يمكن للتحقيق الجنائي الرقمي في الذاكرة أن ينتقل من العمل اليدوي البطيء إلى منظومة متقدمة ذات دقة عالية وسرعة فائقة.
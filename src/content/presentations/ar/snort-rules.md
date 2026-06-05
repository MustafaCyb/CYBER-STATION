---
title: "Understanding Snort Rules: تحليل وكتابة قواعد أجهزة رصد الاختراق"
description: "الغوص العميق في أوضاع عمل محرك Snort، بنية وتنسيق القواعد، فحص البيانات الثنائية، وكتابة تواقيع مخصصة لرصد هجمات حقن SQL وتحركات WannaCry."
locale: "ar"
itemSlug: "snort-rules"
category: "Cyber Station Lectures"
tags: ["قواعد-سنورت", "أنظمة-رصد-الاختراق", "التحقيق-الجنائي-للشبكات", "التواقيع-الرقمية", "رصد-أداة-sqlmap"]
sourceRepo: "https://github.com/MustafaCyb/Cyber_Station-Slides"
sourceFolder: "https://github.com/MustafaCyb/Cyber_Station-Slides/tree/main/Snort%20Rules"
cover: "images/presentations/snort-rules/cover.webp"
featured: false
order: 5
session: 5
---

## نظرة عامة على المحاضرة

تربط محاضرة **فهم قواعد Snort** بين التحقيق الجنائي للشبكات وأنظمة رصد ومنع الاختراقات (IDS/IPS). نقوم بتحليل أوضاع عمل محرك Snort، وتشريح بنيوية وهيدر القواعد وتعبيرات الخيارات، واستكشاف كلمات الفحص المتقدمة (`byte_test`, `isdataat`, `urilen`) وكتابة القواعد عملياً لرصد أدوات حقن SQL المؤتمتة وتحركات البرمجيات الخبيثة.

---

## تفاصيل عروض الشرائح

### الجزء 1: معمارية Snort وأوضاع التشغيل
*   **1. وضع التنصت (Sniffer Mode):** قراءة حزم البيانات الواردة على كرت الشبكة وعرضها مباشرة على الكونسول (الترويسات، البيانات، والطبقة الفيزيائية).
    `$ snort -v -d -e -i eth0`
*   **2. وضع تسجيل الحزم (Packet Logger Mode):** التقاط الحزم وكتابتها مباشرة على القرص وتصنيفها في مجلدات بناءً على عناوين الـ IP.
    `$ snort -dev -l ./log -h 192.168.1.0/24`
*   **3. وضع نظام كشف التسلل (NIDS Mode):** فحص حركة المرور مباشرة ومقارنتها بالقواعد المحملة لإطلاق تنبيهات، أو تسجيل أحداث، أو إسقاط الحزم (IPS).
    `$ snort -d -h 192.168.1.0/24 -l ./log -c snort.conf`

### الجزء 2: تشريح قواعد Snort
*   **رأس القاعدة (Rule Header):**
    *   **الإجراء (Action):** `alert` (تنبيه وتسجيل)، `log`، `pass`، `drop` (إسقاط ومنع في وضع IPS)، `reject`.
    *   **البروتوكول:** `tcp`، `udp`، `icmp`، `ip`.
    *   **الاتجاه:** أحادي الاتجاه `->` أو ثنائي الاتجاه `<>`.
    *   **العناوين والمنافذ:** دعم النفي (`!`)، ونطاق الشبكات CIDR، والمتغيرات البيئية مثل `$HOME_NET` و `$EXTERNAL_NET`.
*   **خيارات القاعدة (Rule Options):**
    *   **عام:** `msg` (رسالة التنبيه)، `sid` (معرف التوقيع الفريد)، `rev` (الإصدار)، `classtype` (تصنيف الهجوم).
    *   **الفحص (Detection):** `content` (مطابقة حزم البيانات النصية أو الهيكس)، `nocase` (تجاهل حالة الأحرف)، `depth` (عمق البحث)، `offset`، `distance`، `within`، و `pcre` (التعبيرات المنتظمة المعقدة).
    *   **الحالة والتدفق:** `flow` (تحديد اتجاه الجلسة وحالتها مثل established)، `flags` (فحص أعلام TCP مثل SYN)، و `dsize` (حجم البيانات).

### الجزء 3: دراسة حالة — قاعدة رصد ثغرة WannaCry MS17-010
*   **التوقيع البرمجي:**
    ```snort
    alert tcp $EXTERNAL_NET any -> $HOME_NET 445 (
      msg:"ET EXPLOIT MS17-010 WannaCry SMB"; 
      flow:to_server,established; 
      content:"|FF|SMB"; depth:5; 
      pcre:"/\x00Trans2/"; 
      metadata:cve 2017-0144; 
      classtype:attempted-admin; 
      sid:2024217; rev:5;
    )
    ```
*   **الضوابط المفتاحية:** يضمن خيار `flow` فحص الجلسات القائمة فقط لتفادي التنبيهات الكاذبة. يقوم `depth:5` بمطابقة حروف الـ SMB السحرية (`0xFFSMB`) في أول 5 بايتات، ويبحث تعبير `pcre` عن أمر `Trans2` المستخدم لاستغلال ثغرة EternalBlue.

### الجزء 4: الكلمات البرمجية المتقدمة وتواقيع البرمجيات الخبيثة
*   **`byte_test`:** استخراج عدد معين من البايتات وإجراء مقارنات رياضية عليها لتحديد التلاعب في ترويسات البروتوكولات.
*   **`isdataat`:** التحقق من وجود بيانات عند إزاحة معينة (تساعد في رصد فيضانات الذاكرة).
*   **`urilen`:** تحديد طول مسار الـ URI لرصد هجمات حقن SQL الطويلة وتخطي المسارات.
*   **تواقيع عائلات البرمجيات الخبيثة:**
    *   **Mirai:** مطابقة نصوص التخمين عبر Telnet + تفعيل مؤقت حد التنبيهات (Threshold).
    *   **Cobalt Strike:** فحص ترويسات بروفايل C2 ومطابقة مسارات طلبات البيكون (Beacons).
    *   **Dridex:** رصد سلوك خوارزميات توليد النطاقات (DGA) وتحديد أبعاد ترويسات POST.

### الجزء 5: مختبر رصد هجمات حقن SQL (SQL Injection)
*   **رصد اسم مستخدم أداة sqlmap:**
    `content:"User-Agent|3A|"; http_header; content:"sqlmap"; nocase; http_header;`
*   **رصد فحص الأرقام الوهمي للأداة (`?id=1234 AND 4321=4321`):**
    `pcre:"/?.*=\d{4,5}\s+(AND|OR)\s+\d{4,5}=\d{4,5}/i"; http_uri;`
*   **رصد منطق التخطي الشرطي (`OR 1=1`):**
    `pcre:"/(%27|')(\s|%20)*(OR|AND)(\s|%20)*\d*(\s|%20)*=(\s|%20)*\d*/i"; http_uri;`
*   **رصد استخراج البيانات بالدمج (UNION SELECT):**
    `content:"union"; nocase; http_uri; content:"select"; nocase; http_uri; distance:0;`
*   **رصد استكشاف الجداول (Schema Mapping):**
    `content:"information_schema"; nocase; http_uri;`
*   **رصد هجمات حقن SQL العمياء المعتمدة على الوقت (Time-Based Sleep):**
    `pcre:"/(%27|').*sleep(\s|%20)*\(/i"; http_uri;`

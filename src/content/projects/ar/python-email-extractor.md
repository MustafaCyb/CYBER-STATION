---
title: "Python Email Extractor"
description: "تطبيق سطح مكتب بواجهة رسومية مبني بـ customtkinter لاستخراج عناوين البريد الإلكتروني من عناوين URL مع زحف متعدد الخيوط وتوليد تقارير HTML."
locale: "ar"
itemSlug: "python-email-extractor"
repoName: "Python-Email-Extractor"
repo: "https://github.com/MustafaCyb/Python-Email-Extractor"
category: "OSINT"
status: "active"
tags: ["email", "osint", "scraping", "gui", "python"]
tech: ["Python", "customtkinter", "BeautifulSoup", "Threading"]
featured: false
order: 5
cover: "images/projects/python-email-extractor/cover.webp"
icon: "📧"
safety: "authorized-testing-only"
---

## نظرة عامة

برنامج **Python Email Extractor** هو تطبيق سطح مكتب ذو واجهة رسومية (GUI) متكاملة مخصصة لاستخراج عناوين البريد الإلكتروني من صفحات الويب المختلفة. تم بناء واجهته الحديثة باستخدام مكتبة customtkinter مما يمنحه مظهراً داكناً وجذاباً، كما يدعم تقنية الزحف متعدد الخيوط (Multi-threaded crawling) لتسريع عملية فحص عناوين URL والحصول على النتائج بأقصى سرعة ممكنة.

## الميزات

- **واجهة رسومية حديثة** — واجهة مستخدم مبنية باستخدام customtkinter ذات طابع داكن مميز.
- **زحف متعدد الخيوط** — معالجة متوازية لعناوين URL لسرعة وسلاسة الاستخدام.
- **استخراج بالتعبيرات المنتظمة (Regex)** — مطابقة دقيقة وقوية لأنماط البريد الإلكتروني المختلفة.
- **تصدير تقارير HTML** — توليد تقارير منسقة بصيغة HTML تحتوي على البريد الإلكتروني المستخرج.
- **إدخال عناوين URL** — إمكانية لصق رابط فردي أو استيراد قائمة كاملة من ملف خارجي.

## لقطة شاشة

يتميز التطبيق بواجهة نظيفة ومرتبة باللون الداكن مع حقول مخصصة لإدخال الروابط، ومؤشر لنسبة التقدم، بالإضافة إلى لوحة مخصصة لعرض النتائج وعناوين البريد الإلكتروني التي تم استخراجها بنجاح.

## التثبيت والتشغيل

لتحميل وتثبيت المشروع مباشرة من GitHub وتشغيله:

```bash
git clone https://github.com/MustafaCyb/Python-Email-Extractor.git
cd Python-Email-Extractor
pip install -r requirements.txt
python main.py
```

## الإصدار

الإصدار الحالي: **v1.0.0** (يناير 2025)


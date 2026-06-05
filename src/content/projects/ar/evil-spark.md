---
title: "Evil Spark"
description: "إثبات مفهوم لسلسلة هجوم USB HID باستخدام Digispark لأغراض تعليمية — يوضح برمجة Arduino بلغة C++ وإعداد خادم Apache ومراحل PowerShell."
locale: "ar"
itemSlug: "evil-spark"
repoName: "Evil-Spark"
repo: "https://github.com/MustafaCyb/Evil-Spark"
category: "الأمن الهجومي"
status: "active"
tags: ["hid-attack", "digispark", "usb", "red-team", "poc"]
tech: ["C++", "Arduino", "PowerShell", "Shell", "Apache"]
featured: false
order: 3
cover: "images/projects/evil-spark/cover.webp"
icon: "⚡"
safety: "educational-only"
---

## نظرة عامة

**Evil Spark** هو إثبات مفهوم تعليمي يوضح سلاسل هجوم USB HID باستخدام متحكم Digispark الدقيق.

## ⚠️ إخلاء مسؤولية تعليمي

> **هذا المشروع مخصص بشكل صارم للأغراض التعليمية واختبار الأمان المصرح به فقط.** الاستخدام غير المصرح به لأدوات هجوم HID ضد أنظمة لا تملكها أو ليس لديك إذن لاختبارها هو غير قانوني وغير أخلاقي.

## سلسلة الهجوم

1. **كود Digispark** — حمولة HID تكتب الأوامر بسرعة الآلة
2. **إعداد خادم Apache** — يقدم الحمولة الثانوية للتحميل
3. **مرحلة PowerShell** — تنفذ الحمولة النهائية على جهاز الهدف

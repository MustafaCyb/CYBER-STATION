---
title: "TwinSanity Recon"
description: "منصة استطلاع ويب مدعومة بالذكاء الاصطناعي مع تعداد نطاقات فرعية متعددة المصادر، واكتشاف الثغرات عبر Nuclei، وتحليل ذكي باستخدام Gemini وOpenAI وOllama."
locale: "ar"
itemSlug: "twinsanity-recon"
repoName: "TwinSanity-Recon"
repo: "https://github.com/MustafaCyb/TwinSanity-Recon"
category: "الأمن الهجومي"
status: "active"
tags: ["recon", "ai", "web-security", "nuclei", "osint"]
tech: ["Python", "Flask", "WebSocket", "Nuclei", "LLM", "Docker"]
featured: true
order: 1
cover: "images/projects/twinsanity-recon/cover.webp"
icon: "🔍"
safety: "authorized-testing-only"
---

## نظرة عامة

**TwinSanity Recon** هي منصة استطلاع ويب مدعومة بالذكاء الاصطناعي مصممة خصيصاً لمحترفي الأمن السيبراني. تجمع المنصة بين تعداد النطاقات الفرعية متعددة المصادر والتحليل الذكي للثغرات البرمجية باستخدام نماذج اللغة الكبيرة (LLMs).

## الميزات الرئيسية

- **تعداد نطاقات فرعية متعدد المصادر** — يجمع النتائج من crt.sh و SecurityTrails و VirusTotal وغيرها.
- **اكتشاف CVE** — يتكامل مع أداة Nuclei من ProjectDiscovery للفحص الآلي للثغرات الأمنية.
- **تحليل مدعوم بالذكاء الاصطناعي** — يستفيد من نماذج Gemini و OpenAI و Ollama للحصول على رؤى أمنية ذكية وتوصيات دقيقة.
- **لوحة تحكم في الوقت الفعلي** — واجهة مستخدم مدعومة بتقنية WebSocket لتتبع تقدم الفحص وعرض النتائج مباشرة.
- **التحكم في الوصول (RBAC)** — دعم متعدد المستخدمين مع صلاحيات وصول دقيقة ومحددة.
- **التصدير والتقارير** — توليد تقارير شاملة ومفصلة بصيغ PDF و JSON.

## البنية البرمجية (Architecture)

تعتمد المنصة على واجهة خلفية مبنية بلغة Python باستخدام إطار Flask مع قنوات اتصال عبر WebSocket لتحديث البيانات الفورية. يتم معالجة مهام الفحص بشكل غير متزامن، ويتم بث النتائج إلى لوحة التحكم فور ورودها. يعمل تحليل نماذج اللغة (LLM) بالتوازي لتقديم توصيات أمنية سياقية ومخصصة.

## الاستخدام

> ⚠️ **للاختبار المصرح به فقط** — هذه الأداة مخصصة للاستخدام فقط على الأنظمة التي تملكها أو لديك إذن كتابي صريح لاختبارها.

```bash
git clone https://github.com/MustafaCyb/TwinSanity-Recon.git
cd TwinSanity-Recon
pip install -r requirements.txt
python app.py
```


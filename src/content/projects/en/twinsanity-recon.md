---
title: "TwinSanity Recon"
description: "AI-powered web reconnaissance platform with multi-source subdomain enumeration, CVE detection via Nuclei, and real-time analysis using Gemini, OpenAI, and Ollama LLMs."
locale: "en"
itemSlug: "twinsanity-recon"
repoName: "TwinSanity-Recon"
repo: "https://github.com/MustafaCyb/TwinSanity-Recon"
category: "Offensive Security"
status: "active"
tags: ["recon", "ai", "web-security", "nuclei", "osint"]
tech: ["Python", "Flask", "WebSocket", "Nuclei", "LLM", "Docker"]
featured: true
order: 1
cover: "images/projects/twinsanity-recon/cover.webp"
icon: "🔍"
safety: "authorized-testing-only"
---

## Overview

**TwinSanity Recon** is an AI-powered web reconnaissance platform designed for security professionals. It combines multi-source subdomain enumeration with intelligent vulnerability analysis using large language models.

## Key Features

- **Multi-Source Subdomain Enumeration** — aggregates results from crt.sh, SecurityTrails, VirusTotal, and more
- **CVE Detection** — integrates with ProjectDiscovery Nuclei for automated vulnerability scanning
- **AI-Powered Analysis** — leverages Gemini, OpenAI, and Ollama for intelligent security insights
- **Real-Time Dashboard** — WebSocket-driven UI for live scan progress and results
- **Role-Based Access Control** — multi-user support with granular permissions
- **Export & Reporting** — generate comprehensive PDF/JSON reports

## Architecture

The platform uses a Flask backend with WebSocket communication for real-time updates. Scan tasks are processed asynchronously, with results streamed to the dashboard as they arrive. LLM analysis runs in parallel, providing contextual security recommendations.

## Usage

> ⚠️ **Authorized Testing Only** — This tool is intended for use only on systems you own or have explicit written permission to test.

```bash
git clone https://github.com/MustafaCyb/TwinSanity-Recon.git
cd TwinSanity-Recon
pip install -r requirements.txt
python app.py
```

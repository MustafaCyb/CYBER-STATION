---
title: "TwinSanity Recon Platform Architecture"
description: "Exploring the backend and frontend architecture of TwinSanity Recon — an AI-powered subdomain enumeration, CVE mapping, and local LLM threat analysis platform."
locale: "en"
itemSlug: "twinsanity-recon-talk"
category: "Cyber Station Lectures"
tags: ["reconnaissance", "osint-automation", "llm-analysis", "nuclei-scanning", "python-flask"]
sourceRepo: "https://github.com/MustafaCyb/TwinSanity-Recon"
sourceFolder: "https://github.com/MustafaCyb/TwinSanity-Recon"
cover: "images/presentations/twinsanity-recon-talk/cover.webp"
featured: false
order: 7
session: 7
---

## Lecture Overview

**TwinSanity Recon Platform Architecture** details the modular design of a modern reconnaissance platform. We explore subdomain enumeration techniques from 10+ passive sources, asynchronous DNS resolution, CVE mapping, Shodan API integrations, and the orchestration of multiple LLM providers (including local Ollama) for report generation.

---

## Detailed Slide Outline

### Part 1: Platform Overview
*   **What is TwinSanity Recon?** A comprehensive web-based reconnaissance and vulnerability assessment platform combining OSINT automation with LLM-powered security analysis.
*   **Target Audience:** Penetration testers, bug bounty hunters, and enterprise teams managing large external domains.
*   **Core Metrics:** Python 3.10+, 10+ subdomain engines, 5+ LLM cloud integrations, local AI support, and a Flask-based WebSocket dashboard.

### Part 2: Reconnaissance Capabilities
*   **Subdomain Enumeration:** Passive collection aggregating data from `crt.sh`, `SecurityTrails`, `VirusTotal`, `Chaos`, `HackerTarget`, and `AlienVault OTX`.
*   **Asynchronous DNS Resolution:** Multi-record lookups (A, AAAA, CNAME, MX, NS, TXT) executed concurrently.
*   **HTTP Probing:** Port scanning with banner grabbing and header technology fingerprinting.
*   **Vulnerability Mapping:** Extracting endpoints from Wayback Machine/CommonCrawl and running CVE mappings against the NIST NVD API database.

### Part 3: AI-Powered Analysis Engine
*   **Multi-LLM Orchestration:** Integrations with cloud APIs (GPT, Claude, Gemini) configured via `config.yaml`.
*   **Local AI Integration:** Automatic detection and integration of local models running via **Ollama**, ensuring complete scanning privacy without sending target data to the cloud.
*   **What AI Analyzes:** Interpreting raw scan outputs, assigning custom threat risk scores, linking vulnerabilities to NIST references, and generating remediation advice.
*   **Interactive AI Chat:** A live assistant to query findings and brainstorm exploitation or patching paths.

### Part 4: Web Dashboard Architecture
*   **WebSocket Live Updates:** Server-sent events streaming real-time subdomain updates directly to the web dashboard.
*   **Integrated Tools:**
    *   **Shodan Explorer:** Live API querying for exposed corporate assets and ports.
    *   **CVE Database browser:** Accessing NIST CVE references by keyword or severity.
    *   **TwinSanity Island:** Interactive visualization showing target relationships and host states.

### Part 5: Deployment & Quick Start
*   **Quick Start Flow:**
    ```bash
    git clone https://github.com/MustafaCyb/TwinSanity-Recon.git
    cd TwinSanity-Recon
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    python run_dashboard.py
    ```
*   **Configuring `config.yaml`:** Setting API keys, enabling specific passive search engines, and defining LLM temperature profiles.

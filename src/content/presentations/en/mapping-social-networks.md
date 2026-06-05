---
title: "Mapping & Exploiting Social Networks as Attack Surfaces"
description: "A comprehensive analysis of social engineering tactics, OSINT reconnaissance (Maltego, SpiderFoot, Shodan), weaponization and delivery pathways, dynamic Adversary-in-the-Middle (AiTM) phishing labs using Evilginx, and corporate mitigations."
locale: "en"
itemSlug: "mapping-social-networks"
category: "Cyber Station Lectures"
tags: ["osint", "social-engineering", "attack-surface", "evilginx", "maltego", "shodan"]
sourceRepo: "https://github.com/MustafaCyb/Cyber_Station-Slides"
sourceFolder: "https://github.com/MustafaCyb/Cyber_Station-Slides/tree/main/Mapping%20and%20Exploiting%20Social%20Networks"
cover: "images/presentations/mapping-social-networks/cover.png"
featured: false
order: 4
session: 4
---

## Lecture Overview

**Mapping & Exploiting Social Networks as Attack Surfaces** dissects the lifecycle of modern social engineering campaigns. We cover reconnaissance frameworks (OSINT), information mapping, technical delivery channels (look-alike domains, ESP abuse), the progression from static to dynamic phishing, followed by a **hands-on Adversary-in-the-Middle (AiTM) Evilginx lab** to simulate MFA bypass, and conclude with enterprise-grade defenses.

---

## Detailed Slide Outline

### Part 1: The Social Engineering Lifecycle
*   **Stage 1: Information Gathering (OSINT):** Harvesting emails, phone numbers, online footprints, and leaked credentials.
*   **Stage 2: Attack Strategy Development:** Profiling target interests to craft pretexts and establishing trust vectors.
*   **Stage 3: Weaponization & Delivery:** Creating malicious document payloads, fake landing portals, and setting up outbound mail relays.
*   **Stage 4: Execution & Impact:** Launching the attack to steal tokens, deploy malware, or execute financial transactions.
*   **Stage 5: Mitigations:** Detecting intrusions and isolating affected nodes.

### Part 2: Advanced OSINT & Automated Reconnaissance
*   **Maltego:** A graphical link analysis tool that transforms isolated data points (IPs, emails, names) into relational graphs. Custom transforms are written in Python using Maltego TRX.
*   **SpiderFoot:** Automated OSINT recon querying 200+ open-source APIs to map out subdomains, public repositories, and leaked data.
*   **Shodan:** Internet-of-Things search engine. Attackers map external-facing ports and vulnerable device versions (like unsecured IP office cameras) to establish highly credible pretexts for support calls.
*   **TwinSanity-Recon:** Automated framework aggregating passive subdomain sources, resolving DNS records, probing HTTP services, and performing automated CVE scanning via Nuclei.

### Part 3: Phishing Infrastructures & Delivery
*   **Delivery Channels:** Real-world attackers evade spam filters by abusing compromised business emails, exploiting ESP (Email Service Providers) free tiers, building look-alike typo-squatted domains, or using underground bulletproof SMTP servers.
*   **Static Phishing:** Cloned login pages (e.g., Gophish campaigns) hosted on attacker servers. They capture credentials but cannot bypass Multi-Factor Authentication.
*   **Dynamic Phishing:** Adversary-in-the-Middle reverse proxies (Evilginx, Modlishka) that proxy live traffic to intercept session authentication cookies and OTPs in real-time.

### Part 4: Hands-on Dynamic Phishing Lab (Evilginx)
*   **Evilginx Framework:** A Go-based Adversary-in-the-Middle (AiTM) reverse proxy that captures credentials and session cookies in real-time, bypassing 2FA.
*   **Compilation and Local Setup:**
    ```bash
    git clone https://github.com/kgretzky/evilginx2.git
    cd evilginx2
    make
    sudo ./build/evilginx -p ./phishlets
    ```
*   **Local Domain Mapping:** Configuring the hosts file (`C:\Windows\System32\drivers\etc\hosts` or `/etc/hosts`) to map test subdomains (e.g., `login.lab.local`).
*   **Trusting Certificates:** Installing the generated Evilginx root CA certificate in the browser to bypass SSL warnings.
*   **CLI Workflow & Configuration:**
    *   `phishlets hostname Microsoft login.yourdomain.com`: Bind domain names.
    *   `phishlets enable outlook`: Enable Reverse Proxy.
    *   `lures create outlook`: Generate phishing links.
    *   `sessions`: List captured credentials, tokens, and active cookies.
*   **Session Hijacking Bypass:** Exporting captured cookie JSON from Evilginx and importing them into the attacker's browser using extensions like **EditThisCookie** to bypass MFA and hijack active sessions.

### Part 5: Real-World Case Studies
*   **Target Data Breach (2013):** Credential theft from a third-party HVAC vendor led to lateral movement and massive database exfiltration.
*   **Bangladesh Bank Heist (2016):** Attackers utilized targeted spear phishing to deploy custom malware, intercepting SWIFT credentials to request $951M in fraudulent transactions.
*   **Colonial Pipeline (2021):** Compromised legacy VPN account without MFA enabled allowed entry for ransomware deployment.

### Part 6: Corporate Mitigations & Controls
*   **SPF/DKIM/DMARC:** Valimail or MXToolbox to enforce strict domain validation and prevent spoofing.
*   **Phishing-Resistant MFA:** Hardware security keys (FIDO2/WebAuthn) to prevent proxy intercepts.
*   **Email Gateway Sandboxing:** SpamTitan or Proxmox Mail Gateway to detonate attachments and rewrite suspect URLs.
*   **EDR Solutions:** Wazuh or CrowdStrike to monitor process memory for beacons and loader activities.
*   **Domain Monitoring:** CertPing or DNSTwist to capture typo-squatted setups.
*   **Immutable Backups:** Veeam or Restic to store air-gapped backups to recover from ransomware.

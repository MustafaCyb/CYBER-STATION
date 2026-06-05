---
title: "Understanding Snort Rules: IDS/IPS Logic"
description: "A deep dive into Snort engine modes, rule structure and syntax, binary protocols inspection, and writing custom signatures for SQL injection and WannaCry lateral movement."
locale: "en"
itemSlug: "snort-rules"
category: "Cyber Station Lectures"
tags: ["snort-rules", "ids-ips", "network-forensics", "pcre-signatures", "sqlmap-detection"]
sourceRepo: "https://github.com/MustafaCyb/Cyber_Station-Slides"
sourceFolder: "https://github.com/MustafaCyb/Cyber_Station-Slides/tree/main/Snort%20Rules"
cover: "images/presentations/snort-rules/cover.webp"
featured: false
order: 5
session: 5
---

## Lecture Overview

**Understanding Snort Rules** bridges network forensics and intrusion detection systems (IDS/IPS). We analyze Snort operating modes, dissect rule headers and options, explore advanced protocol testing keywords (`byte_test`, `isdataat`, `urilen`), and write rules to block automated SQL injection tools and malware lateral movement.

---

## Detailed Slide Outline

### Part 1: Snort Architecture & Operating Modes
*   **1. Sniffer Mode (`snort -v -d -e -i eth0`):** Reads IP packets off the network interface and streams headers, payloads, and link-layer data directly to the console.
*   **2. Packet Logger Mode (`snort -dev -l ./log -h 192.168.1.0/24`):** Captures packets and writes them directly to disk, organized in directories by IP.
*   **3. NIDS/NIPS Mode (`snort -d -h 192.168.1.0/24 -l ./log -c snort.conf`):** Analyzes network traffic in real-time against loaded rules to trigger alerts, log events, or drop packets.

### Part 2: Anatomy of a Snort Rule
*   **Rule Header:**
    *   **Action:** `alert`, `log`, `pass`, `drop` (inline IPS), `reject`, `sdrop`.
    *   **Protocol:** `tcp`, `udp`, `icmp`, `ip`.
    *   **Direction:** `->` (Unidirectional) or `<>` (Bidirectional).
    *   **IPs & Ports:** Supports negation (`!`), CIDR blocks, lists, and config variables (`$HOME_NET`, `$EXTERNAL_NET`).
*   **Rule Options:**
    *   **General:** `msg` (label), `sid` (ID), `rev` (version), `classtype` (category), `reference`.
    *   **Detection:** `content` (hex or plain text payload match), `nocase`, `depth`, `offset`, `distance`, `within`, `pcre` (regex evaluation).
    *   **State:** `flow` (established session state), `flags` (TCP flags like SYN), `dsize` (payload byte count).
    *   **Threshold:** Rate-limiting alarms to prevent flooding.

### Part 3: Case Study — WannaCry MS17-010 Exploit Rule
*   **The Signature:**
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
*   **Key Controls:** Flow ensures only active sessions are evaluated. `depth:5` checks for `\xFFSMB` magic bytes immediately. PCRE identifies the `Trans2` sub-command bytes utilized by the EternalBlue exploit.

### Part 4: Advanced Keywords & Malware Mapping
*   **`byte_test`:** Extracts N binary bytes and performs logical operations (e.g. `byte_test:4,>,0x1000,0,relative;`).
*   **`isdataat`:** Checks if payload exists at offset (helps find buffer overflow size anomalies).
*   **`urilen`:** Compares URI length to detect long query payloads.
*   **Malware Mapping:**
    *   **Mirai:** Telnet brute force string matching + threshold limits.
    *   **Cobalt Strike:** Malleable C2 HTTP headers and beacon URI checks.
    *   **Dridex:** DGA domain detection and HTTPS POST payload parsing.

### Part 5: Practical SQL Injection Detection Lab
*   **Detecting sqlmap User-Agent:**
    `content:"User-Agent|3A|"; http_header; content:"sqlmap"; nocase; http_header;`
*   **Detecting sqlmap Dummy Integer Test (`?id=1234 AND 4321=4321`):**
    `pcre:"/?.*=\d{4,5}\s+(AND|OR)\s+\d{4,5}=\d{4,5}/i"; http_uri;`
*   **Detecting Boolean Logic Bypass (`OR 1=1`):**
    `pcre:"/(%27|')(\s|%20)*(OR|AND)(\s|%20)*\d*(\s|%20)*=(\s|%20)*\d*/i"; http_uri;`
*   **Detecting UNION SELECT Exfiltration:**
    `content:"union"; nocase; http_uri; content:"select"; nocase; http_uri; distance:0;`
*   **Detecting Schema Mapping:**
    `content:"information_schema"; nocase; http_uri;`
*   **Detecting Time-based sleep queries:**
    `pcre:"/(%27|').*sleep(\s|%20)*\(/i"; http_uri;`

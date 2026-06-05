---
title: "The Anatomy of EternalBlue Exploit"
description: "A deep dive into MS17-010 (CVE-2017-0144) — analyzing SMBv1 protocols, kernel pool grooming mechanics, DoublePulsar payload delivery, and network detection signatures."
locale: "en"
itemSlug: "eternalblue-anatomy"
category: "Cyber Station Lectures"
tags: ["eternalblue", "ms17-010", "smb-exploit", "kernel-pool-grooming", "doublepulsar"]
sourceRepo: "https://github.com/MustafaCyb/Cyber_Station-Slides"
sourceFolder: "https://github.com/MustafaCyb/Cyber_Station-Slides/tree/main/The%20Anatomy%20of%20EternalBlue"
cover: "images/presentations/eternalblue-anatomy/cover.png"
featured: true
order: 8
session: 8
---

## Lecture Overview

**The Anatomy of EternalBlue** dissects one of the most critical and impactful exploits in history. We analyze the legacy SMBv1 protocol flaws, trace how size parameter mismatches lead to out-of-bounds writes in the Windows Large Non-Paged Pool, outline the "Pool Grooming" technique, analyze the **DoublePulsar** kernel backdoor, and implement network detection rules.

---

## Detailed Slide Outline

### Part 1: History and Global Impact
*   **MS17-010 (CVE-2017-0144):** A critical remote code execution (RCE) vulnerability in Microsoft's SMBv1 protocol.
*   **The Shadow Brokers Leak (April 2017):** Disclosed a suite of NSA hacking tools, including EternalBlue.
*   **Global Outbreaks:** Within weeks, EternalBlue was integrated into global worms:
    *   **WannaCry Ransomware:** Shipped with a propagation module that encrypted hundreds of thousands of systems in hospitals, transport, and telecom globally.
    *   **NotPetya wiper:** Targeted financial institutions and shipping systems (e.g., Maersk), causing billions of dollars in damage.

### Part 2: SMBv1 Protocol Mechanics
*   **The Vulnerable Protocol:** SMBv1 (Server Message Block version 1) is a legacy file-sharing protocol running over port 445.
*   **Transaction Commands:** SMBv1 processes complex requests using:
    *   `SMB_COM_TRANSACTION2` (Trans2): Used to query directory information.
    *   `SMB_COM_NT_TRANSACT` (NT Transact): Used to set security attributes or handle large data structures.
*   **The Flaw:** When an attacker sends custom-crafted parameters, the server mishandles size calculations, leading to a type conversion mismatch.

### Part 3: Heap Overflow & Pool Grooming
*   **Mathematical Size Mismatch:**
    *   The server allocates a buffer based on an unsigned 16-bit integer parameter.
    *   When copying data, it interprets the size as a signed 32-bit integer, resulting in a large memory copy that overflows the boundary.
*   **Windows Non-Paged Pool:** The overflow targets the Windows Large Non-Paged Pool (kernel memory space that remains in physical RAM).
*   **Pool Grooming:** Because kernel memory layout is unpredictable, the exploit sends a series of dummy packets to organize the heap structure. By allocating and freeing specific blocks, the exploit creates an empty space immediately preceding the target block, ensuring the out-of-bounds write overwrites the designated function pointers.

### Part 4: DoublePulsar Backdoor Injection
*   **Payload Delivery:** Once memory is corrupted, the exploit executes the **DoublePulsar** payload.
*   **The Kernel Backdoor:** DoublePulsar installs itself as a Ring 0 driver hook (backdoor) in memory without writing any files to disk.
*   **Capabilities:**
    *   Intercepts incoming network requests on port 445.
    *   Validates custom "ping" packets (special Multiplex ID: `65` or similar).
    *   Injects arbitrary DLLs directly into user-mode processes (like `lsass.exe`) from the kernel space, allowing complete stealth.

### Part 5: Network Detection & Remediation
*   **Snort Rules:**
    `alert tcp $EXTERNAL_NET any -> $HOME_NET 445 (msg:"SMB Trans2 Request Overflow Attempt"; flow:to_server,established; content:"|FF|SMB"; depth:5; pcre:"/\x00Trans2/"; sid:2024217;)`
*   **Remediation Policies:**
    1.  **Disable SMBv1:** Disable the legacy feature globally via Group Policy or PowerShell (`Disable-WindowsOptionalFeature`).
    2.  **Apply MS17-010 Patch:** Install security updates immediately.
    3.  **Boundary Blocks:** Block inbound and outbound TCP port 445 at firewall borders.
    4.  **Network Segmentation:** Isolate legacy systems into air-gapped VLANs.

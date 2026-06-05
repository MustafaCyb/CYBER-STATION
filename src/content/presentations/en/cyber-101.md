---
title: "CYBER-101: Foundational Cybersecurity"
description: "An extensive introduction to cybersecurity basics, operating system internals (Windows vs. Linux), networking protocols, programming, and core security domains."
locale: "en"
itemSlug: "cyber-101"
category: "Cyber Station Lectures"
tags: ["cybersecurity-basics", "operating-systems", "networking", "linux-cli", "bash-scripting"]
sourceRepo: "https://github.com/MustafaCyb/Cyber_Station-Slides"
sourceFolder: "https://github.com/MustafaCyb/Cyber_Station-Slides/tree/main/CYBER-101"
cover: "images/presentations/cyber-101/cover.webp"
featured: true
order: 1
session: 1
---

## Lecture Overview

**CYBER-101** is the foundational gateway lecture for Cyber Station, introducing core computer science concepts, operating systems, networking architecture, script automation, and the basic threat taxonomy.

---

## Detailed Slide Outline

### Part 1: Security Principles & Terminology
*   **Introduction to Cybersecurity:** Unifying People, Processes, and Technology to protect critical systems.
*   **The CIA Triad:**
    *   **Confidentiality:** Encryption, Multi-Factor Authentication.
    *   **Integrity:** Hashing, strict file permissions.
    *   **Availability:** Data backups, DDoS mitigation.
*   **Core Definitions:**
    *   **Asset:** The "Gold" (data, server, reputation).
    *   **Vulnerability:** The "Open Window" (coding bug, misconfigured service).
    *   **Threat:** The "Burglar" (malicious actor, bot).
    *   **Risk:** The "Break-in" (probability of threat exploiting vulnerability).
    *   **Exploit:** The "Crowbar" (code or technique to execute the attack).
*   **The Security Balance:** Security is a constant trade-off between protection and usability.

### Part 2: Language of Hardware & Operating Systems
*   **Language of Hardware:** Binary representation (CPU registers and RAM) vs. human-readable Hex Dumps for malware analysis.
*   **Windows vs. Linux Architecture:**
    *   **Windows:** Closed source, Registry database, NTFS file system, Access Control Lists (ACLs), CMD/PowerShell.
    *   **Linux:** Open source, "Everything is a file" philosophy, ext4 file system, owner/group/other permissions (`rwx`), Bash shell.
*   **Process & Thread Management:** Processes (independent memory spaces) vs. Threads (concurrency paths sharing process resources).
*   **CPU Privilege Rings:** Ring 0 (Kernel mode, full hardware control) vs. Ring 3 (User mode, restricted sandbox for applications).

### Part 3: Hands-on Linux CLI & Scripting
*   **Core Commands:** `ls`, `pwd`, `cd`, `man`, `mkdir`, `cp`, `mv`, `rm`, `touch`, `grep`, `cat`, `chmod`, `echo`.
*   **The Pipe Operator (`|`):** Piping standard output of one command to the input of another.
*   **Bash Automation:** Writing scripts starting with the Shebang (`#!/bin/bash`) to run cron-scheduled system audits (disk space, active users).

### Part 4: Programming & Network Scanning
*   **Compiled (C++) vs. Interpreted (Python) Languages:** Syntax structures, runtime speed, memory safety, and platform portability.
*   **Python Socket Programming:** Building a basic TCP Port Scanner (`connect_ex`) to query services.

### Part 5: Networking Architecture & Attacks
*   **Network Types:** LAN, WAN, MAN.
*   **Protocols:** IP (Layer 3), TCP (Layer 4, connection-oriented, reliability), UDP (Layer 4, connectionless, low overhead), HTTP (Layer 7).
*   **TCP Handshake:** The 3-way synchronization process: `SYN` $\rightarrow$ `SYN-ACK` $\rightarrow$ `ACK`.
*   **Hardware Devices:** Hubs, Switches (Layer 2 MAC routing), Routers (Layer 3 IP routing), Firewalls.
*   **The OSI Model:** Review of the 7 layers of network communication.
*   **IP vs. MAC Addressing:** Local physical routing (MAC) vs. Global logical routing (IP, ARP resolution).
*   **Network Attacks:**
    *   **Man-in-the-Middle (MitM):** Intercepting traffic.
    *   **ARP Spoofing:** Forging ARP replies to hijack the local gateway.
    *   **SYN Flood:** DoS via half-open TCP handshakes.
    *   **DNS Poisoning:** Cache poisoning to redirect web traffic.

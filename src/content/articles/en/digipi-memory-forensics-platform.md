---
itemSlug: "digipi-memory-forensics-platform"
title: "DiGiPi Project: Comprehensive RAM Memory Forensics Platform via Raspberry Pi & AI"
description: "An in-depth technical walkthrough of the DiGiPi platform for memory forensics (DFIR), spanning offline field acquisition, server-side ingestion, automated AI-driven analysis with Volatility 3, and an interactive investigation workspace."
date: 2026-08-08
locale: "en"
tags: ["dfir", "memory-forensics", "volatility", "linux", "windows", "raspberry-pi", "ai"]
cover: "/images/articles/digipi-memory-forensics-platform/cover.jpg"
---

## Project Introduction

Digital Forensics and Incident Response (**DFIR**) represents a cornerstone of modern cybersecurity engineering. It empowers security operations and threat hunting teams to reconstruct how security breaches occurred, dissect adversary mechanics, and acquire pristine digital evidence left behind in the aftermath of an attack to establish attribution or remediate vulnerabilities.

Digital artifacts exist across multiple distinct tiers:
1. **Disk-level Evidence (Disk Forensics):** Recovering deleted files, carving unstructured blocks, analyzing file systems, and parsing event logs.
2. **Network-level Evidence (Network Forensics):** Inspecting packet captures (PCAP), reconstructing protocol sessions, and detecting malicious command-and-control (C2) traffic.
3. **Volatile Memory Evidence (Memory Forensics):** Extracting live, point-in-time runtime state from **RAM** — identifying fileless malware, reflective DLL injection, active network sockets, decrypted cryptographic keys, and uncommitted adversary commands.

The **DiGiPi (Digital Forensics via Raspberry Pi)** project operates primarily within the domain of **Memory Forensics**. This discipline is notoriously the most sensitive and complex due to the strictly volatile nature of physical RAM; every second of delay risks evidence corruption via paging or overwrite, and in the worst-case scenario, an unexpected system shutdown wipes all volatile evidence irrevocably.

---

## Project Roadmap and Phase Architecture

**DiGiPi** was designed and engineered across four cohesive, modular phases, where each phase serves as an autonomous subsystem while feeding seamlessly into the next:

![DiGiPi Project Roadmap & Planning Matrix](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_684@04-08-2026_16-20-00.jpg)

| Phase | Designation | Core Role & Engineering Scope |
| :--- | :--- | :--- |
| **Phase 0** | **Offline Field Acquisition (USB-based)** | Standalone, air-gapped acquisition toolkit to capture RAM and volatile artifacts on-site via scripted USB media without requiring network connectivity. |
| **Phase 1** | **Evidence Ingestion & Server Management** | Centralized server environment that receives memory images over the network, computes integrity hashes, organizes cases, and pre-processes artifacts. |
| **Phase 2** | **Automated AI-Driven Memory Analysis** | Automated analysis pipeline powered by Volatility 3, utilizing custom TOON token-compression formatting and LLM synthesis to generate executive HTML forensic reports. |
| **Phase 3** | **Comprehensive Investigation Platform** | Full-scale collaborative web workspace providing isolated analyst sandboxes, integrated CLI terminal, process tree visualizers, and an AI copilot with RAG and autonomous tool calling. |

---

## Technical Foundations: Operating System Memory Architecture

![Technical Foundations and Memory Architecture](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_735@08-08-2026_01-39-59.jpg)

Before diving into platform mechanics, understanding how underlying operating systems manage memory — and how that structure is exploited forensically — is vital.

### 1. Windows Memory Management

Windows processes execute within private **Virtual Address Spaces (VAS)** mapped across physical RAM and disk pages. Each process contains executable code, mapped DLLs, thread stacks, and heap allocations. These allocations hold volatile evidence that reveals malware behavior at the exact millisecond of execution.

![Windows Memory Management Architecture](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_736@08-08-2026_01-39-59.jpg)

Beyond physical RAM, Windows offloads memory pages to persistent disk structures:

| Disk Artifact | Technical Mechanism | Forensic Value & Investigative Role |
| :--- | :--- | :--- |
| **Pagefile.sys** | Paging file acting as an extension to physical RAM; Windows swaps idle or low-priority memory pages from RAM to disk. | Contains residual process memory fragments, decrypted strings, and network session buffers long after processes terminate. |
| **Swapfile.sys** | Specialized swap file used primarily for Modern Universal Windows Platform (UWP) app suspension. | Holds suspended application state and cached memory chunks from modern Windows services. |
| **hiberfil.sys** | Full system memory dump written to disk when the operating system enters hibernation state. | Provides a near-complete bitstream snapshot of RAM contents captured at the exact moment of hibernation, surviving reboot cycles. |

---

### 2. Linux Memory Management

Linux manages process memory through contiguous **Virtual Memory Areas (VMAs)** tracked within kernel structures such as `mm_struct` and `vm_area_struct`. Hardware **Page Tables** dynamically translate these virtual addresses to physical page frames in RAM.

![Linux Memory Management & Kernel SLAB Structures](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_737@08-08-2026_01-39-59.jpg)

At the kernel layer, Linux leverages the **Slab/SLUB Allocator** to manage frequently allocated kernel objects (such as file descriptors, process descriptors, and sockets) via dedicated kernel memory caches. Forensic reconstruction of physical RAM allows investigators to walk these kernel structures and reconstruct process trees, loaded **Kernel Modules (LKMs)**, and raw socket descriptors.

---

### 3. Memory Acquisition Methodologies & Tooling

**Memory Acquisition** is the forensic process of creating an exact bit-for-bit raw image of physical RAM while minimizing runtime artifacts and adhering to the **Order of Volatility**:

#### Windows Acquisition Tooling:
- **WinPmem:** Open-source memory acquisition driver providing direct kernel-level physical memory access to output uncompressed raw dumps (`.raw`).
- **Magnet DumpIt:** High-performance commercial-grade utility supporting on-the-fly compressed crash dumps (`.zdmp`) to minimize network bandwidth consumption during transfers.

#### Linux Acquisition Tooling:
- **LiME (Linux Memory Extractor):** Loadable Kernel Module (LKM) designed for direct physical RAM extraction, supporting raw memory streaming over TCP networks and local disk capture.
- **AVML (Acquire Volatile Memory for Linux):** Modern Microsoft-engineered standalone user-space utility utilizing `/dev/crash` or kernel interfaces without requiring external module compilation on modern distributions.

---

### 4. Symbol Files and Their Critical Role in Forensics

**Symbol Files** serve as the forensic architectural blueprint, translating unstructured hexadecimal offsets into structured, typed data objects:

```text
Physical Memory Dump (Raw Binary Stream)
       ↓
Raw Hex Addresses (Unstructured Pointers: 0xffffa1023...)
       ↓
Symbol Files (Debug Type Tables & Header Definitions)
       ↓
Identified Kernel Structures (_EPROCESS / task_struct)
       ↓
Reconstructed Forensic Artifacts (Processes, Threads, Sockets, Injected Code)
```

| Operating System | Primary Symbol Source | Forensic Translation Capability |
| :--- | :--- | :--- |
| **Windows** | **PDB (Program Database)** Files | Maps internal kernel structures like `_EPROCESS` and `_ETHREAD` to extract process identifiers, tokens, and loaded modules. |
| **Linux** | **Kernel Debug / DWARF** Symbols | Processed via `dwarf2json` into **ISF JSON** symbol tables, revealing `task_struct`, VMA maps, and active socket lists. |
| **Volatility 3** | **Intermediate Symbol Format (ISF)** | Standardizes heterogeneous OS symbols into uniform JSON tables, eliminating the need for legacy static OS profiles. |

---

### 5. Volatility 3 Analysis Framework

**Volatility 3** is the industry standard for memory forensics. It operates as a modular framework utilizing specialized plugins to query and reconstruct operating system state:

```text
Acquired Memory Image (memory.raw / memory.zdmp)
                    ↓
             Volatility 3 Core
                    ↓
┌───────────────────┬───────────────────┬───────────────────┐
│  windows.pslist   │  windows.netscan  │    linux.bash     │
│ (Active Processes)│ (Network Sockets) │ (Terminal History)│
└───────────────────┴───────────────────┴───────────────────┘
```

CLI execution example:
```bash
python3 vol.py -f memory.raw windows.pslist
```

---

### 6. Platform Technology Stack

The DiGiPi ecosystem was built using a robust, polyglot software stack combining low-level systems programming, containerized infrastructure, web architectures, and advanced AI frameworks:

![DiGiPi Technology Stack](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_738@08-08-2026_01-39-59.jpg)

---

## Phase 0: Offline Field Acquisition Subsystem

![Phase 0 - Offline Acquisition](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_685@04-08-2026_16-20-00.jpg)

### Definition & Scope
Phase 0 represents a self-contained, air-gapped forensic toolkit enabling incident responders to acquire volatile RAM images and volatile system state from triage targets using a pre-configured USB device, fully supporting both Windows and Linux endpoints.

### Logic Flow Diagram
![Phase 0 Acquisition & Case Management Flow](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_686@04-08-2026_16-20-00.jpg)

---

### Windows Endpoint Acquisition

1. **USB Storage Directory Layout:**
   The USB drive is structured with streamlined acquisition binaries, configuration manifests, and scripts:
   ![Windows USB File Structure](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_687@04-08-2026_16-20-00.jpg)

2. **Executing the Acquisition Script:**
   Running `RunForensics.bat` with elevated privileges automatically initiates physical RAM extraction, volatile state logging, and cryptographic hashing:
   ![Windows Acquisition Execution](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_688@04-08-2026_16-20-00.jpg)

3. **Automated Case Directory Creation:**
   Upon completion, output cases are sealed inside timestamped directories to ensure strict chain-of-custody tracking:
   ![Windows Case View](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_689@04-08-2026_16-20-00.jpg)

4. **Acquired Artifacts & Integrity Verification:**
   ![Windows Evidence Directory](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_690@04-08-2026_16-20-00.jpg)

| Artifact Filename | Forensic Description & Investigative Role |
| :--- | :--- |
| `acquisition_log.txt` | Complete execution log detailing acquisition start/end times, memory range offsets, and exit codes. |
| `image_<timestamp>.zdmp` | Compressed raw physical memory snapshot containing the full runtime state of physical RAM. |
| `image_<timestamp>.sha256` | SHA-256 cryptographic hash calculated immediately upon memory dump completion. |
| `manifest.sha256` | Cryptographic integrity manifest verifying all auxiliary metadata files. |
| `system_info.txt` | Detailed OS version, patch level, hardware spec, active users, and system uptime report. |
| `volatile_info.txt` | Snapshot of active network sockets, running services, and scheduled tasks captured during triage. |

5. **Metadata Inspection:**
   - Reviewing `system_info.txt`:
     ![System Information Output](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_691@04-08-2026_16-20-00.jpg)
   - Reviewing `volatile_info.txt`:
     ![Volatile Information Output](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_692@04-08-2026_16-20-00.jpg)

---

### Linux Endpoint Acquisition

1. **Linux USB Directory Layout:**
   ![Linux USB File Structure](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_693@04-08-2026_16-20-00.jpg)

2. **Execution & Kernel Preparation:**
   Executing `RunForensics.sh` (or pre-configuring kernel interfaces via `Linux_Setup.sh`) triggers automated memory collection:
   ![Linux Acquisition Execution](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_694@04-08-2026_16-20-00.jpg)

3. **Linux Output Structure & Verified Evidence:**
   - Timestamped case folder:
     ![Linux Case View](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_695@04-08-2026_16-20-00.jpg)
   - Extracted forensic artifacts:
     ![Linux Extracted Evidence](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_696@04-08-2026_16-20-00.jpg)

---

## Phase 1: Server-Side Evidence Ingestion & Management Subsystem

![Phase 1 - Server Evidence Management](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_697@06-08-2026_16-00-40.jpg)

### Overview & Capabilities
Phase 1 implements a high-throughput central forensic ingestion server that manages live networked acquisitions across distributed enterprise endpoints, validating artifact integrity before handing evidence over to Phase 2:

1. **Fastest Drive Detection:** Identifies the fastest local storage volume (NVMe / SSD) on target endpoints to minimize capture latency and system pause times.
2. **On-the-Fly Compression:** Compresses memory dumps in transit, dramatically reducing network bandwidth consumption during incident response.
3. **Automated Hash Verification:** Performs post-transmission SHA-256 verification against the pre-transfer checksum to guarantee absolute evidence integrity.
4. **Linux Symbols Cache Server:** Houses pre-indexed ISF symbol tables for enterprise Linux distributions to accelerate subsequent analysis.
5. **Architecture Auto-Detection:** Determines whether target machines run 32-bit or 64-bit kernels and automatically deploys the matching toolset.

### Architecture and Data Pipeline Flow
![Phase 1 Architecture Flowchart](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_698@06-08-2026_16-00-40.jpg)

---

### Live Acquisition and Server Ingestion

1. **Server Ingestion Monitor Daemon:**
   The server runs a continuous listener daemon monitoring inbound forensic streams:
   ![Server Monitor Script Execution](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_699@06-08-2026_16-00-40.jpg)

2. **Network Acquisition from Windows Endpoints:**
   ![Windows Network Stream Capture](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_700@06-08-2026_16-00-40.jpg)

3. **Server Verification of Inbound Windows Image:**
   ![Windows Artifact Received by Server](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_701@06-08-2026_16-00-40.jpg)

4. **Network Acquisition from Linux Endpoints:**
   ![Linux Network Stream Capture](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_702@06-08-2026_16-00-40.jpg)

5. **Server Verification of Inbound Linux Image:**
   ![Linux Artifact Received by Server](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_703@06-08-2026_16-00-40.jpg)

6. **Organized Multi-OS Case Repository:**
   ![Final Server Case Hierarchy](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_704@06-08-2026_16-00-40.jpg)

---

## Phase 2: Automated AI-Driven Memory Analysis Subsystem

![Phase 2 - Automated AI Analysis](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_705@06-08-2026_22-53-38.jpg)

### Overview & Key Innovations
Phase 2 triggers immediately upon successful case ingestion. It runs an orchestrated suite of Volatility 3 plugins, transforms voluminous forensic telemetry into ultra-compact **TOON** syntax, and utilizes LLMs to generate executive-ready forensic reports.

### Analysis Pipeline Flowchart
![Phase 2 Analysis Architecture Flowchart](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_706@06-08-2026_22-53-38.jpg)

### The TOON Protocol & Prompt Chunking
Sending raw Volatility JSON output (thousands of lines of process trees and socket connections) directly to an LLM quickly exhausts context limits and incurs excessive token costs due to repetitive key names:

```json
[
  {"id": 1, "name": "Ali", "age": 25, "city": "Baghdad"},
  {"id": 2, "name": "Sara", "age": 30, "city": "Erbil"},
  {"id": 3, "name": "Omar", "age": 28, "city": "Basra"}
]
```

To solve this, DiGiPi engineered **TOON (Token-Oriented Object Notation)** — a schema-driven matrix representation:

```text
users[3]{id,name,age,city}:
1,Ali,25,Baghdad
2,Sara,30,Erbil
3,Omar,28,Basra
```

This representation achieves a **>60% token reduction**, which when paired with intelligent **Prompt Chunking**, enables large-scale memory dumps to be ingested and evaluated by LLMs seamlessly without truncation.

---

### Analysis Execution and Plugin Parallelization

1. **Autonomous Analyzer Engine (`auto_analyzer`):**
   ![Auto Analyzer Engine Trigger](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_707@06-08-2026_22-53-38.jpg)

2. **Parallel Plugin Execution:**
   Rather than sequential blocking, Volatility plugins execute asynchronously in parallel threads:
   ![Parallel Plugin Processing](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_708@06-08-2026_22-53-38.jpg)

3. **Telemetry Ingestion and AI Evaluation:**
   ![Telemetry Parsing & Ingestion](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_709@06-08-2026_22-53-38.jpg)

4. **Report Compilation Complete:**
   ![Automated Analysis Completion](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_710@06-08-2026_22-53-38.jpg)

---

### Executive Forensic Report (HTML Report)

The output is an interactive, beautifully formatted executive HTML forensic report:

- **Executive Summary & System Metadata:**
  ![Executive Report - Overview](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_711@06-08-2026_22-53-38.jpg)
- **Suspicious Processes & Behavioral Anomalies:**
  ![Executive Report - Process Findings](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_712@06-08-2026_22-53-38.jpg)
- **Network Sockets & Threat Indicators (IOCs):**
  ![Executive Report - Network Connections](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_713@06-08-2026_22-53-38.jpg)
- **Memory Injections & Unmapped VMA Dumps:**
  ![Executive Report - Injected Memory Dumps](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_714@06-08-2026_22-53-38.jpg)

---

## Phase 3: Comprehensive Investigation Platform & AI Copilot Workspace

![Phase 3 - Investigation Platform](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_739@07-08-2026_19-36-29.jpg)

### Overview & Core Features
Phase 3 represents the pinnacle of the DiGiPi platform — a multi-tenant, collaborative DFIR web platform offering case management, role-based access control, interactive visualizers, browser-based terminals, and an autonomous AI forensic copilot with **RAG** and **MCP Tool Calling**.

---

### 1. Central Telemetry Dashboard

Provides high-level operational visibility across all ongoing cases, storage allocations, and triage node states:

![Main Dashboard View 1](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_740@07-08-2026_19-36-29.jpg)
![Main Dashboard View 2](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_741@07-08-2026_19-36-29.jpg)
![Main Dashboard View 3](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_742@07-08-2026_19-36-29.jpg)

---

### 2. Forensic Case Management & Case Exploration

1. **Case Directory and Case Repository:**
   ![Case Repository List](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_743@07-08-2026_19-36-29.jpg)

2. **Real-World Case Study: Yandex Browser Exploit on Windows:**
   Selecting an active case investigating a stealthy malware infection abusing browser update services:
   ![Case Detail View](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_744@07-08-2026_19-36-29.jpg)

3. **Suspicious Parent-Child Process Discrepancies (`Svchost.exe` Abuse):**
   ![Suspicious Process Discovery](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_745@07-08-2026_19-36-29.jpg)

4. **Interactive Process Tree Visualizer:**
   ![Interactive Process Tree](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_746@07-08-2026_19-36-29.jpg)

5. **Network Connection Graph & IP Geolocation:**
   ![Network Telemetry Visualizer](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_747@07-08-2026_19-36-29.jpg)

6. **Automated Indicators of Compromise (IOC) Hub:**
   Revealing the abuse of `yupdate-exec-y` and malicious Java process spawning:
   ![IOC Hub Overview](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_748@07-08-2026_19-36-29.jpg)
   ![Detailed IOC Forensics](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_749@07-08-2026_19-36-29.jpg)
   ![Yandex Service Exploitation Breakdown](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_750@07-08-2026_19-36-29.jpg)

7. **Embedded Phase 2 Report Explorer:**
   ![Integrated Report View](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_751@07-08-2026_19-36-29.jpg)

8. **Role-Based Case Sharing & Team Collaboration:**
   ![Multi-Investigator Case Sharing](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_752@07-08-2026_19-36-29.jpg)

9. **Hybrid Processing Selection (Local Workstation vs Cloud Node):**
   ![Analysis Engine Selector](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_753@07-08-2026_19-36-29.jpg)

10. **General Platform Assistant:**
    ![General Platform Assistant](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_754@07-08-2026_19-36-29.jpg)

---

### 3. Dedicated Analyst Investigation Environment

Each investigator is provisioned an isolated, stateful investigation container equipped with dedicated forensic tooling:

![Dedicated Investigation Environment Interface](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_755@07-08-2026_19-36-29.jpg)

#### A. Interactive Volatility Plugin Launcher
One-click graphical execution of specialized Volatility 3 plugins:
![Plugin Execution Interface](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_756@07-08-2026_19-36-29.jpg)

#### B. Task Results & Data Filter Explorer
- Examining `cmdline` plugin output with instant string filtering:
  ![Task Results - cmdline Explorer](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_757@07-08-2026_19-36-29.jpg)
- Exporting structured artifact datasets for machine learning training:
  ![Data Export Interface](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_758@07-08-2026_19-36-29.jpg)
  ![Advanced Export Options](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_759@07-08-2026_19-36-29.jpg)
- Structural Process TreeGraphs (`psscan` / `pslist`):
  ![Process TreeGraph Representation](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_760@07-08-2026_19-36-29.jpg)

#### C. Integrated File Manager
Inspect, compare, and download extracted raw binaries, memdumps, and logs:
![In-Browser File Manager](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_761@07-08-2026_19-36-29.jpg)

#### D. Interactive Web Terminal
Direct web-based CLI access for manual verification and custom scripting:
- Terminal environment:
  ![Web Terminal Interface](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_762@07-08-2026_19-36-29.jpg)
- Automated command paste directly from the plugin UI:
  ![Command Injection into Terminal](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_763@07-08-2026_19-36-29.jpg)
- Live terminal execution output:
  ![Terminal Execution Output](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_764@07-08-2026_19-36-29.jpg)

---

### 4. Autonomous AI Forensic Agent (Beta)

The workspace features a context-aware AI agent possessing native filesystem access and programmatic tool-execution capabilities:

1. **Context-Aware In-Workspace Chatbot:**
   ![Forensic AI Copilot](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_765@07-08-2026_19-36-29.jpg)

2. **Autonomous Tool Calling (MCP Tools Execution):**
   The agent autonomously executes plugins (e.g., `psscan`), checks hashes, and parses memory dumps on user prompt:
   ![Autonomous AI Tool Calling](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_766@07-08-2026_19-36-29.jpg)

3. **Multi-Model Support (Google Gemini, Ollama Cloud, Ollama Local):**
   ![AI Model Provider Configuration](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_767@07-08-2026_19-36-29.jpg)

4. **Forensic Reasoning & Hidden Process Discovery:**
   Cross-referencing `pslist` and `psscan` to accurately uncover hidden unlinked processes:
   ![Forensic Synthesis and Hidden Process Discovery](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_768@07-08-2026_19-36-29.jpg)
   ![Adversary Behavior Reasoning](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_769@07-08-2026_19-36-29.jpg)

5. **AI Command-Line Dissection:**
   ![AI Dissection of Obfuscated Command Lines](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_770@07-08-2026_19-36-29.jpg)

6. **Forensic RAG (Retrieval-Augmented Generation):**
   Correlating discovered memory artifacts with MITRE ATT&CK enterprise tactics and Yara rule definitions:
   ![Forensic Threat Intelligence RAG](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_771@07-08-2026_19-36-29.jpg)

---

### 5. On-Demand Evidence Ingestion & Direct Upload

Supports ingesting existing memory dumps acquired from third-party tools (e.g., FTK Imager, Belkasoft):

1. **Selecting the Target Memory Dump:**
   ![Selecting Dump File](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_772@07-08-2026_19-36-29.jpg)

2. **Configuring Profile & Analysis Mode:**
   ![Configuring Analysis Parameters](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_773@07-08-2026_19-36-29.jpg)

3. **Automated Pipeline Trigger:**
   ![Triggering Ingestion Pipeline](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_774@07-08-2026_19-36-29.jpg)

4. **Ingestion Complete & Ready for Analysis:**
   ![Case Successfully Ingested](/CYBER-STATION/images/articles/digipi-memory-forensics-platform/photo_775@07-08-2026_19-36-29.jpg)

---

## Conclusion

The **DiGiPi** project bridges the critical gap between the deep technical complexity of volatile RAM analysis and the urgent speed required in modern incident triage. By uniting:
- Air-gapped field acquisition tooling (**Phase 0**)
- High-throughput ingestion and cryptographic integrity verification (**Phase 1**)
- Automated token-optimized AI memory analysis engines (**Phase 2**)
- Collaborative investigation sandboxes equipped with autonomous AI reasoning and RAG (**Phase 3**)

DiGiPi demonstrates how modern memory forensics can evolve from slow, manual command-line workflows into an automated, high-precision investigation ecosystem.

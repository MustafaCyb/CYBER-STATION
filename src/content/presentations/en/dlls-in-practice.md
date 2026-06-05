---
title: "DLLs in Practice: Library Execution and Injection"
description: "Understanding Dynamic Link Libraries (DLLs) in Windows, subsystem architectures (ntdll.dll, kernel32.dll), coding custom libraries, and executing DLL injection attacks."
locale: "en"
itemSlug: "dlls-in-practice"
category: "Cyber Station Lectures"
tags: ["dll-injection", "windows-internals", "winapi", "reverse-engineering", "memory-manipulation"]
sourceRepo: "https://github.com/MustafaCyb/Cyber_Station-Slides"
sourceFolder: "https://github.com/MustafaCyb/Cyber_Station-Slides/tree/main/DLLs%20in%20Practice"
cover: "images/presentations/dlls-in-practice/cover.webp"
featured: false
order: 3
session: 3
---

## Lecture Overview

**DLLs in Practice** explores the architecture of Dynamic Link Libraries (DLLs) under Windows. We cover how shared libraries improve OS memory efficiency, analyze critical subsystem DLLs, compile custom functions, and trace the step-by-step mechanism of DLL Injection.

---

## Detailed Slide Outline

### Part 1: Windows DLL Architecture
*   **What are DLL Files?** Reusable, shared code modules loaded and linked to applications at runtime. They reduce code redundancy on disk and in physical RAM.
*   **DLL Memory Sharing:** Multiple running processes (e.g., Chrome and Telegram) can map the exact same physical memory space containing a core library like `crypt32.dll`.
*   **Critical System DLLs:**
    *   `kernel32.dll`: Manages core operations like file handling, basic memory allocation, and process creation.
    *   `advapi32.dll`: Exposes advanced APIs for security policies, access control, and Registry operations.
    *   `ntdll.dll`: The lowest user-mode library in Windows. It exports the Native API (NTAPI) and acts as the gatekeeper translating user-mode requests to kernel-mode transitions.
*   **Windows Architecture Layers:** User Process $\rightarrow$ Subsystem DLL (`kernel32.dll`) $\rightarrow$ Native API (`ntdll.dll`) $\rightarrow$ Executive Kernel (`ntoskrnl.exe`).

### Part 2: Building and Loading a DLL in C
*   **DLL Implementation (`message.c`):** Implementing a library exported function using `extern __declspec(dllexport)` that triggers a standard system popup box (`MessageBoxW`).
*   **Main Application (`program.c`):** Demonstrating dynamic loading using Windows APIs:
    *   `LoadLibraryW()`: Maps the DLL into the calling process space.
    *   `GetProcAddress()`: Resolves the function pointer by its exported string name.
    *   `GetModuleHandleW()`: Checks if the DLL is already loaded in memory.

### Part 3: Vulnerabilities & Memory Attacks
*   **Vulnerability Types:** Buffer overflows in shared functions, privilege escalation via path vulnerabilities, DLL hijacking (spoofing trusted system paths), and injection.
*   **DLL Injection Attack Chain:** How malware subverts legitimate processes (e.g., injecting into `explorer.exe` to hide C2 agents):
    1.  `OpenProcess()`: Attacker opens a handle to the victim process with write and execution rights.
    2.  `VirtualAllocEx()`: Allocates a buffer inside the target process space.
    3.  `WriteProcessMemory()`: Writes the path of the malicious DLL (e.g., `evil.dll`) into the allocated target buffer.
    4.  `GetProcAddress` on `kernel32.dll`: Resolves the address of `LoadLibraryA()`.
    5.  `CreateRemoteThread()`: Launches a new thread inside the victim process running `LoadLibraryA` with the address of the DLL path as the argument.
    6.  **Payload Execution:** The victim process loads the malicious library, automatically executing its `DllMain` entry point.

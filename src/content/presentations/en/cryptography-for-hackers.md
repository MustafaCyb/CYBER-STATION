---
title: "Cryptography for Hackers"
description: "Practical cryptography from both an offensive and defensive security perspective, detailing ciphers, TLS protocols, AV evasion, and ransomware hybrid encryption."
locale: "en"
itemSlug: "cryptography-for-hackers"
category: "Cyber Station Lectures"
tags: ["cryptography", "symmetric-key", "asymmetric-key", "av-evasion", "ransomware-mechanics"]
sourceRepo: "https://github.com/MustafaCyb/Cyber_Station-Slides"
sourceFolder: "https://github.com/MustafaCyb/Cyber_Station-Slides/tree/main/Cryptography%20for%20Hackers"
cover: "images/presentations/cryptography-for-hackers/cover.webp"
featured: true
order: 2
session: 2
---

## Lecture Overview

**Cryptography for Hackers** bridges the gap between mathematical cryptography and its implementation in real-world software, both for secure communications and adversary actions (such as payload packing and ransomware).

---

## Detailed Slide Outline

### Part 1: Core Cryptographic Concepts
*   **Security Pillars:**
    *   **Confidentiality:** Hiding data from unauthorized eyes.
    *   **Integrity:** Catching modifications via hashes (SHA-256) and Message Authentication Codes (HMAC).
    *   **Authentication:** Proving identity.
    *   **Non-Repudiation:** Proving authorship via digital signatures.
*   **Common Ciphers:** AES (Symmetric Block), ChaCha20 (Symmetric Stream), RSA (Asymmetric Public Key), ECC (Elliptic Curve), Legacy (RC4, DES).
*   **Symmetric vs. Asymmetric:** Symmetric (fast, used for files and bulk traffic) vs. Asymmetric (slower, public/private key pairs, used for secure key exchanges and signatures).

### Part 2: Cryptography in Network Protocols
*   **SSL/TLS Handshake Mechanics:**
    1.  Establishment of TCP connection.
    2.  `ClientHello` and `ServerHello` (agreed ciphers and parameters).
    3.  Server certificate verification.
    4.  Key Exchange (generating a shared symmetric session key).
    5.  Application data transfer encrypted with the fast symmetric key.

### Part 3: Defensive vs. Offensive Cryptography
*   **Defensive Applications:** Full Disk Encryption (FDE), field-level database encryption, and Key Lifecycle Management (creation, storage in TPM/HSM, rotation, and revocation).
*   **Offensive Evasion (Malware Packing):**
    *   **Disk State:** Payload is encrypted and stored as a static blob with an decryption stub, showing high entropy and bypassing static signature analysis.
    *   **Memory State:** Decryption occurs in memory at runtime. EDRs and sandboxes monitor memory spaces to capture decrypted bytes when executed.
*   **Ransomware Mechanics (Hybrid Encryption):**
    *   **Speed is Key:** Ransomware encrypts large target shares (NAS, file servers) before security teams can respond.
    *   **Hybrid Flow:** Generates a unique symmetric key (AES or ChaCha20) per target file to encrypt its content instantly $\rightarrow$ Encrypts the symmetric key using the attacker's public asymmetric key (RSA/ECC) $\rightarrow$ Only the attacker's private key can recover the file key.

### Part 4: Practical Shellcode Evasion Demo
*   **Raw Shellcode vs. AES Shellcode:**
    *   **Raw Shellcode Executable:** The shellcode (e.g., from Msfvenom) is visible in the executable file on disk, getting flagged instantly by static antivirus signatures.
    *   **AES Encrypted Shellcode Executable:** The shellcode bytes are obfuscated on disk. The stub decrypts the buffer in RAM at runtime, bypassing static scans.
    *   **Takeaway:** Static bypass is basic; modern endpoint detection engines (EDR, behavior monitoring, cloud analysis) will analyze the decrypted behavior in RAM and still trigger alerts.

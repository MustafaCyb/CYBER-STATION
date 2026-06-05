---
title: "Threat to Risk: Security Frameworks"
description: "From Theory to Practice: Dissecting security variables, modeling risk scenarios on a vulnerable SQLite portal (SQLi, plaintext passwords, missing MFA), and applying mitigations."
locale: "en"
itemSlug: "threat-to-risk"
category: "Cyber Station Lectures"
tags: ["risk-assessment", "sqli-remediation", "password-hashing", "mfa-implementation", "threat-modeling"]
sourceRepo: "https://github.com/MustafaCyb/Cyber_Station-Slides"
sourceFolder: "https://github.com/MustafaCyb/Cyber_Station-Slides/tree/main/Threat%20to%20Risk"
cover: "images/presentations/threat-to-risk/cover.png"
featured: false
order: 6
session: 6
---

## Lecture Overview

**Threat to Risk** translates theoretical cybersecurity risk management frameworks into practical, hands-on secure code solutions. We define the key variables of threat modeling, explore a vulnerable SQLite-based student portal, model detailed risk scenarios, and implement code-level fixes (parameterized queries, Argon2id hashing, and OTP MFA).

---

## Detailed Slide Outline

### Part 1: Core Definitions of Risk
*   **Key Terminology:**
    *   **Asset:** The "Gold" (student portal database, grades, server uptime).
    *   **Vulnerability:** The "Open Window" (unsafe code, dynamic SQL queries).
    *   **Threat:** The "Burglar" (an external attacker or malicious insider).
    *   **Risk:** The "Break-in" (probability of threat exploiting vulnerability).
    *   **Impact:** The "Fire" (reputational damage, integrity loss, privacy breach).
*   **Vulnerability vs. Threat Confusion:**
    *   *Incorrect:* "SQL Injection is the threat." $\rightarrow$ *Correct:* SQL Injection is the vulnerability.
    *   *Incorrect:* "The hacker is the vulnerability." $\rightarrow$ *Correct:* The hacker is the threat actor.

### Part 2: Building Strong Risk Scenarios
*   **A strong scenario must be:**
    *   **Specific:** Name the exact system and asset.
    *   **Complete:** Include asset, threat, vulnerability, and impact.
    *   **Measurable:** Define likelihood and severity.
    *   **Actionable:** Directly map to a defensive control.
*   **Weak Scenario:** "SQL Injection is dangerous."
*   **Strong Scenario:** "An attacker exploits SQL Injection in the student portal login page because the application builds raw SQL queries from user input, allowing authentication bypass and unauthorized access to student records, causing a privacy breach."

### Part 3: SQLite Student Portal Vulnerabilities
*   **System Layout:** Contains student/admin accounts and grade records stored in an unsecured SQLite database.
*   **Flaw 1:** Authentication login query uses unsafe string assembly.
*   **Flaw 2:** User passwords stored in clear plain text.
*   **Flaw 3:** Admin account login lacks Multi-Factor Authentication (MFA).

### Part 4: Risk Scenarios & Code Mitigations
*   **Scenario 1: SQL Injection Bypass:**
    *   *Attack:* Inputting `' OR username='admin'--` to bypass password checks.
    *   *Fix (Secure Coding):* Implement parameterized queries (prepared statements) to separate SQL execution code from user data.
*   **Scenario 2: Plaintext Password Exposure:**
    *   *Attack:* Attacker extracts database credentials via SQLi. Plaintext passwords allow instant session takeover.
    *   *Fix:* Implement modern hashing algorithms (Argon2id, bcrypt) with unique salts using libraries like `werkzeug.security`.
*   **Scenario 3: Missing Admin MFA:**
    *   *Attack:* Attacker uses compromised credentials to access administrative pages directly.
    *   *Fix:* Implement One-Time Password (OTP) verification steps for administrative access.
*   **Scenario 4: Chained Attack Path:** SQL Injection $\rightarrow$ Database Exposure $\rightarrow$ Plaintext Password Extraction $\rightarrow$ No MFA $\rightarrow$ Complete Admin Takeover and Grade Tampering.

### Part 5: Risk Accuracy Improvements
*   By structuring threat vectors into detailed risk scenarios, security professionals can map code vulnerabilities directly to business impact, allowing accurate prioritization, budget alignment, and targeted developer remediation.

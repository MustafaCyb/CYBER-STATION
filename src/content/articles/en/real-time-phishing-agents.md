---
title: "Real-Time Phishing Agents: Bypassing MFA with Adversary-in-the-Middle (AiTM) Proxies"
description: "An architectural teardown of dynamic phishing attacks, demonstrating how Adversary-in-the-Middle (AiTM) frameworks like Evilginx intercept credentials and capture active session cookies to bypass Multi-Factor Authentication (MFA)."
locale: "en"
itemSlug: "real-time-phishing-agents"
date: 2026-06-05
tags: ["phishing", "aitm", "evilginx", "mfa-bypass", "red-team"]
category: "Offensive Security"
featured: true
cover: "images/articles/real-time-phishing-agents/Phishing agents.jpg"
images:
  - src: "images/articles/real-time-phishing-agents/Phishing agents.jpg"
    alt: "Real-Time Phishing Agent Network Flow"
---

For years, organizations relied on Multi-Factor Authentication (MFA) as the ultimate shield against credential theft. Traditional phishing attacks, which rely on static cloned login templates, fall apart when MFA is enabled. Since One-Time Passwords (OTPs) and authenticator codes are temporary, static phishing kits cannot verify or replay them in time.

However, threat actors have evolved. By using **Real-Time Phishing Agents**—commonly known as **Adversary-in-the-Middle (AiTM)** or **Reverse Proxy Phishing**—attackers can bypass traditional MFA completely. 

In this article, we dissect the mechanics of AiTM phishing, break down the step-by-step attack chain using the popular framework **Evilginx**, and discuss the necessary mitigations to protect corporate estates.

---

## Why Static Phishing Fails

To understand the power of dynamic phishing, we must look at the limitations of static templates:
1.  **High Maintenance:** Modern websites (like Microsoft 365, Google, or corporate portals) update their UI, scripts, and endpoints continuously. Static templates break quickly and require constant updates to look convincing.
2.  **The MFA Block:** If a victim enters their username and password into a static fake page, the attacker gets those credentials. But if the account requires an app approval, FIDO key, or OTP, the attacker cannot complete the authentication. The session token is never generated for the attacker, rendering the stolen password useless.

Dynamic phishing solves this by placing a **reverse proxy** between the victim and the legitimate service.

---

## The Adversary-in-the-Middle (AiTM) Concept

In an AiTM attack, the attacker does not host a fake cloned site. Instead, they run a server that acts as a proxy, forwarding requests from the victim to the real website, and relaying the responses back. 

Because the victim is communicating with the actual login portal through the proxy, they see the real login flows, branding, security questions, and MFA prompts.

![Real-Time Phishing Agent Flow](/CYBER-STATION/images/articles/real-time-phishing-agents/Phishing%20agents.jpg)

---

## Technical Attack Chain: Evilginx in Action

**Evilginx** (created by Kubas Gretzky) is a Go-based standalone reverse proxy that handles both DNS and HTTP traffic. Here is the step-by-step execution of an attack targeting an enterprise Microsoft 365 account:

### Step 1: The Lure (Initial Delivery)
The attacker sends a phishing lure (via email, SMS, or QR code) pointing to a domain they control, such as `login.fakemicrosoft.com`. The victim clicks the link, and their browser sends a request to the Evilginx server.

### Step 2: The Proxy Request
Instead of serving a pre-rendered static page, Evilginx intercept the incoming headers and forwards the request to the real authentication server at `login.microsoftonline.com`.

### Step 3: Fetching the Legitimate Page
The real Microsoft server receives the request from the proxy, treats it as a legitimate connection from a standard browser, and sends back the real, live login page.

### Step 4: Displaying the Trap
Evilginx receives the code of the real login page, modifies it on the fly (replacing occurrences of `microsoftonline.com` with `fakemicrosoft.com` in links and scripts), and serves it to the victim. The victim's browser renders the genuine Microsoft login form under the wrong domain name.

### Step 5: Password Interception
The victim inputs their email and password. Since the traffic goes through the proxy, Evilginx logs the credentials in plain text before relaying them to Microsoft's server.

### Step 6: MFA Relay (The Real-Time Aspect)
Microsoft detects that the account has MFA enabled and requests an authenticator code or SMS OTP. Microsoft sends this request to the proxy, which forwards it to the victim. The victim enters their temporary OTP on the fake page. The proxy immediately intercepts this code and relays it to Microsoft.

### Step 7: Capturing the "Golden Cookie"
Microsoft accepts the correct password and OTP, authenticates the session, and generates a **Session Cookie** (such as the `ESTSAUTH` cookie in Azure AD). This cookie is returned to the client.

As the cookie passes through the proxy, Evilginx captures and saves it. This cookie is the ultimate prize: it proves the session has completed MFA.

### Step 8: Clean Redirect
To avoid raising suspicion, Evilginx redirects the victim's browser to the actual Microsoft portal or landing page. The victim may experience a brief flicker or think there was a minor network glitch, but they are logged in normally. 

Meanwhile, the attacker imports the stolen session cookie into their own browser, bypassing the username, password, and MFA challenge entirely to take over the account.

---

## Defense: Combating AiTM Phishing

Since AiTM attacks proxy the real login flows, traditional defenses like blacklisting templates fail. To block dynamic phishing, defenders must adopt modern controls:

1.  **Phishing-Resistant MFA (FIDO2 & WebAuthn):** This is the most effective defense. Hardware security keys (like YubiKeys) bind the authentication credentials to the origin domain (`login.microsoftonline.com`). If the user is on `fakemicrosoft.com`, the browser refuses to sign the authentication request, breaking the attack chain at the root.
2.  **Conditional Access Policies:** Restrict logins based on device compliance, IP reputation, and geographic location. Even if an attacker steals a session cookie, they cannot use it if their device is not marked as compliant or originates from an unapproved IP block.
3.  **Domain & Certificate Monitoring:** Actively monitor for the registration of look-alike domains and SSL certificates matching corporate naming conventions (e.g. using tools like DNSTwist).

### References
*   **CISA Alert AA22-200A:** *Threat Actors Bypassing Multi-Factor Authentication via Adversary-in-the-Middle Phishing.*
*   **Microsoft Security Blog:** *From cookie theft to BEC: How AiTM phishing works.*
*   **OWASP Top 10:** *Identification and Authentication Failures.*

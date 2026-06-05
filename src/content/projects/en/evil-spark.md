---
title: "Evil Spark"
description: "Digispark USB HID attack chain proof-of-concept for educational purposes — demonstrates C++ Arduino sketches, Apache server setup, and PowerShell stagers."
locale: "en"
itemSlug: "evil-spark"
repoName: "Evil-Spark"
repo: "https://github.com/MustafaCyb/Evil-Spark"
category: "Offensive Security"
status: "active"
tags: ["hid-attack", "digispark", "usb", "red-team", "poc"]
tech: ["C++", "Arduino", "PowerShell", "Shell", "Apache"]
featured: false
order: 3
cover: "images/projects/evil-spark/cover.webp"
icon: "⚡"
safety: "educational-only"
---

## Overview

**Evil Spark** is an educational proof-of-concept demonstrating USB HID (Human Interface Device) attack chains using the Digispark microcontroller. It illustrates how physical access attacks work in real-world red team scenarios.

## ⚠️ Educational Disclaimer

> **This project is strictly for educational and authorized security testing purposes.** Unauthorized use of HID attack tools against systems you do not own or have permission to test is illegal and unethical.

## Attack Chain

1. **Digispark C++ Sketch** — Arduino-based HID payload that types commands at machine speed
2. **Apache Server Setup** — serves the secondary payload for download
3. **PowerShell Stager** — executes the final payload on the target Windows machine

## Components

- `sketch.ino` — Digispark Arduino sketch with keystroke injection
- `server/` — Apache configuration and payload hosting
- `stager.ps1` — PowerShell download-and-execute stager

## Learning Objectives

- Understanding USB HID attack vectors
- Physical security awareness
- Defense strategies against keystroke injection attacks
- Importance of USB port security policies

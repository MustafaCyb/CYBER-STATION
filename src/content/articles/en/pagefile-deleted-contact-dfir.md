---
itemSlug: "pagefile-deleted-contact-dfir"
title: "Digging Through Windows’ Pagefile.sys to Recover a Deleted Contact — A Real DFIR Case Study"
description: "A real digital forensics and incident response (DFIR) case study on recovering lost data from Windows pagefile.sys using memory forensics tools."
date: 2026-07-13
locale: "en"
tags: ["dfir", "forensics", "memory-forensics", "windows", "pagefile"]
cover: "/images/articles/pagefile-deleted-contact-dfir/Theme.png"
---

There are several standard ways to pull evidence off a device, and the right one always depends on what you actually lost.

Lost a file that was deleted from the file system? You reach for a disk-level recovery tool — something like Autopsy.

Copied something to the clipboard but never saved it as a file, and now it’s gone? You try to capture the live memory directly — a full RAM image via WinPMEM or Magnet RAM Capture — then run it through Volatility to dig the fragment back out.

But what happens when neither applies? The machine has already been shut down. Nothing was saved. No memory image was ever taken.

That’s the exact situation this post walks through. It’s a real case, not a hypothetical.

## The Roadmap
1. How Windows manages memory
2. Why pagefile.sys matters — and what it can hand you
3. The problem, and why it looked unsolvable
4. The tools that made recovery possible
5. Step-by-step: acquiring and analyzing both pagefiles
6. Finding the evidence — and why the number was there in the first place
7. What this actually means for how you think about “temporary” data

## 1. How Windows Manages Memory

![How Process A and Process B's virtual memory maps to physical memory and spills over to disk](/CYBER-STATION/images/articles/pagefile-deleted-contact-dfir/image1.jpg)

**Windows Memory Management**
Windows relies on a fairly elegant system for managing memory, and the first thing to get straight is that “memory” isn’t one thing. There’s physical memory — your RAM — and there’s virtual memory, which lives on disk.

When a background process sits idle for a while, or RAM starts filling up, Windows relieves the pressure by taking that process’s memory pages and writing them out to disk, into a file called `pagefile.sys`. This process is called paging.

![Virtual Memory configuration](/CYBER-STATION/images/articles/pagefile-deleted-contact-dfir/image2.jpg)

You can check your own pagefile configuration through:
`System Properties → Advanced → Performance (Settings) → Advanced → Virtual Memory (Change)`

![Confirming pagefile.sys location and size on C: drive](/CYBER-STATION/images/articles/pagefile-deleted-contact-dfir/image3.jpg)
![Confirming pagefile.sys location and size on F: drive](/CYBER-STATION/images/articles/pagefile-deleted-contact-dfir/image4.jpg)

In this case, the system had two separate pagefiles — one on the `C:` drive and one on `F:`. That's completely normal; Windows can maintain more than one `pagefile.sys` across different volumes. Knowing exactly where each one lives matters, because both had to be pulled and analyzed to get the full picture of what had passed through memory.

## 2. Why Pagefile.sys Matters for Forensics
We just established that the pagefile holds pieces of data that were once floating around in volatile memory. Here’s the part that makes it valuable: that data survives a reboot, because unlike RAM, disk storage is persistent. Once something lands in `pagefile.sys`, it stays there until it's overwritten.

Depending on what the user was doing on the machine, a pagefile can contain fragments of:
- Clipboard payloads
- Unencrypted chat text
- URLs and DNS request data
- Fragments of SQLite databases
- Phone numbers and email addresses
- …and more

None of it is guaranteed, and none of it is neatly organized — but it’s there, scattered through the file, waiting for the right tool to pull it out.

## 3. The Problem
Here’s the scenario:

Someone had a friend’s phone number saved in Telegram. The friend later deleted their Telegram account. A few days before that happened, the number had been visible on screen — and had even been copied and searched for in another application.

Then the machine got shut down. No memory image was ever captured. When the system booted back up, the live evidence was gone.

The only thing working in this person’s favor: the system had multiple pagefiles, which meant there was still a shot at extracting the missing number from what had been swapped to disk before the shutdown.

## 4. Tools of the Trade
Two tools carried the entire recovery:

- **RawCopy** — `pagefile.sys` is locked while Windows is running, so you can't just copy it the normal way. RawCopy works at the drive-sector level, which lets it bypass that lock entirely. ([github.com/jschicht/RawCopy](https://github.com/jschicht/RawCopy))
- **bulk_extractor** — a purpose-built tool for tearing through disk images and memory dumps to extract forensic artifacts. It comes with a wide range of extraction modules and made short work of parsing both pagefiles. ([digitalcorpora.s3.amazonaws.com](https://digitalcorpora.s3.amazonaws.com/s3_browser.html#downloads/bulk_extractor/))

## 5. Step-by-Step: Acquisition and Analysis

![Running RawCopy from an elevated terminal](/CYBER-STATION/images/articles/pagefile-deleted-contact-dfir/image5.jpg)
![Running RawCopy from an elevated terminal](/CYBER-STATION/images/articles/pagefile-deleted-contact-dfir/image6.jpg)

Open PowerShell or a terminal with administrator privileges. Since the system had two pagefiles — one on `C:` and one on `F:` — both needed to be acquired and analyzed together to get the complete set of memory pages that had passed through them.

Copying the `C:` drive pagefile:
```powershell
.\RawCopy64.exe /FileNamePath:C:\pagefile.sys /OutputPath:F:\Lost_Phone_number_Restore\pagefile.sys
```
*Note: the output path will always differ from machine to machine — adjust it to your own environment before running this.*

![Renaming the copied files before analysis](/CYBER-STATION/images/articles/pagefile-deleted-contact-dfir/image7.jpg)
![Renaming the copied files before analysis](/CYBER-STATION/images/articles/pagefile-deleted-contact-dfir/image8.jpg)

The same command runs again for the `F:` drive pagefile, just with the paths swapped. Since both files end up with the same name after extraction, they need to be renamed before analysis so they don't overwrite each other.

With both copies safely acquired, it’s time to run them through `bulk_extractor`:

![bulk_extractor running in the terminal](/CYBER-STATION/images/articles/pagefile-deleted-contact-dfir/image9.jpg)

```powershell
.\bulk_extractor64.exe -e base16 -e hiberfile -e outlook -e wordlist -e xor -S ssn_mode=2 -S scan_aes_192=1 -S strings=1 -x zip -x rar -x pdf -o .\c_drive_pagefile_analysis_full .\pagefile1.sys

.\bulk_extractor64.exe -e base16 -e hiberfile -e outlook -e wordlist -e xor -S ssn_mode=2 -S scan_aes_192=1 -S strings=1 -x zip -x rar -x pdf -o .\f_drive_pagefile_analysis_full .\pagefile2.sys
```
Same flags for both runs — only the output folder and the input filename change between the `C:` and `F:` pagefiles.

<video controls style="width: 100%; border-radius: 8px; margin-top: 1rem;">
  <source src="/CYBER-STATION/images/articles/pagefile-deleted-contact-dfir/video.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

![Terminal output once both bulk_extractor runs finish](/CYBER-STATION/images/articles/pagefile-deleted-contact-dfir/image10.jpg)

## 6. Finding the Evidence

![The resulting output folder](/CYBER-STATION/images/articles/pagefile-deleted-contact-dfir/image11.jpg)

Once `bulk_extractor` finishes, it drops a folder full of categorized output files — histograms, extracted strings, carved artifacts sorted by type. From here, the search narrows down to one specific thing: the missing number.

And there it was. One of `bulk_extractor`'s built-in extraction modules pulls out phone numbers automatically, and after a short search through `telephone_histogram.txt`, the number turned up.

![url_histogram.txt showing extracted URLs](/CYBER-STATION/images/articles/pagefile-deleted-contact-dfir/image12.jpg)
![telephone_histogram.txt with the recovered number](/CYBER-STATION/images/articles/pagefile-deleted-contact-dfir/image13.jpg)

Here’s why it ended up there in the first place: before the friend deleted their Telegram account, the number had been copied and pasted into WhatsApp’s search bar to check whether that contact existed there too. At that exact moment, WhatsApp was sitting in memory — and Windows’ memory manager, doing its normal paging routine, swapped part of that memory out to disk. That swapped-out chunk landed in `pagefile.sys`, carrying the number along with it. It had nothing to do with Telegram being deleted — the number survived because of an entirely separate, almost incidental action in a different app.

*Worth noting:* a pagefile will usually surface multiple phone numbers, not just the one you’re after — plenty of noise from other apps and activity ends up in there too. Cross-referencing a candidate number against a tool like Truecaller or a quick OSINT lookup is a reasonable way to confirm it actually belongs to the person you’re looking for before you treat it as evidence.

## 7. What “Temporary” Really Means
This is really the core lesson underneath everything above: what feels temporary on a running system rarely is. Everything that happens on a system gets written down somewhere, one way or another. It’s easy to assume — as a regular user or even as someone technical — that background activity is fleeting and temporary. In practice, it almost always leaves a trace sitting somewhere on disk, waiting to be found.

Files like `pagefile.sys` are exactly that kind of trace: an overlooked goldmine that can hand you back something you thought was gone for good, whether that's a deleted contact, a lost fragment of a conversation, or a clearer picture of what actually happened on a machine.

Hope this walkthrough was clear and useful — more real-world forensics case studies to come.


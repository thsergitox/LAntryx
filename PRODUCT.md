# LAntryx

<!-- impeccable:product-schema 1 -->

## Platform

web

The interface is intended for a Linux desktop application, not a website. The value above describes its proposed web-rendered UI; native Linux device access belongs outside that UI.

## Stack

Electron, React and TypeScript renderer, with directly executable Node modules behind a narrow preload bridge. The offline editor and profiles are implemented; the real HID transport is isolated in a manually confirmed CLI experiment.

## Users

Linux users with an Antryx MK825 TRIX who want to configure illumination without running the Windows vendor application. The initial validation device is the owner's Spanish-layout 69-key keyboard.

## Product Purpose

Make a uniform RGB color work reliably first. Extend that foundation to reusable local profiles, a keyboard representation, effects, brightness, speed, and English/Spanish UI.

## Positioning

A community-maintained Linux desktop configurator informed by static analysis of the actual MK825 software. Compatibility must be demonstrated on hardware; the current research is not proof that the application works.

## Operating Context

- Linux desktop, initially Arch Linux and Hyprland, with fractional scaling.
- The owner is currently away from the hardware. This phase must not access or change the keyboard.
- Public GitHub repository requested via `gh`, under the owner's account. Intended local path: `/home/sergi/Documents/projects/LAntryx`.
- The owner reviewed the proposal and approved native implementation.
- Do not run builds after changes. Conventional commits only, without AI attribution.

## Capabilities and Constraints

- First milestone: uniform RGB, illumination off, validated brightness levels, local profiles, and EN/ES.
- Color selection includes a clickable/draggable visual color area, hue slider and synchronized HEX/RGB inputs; color edits never automatically send to hardware.
- Subsequent scope: visual key selection, verified effects, speed, multicolor, import/export, and a carefully defined restoration operation.
- Macros and key remapping are outside the first lighting milestone.
- Preserve the distinction between local profile saving, UI preview, applying to hardware, and device persistence.
- No running the app as root, permanent permission changes, automatic USB writes, firmware/bootloader commands, or blind command scans.
- Hardware communication and real capabilities remain unvalidated. Unavailable controls must not pretend success.

## Brand Commitments

- Name: LAntryx.
- User's reference: the provided Windows Antryx screenshots, with a larger visual keyboard, profiles on the left, and lighting controls below.
- Improve clarity and craft rather than reproduce the old UI's textures and decorative frame literally.
- README must feature a real Antryx keyboard photo, with provenance and asset terms distinguished from the project's code license.
- Public identity must clearly state this is an independent community project, not an official Antryx application.

## Evidence on Hand

- Owner-supplied OEM screenshots are private design references, excluded from publication.
- Full static investigation and REA evidence stay in a private local research directory.
- Observed device: USB `258a:0049`; the VID/PID alone is insufficient identification.
- Static observations include Feature reports 5, 6, and 8. No physical color-change test has passed.
- A running offline-app screenshot and original typographic identity exist. Physical product-photo redistribution terms remain uncleared.

## Product Principles

1. A working uniform color before feature breadth.
2. Hardware evidence outranks attractive mockups.
3. Preview, local persistence and hardware application are distinct operations.
4. Touch only illumination and preserve unrelated settings.
5. Let contributors work without hardware, without misrepresenting simulated results.

## Accessibility & Inclusion

English and Spanish are explicit requirements. Proposed quality baseline: keyboard-operable controls, readable focus, labeled color inputs and status text that does not rely on color alone.

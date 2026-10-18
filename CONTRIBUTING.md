# Contributing to LAntryx

Thank you for helping make Linux keyboard lighting predictable and safe.

## Current stage

This repository currently contains planning documents. Review the [design specification](docs/specs/2026-10-18-lantryx-design.md) before proposing implementation. The public GitHub repository and contribution license have not been finalized yet.

## Contributions without hardware

- Review EN/ES terminology and text expansion.
- Review keyboard geometry, focus navigation and contrast.
- Improve profile-import validation requirements and offline error flows.
- Review the separation between preview state and applied state.
- Verify claims against cited source evidence rather than guessing capabilities.

## Hardware-related contributions

State the exact model, USB interface/report-descriptor fingerprint, application version and transport. Distinguish static analysis, failed transfers and successful physical observations.

Never submit a firmware experiment as a lighting test. Stop after unexpected errors. Device writes need a bounded procedure, a recovery plan and an explicit hardware owner present for confirmation.

Do not commit proprietary executables, DLLs, firmware, raw decompiler dumps or unreviewed captures. USB captures can include keystrokes and unrelated device traffic. Share only the minimal sanitized evidence needed to support a finding.

## Code conventions for the future implementation

- Organize by responsibility: lighting, profiles, keyboard, device and preferences.
- Keep packet encoding separate from device I/O and UI rendering.
- Use meaningful names and small modules; do not add speculative plugin systems.
- Renderer code must not access Node.js, the filesystem or HID directly.
- Every user-facing string belongs to the localization system, including errors and accessibility labels.
- Verification should match risk. Packet lengths, reserved bytes and IPC validation need focused checks; do not create broad test infrastructure by default.
- Do not run builds automatically after changes.

## Changes and commits

Explain the user problem, scope, evidence and verification in a proposed change. Make a separate change for a new hardware model rather than silently broadening a USB-ID match.

Use conventional commits. Do not add AI attribution or `Co-Authored-By` trailers. Do not publish compatibility, release or passing-test badges without supporting results.

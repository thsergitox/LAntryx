# LAntryx — design specification

**Status:** direction accepted in conversation; implementation plan awaiting review. **Date:** 2026-10-18.

The owner requested progress while away from the keyboard. This document freezes no hardware assumptions and authorizes no unattended USB experiment. It is the proposed design, not an implementation or release claim.

## 1. Outcome

A Linux desktop application that can reliably apply a uniform color to the owner's MK825 TRIX, with local profiles and EN/ES. A visual keyboard makes the pending color understandable before application. Expanded effects follow successful hardware validation.

Success requires both software verification and the owner's physical confirmation; a simulated device cannot satisfy the hardware criterion.

## 2. Proposed approach and alternatives

**Recommended:** Electron + React + TypeScript, using a narrow preload bridge and a device service outside the renderer. It matches the proposed rich desktop interface and allows offline UI work; costs include Electron's memory footprint and native-HID packaging requirements.

**Alternative: Qt/Python.** Native desktop integration and a smaller rendering stack, but a different UI ecosystem and packaging workflow. **Alternative: Tauri/Rust.** Potentially leaner packaging, but introduces a second implementation language and WebView differences before the hardware protocol is validated.

These are proposals for review. Dependency versions and the HID library/backend will be fixed during implementation planning after checking Linux hidraw and Electron compatibility.

## 3. First functional milestone

- Explicit device detection and compatibility status.
- A uniform color editor: visual color picker, HEX, RGB, swatches and brightness using verified device levels.
- The picker has a saturation/value area selectable by click or drag, a hue slider and synchronized HEX/RGB inputs. Keyboard operation must be available; alpha is not supported. Changing it only updates the draft and keyboard preview, never sends USB traffic.
- Illumination off as an independently verified capability, not assumed equivalent to sending black.
- Local profile create, rename, duplicate, delete, save, import and export.
- English and Spanish, independently selectable from the hardware key legends.
- Keyboard visualization, initially a whole-board preview; per-key hardware controls come later.
- A clearly labeled offline preview, usable with no device and incapable of sending packets.

## 4. Deferred scope

Per-key hardware colors; all pictured effect modes; speed and direction; multicolor; verified device persistence; and a carefully defined restore operation. Profiles may store proposed settings, but unsupported capabilities cannot be applied.

No macros, key remapping, firmware operations, tray daemon, autostart, audio capture, account system, telemetry or cloud sync in the first milestone.

## 5. State and operations

Maintain three separate states: saved local profile, current editor draft and last successfully applied snapshot. A transport success means the operating system accepted a transfer; it does not imply firmware persistence or visual correctness.

- Profile selection loads an editor draft; it does not write to hardware.
- Save writes only the local profile.
- Apply requires a validated capability set and sends one serialized operation.
- Offline preview never selects a real transport implicitly.
- Reconnect re-evaluates the device; it never reapplies a previous draft automatically.
- A disconnect invalidates pending operations and stale success messages.
- Unknown outcomes stay unknown; failure must not overwrite the last confirmed applied snapshot.

## 6. Architecture boundary

The renderer owns presentation and draft editing. A preload bridge exposes named application actions, not arbitrary Node.js or packet access. Main-process services own local persistence and HID I/O.

Lighting encoding is pure and independent of USB access. An offline adapter exists for demonstration and deterministic error scenarios. A real adapter is added only behind an explicit experimental gate until physical verification. Device operations use a single queue, bounded timeouts and no blind retries.

The initial implementation is a single desktop application, not microservices. Do not introduce a plugin framework or generic all-keyboard abstraction before a second real implementation exists.

## 7. Profiles and localization

Profiles carry a schema version, stable ID, user name, target model/layout and lighting values. They must not carry device paths, permissions, raw packets, executable code or a promise of hardware persistence. Import limits size, validates ranges and rejects unknown schema versions without overwriting existing files.

Store profiles atomically in the application's user-data directory. Export a portable JSON document rather than paths into the user's machine. The precise schema and file-size limit are implementation-plan decisions, not invented API contracts in this draft.

English/Spanish localization covers labels, status messages, error recovery, profile actions and accessible names. Spanish key legends remain Spanish when the UI is English.

## 8. Safety

No hardware access during the current offline phase. VID/PID matching alone is insufficient: validate interface, report descriptor and known model evidence. Never hardcode hidraw node numbers.

Exclude `SetKeyMatrix`, macro, bootloader and firmware operations from the lighting transport. Preserve unrelated profile bytes if a later read-modify-write experiment is approved. No persistent permission changes, root GUI or reconnect-time writes.

## 9. Design and delivery

The [desktop brief](../design/desktop-brief.md) defines the accepted visual direction. The existing static sketch is not an application or a working hardware demo. The owner subsequently requested implementation and added the visual color picker; its detailed implementation is covered by the execution plan.

Original project code is proposed under MIT, pending confirmation. Vendor marks and photographs keep their own terms. The public repository is requested but its creation/publication stays after review of the written specification; do not upload raw reverse-engineering evidence or private attachments automatically.

## 10. Milestones and review gates

1. **Direction accepted:** written design, architecture, static sketch and offline/hardware boundary, with the visual color-picker addition.
2. **Current:** review the detailed implementation plan with exact files, interfaces and focused verification before execution.
3. **Offline implementation:** desktop shell, localization, local profiles, keyboard geometry, editor state and simulated transport. No automatic USB operations.
4. **Owner present:** validate read-only behavior, then a single bounded uniform-color test, brightness and off; stop on unexpected errors.
5. **Public readiness:** audit assets, license, documentation and claims; create the requested GitHub repository with `gh` and publish only reviewed material.
6. **Expansion:** enable effects and per-key hardware features one proven capability at a time.

## 11. Acceptance and open decisions

See [acceptance criteria](../verification/acceptance.md). Open decisions: implementation-plan approval, code license, photo rights, packaging targets and all physically unvalidated protocol semantics. None blocks preparing the execution plan; they do block claiming a finished application.

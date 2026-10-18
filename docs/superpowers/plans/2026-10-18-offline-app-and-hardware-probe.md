# LAntryx — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for native execution or superpowers:subagent-driven-development if the owner selects delegation. Execute task-by-task; do not implement before plan review.

**Goal:** Deliver a working offline Linux desktop editor with a visual color picker and local profiles, plus an explicitly gated hardware test path for the owner's return.

**Architecture:** Feature-oriented modules; React renderer has no filesystem or HID access. A narrow preload bridge invokes validated main-process actions. HID experiments run in a separate child process, never as a side effect of preview, saving or connection.

**Tech Stack:** Electron, React/TypeScript renderer, Vite development server, React Aria Components. Main/preload and Node-domain modules use directly executable CommonJS with JSDoc types checked by TypeScript; no main/preload compilation needed. Native node-hid stays outside the renderer.

**Spec:** [Design specification](../../specs/2026-10-18-lantryx-design.md), [visual brief](../../design/desktop-brief.md), [acceptance](../../verification/acceptance.md).

**Status:** owner approved native execution; offline implementation and focused checks completed. This is the original execution plan; final review corrections and remaining limitations are recorded in the verification report. Hardware validation remains pending.

## Global Constraints

- No hardware access during the current offline phase.
- No persistent permission changes, root GUI or reconnect-time writes.
- Exclude SetKeyMatrix, macro, bootloader and firmware operations from the lighting transport.
- Saving, previewing, applying and firmware persistence are separate outcomes.
- No builds after changes; do not run production builds, native rebuilds, package generation or CI build jobs.
- Conventional commits only, without AI attribution.
- English and Spanish, independently selectable from the hardware key legends.
- Keep the original local evidence private; no OEM binaries, extracted artwork or raw decompilation in GitHub.

## Review Focus

1. Dragging the picker while disconnected changes the preview, never a device; checked in Task 3.
2. Gray/black colors and invalid partial HEX input preserve a usable editing state; checked in Task 3.
3. Malformed, oversized or malicious profile imports cannot overwrite files; checked in Task 2.
4. A device disappears or an operation times out: stale results cannot become success; checked in Task 4.
5. A compatible VID/PID but different descriptor cannot enable writes; checked in Task 5.

## Dependency and execution policy

Registry observations on 2026-10-18: Electron 44.9.0, React/React DOM 19.3.1, React Aria Components 1.22.1, Vite 8.3.4, TypeScript 7.0.2, node-hid 3.4.0. Electron/Vite's advertised Node floor is 22.12.0; local Node is 22.22.0. These are registry observations, NOT verified integration results. Pin exact versions and commit the lockfile only after reviewing package metadata, install scripts and advisories at execution time. Disable lifecycle scripts for installation; explicitly allow only reviewed binary-download steps needed for development. Do not let an addon install script silently fall back to native compilation.

Prefer the color library's existing pointer/keyboard behavior to a home-grown canvas picker. Tradeoff: additional dependencies, but less custom accessibility and gesture code. Follow the [ColorArea](https://react-aria.adobe.com/ColorArea), [ColorPicker](https://react-aria.adobe.com/ColorPicker) and [ColorSlider](https://react-aria.adobe.com/ColorSlider) contracts, checking installed declarations before importing APIs.

Use plain Electron main/preload modules and Vite dev mode, not an Electron bundler with implicit build steps. A native addon prebuilt-load failure blocks the HID milestone; do not automatically compile it or claim compatibility. Offline mode must launch without loading node-hid at all. [Electron security](https://www.electronjs.org/docs/latest/tutorial/security) and [node-hid](https://github.com/node-hid/node-hid) are the transport/packaging references.

## Shared data contracts

Define these project-owned contracts in `src/desktop/bridge/contracts.d.ts`; they are design decisions, not external APIs:

- `Rgb = { r: number; g: number; b: number }`, integer 0–255.
- `Lighting = { color: Rgb; brightness: 1|2|3|4|5; effect: 'uniform'; enabled: boolean }`. Off/brightness are stored intentions until independently verified.
- `Profile = { schemaVersion: 1; id: string; name: string; model: 'MK825-TRIX'; layout: 'es-69'; lighting: Lighting }`.
- `DeviceState = { generation: number; status: 'offline'|'checking'|'denied'|'unverified'|'ready'|'applying'|'failed'|'unknown'; canApply: boolean; reason: string|null }`.
- `ApplyResult = { outcome: 'simulated'|'transport-accepted'|'failed'|'unknown'; generation: number; message: string }`. None of these proves physical visual correctness.
- `EditorState = { saved: Profile; draft: Lighting; lastApplied: Lighting|null; dirty: boolean }`. `EditorAction` is a discriminated union: `edit-color` with `color: Rgb`, `edit-brightness` with `brightness: Lighting['brightness']`, `edit-enabled` with `enabled: boolean`, `load-profile`/`save-local` with `profile: Profile`, and `apply-result` with `lighting: Lighting` plus `result: ApplyResult`. Only current-generation accepted real results update `lastApplied`; simulated/failed/unknown outcomes do not. Renderer color/state modules are `.mjs` so Vite imports browser-native ESM, not untransformed local CommonJS.
- `ProfileStore`: `list(): Promise<Profile[]>`, `save(profile: Profile): Promise<void>`, `remove(id: string): Promise<void>`.
- `LightingTransport`: `inspect(): Promise<DeviceState>`, `apply(lighting: Lighting, generation: number): Promise<ApplyResult>`, `close(): Promise<void>`.

## Task 1 — Runnable, isolated offline desktop shell

**Files:** `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `scripts/dev.mjs`; `src/desktop/lifecycle/main.cjs`, `window.cjs`, `src/desktop/bridge/preload.cjs`, `contracts.d.ts`; `src/desktop/interface/App.tsx`, `main.tsx`, `shell.css`; `docs/verification/software-checks.md`.

**Interfaces:** Produces a loopback-only development launcher and `window.lantryx` with named `profiles`, `preferences` and `device` actions. Backend invokes no adapter during initial render. Later tasks supply handlers; unavailable actions return explicit unavailable errors, not fake success.

- [x] Inspect and pin dependencies under the policy above; implement the shell in the accepted visual direction, not a marketing landing page. Record the design contract before UI edits.
- [x] Implement `scripts/dev.mjs` to start Vite on loopback and launch Electron only when the exact development origin is available; clean up children on exit. No implicit build, no root/sandbox bypass flags.
- [x] Set `nodeIntegration:false`, `contextIsolation:true`, `sandbox:true`; restrict navigation/popups/permissions and IPC sender to the owned local origin. No arbitrary IPC or shell API in preload.
- [x] Define `npm run dev:offline` and `npm run typecheck` (`tsc --noEmit`); launch offline to verify one responsive window, reload/close cleanup and denied remote navigation. Log actual results, not planned passes.
- [x] Commit `feat: add isolated offline desktop shell`.

## Task 2 — Validated local profiles and preferences

**Files:** `src/profiles/model/schema.cjs`, `src/profiles/persistence/store.cjs`, `src/profiles/application/import-export.cjs`, `src/preferences/persistence/store.cjs`, `src/preferences/language/en.ts`, `es.ts`, `src/desktop/bridge/profile-handlers.cjs`; `scripts/check-profiles.cjs`.

**Interfaces:** Implements `ProfileStore`; `validateProfile(input: unknown): Profile`; `createProfileStore(directory: string): ProfileStore`; `importProfile(bytes: Buffer): Promise<Profile>`; `exportProfile(id: string): Promise<void>`. Native main-process file dialogs choose paths; renderer cannot supply a path. Preferences contain only UI language (`en|es`).

- [x] Implement version 1 validation, max 64 KiB import, 1–64 trimmed name characters, generated UUID IDs, range checks and rejection of unknown fields/schema, paths, packets and executable content. Imported IDs are regenerated; preserve existing profiles.
- [x] Store under Electron's user-data directory. Save via same-directory temporary file and rename; clean failed temporaries. Rename/duplicate/delete operate on validated IDs, not user names as paths. Confirm destructive delete; protect unsaved drafts on profile switch.
- [x] Implement create/load/rename/duplicate/delete/import/export with clear localized errors. Default Spanish; persist explicit language choice without changing key legends.
- [x] Run `node scripts/check-profiles.cjs` using a temporary directory: save/load roundtrip, duplicate isolation, invalid names/ranges, >64 KiB, unsupported schema, forged ID/path and failed-write preservation. Use focused assertions, no new test framework.
- [x] Commit `feat: add portable local profiles and language preferences`.

## Task 3 — Functional editor, visual color picker and keyboard

**Files:** `src/lighting/model/color.mjs`, `editor-state.mjs`; `src/lighting/editor/ColorPicker.tsx`, `ColorFields.tsx`, `LightingEditor.tsx`, `color-picker.css`; `src/keyboard/model/es69.ts`, `src/keyboard/interface/KeyboardPreview.tsx`; `src/profiles/interface/ProfileSidebar.tsx`; `src/desktop/interface/ActionBar.tsx`; `scripts/check-editor.mjs`.

**Interfaces:** `parseHex(text: string): Rgb|null`, `formatHex(rgb: Rgb): string`, `createEditorState(profile: Profile): EditorState`, `reduceEditor(state: EditorState, action: EditorAction): EditorState`; define `EditorState`/`EditorAction` together in `contracts.d.ts`. `ColorPicker({color: Rgb,onChange:(color:Rgb)=>void})` consumes only editor callbacks, never the bridge.

- [x] Read installed React Aria declarations and compose a saturation/value area, hue slider, draggable marker, HEX/RGB fields and clickable swatches. Retain hue while gray/black; disable alpha. Invalid partial inputs retain the last valid color until corrected.
- [x] Convert the original static key geometry into 69 labeled vector keys; correct ISO Enter shape. Tint lighting markers with the selected RGB. No false per-key controls. Whole-board preview updates immediately from every color input.
- [x] Implement separate saved/draft/last-applied states. Save is local only; offline apply is disabled, with a separate clearly named simulated-result check. Brightness/off display unverified capability reasons, not fake hardware behavior. Deferred effects remain explained, not executable.
- [x] Implement sidebar profile actions and full EN/ES, visible keyboard focus, reduced motion and independently scrolling workspace with persistent action row. Check 1440×900, 1180×780 and 960×680.
- [x] Run `node scripts/check-editor.mjs` for color boundaries/invalid text, draft/save isolation and applied-state preservation. In Chromium check picker pointer/keyboard input, hue retention, synchronized fields, language switch and zero bridge calls while dragging. Run Impeccable detector and inspect rendered captures in a single review batch.
- [x] Commit `feat: add visual RGB picker and keyboard editor`.

## Task 4 — Device/application boundary and bounded operations

**Files:** `src/device/transport/offline.cjs`, `worker-client.cjs`, `worker.cjs`; `src/device/connection/session.cjs`; `src/lighting/application/apply.cjs`; `src/desktop/bridge/device-handlers.cjs`; `scripts/check-device-boundary.cjs`.

**Interfaces:** `createOfflineTransport(): LightingTransport`; `createSession(transport: LightingTransport)` exposes `inspect`, `apply`, `disconnect`, `close`; `applyLighting(lighting: Lighting, generation: number): Promise<ApplyResult>`. Child-process messages are named structured requests, never renderer-origin raw packets.

- [x] Implement explicit offline composition; lazy-load real HID modules only inside a hardware-mode child. Never switch adapters because a keyboard reconnects or a profile imports. Offline startup must perform zero device enumeration/open operations.
- [x] Validate sender/action/payload in main. Refuse unsupported capability application. Serialize at most one operation; invalidate generation on disconnect. Bound child operation to 3 seconds; terminate a stuck child and return unknown outcome, never assume termination undid a transfer. No automatic retry.
- [x] Run `node scripts/check-device-boundary.cjs` with injected adapters: bad payload, arbitrary path/raw bytes, duplicate apply, denied access, disconnect during transfer, delayed stale completion and hung worker. No real HID used.
- [x] Commit `feat: isolate device operations behind explicit capabilities`.

## Task 5 — Read-only diagnostics and manually gated RGB probe

**Files:** `src/device/detection/linux.cjs`, `identity.cjs`; `src/device/transport/hid.cjs`; `src/lighting/protocol/live-rgb.cjs`; `scripts/hardware-check.cjs`, `scripts/check-protocol.cjs`; `docs/verification/hardware-session.md`.

**Interfaces:** `inspectLinuxCandidates(): Promise<Candidate[]>`, `validateCandidate(candidate: Candidate): Validation`; define these internal types in `contracts.d.ts`. `encodeLiveRgb(rgb: Rgb): Buffer` produces only the documented 382-byte report. The renderer never receives or supplies HID paths.

- [x] Implement sysfs identity/interface/descriptor inspection for `258a:0049`, interface 1 and the observed descriptor hash/report sizes. No hardcoded hidraw number, no first-VID/PID match, no opening normal keyboard input for RGB. Conflicting candidates remain unverified.
- [x] Encode exactly `08 0A 7A 01` followed by 126 RGB triples, based on static evidence only. Do NOT implement effect/profile/keymatrix writes or silently shorten report 5. The OEM profile-read handshake itself sends SetFeature and is an active experiment, not passive diagnostics.
- [x] Implement hardware-check default `--dry-run`: fixture-only output, no enumeration/open/write. Separate explicit `--inspect` performs read-only sysfs inspection. Native addon availability must be checked without opening a device; missing prebuilt yields actionable limitation, not a rebuild.
- [x] Implement a separate owner-present live-RGB experiment requiring interactive confirmation of model and exact RGB, an inspected candidate and explicit acceptance that initialization/persistence is unknown. At most one report-8 transfer per invocation; no periodic stream, permission mutation or persistent writes. On timeout/error stop; do not fall back to another command. Hardware apply in the ordinary UI stays disabled until physical validation.
- [x] Run `node scripts/check-protocol.cjs` against fake sysfs/transport: missing/multiple devices, descriptor mismatch, report lengths 6/1032/382, RGB boundary bytes, invalid channels and exactly one allowed send. Run the default dry-run with a spy asserting zero native I/O. Never run real inspection/probe during this offline phase.
- [x] Document owner-return steps: inspect, permission assessment without automatic changes, choose one bounded experiment, observe color/channel/typing effects and stop on anomalies. Separate follow-up work for brightness/off/persistence and the report-5 mismatch; do not promise those will pass on the first session.
- [x] Commit `feat: prepare gated keyboard diagnostics and RGB probe`.

## Task 6 — Integrated verification and honest handoff

**Files:** `README.md`, `README.es.md`, `CONTRIBUTING.md`, `SECURITY.md`, `docs/verification/software-checks.md`, `docs/design/assets.md`, `.gitignore`.

**Interfaces:** Consumes all previous tasks; produces an offline-start guide and an explicit owner-present testing checklist. Keep the static design images distinguishable from actual running-app screenshots.

- [x] Run typecheck and the focused check scripts; exercise create/edit/save/restart/import/export/language in the actual offline Electron app. Record commands, outcomes and remaining failures. No build/package/rebuild command.
- [x] Inspect network/bridge activity during color drag and offline startup; verify no HID operations. Check scrolling, persistent actions, denied/unknown states and keyboard accessibility. Conduct a fresh independent review if the selected execution workflow requires it, then fix verified findings.
- [x] Update README commands only after executing them successfully; state exactly which features work offline and which require hardware. No success badges for untested hardware; no claim that the initial probe is a complete driver.
- [x] Review publication material and existing `gh` identity. Add a code license only with owner approval; keep the real-keyboard photograph pending until redistribution rights are clear. Create/push the requested public repository only after that audit; do not upload vendor assets or private evidence. Open the published repository for review.
- [x] Commit `docs: document offline use and owner-present hardware checks`.

## Completion boundary and handoff

Offline app complete means a runnable, verified editor with profiles and a working visual picker—not merely another sketch. Hardware-ready means a bounded, explicit test path exists; it does NOT mean the keyboard has been successfully controlled. Packaging, brightness/off activation and effect/per-key expansion remain separate verified milestones.

**Recommended execution:** native implementation in this session, because the six tasks share a small set of contracts and there is no benefit to concurrent edits around an unverified hardware boundary. Delegated task-by-task implementation is an alternative with stronger intermediate independent review but higher context cost. Ask the owner to review this plan and select the execution method before product implementation.

## Execution amendments

The fresh review required actual opened-handle identity binding. The final experimental transport therefore uses Python 3 stdlib `fcntl.ioctl` on one fd (Linux x86_64), instead of node-hid: its available JS API exposed device info but not the needed same-handle report descriptor. The Node addon was removed, no native rebuild was run, and timeout kills the direct child rather than leaving a grandchild. This costs a Python 3 dependency for checks/probe, not for offline editing.

A first integrated commit contains the runnable shell/profile/editor/boundary milestone because their contracts are interdependent. Backend verification uses runtime validation and focused checks; it is not claimed to be fully TypeScript checked. No production builds or physical experiments were performed. The owner-approved MIT proposal covers only original project material. The physical product photograph remains pending clearance and is not a publication asset.

Publication verified: public repository `https://github.com/thsergitox/LAntryx`, default remote branch `main`, initial application publication at `10672a6`. Local execution remains on `feat/offline-editor`; publication created remote main directly and did not merge into an existing shared branch or create a pull request.

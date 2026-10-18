# Software verification — 2026-10-18

## Executed successfully

- `npm run typecheck`: React/TypeScript renderer and shared contracts, no emitted output. Node backend is runtime-validated and syntax checked; this is not a claim of full JavaScript static typing.
- `npm run check`: Node module syntax; profile/schema/import/atomic-failure/preferences checks; color/draft/save/stale-result checks; IPC/duplicate/disconnect/worker-timeout checks; exact RGB frame and candidate-identity fixtures. No test uses the real HID transport.
- `npm run hardware:check -- --dry-run`: 382-byte static candidate, header `08 0A 7A 01`, no enumeration/open/write.
- Actual sandboxed Electron startup, with temporary app data. The ordinary `npm run dev:offline` launcher was also opened and stopped under a controlled timeout.
- Running Electron at 1440×900, 1180×780 and 960×680 logical content sizes: 69 keys, no horizontal document overflow, persistent action row within the viewport. Workspace scrolling retains access to lower controls.
- Actual Electron interactions: click color area, keyboard hue adjustment, HEX/RGB synchronization, invalid HEX preservation, black/gray hue retention, swatch selection and save.
- Actual local profile create/rename/duplicate/delete, export/import and app restart; language and three test profiles persisted. Native dialogs were given controlled temporary paths in the automation, while real application IPC, validation and filesystem operations ran.
- Apply remains disabled. Explicit simulation reports no physical operation. Renderer remote-request capture and main-process module-cache inspection found no remote renderer requests or loaded node-hid during those interactions.
- The initial Node-HID prebuilt loaded without opening devices, but the final probe no longer uses it: review found its JS API could not bind report-descriptor validation to the opened handle. A direct Python 3 ioctl child now validates the actual opened descriptor. Fake-handle checks cover replacement/mismatch, short/uncertain sends and post-send close failure. No native addon or native build is needed.
- `npm audit`: zero reported vulnerabilities in installed dependencies at verification time; not a lasting security guarantee.
- Impeccable detector: no remaining findings after documenting actual semantic colors. Rendered screenshots inspected separately; the detector does not certify accessibility.

The local UI checks used Playwright already present in temporary research tools, not a new project test framework. The repeatable dependency-free behavior checks are in `scripts/`. Temporary profiles, automation logs and unsanitized local captures are excluded from Git.

## Regression found and fixed

Two simultaneous apply requests could both pass the busy check while awaiting inspection. A focused assertion reproduced two accepted operations. Reserving the operation before awaiting, then rechecking the connection generation, reduced that to one accepted operation; checks now pass.

## NOT verified / NOT executed

- No real USB inspection, GetFeature, SetFeature or color change.
- No firmware initialization, brightness/off, channel mapping, persistence, effect or per-key hardware validation.
- No production build, packaging, native compilation, installer or CI build.
- No release/production security certification or blanket accessibility-compliance claim.

Full integration remains subject to fresh review and the owner-present hardware checklist. Current success is the offline editor, not a finished keyboard driver.

## Final review corrections

An independent reviewer inspected the implementation. Six important findings were addressed in one fix pass: errors no longer reload a dirty editor; profile-replacing operations disable editing; Electron close asks for explicit localized discard with cancel as the default; damaged profile files are skipped with a warning while healthy ones remain available and originals remain untouched; HID identity is validated on the actual opened fd; short/uncertain transfers and cleanup errors keep honest outcomes.

The profile-corruption regression was observed failing before the fix. New focused fake-handle and close-policy checks cover the corrected paths. A separate actual-Electron regression run checks failed-save dismissal, async editing lock, corruption warning, close cancellation and explicit discard.

Minor review findings remain: a shared color-input invalid flag can mark more than the malformed field, and the busy action label says Saving during non-save operations. These do not permit device writes or data loss and are recorded for subsequent polish.

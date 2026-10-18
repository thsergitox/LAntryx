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
- Node-HID's prebuilt module loads in Node without opening any device. This is not an Electron-addon or hardware compatibility result; the first real probe uses a separate Node child.
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

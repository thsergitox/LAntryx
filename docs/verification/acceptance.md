# Acceptance criteria

These are future verification requirements, not passing test results. No build or hardware test was run for this planning package.

## Offline milestone

- Launching the offline preview cannot open HID nodes or send USB commands.
- The keyboard has 69 visible keys with Spanish legends and a coherent reading order.
- Changing UI language changes controls and recovery text, not physical legends.
- A color draft updates the preview without altering a saved profile or device state.
- HEX/RGB values are validated; invalid input preserves the last valid color and shows a labeled error.
- Profile selection, local saving and hardware application are visibly separate.
- Importing malformed, oversized or unsupported-version JSON cannot overwrite a profile or execute content.
- Simulated permission denial, disconnect and uncertain apply result never display a misleading hardware-success state.
- Primary actions, fields and profile rows are keyboard-operable with visible focus.
- The main task fits the target desktop window; smaller windows preserve control access through structural scrolling, not illegible scaling.
- A reduced-motion preference removes decorative preview transitions.

## Focused software checks after implementation

- Pure packet encoders preserve exact report IDs, lengths and reserved regions from reviewed fixtures.
- IPC rejects arbitrary device paths, packet bodies and unrecognized actions.
- A disconnect invalidates queued operations and stale completion messages.
- Local persistence is atomic and profile schema validation covers range and version boundaries.
- Offline and real adapters cannot be switched implicitly by reconnection or file import.

## Owner-present hardware checkpoint

- Read the actual identity and descriptor; record model and firmware evidence available.
- Demonstrate bounded profile reading before any proposed read-modify-write.
- Apply one known uniform color; ask the owner to verify the visible result.
- Separately verify red, green and blue channels, supported brightness levels and off behavior.
- Confirm typing and unrelated settings are unchanged.
- Measure behavior after closing the app and reconnecting; never assume persistence.
- Stop at the first unexpected error; no repeated failures or command scans.

## Before publication

- Approve the original-code license and asset provenance.
- Remove private attachments, raw dumps, binaries, capture contents and personal logs.
- Keep experimental/verified capabilities separate in README and issue templates.
- Publish no release, test, compatibility or safety badge without supporting evidence.

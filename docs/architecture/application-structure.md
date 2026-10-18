# Application structure

Implemented as one desktop application. Source follows feature ownership, not a generic helpers/utility hierarchy.

```text
src/
  desktop/
    lifecycle/       Electron window, startup and localized close confirmation
    bridge/          validated named IPC, preload and shared TypeScript contracts
    interface/       application composition, workspace state and shell styles
  lighting/
    model/           pure RGB conversion and saved/draft/applied reducer
    editor/          visual color picker, HEX/RGB, profile-level controls
    protocol/        pure static-candidate RGB frame encoder
  profiles/
    model/           portable profile factory and runtime schema
    application/     bounded import parsing
    persistence/     atomic local writes and recoverable corrupt entries
    interface/       profile rows, actions and protected dialogs
  keyboard/
    model/           69 physical positions, independent of LED slots
    interface/       original vector whole-board preview
  preferences/
    language/        English/Spanish copy
    persistence/     local language preference
  device/
    detection/       explicit sysfs identity/descriptor inspection
    connection/      operation/generation guard, no auto-reconnect writes
    transport/       offline adapter, bounded child client, Python fd-bound probe
```

The renderer cannot supply filesystem paths, HID payloads or device nodes through preload. Main explicitly composes only the offline adapter. The CLI is separate; before any write its Python child validates VID/PID and report descriptor using ioctl on the exact opened fd, then sends at most one report. Missing Python, unsupported architecture, mismatch, cancellation or timeout fails closed; none triggers an alternative command or permission mutation.

Node modules use runtime schema validation, syntax and focused behavior checks. TypeScript covers the renderer and shared contracts. There is no main/preload compilation step.

Local saving, editing, simulation, transport acceptance and physical visual confirmation remain different events. Reconnection does not change adapters or unlock Apply.

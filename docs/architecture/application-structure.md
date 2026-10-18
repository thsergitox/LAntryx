# Proposed application structure

**Proposal only.** These directories describe responsibility boundaries; they are not existing implementation files or package names.

```text
src/
  desktop/
    lifecycle/        window lifecycle and local-content policy
    bridge/           preload actions and validated IPC handlers
    composition/      connects application services to adapters
  lighting/
    model/            validated settings and supported capabilities
    editor/           draft state and lighting controls
    application/      apply action and pending/applied snapshots
    protocol/         pure encoding, no I/O or UI imports
  device/
    detection/        identity, interface and descriptor checks
    access/           permission state and scoped recovery guidance
    transport/        offline adapter; later, gated real HID adapter
    connection/       connection generations, queue and cancellation
  profiles/
    model/            portable, versioned profile data
    application/      save/load/import/export actions
    persistence/      atomic local files and import validation
    interface/        sidebar and profile management
  keyboard/
    model/            physical layout independent of LED-slot mapping
    interface/        keyboard preview and future key selection
  preferences/
    language/         English/Spanish choice and translations
    persistence/      local application preferences
```

UI-specific components stay with the feature they serve. Extract a shared component only after real duplication, not into an empty `utils/` or speculative design-system package.

## Dependency direction

```text
Renderer → preload action → application service → adapter
                  validation       ↓
                           pure domain/protocol
```

The desktop composition root chooses the adapter. A renderer input cannot select arbitrary USB paths or raw commands. Domain code must not import Electron, React, filesystem APIs or a native HID library.

## Initial adapter policy

Offline mode is explicit, visible and the only default before hardware verification. It can simulate connection, permission and apply errors, but must not be used as evidence that a keyboard operation succeeded.

Real HID access remains an experimental implementation gate. Future device discovery is a read operation; applying a color is an explicit user action, never a consequence of rendering, importing, saving or reconnecting.

## Local profile workflow

`select → draft → preview → save locally` is independent of `apply to device`. Pending changes and the last applied snapshot are distinct so a failed transfer cannot silently mark an unapplied configuration as active.

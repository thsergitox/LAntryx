# Security and device safety

An experimental offline desktop editor exists. There is no packaged release or physically verified keyboard-control support.

Use GitHub private vulnerability reporting once the maintainer enables it. Until that channel is configured, do not post secrets, sensitive captures or exploitable details publicly; contact the maintainer through a previously agreed private channel. No security email address is invented here.

## Design requirements

- Never run the whole application as root.
- No automatic hardware writes during startup, import, profile selection or reconnection.
- No firmware, bootloader, macro or key-matrix commands in the lighting MVP.
- No permanent permission rules installed without explicit opt-in.
- Bounded, validated IPC and profile data; no arbitrary HID payload endpoint exposed to the renderer.
- No remote content in the application renderer and no automatic loading of code from imported profiles.
- Raw USB captures and logs are private until reviewed for keystrokes, paths and unrelated traffic.

An unexpected transfer error is a reason to stop, not retry indefinitely.

# LAntryx

**Your keyboard. Your color. On Linux.**

An independent lighting editor for the Antryx MK825 TRIX: a visual RGB picker, a 69-key preview and profiles that stay on your computer.

[Español](README.es.md) · [Contributing](CONTRIBUTING.md) · [Hardware test guide](docs/verification/hardware-session.md) · [Protocol research](docs/research/protocol-status.md)

![Running LAntryx offline desktop editor in Spanish, showing a visual color picker and keyboard preview](docs/design/screenshots/offline-desktop.png)

> **Experimental / offline-first.** The desktop editor works. No physical color-change test has passed yet. The ordinary “Apply to keyboard” action is intentionally disabled; a separate, manually confirmed experiment is available for the hardware owner.

## Working offline

- Click or drag the color area and hue slider, use the keyboard, enter HEX/RGB or choose a swatch.
- See the selected color across an original Spanish-layout 69-key illustration.
- Create, rename, duplicate, delete, import and export local profiles.
- Switch between English and Spanish; physical key legends remain Spanish.
- Save brightness/off intentions in profiles, without pretending those hardware capabilities are verified.
- Exercise an explicitly labeled simulation. It never opens a keyboard or reports physical success.

Editing a color, saving a profile and applying to hardware are separate operations. Startup and ordinary UI actions do not enumerate or open HID devices.

## Run the development app

Linux desktop; Node.js **22.12+** (tested with 22.22.0) and npm. There is no installer or packaged release yet.

```sh
npm ci --ignore-scripts
node node_modules/electron/install.js
npm run dev:offline
```

The Electron installation command downloads the release binary; it does not compile this project. Dependency lifecycle scripts remain disabled, including node-hid's native-compilation fallback. Do not run the application with `sudo` or disable its sandbox. A native-addon load problem does not prevent offline editing.

Profiles/preferences live in Electron's per-user application-data directory. Native file dialogs choose import/export destinations. An export contains the **saved** profile, not an unsaved editor draft. Imported profiles receive a new ID.

## Checks, not builds

```sh
npm run typecheck
npm run check
npm run hardware:check -- --dry-run
```

These commands perform no production build and no real HID operations. See the [verification record](docs/verification/software-checks.md) for actual checks and limitations.

## When the keyboard owner is present

Start with the [hardware session guide](docs/verification/hardware-session.md). Read-only identification and the active experiment are separate commands. The probe sends at most one statically reconstructed RGB candidate frame; initialization, physical LED mapping and persistence remain unknown. No retries, firmware commands, key remapping, automatic permission changes or profile-write commands are implemented.

Matching USB `258a:0049` is not enough: the specific interface and descriptor fingerprint must also match. Do not copy settings from another keyboard with the same ID.

## Roadmap

1. Physically validate one uniform color, channel order and any initialization prerequisite.
2. Validate brightness and off separately, then enable proven UI capabilities.
3. Add verified effects, speed and per-key control incrementally.
4. Package for Linux after a separately authorized packaging phase.

## Open source and independence

Original project code is [MIT licensed](LICENSE). Third-party dependencies retain their own licenses. Antryx names identify the intended product; LAntryx is not affiliated with or endorsed by Antryx. No vendor binary, firmware, extracted logo, decompiler dump or unreviewed USB capture is distributed.

The image above is the real **running offline UI**, not a photograph of the physical keyboard. The requested product photograph is pending an owner-created or redistribution-cleared source; see [asset provenance](docs/design/assets.md). The [earlier static sketch](docs/design/preview/README.md) is retained as design history, not the application.

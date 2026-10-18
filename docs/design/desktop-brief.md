# Desktop direction — draft

**Surface:** main lighting window. **Mode:** Operate. **Status:** direction implemented in the offline app; hardware behavior remains unverified.

The owner accepted the proposal and requested implementation with a visual color picker. This document describes direction, not a working application. Existing screenshots constrain the topology: profile sidebar, dominant keyboard and lighting controls. They do not require proprietary textures or the ornamental Windows frame.

## Job and scene

A Linux keyboard owner wants one clear color, with a reliable distinction between a preview and a real device change. The main task should be obvious before the visual language is noticed. The intended scene is a desktop workstation, including Hyprland and fractional scaling.

## Proposed world and first viewport

The selected draft takes the precision of a labeled color-sample collection: a green-tinted graphite workspace, porcelain keycaps and one selected color echoed exactly between the large swatch and every key. The interface remains a desktop editor, never a sample-book costume.

The first viewport shows device/preview status first, profiles at left, the 69-key preview across the upper workspace, controls underneath and a persistent action row. The signature is **one color, one board**: editing a color changes the whole keyboard preview, while a separate pending marker states that nothing has been sent.

## Considered directions

Seven grounded sources were considered, in order: restrained gaming-product identity; photographic contact-sheet alignment; museum collection labeling; contemporary color-catalog typography; architectural material-library indexing; compact editorial captions; labeled color-sample collections. The seed assigned the seventh, subject to the owner's reference constraints. This is a provisional direction, not a user selection.

Catalog challenges were assessed only on audience identification and product clarity:

- **Variable-font specimen:** competitive in clarity, weaker audience identification. Retain exact numeric feedback and immediate preview, not oversized display lettering or glyph navigation.
- **Orienteering map:** declined on both. Its discipline raises the draft by keeping physical layout geometry fixed and applying selection as a separate overlay; no map colors or terrain symbols.
- **Monochrome product marketing:** declined on both for a working editor. Its discipline raises the draft by pairing every capability claim with a visible state; no marketing sections.
- **Centre-rail reference setting:** declined on both. Its discipline raises grouping and alignment; no serif apparatus or marginal-navigation costume.
- **Airport signage:** declined on both. Its discipline raises disconnection/recovery visibility; no yellow sign bands or monumental numbers.
- **Boarding-pass/gate board:** declined on both. Its discipline raises stable profile identity and pending-state persistence; no travel motifs.

The owner's pinned functional layout takes precedence over any source topology. No decision page is left waiting for an unattended selection. Alternatives remain review material when the owner returns.

## Layout and hierarchy

- Default target: 1180 × 780 logical pixels; review sketch also checked at 1440 × 900.
- Minimum proposed window: 960 × 680; narrower content scrolls structurally rather than shrinking text.
- Sidebar: about 208 px, wordmark, profile rows and secondary settings.
- Main area: task heading, explicit status, full-width keyboard, then a two-column lighting editor.
- Controls: effect selection, HEX/RGB, swatches, verified brightness levels; speed appears only for a supported effect.
- Action row: local-save action and separate hardware-apply action, plus pending/applied text.
- Lower heights permit workspace scrolling while preserving the action row.

## Visual vocabulary — proposed tokens

| Role | Draft value |
|---|---|
| Window ground | `#121916` |
| Workspace | `#19221D` |
| Sidebar | `#102019` |
| Raised controls | `#243129` |
| Main text | `#EEF5EE` |
| Secondary text | `#B8C5BA` |
| Action accent | `#B9EF83` |
| Preview color, illustrative | `#98D6A0` |
| Keycaps | `#E7ECE2` |
| Key legends | `#25362A` |

Use a single readable system sans for the working interface. A compact 13–14 px control scale, 16 px section labels and a 26–28 px task title. Tabular numerals for RGB and brightness. Project identity is typographic, not a copied vendor logo.

RGB light belongs to the preview and selected swatch, not page-wide neon, decorative gradients or random glow. Familiar control semantics, clear focus, aligned labels and consistent spacing matter more than novelty.

## Interaction contract

1. Choose a profile: load draft, do not transmit.
2. Edit color: update preview and show pending changes.
3. Save profile: local persistence only.
4. Apply: requires a validated device capability; show bounded progress and an honest outcome.

Import/export is secondary, not part of every editing gesture. Profile delete needs protected confirmation; ordinary color edits do not need a modal. Restore must say exactly whether it restores the editor or changes hardware; there is no ambiguous factory-reset button.

## States and accessibility

Design disconnected, checking, permission-denied, unverified-device, ready, applying, failed, unknown-outcome and saved-local states. Offline preview is not a green connected badge. Unsupported effects show a reason and cannot transmit.

The keyboard is an original vector layout. Before per-key support is validated, keys are preview geometry rather than 69 fake interactive buttons. Later selection supports focus and non-color-only indication. All fields and status text are localized; Spanish key legends are independent.

Target text contrast is at least 4.5:1. Use visible focus, standard keyboard interactions and reduced-motion support. The static sketch cannot verify interaction behavior; that belongs to later implementation checks.

## Review artifact

`preview/index.html` is a nonfunctional, no-JavaScript design sketch. Profile names, selected color and level values are illustrative. No device is accessed, no native title-bar behavior is simulated and no controls claim to work.

The direction is accepted; the implementation plan still needs review before functional UI work. The static sketch remains historical evidence of the proposed layout, not proof that the new color picker or any other function exists.

## Requested visual color picker

Use a saturation/value square with a draggable marker and a separate hue slider. Click or drag to choose a color without entering numbers. Keep HEX, RGB, swatches and the whole-board preview synchronized; do not expose transparency. Retain the last hue when choosing gray or black so returning to a saturated color is predictable.

Place the picker inline in the Color section, not in a clipped custom popup. Support labeled keyboard controls and visible focus. A color-spectrum gradient is functional input here, not decorative page styling. RGB remains the canonical stored value, rounded to integer channels 0–255; draft picker coordinates may preserve hue while editing. No picker gesture applies settings to hardware.

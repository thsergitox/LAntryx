# Static desktop proposal

Open `index.html` directly in a browser. This is a design artifact, not application code: no JavaScript, network requests or USB integration. Every form control is disabled intentionally.

The interface and vector keyboard were authored for this proposal. Keyboard geometry was transcribed from the owner's installed layout configuration, with manually assigned Spanish legends; it is an illustration, not a validated LED-slot or key-remapping table. No vendor bitmap, logo or binary is embedded.

The PNG files are Chromium captures of this HTML, not generated photographs. Profiles, color and brightness are illustrative. They carry no claim of hardware compatibility. The physical product photograph requested for the README is still pending provenance and redistribution review.

## Review performed

Checked at 1440×900, 1180×780 and 960×680 logical-pixel viewports. Captures are full-page images: their height can exceed the viewport. No horizontal document overflow was observed at those widths; each view contains 69 illustrated keys, zero scripts and zero enabled controls. Measurements are recorded in `visual-checks.json`.

The static document uses page scrolling. The eventual desktop app must implement independently scrolling workspace content with a persistent action row; these captures do not verify that interaction, localization switching, focus behavior or real hardware state.

Review and approve the visual direction before converting this artifact into application components. Do not treat disabled example controls as implemented features.

After the review, supporting UI text was raised to a minimum of 12 px (physical key legends remain scaled vector illustration). The Impeccable mechanical detector reported no remaining findings. Measured contrast for main text, secondary text on workspace/sidebar, and key legends exceeds 9:1; this checks those four token pairs, not every future interaction state. Relative Markdown links were also checked. No build or hardware test was run.

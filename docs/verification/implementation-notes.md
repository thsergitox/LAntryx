# Implementation decisions and remaining work

The owner approved the written plan and native execution. An independent whole-branch review found six important issues, all corrected in one pass and covered by focused checks plus actual-Electron regression checks. No critical issue was reported. See [verification](software-checks.md).

## Decisions made during execution

- Work in the sole fresh checkout on `feat/offline-editor`, not an unrequested extra worktree. Cost: branch-only isolation; there were no concurrent implementers.
- Use proportional focused verification instead of mandatory TDD/framework setup, honoring the owner's explicit preference. Cost: no red-first cycle for the initial implementation; the corrupt-profile and operation-concurrency regressions were subsequently observed failing before their fixes.
- Commit the mutually dependent first runnable shell/profile/editor/device-boundary milestone together. Cost: coarser initial history.
- Type-check renderer/shared contracts; runtime-validate, syntax-check and behavior-check the Node backend. Cost: less backend static checking, not a claim of fully typed JavaScript.
- Keep normal hardware Apply disabled and put the first experiment in a separate interactive CLI. Cost: the first hardware session is manual, not a one-click unverified command.
- Use MIT for original code under the accepted open-source proposal. Cost: permissive downstream reuse rather than copyleft requirements; third-party and vendor material keep their own terms.
- Publish only the project-authored running UI screenshot. Cost: the requested physical keyboard photo remains pending a cleared or owner-created image.
- Replace node-hid with a direct Python 3 ioctl child for the experiment because validation must apply to the exact opened descriptor. Cost: Python 3 for checks/probe and Linux x86_64-only experimental I/O; offline UI has no Python/native-addon dependency.
- Treat the session helper's checks as separate from live CLI cancellation. The direct child has an independent timeout and fd identity checks. Cost: real physical behavior is still an owner-present validation task.
- Leave protocol initialization, effects, per-key hardware color, brightness/off, persistence and packaging unverified. Cost: these functions are not unlocked or advertised as working on hardware.

- Initial publication sends the verified feature HEAD to the new repository’s remote `main`, as requested; no existing shared branch was merged and no PR was created. Cost: the local checkout remains named `feat/offline-editor`, tracking remote main.

## Deferred minor review findings

1. Color input validation uses a shared invalid flag; RGB fields need the same error association as HEX and per-field error state.
2. The generic busy action label says Saving even for simulation, import/export and language changes.

Neither permits hardware access or loses a draft. They remain deliberate follow-up polish, not silently omitted review feedback.

## Next session

Run the offline editor, then follow the [owner-present guide](hardware-session.md). First inspect identity, agree on one bounded frame test, observe its actual effect, and stop on anomalies. Never work around unknown initialization by scanning report IDs, replaying full profiles or adding root access.

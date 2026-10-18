import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { parseHex, formatHex } from "../src/lighting/model/color.mjs";
import {
  createEditorState,
  reduceEditor,
} from "../src/lighting/model/editor-state.mjs";
const { createProfile } = createRequire(import.meta.url)(
  "../src/profiles/model/schema.cjs",
);
assert.deepEqual(parseHex("#ff0080"), { r: 255, g: 0, b: 128 });
assert.equal(formatHex({ r: 0, g: 128, b: 255 }), "#0080FF");
for (const value of ["#fff", "xxxxxx", "#1234567", " #123456"])
  assert.equal(parseHex(value), null);
const profile = createProfile();
let state = createEditorState(profile);
state = reduceEditor(state, {
  type: "edit-color",
  color: { r: 255, g: 0, b: 0 },
});
assert.equal(state.dirty, true);
assert.deepEqual(state.saved, profile);
assert.equal(state.lastApplied, null);
const changed = { ...profile, lighting: structuredClone(state.draft) };
state = reduceEditor(state, { type: "save-local", profile: changed });
assert.equal(state.dirty, false);
for (const outcome of ["simulated", "failed", "unknown"]) {
  state = reduceEditor(state, {
    type: "apply-result",
    lighting: state.draft,
    result: { outcome, generation: 0, message: "" },
  });
  assert.equal(state.lastApplied, null);
}
state = reduceEditor(state, {
  type: "apply-result",
  lighting: state.draft,
  result: { outcome: "transport-accepted", generation: -1, message: "" },
});
assert.equal(state.lastApplied, null);
state = reduceEditor(state, {
  type: "edit-color",
  color: { r: 0, g: 0, b: 255 },
});
state = reduceEditor(state, { type: "save-local", profile: changed });
assert.equal(state.dirty, true);
assert.equal(state.draft.color.b, 255);
console.log(
  "PASS editor: HEX boundaries, draft/save isolation, simulated/failed/stale result rejection",
);

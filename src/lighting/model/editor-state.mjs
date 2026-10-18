/** @typedef {import('../../desktop/bridge/contracts').Profile} Profile */
/** @typedef {import('../../desktop/bridge/contracts').EditorState} EditorState */
/** @typedef {import('../../desktop/bridge/contracts').EditorAction} EditorAction */
/** @param {Profile} profile @returns {EditorState} */
export function createEditorState(profile) {
  return {
    saved: structuredClone(profile),
    draft: structuredClone(profile.lighting),
    lastApplied: null,
    dirty: false,
    generation: 0,
  };
}
/** @param {EditorState} state @param {EditorAction} action @returns {EditorState} */
export function reduceEditor(state, action) {
  if (action.type === "load-profile")
    return {
      ...createEditorState(action.profile),
      lastApplied: state.lastApplied,
      generation: state.generation,
    };
  if (action.type === "save-local")
    return {
      ...state,
      saved: structuredClone(action.profile),
      dirty:
        JSON.stringify(state.draft) !== JSON.stringify(action.profile.lighting),
    };
  if (action.type === "apply-result") {
    return action.result.outcome === "transport-accepted" &&
      action.result.generation === state.generation
      ? { ...state, lastApplied: structuredClone(action.lighting) }
      : state;
  }
  const draft = { ...state.draft };
  if (action.type === "edit-color") draft.color = { ...action.color };
  if (action.type === "edit-brightness") draft.brightness = action.brightness;
  if (action.type === "edit-enabled") draft.enabled = action.enabled;
  return {
    ...state,
    draft,
    dirty: JSON.stringify(draft) !== JSON.stringify(state.saved.lighting),
  };
}

import type { Dispatch } from "react";
import type {
  Profile,
  EditorState,
  EditorAction,
} from "../../desktop/bridge/contracts";
import type { Copy } from "../../preferences/language/en";
import { newProfile } from "../model/factory";
interface Context {
  state: EditorState;
  dispatch: Dispatch<EditorAction>;
  run: (action: () => Promise<void>) => Promise<void>;
  refresh: () => Promise<void>;
  setProfiles: (values: Profile[]) => void;
  setNotice: (notice: string) => void;
  t: Copy;
}
export function createProfileActions({
  state,
  dispatch,
  run,
  refresh,
  setProfiles,
  setNotice,
  t,
}: Context) {
  return {
    save: () =>
      run(async () => {
        const profile = {
          ...state.saved,
          lighting: structuredClone(state.draft),
        };
        await window.lantryx.profiles.save(profile);
        dispatch({ type: "save-local", profile });
        await refresh();
      }),
    create: (name: string) =>
      run(async () => {
        const profile = newProfile(name);
        await window.lantryx.profiles.save(profile);
        await refresh();
        dispatch({ type: "load-profile", profile });
      }),
    rename: (name: string) =>
      run(async () => {
        const profile = { ...state.saved, name };
        await window.lantryx.profiles.save(profile);
        dispatch({ type: "save-local", profile });
        await refresh();
      }),
    duplicate: () =>
      run(async () => {
        const profile = {
          ...state.saved,
          id: crypto.randomUUID(),
          name: `${state.saved.name.slice(0, 54)} ${t.copy}`,
          lighting: structuredClone(state.draft),
        };
        await window.lantryx.profiles.save(profile);
        await refresh();
        dispatch({ type: "load-profile", profile });
      }),
    remove: () =>
      run(async () => {
        await window.lantryx.profiles.remove(state.saved.id);
        let values = await window.lantryx.profiles.list();
        if (!values.length) {
          const profile = newProfile(t.defaultName);
          await window.lantryx.profiles.save(profile);
          values = [profile];
        }
        setProfiles(values);
        dispatch({ type: "load-profile", profile: values[0] });
        setNotice("deleted");
      }),
    import: () =>
      run(async () => {
        const profile = await window.lantryx.profiles.import();
        if (profile) {
          await refresh();
          dispatch({ type: "load-profile", profile });
          setNotice("imported");
        }
      }),
    export: () =>
      run(async () => {
        if (await window.lantryx.profiles.export(state.saved.id))
          setNotice("exported");
      }),
  };
}

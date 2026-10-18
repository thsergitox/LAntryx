import { createProfileActions } from "../../profiles/interface/actions";
import { useEffect, useReducer, useState } from "react";
import {
  createEditorState,
  reduceEditor,
} from "../../lighting/model/editor-state.mjs";
import { newProfile } from "../../profiles/model/factory";
import type { Profile } from "../bridge/contracts";
import { es } from "../../preferences/language/es";
import { en } from "../../preferences/language/en";
export function useWorkspace() {
  const [state, dispatch] = useReducer(
    reduceEditor,
    newProfile("Mi perfil"),
    createEditorState,
  );
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [language, setLanguage] = useState<"en" | "es">("es");
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const t = language === "en" ? en : es;
  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await action();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "storage-error");
    } finally {
      setBusy(false);
    }
  }
  async function refresh() {
    setProfiles(await window.lantryx.profiles.list());
  }
  function mayDiscard() {
    return !state.dirty || window.confirm(t.discard);
  }
  async function bootstrap() {
    await run(async () => {
      const [prefs, list] = await Promise.all([
        window.lantryx.preferences.get(),
        window.lantryx.profiles.list(),
      ]);
      setLanguage(prefs.language);
      let values = list;
      if (!values.length) {
        const profile = newProfile(
          prefs.language === "en" ? en.defaultName : es.defaultName,
        );
        await window.lantryx.profiles.save(profile);
        values = [profile];
      }
      setProfiles(values);
      dispatch({ type: "load-profile", profile: values[0] });
    });
  }
  useEffect(() => {
    void bootstrap();
  }, []);
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  useEffect(() => {
    const protect = (event: BeforeUnloadEvent) => {
      if (state.dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", protect);
    return () => window.removeEventListener("beforeunload", protect);
  }, [state.dirty]);
  return {
    state,
    dispatch,
    profiles,
    language,
    busy,
    error,
    notice,
    t,
    bootstrap,
    mayDiscard,
    select: (profile: Profile) => {
      if (mayDiscard()) dispatch({ type: "load-profile", profile });
    },
    setLanguage: (value: "en" | "es") =>
      run(async () => {
        await window.lantryx.preferences.set(value);
        setLanguage(value);
      }),
    ...createProfileActions({
      state,
      dispatch,
      run,
      refresh,
      setProfiles,
      setNotice,
      t,
    }),
    simulate: () =>
      run(async () => {
        const result = await window.lantryx.device.simulate(state.draft);
        if (result.outcome === "simulated") setNotice("simulated");
      }),
  };
}

import { WorkspaceHeader } from "./WorkspaceHeader";
import { WorkspaceFeedback } from "./WorkspaceFeedback";
import { useState } from "react";
import { I18nProvider } from "react-aria-components";
import { useWorkspace } from "./useWorkspace";
import { ProfileSidebar } from "../../profiles/interface/ProfileSidebar";
import { ProfileDialog } from "../../profiles/interface/ProfileDialog";
import { KeyboardPreview } from "../../keyboard/interface/KeyboardPreview";
import { LightingEditor } from "../../lighting/editor/LightingEditor";
import { ActionBar } from "./ActionBar";
export function App() {
  const w = useWorkspace();
  const { t } = w;
  const [dialog, setDialog] = useState<"create" | "rename" | "remove" | null>(
    null,
  );
  function action(
    value: "create" | "rename" | "duplicate" | "remove" | "import" | "export",
  ) {
    if (["create", "import", "duplicate"].includes(value) && !w.mayDiscard())
      return;
    if (value === "create" || value === "rename" || value === "remove")
      setDialog(value);
    else void w[value]();
  }
  return (
    <I18nProvider locale={w.language}>
      <div className="application">
        <ProfileSidebar
          profiles={w.profiles}
          selected={w.state.saved.id}
          busy={w.busy}
          t={t}
          onSelect={w.select}
          onAction={action}
        />
        <main className="workspace">
          <div className="workspace-scroll">
            <WorkspaceHeader
              language={w.language}
              busy={w.busy}
              t={t}
              onLanguage={(value) => void w.setLanguage(value)}
              onSimulate={() => void w.simulate()}
            />
            <WorkspaceFeedback
              error={w.error}
              notice={w.notice}
              busy={w.busy}
              t={t}
              onRetry={() => void w.bootstrap()}
            />
            {w.busy && !w.profiles.length ? (
              <p className="loading" role="status">
                {t.loading}
              </p>
            ) : (
              <>
                <KeyboardPreview lighting={w.state.draft} t={t} />
                <LightingEditor
                  lighting={w.state.draft}
                  dispatch={w.dispatch}
                  t={t}
                />
              </>
            )}
          </div>
          <ActionBar
            dirty={w.state.dirty}
            busy={w.busy}
            t={t}
            onSave={() => void w.save()}
          />
        </main>
        {dialog ? (
          <ProfileDialog
            key={dialog}
            title={dialog === "remove" ? t.deleteTitle : t[dialog]}
            initial={
              dialog === "remove"
                ? null
                : dialog === "create"
                  ? t.defaultName
                  : w.state.saved.name
            }
            t={t}
            onClose={() => setDialog(null)}
            onConfirm={(name) => {
              const value = dialog;
              setDialog(null);
              if (value === "remove") void w.remove();
              else void w[value](name);
            }}
          />
        ) : null}
      </div>
    </I18nProvider>
  );
}

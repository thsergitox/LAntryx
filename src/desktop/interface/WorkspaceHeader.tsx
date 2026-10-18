import type { Copy } from "../../preferences/language/en";
export function WorkspaceHeader({
  language,
  busy,
  t,
  onLanguage,
  onSimulate,
}: {
  language: "en" | "es";
  busy: boolean;
  t: Copy;
  onLanguage: (value: "en" | "es") => void;
  onSimulate: () => void;
}) {
  return (
    <>
      {" "}
      <header className="topbar">
        <div>
          <h1>{t.lighting}</h1>
          <p>{t.layout}</p>
        </div>
        <label className="language">
          <span className="sr-only">{t.language}</span>
          <select
            aria-label={t.language}
            value={language}
            disabled={busy}
            onChange={(event) => onLanguage(event.target.value as "en" | "es")}
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </label>
      </header>
      <div className="connection-state">
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <rect x="2" y="3" width="16" height="11" rx="2" />
          <path d="M7 17h6M10 14v3" />
        </svg>
        <div>
          <strong>{t.offline}</strong>
          <span>{t.offlineDetail}</span>
        </div>
        <button disabled={busy} onClick={() => onSimulate()}>
          {t.simulate}
        </button>
      </div>
    </>
  );
}

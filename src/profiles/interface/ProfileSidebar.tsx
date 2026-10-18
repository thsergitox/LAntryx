import type { Profile } from "../../desktop/bridge/contracts";
import type { Copy } from "../../preferences/language/en";
import { formatHex } from "../../lighting/model/color.mjs";
export function ProfileSidebar({
  profiles,
  selected,
  busy,
  t,
  onSelect,
  onAction,
}: {
  profiles: Profile[];
  selected: string;
  busy: boolean;
  t: Copy;
  onSelect: (profile: Profile) => void;
  onAction: (
    action: "create" | "rename" | "duplicate" | "remove" | "import" | "export",
  ) => void;
}) {
  return (
    <aside className="sidebar">
      <div>
        <p className="wordmark">
          <span>L</span>Antryx
        </p>
        <p className="brand-description">{t.tagline}</p>
      </div>
      <div className="profiles-heading">
        <h2>{t.profiles}</h2>
        <button
          className="icon-button"
          aria-label={t.create}
          disabled={busy}
          onClick={() => onAction("create")}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10 4v12M4 10h12" />
          </svg>
        </button>
      </div>
      <nav className="profile-list" aria-label={t.profiles}>
        {profiles.map((profile) => (
          <button
            className={`profile ${profile.id === selected ? "selected" : ""}`}
            key={profile.id}
            aria-current={profile.id === selected ? "true" : undefined}
            disabled={busy}
            onClick={() => onSelect(profile)}
          >
            <span
              className="profile-dot"
              style={{ background: formatHex(profile.lighting.color) }}
            />
            <span>{profile.name}</span>
          </button>
        ))}
      </nav>
      <div className="profile-tools">
        {(["rename", "duplicate", "remove"] as const).map((action) => (
          <button
            key={action}
            disabled={busy || !profiles.length}
            onClick={() => onAction(action)}
          >
            {t[action]}
          </button>
        ))}
      </div>
      <div className="sidebar-bottom">
        <button disabled={busy} onClick={() => onAction("import")}>
          {t.import}
        </button>
        <button
          disabled={busy || !profiles.length}
          onClick={() => onAction("export")}
        >
          {t.export}
        </button>
        <p>{t.localNote}</p>
        <span className="version">{t.version}</span>
      </div>
    </aside>
  );
}

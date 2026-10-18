import type { Copy } from "../../preferences/language/en";
export function ActionBar({
  dirty,
  busy,
  t,
  onSave,
}: {
  dirty: boolean;
  busy: boolean;
  t: Copy;
  onSave: () => void;
}) {
  return (
    <footer className="action-bar">
      <div>
        <p>{dirty ? t.pending : t.saved}</p>
        <span>{t.hardwarePending}</span>
      </div>
      <div className="action-buttons">
        <button disabled={busy || !dirty} onClick={onSave}>
          {busy ? t.busy : t.save}
        </button>
        <button className="primary" disabled aria-describedby="usb-reason">
          {t.apply}
        </button>
      </div>
      <span id="usb-reason" className="sr-only">
        {t.hardwarePending}
      </span>
    </footer>
  );
}

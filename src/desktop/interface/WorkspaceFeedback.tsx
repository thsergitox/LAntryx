import type { Copy } from "../../preferences/language/en";
export function WorkspaceFeedback({
  error,
  notice,
  busy,
  t,
  onRetry,
}: {
  error: string;
  notice: string;
  busy: boolean;
  t: Copy;
  onRetry: () => void;
}) {
  return (
    <>
      {" "}
      <div aria-live="polite">
        {error ? (
          <div className="feedback error" role="alert">
            {error === "invalid-profile" ? t.invalidProfile : t.storageError}
            <button disabled={busy} onClick={() => onRetry()}>
              {t.retry}
            </button>
          </div>
        ) : null}
        {notice ? (
          <p className="feedback">
            {t[notice as "simulated" | "deleted" | "imported" | "exported"]}
          </p>
        ) : null}
      </div>
    </>
  );
}

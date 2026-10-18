import { useEffect, useRef, useState } from "react";
import type { Copy } from "../../preferences/language/en";
export function ProfileDialog({
  title,
  initial,
  onConfirm,
  onClose,
  t,
}: {
  title: string;
  initial: string | null;
  onConfirm: (name: string) => void;
  onClose: () => void;
  t: Copy;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [name, setName] = useState(initial ?? "");
  const valid =
    name.length > 0 &&
    name.length <= 64 &&
    name === name.trim() &&
    !/[\x00-\x1f\x7f]/.test(name);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog ref={ref} onCancel={onClose} aria-labelledby="dialog-title">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (initial === null || valid) onConfirm(name);
        }}
      >
        <h2 id="dialog-title">{title}</h2>
        {initial === null ? (
          <p>{t.deleteDetail}</p>
        ) : (
          <label>
            {t.name}
            <input
              autoFocus
              value={name}
              maxLength={64}
              onChange={(event) => setName(event.target.value)}
            />
            {!valid ? <span className="field-error">{t.nameError}</span> : null}
          </label>
        )}
        <div className="dialog-actions">
          <button type="button" onClick={onClose}>
            {t.cancel}
          </button>
          <button
            className="primary"
            type="submit"
            disabled={initial !== null && !valid}
          >
            {t.confirm}
          </button>
        </div>
      </form>
    </dialog>
  );
}

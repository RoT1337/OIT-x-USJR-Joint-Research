import { useEffect, useState } from "react";
import type { Affiliation } from "../../types/LogEntry";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (affiliation: Affiliation) => void;
}

export function LoginModal({ isOpen, onClose, onLogin }: Props) {
  const [affiliation, setAffiliation] = useState<Affiliation>("USJR");

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Mock login"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close login"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg rounded-md border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Login (Mock)</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              No authentication is implemented. This sets a local session for prototyping.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
        </div>

        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onLogin(affiliation);
          }}
        >
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Affiliation</legend>

            <label className="flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200">
              <input
                type="radio"
                name="affiliation"
                value="USJR"
                checked={affiliation === "USJR"}
                onChange={() => setAffiliation("USJR")}
                autoFocus
              />
              USJR
            </label>

            <label className="flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200">
              <input
                type="radio"
                name="affiliation"
                value="OIT"
                checked={affiliation === "OIT"}
                onChange={() => setAffiliation("OIT")}
              />
              OIT
            </label>
          </fieldset>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
            >
              Close
            </button>
            <button
              type="submit"
              className="inline-flex items-center rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-900 hover:bg-sky-100 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-100 dark:hover:bg-sky-950/50"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

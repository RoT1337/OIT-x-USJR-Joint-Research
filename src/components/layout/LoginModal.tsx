import { useEffect, useState } from "react";
import type { Affiliation } from "../../types/LogEntry";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../i18n/translations";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (affiliation: Affiliation) => void;
}

export function LoginModal({ isOpen, onClose, onLogin }: Props) {
  const [affiliation, setAffiliation] = useState<Affiliation>("USJR");

  const { language } = useLanguage();
  const t = translations[language];

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
      aria-label={t.login}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label={t.close}
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg rounded-md border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {t.login}
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              {t.loginDescription}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border px-2.5 py-1.5 text-sm"
          >
            {t.cancel}
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
            <legend className="text-sm font-medium">
              {t.affiliation}
            </legend>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={affiliation === "USJR"}
                onChange={() => setAffiliation("USJR")}
                autoFocus
              />
              USJR
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={affiliation === "OIT"}
                onChange={() => setAffiliation("OIT")}
              />
              OIT
            </label>
          </fieldset>

          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-md border px-3 py-1.5 text-sm">
              {t.close}
            </button>

            <button type="submit" className="rounded-md border px-3 py-1.5 text-sm">
              {t.continue}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
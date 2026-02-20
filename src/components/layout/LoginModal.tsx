import { useEffect, useState } from "react";
import type { ResearchLogAffiliation } from "../../types/ResearchLog";
import type { Language } from "../../context/LanguageContext";
import { translations } from "../../i18n/translations";

interface Props {
  isOpen: boolean;
  language: Language;
  onClose: () => void;
  onLogin: (affiliation: ResearchLogAffiliation) => void;
}

export function LoginModal({ isOpen, language, onClose, onLogin }: Props) {
  const t = translations[language];
  const [affiliation, setAffiliation] = useState<ResearchLogAffiliation>("USJR");

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label={t.close}
        onClick={onClose}
      />

      <div className="relative w-full max-w-md rounded-md border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{t.login}</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{t.loginDescription}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            {t.cancel}
          </button>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{t.affiliation}</p>
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
              <input
                type="radio"
                name="affiliation"
                value="USJR"
                checked={affiliation === "USJR"}
                onChange={() => setAffiliation("USJR")}
              />
              USJR
            </label>
            <label className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
              <input
                type="radio"
                name="affiliation"
                value="OIT"
                checked={affiliation === "OIT"}
                onChange={() => setAffiliation("OIT")}
              />
              OIT
            </label>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onLogin(affiliation)}
            className="inline-flex items-center rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-900 transition-colors hover:bg-sky-100 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-100 dark:hover:bg-sky-950/50"
          >
            {t.continue}
          </button>
        </div>
      </div>
    </div>
  );
}


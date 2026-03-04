import type { Language } from "../context/LanguageContext";
import { translations } from "../i18n/translations";

interface Props {
  language: Language;
  onLoginGoogle: () => void;
  onLoginMicrosoft: () => void;
}

export function LoginPage({ language, onLoginGoogle, onLoginMicrosoft }: Props) {
  const t = translations[language];

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-md border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{t.login}</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{t.loginRequiredDescription}</p>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onLoginGoogle}
            className="inline-flex items-center rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-900 transition-colors hover:bg-sky-100 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-100 dark:hover:bg-sky-950/50"
          >
            {t.continueWithGoogle}
          </button>
          <button
            type="button"
            onClick={onLoginMicrosoft}
            className="inline-flex items-center rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-900 transition-colors hover:bg-sky-100 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-100 dark:hover:bg-sky-950/50"
          >
            {t.continueWithMicrosoft}
          </button>
        </div>
      </div>
    </div>
  );
}

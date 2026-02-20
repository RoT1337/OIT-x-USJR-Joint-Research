import { ThemeToggle } from "./ThemeToggle";
import { translations } from "../../i18n/translations";
import type { Language } from "../../context/LanguageContext";
import type { ResearchLogAffiliation } from "../../types/ResearchLog";

interface Props {
  language: Language;
  onToggleLanguage: () => void;
  isLoggedIn: boolean;
  userLabel?: string;
  userAffiliation?: ResearchLogAffiliation | null;
  onRequestLogin: () => void;
  onRequestLogout?: () => void;
  onRequestAddEntry: () => void;
  isAddEntryOpen: boolean;
}

export function NavBar({
  language,
  onToggleLanguage,
  isLoggedIn,
  userLabel,
  userAffiliation,
  onRequestLogin,
  onRequestLogout,
  onRequestAddEntry,
  isAddEntryOpen,
}: Props) {
  const t = translations[language];

  return (
    <nav
      aria-label="Primary"
      className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            {isLoggedIn && userLabel ? (
              <span className="text-sm text-zinc-700 dark:text-zinc-200">
                Hello, {userLabel}
              </span>
            ) : null}

            {isLoggedIn && userAffiliation ? (
              <span className="hidden rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 sm:inline-flex">
                {t.affiliation}: {userAffiliation}
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleLanguage}
              className="inline-flex items-center rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
              aria-label="Toggle language"
              title="Toggle language"
            >
              {language === "en" ? "日本語" : "English"}
            </button>

            <button
              type="button"
              onClick={() => (isLoggedIn ? onRequestAddEntry() : onRequestLogin())}
              className={
                isLoggedIn
                  ? isAddEntryOpen
                    ? "rounded-md border border-emerald-300 bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-950 dark:border-emerald-900/70 dark:bg-emerald-950/60 dark:text-emerald-50"
                    : "rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-900 transition-colors hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100 dark:hover:bg-emerald-950/50"
                  : "rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-900 transition-colors hover:bg-blue-100 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-100 dark:hover:bg-blue-950/50"
              }
              title={isLoggedIn ? "Add entry" : "Login"}
            >
              {isLoggedIn ? t.addEntry : t.login}
            </button>

            {isLoggedIn && onRequestLogout ? (
              <button
                type="button"
                onClick={onRequestLogout}
                className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-900 transition-colors hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-100 dark:hover:bg-red-950/50"
                title={t.logout}
              >
                {t.logout}
              </button>
            ) : null}

            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
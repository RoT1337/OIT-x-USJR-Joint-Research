import { ThemeToggle } from "./ThemeToggle";
import { translations } from "../../i18n/translations";
import type { Language } from "../../context/LanguageContext";

export type PageKey = "timeline" | "about";

interface Props {
  activePage: PageKey;
  onNavigate: (page: PageKey) => void;
  language: Language;
  onToggleLanguage: () => void;
  isLoggedIn: boolean;
  onRequestLogin: () => void;
  onRequestAddEntry: () => void;
  isAddEntryOpen: boolean;
}

export function NavBar({
  activePage,
  onNavigate,
  language,
  onToggleLanguage,
  isLoggedIn,
  onRequestLogin,
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate("timeline")}
              className={
                activePage === "timeline"
                  ? "rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-900 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-100"
                  : "rounded-md border border-transparent px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
              }
            >
              {t.timeline}
            </button>

            <button
              type="button"
              onClick={() => onNavigate("about")}
              className={
                activePage === "about"
                  ? "rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-900 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-100"
                  : "rounded-md border border-transparent px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
              }
            >
              {t.about}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleLanguage}
              className="inline-flex items-center rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
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
                    ? "rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100"
                    : "rounded-md border border-transparent px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  : "rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
              }
              title={isLoggedIn ? "Add entry" : "Login"}
            >
              {isLoggedIn ? t.addEntry : t.login}
            </button>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
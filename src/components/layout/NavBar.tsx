import { ThemeToggle } from "./ThemeToggle";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../i18n/translations";

export type PageKey = "timeline" | "about";

interface Props {
  activePage: PageKey;
  onNavigate: (page: PageKey) => void;
  isLoggedIn: boolean;
  onRequestLogin: () => void;
  onRequestAddEntry: () => void;
  isAddEntryOpen: boolean;
}

export function NavBar({
  activePage,
  onNavigate,
  isLoggedIn,
  onRequestLogin,
  onRequestAddEntry,
  isAddEntryOpen,
}: Props) {
  const { language } = useLanguage();
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
              onClick={() =>
                isLoggedIn ? onRequestAddEntry() : onRequestLogin()
              }
              className={
                isLoggedIn
                  ? isAddEntryOpen
                    ? "rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100"
                    : "rounded-md border border-transparent px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  : "rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
              }
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
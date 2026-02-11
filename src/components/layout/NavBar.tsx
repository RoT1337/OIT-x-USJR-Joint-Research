import { ThemeToggle } from "./ThemeToggle";

export type PageKey = "timeline" | "about";

interface Props {
  activePage: PageKey;
  onNavigate: (page: PageKey) => void;
}

export function NavBar({ activePage, onNavigate }: Props) {
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
              Timeline
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
              About
            </button>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

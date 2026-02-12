import { TimelineFeed } from "../components/TimelineFeed";
import { useMemo, useState } from "react";
import type { Affiliation, LogEntry, ResearchCategory } from "../types/LogEntry";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../i18n/translations";

type SortOrder = "newest" | "oldest";
type AllOr<T extends string> = "all" | T;

const categories: ResearchCategory[] = ["Rectenna", "MPPT", "AI", "Meeting"];
const affiliations: Affiliation[] = ["USJR", "OIT"];

interface Props {
  entries: LogEntry[];
}

export function TimelinePage({ entries }: Props) {
  const { language } = useLanguage();
  const t = translations[language];

  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] =
    useState<AllOr<ResearchCategory>>("all");
  const [selectedAffiliation, setSelectedAffiliation] =
    useState<AllOr<Affiliation>>("all");

  const monthItems = useMemo(() => {
    const set = new Set<string>();
    for (const entry of entries) {
      if (typeof entry.date === "string" && entry.date.length >= 7) {
        set.add(entry.date.slice(0, 7));
      }
    }

    const keys = Array.from(set);
    keys.sort((a, b) => a.localeCompare(b));

    const formatter = new Intl.DateTimeFormat(
      language === "jp" ? "ja-JP" : undefined,
      { month: "short", year: "numeric" }
    );

    return keys.map((key) => {
      const [year, month] = key.split("-").map(Number);
      const label =
        Number.isFinite(year) && Number.isFinite(month)
          ? formatter.format(new Date(year, month - 1, 1))
          : key;
      return { key, label };
    });
  }, [entries, language]);

  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      if (selectedMonth !== "all" && !e.date.startsWith(selectedMonth))
        return false;
      if (selectedCategory !== "all" && e.category !== selectedCategory)
        return false;
      if (selectedAffiliation !== "all" && e.affiliation !== selectedAffiliation)
        return false;
      return true;
    });
  }, [entries, selectedMonth, selectedCategory, selectedAffiliation]);

  const sortedEntries = useMemo(() => {
    const copy = [...filteredEntries];
    copy.sort((a, b) => {
      const aTime = Date.parse(a.date);
      const bTime = Date.parse(b.date);
      return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
    });
    return copy;
  }, [filteredEntries, sortOrder]);

  return (
    <div className="md:grid md:grid-cols-[220px_1fr] md:gap-6">
      {/* Sidebar */}
      <aside className="md:pt-1">
        <nav aria-label="Months" className="md:sticky md:top-4">
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {t.months}
            </p>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
              {t.monthsHint}
            </p>
          </div>

          <ol className="mt-3 space-y-2 border-l border-zinc-200 pl-4 dark:border-zinc-800">
            <li>
              <button
                type="button"
                onClick={() => setSelectedMonth("all")}
                className={
                  selectedMonth === "all"
                    ? "relative -ml-[19px] flex w-full items-center gap-3 rounded-md border border-sky-200 bg-sky-50 px-2 py-1.5 text-left text-sm font-medium text-sky-900 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-100"
                    : "relative -ml-[19px] flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
                }
              >
                <span className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                {t.allMonths}
              </button>
            </li>

            {monthItems.map((m) => (
              <li key={m.key}>
                <button
                  type="button"
                  onClick={() => setSelectedMonth(m.key)}
                  className={
                    selectedMonth === m.key
                      ? "relative -ml-[19px] flex w-full items-center gap-3 rounded-md border border-sky-200 bg-sky-50 px-2 py-1.5 text-left text-sm font-medium text-sky-900 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-100"
                      : "relative -ml-[19px] flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  }
                >
                  <span className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                  {m.label}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </aside>

      {/* Main Section */}
      <section>
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {t.timeline}
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            {sortedEntries.length} {t.mockData}
            {selectedMonth !== "all" ||
            selectedCategory !== "all" ||
            selectedAffiliation !== "all"
              ? ` · ${t.filtered}`
              : ""}
          </p>
        </div>

        {/* Filters */}
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <label className="space-y-1">
            <span className="text-xs font-medium">{t.category}</span>
            <select
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(
                  e.target.value as AllOr<ResearchCategory>
                )
              }
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="all">{t.all}</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {t.categories[c]}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-xs font-medium">{t.affiliation}</span>
            <select
              value={selectedAffiliation}
              onChange={(e) =>
                setSelectedAffiliation(
                  e.target.value as AllOr<Affiliation>
                )
              }
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="all">{t.all}</option>
              {affiliations.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setSelectedMonth("all");
                setSelectedCategory("all");
                setSelectedAffiliation("all");
              }}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              {t.clearFilters}
            </button>
          </div>
        </div>

        {/* Sort */}
        <div className="mt-3 flex items-center justify-between border-b pb-3">
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {sortOrder === "newest" ? t.sortNewest : t.sortOldest}
          </p>
          <button
            type="button"
            onClick={() =>
              setSortOrder((prev) =>
                prev === "newest" ? "oldest" : "newest"
              )
            }
            className="rounded-md border px-3 py-1 text-sm"
          >
            {t.toggleSort}
          </button>
        </div>

        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
          {t.japanesePlaceholder}
        </p>

        <div className="mt-3">
          <TimelineFeed entries={sortedEntries} />
        </div>
      </section>
    </div>
  );
}
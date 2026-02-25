import { TimelineFeed } from "../components/TimelineFeed";
import { useEffect, useMemo, useState } from "react";
import type { Affiliation, LogEntry, ResearchCategory } from "../types/LogEntry";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../i18n/translations";

type SortOrder = "newest" | "oldest";
type WeekKey = "1" | "2" | "3" | "4" | "5";
type AllOrWeek = "all" | WeekKey;

const categories: ResearchCategory[] = ["Rectenna", "MPPT", "AI", "Meeting", "Other"];
const affiliations: Affiliation[] = ["USJR", "OIT"];

interface Props {
  entries: LogEntry[];
  onRefresh?: () => void;
  isRefreshing?: boolean;
  canEditEntry?: (entry: LogEntry) => boolean;
  onRequestEdit?: (entry: LogEntry) => void;
}

export function TimelinePage({ entries, onRefresh, isRefreshing, canEditEntry, onRequestEdit }: Props) {
  const { language } = useLanguage();
  const t = translations[language];

  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedWeek, setSelectedWeek] = useState<AllOrWeek>("all");
  const [selectedCategories, setSelectedCategories] = useState<ResearchCategory[]>([]);
  const [selectedAffiliations, setSelectedAffiliations] = useState<Affiliation[]>([]);

  const toggleCategory = (category: ResearchCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const toggleAffiliation = (affiliation: Affiliation) => {
    setSelectedAffiliations((prev) =>
      prev.includes(affiliation)
        ? prev.filter((a) => a !== affiliation)
        : [...prev, affiliation]
    );
  };

  const entryCategories = (entry: LogEntry): ResearchCategory[] => {
    return entry.categories && entry.categories.length > 0
      ? entry.categories
      : [entry.category];
  };

  const entryAffiliations = (entry: LogEntry): Affiliation[] => {
    return entry.affiliations && entry.affiliations.length > 0
      ? entry.affiliations
      : [entry.affiliation];
  };

  const matchesAny = <T extends string>(selected: T[], tags: T[]) => {
    if (selected.length === 0) return true;
    return selected.some((s) => tags.includes(s));
  };

  const getWeekKey = (dateString: string): WeekKey | null => {
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return null;
    const day = d.getDate();
    const week = Math.floor((day - 1) / 7) + 1;
    if (week < 1 || week > 5) return null;
    return String(week) as WeekKey;
  };

  const weekLabel = (week: WeekKey) => {
    const n = Number(week);
    const startDay = (n - 1) * 7 + 1;
    const endDay = n * 7;
    return language === "jp"
      ? `第${n}週 (${startDay}–${endDay}日)`
      : `Week ${n} (${startDay}–${endDay})`;
  };

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

  const weekItems = useMemo(() => {
    if (selectedMonth === "all") return [] as { key: WeekKey; label: string }[];

    const set = new Set<WeekKey>();
    for (const entry of entries) {
      if (!entry.date.startsWith(selectedMonth)) continue;
      if (!matchesAny(selectedCategories, entryCategories(entry))) continue;
      if (!matchesAny(selectedAffiliations, entryAffiliations(entry))) continue;

      const wk = getWeekKey(entry.date);
      if (wk) set.add(wk);
    }

    const keys = Array.from(set);
    keys.sort((a, b) => Number(a) - Number(b));
    return keys.map((k) => ({ key: k, label: weekLabel(k) }));
  }, [entries, selectedMonth, selectedCategories, selectedAffiliations]);

  useEffect(() => {
    if (selectedWeek === "all") return;
    if (weekItems.some((w) => w.key === selectedWeek)) return;
    setSelectedWeek("all");
  }, [selectedWeek, weekItems]);

  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      if (selectedMonth !== "all" && !e.date.startsWith(selectedMonth))
        return false;

      if (selectedMonth !== "all" && selectedWeek !== "all") {
        const wk = getWeekKey(e.date);
        if (!wk || wk !== selectedWeek) return false;
      }

      if (!matchesAny(selectedCategories, entryCategories(e))) return false;
      if (!matchesAny(selectedAffiliations, entryAffiliations(e))) return false;
      return true;
    });
  }, [entries, selectedMonth, selectedWeek, selectedCategories, selectedAffiliations]);

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
                onClick={() => {
                  setSelectedMonth("all");
                  setSelectedWeek("all");
                }}
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
                  onClick={() => {
                    setSelectedMonth(m.key);
                    setSelectedWeek("all");
                  }}
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

          {selectedMonth !== "all" ? (
            <div className="mt-5">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {t.weeks}
              </p>

              <ol className="mt-3 space-y-2 border-l border-zinc-200 pl-4 dark:border-zinc-800">
                <li>
                  <button
                    type="button"
                    onClick={() => setSelectedWeek("all")}
                    className={
                      selectedWeek === "all"
                        ? "relative -ml-[19px] flex w-full items-center gap-3 rounded-md border border-sky-200 bg-sky-50 px-2 py-1.5 text-left text-sm font-medium text-sky-900 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-100"
                        : "relative -ml-[19px] flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    }
                  >
                    <span className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                    {t.allWeeks}
                  </button>
                </li>

                {weekItems.map((w) => (
                  <li key={w.key}>
                    <button
                      type="button"
                      onClick={() => setSelectedWeek(w.key)}
                      className={
                        selectedWeek === w.key
                          ? "relative -ml-[19px] flex w-full items-center gap-3 rounded-md border border-sky-200 bg-sky-50 px-2 py-1.5 text-left text-sm font-medium text-sky-900 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-100"
                          : "relative -ml-[19px] flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
                      }
                    >
                      <span className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                      {w.label}
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </nav>
      </aside>

      {/* Main Section */}
      <section>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {t.timeline}
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              {sortedEntries.length} {t.mockData}
              {selectedMonth !== "all" ||
              selectedWeek !== "all" ||
              selectedCategories.length > 0 ||
              selectedAffiliations.length > 0
                ? ` · ${t.filtered}`
                : ""}
            </p>
          </div>

          {onRefresh ? (
            <button
              type="button"
              onClick={onRefresh}
              disabled={Boolean(isRefreshing)}
              className="inline-flex items-center rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-900 transition-colors hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
              title={t.refresh}
            >
              {t.refresh}
            </button>
          ) : null}
        </div>

        {/* Filters */}
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium">{t.category}</span>
              <button
                type="button"
                onClick={() => setSelectedCategories([])}
                className="text-xs underline underline-offset-2 text-zinc-700 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-zinc-50"
              >
                {t.all}
              </button>
            </div>
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900">
                <span>
                  {selectedCategories.length === 0
                    ? t.all
                    : `${selectedCategories.length} selected`}
                </span>
                <span className="text-zinc-500 group-open:rotate-180">▾</span>
              </summary>

              <div className="mt-2 rounded-md border border-zinc-200 bg-white p-3 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
                <div className="space-y-2">
                  {categories.map((c) => (
                    <label key={c} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(c)}
                        onChange={() => toggleCategory(c)}
                      />
                      <span>{t.categories[c]}</span>
                    </label>
                  ))}
                </div>
              </div>
            </details>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium">{t.affiliation}</span>
              <button
                type="button"
                onClick={() => setSelectedAffiliations([])}
                className="text-xs underline underline-offset-2 text-zinc-700 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-zinc-50"
              >
                {t.all}
              </button>
            </div>
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900">
                <span>
                  {selectedAffiliations.length === 0
                    ? t.all
                    : `${selectedAffiliations.length} selected`}
                </span>
                <span className="text-zinc-500 group-open:rotate-180">▾</span>
              </summary>

              <div className="mt-2 rounded-md border border-zinc-200 bg-white p-3 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
                <div className="space-y-2">
                  {affiliations.map((a) => (
                    <label key={a} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedAffiliations.includes(a)}
                        onChange={() => toggleAffiliation(a)}
                      />
                      <span>{a}</span>
                    </label>
                  ))}
                </div>
              </div>
            </details>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setSelectedMonth("all");
                setSelectedWeek("all");
                setSelectedCategories([]);
                setSelectedAffiliations([]);
              }}
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
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
            className="rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            {t.toggleSort}
          </button>
        </div>

        <div className="mt-3">
          <TimelineFeed entries={sortedEntries} canEditEntry={canEditEntry} onRequestEdit={onRequestEdit} />
        </div>
      </section>
    </div>
  );
}
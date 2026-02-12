import type { LogEntry } from "../types/LogEntry";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../i18n/translations";

interface Props {
  entry: LogEntry;
}

export function LogCard({ entry }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  const hasDetails = Boolean(entry.details && entry.details.trim().length > 0);

  const title =
    language === "jp" && entry.titleJP ? entry.titleJP : entry.title;

  const content =
    language === "jp" && entry.contentJP ? entry.contentJP : entry.content;

  const details =
    language === "jp" && entry.detailsJP ? entry.detailsJP : entry.details;

  const affiliationBadgeClassName =
    entry.affiliation === "USJR"
      ? "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-100"
      : "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100";

  return (
    <article className="border border-zinc-200 bg-white p-4 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-900">
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
        {title}
      </h3>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
          {entry.date}
        </span>

        <span className="rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
          {t.categories[entry.category]}
        </span>

        <span className={`rounded-md border px-2 py-0.5 text-xs font-medium ${affiliationBadgeClassName}`}>
          {entry.affiliation}
        </span>

        {entry.authorName ? (
          <span className="text-xs text-zinc-600 dark:text-zinc-300">
            {entry.authorName}
          </span>
        ) : null}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-zinc-900 dark:text-zinc-50">
        {content}
      </p>

      {details ? (
        <div className="mt-3">
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-900"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? t.hideDetails : t.showDetails}
          </button>

          {isExpanded && (
            <>
              <hr className="my-3 border-zinc-200 dark:border-zinc-800" />
              <p className="text-sm text-zinc-700 dark:text-zinc-200">
                {details}
              </p>
            </>
          )}
        </div>
      ) : null}
    </article>
  );
}
import type { LogEntry } from "../types/LogEntry";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../i18n/translations";

interface Props {
  entry: LogEntry;
  canEdit?: boolean;
  onEdit?: () => void;
}

export function LogCard({ entry, canEdit, onEdit }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  const attachments = entry.attachments ?? [];

  const isImageUrl = (url: string) => {
    const cleaned = url.split("?")[0].split("#")[0];
    return /\.(png|jpg|jpeg|gif|webp|bmp|svg)$/i.test(cleaned);
  };

  const getFilename = (url: string) => {
    try {
      const cleaned = url.split("?")[0].split("#")[0];
      const parts = cleaned.split("/").filter(Boolean);
      const last = parts[parts.length - 1] ?? "file";
      return decodeURIComponent(last);
    } catch {
      return "file";
    }
  };

  const imageAttachmentUrls = attachments
    .map((a) => a.file_url)
    .filter((u): u is string => Boolean(u))
    .filter(isImageUrl)
    .slice(0, 2);

  const dateLabel = (() => {
    const d = new Date(entry.date);
    if (Number.isNaN(d.getTime())) return entry.date;

    const formatter = new Intl.DateTimeFormat(language === "jp" ? "ja-JP" : "en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(d);
  })();

  const hasDetails = Boolean(entry.details && entry.details.trim().length > 0);
  const images = entry.images ?? [];

  const title =
    language === "jp" && entry.titleJP ? entry.titleJP : entry.title;

  const content =
    language === "jp" && entry.contentJP ? entry.contentJP : entry.content;

  const details =
    language === "jp" && entry.detailsJP ? entry.detailsJP : entry.details;

  const categoryTags =
    entry.categories && entry.categories.length > 0
      ? entry.categories
      : [entry.category];

  const affiliationTags =
    entry.affiliations && entry.affiliations.length > 0
      ? entry.affiliations
      : [entry.affiliation];

  const affiliationBadgeClassName = (affiliation: string) =>
    affiliation === "USJR"
      ? "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-100"
      : "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100";

  return (
    <article className="border border-zinc-200 bg-white p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-900">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </h3>

        {canEdit && onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            {t.edit}
          </button>
        ) : null}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
          {dateLabel}
        </span>

        {categoryTags.map((c) => (
          <span
            key={c}
            className="rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            {t.categories[c]}
          </span>
        ))}

        {affiliationTags.map((a) => (
          <span
            key={a}
            className={`rounded-md border px-2 py-0.5 text-xs font-medium ${affiliationBadgeClassName(a)}`}
          >
            {a}
          </span>
        ))}

        {entry.authorName ? (
          <span className="text-xs text-zinc-600 dark:text-zinc-300">
            {entry.authorName}
          </span>
        ) : null}
      </div>

      {/* 🔥 THIS WAS MISSING */}
      <p className="mt-3 text-sm leading-relaxed text-zinc-900 dark:text-zinc-50">
        {content}
      </p>

      {images.length > 0 ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {images.map((img) => (
            <figure
              key={img.src}
              className="overflow-hidden rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="h-auto w-full"
                loading="lazy"
              />
              {img.caption ? (
                <figcaption className="border-t border-zinc-200 px-3 py-2 text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
                  {img.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      ) : null}

      {attachments.length > 0 ? (
        <div className="mt-3">
          <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {t.attachments}
          </h4>

          {imageAttachmentUrls.length > 0 ? (
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {imageAttachmentUrls.map((url) => (
                <figure
                  key={url}
                  className="overflow-hidden rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <a href={url} target="_blank" rel="noreferrer">
                    <img
                      src={url}
                      alt={getFilename(url)}
                      className="h-auto w-full"
                      loading="lazy"
                    />
                  </a>
                </figure>
              ))}
            </div>
          ) : null}

          <ul className="mt-2 space-y-1">
            {attachments.map((a) => {
              const url = a.file_url;
              if (!url) return null;
              const filename = getFilename(url);
              const downloadHref = a.download_url ?? url;

              return (
                <li key={a.id} className="text-sm">
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-900 underline underline-offset-2 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-200"
                  >
                    {filename}
                  </a>
                  <span className="mx-2 text-zinc-400">·</span>
                  <a
                    href={downloadHref}
                    download
                    className="text-sm text-zinc-700 underline underline-offset-2 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-zinc-50"
                  >
                    {t.download}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {hasDetails ? (
        <div className="mt-3">
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
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
import { TimelineFeed } from "../components/TimelineFeed";
import { mockLogs } from "../data/mockLogs";
import { useMemo, useState } from "react";

type SortOrder = "newest" | "oldest";

export function TimelinePage() {
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const entries = useMemo(() => {
    const copy = [...mockLogs];
    copy.sort((a, b) => {
      const aTime = Date.parse(a.date);
      const bTime = Date.parse(b.date);
      return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
    });
    return copy;
  }, [sortOrder]);

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Timeline</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            {entries.length} entr{entries.length === 1 ? "y" : "ies"} (mock data)
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-b border-zinc-200 pb-3">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Sort: {sortOrder === "newest" ? "Newest → Oldest" : "Oldest → Newest"}
        </p>
        <button
          type="button"
          className="inline-flex items-center rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
          onClick={() => setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))}
        >
          Toggle sort
        </button>
      </div>

      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
        Japanese translation: placeholder only (no AI in this phase).
      </p>

      <div className="mt-3">
        <TimelineFeed entries={entries} />
      </div>
    </div>
  );
}

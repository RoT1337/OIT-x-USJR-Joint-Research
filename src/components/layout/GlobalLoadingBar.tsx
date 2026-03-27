import { useApiInFlightCount } from "../../hooks/useApiLoading";

export function GlobalLoadingBar() {
  const inFlight = useApiInFlightCount();

  if (inFlight <= 0) return null;

  return (
    <div
      className="fixed inset-x-0 top-0 z-60 h-1 bg-zinc-200 dark:bg-zinc-800"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="h-full w-full skeleton-shimmer bg-sky-200 dark:bg-sky-900/60" />
    </div>
  );
}

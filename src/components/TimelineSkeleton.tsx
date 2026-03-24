function SkeletonLine({ className }: { className: string }) {
  return <div className={`skeleton-shimmer rounded-md bg-zinc-200 dark:bg-zinc-800 ${className}`} />;
}

function SkeletonCard() {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-3">
        <SkeletonLine className="h-5 w-2/3" />
        <SkeletonLine className="h-8 w-16" />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <SkeletonLine className="h-5 w-20" />
        <SkeletonLine className="h-5 w-16" />
        <SkeletonLine className="h-5 w-16" />
        <SkeletonLine className="h-5 w-12" />
        <SkeletonLine className="h-4 w-24" />
      </div>

      <div className="mt-4 space-y-2">
        <SkeletonLine className="h-4 w-full" />
        <SkeletonLine className="h-4 w-11/12" />
        <SkeletonLine className="h-4 w-9/12" />
      </div>
    </div>
  );
}

export function TimelineSkeleton() {
  return (
    <section aria-label="Loading timeline" className="space-y-3">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </section>
  );
}

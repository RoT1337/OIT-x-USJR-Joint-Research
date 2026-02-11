interface Props {
  title: string;
  subtitle?: string;
}

export function AppHeader({ title, subtitle }: Props) {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto max-w-5xl px-4 py-4">
        <h1 className="text-2xl font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{subtitle}</p>
        ) : null}
      </div>
    </header>
  );
}

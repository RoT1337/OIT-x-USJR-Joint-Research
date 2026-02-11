export function AboutPage() {
  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">About</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          This is an internal academic prototype for the USJR–OIT joint research collaboration.
        </p>
      </header>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Scope (Prototype)</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-200">
          <li>Timeline-style feed of research log entries (mock data only).</li>
          <li>Clear authorship/affiliation (USJR / OIT) and research categories.</li>
          <li>Readable, scan-friendly layout for supervisors.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Out of Scope</h3>
        <p className="text-sm text-zinc-700 dark:text-zinc-200">
          Authentication, backend/database, real-time collaboration, hardware/sensor data integration, and real AI translation.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Japanese Translation (Placeholder)
        </h3>
        <p className="text-sm text-zinc-700 dark:text-zinc-200">
          The UI includes a placeholder for future AI-assisted Japanese explanations. No integration is implemented in this phase.
        </p>
      </section>
    </div>
  );
}

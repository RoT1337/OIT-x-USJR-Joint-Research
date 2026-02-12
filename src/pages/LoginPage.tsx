import { useState } from "react";
import type { Affiliation } from "../types/LogEntry";

interface Props {
  onLogin: (affiliation: Affiliation) => void;
}

export function LoginPage({ onLogin }: Props) {
  const [affiliation, setAffiliation] = useState<Affiliation>("USJR");

  return (
    <div className="max-w-xl">
      <header>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Login (Mock)</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          No authentication is implemented. This sets a local session for prototyping UI flows.
        </p>
      </header>

      <form
        className="mt-6 space-y-4 rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
        onSubmit={(e) => {
          e.preventDefault();
          onLogin(affiliation);
        }}
      >
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Affiliation</legend>

          <label className="flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200">
            <input
              type="radio"
              name="affiliation"
              value="USJR"
              checked={affiliation === "USJR"}
              onChange={() => setAffiliation("USJR")}
            />
            USJR
          </label>

          <label className="flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200">
            <input
              type="radio"
              name="affiliation"
              value="OIT"
              checked={affiliation === "OIT"}
              onChange={() => setAffiliation("OIT")}
            />
            OIT
          </label>
        </fieldset>

        <button
          type="submit"
          className="inline-flex items-center rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-900 hover:bg-sky-100 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-100 dark:hover:bg-sky-950/50"
        >
          Continue
        </button>
      </form>
    </div>
  );
}

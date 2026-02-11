import { AppHeader } from "./components/layout/AppHeader";
import { NavBar, type PageKey } from "./components/layout/NavBar";
import { useState } from "react";
import { AboutPage } from "./pages/AboutPage";
import { TimelinePage } from "./pages/TimelinePage";
import { LoginPage } from "./pages/LoginPage";
import { AddEntryPage } from "./pages/AddEntryPage";
import { mockLogs } from "./data/mockLogs";
import type { Affiliation, LogEntry } from "./types/LogEntry";

function App() {
  const [activePage, setActivePage] = useState<PageKey>("timeline");
  const [sessionAffiliation, setSessionAffiliation] = useState<Affiliation | null>(null);
  const [entries, setEntries] = useState<LogEntry[]>(mockLogs);

  function handleLogin(affiliation: Affiliation) {
    setSessionAffiliation(affiliation);
    setActivePage("timeline");
  }

  function handleAdd(newEntry: Omit<LogEntry, "id">) {
    setEntries((prev) => {
      const nextId = prev.length > 0 ? Math.max(...prev.map((e) => e.id)) + 1 : 1;
      return [{ ...newEntry, id: nextId }, ...prev];
    });
    setActivePage("timeline");
  }

  return (
    <div className="min-h-screen">
      <AppHeader
        title="USJR × OIT Research Log"
        subtitle="Academic prototype for logging research updates (mock data only)."
      />
      <NavBar
        activePage={activePage}
        onNavigate={setActivePage}
        isLoggedIn={sessionAffiliation !== null}
      />
      <main className="mx-auto max-w-5xl px-4 py-6">
        {activePage === "timeline" ? (
          <TimelinePage entries={entries} />
        ) : activePage === "add" ? (
          <AddEntryPage
            affiliation={sessionAffiliation}
            onAdd={handleAdd}
            onGoToLogin={() => setActivePage("login")}
          />
        ) : activePage === "login" ? (
          <LoginPage onLogin={handleLogin} />
        ) : (
          <AboutPage />
        )}
      </main>
    </div>
  );
}

export default App;

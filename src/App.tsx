import { AppHeader } from "./components/layout/AppHeader";
import { NavBar, type PageKey } from "./components/layout/NavBar";
import { useState } from "react";
import { AboutPage } from "./pages/AboutPage";
import { TimelinePage } from "./pages/TimelinePage";

function App() {
  const [activePage, setActivePage] = useState<PageKey>("timeline");

  return (
    <div className="min-h-screen">
      <AppHeader
        title="USJR × OIT Research Log"
        subtitle="Academic prototype for logging research updates (mock data only)."
      />
      <NavBar activePage={activePage} onNavigate={setActivePage} />
      <main className="mx-auto max-w-5xl px-4 py-6">
        {activePage === "timeline" ? <TimelinePage /> : <AboutPage />}
      </main>
    </div>
  );
}

export default App;

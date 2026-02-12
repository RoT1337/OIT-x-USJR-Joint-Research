import { AppHeader } from "./components/layout/AppHeader";
import { NavBar, type PageKey } from "./components/layout/NavBar";
import { useState } from "react";
import { AboutPage } from "./pages/AboutPage";
import { TimelinePage } from "./pages/TimelinePage";
import { useLanguage } from "./context/LanguageContext";
import { translations } from "./i18n/translations";

function App() {
  const [activePage, setActivePage] = useState<PageKey>("timeline");

  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen relative">
      {/* Language Toggle Button */}
      <button
        onClick={toggleLanguage}
        className="absolute right-4 top-4 rounded-md border border-zinc-300 bg-white px-3 py-1 text-sm text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
      >
        {language === "en" ? "日本語" : "English"}
      </button>

      <AppHeader
        title={t.appTitle}
        subtitle={t.appSubtitle}
      />

      <NavBar activePage={activePage} onNavigate={setActivePage} />

      <main className="mx-auto max-w-5xl px-4 py-6">
        {activePage === "timeline" ? <TimelinePage /> : <AboutPage />}
      </main>
    </div>
  );
}

export default App;
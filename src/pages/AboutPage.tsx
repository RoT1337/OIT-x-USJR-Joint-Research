import { useLanguage } from "../context/LanguageContext";

export function AboutPage() {
  const { language } = useLanguage();

  if (language === "jp") {
    return (
      <div className="space-y-4">
        <header>
          <h2 className="text-lg font-semibold">概要</h2>
          <p className="mt-1 text-sm">
            本システムは、USJR–OIT共同研究のための内部学術プロトタイプである。
          </p>
        </header>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold">スコープ（プロトタイプ）</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>研究ログのタイムライン表示（モックデータのみ）。</li>
            <li>USJR / OIT の所属および研究カテゴリの明確化。</li>
            <li>指導教員向けの可読性と視認性を重視した設計。</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold">対象外</h3>
          <p className="text-sm">
            認証機能、バックエンド、リアルタイム共同編集、ハードウェア統合、実際のAI翻訳機能は本フェーズの対象外。
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold">
            日本語翻訳（プレースホルダー）
          </h3>
          <p className="text-sm">
            将来的なAI支援による日本語説明機能のためのプレースホルダーを表示している。本フェーズでは統合は行わない。
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-lg font-semibold">About</h2>
        <p className="mt-1 text-sm">
          This is an internal academic prototype for the USJR–OIT joint research collaboration.
        </p>
      </header>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold">Scope (Prototype)</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>Timeline-style feed of research log entries (mock data only).</li>
          <li>Clear authorship/affiliation (USJR / OIT) and research categories.</li>
          <li>Readable, scan-friendly layout for supervisors.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold">Out of Scope</h3>
        <p className="text-sm">
          Authentication, backend/database, real-time collaboration, hardware/sensor data integration, and real AI translation.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold">
          Japanese Translation (Placeholder)
        </h3>
        <p className="text-sm">
          The UI includes a placeholder for future AI-assisted Japanese explanations. No integration is implemented in this phase.
        </p>
      </section>
    </div>
  );
}
import type { LogEntry } from "../types/LogEntry";

export const mockLogs: LogEntry[] = [
  {
    id: 1,
    date: "2026-02-01",
    title: "Rectenna: baseline model assumptions confirmed",
    titleJP: "レクテナ：ベースラインモデルの前提を確認",

    category: "Rectenna",
    affiliation: "USJR",
    authorName: "USJR Research Team",

    content:
      "Confirmed initial rectenna equivalent-circuit assumptions and agreed to document parameter sources for reproducibility.",
    contentJP:
      "初期レクテナ等価回路モデルの前提条件を確認し、再現性確保のためパラメータの出典を文書化することに合意した。",

    details:
      "Notes: focus is on a model that is easy to explain to supervisors first; accuracy improvements can follow once the baseline is validated.",
    detailsJP:
      "注記：まずは指導教員に説明しやすいモデル構造を優先する。ベースラインの妥当性確認後に精度向上を検討する。",

    images: [
      {
        src: "/mock/rectenna-figure.svg",
        alt: "Rectenna placeholder figure",
        caption: "Placeholder figure (replace with schematic/model screenshot later)."
      }
    ]
  },
  {
    id: 2,
    date: "2026-02-03",
    title: "MPPT: quick review of candidate approaches",
    titleJP: "MPPT：候補手法の簡易レビュー",

    category: "MPPT",
    affiliation: "OIT",
    authorName: "OIT Supervisor",

    content:
      "Reviewed P&O vs. incremental conductance at a high level; discussed how load variation might affect stability in WPT contexts.",
    contentJP:
      "P&O法とインクリメンタルコンダクタンス法を概観し、WPT環境における負荷変動が安定性へ与える影響について議論した。",

    details:
      "Action item: define evaluation criteria (convergence speed, ripple, implementation complexity) suitable for early prototype simulations.",
    detailsJP:
      "アクション項目：初期プロトタイプシミュレーション向けに評価基準（収束速度、リップル、実装複雑度）を定義する。",

    images: [
      {
        src: "/mock/mppt-plot.svg",
        alt: "MPPT placeholder plot",
        caption: "Placeholder plot (replace with simulation results later)."
      }
    ]
  },
  {
    id: 3,
    date: "2026-02-06",
    title: "Meeting: align on weekly update format",
    titleJP: "会議：週次更新フォーマットの統一",

    category: "Meeting",
    affiliation: "USJR",
    authorName: "Coordinator",

    content:
      "Agreed that updates should read like lab notebook entries (what changed, what was tested, what’s next).",
    contentJP:
      "更新内容はラボノート形式（変更点、実験内容、今後の予定）で記載することに合意した。",

    details:
      "Template: (1) context, (2) change/experiment, (3) result/observation, (4) next step, (5) blockers/questions.",
    detailsJP:
      "テンプレート：(1) 背景、(2) 変更／実験内容、(3) 結果／観察、(4) 次のステップ、(5) 課題／質問。"
  },
  {
    id: 4,
    date: "2026-02-08",
    title: "AI: placeholder discussion (no implementation yet)",
    titleJP: "AI：プレースホルダー検討（未実装）",

    category: "AI",
    affiliation: "OIT",
    authorName: "OIT Researcher",

    content:
      "Captured ideas for future AI-assisted Japanese explanation of logs; no integration planned for the prototype phase.",
    contentJP:
      "将来的なAI支援による日本語説明機能についてアイデアを整理した。本プロトタイプ段階では統合予定なし。",

    details:
      "Prototype will show a UI placeholder only; translation quality and workflows are out of scope for now.",
    detailsJP:
      "本プロトタイプではUI上のプレースホルダー表示のみ行う。翻訳品質やワークフロー設計は対象外。"
  }
];
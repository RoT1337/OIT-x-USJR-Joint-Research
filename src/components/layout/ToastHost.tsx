export type ToastTone = "success" | "info" | "error";

export interface ToastItem {
  id: string;
  message: string;
  tone: ToastTone;
}

function toneClasses(tone: ToastTone): string {
  switch (tone) {
    case "success":
      return "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100";
    case "error":
      return "border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-100";
    default:
      return "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-100";
  }
}

interface Props {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export function ToastHost({ toasts, onDismiss }: Props) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed right-4 top-4 z-[60] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2"
      role="status"
      aria-live="polite"
      aria-relevant="additions"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={
            "flex items-start justify-between gap-3 rounded-md border px-3 py-2 shadow-sm " +
            toneClasses(t.tone)
          }
        >
          <p className="text-sm leading-snug">{t.message}</p>
          <button
            type="button"
            className="-mr-1 rounded-md px-2 py-1 text-sm opacity-80 hover:opacity-100"
            onClick={() => onDismiss(t.id)}
            aria-label="Dismiss"
            title="Dismiss"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

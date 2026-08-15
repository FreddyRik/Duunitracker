"use client";

import { useLocale } from "@/components/LocaleProvider";
import type { StatusToast as StatusToastValue } from "@/types/share-target";

type StatusToastProps = {
  toast: StatusToastValue | null;
  onDismiss: () => void;
};

export function StatusToast({ toast, onDismiss }: StatusToastProps) {
  const { t } = useLocale();

  if (!toast) return null;

  const isWarning = toast.kind === "warning";

  return (
    <div
      role={isWarning ? "alert" : "status"}
      aria-live={isWarning ? "assertive" : "polite"}
      className="no-print pointer-events-none fixed inset-x-0 top-4 z-[60] flex justify-center px-4"
    >
      <div
        className={
          isWarning
            ? "animate-fade-in pointer-events-auto flex max-w-md items-start gap-3 border border-danger-border bg-danger-bg px-4 py-3 shadow-lg"
            : "animate-fade-in pointer-events-auto flex max-w-md items-start gap-3 border border-border bg-surface-solid px-4 py-3 shadow-lg"
        }
      >
        <p
          className={
            isWarning
              ? "flex-1 text-sm text-danger"
              : "flex-1 text-sm text-foreground"
          }
        >
          {toast.message}
        </p>
        {isWarning && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label={t.actions.close}
            className="rounded-md px-2 py-1 text-sm text-danger transition hover:bg-danger-border/40"
          >
            <span aria-hidden="true">×</span>
          </button>
        )}
      </div>
    </div>
  );
}

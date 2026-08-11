"use client";

import { useLocale } from "@/components/LocaleProvider";

export function ErrorStrip({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  const { t } = useLocale();

  return (
    <div
      role="alert"
      className="animate-fade-in border-b border-danger-border bg-danger-bg"
    >
      <div className="mx-auto flex w-full max-w-[1100px] items-center gap-3 px-4 py-2 sm:px-6">
        <p className="flex-1 text-sm text-danger">{message}</p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label={t.actions.close}
          className="rounded-md px-2 py-1 text-sm text-danger transition hover:bg-danger-border/40"
        >
          ×
        </button>
      </div>
    </div>
  );
}

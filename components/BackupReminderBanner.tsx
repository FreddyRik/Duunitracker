"use client";

import { useLocale } from "@/components/LocaleProvider";

type BackupReminderBannerProps = {
  onExport: () => void;
  onDismiss: () => void;
};

export function BackupReminderBanner({
  onExport,
  onDismiss,
}: BackupReminderBannerProps) {
  const { t } = useLocale();

  return (
    <div
      role="status"
      className="mb-6 flex flex-col gap-3 border border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-foreground">{t.backup.reminder}</p>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onExport}
          className="rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-accent-fg transition hover:bg-accent-hover"
        >
          {t.backup.export}
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-md border border-border-strong px-3 py-1.5 text-xs font-medium text-muted-strong transition hover:bg-surface-muted"
        >
          {t.backup.dismissReminder}
        </button>
      </div>
    </div>
  );
}

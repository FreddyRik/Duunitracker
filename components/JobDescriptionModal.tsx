"use client";

import { useLocale } from "@/components/LocaleProvider";
import { formatCompanyName } from "@/lib/format";
import type { JobApplication } from "@/types/job";

type JobDescriptionModalProps = {
  job: JobApplication | null;
  onClose: () => void;
};

export function JobDescriptionModal({
  job,
  onClose,
}: JobDescriptionModalProps) {
  const { t } = useLocale();

  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-border bg-surface-solid shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {job.title}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {formatCompanyName(job.company)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-muted transition hover:bg-surface-muted hover:text-foreground"
            aria-label={t.actions.close}
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          {job.description ? (
            <p className="whitespace-pre-wrap text-sm leading-6 text-muted-strong">
              {job.description}
            </p>
          ) : (
            <p className="text-sm text-muted">{t.description.empty}</p>
          )}
        </div>

        <div className="border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border-strong px-4 py-2 text-sm font-medium text-muted-strong transition hover:bg-surface-muted"
          >
            {t.actions.close}
          </button>
        </div>
      </div>
    </div>
  );
}

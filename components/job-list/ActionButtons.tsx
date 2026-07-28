"use client";

import { useLocale } from "@/components/LocaleProvider";
import type { JobApplication } from "@/types/job";
import type { JobListHandlers } from "@/components/job-list/types";

export function ActionButtons({
  job,
  onEdit,
  onDelete,
  onViewDescription,
}: {
  job: JobApplication;
  onEdit: JobListHandlers["onEdit"];
  onDelete: JobListHandlers["onDelete"];
  onViewDescription: JobListHandlers["onViewDescription"];
}) {
  const { t } = useLocale();

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onViewDescription(job)}
        disabled={!job.description}
        className="rounded-lg border border-border-strong px-3 py-1.5 text-xs font-medium text-muted-strong transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
      >
        {t.actions.view}
      </button>
      <button
        type="button"
        onClick={() => onEdit(job)}
        className="rounded-lg border border-border-strong px-3 py-1.5 text-xs font-medium text-muted-strong transition hover:bg-surface-muted"
      >
        {t.actions.edit}
      </button>
      <button
        type="button"
        onClick={() => void onDelete(job.id)}
        className="rounded-lg border border-danger-border px-3 py-1.5 text-xs font-medium text-danger transition hover:bg-danger-bg"
      >
        {t.actions.delete}
      </button>
    </div>
  );
}

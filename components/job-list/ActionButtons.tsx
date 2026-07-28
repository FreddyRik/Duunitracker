"use client";

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
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onViewDescription(job)}
        disabled={!job.description}
        className="rounded-lg border border-border-strong px-3 py-1.5 text-xs font-medium text-muted-strong transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
      >
        View
      </button>
      <button
        type="button"
        onClick={() => onEdit(job)}
        className="rounded-lg border border-border-strong px-3 py-1.5 text-xs font-medium text-muted-strong transition hover:bg-surface-muted"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={() => void onDelete(job.id)}
        className="rounded-lg border border-danger-border px-3 py-1.5 text-xs font-medium text-danger transition hover:bg-danger-bg"
      >
        Delete
      </button>
    </div>
  );
}

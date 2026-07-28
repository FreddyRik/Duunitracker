"use client";

import { formatDate } from "@/lib/format";
import { buildStatusUpdate } from "@/lib/job-status";
import { ActionButtons } from "@/components/job-list/ActionButtons";
import { JobSummary } from "@/components/job-list/JobSummary";
import { NotesField } from "@/components/job-list/NotesField";
import { StatusSelect } from "@/components/job-list/StatusSelect";
import type { JobListHandlers } from "@/components/job-list/types";
import type { JobApplication, JobStatus } from "@/types/job";

export function JobCardMobile({
  job,
  onUpdate,
  onEdit,
  onDelete,
  onViewDescription,
}: {
  job: JobApplication;
} & JobListHandlers) {
  function handleStatusChange(status: JobStatus) {
    void onUpdate(job.id, buildStatusUpdate(job, status));
  }

  return (
    <article className="rounded-xl border border-border bg-surface p-3 shadow-sm">
      <JobSummary job={job} />
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
        <StatusSelect status={job.status} onChange={handleStatusChange} />
        {job.dateApplied && (
          <span className="text-xs text-muted">
            Applied {formatDate(job.dateApplied)}
          </span>
        )}
      </div>
      <div className="mt-2">
        <NotesField
          notes={job.notes}
          onSave={async (notes) => {
            await onUpdate(job.id, { notes });
          }}
        />
      </div>
      <div className="mt-2">
        <ActionButtons
          job={job}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDescription={onViewDescription}
        />
      </div>
    </article>
  );
}

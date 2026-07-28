"use client";

import { useLocale } from "@/components/LocaleProvider";
import { formatDate } from "@/lib/format";
import { formatTemplate } from "@/lib/i18n";
import { buildStatusUpdate } from "@/lib/job-status";
import { ActionButtons } from "@/components/job-list/ActionButtons";
import { JobSummary } from "@/components/job-list/JobSummary";
import { NotesField } from "@/components/job-list/NotesField";
import { StatusSelect } from "@/components/job-list/StatusSelect";
import type { JobListHandlers } from "@/components/job-list/types";
import type { JobApplication, JobStatus } from "@/types/job";

export function JobRowDesktop({
  job,
  onUpdate,
  onEdit,
  onDelete,
  onViewDescription,
}: {
  job: JobApplication;
} & JobListHandlers) {
  const { t } = useLocale();

  function handleStatusChange(status: JobStatus) {
    void onUpdate(job.id, buildStatusUpdate(job, status));
  }

  return (
    <tr className="align-top">
      <td className="px-3 py-2.5">
        <JobSummary job={job} />
      </td>
      <td className="px-3 py-2.5">
        <StatusSelect status={job.status} onChange={handleStatusChange} />
        {job.dateApplied && (
          <p className="mt-1 text-xs text-muted">
            {formatTemplate(t.job.appliedOn, {
              date: formatDate(job.dateApplied),
            })}
          </p>
        )}
      </td>
      <td className="px-3 py-2.5">
        <NotesField
          notes={job.notes}
          onSave={async (notes) => {
            await onUpdate(job.id, { notes });
          }}
        />
      </td>
      <td className="px-3 py-2.5">
        <ActionButtons
          job={job}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDescription={onViewDescription}
        />
      </td>
    </tr>
  );
}

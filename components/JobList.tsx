"use client";

import { JobCardMobile } from "@/components/job-list/JobCardMobile";
import { JobRowDesktop } from "@/components/job-list/JobRowDesktop";
import type { JobListHandlers } from "@/components/job-list/types";
import type { JobApplication } from "@/types/job";

type JobListProps = {
  jobs: JobApplication[];
  hasJobs?: boolean;
} & JobListHandlers;

export function JobList({
  jobs,
  hasJobs = false,
  onUpdate,
  onEdit,
  onDelete,
  onViewDescription,
}: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
        <p className="text-lg font-medium text-foreground">
          {hasJobs ? "No matching applications" : "No applications yet"}
        </p>
        <p className="mt-2 text-sm text-muted">
          {hasJobs
            ? "Try adjusting your search or status filter."
            : "Paste a Duunitori link above to import your first job."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-surface shadow-sm lg:block">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-3 py-2">Job</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Notes</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {jobs.map((job) => (
              <JobRowDesktop
                key={job.id}
                job={job}
                onUpdate={onUpdate}
                onEdit={onEdit}
                onDelete={onDelete}
                onViewDescription={onViewDescription}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 lg:hidden">
        {jobs.map((job) => (
          <JobCardMobile
            key={job.id}
            job={job}
            onUpdate={onUpdate}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewDescription={onViewDescription}
          />
        ))}
      </div>
    </>
  );
}

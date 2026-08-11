"use client";

import { EmptyState } from "@/components/EmptyState";
import { JobGroup } from "@/components/job-list/JobGroup";
import { JobRow } from "@/components/job-list/JobRow";
import type { JobListHandlers } from "@/components/job-list/types";
import { groupByStatus } from "@/lib/job-insights";
import type { JobApplication } from "@/types/job";

type JobListProps = {
  jobs: JobApplication[];
  hasJobs: boolean;
  grouped: boolean;
  activeRowId: string | null;
  onImport: () => void;
  onClearFilters: () => void;
} & JobListHandlers;

export function JobList({
  jobs,
  hasJobs,
  grouped,
  activeRowId,
  onImport,
  onClearFilters,
  onUpdate,
  onEdit,
  onDelete,
  onOpen,
}: JobListProps) {
  if (jobs.length === 0) {
    return (
      <EmptyState
        variant={hasJobs ? "no-match" : "empty"}
        onImport={onImport}
        onClearFilters={onClearFilters}
      />
    );
  }

  const rowProps = { onUpdate, onEdit, onDelete, onOpen };

  if (grouped) {
    return (
      <div className="pb-4">
        {groupByStatus(jobs).map((group) => (
          <JobGroup
            key={group.status}
            status={group.status}
            count={group.jobs.length}
          >
            {group.jobs.map((job) => (
              <JobRow
                key={job.id}
                job={job}
                active={job.id === activeRowId}
                {...rowProps}
              />
            ))}
          </JobGroup>
        ))}
      </div>
    );
  }

  return (
    <ul className="border-t border-border">
      {jobs.map((job) => (
        <JobRow
          key={job.id}
          job={job}
          active={job.id === activeRowId}
          {...rowProps}
        />
      ))}
    </ul>
  );
}

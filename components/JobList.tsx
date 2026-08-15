"use client";

import { memo } from "react";
import { EmptyState } from "@/components/EmptyState";
import { JobGroup } from "@/components/job-list/JobGroup";
import { JobRow } from "@/components/job-list/JobRow";
import type { JobListHandlers } from "@/components/job-list/types";
import type { JobStatusGroup } from "@/lib/job-insights";
import type { JobApplication } from "@/types/job";

type JobListProps = {
  jobs: JobApplication[];
  groups: JobStatusGroup[] | null;
  hasJobs: boolean;
  activeRowId: string | null;
  onImport: () => void;
  onClearFilters: () => void;
} & JobListHandlers;

function JobListComponent({
  jobs,
  groups,
  hasJobs,
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

  if (groups) {
    return (
      <div className="pb-4">
        {groups.map((group) => (
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
                onUpdate={onUpdate}
                onEdit={onEdit}
                onDelete={onDelete}
                onOpen={onOpen}
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
          onUpdate={onUpdate}
          onEdit={onEdit}
          onDelete={onDelete}
          onOpen={onOpen}
        />
      ))}
    </ul>
  );
}

export const JobList = memo(JobListComponent);

"use client";

import type { JobStatus } from "@/lib/types";
import { JOB_STATUSES } from "@/lib/types";

type JobFiltersProps = {
  search: string;
  statusFilter: JobStatus | "All";
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: JobStatus | "All") => void;
};

export function JobFilters({
  search,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
}: JobFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <label className="sr-only" htmlFor="job-search">
        Search jobs
      </label>
      <input
        id="job-search"
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search by title, company, or description..."
        className="w-full flex-1 rounded-xl border border-border-strong bg-surface-solid px-4 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-ring"
      />

      <label className="sr-only" htmlFor="status-filter">
        Filter by status
      </label>
      <select
        id="status-filter"
        value={statusFilter}
        onChange={(event) =>
          onStatusFilterChange(event.target.value as JobStatus | "All")
        }
        className="rounded-xl border border-border-strong bg-surface-solid px-4 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-ring sm:min-w-[10rem]"
      >
        <option value="All">All statuses</option>
        {JOB_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
}

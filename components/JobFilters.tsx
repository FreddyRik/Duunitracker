"use client";

import type { JobListFilter } from "@/types/job";
import { JOB_STATUSES } from "@/types/job";

type JobFiltersProps = {
  search: string;
  statusFilter: JobListFilter;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: JobListFilter) => void;
};

const FILTER_OPTIONS: { value: JobListFilter; label: string }[] = [
  { value: "All", label: "All statuses" },
  { value: "InProgress", label: "In Progress" },
  ...JOB_STATUSES.map((status) => ({
    value: status as JobListFilter,
    label: status,
  })),
];

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
          onStatusFilterChange(event.target.value as JobListFilter)
        }
        className="rounded-xl border border-border-strong bg-surface-solid px-4 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-ring sm:min-w-[10rem]"
      >
        {FILTER_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

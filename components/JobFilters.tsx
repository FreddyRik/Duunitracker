"use client";

import { useLocale } from "@/components/LocaleProvider";
import { statusLabel } from "@/lib/i18n";
import type { JobListFilter } from "@/types/job";
import { JOB_STATUSES } from "@/types/job";

type JobFiltersProps = {
  search: string;
  statusFilter: JobListFilter;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: JobListFilter) => void;
};

export function JobFilters({
  search,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
}: JobFiltersProps) {
  const { t } = useLocale();

  const filterOptions: { value: JobListFilter; label: string }[] = [
    { value: "All", label: t.filters.allStatuses },
    { value: "InProgress", label: t.filters.inProgress },
    ...JOB_STATUSES.map((status) => ({
      value: status as JobListFilter,
      label: statusLabel(t, status),
    })),
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <label className="sr-only" htmlFor="job-search">
        {t.filters.searchLabel}
      </label>
      <input
        id="job-search"
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={t.filters.searchPlaceholder}
        className="w-full flex-1 rounded-xl border border-border-strong bg-surface-solid px-4 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-ring"
      />

      <label className="sr-only" htmlFor="status-filter">
        {t.filters.statusLabel}
      </label>
      <select
        id="status-filter"
        value={statusFilter}
        onChange={(event) =>
          onStatusFilterChange(event.target.value as JobListFilter)
        }
        className="rounded-xl border border-border-strong bg-surface-solid px-4 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-ring sm:min-w-[10rem]"
      >
        {filterOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

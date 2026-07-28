"use client";

import { useLocale } from "@/components/LocaleProvider";
import type { JobApplication, JobListFilter } from "@/types/job";

type SummaryStatsProps = {
  jobs: JobApplication[];
  statusFilter: JobListFilter;
  onFilterChange: (filter: JobListFilter) => void;
};

type StatItem = {
  label: string;
  value: number;
  filter: JobListFilter;
};

export function SummaryStats({
  jobs,
  statusFilter,
  onFilterChange,
}: SummaryStatsProps) {
  const { t } = useLocale();

  const items: StatItem[] = [
    { label: t.stats.totalJobs, value: jobs.length, filter: "All" },
    {
      label: t.stats.applied,
      value: jobs.filter((job) => job.status === "Applied").length,
      filter: "Applied",
    },
    {
      label: t.stats.inProgress,
      value: jobs.filter(
        (job) => job.status === "Interview" || job.status === "Offer",
      ).length,
      filter: "InProgress",
    },
    {
      label: t.stats.rejected,
      value: jobs.filter((job) => job.status === "Rejected").length,
      filter: "Rejected",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => {
        const active = statusFilter === item.filter;
        return (
          <button
            key={item.filter}
            type="button"
            onClick={() => onFilterChange(item.filter)}
            aria-pressed={active}
            className={`rounded-2xl border px-4 py-3 text-left shadow-sm transition ${
              active
                ? "border-accent bg-accent-soft ring-2 ring-ring"
                : "border-border bg-surface hover:border-border-strong hover:bg-surface-muted"
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              {item.label}
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {item.value}
            </p>
          </button>
        );
      })}
    </div>
  );
}

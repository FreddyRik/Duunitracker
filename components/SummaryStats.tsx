import type { JobApplication } from "@/lib/types";

type SummaryStatsProps = {
  jobs: JobApplication[];
};

export function SummaryStats({ jobs }: SummaryStatsProps) {
  const total = jobs.length;
  const applied = jobs.filter((job) => job.applied).length;
  const inProgress = jobs.filter(
    (job) => job.status === "Interview" || job.status === "Offer",
  ).length;
  const rejected = jobs.filter((job) => job.status === "Rejected").length;

  const items = [
    { label: "Total Jobs", value: total },
    { label: "Applied", value: applied },
    { label: "In Progress", value: inProgress },
    { label: "Rejected", value: rejected },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {item.label}
          </p>
          <p className="mt-1 text-2xl font-bold text-foreground">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

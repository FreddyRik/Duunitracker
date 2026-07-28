"use client";

import { formatCompanyName, formatDate } from "@/lib/format";
import { formatDeadlineRelative, isDeadlineUrgent } from "@/lib/job-status";
import { workTypeStyles } from "@/lib/job-status-styles";
import { isSafeHttpUrl } from "@/lib/validate";
import type { JobApplication } from "@/types/job";

function DeadlineBadge({ deadline }: { deadline: string }) {
  const urgent = isDeadlineUrgent(deadline);
  const formatted = formatDate(deadline);
  return (
    <span
      title={formatted}
      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
        urgent
          ? "bg-badge-deadline-urgent-bg text-badge-deadline-urgent-fg"
          : "bg-badge-deadline-bg text-badge-deadline-fg"
      }`}
    >
      {formatDeadlineRelative(deadline)}
      <span className="sr-only"> ({formatted})</span>
    </span>
  );
}

export function JobSummary({ job }: { job: JobApplication }) {
  const metaParts = [
    job.interviewDate ? `Interview ${formatDate(job.interviewDate)}` : null,
  ].filter(Boolean);

  const contactParts = [
    job.contactName,
    job.contactEmail,
    job.salary ? `Salary: ${job.salary}` : null,
  ].filter(Boolean);

  const hasSafeUrl = Boolean(job.url && isSafeHttpUrl(job.url));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="font-semibold text-foreground">{job.title}</span>
        {hasSafeUrl && (
          <a
            href={job.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${job.title} posting`}
            className="inline-flex h-5 w-5 items-center justify-center rounded text-muted transition hover:bg-surface-muted hover:text-accent"
          >
            ↗
          </a>
        )}
        {job.workType && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${workTypeStyles[job.workType]}`}
          >
            {job.workType}
          </span>
        )}
      </div>
      <p className="mt-0.5 text-sm text-muted">
        {formatCompanyName(job.company)}
      </p>
      {(job.location || job.deadline) && (
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {job.location && (
            <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs text-muted-strong">
              {job.location}
            </span>
          )}
          {job.deadline && <DeadlineBadge deadline={job.deadline} />}
        </div>
      )}
      {metaParts.length > 0 && (
        <p className="mt-1 text-xs text-muted">{metaParts.join(" · ")}</p>
      )}
      {contactParts.length > 0 && (
        <p className="mt-0.5 text-xs text-muted">{contactParts.join(" · ")}</p>
      )}
    </div>
  );
}

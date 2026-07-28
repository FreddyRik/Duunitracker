"use client";

import { statusStyles } from "@/lib/job-status-styles";
import type { JobStatus } from "@/types/job";
import { JOB_STATUSES } from "@/types/job";

export function StatusSelect({
  status,
  onChange,
}: {
  status: JobStatus;
  onChange: (status: JobStatus) => void;
}) {
  return (
    <select
      value={status}
      onChange={(event) => onChange(event.target.value as JobStatus)}
      className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${statusStyles[status]}`}
    >
      {JOB_STATUSES.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

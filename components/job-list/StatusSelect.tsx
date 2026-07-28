"use client";

import { useLocale } from "@/components/LocaleProvider";
import { statusLabel } from "@/lib/i18n";
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
  const { t } = useLocale();

  return (
    <select
      value={status}
      onChange={(event) => onChange(event.target.value as JobStatus)}
      className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${statusStyles[status]}`}
    >
      {JOB_STATUSES.map((option) => (
        <option key={option} value={option}>
          {statusLabel(t, option)}
        </option>
      ))}
    </select>
  );
}

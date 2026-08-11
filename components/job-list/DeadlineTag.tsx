"use client";

import { useLocale } from "@/components/LocaleProvider";
import { formatDate } from "@/lib/format";
import {
  daysUntilDeadline,
  formatDeadlineRelative,
  isDeadlineExpired,
  isDeadlineUrgent,
} from "@/lib/job-status";

/** Closing within two days earns a pulsing marker; expired goes quiet. */
const PULSE_THRESHOLD_DAYS = 2;

export function DeadlineTag({ deadline }: { deadline: string }) {
  const { t } = useLocale();
  const expired = isDeadlineExpired(deadline);
  const urgent = !expired && isDeadlineUrgent(deadline);
  const days = daysUntilDeadline(deadline);
  const pulsing = urgent && days !== null && days <= PULSE_THRESHOLD_DAYS;
  const formatted = formatDate(deadline);

  const toneClass = expired
    ? "border border-border text-muted"
    : urgent
      ? "bg-badge-deadline-urgent-bg text-badge-deadline-urgent-fg"
      : "bg-badge-deadline-bg text-badge-deadline-fg";

  return (
    <span
      title={formatted}
      className={`inline-flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium ${toneClass}`}
    >
      {pulsing && (
        <span
          aria-hidden="true"
          className="animate-urgent h-1.5 w-1.5 rounded-full bg-current"
        />
      )}
      <span className="font-mono">
        {formatDeadlineRelative(deadline, t.deadline)}
      </span>
      <span className="sr-only"> ({formatted})</span>
    </span>
  );
}

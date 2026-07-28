import { parseFinnishDate, todayDateString } from "@/lib/format";
import type { Messages } from "@/lib/i18n/types";
import { formatTemplate } from "@/lib/i18n";
import type { JobApplication, JobStatus } from "@/types/job";

export function buildStatusUpdate(
  job: JobApplication,
  status: JobStatus,
): Partial<JobApplication> {
  const patch: Partial<JobApplication> = { status };

  if (status === "Applied") {
    patch.applied = true;
    if (!job.dateApplied) {
      patch.dateApplied = todayDateString();
    }
  } else {
    patch.applied = false;
  }

  return patch;
}

export function parseDeadlineDate(value: string | null | undefined): Date | null {
  if (!value) return null;

  const finnish = parseFinnishDate(value);
  const iso = finnish ?? value.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;

  const parsed = new Date(`${iso}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function daysUntilDeadline(value: string | null | undefined): number | null {
  const deadline = parseDeadlineDate(value);
  if (!deadline) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffMs = deadline.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function isDeadlineUrgent(value: string | null | undefined): boolean {
  const days = daysUntilDeadline(value);
  return days !== null && days >= 0 && days <= 5;
}

export function formatDeadlineRelative(
  value: string,
  deadline: Messages["deadline"],
): string {
  const days = daysUntilDeadline(value);
  if (days === null) {
    return deadline.due;
  }

  if (days < 0) {
    const overdue = Math.abs(days);
    return overdue === 1
      ? deadline.overdueOne
      : formatTemplate(deadline.overdueMany, { days: overdue });
  }

  if (days === 0) {
    return deadline.dueToday;
  }

  if (days === 1) {
    return deadline.dueTomorrow;
  }

  return formatTemplate(deadline.dueInDays, { days });
}

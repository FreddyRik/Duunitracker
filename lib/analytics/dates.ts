import { toDateInputValue } from "@/lib/format";
import {
  EMPLOYMENT_QUOTA_APPLICATIONS,
  EMPLOYMENT_QUOTA_PERIOD_DAYS,
} from "@/lib/site-config";
import type { DateRange, RangePreset } from "@/types/analytics";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const parsed = parseIsoDate(value);
  return parsed !== null && toIsoDate(parsed) === value;
}

export function parseIsoDate(value: string): Date | null {
  if (!ISO_DATE.test(value)) return null;
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  const parsed = new Date(year, month - 1, day);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }
  return parsed;
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function timestampToLocalIso(value: string): string | null {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return toIsoDate(parsed);
}

export function normalizeJobDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const iso = toDateInputValue(value);
  return iso.length > 0 && isIsoDate(iso) ? iso : null;
}

export function addDays(iso: string, days: number): string {
  const parsed = parseIsoDate(iso);
  if (!parsed) return iso;
  parsed.setDate(parsed.getDate() + days);
  return toIsoDate(parsed);
}

/** Calendar-day difference: same day is 0. */
export function diffDays(start: string, end: string): number | null {
  const from = parseIsoDate(start);
  const to = parseIsoDate(end);
  if (!from || !to) return null;
  const ms = to.getTime() - from.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function inclusiveDayCount(range: DateRange): number {
  const days = diffDays(range.start, range.end);
  if (days === null || days < 0) return 0;
  return days + 1;
}

export function isDateInRange(iso: string, range: DateRange): boolean {
  return iso >= range.start && iso <= range.end;
}

export function startOfMonth(iso: string): string {
  const parsed = parseIsoDate(iso);
  if (!parsed) return iso;
  parsed.setDate(1);
  return toIsoDate(parsed);
}

export function endOfMonth(iso: string): string {
  const parsed = parseIsoDate(iso);
  if (!parsed) return iso;
  parsed.setMonth(parsed.getMonth() + 1, 0);
  return toIsoDate(parsed);
}

export function rollingFourWeekRange(todayIso: string): DateRange {
  return {
    start: addDays(todayIso, -(EMPLOYMENT_QUOTA_PERIOD_DAYS - 1)),
    end: todayIso,
  };
}

export function thisMonthRange(todayIso: string): DateRange {
  return { start: startOfMonth(todayIso), end: todayIso };
}

export function lastMonthRange(todayIso: string): DateRange {
  const firstOfThisMonth = startOfMonth(todayIso);
  const lastMonthEnd = addDays(firstOfThisMonth, -1);
  return { start: startOfMonth(lastMonthEnd), end: lastMonthEnd };
}

export type ResolvedDateRange = {
  range: DateRange;
  error: "invalid" | "order" | null;
};

export function resolvePresetRange(
  preset: RangePreset,
  todayIso: string,
  custom: { start: string; end: string },
): ResolvedDateRange {
  if (preset === "thisMonth") {
    return { range: thisMonthRange(todayIso), error: null };
  }
  if (preset === "lastMonth") {
    return { range: lastMonthRange(todayIso), error: null };
  }
  if (preset === "custom") {
    if (!isIsoDate(custom.start) || !isIsoDate(custom.end)) {
      return { range: rollingFourWeekRange(todayIso), error: "invalid" };
    }
    if (custom.start > custom.end) {
      return { range: rollingFourWeekRange(todayIso), error: "order" };
    }
    return { range: { start: custom.start, end: custom.end }, error: null };
  }
  return { range: rollingFourWeekRange(todayIso), error: null };
}

export function quotaTargetForRangeDays(days: number): number {
  if (days <= 0) return EMPLOYMENT_QUOTA_APPLICATIONS;
  return Math.max(
    1,
    Math.round(
      (days / EMPLOYMENT_QUOTA_PERIOD_DAYS) * EMPLOYMENT_QUOTA_APPLICATIONS,
    ),
  );
}

/** Consecutive 7-day windows from range.start; the last window may be shorter. */
export function weekWindows(range: DateRange): DateRange[] {
  const days = inclusiveDayCount(range);
  if (days <= 0 || !isIsoDate(range.start) || !isIsoDate(range.end)) {
    return [];
  }

  const windows: DateRange[] = [];
  let cursor = range.start;
  while (cursor <= range.end) {
    const weekEnd = addDays(cursor, 6);
    windows.push({
      start: cursor,
      end: weekEnd < range.end ? weekEnd : range.end,
    });
    cursor = addDays(cursor, 7);
  }
  return windows;
}

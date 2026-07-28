import { en } from "@/lib/i18n/messages/en";
import { fi } from "@/lib/i18n/messages/fi";
import type { Messages } from "@/lib/i18n/types";
import type { Locale } from "@/types/locale";
import type { JobStatus, WorkType } from "@/types/job";

const catalogs: Record<Locale, Messages> = { fi, en };

export function getMessages(locale: Locale): Messages {
  return catalogs[locale];
}

export function formatTemplate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(values[key] ?? ""),
  );
}

export function statusLabel(t: Messages, status: JobStatus): string {
  return t.status[status];
}

export function workTypeLabel(t: Messages, workType: WorkType): string {
  return t.workType[workType];
}

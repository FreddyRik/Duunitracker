import { en } from "@/lib/i18n/messages/en";
import { fi } from "@/lib/i18n/messages/fi";
import type { Messages } from "@/lib/i18n/types";
import type { FunnelStageId } from "@/types/analytics";
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

export function funnelStageLabel(t: Messages, stage: FunnelStageId): string {
  const labels: Record<FunnelStageId, string> = {
    applied: t.analytics.stageApplied,
    inReview: t.analytics.stageInReview,
    interview: t.analytics.stageInterview,
    offer: t.analytics.stageOffer,
    rejected: t.analytics.stageRejected,
  };
  return labels[stage];
}

import type { JobStatus } from "@/types/job";

export const DASHBOARD_VIEWS = ["list", "analytics"] as const;
export type DashboardViewId = (typeof DASHBOARD_VIEWS)[number];

export const FUNNEL_STAGE_IDS = [
  "applied",
  "inReview",
  "interview",
  "offer",
  "rejected",
] as const;

export type FunnelStageId = (typeof FUNNEL_STAGE_IDS)[number];

export type FunnelStage = {
  id: FunnelStageId;
  count: number;
  /** Share of submitted applications, 0–100. */
  percentOfApplied: number;
  /** Drop from the previous conversion stage, 0–100. Null when not comparable. */
  dropOffPercent: number | null;
};

export type FunnelReport = {
  submittedCount: number;
  waitingCount: number;
  respondedCount: number;
  stages: FunnelStage[];
};

export type DateRange = {
  start: string;
  end: string;
};

export const RANGE_PRESETS = [
  "rolling4Weeks",
  "thisMonth",
  "lastMonth",
  "custom",
] as const;

export type RangePreset = (typeof RANGE_PRESETS)[number];

export type QuotaWeek = {
  start: string;
  end: string;
  count: number;
  pacingTarget: number;
};

export type QuotaProgress = {
  range: DateRange;
  rangeDays: number;
  appliedCount: number;
  targetCount: number;
  percent: number;
  remaining: number;
  met: boolean;
  weeks: QuotaWeek[];
};

export type ResponseTimeRow = {
  key: string;
  label: string;
  sampleSize: number;
  averageDays: number;
  pendingCount: number;
};

export type ResponseTimeMetrics = {
  overall: ResponseTimeRow | null;
  byStatus: ResponseTimeRow[];
  byCompany: ResponseTimeRow[];
  pendingCount: number;
  respondedCount: number;
};

export type OfficialReportRow = {
  dateApplied: string;
  company: string;
  title: string;
  location: string | null;
  status: JobStatus;
  url: string;
};

export type OfficialReportData = {
  generatedAt: string;
  range: DateRange;
  quota: QuotaProgress;
  rows: OfficialReportRow[];
  funnel: FunnelReport;
  responseTime: ResponseTimeMetrics;
};

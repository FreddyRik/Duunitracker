import type { FunnelStageId } from "@/types/analytics";

export const FUNNEL_STAGE_FILL: Record<FunnelStageId, string> = {
  applied: "var(--status-applied)",
  inReview: "color-mix(in srgb, var(--status-applied) 72%, var(--foreground))",
  interview: "var(--status-interview)",
  offer: "var(--status-offer)",
  rejected: "var(--status-rejected)",
};

export const FUNNEL_CONVERSION_STAGE_IDS = [
  "applied",
  "inReview",
  "interview",
  "offer",
] as const;

import type { FunnelStageId } from "@/types/analytics";

export const FUNNEL_STAGE_FILL: Record<FunnelStageId, string> = {
  applied: "var(--status-applied)",
  inReview: "var(--status-applied)",
  interview: "var(--status-interview)",
  offer: "var(--status-offer)",
  rejected: "var(--status-rejected)",
};

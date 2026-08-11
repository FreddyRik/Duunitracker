import type { JobStatus, WorkType } from "@/types/job";

export const statusStyles: Record<JobStatus, string> = {
  Saved: "bg-badge-saved-bg text-badge-saved-fg",
  Applied: "bg-badge-applied-bg text-badge-applied-fg",
  Interview: "bg-badge-interview-bg text-badge-interview-fg",
  Rejected: "bg-badge-rejected-bg text-badge-rejected-fg",
  Offer: "bg-badge-offer-bg text-badge-offer-fg",
};

export const workTypeStyles: Record<WorkType, string> = {
  Remote: "bg-badge-remote-bg text-badge-remote-fg",
  Hybrid: "bg-badge-hybrid-bg text-badge-hybrid-fg",
  "On-site": "bg-badge-onsite-bg text-badge-onsite-fg",
};

/** Solid fill for status dots and pipeline rail segments. */
export const statusDotStyles: Record<JobStatus, string> = {
  Saved: "bg-status-saved",
  Applied: "bg-status-applied",
  Interview: "bg-status-interview",
  Rejected: "bg-status-rejected",
  Offer: "bg-status-offer",
};

export const statusRingStyles: Record<JobStatus, string> = {
  Saved: "ring-status-saved",
  Applied: "ring-status-applied",
  Interview: "ring-status-interview",
  Rejected: "ring-status-rejected",
  Offer: "ring-status-offer",
};

/** Low-alpha tint used for active tabs and selected rows. */
export const statusWashStyles: Record<JobStatus, string> = {
  Saved: "bg-status-saved-wash",
  Applied: "bg-status-applied-wash",
  Interview: "bg-status-interview-wash",
  Rejected: "bg-status-rejected-wash",
  Offer: "bg-status-offer-wash",
};

export const statusTextStyles: Record<JobStatus, string> = {
  Saved: "text-status-saved",
  Applied: "text-status-applied",
  Interview: "text-status-interview",
  Rejected: "text-status-rejected",
  Offer: "text-status-offer",
};

export const PIPELINE_SEGMENTS = 4;

/** How far along the pipeline each status sits, out of PIPELINE_SEGMENTS. */
export const STATUS_PIPELINE_INDEX: Record<JobStatus, number> = {
  Saved: 1,
  Applied: 2,
  Interview: 3,
  Offer: 4,
  Rejected: PIPELINE_SEGMENTS,
};

/** Active work first, archive last. */
export const STATUS_GROUP_ORDER: JobStatus[] = [
  "Interview",
  "Offer",
  "Applied",
  "Saved",
  "Rejected",
];

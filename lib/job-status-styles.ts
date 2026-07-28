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

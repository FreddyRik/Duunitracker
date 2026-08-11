"use client";

import type { JobApplication } from "@/types/job";

export type JobListHandlers = {
  onUpdate: (
    id: string,
    patch: Partial<JobApplication>,
  ) => Promise<boolean | void>;
  onEdit: (job: JobApplication) => void;
  onDelete: (id: string) => Promise<void>;
  /** Opens the detail panel for a job. */
  onOpen: (job: JobApplication) => void;
};

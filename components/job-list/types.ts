"use client";

import type { JobApplication } from "@/types/job";

export type JobListHandlers = {
  onUpdate: (
    id: string,
    patch: Partial<JobApplication>,
  ) => Promise<boolean | void>;
  onEdit: (job: JobApplication) => void;
  onDelete: (id: string) => Promise<void>;
  onViewDescription: (job: JobApplication) => void;
};

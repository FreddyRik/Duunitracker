import type { JobAttachmentBackup } from "@/types/attachment";
import type { JobApplication } from "@/types/job";

/** Bump when the on-disk / backup envelope shape changes. */
export const JOBS_SCHEMA_VERSION = 2;

export type JobsBackupDocument = {
  schemaVersion: number;
  exportedAt?: string;
  jobs: JobApplication[];
  attachments?: JobAttachmentBackup[];
};

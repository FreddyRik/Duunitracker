import type { JobApplication } from "@/types/job";
import type { JobAttachmentRecord } from "@/types/attachment";

export type OfflineStoreKind = "indexeddb" | "localstorage";

/**
 * Persistence port used by the jobs store. Reads return untrusted values;
 * callers must validate before treating them as domain objects.
 */
export type OfflineStore = {
  readonly kind: OfflineStoreKind;
  readonly attachmentsSupported: boolean;
  countJobs(): Promise<number>;
  listJobs(): Promise<unknown[]>;
  putJob(job: JobApplication): Promise<void>;
  removeJob(id: string): Promise<void>;
  replaceAllJobs(jobs: JobApplication[]): Promise<void>;
  listAttachments(): Promise<unknown[]>;
  listAttachmentsByJob(jobId: string): Promise<unknown[]>;
  getAttachment(id: string): Promise<unknown>;
  putAttachment(record: JobAttachmentRecord): Promise<void>;
  removeAttachment(id: string): Promise<void>;
  removeAttachmentsByJob(jobId: string): Promise<void>;
  replaceAllAttachments(records: JobAttachmentRecord[]): Promise<void>;
};

export const ATTACHMENT_KINDS = ["cv", "cover_letter", "other"] as const;

export type AttachmentKind = (typeof ATTACHMENT_KINDS)[number];

export type JobAttachmentMeta = {
  id: string;
  jobId: string;
  kind: AttachmentKind;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: string;
  updatedAt: string;
};

export type JobAttachmentRecord = JobAttachmentMeta & {
  payload: Blob;
};

/** JSON-safe attachment used in versioned backups. */
export type JobAttachmentBackup = JobAttachmentMeta & {
  dataBase64: string;
};

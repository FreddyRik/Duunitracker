export type IdbMetaRecord = {
  key: string;
  value: string;
};

/** On-disk attachment: Blob is converted to ArrayBuffer for IDB portability. */
export type IdbAttachmentRecord = {
  id: string;
  jobId: string;
  kind: string;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: string;
  updatedAt: string;
  payload: ArrayBuffer;
};


export const STORAGE_ERROR_CODES = [
  "quota",
  "unavailable",
  "corrupted",
  "overwrite_blocked",
  "attachments_unavailable",
] as const;

export type StorageErrorCode = (typeof STORAGE_ERROR_CODES)[number];

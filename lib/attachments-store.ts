import {
  parseStoredAttachment,
  toAttachmentMeta,
} from "@/lib/attachment-schema";
import { StorageError } from "@/lib/browser-storage";
import { blobToBase64, base64ToBlob } from "@/lib/blob-encoding";
import {
  ALLOWED_ATTACHMENT_MIME_TYPES,
  MAX_ATTACHMENT_BYTES,
  MAX_ATTACHMENTS_PER_JOB,
} from "@/lib/site-config";
import { ValidationError } from "@/lib/validate";
import type {
  AttachmentKind,
  JobAttachmentBackup,
  JobAttachmentMeta,
  JobAttachmentRecord,
} from "@/types/attachment";
import type { OfflineStore } from "@/types/offline-store";

const MIME_BY_EXTENSION: Record<string, string> = {
  pdf: "application/pdf",
  txt: "text/plain",
  md: "text/markdown",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export function sanitizeFilename(name: string): string {
  const trimmed = name.replace(/[/\\?%*:|"<>]/g, "-").trim();
  return trimmed.slice(0, 180) || "attachment";
}

export function mimeTypeFromFilename(filename: string): string | null {
  const extension = filename.split(".").pop()?.toLowerCase();
  if (!extension) return null;
  return MIME_BY_EXTENSION[extension] ?? null;
}

export function isAllowedAttachmentMime(mimeType: string): boolean {
  const base = mimeType.split(";")[0]?.trim().toLowerCase() ?? "";
  return ALLOWED_ATTACHMENT_MIME_TYPES.some((allowed) => allowed === base);
}

function assertAttachmentsSupported(store: OfflineStore): void {
  if (!store.attachmentsSupported) {
    throw new StorageError(
      "attachments_unavailable",
      "This browser cannot store attachments",
    );
  }
}

export function recordsFromUnknown(values: unknown[]): JobAttachmentRecord[] {
  const records: JobAttachmentRecord[] = [];
  for (const value of values) {
    const parsed = parseStoredAttachment(value);
    if (parsed) records.push(parsed);
  }
  return records;
}

export async function listJobAttachmentMeta(
  store: OfflineStore,
  jobId: string,
): Promise<JobAttachmentMeta[]> {
  const rows = await store.listAttachmentsByJob(jobId);
  return recordsFromUnknown(rows).map(toAttachmentMeta);
}

export async function readCoverLetterText(
  store: OfflineStore,
  jobId: string,
): Promise<string> {
  const records = recordsFromUnknown(await store.listAttachmentsByJob(jobId));
  const draft = records.find((record) => record.kind === "cover_letter");
  if (!draft) return "";
  return draft.payload.text();
}

export async function getAttachmentFile(
  store: OfflineStore,
  id: string,
): Promise<JobAttachmentRecord | null> {
  return parseStoredAttachment(await store.getAttachment(id));
}

export async function attachmentRecordToBackup(
  record: JobAttachmentRecord,
): Promise<JobAttachmentBackup> {
  return {
    ...toAttachmentMeta(record),
    dataBase64: await blobToBase64(record.payload),
  };
}

export function backupToAttachmentRecord(
  backup: JobAttachmentBackup,
): JobAttachmentRecord {
  return {
    id: backup.id,
    jobId: backup.jobId,
    kind: backup.kind,
    filename: backup.filename,
    mimeType: backup.mimeType,
    size: backup.size,
    createdAt: backup.createdAt,
    updatedAt: backup.updatedAt,
    payload: base64ToBlob(backup.dataBase64, backup.mimeType),
  };
}

export async function putJobAttachment(
  store: OfflineStore,
  input: {
    jobId: string;
    kind: AttachmentKind;
    file: Blob;
    filename: string;
    replaceKind?: boolean;
  },
): Promise<JobAttachmentRecord> {
  assertAttachmentsSupported(store);

  const mimeType =
    (input.file.type || mimeTypeFromFilename(input.filename) || "")
      .split(";")[0]
      ?.trim()
      .toLowerCase() ?? "";
  if (!isAllowedAttachmentMime(mimeType)) {
    throw new ValidationError(
      "Attachment type is not supported",
      "invalid_schema",
    );
  }
  if (input.file.size > MAX_ATTACHMENT_BYTES) {
    throw new ValidationError("Attachment is too large", "too_large");
  }

  const existing = recordsFromUnknown(
    await store.listAttachmentsByJob(input.jobId),
  );
  const replaceable = input.replaceKind
    ? existing.filter((record) => record.kind === input.kind)
    : [];
  const remaining = existing.filter(
    (record) => !replaceable.some((match) => match.id === record.id),
  );
  if (remaining.length >= MAX_ATTACHMENTS_PER_JOB) {
    throw new ValidationError(
      `Cannot store more than ${MAX_ATTACHMENTS_PER_JOB} attachments per job`,
      "too_large",
    );
  }

  for (const record of replaceable) {
    await store.removeAttachment(record.id);
  }

  const now = new Date().toISOString();
  const reused = replaceable[0];
  const record: JobAttachmentRecord = {
    id: reused?.id ?? crypto.randomUUID(),
    jobId: input.jobId,
    kind: input.kind,
    filename: sanitizeFilename(input.filename),
    mimeType,
    size: input.file.size,
    createdAt: reused?.createdAt ?? now,
    updatedAt: now,
    payload: input.file,
  };
  await store.putAttachment(record);
  return record;
}

export async function deleteJobAttachment(
  store: OfflineStore,
  id: string,
): Promise<void> {
  assertAttachmentsSupported(store);
  await store.removeAttachment(id);
}

export async function exportAttachmentBackups(
  store: OfflineStore,
): Promise<JobAttachmentBackup[]> {
  if (!store.attachmentsSupported) return [];
  const records = recordsFromUnknown(await store.listAttachments());
  const backups: JobAttachmentBackup[] = [];
  for (const record of records) {
    backups.push(await attachmentRecordToBackup(record));
  }
  return backups;
}

export async function importAttachmentBackups(
  store: OfflineStore,
  backups: JobAttachmentBackup[],
): Promise<void> {
  if (backups.length === 0) {
    await store.replaceAllAttachments([]);
    return;
  }
  assertAttachmentsSupported(store);
  await store.replaceAllAttachments(backups.map(backupToAttachmentRecord));
}

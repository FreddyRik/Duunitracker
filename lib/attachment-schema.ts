import { z } from "zod";
import { JOB_FIELD_LIMITS } from "@/lib/site-config";
import { isRecord } from "@/lib/validate";
import {
  ATTACHMENT_KINDS,
  type AttachmentKind,
  type JobAttachmentMeta,
  type JobAttachmentRecord,
} from "@/types/attachment";

export function isAttachmentKind(value: unknown): value is AttachmentKind {
  return (
    typeof value === "string" &&
    ATTACHMENT_KINDS.some((kind) => kind === value)
  );
}

const attachmentKindSchema = z.custom<AttachmentKind>(isAttachmentKind, {
  message: "Invalid attachment kind",
});

export const jobAttachmentBackupSchema = z
  .object({
    id: z.string().min(1).max(JOB_FIELD_LIMITS.id),
    jobId: z.string().min(1).max(JOB_FIELD_LIMITS.id),
    kind: attachmentKindSchema,
    filename: z.string().trim().min(1).max(180),
    mimeType: z.string().min(1).max(200),
    size: z.number().int().nonnegative(),
    createdAt: z.string().min(1),
    updatedAt: z.string().min(1),
    dataBase64: z.string().min(1),
  })
  .strip();

function isArrayBufferLike(value: unknown): value is ArrayBuffer {
  return Object.prototype.toString.call(value) === "[object ArrayBuffer]";
}

function copyArrayBuffer(value: ArrayBuffer): ArrayBuffer {
  const view = new Uint8Array(value);
  const copy = new ArrayBuffer(view.byteLength);
  new Uint8Array(copy).set(view);
  return copy;
}

function coercePayload(value: unknown, mimeType: string): Blob | null {
  if (typeof Blob !== "undefined" && value instanceof Blob) return value;
  if (isArrayBufferLike(value) || value instanceof ArrayBuffer) {
    return new Blob([copyArrayBuffer(value)], { type: mimeType });
  }
  if (ArrayBuffer.isView(value)) {
    const view = new Uint8Array(value.byteLength);
    view.set(new Uint8Array(value.buffer, value.byteOffset, value.byteLength));
    return new Blob([copyArrayBuffer(view.buffer)], { type: mimeType });
  }
  if (typeof value === "string") {
    return new Blob([value], { type: mimeType || "text/plain" });
  }
  return null;
}

export function toAttachmentMeta(
  record: JobAttachmentRecord,
): JobAttachmentMeta {
  return {
    id: record.id,
    jobId: record.jobId,
    kind: record.kind,
    filename: record.filename,
    mimeType: record.mimeType,
    size: record.size,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export function parseStoredAttachment(
  value: unknown,
): JobAttachmentRecord | null {
  if (!isRecord(value)) return null;
  if (!isAttachmentKind(value.kind)) return null;
  if (typeof value.id !== "string" || !value.id.trim()) return null;
  if (typeof value.jobId !== "string" || !value.jobId.trim()) return null;
  if (typeof value.filename !== "string" || !value.filename.trim()) return null;
  if (typeof value.mimeType !== "string" || !value.mimeType.trim()) return null;
  if (typeof value.size !== "number" || !Number.isFinite(value.size)) {
    return null;
  }
  if (typeof value.createdAt !== "string" || typeof value.updatedAt !== "string") {
    return null;
  }

  const payload = coercePayload(value.payload, value.mimeType);
  if (!payload) return null;

  return {
    id: value.id.trim().slice(0, JOB_FIELD_LIMITS.id),
    jobId: value.jobId.trim().slice(0, JOB_FIELD_LIMITS.id),
    kind: value.kind,
    filename: value.filename.trim().slice(0, 180),
    mimeType: value.mimeType.trim().slice(0, 200),
    size: Math.max(0, Math.floor(value.size)),
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
    payload,
  };
}

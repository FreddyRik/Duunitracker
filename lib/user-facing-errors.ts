import { StorageError } from "@/lib/browser-storage";
import { formatTemplate } from "@/lib/i18n";
import { ParseJobError, isParseJobErrorCode } from "@/lib/parse-duunitori/errors";
import { ValidationError } from "@/lib/validate";
import type { Messages } from "@/lib/i18n/types";
import type { ParseJobErrorCode } from "@/types/parse-job";

export function parseJobErrorMessage(
  code: ParseJobErrorCode,
  t: Messages,
): string {
  switch (code) {
    case "invalid_url":
      return t.errors.parseInvalidUrl;
    case "invalid_request":
      return t.errors.parseInvalidUrl;
    case "timeout":
      return t.errors.parseTimeout;
    case "network":
      return t.errors.parseNetwork;
    case "blocked":
      return t.errors.parseBlocked;
    case "invalid_html":
      return t.errors.parseInvalidHtml;
    case "unparseable":
      return t.errors.parseUnparseable;
    case "too_large":
      return t.errors.parseTooLarge;
    case "redirect":
      return t.errors.parseNetwork;
    default:
      return t.errors.importJobFailed;
  }
}

export function toUserFacingError(
  error: unknown,
  t: Messages,
  fallback: string,
): string {
  if (error instanceof StorageError) {
    switch (error.code) {
      case "quota":
        return t.errors.storageQuotaExceeded;
      case "unavailable":
        return t.errors.storageUnavailable;
      case "corrupted":
        return t.errors.storageCorrupted;
      case "overwrite_blocked":
        return t.errors.storageOverwriteBlocked;
      case "attachments_unavailable":
        return t.errors.attachmentsUnavailable;
      default:
        return t.errors.storageUnavailable;
    }
  }

  if (error instanceof ParseJobError) {
    return parseJobErrorMessage(error.code, t);
  }

  if (error instanceof ValidationError) {
    switch (error.code) {
      case "invalid_json":
        return t.errors.invalidJson;
      case "empty":
        return t.errors.importEmpty;
      case "too_large":
        return t.errors.importTooLarge;
      case "unsupported_version":
        return t.errors.importUnsupportedVersion;
      case "invalid_shape":
      case "invalid_schema":
        return error.message || t.errors.importSchemaInvalid;
      default:
        return error.message || fallback;
    }
  }

  if (error instanceof SyntaxError) {
    return t.errors.invalidJson;
  }

  if (error instanceof Error && isParseJobErrorCode(error.message)) {
    return parseJobErrorMessage(error.message, t);
  }

  return error instanceof Error && error.message ? error.message : fallback;
}

export function skippedRecordsMessage(count: number, t: Messages): string {
  return formatTemplate(t.errors.storagePartialSkip, { count });
}

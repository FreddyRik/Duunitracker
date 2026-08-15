import type { ParseJobErrorCode } from "@/types/parse-job";
import { PARSE_JOB_ERROR_CODES } from "@/types/parse-job";

export class ParseJobError extends Error {
  readonly code: ParseJobErrorCode;
  readonly httpStatus?: number;

  constructor(code: ParseJobErrorCode, message: string, httpStatus?: number) {
    super(message);
    this.name = "ParseJobError";
    this.code = code;
    this.httpStatus = httpStatus;
  }
}

export function isParseJobError(error: unknown): error is ParseJobError {
  return error instanceof ParseJobError;
}

export function isAbortError(error: unknown): boolean {
  return (
    (typeof DOMException !== "undefined" &&
      error instanceof DOMException &&
      error.name === "AbortError") ||
    (error instanceof Error && error.name === "AbortError")
  );
}

export function isParseJobErrorCode(value: unknown): value is ParseJobErrorCode {
  return (
    typeof value === "string" &&
    PARSE_JOB_ERROR_CODES.some((code) => code === value)
  );
}

export async function withTimeout<T>(
  run: (signal: AbortSignal) => Promise<T>,
  timeoutMs: number,
  timeoutMessage = "Timed out fetching the job page",
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await run(controller.signal);
  } catch (error) {
    if (isAbortError(error) || controller.signal.aborted) {
      throw new ParseJobError("timeout", timeoutMessage);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export function toParseJobError(error: unknown): ParseJobError {
  if (error instanceof ParseJobError) return error;

  if (isAbortError(error)) {
    return new ParseJobError("timeout", "Timed out fetching the job page");
  }

  if (error instanceof TypeError) {
    return new ParseJobError("network", "Failed to reach the job page");
  }

  if (error instanceof Error) {
    const { message } = error;
    if (
      message.includes("duunitori.fi") ||
      message.includes("URL must") ||
      message.includes("job posting link")
    ) {
      return new ParseJobError("invalid_url", message);
    }
    if (message.includes("too large")) {
      return new ParseJobError("too_large", message);
    }
    if (
      message.includes("Too many redirects") ||
      message.includes("Redirect")
    ) {
      return new ParseJobError("redirect", message);
    }
    if (
      message.includes("invalid HTML") ||
      message.includes("Blocked") ||
      message.includes("empty HTML")
    ) {
      return new ParseJobError("invalid_html", message);
    }
    if (message.includes("Failed to fetch") || message.includes("Failed to reach")) {
      return new ParseJobError("network", message);
    }
    return new ParseJobError("network", message);
  }

  return new ParseJobError("network", "Failed to parse job posting");
}

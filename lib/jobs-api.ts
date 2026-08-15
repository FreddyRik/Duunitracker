import {
  createJob,
  deleteJob,
  updateJob,
} from "@/lib/jobs-local-store";
import {
  deleteJobAttachment,
  getAttachmentFile,
  listJobAttachmentMeta,
  putJobAttachment,
  readCoverLetterText,
} from "@/lib/attachments-store";
import { toAttachmentMeta } from "@/lib/attachment-schema";
import { getOfflineStore } from "@/lib/offline-adapter";
import { parsedJobSchema } from "@/lib/job-schema";
import {
  isParseJobErrorCode,
  ParseJobError,
  toParseJobError,
  withTimeout,
} from "@/lib/parse-duunitori/errors";
import { isDuunitoriJobUrl } from "@/lib/parse-duunitori/url";
import {
  MAX_JOB_HTML_CHARS,
  PARSE_JOB_CLIENT_TIMEOUT_MS,
} from "@/lib/site-config";
import { isRecord } from "@/lib/validate";
import type {
  AttachmentKind,
  JobAttachmentMeta,
  JobAttachmentRecord,
} from "@/types/attachment";
import type {
  CreateJobInput,
  JobApplication,
  ParsedJob,
  ParseJobRequest,
  UpdateJobInput,
} from "@/types/job";

const DUUNITORI_PROXY_URL = process.env.NEXT_PUBLIC_DUUNITORI_PROXY_URL?.trim();

function readErrorPayload(parsed: unknown): { error?: string; code?: string } {
  if (!isRecord(parsed)) return {};
  return {
    error: typeof parsed.error === "string" ? parsed.error : undefined,
    code: typeof parsed.code === "string" ? parsed.code : undefined,
  };
}

async function parseResponseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text.trim()) return {};
  try {
    const parsed: unknown = JSON.parse(text);
    return parsed;
  } catch {
    throw new ParseJobError(
      "network",
      "Job parser returned invalid JSON",
    );
  }
}

async function fetchDuunitoriHtmlViaProxy(
  url: string,
  signal: AbortSignal,
): Promise<string> {
  if (!DUUNITORI_PROXY_URL) {
    throw new ParseJobError(
      "network",
      "Duunitori proxy URL is not configured",
    );
  }

  const proxyBase = DUUNITORI_PROXY_URL.replace(/\/$/, "");
  let proxyResponse: Response;
  try {
    proxyResponse = await fetch(
      `${proxyBase}?url=${encodeURIComponent(url)}`,
      { method: "GET", signal },
    );
  } catch (error) {
    throw toParseJobError(error);
  }

  if (!proxyResponse.ok) {
    const contentType = proxyResponse.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const data = readErrorPayload(await parseResponseJson(proxyResponse));
      if (isParseJobErrorCode(data.code)) {
        throw new ParseJobError(
          data.code,
          data.error ?? "Failed to fetch job page from proxy",
        );
      }
      throw new ParseJobError(
        "network",
        data.error ?? "Failed to fetch job page from proxy",
        proxyResponse.status,
      );
    }

    const text = await proxyResponse.text();
    throw new ParseJobError(
      "network",
      text.slice(0, 200) || "Failed to fetch job page from proxy",
      proxyResponse.status,
    );
  }

  const html = await proxyResponse.text();
  if (html.length > MAX_JOB_HTML_CHARS) {
    throw new ParseJobError("too_large", "Job page HTML is too large");
  }
  if (!html.trim()) {
    throw new ParseJobError("invalid_html", "Proxy returned empty HTML");
  }

  return html;
}

export async function parseJobFromUrl(url: string): Promise<ParsedJob> {
  const trimmed = url.trim();
  if (!isDuunitoriJobUrl(trimmed)) {
    throw new ParseJobError(
      "invalid_url",
      "URL must be a duunitori.fi job posting link",
    );
  }

  return withTimeout(async (signal) => {
    const payload: ParseJobRequest = { url: trimmed };

    if (DUUNITORI_PROXY_URL) {
      payload.html = await fetchDuunitoriHtmlViaProxy(trimmed, signal);
    }

    let response: Response;
    try {
      response = await fetch("/api/parse-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal,
        cache: "no-store",
      });
    } catch (error) {
      throw toParseJobError(error);
    }

    const body = await parseResponseJson(response);
    if (!response.ok) {
      const data = readErrorPayload(body);
      if (isParseJobErrorCode(data.code)) {
        throw new ParseJobError(
          data.code,
          data.error ?? "Failed to parse job posting",
        );
      }
      throw new ParseJobError(
        "network",
        data.error ?? "Failed to parse job posting",
        response.status,
      );
    }

    const parsed = parsedJobSchema.safeParse(body);
    if (!parsed.success) {
      throw new ParseJobError(
        "unparseable",
        "Job parser returned an unexpected response",
      );
    }

    return parsed.data;
  }, PARSE_JOB_CLIENT_TIMEOUT_MS);
}

export async function createJobRequest(
  payload: CreateJobInput,
): Promise<JobApplication> {
  return createJob(payload);
}

export async function updateJobRequest(
  id: string,
  patch: UpdateJobInput,
): Promise<JobApplication> {
  const updated = await updateJob(id, patch);
  if (!updated) {
    throw new Error("Job not found");
  }
  return updated;
}

export async function deleteJobRequest(id: string): Promise<void> {
  const deleted = await deleteJob(id);
  if (!deleted) {
    throw new Error("Job not found");
  }
}

export async function listJobAttachmentsRequest(
  jobId: string,
): Promise<JobAttachmentMeta[]> {
  const store = await getOfflineStore();
  return listJobAttachmentMeta(store, jobId);
}

export async function readCoverLetterRequest(jobId: string): Promise<string> {
  const store = await getOfflineStore();
  return readCoverLetterText(store, jobId);
}

export async function saveCoverLetterRequest(
  jobId: string,
  text: string,
): Promise<void> {
  const store = await getOfflineStore();
  const trimmed = text.trim();
  const existing = await listJobAttachmentMeta(store, jobId);
  const draft = existing.find((item) => item.kind === "cover_letter");

  if (!trimmed) {
    if (draft) await deleteJobAttachment(store, draft.id);
    return;
  }

  await putJobAttachment(store, {
    jobId,
    kind: "cover_letter",
    filename: "cover-letter.txt",
    file: new Blob([text], { type: "text/plain;charset=utf-8" }),
    replaceKind: true,
  });
}

export async function uploadJobAttachmentRequest(
  jobId: string,
  file: File,
  kind: AttachmentKind,
): Promise<JobAttachmentMeta> {
  const store = await getOfflineStore();
  const record = await putJobAttachment(store, {
    jobId,
    kind,
    file,
    filename: file.name,
    replaceKind: kind === "cv" || kind === "cover_letter",
  });
  return toAttachmentMeta(record);
}

export async function deleteAttachmentRequest(id: string): Promise<void> {
  const store = await getOfflineStore();
  await deleteJobAttachment(store, id);
}

export async function getAttachmentFileRequest(
  id: string,
): Promise<JobAttachmentRecord | null> {
  const store = await getOfflineStore();
  return getAttachmentFile(store, id);
}

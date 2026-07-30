import {
  createJob,
  deleteJob,
  updateJob,
} from "@/lib/jobs-local-store";
import type {
  ApiErrorResponse,
  CreateJobInput,
  JobApplication,
  ParsedJob,
  ParseJobRequest,
  UpdateJobInput,
} from "@/types/job";

const DUUNITORI_PROXY_URL = process.env.NEXT_PUBLIC_DUUNITORI_PROXY_URL?.trim();

async function readJson<T>(response: Response): Promise<T & ApiErrorResponse> {
  return (await response.json()) as T & ApiErrorResponse;
}

async function readProxyError(response: Response): Promise<string> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const data = await readJson<ApiErrorResponse>(response);
    return data.error ?? "Failed to fetch job page from proxy";
  }

  const text = await response.text();
  return text.slice(0, 200) || "Failed to fetch job page from proxy";
}

async function fetchDuunitoriHtmlViaProxy(url: string): Promise<string> {
  if (!DUUNITORI_PROXY_URL) {
    throw new Error("Duunitori proxy URL is not configured");
  }

  const proxyBase = DUUNITORI_PROXY_URL.replace(/\/$/, "");
  const proxyResponse = await fetch(
    `${proxyBase}?url=${encodeURIComponent(url)}`,
    { method: "GET" },
  );

  if (!proxyResponse.ok) {
    throw new Error(await readProxyError(proxyResponse));
  }

  const html = await proxyResponse.text();
  if (!html.trim()) {
    throw new Error("Proxy returned empty HTML");
  }

  return html;
}

export async function parseJobFromUrl(url: string): Promise<ParsedJob> {
  const payload: ParseJobRequest = { url };

  if (DUUNITORI_PROXY_URL) {
    payload.html = await fetchDuunitoriHtmlViaProxy(url);
  }

  const response = await fetch("/api/parse-job", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await readJson<ParsedJob>(response);
  if (!response.ok) {
    throw new Error(data.error ?? "Failed to parse job posting");
  }
  return data;
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
  const updated = updateJob(id, patch);
  if (!updated) {
    throw new Error("Job not found");
  }
  return updated;
}

export async function deleteJobRequest(id: string): Promise<void> {
  const deleted = deleteJob(id);
  if (!deleted) {
    throw new Error("Job not found");
  }
}

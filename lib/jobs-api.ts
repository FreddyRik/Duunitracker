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
  UpdateJobInput,
} from "@/types/job";

async function readJson<T>(response: Response): Promise<T & ApiErrorResponse> {
  return (await response.json()) as T & ApiErrorResponse;
}

export async function parseJobFromUrl(url: string): Promise<ParsedJob> {
  const response = await fetch("/api/parse-job", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
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

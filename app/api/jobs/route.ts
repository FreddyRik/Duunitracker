import { NextResponse } from "next/server";
import {
  createJob,
  deleteJob,
  readJobs,
  updateJob,
  ValidationError,
} from "@/lib/jobs-store";
import type { CreateJobInput, UpdateJobInput } from "@/lib/types";

export const runtime = "nodejs";

function errorResponse(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  const status = error instanceof ValidationError ? 400 : 500;
  return NextResponse.json({ error: message }, { status });
}

async function parseJsonBody<T>(request: Request): Promise<T | Response> {
  try {
    return (await request.json()) as T;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}

export async function GET() {
  try {
    const jobs = await readJobs();
    return NextResponse.json(jobs);
  } catch (error) {
    return errorResponse(error, "Failed to read jobs");
  }
}

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody<CreateJobInput>(request);
    if (body instanceof Response) return body;

    const job = await createJob(body);
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    return errorResponse(error, "Failed to create job");
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await parseJsonBody<UpdateJobInput & { id?: string }>(request);
    if (body instanceof Response) return body;

    if (!body.id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const { id, ...patch } = body;
    const updated = await updateJob(id, patch);

    if (!updated) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return errorResponse(error, "Failed to update job");
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    let id = url.searchParams.get("id");

    if (!id && request.headers.get("content-type")?.includes("application/json")) {
      const body = await parseJsonBody<{ id?: string }>(request);
      if (body instanceof Response) return body;
      id = body.id ?? null;
    }

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const removed = await deleteJob(id);

    if (!removed) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error, "Failed to delete job");
  }
}

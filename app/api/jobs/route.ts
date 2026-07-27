import { NextResponse } from "next/server";
import {
  createJob,
  deleteJob,
  readJobs,
  updateJob,
} from "@/lib/jobs-store";
import type { CreateJobInput, UpdateJobInput } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  try {
    const jobs = await readJobs();
    return NextResponse.json(jobs);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to read jobs";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateJobInput;

    if (!body.title || !body.company) {
      return NextResponse.json(
        { error: "title and company are required" },
        { status: 400 },
      );
    }

    const job = await createJob({
      ...body,
      url: body.url?.trim() ?? "",
    });
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create job";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as UpdateJobInput & { id?: string };

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
    const message =
      error instanceof Error ? error.message : "Failed to update job";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    let id = url.searchParams.get("id");

    if (!id && request.headers.get("content-type")?.includes("application/json")) {
      const body = (await request.json()) as { id?: string };
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
    const message =
      error instanceof Error ? error.message : "Failed to delete job";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

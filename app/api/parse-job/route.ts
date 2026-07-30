import { NextResponse } from "next/server";
import {
  parseDuunitoriJob,
  parseDuunitoriJobFromHtml,
} from "@/lib/parse-duunitori";
import type { ParseJobRequest } from "@/types/job";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ParseJobRequest;

    if (!body.url || typeof body.url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const url = body.url.trim();
    const parsed =
      typeof body.html === "string" && body.html.length > 0
        ? parseDuunitoriJobFromHtml(url, body.html)
        : await parseDuunitoriJob(url);

    return NextResponse.json(parsed);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to parse job posting";

    if (message.includes("duunitori.fi")) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (message.includes("Failed to fetch")) {
      return NextResponse.json({ error: message }, { status: 502 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

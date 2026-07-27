import { NextResponse } from "next/server";
import { parseDuunitoriJob } from "@/lib/parse-duunitori";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { url?: string };

    if (!body.url || typeof body.url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const parsed = await parseDuunitoriJob(body.url.trim());
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

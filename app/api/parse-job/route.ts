import { NextResponse } from "next/server";
import { parseJobRequestSchema } from "@/lib/job-schema";
import {
  parseDuunitoriJob,
  parseDuunitoriJobFromHtml,
} from "@/lib/parse-duunitori";
import {
  isParseJobError,
  toParseJobError,
} from "@/lib/parse-duunitori/errors";
import type { ParseJobErrorCode } from "@/types/parse-job";

export const runtime = "nodejs";

function statusForCode(code: ParseJobErrorCode): number {
  switch (code) {
    case "invalid_url":
    case "invalid_request":
      return 400;
    case "timeout":
      return 504;
    case "network":
    case "blocked":
    case "invalid_html":
    case "unparseable":
    case "too_large":
    case "redirect":
      return 502;
    default:
      return 500;
  }
}

function errorResponse(code: ParseJobErrorCode, message: string) {
  return NextResponse.json({ error: message, code }, {
    status: statusForCode(code),
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  let bodyUnknown: unknown;
  try {
    bodyUnknown = await request.json();
  } catch {
    return errorResponse("invalid_request", "Request body must be JSON");
  }

  const body = parseJobRequestSchema.safeParse(bodyUnknown);
  if (!body.success) {
    const issue = body.error.issues[0];
    const message = issue?.message ?? "Invalid parse request";
    if (issue?.path[0] === "url") {
      return errorResponse("invalid_url", "URL is required");
    }
    if (issue?.path[0] === "html") {
      return errorResponse("too_large", "Job page HTML is too large");
    }
    return errorResponse("invalid_request", message);
  }

  try {
    const url = body.data.url.trim();
    const parsed =
      typeof body.data.html === "string" && body.data.html.length > 0
        ? parseDuunitoriJobFromHtml(url, body.data.html)
        : await parseDuunitoriJob(url);

    return NextResponse.json(parsed, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const parsedError = isParseJobError(error)
      ? error
      : toParseJobError(error);
    return errorResponse(parsedError.code, parsedError.message);
  }
}

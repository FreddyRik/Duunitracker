import {
  fetchDuunitoriHtml,
  isBlockedChallengePage,
  isValidJobPageHtml,
} from "@/lib/parse-duunitori/fetch";
import { ParseJobError, withTimeout } from "@/lib/parse-duunitori/errors";
import {
  extractDescriptionFromHtml,
  parseHtmlFallback,
} from "@/lib/parse-duunitori/html-fallback";
import { parseJobPostingJsonLd } from "@/lib/parse-duunitori/json-ld";
import { isDuunitoriJobUrl } from "@/lib/parse-duunitori/url";
import { MAX_JOB_HTML_CHARS, PARSE_JOB_TIMEOUT_MS } from "@/lib/site-config";
import type { ParsedJob } from "@/types/job";

export function parseDuunitoriJobFromHtml(url: string, html: string): ParsedJob {
  if (!isDuunitoriJobUrl(url)) {
    throw new ParseJobError(
      "invalid_url",
      "URL must be a duunitori.fi job posting link",
    );
  }

  if (html.length > MAX_JOB_HTML_CHARS) {
    throw new ParseJobError("too_large", "Job page HTML is too large");
  }

  const trimmed = html.trim();
  if (!trimmed) {
    throw new ParseJobError("invalid_html", "Job page HTML was empty");
  }

  if (isBlockedChallengePage(trimmed)) {
    throw new ParseJobError(
      "blocked",
      "Job page is blocked by a challenge",
    );
  }

  if (!isValidJobPageHtml(trimmed)) {
    throw new ParseJobError(
      "invalid_html",
      "Job page HTML was not a valid posting",
    );
  }

  let fromJsonLd: Partial<ParsedJob> = {};
  let fromHtml: Partial<ParsedJob> = {};
  let descriptionFromHtml: string | null = null;

  try {
    fromJsonLd = parseJobPostingJsonLd(html);
  } catch {
    fromJsonLd = {};
  }

  try {
    fromHtml = parseHtmlFallback(html);
  } catch {
    fromHtml = {};
  }

  try {
    descriptionFromHtml = extractDescriptionFromHtml(html);
  } catch {
    descriptionFromHtml = null;
  }

  const title = fromHtml.title ?? fromJsonLd.title;
  const company = fromHtml.company ?? fromJsonLd.company;

  if (!title && !company) {
    throw new ParseJobError(
      "unparseable",
      "Could not extract job details from this page",
    );
  }

  return {
    url,
    title: title ?? "Unknown title",
    company: company ?? "Unknown company",
    location: fromJsonLd.location ?? fromHtml.location ?? null,
    deadline: fromJsonLd.deadline ?? fromHtml.deadline ?? null,
    description: fromJsonLd.description ?? descriptionFromHtml ?? null,
  };
}

export async function parseDuunitoriJob(url: string): Promise<ParsedJob> {
  if (!isDuunitoriJobUrl(url)) {
    throw new ParseJobError(
      "invalid_url",
      "URL must be a duunitori.fi job posting link",
    );
  }

  const html = await withTimeout(
    (signal) => fetchDuunitoriHtml(url, signal),
    PARSE_JOB_TIMEOUT_MS,
  );

  return parseDuunitoriJobFromHtml(url, html);
}

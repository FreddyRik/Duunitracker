import * as cheerio from "cheerio";
import {
  extractLocationFromJobPosting,
  htmlToPlainText,
  normalizeText,
} from "@/lib/parse-duunitori/text";
import { isRecord } from "@/lib/validate";
import type { ParsedJob } from "@/types/job";

function isJobPostingType(type: unknown): boolean {
  if (type === "JobPosting" || type === "https://schema.org/JobPosting") {
    return true;
  }
  if (Array.isArray(type)) {
    return type.some((entry) => isJobPostingType(entry));
  }
  return false;
}

function flattenJsonLd(node: unknown): Record<string, unknown>[] {
  if (Array.isArray(node)) {
    return node.flatMap(flattenJsonLd);
  }
  if (!isRecord(node)) return [];

  const graph = node["@graph"];
  if (Array.isArray(graph)) {
    return [node, ...graph.flatMap(flattenJsonLd)];
  }

  return [node];
}

function applyJobPosting(
  record: Record<string, unknown>,
  result: Partial<ParsedJob>,
): void {
  if (!isJobPostingType(record["@type"])) return;

  if (!result.title && typeof record.title === "string") {
    result.title = normalizeText(record.title) ?? undefined;
  }

  const hiringOrganization = record.hiringOrganization;
  if (
    !result.company &&
    isRecord(hiringOrganization) &&
    typeof hiringOrganization.name === "string"
  ) {
    result.company = normalizeText(hiringOrganization.name) ?? undefined;
  }

  if (!result.location) {
    const location = extractLocationFromJobPosting(record);
    if (location) result.location = location;
  }

  if (!result.deadline && typeof record.validThrough === "string") {
    result.deadline = normalizeText(record.validThrough);
  }

  if (!result.description && typeof record.description === "string") {
    const description = htmlToPlainText(record.description);
    if (description) result.description = description;
  }
}

export function parseJobPostingJsonLd(html: string): Partial<ParsedJob> {
  if (!html.trim()) return {};

  let $: ReturnType<typeof cheerio.load>;
  try {
    $ = cheerio.load(html);
  } catch {
    return {};
  }

  const result: Partial<ParsedJob> = {};

  $("script[type='application/ld+json']").each((_, element) => {
    const raw = $(element).html();
    if (!raw) return;

    try {
      const parsed: unknown = JSON.parse(raw);
      for (const candidate of flattenJsonLd(parsed)) {
        applyJobPosting(candidate, result);
      }
    } catch {
      // Ignore malformed JSON-LD blocks and continue.
    }
  });

  return result;
}

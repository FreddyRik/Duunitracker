import * as cheerio from "cheerio";
import {
  extractLocationFromJobPosting,
  htmlToPlainText,
  normalizeText,
} from "@/lib/parse-duunitori/text";
import type { ParsedJob } from "@/types/job";

export function parseJobPostingJsonLd(html: string): Partial<ParsedJob> {
  const $ = cheerio.load(html);
  const result: Partial<ParsedJob> = {};

  $("script[type='application/ld+json']").each((_, element) => {
    const raw = $(element).html();
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as unknown;
      const candidates = Array.isArray(parsed) ? parsed : [parsed];

      for (const candidate of candidates) {
        if (typeof candidate !== "object" || candidate === null) continue;

        const record = candidate as Record<string, unknown>;
        const type = record["@type"];

        if (type !== "JobPosting" && type !== "https://schema.org/JobPosting") {
          continue;
        }

        if (!result.title && typeof record.title === "string") {
          result.title = normalizeText(record.title) ?? undefined;
        }

        const hiringOrganization = record.hiringOrganization;
        if (
          !result.company &&
          typeof hiringOrganization === "object" &&
          hiringOrganization !== null &&
          typeof (hiringOrganization as Record<string, unknown>).name ===
            "string"
        ) {
          result.company =
            normalizeText(
              (hiringOrganization as Record<string, unknown>).name as string,
            ) ?? undefined;
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
    } catch {
      // Ignore malformed JSON-LD blocks and continue.
    }
  });

  return result;
}

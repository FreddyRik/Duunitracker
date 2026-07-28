import {
  assertDuunitoriHttpsUrl,
  fetchDuunitoriHtml,
} from "@/lib/parse-duunitori/fetch";
import {
  extractDescriptionFromHtml,
  parseHtmlFallback,
} from "@/lib/parse-duunitori/html-fallback";
import { parseJobPostingJsonLd } from "@/lib/parse-duunitori/json-ld";
import type { ParsedJob } from "@/types/job";

export async function parseDuunitoriJob(url: string): Promise<ParsedJob> {
  assertDuunitoriHttpsUrl(url);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const html = await fetchDuunitoriHtml(url, controller.signal);
    const fromJsonLd = parseJobPostingJsonLd(html);
    const fromHtml = parseHtmlFallback(html);

    return {
      url,
      title: fromHtml.title ?? fromJsonLd.title ?? "Unknown title",
      company: fromHtml.company ?? fromJsonLd.company ?? "Unknown company",
      location: fromJsonLd.location ?? fromHtml.location ?? null,
      deadline: fromJsonLd.deadline ?? fromHtml.deadline ?? null,
      description:
        fromJsonLd.description ?? extractDescriptionFromHtml(html) ?? null,
    };
  } finally {
    clearTimeout(timeout);
  }
}

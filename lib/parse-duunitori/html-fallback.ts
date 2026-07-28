import * as cheerio from "cheerio";
import { normalizeText } from "@/lib/parse-duunitori/text";
import type { ParsedJob } from "@/types/job";

function parseOgTitle(
  content: string,
): { title: string | null; company: string | null } {
  const withoutSuffix = content
    .replace(/\s*[-|]\s*Työpaikat\s*[-|]\s*Duunitori\s*$/i, "")
    .trim();
  const parts = withoutSuffix
    .split(/\s+-\s+/)
    .map((part) => normalizeText(part))
    .filter((part): part is string => Boolean(part));

  if (parts.length === 0) {
    return { title: null, company: null };
  }

  if (parts.length === 1) {
    return { title: parts[0], company: null };
  }

  return {
    title: parts[0],
    company: parts[1],
  };
}

export function parseHtmlFallback(html: string): Partial<ParsedJob> {
  const $ = cheerio.load(html);
  const result: Partial<ParsedJob> = {};

  const ogTitleContent = $("meta[property='og:title']").attr("content");
  const fromOg = ogTitleContent ? parseOgTitle(ogTitleContent) : null;

  const h1 =
    normalizeText($("main h1").first().text()) ??
    normalizeText($("h1").first().text());

  const pageTitle = normalizeText($("title").text());
  const fromPageTitle = pageTitle ? parseOgTitle(pageTitle) : null;

  result.title = h1 ?? fromOg?.title ?? fromPageTitle?.title ?? undefined;
  result.company = fromOg?.company ?? fromPageTitle?.company ?? undefined;

  const companySelectors = [
    "a[href*='/yritys/']",
    "[data-testid='company-name']",
    ".job-header__employer",
    ".job-box__logo + div a",
    ".job-box__logo + div",
    ".employer-name",
  ];

  if (!result.company) {
    for (const selector of companySelectors) {
      const company = normalizeText($(selector).first().text());
      if (company) {
        result.company = company;
        break;
      }
    }
  }

  const locationSelectors = [
    "[data-testid='job-location']",
    ".job-box__info li",
    ".job-box__location",
    "[class*='location']",
  ];

  for (const selector of locationSelectors) {
    const location = normalizeText($(selector).first().text());
    if (location && location.length < 80) {
      result.location = location;
      break;
    }
  }

  const bodyText = $("body").text();
  const deadlineMatch = bodyText.match(
    /(?:hakuaika|haku päättyy|deadline|viimeinen hakupäivä)[:\s]*([0-9]{1,2}\.[0-9]{1,2}\.[0-9]{2,4})/i,
  );

  if (deadlineMatch?.[1]) {
    result.deadline = normalizeText(deadlineMatch[1]);
  }

  return result;
}

export function extractDescriptionFromHtml(html: string): string | null {
  const $ = cheerio.load(html);

  const selectors = [
    ".job-box__text",
    ".job-box__description",
    ".job-box [class*='text']",
    "main article",
    "main .job-box",
  ];

  for (const selector of selectors) {
    const element = $(selector).first();
    const text = normalizeText(element.text());
    if (text && text.length > 80) {
      return text;
    }
  }

  let bestText: string | null = null;
  $("main p, main li, main div").each((_, element) => {
    const text = normalizeText($(element).text());
    if (!text || text.length < 80) return;
    if (!bestText || text.length > bestText.length) {
      bestText = text;
    }
  });

  return bestText;
}

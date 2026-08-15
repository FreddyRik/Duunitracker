import * as cheerio from "cheerio";
import { htmlToPlainText } from "@/lib/format";
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
  if (!html.trim()) return {};

  let $: ReturnType<typeof cheerio.load>;
  try {
    $ = cheerio.load(html);
  } catch {
    return {};
  }

  try {
    return extractFallbackFields($);
  } catch {
    return {};
  }
}

function extractFallbackFields(
  $: ReturnType<typeof cheerio.load>,
): Partial<ParsedJob> {
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

  const bodyText = $("body").text().slice(0, 50_000);
  const deadlineMatch = bodyText.match(
    /(?:hakuaika|haku päättyy|deadline|viimeinen hakupäivä)[:\s]*([0-9]{1,2}\.[0-9]{1,2}\.[0-9]{2,4})/i,
  );

  if (deadlineMatch?.[1]) {
    result.deadline = normalizeText(deadlineMatch[1]);
  }

  return result;
}

function plainTextFromElementHtml(elementHtml: string | null): string | null {
  if (!elementHtml) {
    return null;
  }

  const text = htmlToPlainText(elementHtml);
  return text.length > 0 ? text : null;
}

export function extractDescriptionFromHtml(html: string): string | null {
  if (!html.trim()) return null;

  let $: ReturnType<typeof cheerio.load>;
  try {
    $ = cheerio.load(html);
  } catch {
    return null;
  }

  try {
    return extractLongestDescription($);
  } catch {
    return null;
  }
}

function extractLongestDescription(
  $: ReturnType<typeof cheerio.load>,
): string | null {
  const selectors = [
    ".job-box__text",
    ".job-box__description",
    ".job-box [class*='text']",
    "main article",
    "main .job-box",
  ];

  for (const selector of selectors) {
    const element = $(selector).first();
    const text = plainTextFromElementHtml(element.html());
    if (text && text.length > 80) {
      return text;
    }
  }

  let bestText: string | null = null;
  $("main p, main li, main div").each((_, element) => {
    const text = plainTextFromElementHtml($(element).html());
    if (!text || text.length < 80) return;
    if (!bestText || text.length > bestText.length) {
      bestText = text;
    }
  });

  return bestText;
}

import * as cheerio from "cheerio";
import { htmlToPlainText } from "./format";
import type { ParsedJob } from "./types";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

function isDuunitoriUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname === "duunitori.fi" || parsed.hostname.endsWith(".duunitori.fi");
  } catch {
    return false;
  }
}

function normalizeText(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.replace(/\s+/g, " ").trim();
  return trimmed.length > 0 ? trimmed : null;
}

function extractLocationFromJobPosting(jobPosting: Record<string, unknown>): string | null {
  const jobLocation = jobPosting.jobLocation;

  if (!jobLocation) return null;

  const locations = Array.isArray(jobLocation) ? jobLocation : [jobLocation];

  for (const location of locations) {
    if (typeof location === "string") {
      const normalized = normalizeText(location);
      if (normalized) return normalized;
      continue;
    }

    if (typeof location === "object" && location !== null) {
      const place = location as Record<string, unknown>;
      const address = place.address;

      if (typeof address === "string") {
        const normalized = normalizeText(address);
        if (normalized) return normalized;
      }

      if (typeof address === "object" && address !== null) {
        const addr = address as Record<string, unknown>;
        const parts = [
          addr.addressLocality,
          addr.addressRegion,
          addr.addressCountry,
        ]
          .map((part) => (typeof part === "string" ? part : null))
          .filter(Boolean) as string[];

        if (parts.length > 0) {
          return parts.join(", ");
        }
      }

      const name = normalizeText(
        typeof place.name === "string" ? place.name : undefined,
      );
      if (name) return name;
    }
  }

  return null;
}

function parseOgTitle(content: string): { title: string | null; company: string | null } {
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

function parseJobPostingJsonLd(html: string): Partial<ParsedJob> {
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
          typeof (hiringOrganization as Record<string, unknown>).name === "string"
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

function parseHtmlFallback(html: string): Partial<ParsedJob> {
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

function extractDescriptionFromHtml(html: string): string | null {
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

export async function parseDuunitoriJob(url: string): Promise<ParsedJob> {
  if (!isDuunitoriUrl(url)) {
    throw new Error("URL must be a duunitori.fi job posting link");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "fi-FI,fi;q=0.9,en;q=0.8",
      },
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch job page (${response.status})`);
    }

    const html = await response.text();
    const fromJsonLd = parseJobPostingJsonLd(html);
    const fromHtml = parseHtmlFallback(html);

    return {
      url,
      title: fromHtml.title ?? fromJsonLd.title ?? "Unknown title",
      company: fromHtml.company ?? fromJsonLd.company ?? "Unknown company",
      location: fromJsonLd.location ?? fromHtml.location ?? null,
      deadline: fromJsonLd.deadline ?? fromHtml.deadline ?? null,
      description:
        fromJsonLd.description ??
        extractDescriptionFromHtml(html) ??
        null,
    };
  } finally {
    clearTimeout(timeout);
  }
}

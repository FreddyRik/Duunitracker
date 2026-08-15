import { isDuunitoriJobUrl } from "@/lib/parse-duunitori/url";
import { JOB_FIELD_LIMITS } from "@/lib/site-config";
import type { ShareTargetFields } from "@/types/share-target";

/** http(s) URLs, stopping before whitespace or wrapping punctuation. */
const HTTP_URL_PATTERN = /https?:\/\/[^\s<>"'`\\]+/gi;

function clip(value: string, max: number): string {
  return value.length <= max ? value : value.slice(0, max);
}

function decodeMaybe(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function stripTrailingPunctuation(value: string): string {
  return value.replace(/[),.;:!?]+$/g, "");
}

export function tryParseHttpUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    if (parsed.username || parsed.password) return null;
    if (!parsed.hostname.includes(".")) return null;
    return parsed.href;
  } catch {
    return null;
  }
}

export function extractHttpUrls(value: string): string[] {
  const decoded = decodeMaybe(value);
  const found: string[] = [];
  const seen = new Set<string>();
  const pattern = new RegExp(HTTP_URL_PATTERN.source, HTTP_URL_PATTERN.flags);

  for (const match of decoded.matchAll(pattern)) {
    const candidate = tryParseHttpUrl(stripTrailingPunctuation(match[0]));
    if (!candidate || seen.has(candidate)) continue;
    seen.add(candidate);
    found.push(candidate);
  }

  if (found.length === 0) {
    const whole = tryParseHttpUrl(decoded);
    if (whole) found.push(whole);
  }

  return found;
}

/**
 * Prefer a Duunitori posting when several URLs are present. Android Chrome
 * often puts the shared link in `text` instead of `url`.
 */
export function pickSharedJobUrl(fields: ShareTargetFields): string | null {
  const ordered = [
    ...extractHttpUrls(fields.url),
    ...extractHttpUrls(fields.text),
    ...extractHttpUrls(fields.title),
  ];
  const unique: string[] = [];
  const seen = new Set<string>();
  for (const candidate of ordered) {
    if (seen.has(candidate)) continue;
    seen.add(candidate);
    unique.push(candidate);
  }
  return unique.find((candidate) => isDuunitoriJobUrl(candidate)) ?? unique[0] ?? null;
}

export function pickSharedTitle(
  fields: ShareTargetFields,
  chosenUrl: string | null,
): string {
  const title = fields.title.trim();
  if (title && tryParseHttpUrl(title) === null && title !== chosenUrl) {
    return clip(title, JOB_FIELD_LIMITS.title);
  }

  const text = fields.text.trim();
  if (!text) return "";

  let remainder = text;
  if (chosenUrl) {
    remainder = remainder.split(chosenUrl).join("\n");
  }
  remainder = remainder.replace(
    new RegExp(HTTP_URL_PATTERN.source, HTTP_URL_PATTERN.flags),
    "\n",
  );

  const line = remainder
    .split(/\n/)
    .map((part) => part.trim())
    .find((part) => part.length > 0 && tryParseHttpUrl(part) === null);

  return line ? clip(line, JOB_FIELD_LIMITS.title) : "";
}

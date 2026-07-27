import * as cheerio from "cheerio";

const ACRONYMS = new Set([
  "AB",
  "CGI",
  "HR",
  "IBM",
  "IT",
  "OY",
  "OYJ",
  "PLC",
  "RF",
  "UI",
  "UX",
]);

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";

  const dateOnly = value.slice(0, 10);
  const match = dateOnly.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    return `${match[3]}.${match[2]}.${match[1]}`;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  const day = String(parsed.getDate()).padStart(2, "0");
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const year = parsed.getFullYear();
  return `${day}.${month}.${year}`;
}

export function toDateInputValue(value: string | null | undefined): string {
  if (!value) return "";

  const dateOnly = value.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
    return dateOnly;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatCompanyName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return trimmed;

  return trimmed
    .split(/\s+/)
    .map((word) => {
      const lettersOnly = word.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, "");
      const upper = lettersOnly.toUpperCase();

      if (ACRONYMS.has(upper)) {
        return word.replace(lettersOnly, upper);
      }

      if (word === word.toUpperCase() && lettersOnly.length > 1) {
        return word;
      }

      const lower = word.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

export function htmlToPlainText(html: string): string {
  const text = cheerio.load(html).root().text();
  return text.replace(/\s+/g, " ").trim();
}

export function todayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

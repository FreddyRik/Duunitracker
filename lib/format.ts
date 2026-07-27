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

/** Parse Finnish d.m.yyyy or d.m.yy into ISO yyyy-mm-dd, or null if invalid. */
export function parseFinnishDate(value: string): string | null {
  const match = value.trim().match(/^(\d{1,2})\.(\d{1,2})\.(\d{2,4})$/);
  if (!match) return null;

  const day = match[1].padStart(2, "0");
  const month = match[2].padStart(2, "0");
  let year = match[3];
  if (year.length === 2) {
    year = Number(year) > 50 ? `19${year}` : `20${year}`;
  }

  const iso = `${year}-${month}-${day}`;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;

  const parsed = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  if (
    parsed.getFullYear() !== Number(year) ||
    parsed.getMonth() + 1 !== Number(month) ||
    parsed.getDate() !== Number(day)
  ) {
    return null;
  }

  return iso;
}

function toIsoDateParts(value: string): string | null {
  const finnish = parseFinnishDate(value);
  if (finnish) return finnish;

  const dateOnly = value.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
    return dateOnly;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";

  const iso = toIsoDateParts(value);
  if (iso) {
    const [year, month, day] = iso.split("-");
    return `${day}.${month}.${year}`;
  }

  return value;
}

export function toDateInputValue(value: string | null | undefined): string {
  if (!value) return "";
  return toIsoDateParts(value) ?? "";
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

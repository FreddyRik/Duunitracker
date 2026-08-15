import { isRecord } from "@/lib/validate";
import { htmlToPlainText } from "@/lib/format";

export function normalizeText(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.replace(/\s+/g, " ").trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function extractLocationFromJobPosting(
  jobPosting: Record<string, unknown>,
): string | null {
  const jobLocation = jobPosting.jobLocation;

  if (!jobLocation) return null;

  const locations = Array.isArray(jobLocation) ? jobLocation : [jobLocation];

  for (const location of locations) {
    if (typeof location === "string") {
      const normalized = normalizeText(location);
      if (normalized) return normalized;
      continue;
    }

    if (!isRecord(location)) continue;

    const address = location.address;

    if (typeof address === "string") {
      const normalized = normalizeText(address);
      if (normalized) return normalized;
    }

    if (isRecord(address)) {
      const parts = [
        address.addressLocality,
        address.addressRegion,
        address.addressCountry,
      ]
        .map((part) => (typeof part === "string" ? part : null))
        .filter((part): part is string => Boolean(part));

      if (parts.length > 0) {
        return parts.join(", ");
      }
    }

    const name = normalizeText(
      typeof location.name === "string" ? location.name : undefined,
    );
    if (name) return name;
  }

  return null;
}

export { htmlToPlainText };

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

export { htmlToPlainText };

import { ParseJobError } from "@/lib/parse-duunitori/errors";

export function isDuunitoriHost(hostname: string): boolean {
  return hostname === "duunitori.fi" || hostname.endsWith(".duunitori.fi");
}

export function isDuunitoriJobUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    if (!isDuunitoriHost(parsed.hostname)) return false;
    if (parsed.username || parsed.password) return false;
    const path = parsed.pathname;
    if (!path || path === "/") return false;
    return true;
  } catch {
    return false;
  }
}

export function assertDuunitoriHttpsUrl(url: string): void {
  if (!isDuunitoriJobUrl(url)) {
    throw new ParseJobError(
      "invalid_url",
      "URL must be a duunitori.fi job posting link",
    );
  }
}

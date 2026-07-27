export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function isSafeHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function assertSafeHttpUrl(url: string, field = "url"): void {
  if (!isSafeHttpUrl(url)) {
    throw new ValidationError(`${field} must use http or https`);
  }
}

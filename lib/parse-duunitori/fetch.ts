import { ParseJobError } from "@/lib/parse-duunitori/errors";
import { isDuunitoriJobUrl } from "@/lib/parse-duunitori/url";
import { MAX_JOB_HTML_CHARS } from "@/lib/site-config";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const MAX_REDIRECTS = 5;
const BLOCK_STATUSES = new Set([403, 429, 503]);

export { assertDuunitoriHttpsUrl, isDuunitoriJobUrl } from "@/lib/parse-duunitori/url";

export function isBlockedChallengePage(html: string): boolean {
  return /Just a moment|cf-browser-verification|challenge-platform|Attention Required/i.test(
    html,
  );
}

export function isValidJobPageHtml(html: string): boolean {
  const trimmed = html.trim();
  if (!trimmed) {
    return false;
  }

  if (isBlockedChallengePage(trimmed)) {
    return false;
  }

  return /<html/i.test(trimmed) || /JobPosting/i.test(trimmed);
}

function assertHtmlSize(html: string): void {
  if (html.length > MAX_JOB_HTML_CHARS) {
    throw new ParseJobError("too_large", "Job page HTML is too large");
  }
}

async function readResponseHtml(response: Response): Promise<string> {
  const html = await response.text();
  assertHtmlSize(html);
  return html;
}

function resolveRedirectUrl(location: string, currentUrl: string): string {
  try {
    return new URL(location, currentUrl).href;
  } catch {
    throw new ParseJobError(
      "redirect",
      "Redirect location was not a valid URL",
    );
  }
}

async function fetchDirectHtml(
  startUrl: string,
  signal: AbortSignal,
): Promise<string> {
  let currentUrl = startUrl;

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
    if (!isDuunitoriJobUrl(currentUrl)) {
      throw new ParseJobError(
        "redirect",
        "Redirect left duunitori.fi or was not a job posting link",
      );
    }

    let response: Response;
    try {
      response = await fetch(currentUrl, {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "fi-FI,fi;q=0.9,en;q=0.8",
        },
        signal,
        cache: "no-store",
        redirect: "manual",
      });
    } catch (error) {
      if (error instanceof ParseJobError) throw error;
      if (error instanceof TypeError) {
        throw new ParseJobError("network", "Failed to reach the job page");
      }
      throw error;
    }

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) {
        throw new ParseJobError(
          "redirect",
          "Redirect response missing location header",
        );
      }
      currentUrl = resolveRedirectUrl(location, currentUrl);
      continue;
    }

    if (!response.ok) {
      throw new ParseJobError(
        "network",
        `Failed to fetch job page (${response.status})`,
        response.status,
      );
    }

    return readResponseHtml(response);
  }

  throw new ParseJobError(
    "redirect",
    "Too many redirects while fetching job page",
  );
}

async function fetchViaJinaReader(
  url: string,
  signal: AbortSignal,
): Promise<string> {
  if (!isDuunitoriJobUrl(url)) {
    throw new ParseJobError(
      "invalid_url",
      "URL must be a duunitori.fi job posting link",
    );
  }

  const headers: Record<string, string> = {
    Accept: "text/html,application/xhtml+xml",
    "X-Respond-With": "html",
    "X-No-Cache": "true",
  };

  const jinaApiKey = process.env.JINA_API_KEY;
  if (jinaApiKey) {
    headers.Authorization = `Bearer ${jinaApiKey}`;
  }

  let response: Response;
  try {
    response = await fetch(`https://r.jina.ai/${url}`, {
      headers,
      signal,
      cache: "no-store",
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new ParseJobError(
        "network",
        "Failed to fetch job page via proxy",
      );
    }
    throw error;
  }

  if (!response.ok) {
    throw new ParseJobError(
      "network",
      `Failed to fetch job page via proxy (${response.status})`,
      response.status,
    );
  }

  const html = await readResponseHtml(response);
  if (!isValidJobPageHtml(html)) {
    throw new ParseJobError(
      "invalid_html",
      "Failed to fetch job page via proxy (invalid HTML)",
    );
  }

  return html;
}

export async function fetchDuunitoriHtml(
  startUrl: string,
  signal: AbortSignal,
): Promise<string> {
  try {
    const html = await fetchDirectHtml(startUrl, signal);
    if (isValidJobPageHtml(html)) {
      return html;
    }
    if (isBlockedChallengePage(html) || !html.trim()) {
      return await fetchViaJinaReader(startUrl, signal);
    }
    throw new ParseJobError("invalid_html", "Job page HTML was not a valid posting");
  } catch (error) {
    if (signal.aborted) {
      throw new ParseJobError("timeout", "Timed out fetching the job page");
    }

    if (error instanceof ParseJobError) {
      const status = error.httpStatus;
      if (status !== undefined && BLOCK_STATUSES.has(status)) {
        return await fetchViaJinaReader(startUrl, signal);
      }
      throw error;
    }

    throw error;
  }
}

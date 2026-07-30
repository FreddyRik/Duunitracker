const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const MAX_REDIRECTS = 5;
const BLOCK_STATUSES = new Set([403, 429, 503]);

function isDuunitoriHost(hostname: string): boolean {
  return hostname === "duunitori.fi" || hostname.endsWith(".duunitori.fi");
}

function isDuunitoriUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && isDuunitoriHost(parsed.hostname);
  } catch {
    return false;
  }
}

export function assertDuunitoriHttpsUrl(url: string): void {
  if (!isDuunitoriUrl(url)) {
    throw new Error("URL must be a duunitori.fi job posting link");
  }
}

function isBlockedChallengePage(html: string): boolean {
  return /Just a moment|cf-browser-verification|challenge-platform|Attention Required/i.test(
    html,
  );
}

function isValidJobPageHtml(html: string): boolean {
  const trimmed = html.trim();
  if (!trimmed) {
    return false;
  }

  if (isBlockedChallengePage(trimmed)) {
    return false;
  }

  return /<html/i.test(trimmed) || /JobPosting/i.test(trimmed);
}

function parseDirectFetchStatus(message: string): number | null {
  const match = message.match(/Failed to fetch job page \((\d+)\)/);
  if (!match) {
    return null;
  }

  const status = Number(match[1]);
  return Number.isFinite(status) ? status : null;
}

async function fetchDirectHtml(
  startUrl: string,
  signal: AbortSignal,
): Promise<string> {
  let currentUrl = startUrl;

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
    assertDuunitoriHttpsUrl(currentUrl);

    const response = await fetch(currentUrl, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "fi-FI,fi;q=0.9,en;q=0.8",
      },
      signal,
      cache: "no-store",
      redirect: "manual",
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) {
        throw new Error("Redirect response missing location header");
      }
      currentUrl = new URL(location, currentUrl).href;
      continue;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch job page (${response.status})`);
    }

    return response.text();
  }

  throw new Error("Too many redirects while fetching job page");
}

async function fetchViaJinaReader(
  url: string,
  signal: AbortSignal,
): Promise<string> {
  assertDuunitoriHttpsUrl(url);

  const headers: Record<string, string> = {
    Accept: "text/html,application/xhtml+xml",
    "X-Respond-With": "html",
    "X-No-Cache": "true",
  };

  const jinaApiKey = process.env.JINA_API_KEY;
  if (jinaApiKey) {
    headers.Authorization = `Bearer ${jinaApiKey}`;
  }

  const response = await fetch(`https://r.jina.ai/${url}`, {
    headers,
    signal,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch job page via proxy (${response.status})`);
  }

  const html = await response.text();
  if (!isValidJobPageHtml(html)) {
    throw new Error("Failed to fetch job page via proxy (invalid HTML)");
  }

  return html;
}

export async function fetchDuunitoriHtml(
  startUrl: string,
  signal: AbortSignal,
): Promise<string> {
  try {
    return await fetchDirectHtml(startUrl, signal);
  } catch (error) {
    if (error instanceof Error) {
      const status = parseDirectFetchStatus(error.message);
      if (status !== null && BLOCK_STATUSES.has(status)) {
        return await fetchViaJinaReader(startUrl, signal);
      }
    }

    throw error;
  }
}

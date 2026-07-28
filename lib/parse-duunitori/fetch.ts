const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const MAX_REDIRECTS = 5;

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

export async function fetchDuunitoriHtml(
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

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const MAX_REDIRECTS = 5;
const FETCH_TIMEOUT_MS = 15_000;
const MAX_HTML_CHARS = 1_500_000;

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function isDuunitoriHost(hostname: string): boolean {
  return hostname === "duunitori.fi" || hostname.endsWith(".duunitori.fi");
}

function isValidDuunitoriUrl(url: string): boolean {
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

function isBlockedChallengePage(html: string): boolean {
  return /Just a moment|cf-browser-verification|challenge-platform|Attention Required/i.test(
    html,
  );
}

function isValidJobPageHtml(html: string): boolean {
  const trimmed = html.trim();
  if (!trimmed || isBlockedChallengePage(trimmed)) {
    return false;
  }

  return /<html/i.test(trimmed) || /JobPosting/i.test(trimmed);
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

function jsonError(status: number, message: string, code?: string): Response {
  const payload: { error: string; code?: string } = { error: message };
  if (code) payload.code = code;
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
    },
  });
}

function resolveRedirectUrl(location: string, currentUrl: string): string {
  try {
    return new URL(location, currentUrl).href;
  } catch {
    throw new Error("Redirect location was not a valid URL");
  }
}

async function fetchWithRedirects(
  startUrl: string,
  signal: AbortSignal,
): Promise<string> {
  let currentUrl = startUrl;

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
    if (!isValidDuunitoriUrl(currentUrl)) {
      throw new Error("Redirect left duunitori.fi");
    }

    let response: Response;
    try {
      response = await fetch(currentUrl, {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "fi-FI,fi;q=0.9,en;q=0.8",
        },
        redirect: "manual",
        signal,
      });
    } catch (error) {
      if (isAbortError(error) || signal.aborted) {
        throw new Error("Timed out fetching the job page");
      }
      throw new Error("Failed to reach the job page");
    }

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) {
        throw new Error("Redirect response missing location header");
      }
      currentUrl = resolveRedirectUrl(location, currentUrl);
      continue;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch job page (${response.status})`);
    }

    const html = await response.text();
    if (html.length > MAX_HTML_CHARS) {
      throw new Error("Job page HTML is too large");
    }
    return html;
  }

  throw new Error("Too many redirects while fetching job page");
}

function landingPageHtml(workerOrigin: string): string {
  const exampleUrl =
    "https://duunitori.fi/tyopaikat/tyo/luotea-monipuolisia-uramahdollisuuksia-luotealla-sdsuu-20448795";
  const exampleRequest = `${workerOrigin}?url=${encodeURIComponent(exampleUrl)}`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Duunitracker Duunitori proxy</title>
    <style>
      body { font-family: system-ui, sans-serif; max-width: 42rem; margin: 2rem auto; line-height: 1.5; }
      code { background: #f4f4f5; padding: 0.1rem 0.35rem; border-radius: 4px; }
      pre { background: #f4f4f5; padding: 1rem; overflow-x: auto; border-radius: 6px; }
    </style>
  </head>
  <body>
    <h1>Duunitracker Duunitori proxy</h1>
    <p>This Worker is running. It does not show a homepage — pass a Duunitori job URL as <code>?url=</code>.</p>
    <p>Example:</p>
    <pre>${exampleRequest}</pre>
    <p>Set in Duunitracker:</p>
    <pre>NEXT_PUBLIC_DUUNITORI_PROXY_URL=${workerOrigin}</pre>
  </body>
</html>`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function readTargetUrl(request: Request): Promise<string | null> {
  if (request.method === "GET") {
    return new URL(request.url).searchParams.get("url");
  }

  if (request.method === "POST") {
    let bodyUnknown: unknown;
    try {
      bodyUnknown = await request.json();
    } catch {
      throw new Error("INVALID_JSON_BODY");
    }
    if (!isRecord(bodyUnknown)) return null;
    return typeof bodyUnknown.url === "string" ? bodyUnknown.url : null;
  }

  return null;
}

const worker = {
  async fetch(request: Request): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "GET" && request.method !== "POST") {
      return jsonError(405, "Method not allowed");
    }

    let targetUrl: string | null;
    try {
      targetUrl = await readTargetUrl(request);
    } catch (error) {
      if (error instanceof Error && error.message === "INVALID_JSON_BODY") {
        return jsonError(400, "Request body must be JSON", "invalid_request");
      }
      return jsonError(400, "URL is required", "invalid_url");
    }

    if (!targetUrl?.trim()) {
      if (request.method === "GET") {
        const workerOrigin = new URL(request.url).origin;
        return new Response(landingPageHtml(workerOrigin), {
          status: 200,
          headers: {
            ...CORS_HEADERS,
            "Content-Type": "text/html; charset=utf-8",
          },
        });
      }

      return jsonError(400, "URL is required", "invalid_url");
    }

    const url = targetUrl.trim();
    if (!isValidDuunitoriUrl(url)) {
      return jsonError(
        400,
        "URL must be a duunitori.fi job posting link",
        "invalid_url",
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const html = await fetchWithRedirects(url, controller.signal);
      if (!isValidJobPageHtml(html)) {
        return jsonError(
          502,
          "Blocked or invalid Duunitori page HTML",
          "invalid_html",
        );
      }

      return new Response(html, {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "text/html; charset=utf-8",
        },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch job page";
      if (message.includes("Timed out")) {
        return jsonError(504, message, "timeout");
      }
      if (message.includes("too large")) {
        return jsonError(502, message, "too_large");
      }
      if (message.includes("Redirect")) {
        return jsonError(502, message, "redirect");
      }
      return jsonError(502, message, "network");
    } finally {
      clearTimeout(timeout);
    }
  },
};

export default worker;

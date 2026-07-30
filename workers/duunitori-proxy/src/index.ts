const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const MAX_REDIRECTS = 5;

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
    return parsed.protocol === "https:" && isDuunitoriHost(parsed.hostname);
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

function jsonError(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
    },
  });
}

async function fetchWithRedirects(startUrl: string): Promise<string> {
  let currentUrl = startUrl;

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
    if (!isValidDuunitoriUrl(currentUrl)) {
      throw new Error("Redirect left duunitori.fi");
    }

    const response = await fetch(currentUrl, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "fi-FI,fi;q=0.9,en;q=0.8",
      },
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

async function readTargetUrl(request: Request): Promise<string | null> {
  if (request.method === "GET") {
    return new URL(request.url).searchParams.get("url");
  }

  if (request.method === "POST") {
    const body = (await request.json()) as { url?: string };
    return typeof body.url === "string" ? body.url : null;
  }

  return null;
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "GET" && request.method !== "POST") {
      return jsonError(405, "Method not allowed");
    }

    const targetUrl = await readTargetUrl(request);
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

      return jsonError(400, "URL is required");
    }

    const url = targetUrl.trim();
    if (!isValidDuunitoriUrl(url)) {
      return jsonError(400, "URL must be a duunitori.fi job posting link");
    }

    try {
      const html = await fetchWithRedirects(url);
      if (!isValidJobPageHtml(html)) {
        return jsonError(502, "Blocked or invalid Duunitori page HTML");
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
      return jsonError(502, message);
    }
  },
};

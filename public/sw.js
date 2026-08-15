const CACHE_VERSION = "duunitracker-v1";
const PRECACHE = `precache-${CACHE_VERSION}`;
const PAGES = `pages-${CACHE_VERSION}`;
const ASSETS = `assets-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  "/",
  "/app",
  "/privacy",
  "/offline",
  "/manifest.webmanifest",
  "/icons/icon-192",
  "/icons/icon-512",
  "/icons/icon-512-maskable",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PRECACHE);
      await Promise.all(
        PRECACHE_URLS.map(async (url) => {
          try {
            const response = await fetch(url, { cache: "reload" });
            if (response.ok) await cache.put(url, response);
          } catch {
            // A missing shell URL must not block install.
          }
        }),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => !name.endsWith(CACHE_VERSION))
          .map((name) => caches.delete(name)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" && request.method !== "HEAD") {
    if (isParserRequest(request)) {
      event.respondWith(networkFirstParser(request));
    }
    return;
  }

  const url = new URL(request.url);
  if (url.protocol !== "http:" && url.protocol !== "https:") return;
  if (url.origin !== self.location.origin) {
    event.respondWith(networkOnly(request));
    return;
  }

  if (isParserRequest(request) || url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirstParser(request));
    return;
  }

  if (isStaticAsset(url) || request.destination === "font") {
    event.respondWith(staleWhileRevalidate(request, ASSETS));
    return;
  }

  if (request.mode === "navigate" || isRscRequest(request, url)) {
    event.respondWith(networkFirstPage(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request, ASSETS));
});

function isParserRequest(request) {
  try {
    const url = new URL(request.url);
    return (
      url.pathname === "/api/parse-job" || url.pathname.includes("parse-job")
    );
  } catch {
    return false;
  }
}

function isRscRequest(request, url) {
  return (
    request.headers.has("RSC") ||
    request.headers.has("Next-Router-State-Tree") ||
    url.searchParams.has("_rsc")
  );
}

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    /\.(?:js|css|woff2?|png|svg|jpg|jpeg|webp|ico)$/i.test(url.pathname)
  );
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        void cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => undefined);

  if (cached) {
    void networkPromise;
    return cached;
  }

  const network = await networkPromise;
  return network ?? Response.error();
}

async function networkFirstPage(request) {
  const cache = await caches.open(PAGES);
  try {
    const response = await fetch(request);
    if (response.ok && request.method === "GET") {
      void cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    const precache = await caches.open(PRECACHE);
    return (
      (await precache.match("/offline")) ||
      (await precache.match("/app")) ||
      Response.error()
    );
  }
}

async function networkFirstParser(request) {
  try {
    return await fetch(request);
  } catch {
    return new Response(
      JSON.stringify({
        error: "Job import needs a network connection.",
        code: "network",
      }),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      },
    );
  }
}

async function networkOnly(request) {
  try {
    return await fetch(request);
  } catch {
    return Response.error();
  }
}

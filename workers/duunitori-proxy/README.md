# Duunitori HTML proxy (Cloudflare Worker)

Fetches public Duunitori job pages and returns HTML with CORS headers so the Duunitracker browser client can import jobs without Vercel fetching Duunitori directly.

## Deploy

1. Install dependencies:

```bash
cd workers/duunitori-proxy
npm install
```

2. Log in to Cloudflare (free account):

```bash
npx wrangler login
```

3. Deploy:

```bash
npm run deploy
```

4. Copy the deployed URL (for example `https://duunitracker-duunitori-proxy.<subdomain>.workers.dev`). Opening that URL in a browser should show a short help page — the Worker only fetches HTML when you pass `?url=https://duunitori.fi/...`.

5. Set in the Next.js app:

```env
NEXT_PUBLIC_DUUNITORI_PROXY_URL=https://duunitracker-duunitori-proxy.<account>.workers.dev
```

Redeploy Vercel after adding the env var.

## Usage

```text
GET https://<worker-url>?url=https://duunitori.fi/tyopaikat/tyo/...
```

Or `POST` with JSON `{ "url": "https://duunitori.fi/..." }`.

Returns raw HTML on success. Only `https://duunitori.fi` and `*.duunitori.fi` URLs are allowed.

## Local dev

```bash
npm run dev
```

Worker runs at `http://localhost:8787`. Point `NEXT_PUBLIC_DUUNITORI_PROXY_URL` to that URL to test the full import flow.

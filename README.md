# Duunitracker

Track Duunitori job applications in your browser. Import a posting from a link, follow status, and keep notes — data stays in `localStorage` (no accounts).

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Requires Node.js 20+.

## Usage

1. Paste a Duunitori job URL → **Import Job**
2. Review the auto-filled fields → save
3. Update status, notes, and dates from the dashboard
4. **Export / Import backup** to move data between devices or browsers

Jobs live under the `duunitracker-jobs` key. Clearing site data deletes them unless you exported a backup. Domains (e.g. different Vercel URLs) do not share storage.

## Deploy (Vercel)

1. Import the GitHub repo at [vercel.com/new](https://vercel.com/new)
2. Set env vars (see below) and redeploy after changing them

### Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Canonical / SEO URLs (e.g. `https://duunitracker.vercel.app`) |
| `NEXT_PUBLIC_DUUNITORI_PROXY_URL` | Yes (prod) | Cloudflare Worker that fetches Duunitori HTML (see below) |
| `JINA_API_KEY` | No | Optional server-side fetch fallback for local/dev |

Copy [`.env.example`](.env.example) for local values.

### Duunitori import on Vercel

Vercel IPs are often blocked by Duunitori’s Cloudflare. Production import uses a Worker:

1. Browser → Worker fetches HTML (`NEXT_PUBLIC_DUUNITORI_PROXY_URL`)
2. Browser → `POST /api/parse-job` with `{ url, html }` (parse only)

Deploy the Worker: [workers/duunitori-proxy/README.md](workers/duunitori-proxy/README.md)

Locally, omit the proxy env — the API fetches Duunitori directly (and can fall back to Jina if configured).

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Notes

- Import depends on Duunitori page structure; edit fields manually if parsing is incomplete.
- Already-saved flat descriptions stay flat until you re-import a job.

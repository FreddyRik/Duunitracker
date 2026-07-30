# Duunitracker

A Duunitori-focused job application tracker built with Next.js and Tailwind CSS. Import Duunitori job postings, verify extracted details, and track application status in your browser.

## Features

- Import jobs from `duunitori.fi` URLs with automatic field extraction
- Browser persistence via `localStorage` (no database or account)
- Track applied status, pipeline status, and notes
- Edit or delete saved applications
- Export and import JSON backups
- Responsive dashboard (table on desktop, cards on mobile)

## Requirements

- Node.js 20+
- npm

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

1. Paste a Duunitori job URL into the import bar.
2. Click **Import Job** and review the auto-filled modal.
3. Save the job to add it to your tracker.
4. Update applied status, status tags, and notes inline.
5. Use **Edit** or **Delete** for full record changes.
6. Use **Export backup** / **Import backup** to move data between browsers or devices.

## Data storage

Jobs are stored in your browser's `localStorage` under the key `duunitracker-jobs`. Each person using the app only sees their own data on that device and browser.

- Clearing site data removes your jobs unless you exported a backup.
- Phone and laptop do not sync automatically.
- Use **Import backup** to restore from a previously exported JSON file.
- Different domains (for example an old and new Vercel URL) have separate `localStorage` — export from one and import on the other to move data.

If you have an older `data/jobs.json` from a previous version, import that file with **Import backup**.

On first load after the rename from Job Application Tracker, jobs and theme preferences are migrated automatically from the legacy `job-tracker-*` keys when present on the same origin.

## Deploy to Vercel

1. Push this repo to GitHub (`https://github.com/FreddyRik/duunitracker`).
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Deploy with default Next.js settings.
4. Set `NEXT_PUBLIC_SITE_URL` to your production URL (for example `https://duunitracker.vercel.app` or your custom domain). This powers canonical URLs, Open Graph links, `sitemap.xml`, and `robots.txt`.
5. Deploy the Duunitori proxy Worker (see [workers/duunitori-proxy/README.md](workers/duunitori-proxy/README.md)) and set `NEXT_PUBLIC_DUUNITORI_PROXY_URL` to the Worker URL. This lets the browser fetch job HTML through Cloudflare instead of Vercel (avoids Cloudflare 403 on datacenter IPs).
6. Share your Vercel URL — each visitor's jobs stay in their own browser.

### SEO after deploy

1. Open [Google Search Console](https://search.google.com/search-console) and add your production property.
2. Submit `https://<your-domain>/sitemap.xml` (also listed in `robots.txt`).
3. Optionally add the site in [Bing Webmaster Tools](https://www.bing.com/webmasters).
4. Test link previews with a share debugger (for example Facebook Sharing Debugger or LinkedIn Post Inspector).
5. Check Search Console after a few weeks for indexed pages (`/`, `/app`, `/privacy`) and query impressions.

## API routes

- `POST /api/parse-job` — parse a Duunitori job URL (`{ url }` fetches server-side, or `{ url, html }` parses pre-fetched HTML from the Worker proxy)

## Duunitori import proxy (production)

Vercel datacenter IPs are often blocked by Duunitori’s Cloudflare. Production import uses a small Cloudflare Worker:

1. Browser → Worker (`NEXT_PUBLIC_DUUNITORI_PROXY_URL`) fetches HTML with CORS
2. Browser → `/api/parse-job` with `{ url, html }` for parsing only (no Duunitori fetch from Vercel)

Deploy steps: [workers/duunitori-proxy/README.md](workers/duunitori-proxy/README.md)

Local dev without the proxy env var uses direct server-side fetch (works from your home IP).

## Scripts

```bash
npm run dev    # start development server
npm run build  # production build
npm run start  # run production server
npm run lint   # run ESLint
```

## Notes

- **Production:** set `NEXT_PUBLIC_DUUNITORI_PROXY_URL` to your deployed Worker URL (see `workers/duunitori-proxy/`).
- **Local (no proxy env):** job import fetches Duunitori directly from the dev server. If blocked, the server retries through [Jina Reader](https://jina.ai/reader) when `JINA_API_KEY` is set.
- Scraping depends on Duunitori page structure; if parsing fails or fields are incomplete, edit values manually in the import modal.

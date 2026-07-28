# Job Application Tracker

A job application tracker built with Next.js and Tailwind CSS. Import Duunitori job postings, verify extracted details, and track application status in your browser.

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

Jobs are stored in your browser's `localStorage` under the key `job-tracker-jobs`. Each person using the app only sees their own data on that device and browser.

- Clearing site data removes your jobs unless you exported a backup.
- Phone and laptop do not sync automatically.
- Use **Import backup** to restore from a previously exported JSON file.

If you have an older `data/jobs.json` from a previous version, import that file with **Import backup**.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Deploy with default Next.js settings (no environment variables required).
4. Share the `*.vercel.app` URL — each visitor's jobs stay in their own browser.

## API routes

- `POST /api/parse-job` — scrape and parse a Duunitori job URL

## Scripts

```bash
npm run dev    # start development server
npm run build  # production build
npm run start  # run production server
npm run lint   # run ESLint
```

## Notes

- Scraping depends on Duunitori page structure and may be rate-limited from Vercel's servers.
- If parsing fails or fields are incomplete, you can still edit values manually in the import modal.

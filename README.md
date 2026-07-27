# Job Application Tracker

A local-first job application tracker built with Next.js, Tailwind CSS, and a JSON file store. Import Duunitori job postings, verify extracted details, and track application status on your PC.

## Features

- Import jobs from `duunitori.fi` URLs with automatic field extraction
- Local persistence in `data/jobs.json` (no database setup)
- Track applied status, pipeline status, and notes
- Edit or delete saved applications
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
3. Save the job to add it to your local tracker.
4. Update applied status, status tags, and notes inline.
5. Use **Edit** or **Delete** for full record changes.

## Data storage

All jobs are stored locally in:

```
data/jobs.json
```

This file is **gitignored** on purpose. Your applications, notes, and saved descriptions stay on your machine only and are never pushed to GitHub.

The file is created automatically on first use. Back it up yourself if you want a copy (e.g. copy to `jobs-backup.json` outside the repo).

When cloning this repo, you start with an empty tracker until you import or add jobs.

## API routes

- `POST /api/parse-job` — scrape and parse a Duunitori job URL
- `GET /api/jobs` — list all jobs
- `POST /api/jobs` — create a job
- `PATCH /api/jobs` — update a job by `id`
- `DELETE /api/jobs` — delete a job by `id` (JSON body or `?id=`)

## Scripts

```bash
npm run dev    # start development server
npm run build  # production build
npm run start  # run production server
npm run lint   # run ESLint
```

## Notes

- Scraping depends on Duunitori page structure and network access from your machine.
- If parsing fails or fields are incomplete, you can still edit values manually in the import modal.

"use client";

import { useState } from "react";

type UrlImportBarProps = {
  onImport: (url: string) => Promise<void>;
  onAddManual: () => void;
  loading?: boolean;
};

export function UrlImportBar({
  onImport,
  onAddManual,
  loading = false,
}: UrlImportBarProps) {
  const [url, setUrl] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    await onImport(trimmed);
    setUrl("");
  }

  return (
    <div className="flex flex-col gap-3">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <label htmlFor="job-url" className="sr-only">
          Duunitori job URL
        </label>
        <input
          id="job-url"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="Paste a Duunitori job link..."
          className="w-full flex-1 rounded-xl border border-border-strong bg-surface-solid px-4 py-3 text-sm text-foreground shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-ring"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-fg transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Importing..." : "Import Job"}
        </button>
      </form>

      <div className="flex items-center gap-3 text-sm text-muted">
        <span
          className="hidden h-px flex-1 bg-border sm:block"
          aria-hidden="true"
        />
        <span>or</span>
        <span
          className="hidden h-px flex-1 bg-border sm:block"
          aria-hidden="true"
        />
      </div>

      <button
        type="button"
        onClick={onAddManual}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-xl border border-border-strong bg-surface-solid px-5 py-3 text-sm font-semibold text-muted-strong transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60"
      >
        Add Job Manually
      </button>
    </div>
  );
}

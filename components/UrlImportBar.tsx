"use client";

import { useState } from "react";
import { useLocale } from "@/components/LocaleProvider";

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
  const { t } = useLocale();
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
          {t.importBar.urlLabel}
        </label>
        <input
          id="job-url"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder={t.importBar.placeholder}
          className="w-full flex-1 rounded-xl border border-border-strong bg-surface-solid px-4 py-3 text-sm text-foreground shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-ring"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-fg transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? t.importBar.importing : t.importBar.importJob}
        </button>
      </form>

      <div className="flex items-center gap-3 text-sm text-muted">
        <span
          className="hidden h-px flex-1 bg-border sm:block"
          aria-hidden="true"
        />
        <span>{t.importBar.or}</span>
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
        {t.importBar.addManual}
      </button>
    </div>
  );
}

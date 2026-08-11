"use client";

import { useRef } from "react";
import { useLocale } from "@/components/LocaleProvider";

type DataBackupControlsProps = {
  jobCount: number;
  onExport: () => void;
  onImport: (file: File) => void;
};

export function DataBackupControls({
  jobCount,
  onExport,
  onImport,
}: DataBackupControlsProps) {
  const { t } = useLocale();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const shouldReplace = window.confirm(t.backup.confirmReplace);
    if (!shouldReplace) {
      event.target.value = "";
      return;
    }

    onImport(file);
    event.target.value = "";
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onExport}
        disabled={jobCount === 0}
        className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-border-strong hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
      >
        {t.backup.export}
      </button>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-border-strong hover:bg-surface-muted"
      >
        {t.backup.import}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="sr-only"
        onChange={handleFileChange}
      />
    </div>
  );
}

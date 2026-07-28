"use client";

import { useRef } from "react";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const shouldReplace = window.confirm(
      "Import will replace all jobs stored in this browser. Continue?",
    );
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
        className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        Export backup
      </button>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-accent hover:text-accent"
      >
        Import backup
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

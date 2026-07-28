"use client";

import { useState } from "react";
import { useLocale } from "@/components/LocaleProvider";

export function NotesField({
  notes,
  onSave,
}: {
  notes: string;
  onSave: (notes: string) => Promise<void>;
}) {
  const { t } = useLocale();
  const [expanded, setExpanded] = useState(notes.trim().length > 0);
  const hasNotes = notes.trim().length > 0;

  if (!expanded && !hasNotes) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="text-xs font-medium text-muted transition hover:text-accent"
      >
        {t.notes.add}
      </button>
    );
  }

  return (
    <div className="space-y-1">
      <textarea
        key={notes}
        defaultValue={notes}
        onBlur={(event) => {
          if (event.target.value !== notes) {
            void onSave(event.target.value);
          }
        }}
        rows={2}
        placeholder={t.notes.placeholder}
        autoFocus={expanded && !hasNotes}
        className="w-full min-w-[10rem] rounded-lg border border-border-strong bg-surface-solid px-2.5 py-1.5 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-ring"
      />
      {!hasNotes && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="text-xs text-muted transition hover:text-foreground"
        >
          {t.actions.cancel}
        </button>
      )}
    </div>
  );
}

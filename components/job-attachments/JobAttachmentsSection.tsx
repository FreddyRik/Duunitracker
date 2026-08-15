"use client";

import { useRef, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { useJobAttachments } from "@/hooks/useJobAttachments";
import { formatFileSize } from "@/lib/format";
import type { AttachmentKind } from "@/types/attachment";

const FILE_ACCEPT =
  ".pdf,.txt,.md,.doc,.docx,application/pdf,text/plain,text/markdown";

export function JobAttachmentsSection({ jobId }: { jobId: string }) {
  const { t } = useLocale();
  const cvInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<string | null>(null);
  const attachments = useJobAttachments(jobId);
  const coverLetterValue = draft ?? attachments.coverLetter;

  function handleFiles(
    files: FileList | null,
    kind: AttachmentKind,
    input: HTMLInputElement | null,
  ) {
    const file = files?.[0];
    if (file) void attachments.upload(file, kind);
    if (input) input.value = "";
  }

  return (
    <section>
      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
        {t.attachments.title}
      </h3>

      {attachments.error && (
        <p className="mb-2 text-xs text-danger">{attachments.error}</p>
      )}

      <textarea
        value={coverLetterValue}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => {
          if (draft === null || draft === attachments.coverLetter) return;
          void attachments.saveCoverLetter(draft);
          setDraft(null);
        }}
        rows={5}
        aria-label={t.attachments.kinds.cover_letter}
        placeholder={t.attachments.coverLetterPlaceholder}
        className="w-full rounded-md border border-border-strong bg-transparent px-2.5 py-1.5 text-sm text-foreground outline-none transition focus:border-accent focus:ring-1 focus:ring-ring"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={attachments.saving}
          onClick={() => cvInputRef.current?.click()}
          className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-border-strong hover:bg-surface-muted disabled:opacity-60"
        >
          {t.attachments.uploadCv}
        </button>
        <button
          type="button"
          disabled={attachments.saving}
          onClick={() => fileInputRef.current?.click()}
          className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-border-strong hover:bg-surface-muted disabled:opacity-60"
        >
          {t.attachments.uploadFile}
        </button>
        <input
          ref={cvInputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="sr-only"
          aria-label={t.attachments.uploadCv}
          onChange={(event) =>
            handleFiles(event.target.files, "cv", event.target)
          }
        />
        <input
          ref={fileInputRef}
          type="file"
          accept={FILE_ACCEPT}
          className="sr-only"
          aria-label={t.attachments.uploadFile}
          onChange={(event) =>
            handleFiles(event.target.files, "other", event.target)
          }
        />
      </div>

      {attachments.items.length === 0 && !attachments.loading ? (
        <p className="mt-3 text-sm text-muted">{t.attachments.empty}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {attachments.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 border border-border px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm text-foreground">{item.filename}</p>
                <p className="text-[11px] text-muted">
                  {t.attachments.kinds[item.kind]} · {formatFileSize(item.size)}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => void attachments.download(item.id)}
                  className="text-xs font-medium text-muted-strong underline decoration-border underline-offset-4 hover:text-foreground"
                >
                  {t.attachments.download}
                </button>
                <button
                  type="button"
                  onClick={() => void attachments.remove(item.id)}
                  className="text-xs font-medium text-muted hover:text-danger"
                >
                  {t.actions.delete}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

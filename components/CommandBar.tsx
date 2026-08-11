"use client";

import { useEffect, useRef, useState } from "react";
import { Kbd } from "@/components/Kbd";
import { useLocale } from "@/components/LocaleProvider";
import { COMMAND_INPUT_ID } from "@/lib/ui-constants";

type CommandBarProps = {
  open: boolean;
  loading: boolean;
  error: string | null;
  onImport: (url: string) => Promise<void>;
  onAddManual: () => void;
  onClose: () => void;
};

type CommandBarContentProps = Omit<CommandBarProps, "open">;

/** Split out so the draft url resets by unmounting rather than by an effect. */
function CommandBarContent({
  loading,
  error,
  onImport,
  onAddManual,
  onClose,
}: CommandBarContentProps) {
  const { t } = useLocale();
  const [url, setUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = url.trim();
    if (!trimmed || loading) return;
    await onImport(trimmed);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4">
      <button
        type="button"
        aria-label={t.actions.close}
        onClick={onClose}
        className="animate-fade-in absolute inset-0 cursor-default bg-scrim backdrop-blur-[2px]"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.importBar.urlLabel}
        className="animate-command-in relative mt-[22vh] w-full max-w-[560px] border border-border bg-surface-solid shadow-2xl"
      >
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <label htmlFor={COMMAND_INPUT_ID} className="sr-only">
              {t.importBar.urlLabel}
            </label>
            <input
              ref={inputRef}
              id={COMMAND_INPUT_ID}
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder={t.importBar.placeholder}
              disabled={loading}
              className="w-full bg-transparent px-5 py-4 text-base text-foreground outline-none placeholder:text-muted disabled:opacity-70"
            />
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-px overflow-hidden bg-border"
            >
              {loading && (
                <span className="animate-shimmer block h-full w-1/3 bg-accent" />
              )}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 px-5 py-3">
            <p className="flex items-center gap-1.5 text-xs text-muted">
              {loading ? (
                t.importBar.importing
              ) : (
                <>
                  <Kbd>↵</Kbd>
                  <span>{t.ui.commandHint}</span>
                </>
              )}
            </p>
            <button
              type="button"
              onClick={onAddManual}
              className="text-xs font-medium text-muted transition hover:text-foreground"
            >
              {t.importBar.addManual}
            </button>
          </div>
        </form>

        {error && (
          <p
            role="alert"
            className="border-t border-danger-border bg-danger-bg px-5 py-2.5 text-sm text-danger"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export function CommandBar({ open, ...props }: CommandBarProps) {
  if (!open) return null;
  return <CommandBarContent {...props} />;
}

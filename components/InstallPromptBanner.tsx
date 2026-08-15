"use client";

import { useLocale } from "@/components/LocaleProvider";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

export function InstallPromptBanner() {
  const { t } = useLocale();
  const prompt = useInstallPrompt();

  if (!prompt.visible) return null;

  return (
    <div
      role="status"
      className="no-print fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface-solid px-4 py-3 shadow-[0_-8px_24px_rgba(20,20,19,0.08)]"
    >
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {t.pwa.installTitle}
          </p>
          <p className="mt-1 text-sm text-muted">
            {prompt.iosHint ? t.pwa.iosHint : t.pwa.installBody}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {prompt.canPrompt && (
            <button
              type="button"
              onClick={() => void prompt.install()}
              className="rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-accent-fg transition hover:bg-accent-hover"
            >
              {t.pwa.install}
            </button>
          )}
          <button
            type="button"
            onClick={prompt.dismiss}
            className="rounded-md border border-border-strong px-3 py-1.5 text-xs font-medium text-muted-strong transition hover:bg-surface-muted"
          >
            {t.pwa.dismiss}
          </button>
        </div>
      </div>
    </div>
  );
}

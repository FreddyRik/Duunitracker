"use client";

import { useLocale } from "@/components/LocaleProvider";
import { useInstallPromptState } from "@/components/InstallPromptProvider";

type InstallAppButtonProps = {
  withSeparator?: boolean;
  className?: string;
};

export function InstallAppButton({
  withSeparator = false,
  className = "text-muted transition hover:text-foreground",
}: InstallAppButtonProps) {
  const { t } = useLocale();
  const prompt = useInstallPromptState();

  if (!prompt.available || prompt.bannerVisible) return null;

  function handleClick() {
    if (prompt.canPrompt) {
      void prompt.install();
      return;
    }
    prompt.showBanner();
  }

  const button = (
    <button type="button" onClick={handleClick} className={className}>
      {t.pwa.installApp}
    </button>
  );

  if (!withSeparator) return button;

  return (
    <span className="inline-flex items-center">
      <span className="mx-1.5 text-border-strong" aria-hidden="true">
        ·
      </span>
      {button}
    </span>
  );
}

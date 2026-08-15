import { readStorageItemSoft, writeStorageItemSoft } from "@/lib/browser-storage";
import { PWA_INSTALL_DISMISS_MS, PWA_INSTALL_DISMISSED_KEY } from "@/lib/site-config";

export function isInstallPromptDismissed(now = Date.now()): boolean {
  const raw = readStorageItemSoft(PWA_INSTALL_DISMISSED_KEY);
  if (!raw) return false;
  const dismissedAt = Number.parseInt(raw, 10);
  if (Number.isNaN(dismissedAt)) return false;
  return now - dismissedAt < PWA_INSTALL_DISMISS_MS;
}

export function dismissInstallPrompt(now = Date.now()): void {
  writeStorageItemSoft(PWA_INSTALL_DISMISSED_KEY, String(now));
}

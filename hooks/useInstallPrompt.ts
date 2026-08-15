"use client";

import { useCallback, useEffect, useState } from "react";
import { dismissInstallPrompt, isInstallPromptDismissed } from "@/lib/pwa/install";
import { isIosDevice, isStandaloneDisplay } from "@/lib/pwa/display";
import type { BeforeInstallPromptEvent } from "@/types/pwa";

function isBeforeInstallPromptEvent(
  event: Event,
): event is BeforeInstallPromptEvent {
  return "prompt" in event && typeof event.prompt === "function";
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [iosHint, setIosHint] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (isStandaloneDisplay()) {
      setInstalled(true);
      return;
    }

    const bannerAllowed = !isInstallPromptDismissed();

    /* eslint-disable react-hooks/set-state-in-effect -- installability is only known after mount */
    if (isIosDevice()) {
      setIosHint(true);
      if (bannerAllowed) setBannerVisible(true);
    }
    /* eslint-enable react-hooks/set-state-in-effect */

    function handleBeforeInstallPrompt(event: Event) {
      if (!isBeforeInstallPromptEvent(event)) return;
      event.preventDefault();
      setDeferredPrompt(event);
      if (!isInstallPromptDismissed()) setBannerVisible(true);
    }

    function handleAppInstalled() {
      setDeferredPrompt(null);
      setBannerVisible(false);
      setInstalled(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const dismiss = useCallback(() => {
    dismissInstallPrompt();
    setBannerVisible(false);
  }, []);

  const showBanner = useCallback(() => {
    setBannerVisible(true);
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    } catch (error) {
      console.error("Install prompt failed", error);
    } finally {
      setDeferredPrompt(null);
      setBannerVisible(false);
      dismissInstallPrompt();
    }
  }, [deferredPrompt]);

  return {
    bannerVisible,
    available: !installed && (deferredPrompt !== null || iosHint),
    iosHint,
    canPrompt: deferredPrompt !== null,
    install,
    dismiss,
    showBanner,
  };
}

export type InstallPromptState = ReturnType<typeof useInstallPrompt>;

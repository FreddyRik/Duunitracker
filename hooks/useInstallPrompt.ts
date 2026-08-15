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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandaloneDisplay() || isInstallPromptDismissed()) {
      return;
    }

    /* eslint-disable react-hooks/set-state-in-effect -- installability is only known after mount */
    if (isIosDevice()) {
      setIosHint(true);
      setVisible(true);
    }
    /* eslint-enable react-hooks/set-state-in-effect */

    function handleBeforeInstallPrompt(event: Event) {
      if (!isBeforeInstallPromptEvent(event)) return;
      event.preventDefault();
      setDeferredPrompt(event);
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const dismiss = useCallback(() => {
    dismissInstallPrompt();
    setVisible(false);
    setDeferredPrompt(null);
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    } catch (error) {
      console.error("Install prompt failed", error);
    } finally {
      dismissInstallPrompt();
      setVisible(false);
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  return {
    visible,
    iosHint,
    canPrompt: deferredPrompt !== null,
    install,
    dismiss,
  };
}

"use client";

import { useEffect } from "react";
import { InstallPromptBanner } from "@/components/InstallPromptBanner";
import { requestPersistentStorage } from "@/lib/offline-adapter";
import { registerServiceWorker } from "@/lib/pwa/register";

export function PwaRuntime() {
  useEffect(() => {
    void registerServiceWorker();
    void requestPersistentStorage();
  }, []);

  return <InstallPromptBanner />;
}

"use client";

import { useEffect } from "react";
import { InstallPromptBanner } from "@/components/InstallPromptBanner";
import { InstallPromptProvider } from "@/components/InstallPromptProvider";
import { requestPersistentStorage } from "@/lib/offline-adapter";
import { registerServiceWorker } from "@/lib/pwa/register";

export function PwaRuntime({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void registerServiceWorker();
    void requestPersistentStorage();
  }, []);

  return (
    <InstallPromptProvider>
      {children}
      <InstallPromptBanner />
    </InstallPromptProvider>
  );
}

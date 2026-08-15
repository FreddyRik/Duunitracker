"use client";

import { createContext, useContext } from "react";
import {
  useInstallPrompt,
  type InstallPromptState,
} from "@/hooks/useInstallPrompt";

const InstallPromptContext = createContext<InstallPromptState | null>(null);

export function InstallPromptProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const prompt = useInstallPrompt();
  return (
    <InstallPromptContext.Provider value={prompt}>
      {children}
    </InstallPromptContext.Provider>
  );
}

export function useInstallPromptState(): InstallPromptState {
  const context = useContext(InstallPromptContext);
  if (!context) {
    throw new Error(
      "useInstallPromptState must be used within InstallPromptProvider",
    );
  }
  return context;
}

export type BeforeInstallPromptOutcome = "accepted" | "dismissed";

export type BeforeInstallPromptEvent = Event & {
  readonly platforms: string[];
  prompt(): Promise<void>;
  readonly userChoice: Promise<{
    outcome: BeforeInstallPromptOutcome;
    platform: string;
  }>;
};

export type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
};

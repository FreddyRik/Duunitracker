"use client";

import { useEffect, useRef } from "react";
import {
  clearPersistedShareIntake,
  consumeDashboardShareIntake,
} from "@/lib/share-target/intake";
import type { ShareIntakePayload } from "@/types/share-target";

export function useShareTargetImport({
  hydrated,
  onShareImport,
}: {
  hydrated: boolean;
  onShareImport: (payload: ShareIntakePayload) => Promise<void>;
}) {
  const startedRef = useRef(false);

  useEffect(() => {
    if (!hydrated || startedRef.current) return;

    const payload = consumeDashboardShareIntake();
    if (!payload) return;
    if (!payload.url && !payload.title) {
      clearPersistedShareIntake();
      return;
    }

    startedRef.current = true;
    void onShareImport(payload).finally(() => {
      clearPersistedShareIntake();
    });
  }, [hydrated, onShareImport]);
}

"use client";

import { useState } from "react";
import type { JobApplication, JobFormValues } from "@/types/job";

export type PanelMode = "overview" | "edit";

export function useModalState() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createMode, setCreateMode] = useState<"import" | "manual">("import");
  const [createDraft, setCreateDraft] = useState<JobFormValues | null>(null);
  /** Tracked by id so the panel never renders a stale copy after an update. */
  const [panelJobId, setPanelJobId] = useState<string | null>(null);
  const [panelMode, setPanelMode] = useState<PanelMode>("overview");

  return {
    createModalOpen,
    createMode,
    createDraft,
    panelJobId,
    panelMode,
    setCreateModalOpen,
    setCreateMode,
    setCreateDraft,
    setPanelMode,
    openPanel(job: JobApplication) {
      setPanelJobId(job.id);
      setPanelMode("overview");
    },
    openPanelEdit(job: JobApplication) {
      setPanelJobId(job.id);
      setPanelMode("edit");
    },
    closePanel() {
      setPanelJobId(null);
      setPanelMode("overview");
    },
    closeCreate() {
      setCreateModalOpen(false);
      setCreateDraft(null);
    },
  };
}

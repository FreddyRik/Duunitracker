"use client";

import { useState } from "react";
import type { JobApplication, JobFormValues } from "@/types/job";

export function useModalState() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createMode, setCreateMode] = useState<"import" | "manual">("import");
  const [createDraft, setCreateDraft] = useState<JobFormValues | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [viewingJob, setViewingJob] = useState<JobApplication | null>(null);

  return {
    createModalOpen,
    createMode,
    createDraft,
    editModalOpen,
    editingJob,
    viewingJob,
    setCreateModalOpen,
    setCreateMode,
    setCreateDraft,
    setEditModalOpen,
    setEditingJob,
    setViewingJob,
    closeCreate() {
      setCreateModalOpen(false);
      setCreateDraft(null);
    },
    closeEdit() {
      setEditModalOpen(false);
      setEditingJob(null);
    },
    openEdit(job: JobApplication) {
      setEditingJob(job);
      setEditModalOpen(true);
    },
  };
}

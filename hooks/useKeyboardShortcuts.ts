"use client";

import { useEffect } from "react";
import { SEARCH_INPUT_ID } from "@/lib/ui-constants";
import type { JobApplication } from "@/types/job";

type ShortcutOptions = {
  /** False while a modal owns the keyboard. */
  enabled: boolean;
  rows: JobApplication[];
  activeRowId: string | null;
  setActiveRowId: (id: string | null) => void;
  onOpenCommandBar: () => void;
  onOpenRow: (job: JobApplication) => void;
  onEditRow: (job: JobApplication) => void;
};

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

export function useKeyboardShortcuts({
  enabled,
  rows,
  activeRowId,
  setActiveRowId,
  onOpenCommandBar,
  onOpenRow,
  onEditRow,
}: ShortcutOptions) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const commandK =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";

      if (commandK) {
        event.preventDefault();
        document.getElementById(SEARCH_INPUT_ID)?.focus();
        return;
      }

      if (!enabled || event.metaKey || event.ctrlKey || event.altKey) return;

      if (isTypingTarget(event.target)) {
        if (event.key === "Escape") {
          (event.target as HTMLElement).blur();
        }
        return;
      }

      const activeIndex = rows.findIndex((row) => row.id === activeRowId);
      const activeRow = activeIndex >= 0 ? rows[activeIndex] : null;

      switch (event.key) {
        case "/":
          event.preventDefault();
          document.getElementById(SEARCH_INPUT_ID)?.focus();
          break;
        case "c":
          event.preventDefault();
          onOpenCommandBar();
          break;
        case "j":
        case "k": {
          if (rows.length === 0) break;
          event.preventDefault();
          const delta = event.key === "j" ? 1 : -1;
          const next =
            activeIndex < 0
              ? 0
              : Math.min(Math.max(activeIndex + delta, 0), rows.length - 1);
          setActiveRowId(rows[next].id);
          document
            .querySelector(`[data-row-id="${rows[next].id}"]`)
            ?.scrollIntoView({ block: "nearest" });
          break;
        }
        case "Enter":
          if (activeRow) {
            event.preventDefault();
            onOpenRow(activeRow);
          }
          break;
        case "e":
          if (activeRow) {
            event.preventDefault();
            onEditRow(activeRow);
          }
          break;
        default:
          break;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    enabled,
    rows,
    activeRowId,
    setActiveRowId,
    onOpenCommandBar,
    onOpenRow,
    onEditRow,
  ]);
}

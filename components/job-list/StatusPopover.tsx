"use client";

import { useEffect, useRef, useState } from "react";
import { StatusDot } from "@/components/job-list/StatusDot";
import { useLocale } from "@/components/LocaleProvider";
import { statusLabel } from "@/lib/i18n";
import { JOB_STATUSES, type JobStatus } from "@/types/job";

type StatusPopoverProps = {
  status: JobStatus;
  onChange: (status: JobStatus) => void;
  showLabel?: boolean;
  /** Lets a row lift itself above its siblings while the menu is open. */
  onOpenChange?: (open: boolean) => void;
};

export function StatusPopover({
  status,
  onChange,
  showLabel = false,
  onOpenChange,
}: StatusPopoverProps) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, JOB_STATUSES.indexOf(status)),
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function close() {
    setOpen(false);
    onOpenChange?.(false);
  }

  function openMenu() {
    setActiveIndex(Math.max(0, JOB_STATUSES.indexOf(status)));
    setOpen(true);
    onOpenChange?.(true);
  }

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        onOpenChange?.(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (open) {
      itemRefs.current[activeIndex]?.focus();
    }
  }, [open, activeIndex]);

  function select(next: JobStatus) {
    close();
    if (next !== status) {
      onChange(next);
    }
  }

  function handleMenuKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      event.stopPropagation();
      close();
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const delta = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex(
        (current) =>
          (current + delta + JOB_STATUSES.length) % JOB_STATUSES.length,
      );
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${t.list.status}: ${statusLabel(t, status)}`}
        onClick={(event) => {
          event.stopPropagation();
          if (open) {
            close();
          } else {
            openMenu();
          }
        }}
        className={`inline-flex items-center gap-2 rounded-md transition hover:bg-surface-muted ${
          showLabel ? "px-2 py-1" : "p-1.5"
        }`}
      >
        <StatusDot status={status} />
        {showLabel && (
          <span className="text-xs font-medium text-foreground">
            {statusLabel(t, status)}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label={t.list.status}
          onKeyDown={handleMenuKeyDown}
          className="animate-pop-in absolute left-0 top-full z-30 mt-1 min-w-[10rem] origin-top-left border border-border bg-surface-solid p-1 shadow-lg"
        >
          {JOB_STATUSES.map((option, index) => (
            <button
              key={option}
              type="button"
              role="menuitemradio"
              aria-checked={option === status}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              onClick={(event) => {
                event.stopPropagation();
                select(option);
              }}
              className={`flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-xs transition hover:bg-surface-muted ${
                option === status ? "font-semibold" : "text-muted-strong"
              }`}
            >
              <StatusDot status={option} size="sm" />
              <span className="flex-1">{statusLabel(t, option)}</span>
              {option === status && (
                <span aria-hidden="true" className="text-muted">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

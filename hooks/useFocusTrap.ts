"use client";

import { useEffect } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter(
    (element) =>
      !element.hasAttribute("disabled") &&
      element.getAttribute("aria-hidden") !== "true",
  );
}

type OverlayRef = {
  readonly current: HTMLElement | null;
};

type UseFocusTrapOptions = {
  enabled: boolean;
  containerRef: OverlayRef;
  onClose: () => void;
  lockScroll?: boolean;
};

/**
 * Moves focus into an overlay, cycles Tab within it, restores focus on close,
 * and closes on Escape.
 */
export function useFocusTrap({
  enabled,
  containerRef,
  onClose,
  lockScroll = false,
}: UseFocusTrapOptions) {
  useEffect(() => {
    if (!enabled) return;
    const container = containerRef.current;
    if (!container) return;
    const trappedRoot: HTMLElement = container;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;
    if (lockScroll) {
      document.body.style.overflow = "hidden";
    }

    const preferInput = trappedRoot.querySelector<HTMLElement>(
      "input:not([type='hidden']):not([disabled]), textarea:not([disabled]), select:not([disabled])",
    );
    const items = getFocusable(trappedRoot);
    (preferInput ?? items[0] ?? trappedRoot).focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusable(trappedRoot);
      if (focusable.length === 0) {
        event.preventDefault();
        trappedRoot.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        event.preventDefault();
        trappedRoot.focus();
        return;
      }
      const active = document.activeElement;

      if (
        event.shiftKey &&
        (active === first || !trappedRoot.contains(active))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (active === last || !trappedRoot.contains(active))
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (lockScroll) {
        document.body.style.overflow = previousOverflow;
      }
      previouslyFocused?.focus();
    };
  }, [enabled, containerRef, onClose, lockScroll]);
}

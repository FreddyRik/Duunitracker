"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/** Appears once the hero CTA has scrolled out of reach. */
const REVEAL_AT_PX = 620;

export function LandingStickyCta({
  appName,
  cta,
}: {
  appName: string;
  cta: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > REVEAL_AT_PX);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 top-0 z-40 border-b border-border bg-background/70 backdrop-blur-xl transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-full opacity-0"
      }`}
      style={{ transitionTimingFunction: "var(--ease-spring)" }}
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <span
          aria-hidden="true"
          className="h-2 w-2 rotate-45 rounded-[1px] bg-accent"
        />
        <span className="text-sm font-semibold tracking-tight text-foreground">
          {appName}
        </span>
        <span className="flex-1" />
        <Link
          href="/app"
          tabIndex={visible ? undefined : -1}
          className="inline-flex items-center rounded-md bg-accent px-4 py-1.5 text-xs font-semibold text-accent-fg transition hover:bg-accent-hover"
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}

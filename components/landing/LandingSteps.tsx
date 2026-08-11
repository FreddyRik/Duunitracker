"use client";

import { useEffect, useRef } from "react";

type LandingStep = {
  title: string;
  body: string;
};

type LandingStepsProps = {
  title: string;
  steps: LandingStep[];
};

export function LandingSteps({ title, steps }: LandingStepsProps) {
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const items = Array.from(list.querySelectorAll<HTMLElement>("[data-step]"));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="border-t border-border pt-16">
      <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-tight tracking-tight text-foreground">
        {title}
      </h2>
      <ol ref={listRef} className="mt-12 grid gap-px bg-border sm:grid-cols-3">
        {steps.map((step, index) => (
          <li
            key={step.title}
            data-step
            className="landing-step bg-background px-1 py-8 sm:px-6"
            style={{ transitionDelay: `${index * 90}ms` }}
          >
            {/* Oversized numeral carries the section instead of a small badge. */}
            <span
              className="block font-mono text-[clamp(3rem,6vw,5rem)] font-medium leading-none tracking-tighter text-border-strong"
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-6 text-lg font-semibold text-foreground">
              {step.title}
            </h3>
            <p className="mt-2.5 text-base leading-relaxed text-muted">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

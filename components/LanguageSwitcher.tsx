"use client";

import { useRef } from "react";
import {
  LOCALES,
  useLocale,
  type Locale,
} from "@/components/LocaleProvider";
import { nextIndexOnArrowKey } from "@/lib/keyboard";

const LABELS: Record<Locale, string> = {
  fi: "FI",
  en: "EN",
};

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(event: React.KeyboardEvent, index: number) {
    const next = nextIndexOnArrowKey(event.key, index, LOCALES.length);
    if (next === null) return;
    event.preventDefault();
    setLocale(LOCALES[next]);
    buttonRefs.current[next]?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label={t.language.ariaLabel}
      className="inline-flex rounded-md border border-border p-0.5"
    >
      {LOCALES.map((option, index) => {
        const selected = locale === option;
        return (
          <button
            key={option}
            ref={(node) => {
              buttonRefs.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => setLocale(option)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`rounded-sm px-3 py-1.5 text-xs font-semibold transition ${
              selected
                ? "bg-accent text-accent-fg"
                : "text-muted hover:text-foreground"
            }`}
          >
            {LABELS[option]}
          </button>
        );
      })}
    </div>
  );
}

"use client";

import { useRef } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { THEMES, useTheme, type Theme } from "@/components/ThemeProvider";
import { nextIndexOnArrowKey } from "@/lib/keyboard";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { t } = useLocale();
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const labels: Record<Theme, string> = {
    light: t.theme.light,
    dark: t.theme.dark,
  };

  function handleKeyDown(event: React.KeyboardEvent, index: number) {
    const next = nextIndexOnArrowKey(event.key, index, THEMES.length);
    if (next === null) return;
    event.preventDefault();
    setTheme(THEMES[next]);
    buttonRefs.current[next]?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label={t.theme.ariaLabel}
      className="inline-flex rounded-md border border-border p-0.5"
    >
      {THEMES.map((option, index) => {
        const selected = theme === option;
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
            onClick={() => setTheme(option)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`rounded-sm px-3 py-1.5 text-xs font-semibold transition ${
              selected
                ? "bg-accent text-accent-fg"
                : "text-muted hover:text-foreground"
            }`}
          >
            {labels[option]}
          </button>
        );
      })}
    </div>
  );
}

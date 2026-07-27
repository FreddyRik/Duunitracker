"use client";

import { THEMES, useTheme, type Theme } from "@/components/ThemeProvider";

const LABELS: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
  midsummer: "Midsummer",
};

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className="inline-flex rounded-xl border border-border bg-surface-muted p-1"
    >
      {THEMES.map((option) => {
        const selected = theme === option;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setTheme(option)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              selected
                ? "bg-accent text-accent-fg shadow-sm"
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

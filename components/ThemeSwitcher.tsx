"use client";

import { useLocale } from "@/components/LocaleProvider";
import { THEMES, useTheme, type Theme } from "@/components/ThemeProvider";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { t } = useLocale();

  const labels: Record<Theme, string> = {
    light: t.theme.light,
    dark: t.theme.dark,
  };

  return (
    <div
      role="radiogroup"
      aria-label={t.theme.ariaLabel}
      className="inline-flex rounded-md border border-border p-0.5"
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

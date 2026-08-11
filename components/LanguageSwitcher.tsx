"use client";

import {
  LOCALES,
  useLocale,
  type Locale,
} from "@/components/LocaleProvider";

const LABELS: Record<Locale, string> = {
  fi: "FI",
  en: "EN",
};

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      role="radiogroup"
      aria-label={t.language.ariaLabel}
      className="inline-flex rounded-md border border-border p-0.5"
    >
      {LOCALES.map((option) => {
        const selected = locale === option;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setLocale(option)}
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

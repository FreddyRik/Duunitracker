"use client";

import { useEffect, useRef, useState } from "react";
import { DataBackupControls } from "@/components/DataBackupControls";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { Kbd } from "@/components/Kbd";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLocale } from "@/components/LocaleProvider";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { statusDotStyles } from "@/lib/job-status-styles";
import { SEARCH_INPUT_ID } from "@/lib/ui-constants";
import type { JobStatus } from "@/types/job";

type AppHeaderProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onOpenCommandBar: () => void;
  onAddManual: () => void;
  jobCount: number;
  onExport: () => void;
  onImportBackup: (file: File) => void;
  brandStatus: JobStatus | null;
};

export function AppHeader({
  search,
  onSearchChange,
  onOpenCommandBar,
  onAddManual,
  jobCount,
  onExport,
  onImportBackup,
  brandStatus,
}: AppHeaderProps) {
  const { t } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header
      className={`no-print sticky top-0 z-40 transition-all duration-200 ${
        scrolled
          ? "border-b border-border bg-background/70 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 w-full max-w-[1100px] items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <div className="flex shrink-0 items-center gap-2">
          <span
            aria-hidden="true"
            className={`h-2 w-2 rotate-45 rounded-[1px] transition-colors ${
              brandStatus ? statusDotStyles[brandStatus] : "bg-accent"
            }`}
          />
          <span className="text-sm font-semibold tracking-tight text-foreground">
            {t.app.name}
          </span>
          <OfflineIndicator />
        </div>

        <div className="relative flex min-w-0 flex-1 items-center">
          <label htmlFor={SEARCH_INPUT_ID} className="sr-only">
            {t.filters.searchLabel}
          </label>
          <input
            id={SEARCH_INPUT_ID}
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={t.filters.searchPlaceholder}
            className="w-full rounded-md border border-transparent bg-transparent py-1.5 pl-2 pr-10 text-sm text-foreground outline-none transition placeholder:text-muted hover:border-border focus:border-border-strong"
          />
          {search.length === 0 && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-2 hidden sm:block"
            >
              <Kbd>/</Kbd>
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onOpenCommandBar}
            aria-label={t.importBar.importJob}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-accent-fg transition hover:bg-accent-hover"
          >
            <span aria-hidden="true">+</span>
            <span className="hidden sm:inline">{t.importBar.importJob}</span>
          </button>

          <div className="hidden items-center gap-2 sm:flex">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>

          <div ref={menuRef} className="relative">
            <button
              ref={menuButtonRef}
              type="button"
              aria-haspopup="true"
              aria-expanded={menuOpen}
              aria-label={t.ui.moreActions}
              onClick={() => setMenuOpen((current) => !current)}
              className="rounded-md px-2 py-1.5 text-sm text-muted transition hover:bg-surface-muted hover:text-foreground"
            >
              <span aria-hidden="true">⋯</span>
            </button>

            {menuOpen && (
              <div
                role="dialog"
                aria-label={t.ui.moreActions}
                className="animate-pop-in absolute right-0 top-full z-40 mt-1 w-64 origin-top-right border border-border bg-surface-solid p-2 shadow-lg"
              >
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onAddManual();
                  }}
                  className="w-full rounded-sm px-2 py-1.5 text-left text-xs font-medium text-foreground transition hover:bg-surface-muted"
                >
                  {t.importBar.addManual}
                </button>

                <div className="my-2 h-px bg-border" />

                <div className="px-2 pb-1">
                  <DataBackupControls
                    jobCount={jobCount}
                    onExport={onExport}
                    onImport={onImportBackup}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between gap-2 border-t border-border px-2 pt-2 sm:hidden">
                  <LanguageSwitcher />
                  <ThemeSwitcher />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

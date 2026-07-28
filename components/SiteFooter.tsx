"use client";

import { useLocale } from "@/components/LocaleProvider";
import {
  GITHUB_ISSUES,
  GITHUB_PROFILE,
  GITHUB_REPO,
} from "@/lib/site-config";

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-muted transition hover:text-accent"
    >
      {children}
    </a>
  );
}

export function SiteFooter() {
  const { t } = useLocale();
  const links = [
    { label: t.footer.github, href: GITHUB_PROFILE },
    { label: t.footer.source, href: GITHUB_REPO },
    { label: t.footer.reportIssue, href: GITHUB_ISSUES },
  ];

  return (
    <footer className="mt-8 border-t border-border pt-6 text-xs text-muted">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>{t.footer.privacy}</p>
        <p>© {new Date().getFullYear()} Freddy</p>
      </div>
      <nav
        aria-label={t.footer.siteLinks}
        className="mt-3 flex flex-wrap items-center gap-x-1 gap-y-1"
      >
        {links.map((link, index) => (
          <span key={link.href} className="inline-flex items-center">
            {index > 0 && (
              <span className="mx-1.5 text-border-strong" aria-hidden="true">
                ·
              </span>
            )}
            <FooterLink href={link.href}>{link.label}</FooterLink>
          </span>
        ))}
      </nav>
    </footer>
  );
}

"use client";

import Link from "next/link";
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

function InternalFooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="text-muted transition hover:text-accent">
      {children}
    </Link>
  );
}

export function SiteFooter() {
  const { t } = useLocale();
  const links = [
    { label: t.footer.privacyPage, href: "/privacy", internal: true },
    { label: t.footer.github, href: GITHUB_PROFILE, internal: false },
    { label: t.footer.source, href: GITHUB_REPO, internal: false },
    { label: t.footer.reportIssue, href: GITHUB_ISSUES, internal: false },
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
            {link.internal ? (
              <InternalFooterLink href={link.href}>{link.label}</InternalFooterLink>
            ) : (
              <FooterLink href={link.href}>{link.label}</FooterLink>
            )}
          </span>
        ))}
      </nav>
    </footer>
  );
}

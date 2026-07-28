const GITHUB_PROFILE = "https://github.com/FreddyRik";
const GITHUB_REPO = "https://github.com/FreddyRik/job-application-tracker";
const GITHUB_ISSUES = `${GITHUB_REPO}/issues`;

const FOOTER_LINKS = [
  { label: "GitHub", href: GITHUB_PROFILE },
  { label: "Source", href: GITHUB_REPO },
  { label: "Report issue", href: GITHUB_ISSUES },
] as const;

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
  return (
    <footer className="mt-8 border-t border-border pt-6 text-xs text-muted">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>Your data stays in this browser. Export a backup before clearing site data.</p>
        <p>© {new Date().getFullYear()} Freddy</p>
      </div>
      <nav
        aria-label="Site links"
        className="mt-3 flex flex-wrap items-center gap-x-1 gap-y-1"
      >
        {FOOTER_LINKS.map((link, index) => (
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

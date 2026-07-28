import Link from "next/link";
import { LandingJsonLd } from "@/components/landing/LandingJsonLd";
import { fi } from "@/lib/i18n/messages/fi";
import {
  GITHUB_ISSUES,
  GITHUB_PROFILE,
  GITHUB_REPO,
} from "@/lib/site-config";

export function LandingPage() {
  const { landing, app, footer } = fi;

  return (
    <>
      <LandingJsonLd />
      <div className="min-h-full">
        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-16 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              {app.name}
            </p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {landing.headline}
            </h1>
            <p className="max-w-2xl text-lg text-muted sm:text-xl">
              {landing.subhead}
            </p>
            <div>
              <Link
                href="/app"
                className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-base font-semibold text-accent-fg transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {landing.cta}
              </Link>
            </div>
          </header>

          <section className="mt-24 border-t border-border pt-16">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {landing.howItWorksTitle}
            </h2>
            <ol className="mt-10 space-y-10">
              {landing.steps.map((step, index) => (
                <li key={step.title} className="flex gap-5">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-base text-muted">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-20 border-t border-border pt-16">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {landing.privacyTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-base text-muted sm:text-lg">
              {landing.privacyBody}
            </p>
            <Link
              href="/privacy"
              className="mt-4 inline-flex text-sm font-medium text-accent transition hover:text-accent-hover"
            >
              {landing.privacyLink}
            </Link>
          </section>

          <footer className="mt-20 border-t border-border pt-8 text-xs text-muted">
            <p>{footer.privacy}</p>
            <nav
              aria-label={footer.siteLinks}
              className="mt-3 flex flex-wrap items-center gap-x-1 gap-y-1"
            >
              <Link
                href="/privacy"
                className="text-muted transition hover:text-accent"
              >
                {footer.privacyPage}
              </Link>
              <span className="mx-1.5 text-border-strong" aria-hidden="true">
                ·
              </span>
              <a
                href={GITHUB_PROFILE}
                target="_blank"
                rel="noreferrer"
                className="text-muted transition hover:text-accent"
              >
                {footer.github}
              </a>
              <span className="mx-1.5 text-border-strong" aria-hidden="true">
                ·
              </span>
              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="noreferrer"
                className="text-muted transition hover:text-accent"
              >
                {footer.source}
              </a>
              <span className="mx-1.5 text-border-strong" aria-hidden="true">
                ·
              </span>
              <a
                href={GITHUB_ISSUES}
                target="_blank"
                rel="noreferrer"
                className="text-muted transition hover:text-accent"
              >
                {footer.reportIssue}
              </a>
            </nav>
            <p className="mt-3">© {new Date().getFullYear()} Freddy</p>
          </footer>
        </main>
      </div>
    </>
  );
}

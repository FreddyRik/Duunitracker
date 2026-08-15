import Link from "next/link";
import { InstallAppButton } from "@/components/InstallAppButton";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingJsonLd } from "@/components/landing/LandingJsonLd";
import { LandingStickyCta } from "@/components/landing/LandingStickyCta";
import { LandingSteps } from "@/components/landing/LandingSteps";
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
      <LandingStickyCta appName={app.name} cta={landing.cta} />
      <div className="min-h-full">
        <LandingHero
          appName={app.name}
          headline={landing.headline}
          subhead={landing.subhead}
          cta={landing.cta}
          eyebrow={landing.eyebrow}
          scrollHint={landing.scrollHint}
          previewLabel={landing.previewLabel}
          previewJobs={landing.previewJobs}
        />

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-16 sm:px-6 lg:px-8">
          <LandingSteps title={landing.howItWorksTitle} steps={landing.steps} />

          <section className="mt-24 border-t border-border pt-16">
            <h2 className="max-w-[18ch] text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-tight tracking-tight text-foreground">
              {landing.privacyTitle}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {landing.privacyBody}
            </p>
            <Link
              href="/privacy"
              className="mt-5 inline-flex border-b border-transparent text-sm font-medium text-foreground transition hover:border-foreground"
            >
              {landing.privacyLink}
            </Link>
          </section>

          <footer className="mt-24 border-t border-border pt-8 text-xs text-muted">
            <p>{footer.privacy}</p>
            <nav
              aria-label={footer.siteLinks}
              className="mt-3 flex flex-wrap items-center gap-x-1 gap-y-1"
            >
              <Link
                href="/privacy"
                className="text-muted transition hover:text-foreground"
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
                className="text-muted transition hover:text-foreground"
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
                className="text-muted transition hover:text-foreground"
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
                className="text-muted transition hover:text-foreground"
              >
                {footer.reportIssue}
              </a>
              <InstallAppButton withSeparator />
            </nav>
            <p className="mt-3">© {new Date().getFullYear()} Freddy</p>
          </footer>
        </main>
      </div>
    </>
  );
}

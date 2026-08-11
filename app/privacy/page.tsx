import Link from "next/link";
import { fi } from "@/lib/i18n/messages/fi";
import { createSiteMetadata } from "@/lib/seo/site-metadata";

export const metadata = createSiteMetadata({
  title: fi.privacy.title,
  description: fi.privacy.metaDescription,
  path: "/privacy",
});

export default function PrivacyPage() {
  const { privacy, app } = fi;

  return (
    <div className="min-h-full">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-10 border-b border-border pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            {app.name}
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {privacy.title}
          </h1>
        </header>

        <div className="space-y-10">
          {privacy.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-semibold text-foreground">
                {section.heading}
              </h2>
              <div className="mt-3 space-y-3 text-base leading-relaxed text-muted">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3 border-t border-border pt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-border-strong px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface-muted"
          >
            {privacy.backToHome}
          </Link>
          <Link
            href="/app"
            className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg transition hover:bg-accent-hover"
          >
            {privacy.openTracker}
          </Link>
        </div>
      </main>
    </div>
  );
}

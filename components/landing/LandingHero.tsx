import { Fragment } from "react";
import Link from "next/link";
import { LandingPreview } from "@/components/landing/LandingPreview";
import type { LandingPreviewJob } from "@/lib/i18n/types";

type LandingHeroProps = {
  appName: string;
  headline: string;
  subhead: string;
  cta: string;
  eyebrow: string;
  scrollHint: string;
  previewLabel: string;
  previewJobs: LandingPreviewJob[];
};

const WORD_DELAY_MS = 120;
const WORD_STAGGER_MS = 45;

/**
 * A mask cannot wrap its own contents, so long Finnish compounds are split
 * after their hyphen into separate mask units that can fall to the next line.
 * Splitting on the server keeps the stagger in markup, so the headline never
 * flashes unstyled while hydrating.
 */
function toMaskGroups(headline: string): string[][] {
  return headline
    .split(" ")
    .map((word) => word.split(/(?<=-)/).filter(Boolean));
}

function MaskedHeadline({ headline }: { headline: string }) {
  const groups = toMaskGroups(headline);
  const startIndexes = groups.map((_, index) =>
    groups.slice(0, index).reduce((sum, group) => sum + group.length, 0),
  );

  return (
    <h1 className="text-[clamp(2.5rem,5.5vw,4.75rem)] font-bold leading-[0.95] tracking-tight text-foreground">
      {groups.map((parts, groupIndex) => (
        <Fragment key={`${parts.join("")}-${groupIndex}`}>
          {parts.map((part, partIndex) => (
            <span key={`${part}-${partIndex}`} className="landing-word-mask">
              <span
                className="landing-word"
                style={{
                  animationDelay: `${
                    WORD_DELAY_MS +
                    (startIndexes[groupIndex] + partIndex) * WORD_STAGGER_MS
                  }ms`,
                }}
              >
                {part}
              </span>
            </span>
          ))}
          {/* The space sits between groups so words still wrap normally. */}
          {groupIndex < groups.length - 1 ? " " : null}
        </Fragment>
      ))}
    </h1>
  );
}

export function LandingHero({
  appName,
  headline,
  subhead,
  cta,
  eyebrow,
  scrollHint,
  previewLabel,
  previewJobs,
}: LandingHeroProps) {
  return (
    <section className="relative overflow-hidden">
      <span
        aria-hidden="true"
        className="landing-grid pointer-events-none absolute inset-0"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="landing-rise landing-rise-delay-1 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rotate-45 rounded-[1px] bg-accent"
              />
              {appName}
            </p>

            <div className="mt-6">
              <MaskedHeadline headline={headline} />
            </div>

            <p
              className="landing-rise mt-7 max-w-xl text-lg leading-relaxed text-muted sm:text-xl"
              style={{ animationDelay: "520ms" }}
            >
              {subhead}
            </p>

            <div
              className="landing-rise mt-9 flex flex-wrap items-center gap-x-5 gap-y-4"
              style={{ animationDelay: "640ms" }}
            >
              <Link
                href="/app"
                className="landing-cta landing-cta-pulse inline-flex items-center justify-center rounded-md bg-accent px-7 py-3.5 text-base font-semibold text-accent-fg transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {cta}
              </Link>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                {eyebrow}
              </p>
            </div>
          </div>

          {/* Bleeds past the container on large screens so the list feels alive. */}
          <div className="lg:col-span-5 lg:-mr-16 xl:-mr-24">
            <LandingPreview
              label={previewLabel}
              appName={appName}
              jobs={previewJobs}
            />
          </div>
        </div>

        <p
          className="landing-rise mt-16 hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted lg:flex"
          style={{ animationDelay: "1500ms" }}
        >
          <span aria-hidden="true" className="landing-scroll-cue inline-block">
            ↓
          </span>
          {scrollHint}
        </p>
      </div>
    </section>
  );
}

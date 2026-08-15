import Link from "next/link";
import { fi } from "@/lib/i18n/messages/fi";
import { APP_NAME } from "@/lib/site-config";
import { createSiteMetadata } from "@/lib/seo/site-metadata";

export const metadata = createSiteMetadata({
  title: fi.pwa.offlineTitle,
  description: fi.pwa.offlineBody,
  path: "/offline",
  noIndex: true,
});

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
        {APP_NAME}
      </p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
        {fi.pwa.offlineTitle}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted">
        {fi.pwa.offlineBody}
      </p>
      <Link
        href="/app"
        className="mt-8 inline-flex w-fit items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg transition hover:bg-accent-hover"
      >
        {fi.pwa.openTracker}
      </Link>
    </main>
  );
}

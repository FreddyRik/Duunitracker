import type { Metadata } from "next";
import { APP_NAME, SITE_URL } from "@/lib/site-config";
import { fi } from "@/lib/i18n/messages/fi";

interface PageMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}

export function createSiteMetadata({
  title,
  description,
  path = "/",
  noIndex = false,
}: PageMetadataOptions = {}): Metadata {
  const pageTitle = title ?? fi.meta.title;
  const pageDescription = description ?? fi.meta.description;
  const canonicalUrl = new URL(path, SITE_URL).toString();

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: APP_NAME,
    appleWebApp: {
      capable: true,
      title: APP_NAME,
      statusBarStyle: "default",
    },
    title: title
      ? { absolute: pageTitle }
      : {
          default: fi.meta.title,
          template: `%s | ${APP_NAME}`,
        },
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "fi_FI",
      url: canonicalUrl,
      siteName: APP_NAME,
      title: pageTitle,
      description: pageDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
    },
  };
}

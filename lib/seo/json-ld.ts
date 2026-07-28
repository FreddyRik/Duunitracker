import { fi } from "@/lib/i18n/messages/fi";
import { APP_NAME, SITE_URL } from "@/lib/site-config";
import type { WebApplicationJsonLd } from "@/types/seo";

export function createWebApplicationJsonLd(): WebApplicationJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: APP_NAME,
    description: fi.meta.description,
    url: SITE_URL,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web browser",
    browserRequirements: "Requires JavaScript",
    inLanguage: ["fi", "en"],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
  };
}

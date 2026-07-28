import { createWebApplicationJsonLd } from "@/lib/seo/json-ld";

export function LandingJsonLd() {
  const jsonLd = createWebApplicationJsonLd();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export interface WebApplicationJsonLd {
  "@context": "https://schema.org";
  "@type": "WebApplication";
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem: string;
  browserRequirements: string;
  inLanguage: string[];
  offers: {
    "@type": "Offer";
    price: string;
    priceCurrency: string;
  };
}

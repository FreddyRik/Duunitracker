import { LandingPage } from "@/components/landing/LandingPage";
import { fi } from "@/lib/i18n/messages/fi";
import { createSiteMetadata } from "@/lib/seo/site-metadata";

export const metadata = createSiteMetadata({
  title: fi.meta.title,
  description: fi.meta.description,
  path: "/",
});

export default function HomePage() {
  return <LandingPage />;
}

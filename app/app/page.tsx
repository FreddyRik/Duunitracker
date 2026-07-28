import type { Metadata } from "next";
import { Dashboard } from "@/components/Dashboard";
import { fi } from "@/lib/i18n/messages/fi";
import { APP_NAME } from "@/lib/site-config";
import { createSiteMetadata } from "@/lib/seo/site-metadata";

export const metadata: Metadata = createSiteMetadata({
  title: `Tracker | ${APP_NAME}`,
  description: fi.app.intro,
  path: "/app",
});

export default function AppPage() {
  return <Dashboard />;
}

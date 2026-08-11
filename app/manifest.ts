import type { MetadataRoute } from "next";
import { APP_NAME } from "@/lib/site-config";
import { fi } from "@/lib/i18n/messages/fi";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: APP_NAME,
    description: fi.meta.description,
    start_url: "/app",
    display: "standalone",
    background_color: "#f7f7f5",
    theme_color: "#141413",
    lang: "fi",
  };
}

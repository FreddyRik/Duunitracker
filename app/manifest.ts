import type { MetadataRoute } from "next";
import { fi } from "@/lib/i18n/messages/fi";
import { SHARE_TARGET_PATH } from "@/lib/share-target/intake";
import {
  APP_NAME,
  PWA_BACKGROUND_COLOR,
  PWA_THEME_COLOR,
} from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/app",
    name: APP_NAME,
    short_name: APP_NAME,
    description: fi.meta.description,
    start_url: "/app",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui", "browser"],
    orientation: "any",
    background_color: PWA_BACKGROUND_COLOR,
    theme_color: PWA_THEME_COLOR,
    lang: "fi",
    dir: "ltr",
    categories: ["productivity", "business"],
    prefer_related_applications: false,
    icons: [
      {
        src: "/icons/icon-192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512-maskable",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: fi.landing.cta,
        short_name: APP_NAME,
        description: fi.app.intro,
        url: "/app",
        icons: [
          {
            src: "/icons/icon-192",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
    ],
    share_target: {
      action: SHARE_TARGET_PATH,
      method: "GET",
      params: {
        title: "title",
        text: "text",
        url: "url",
      },
    },
  };
}

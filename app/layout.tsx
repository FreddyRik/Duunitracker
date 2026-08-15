import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { LocaleProvider } from "@/components/LocaleProvider";
import { PwaRuntime } from "@/components/PwaRuntime";
import { ThemeProvider } from "@/components/ThemeProvider";
import { createSiteMetadata } from "@/lib/seo/site-metadata";
import {
  LEGACY_THEME_STORAGE_KEY,
  LOCALE_STORAGE_KEY,
  PWA_THEME_COLOR,
  PWA_THEME_COLOR_DARK,
  THEME_STORAGE_KEY,
} from "@/lib/site-config";
import { DEFAULT_LOCALE } from "@/types/locale";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = createSiteMetadata();

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: PWA_THEME_COLOR },
    { media: "(prefers-color-scheme: dark)", color: PWA_THEME_COLOR_DARK },
  ],
  colorScheme: "light dark",
};

const themeInitScript = `
(function () {
  try {
    var key = "${THEME_STORAGE_KEY}";
    var legacyKey = "${LEGACY_THEME_STORAGE_KEY}";
    var stored = localStorage.getItem(key) || localStorage.getItem(legacyKey);
    var theme = stored === "light" || stored === "dark"
      ? stored
      : "light";
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
  }
  try {
    var localeKey = "${LOCALE_STORAGE_KEY}";
    var locale = localStorage.getItem(localeKey);
    document.documentElement.lang =
      locale === "en" || locale === "fi" ? locale : "${DEFAULT_LOCALE}";
  } catch (e) {
    document.documentElement.lang = "${DEFAULT_LOCALE}";
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={DEFAULT_LOCALE}
      data-theme="light"
      className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full font-sans text-foreground">
        <ThemeProvider>
          <LocaleProvider>
            {children}
            <PwaRuntime />
          </LocaleProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

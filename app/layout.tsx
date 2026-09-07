import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import { headers } from "next/headers";
import { ConnexeaseChat } from "./components/ConnexeaseChat";
import { FloatingPhone } from "./components/FloatingPhone";
import { normalizeLocale } from "./lib/i18n";
import { SITE_ORIGIN } from "./lib/seo";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  preload: false,
});

const headingFont = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

const siteDescription =
  "Modern, sade ve konforlu bir konaklama deneyimi. Mİ Hotel Boutique odalarını keşfedin ve doğrudan rezervasyon yapın.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Mİ Hotel Boutique | Antalya Merkezinde Butik Otel",
    template: "%s | Mİ Hotel Boutique",
  },
  description: siteDescription,
  applicationName: "Mİ Hotel Boutique",
  category: "travel",
  referrer: "origin-when-cross-origin",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "512x512" }],
    shortcut: "/favicon.png",
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    siteName: "Mİ Hotel Boutique",
    url: SITE_ORIGIN,
    title: "Mİ Hotel Boutique | Antalya Merkezinde Butik Otel",
    description: siteDescription,
    images: [{ url: "/og.png", width: 1200, height: 630, type: "image/png", alt: "Mİ Hotel Boutique" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mİ Hotel Boutique | Antalya Merkezinde Butik Otel",
    description: siteDescription,
    images: ["/og.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = normalizeLocale((await headers()).get("x-mi-hotel-locale"));

  return (
    <html lang={locale}>
      <body className={`${montserrat.variable} ${headingFont.variable}`}>
        {children}
        <FloatingPhone />
        <ConnexeaseChat />
      </body>
    </html>
  );
}

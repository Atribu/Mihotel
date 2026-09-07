import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import { headers } from "next/headers";
import { ConnexeaseChat } from "./components/ConnexeaseChat";
import { FloatingPhone } from "./components/FloatingPhone";
import { normalizeLocale } from "./lib/i18n";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

const headingFont = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const siteDescription =
  "Modern, sade ve konforlu bir konaklama deneyimi. Mİ Hotel Boutique odalarını keşfedin ve doğrudan rezervasyon yapın.";

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const protocol = headerList.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const siteUrl = new URL(`${protocol}://${host}`);
  const socialImage = new URL("/og.png", siteUrl).toString();

  return {
    metadataBase: siteUrl,
    title: {
      default: "Mİ Hotel Boutique",
      template: "%s | Mİ Hotel Boutique",
    },
    description: siteDescription,
    icons: {
      icon: [{ url: "/favicon.png", type: "image/png", sizes: "512x512" }],
      shortcut: "/favicon.png",
      apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
    },
    openGraph: {
      type: "website",
      title: "Mİ Hotel Boutique",
      description: siteDescription,
      images: [{ url: socialImage, width: 1200, height: 630, alt: "Mİ Hotel Boutique" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Mİ Hotel Boutique",
      description: siteDescription,
      images: [socialImage],
    },
  };
}

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

import type { Metadata } from "next";
import { PhoneCall } from "lucide-react";
import { Bodoni_Moda, Montserrat } from "next/font/google";
import { headers } from "next/headers";
import { ConnexeaseChat } from "./components/ConnexeaseChat";
import { phoneHref, phoneNumber } from "./lib/site-data";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const headingFont = Bodoni_Moda({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz"],
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
      icon: "/brand/mi-hotel-logo.png",
      shortcut: "/brand/mi-hotel-logo.png",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${montserrat.variable} ${headingFont.variable}`}>
        {children}
        <a
          className="floating-phone"
          href={phoneHref}
          aria-label={`Mİ Hotel Boutique'u ara: ${phoneNumber}`}
          title={phoneNumber}
        >
          <PhoneCall aria-hidden="true" size={25} strokeWidth={1.8} />
        </a>
        <ConnexeaseChat />
      </body>
    </html>
  );
}

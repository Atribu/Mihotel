import type { Metadata } from "next";
import {
  getLocaleInfo,
  getMessages,
  languageAlternates,
  localizedPath,
  locales,
  type Locale,
} from "../lib/i18n";
import type { Room } from "../lib/site-data";

const brandName = "Mİ Hotel Boutique";

export type StaticPage = "home" | "rooms" | "gallery" | "about" | "contact";

const pagePaths: Record<StaticPage, string> = {
  home: "/",
  rooms: "/odalar",
  gallery: "/galeri",
  about: "/hakkimizda",
  contact: "/konum-iletisim",
};

function socialLocales(locale: Locale) {
  return locales
    .filter((candidate) => candidate !== locale)
    .map((candidate) => getLocaleInfo(candidate).openGraphLocale);
}

function pageCopy(locale: Locale, page: StaticPage) {
  const meta = getMessages(locale).meta;

  switch (page) {
    case "rooms":
      return { title: meta.roomsTitle, description: meta.roomsDescription };
    case "gallery":
      return { title: meta.galleryTitle, description: meta.galleryDescription };
    case "about":
      return { title: meta.aboutTitle, description: meta.aboutDescription };
    case "contact":
      return { title: meta.contactTitle, description: meta.contactDescription };
    default:
      return { title: brandName, description: meta.description };
  }
}

export function createPageMetadata(locale: Locale, page: StaticPage): Metadata {
  const copy = pageCopy(locale, page);
  const path = pagePaths[page];
  const canonical = localizedPath(locale, path);
  const socialTitle = page === "home" ? brandName : `${copy.title} | ${brandName}`;
  const socialImage = locale === "tr"
    ? "/og.png"
    : "/images/hero-lobby-relief-clean.webp";

  return {
    title: page === "home" ? { absolute: brandName } : copy.title,
    description: copy.description,
    alternates: {
      canonical,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "website",
      title: socialTitle,
      description: copy.description,
      url: canonical,
      locale: getLocaleInfo(locale).openGraphLocale,
      alternateLocale: socialLocales(locale),
      images: [{ url: socialImage, alt: brandName }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: copy.description,
      images: [socialImage],
    },
  };
}

export function createRoomMetadata(locale: Locale, room: Room): Metadata {
  const copy = getMessages(locale);
  const path = `/odalar/${room.slug}`;
  const canonical = localizedPath(locale, path);
  const description = `${room.name}, ${room.size}. ${room.description}`;
  const socialTitle = `${room.name} | ${brandName}`;

  return {
    title: room.name,
    description,
    alternates: {
      canonical,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "website",
      title: socialTitle,
      description,
      url: canonical,
      locale: getLocaleInfo(locale).openGraphLocale,
      alternateLocale: socialLocales(locale),
      images: [{ url: room.cover, alt: copy.a11y.roomInterior.replace("{room}", room.name) }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [room.cover],
    },
  };
}

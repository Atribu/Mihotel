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

const searchRobots: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export type StaticPage = "home" | "rooms" | "gallery" | "about" | "contact";

const pagePaths: Record<StaticPage, string> = {
  home: "/",
  rooms: "/odalar",
  gallery: "/galeri",
  about: "/hakkimizda",
  contact: "/konum-iletisim",
};

const pageSocialImages: Record<StaticPage, { url: string; width: number; height: number; type: "image/png" | "image/webp" }> = {
  home: { url: "/og.png", width: 1200, height: 630, type: "image/png" },
  rooms: { url: "/images/room-family.webp", width: 1800, height: 1200, type: "image/webp" },
  gallery: { url: "/images/gallery/hotel/genel-08.webp", width: 1800, height: 1200, type: "image/webp" },
  about: { url: "/images/hotel-reception.webp", width: 1800, height: 1200, type: "image/webp" },
  contact: { url: "/images/mi-hotel-exterior.webp", width: 2200, height: 1466, type: "image/webp" },
};

const seoCopy: Record<Locale, Record<StaticPage, { title: string; description: string }>> = {
  tr: {
    home: {
      title: "Mİ Hotel Boutique | Antalya Merkezinde Butik Otel",
      description: "Antalya'nın merkezinde, Muratpaşa'da sade ve konforlu bir konaklama. Odalarımızı inceleyin, müsaitliği kontrol edin ve doğrudan rezervasyon yapın.",
    },
    rooms: {
      title: "Antalya'daki Otel Odaları",
      description: "Antalya merkezindeki Mİ Hotel Boutique'in 9–30 m² Eco, Double, Triple ve Aile Odası seçeneklerini fotoğraflar ve oda olanaklarıyla inceleyin.",
    },
    gallery: {
      title: "Otel ve Oda Fotoğraf Galerisi — Antalya",
      description: "Mİ Hotel Boutique'in Muratpaşa, Antalya'daki ortak alanlarını, resepsiyonunu ve dört farklı oda tipini fotoğraflarla keşfedin.",
    },
    about: {
      title: "Butik Otelimiz Hakkında — Antalya",
      description: "Mİ Hotel Boutique'in Antalya şehir konaklamaları için sunduğu sade tasarımı, işlevsel odaları ve 7/24 resepsiyon hizmetini keşfedin.",
    },
    contact: {
      title: "Konum ve İletişim — Muratpaşa, Antalya",
      description: "Mİ Hotel Boutique'in Muratpaşa, Antalya adresini, telefon numarasını, Google Maps konumunu ve giriş-çıkış bilgilerini görüntüleyin.",
    },
  },
  en: {
    home: {
      title: "Mİ Hotel Boutique | Hotel in Central Antalya",
      description: "A comfortable city stay in Muratpaşa, central Antalya. Explore the rooms at Mİ Hotel Boutique, check availability and book directly.",
    },
    rooms: {
      title: "Hotel Rooms in Antalya",
      description: "Explore Mİ Hotel Boutique's 9–30 m² Eco, Double, Triple and Family Rooms in central Antalya, with room photos and amenities.",
    },
    gallery: {
      title: "Hotel & Room Photo Gallery — Antalya",
      description: "Browse photos of Mİ Hotel Boutique's reception, shared spaces and four room types in Muratpaşa, central Antalya.",
    },
    about: {
      title: "About Our Boutique Hotel in Antalya",
      description: "Discover Mİ Hotel Boutique in central Antalya, with thoughtfully designed rooms, complimentary Wi-Fi and a 24-hour reception.",
    },
    contact: {
      title: "Location & Contact — Muratpaşa, Antalya",
      description: "View Mİ Hotel Boutique's Muratpaşa address, telephone number, Google Maps location and standard check-in and check-out information.",
    },
  },
  de: {
    home: {
      title: "Mİ Hotel Boutique | Hotel im Zentrum von Antalya",
      description: "Genießen Sie einen komfortablen Aufenthalt in Muratpaşa, im Zentrum von Antalya. Zimmer ansehen, Verfügbarkeit prüfen und direkt buchen.",
    },
    rooms: {
      title: "Hotelzimmer in Antalya",
      description: "Entdecken Sie die 9–30 m² großen Eco-, Doppel-, Dreibett- und Familienzimmer des Mİ Hotel Boutique im Zentrum von Antalya.",
    },
    gallery: {
      title: "Hotel- und Zimmergalerie — Antalya",
      description: "Entdecken Sie Fotos von Rezeption, Gemeinschaftsbereichen und den vier Zimmerkategorien des Mİ Hotel Boutique in Antalya.",
    },
    about: {
      title: "Über unser Boutiquehotel in Antalya",
      description: "Erfahren Sie mehr über das Mİ Hotel Boutique, seine funktionalen Zimmer und die rund um die Uhr erreichbare Rezeption im Zentrum von Antalya.",
    },
    contact: {
      title: "Lage und Kontakt — Muratpaşa, Antalya",
      description: "Adresse, Telefonnummer, Google-Maps-Standort sowie Check-in- und Check-out-Informationen des Mİ Hotel Boutique in Antalya.",
    },
  },
  ru: {
    home: {
      title: "Mİ Hotel Boutique | Отель в центре Антальи",
      description: "Комфортный отдых в районе Муратпаша, в центре Антальи. Выберите номер Mİ Hotel Boutique, проверьте доступность и забронируйте напрямую.",
    },
    rooms: {
      title: "Номера отеля в Анталье",
      description: "Выберите один из четырёх вариантов размещения площадью 9–30 м²: Eco, двухместный, трёхместный или семейный номер.",
    },
    gallery: {
      title: "Фотогалерея отеля и номеров — Анталья",
      description: "Посмотрите фотографии стойки регистрации, общих зон и четырёх категорий номеров Mİ Hotel Boutique в Анталье.",
    },
    about: {
      title: "О бутик-отеле в Анталье",
      description: "Узнайте больше о Mİ Hotel Boutique, функциональных номерах и круглосуточной стойке регистрации в центре Антальи.",
    },
    contact: {
      title: "Контакты и расположение — Анталья",
      description: "Адрес и телефон Mİ Hotel Boutique в районе Муратпаша, расположение на Google Картах, а также время заезда и выезда.",
    },
  },
};

const roomLocation: Record<Locale, string> = {
  tr: "Antalya",
  en: "Antalya",
  de: "Antalya",
  ru: "Анталья",
};

const roomDescriptionSuffix: Record<Locale, string> = {
  tr: "Mİ Hotel Boutique'in Antalya Muratpaşa'daki odalarına ait fotoğrafları ve olanakları inceleyin.",
  en: "Explore photos and room amenities at Mİ Hotel Boutique in central Antalya.",
  de: "Sehen Sie Fotos und Ausstattungsmerkmale dieses Zimmers im Mİ Hotel Boutique im Zentrum von Antalya.",
  ru: "Посмотрите фотографии и оснащение этого номера в Mİ Hotel Boutique в центре Антальи.",
};

function socialLocales(locale: Locale) {
  return locales
    .filter((candidate) => candidate !== locale)
    .map((candidate) => getLocaleInfo(candidate).openGraphLocale);
}

function pageCopy(locale: Locale, page: StaticPage) {
  return seoCopy[locale][page];
}

export function createPageMetadata(locale: Locale, page: StaticPage): Metadata {
  const copy = pageCopy(locale, page);
  const path = pagePaths[page];
  const canonical = localizedPath(locale, path);
  const socialTitle = page === "home" ? copy.title : `${copy.title} | ${brandName}`;
  const socialImage = pageSocialImages[page];
  const socialImageMeta = { ...socialImage, alt: socialTitle };

  return {
    title: page === "home" ? { absolute: copy.title } : copy.title,
    description: copy.description,
    robots: searchRobots,
    alternates: {
      canonical,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "website",
      siteName: brandName,
      title: socialTitle,
      description: copy.description,
      url: canonical,
      locale: getLocaleInfo(locale).openGraphLocale,
      alternateLocale: socialLocales(locale),
      images: [socialImageMeta],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: copy.description,
      images: [socialImage.url],
    },
  };
}

export function createRoomMetadata(locale: Locale, room: Room): Metadata {
  const copy = getMessages(locale);
  const path = `/odalar/${room.slug}`;
  const canonical = localizedPath(locale, path);
  const localizedSize = locale === "ru" ? room.size.replace("m²", "м²") : room.size;
  const title = `${room.name} (${localizedSize}) — ${roomLocation[locale]}`;
  const description = `${room.description} ${roomDescriptionSuffix[locale]}`;
  const socialTitle = `${title} | ${brandName}`;

  return {
    title,
    description,
    robots: searchRobots,
    alternates: {
      canonical,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "website",
      siteName: brandName,
      title: socialTitle,
      description,
      url: canonical,
      locale: getLocaleInfo(locale).openGraphLocale,
      alternateLocale: socialLocales(locale),
      images: [{
        url: room.cover,
        width: 1800,
        height: 1200,
        type: "image/webp",
        alt: copy.a11y.roomInterior.replace("{room}", room.name),
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [room.cover],
    },
  };
}

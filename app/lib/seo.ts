import { getLocaleInfo, getMessages, localizedPath, type Locale } from "./i18n";
import {
  getBookingUrl,
  mapsUrl,
  phoneHref,
  phoneNumber,
  type Room,
} from "./site-data";

export const SITE_ORIGIN = "https://mihotelboutique.com";

const HOTEL_ID = `${SITE_ORIGIN}/#hotel`;
const WEBSITE_ID = `${SITE_ORIGIN}/#website`;

export function absoluteUrl(path = "/") {
  return new URL(path, `${SITE_ORIGIN}/`).toString();
}

function localizedUrl(locale: Locale, path = "/") {
  return absoluteUrl(localizedPath(locale, path));
}

function hotelEntity(locale: Locale) {
  const messages = getMessages(locale);

  return {
    "@type": "Hotel",
    "@id": HOTEL_ID,
    name: "Mİ Hotel Boutique",
    url: absoluteUrl("/"),
    mainEntityOfPage: localizedUrl(locale, "/"),
    description: messages.meta.description,
    telephone: phoneHref.replace(/^tel:/, ""),
    logo: absoluteUrl("/brand/mi-hotel-logo.png"),
    image: [
      absoluteUrl("/og.png"),
      absoluteUrl("/images/hotel-reception.webp"),
      absoluteUrl("/images/mi-hotel-exterior.webp"),
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Gençlik, 1330. Sk. No:11D",
      addressLocality: "Muratpaşa",
      addressRegion: "Antalya",
      postalCode: "07100",
      addressCountry: "TR",
    },
    hasMap: mapsUrl,
    checkinTime: "14:00",
    checkoutTime: "12:00",
    amenityFeature: messages.home.services.items.map((item) => ({
      "@type": "LocationFeatureSpecification",
      name: item.title,
      value: true,
    })),
    potentialAction: {
      "@type": "ReserveAction",
      target: getBookingUrl(locale),
      result: {
        "@type": "LodgingReservation",
        name: messages.booking.title,
      },
    },
  };
}

export function createHomeStructuredData(locale: Locale) {
  const messages = getMessages(locale);
  const pageUrl = localizedUrl(locale, "/");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: absoluteUrl("/"),
        name: "Mİ Hotel Boutique",
        description: messages.meta.description,
        inLanguage: ["tr", "en", "de", "ru"],
        publisher: { "@id": HOTEL_ID },
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Mİ Hotel Boutique",
        inLanguage: getLocaleInfo(locale).htmlLang,
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": HOTEL_ID },
        mainEntity: { "@id": HOTEL_ID },
      },
      hotelEntity(locale),
    ],
  };
}

export function createContactStructuredData(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      hotelEntity(locale),
      {
        "@type": "ContactPage",
        "@id": `${localizedUrl(locale, "/konum-iletisim")}#webpage`,
        url: localizedUrl(locale, "/konum-iletisim"),
        name: getMessages(locale).meta.contactTitle,
        mainEntity: { "@id": HOTEL_ID },
        about: { "@id": HOTEL_ID },
      },
    ],
  };
}

export function createRoomStructuredData(locale: Locale, room: Room) {
  const messages = getMessages(locale);
  const path = `/odalar/${room.slug}`;
  const roomUrl = localizedUrl(locale, path);
  const size = Number.parseFloat(room.size);

  return {
    "@context": "https://schema.org",
    "@graph": [
      hotelEntity(locale),
      {
        "@type": "HotelRoom",
        "@id": `${roomUrl}#room`,
        url: roomUrl,
        name: room.name,
        description: room.description,
        image: room.gallery.map((image) => absoluteUrl(image)),
        floorSize: {
          "@type": "QuantitativeValue",
          value: size,
          unitCode: "MTK",
        },
        containedInPlace: { "@id": HOTEL_ID },
        amenityFeature: room.amenities.map((name) => ({
          "@type": "LocationFeatureSpecification",
          name,
          value: true,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${roomUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: messages.detail.home,
            item: localizedUrl(locale, "/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: messages.detail.rooms,
            item: localizedUrl(locale, "/odalar"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: room.name,
            item: roomUrl,
          },
        ],
      },
    ],
  };
}

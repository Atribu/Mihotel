import type { Locale, RoomSlug } from "./i18n";

export type { RoomSlug } from "./i18n";

const bookingBaseUrl = "https://mi-hotel-boutique.rezervasyonal.com/";

const bookingLanguages = {
  tr: "tr",
  en: "en",
  de: "de",
  ru: "ru",
} as const satisfies Record<Locale, string>;

export function getBookingUrl(locale: Locale) {
  const url = new URL(bookingBaseUrl);
  url.searchParams.set("language", bookingLanguages[locale]);
  return url.toString();
}

export const bookingUrl = getBookingUrl("tr");

export const phoneNumber = "+90 242 243 64 64";
export const phoneHref = "tel:+902422436464";
export const hotelAddress = "Gençlik, 1330. Sk. No:11D, 07100 Muratpaşa/Antalya";
export const mapsUrl =
  "https://www.google.com/maps/place//data=!4m2!3m1!1s0x14c39aa695670d83:0x4dba9a93dca87d7a?sa=X&ved=1t:8290&ictx=111";

export function getMapsEmbedUrl(locale: Locale) {
  const url = new URL("https://www.google.com/maps");
  url.searchParams.set("q", hotelAddress);
  url.searchParams.set("output", "embed");
  url.searchParams.set("hl", locale);
  return url.toString();
}

export const mapsEmbedUrl = getMapsEmbedUrl("tr");

export type Room = {
  slug: RoomSlug;
  name: string;
  size: string;
  description: string;
  cover: string;
  gallery: readonly string[];
  amenities: readonly string[];
};

type RoomDetails = Pick<Room, "name" | "description" | "amenities">;
type RoomBase = Omit<Room, keyof RoomDetails>;

const roomBases: readonly RoomBase[] = [
  {
    slug: "eco-oda",
    size: "9 m²",
    cover: "/images/room-eco.webp",
    gallery: [
      "/images/rooms/eco/105-9.webp",
      "/images/rooms/eco/105-1.webp",
      "/images/rooms/eco/105-2.webp",
      "/images/rooms/eco/105-3.webp",
      "/images/rooms/eco/105-4.webp",
      "/images/rooms/eco/105-5.webp",
      "/images/rooms/eco/105-6.webp",
      "/images/rooms/eco/105-7.webp",
      "/images/rooms/eco/105-8.webp",
    ],
  },
  {
    slug: "double-oda",
    size: "11 m²",
    cover: "/images/room-double.webp",
    gallery: [
      "/images/rooms/double/225-6.webp",
      "/images/rooms/double/225-1.webp",
      "/images/rooms/double/225-2.webp",
      "/images/rooms/double/225-3.webp",
      "/images/rooms/double/225-4.webp",
      "/images/rooms/double/225-5.webp",
    ],
  },
  {
    slug: "triple-oda",
    size: "14 m²",
    cover: "/images/room-triple.webp",
    gallery: [
      "/images/rooms/triple/221-4.webp",
      "/images/rooms/triple/221-1.webp",
      "/images/rooms/triple/221-2.webp",
      "/images/rooms/triple/221-3.webp",
      "/images/rooms/triple/221-5.webp",
      "/images/rooms/triple/221-6.webp",
    ],
  },
  {
    slug: "aile-odasi",
    size: "30 m²",
    cover: "/images/room-family.webp",
    gallery: [
      "/images/rooms/family/107-10.webp",
      "/images/rooms/family/107-1.webp",
      "/images/rooms/family/107-2.webp",
      "/images/rooms/family/107-3.webp",
      "/images/rooms/family/107-4.webp",
      "/images/rooms/family/107-5.webp",
      "/images/rooms/family/107-6.webp",
      "/images/rooms/family/107-7.webp",
      "/images/rooms/family/107-8.webp",
      "/images/rooms/family/107-9.webp",
    ],
  },
];

const roomDetails = {
  tr: {
    "eco-oda": {
      name: "Eco Oda",
      description:
        "Kısa süreli şehir konaklamaları için temel ihtiyaçları kompakt ve işlevsel bir düzende sunar.",
      amenities: ["Ücretsiz Wi-Fi", "Oda kasası", "Kettle ve sıcak içecek seti", "Ücretsiz minibar (yalnızca su)", "Terlik, şampuan ve hijyen ürünleri"],
    },
    "double-oda": {
      name: "Double Oda",
      description:
        "İki kişilik konaklamalar için konforu ve işlevselliği kompakt bir alanda bir araya getirir.",
      amenities: ["Ücretsiz Wi-Fi", "Oda kasası", "Kettle ve sıcak içecek seti", "Ücretsiz minibar (yalnızca su)", "Terlik, şampuan ve hijyen ürünleri"],
    },
    "triple-oda": {
      name: "Triple Oda",
      description:
        "Birlikte seyahat eden misafirler için daha geniş ve işlevsel bir kullanım alanı sunar.",
      amenities: ["Ücretsiz Wi-Fi", "Oda kasası", "Kettle ve sıcak içecek seti", "Ücretsiz minibar (yalnızca su)", "Terlik, şampuan ve hijyen ürünleri"],
    },
    "aile-odasi": {
      name: "Aile Odası",
      description:
        "Aile konaklamalarında rahat hareket alanı ve birlikte konaklama kolaylığı sunar.",
      amenities: ["Ücretsiz Wi-Fi", "Oda kasası", "Kettle ve sıcak içecek seti", "Ücretsiz minibar (yalnızca su)", "Terlik, şampuan ve hijyen ürünleri"],
    },
  },
  en: {
    "eco-oda": {
      name: "Eco Room",
      description:
        "A thoughtfully arranged, space-efficient room for short stays in Antalya.",
      amenities: ["Complimentary Wi-Fi", "In-room safe", "Kettle and hot-drink facilities", "Complimentary minibar (water only)", "Slippers, shampoo and toiletries"],
    },
    "double-oda": {
      name: "Double Room",
      description: "A comfortable, efficiently arranged room designed for two guests.",
      amenities: ["Complimentary Wi-Fi", "In-room safe", "Kettle and hot-drink facilities", "Complimentary minibar (water only)", "Slippers, shampoo and toiletries"],
    },
    "triple-oda": {
      name: "Triple Room",
      description: "A practical, well-planned room offering added space for guests travelling together.",
      amenities: ["Complimentary Wi-Fi", "In-room safe", "Kettle and hot-drink facilities", "Complimentary minibar (water only)", "Slippers, shampoo and toiletries"],
    },
    "aile-odasi": {
      name: "Family Room",
      description: "A generously sized room offering families the comfort of staying together.",
      amenities: ["Complimentary Wi-Fi", "In-room safe", "Kettle and hot-drink facilities", "Complimentary minibar (water only)", "Slippers, shampoo and toiletries"],
    },
  },
  de: {
    "eco-oda": {
      name: "Eco-Zimmer",
      description:
        "Ein kompakt und durchdacht eingerichtetes Zimmer für kurze Aufenthalte in Antalya.",
      amenities: ["Kostenloses WLAN", "Zimmersafe", "Wasserkocher und Heißgetränke-Set", "Kostenfreie Minibar (nur Wasser)", "Hausschuhe, Shampoo und Pflegeprodukte"],
    },
    "double-oda": {
      name: "Doppelzimmer",
      description:
        "Ein komfortabel und effizient eingerichtetes Zimmer für zwei Gäste.",
      amenities: ["Kostenloses WLAN", "Zimmersafe", "Wasserkocher und Heißgetränke-Set", "Kostenfreie Minibar (nur Wasser)", "Hausschuhe, Shampoo und Pflegeprodukte"],
    },
    "triple-oda": {
      name: "Dreibettzimmer",
      description: "Ein praktisch geschnittenes Zimmer mit zusätzlichem Platz für gemeinsam reisende Gäste.",
      amenities: ["Kostenloses WLAN", "Zimmersafe", "Wasserkocher und Heißgetränke-Set", "Kostenfreie Minibar (nur Wasser)", "Hausschuhe, Shampoo und Pflegeprodukte"],
    },
    "aile-odasi": {
      name: "Familienzimmer",
      description: "Ein großzügig geschnittenes Zimmer für komfortable gemeinsame Aufenthalte mit der Familie.",
      amenities: ["Kostenloses WLAN", "Zimmersafe", "Wasserkocher und Heißgetränke-Set", "Kostenfreie Minibar (nur Wasser)", "Hausschuhe, Shampoo und Pflegeprodukte"],
    },
  },
  ru: {
    "eco-oda": {
      name: "Номер Eco",
      description:
        "Лаконичный и функциональный номер для комфортного отдыха во время короткой поездки.",
      amenities: ["Бесплатный Wi‑Fi", "Сейф в номере", "Чайник и набор для горячих напитков", "Бесплатный мини-бар (только вода)", "Тапочки, шампунь и средства гигиены"],
    },
    "double-oda": {
      name: "Двухместный номер",
      description: "Компактный номер со всем необходимым для комфортного проживания вдвоём.",
      amenities: ["Бесплатный Wi‑Fi", "Сейф в номере", "Чайник и набор для горячих напитков", "Бесплатный мини-бар (только вода)", "Тапочки, шампунь и средства гигиены"],
    },
    "triple-oda": {
      name: "Трёхместный номер",
      description: "Комфортное пространство для гостей, путешествующих вместе.",
      amenities: ["Бесплатный Wi‑Fi", "Сейф в номере", "Чайник и набор для горячих напитков", "Бесплатный мини-бар (только вода)", "Тапочки, шампунь и средства гигиены"],
    },
    "aile-odasi": {
      name: "Семейный номер",
      description: "Просторный номер для комфортного семейного проживания.",
      amenities: ["Бесплатный Wi‑Fi", "Сейф в номере", "Чайник и набор для горячих напитков", "Бесплатный мини-бар (только вода)", "Тапочки, шампунь и средства гигиены"],
    },
  },
} as const satisfies Record<Locale, Record<RoomSlug, RoomDetails>>;

function createRooms(locale: Locale): readonly Room[] {
  return roomBases.map((room) => ({
    ...room,
    ...roomDetails[locale][room.slug],
  }));
}

const roomsByLocale = {
  tr: createRooms("tr"),
  en: createRooms("en"),
  de: createRooms("de"),
  ru: createRooms("ru"),
} satisfies Record<Locale, readonly Room[]>;

export function getRooms(locale: Locale) {
  return roomsByLocale[locale];
}

export const rooms = getRooms("tr");

export function getRoomBySlug(slug: string, locale: Locale = "tr") {
  return getRooms(locale).find((room) => room.slug === slug);
}

export const faqs = [
  {
    question: "Giriş ve çıkış saatleri nedir?",
    answer:
      "Standart giriş saati 14:00, standart çıkış saati ise 12:00'dir.",
  },
  {
    question: "Erken giriş yapılabilir mi?",
    answer:
      "Erken giriş talepleri otelin müsaitliğine bağlı olarak değerlendirilir; önceden kesin saat veya garanti verilemez.",
  },
  {
    question: "Wi-Fi ücretli mi?",
    answer: "Wi-Fi otelin tüm alanlarında ücretsizdir.",
  },
  {
    question: "Minibarda hangi ürünler bulunuyor?",
    answer:
      "Minibar ücretsizdir ve yalnızca ücretsiz su içerir.",
  },
  {
    question: "Resepsiyona nasıl ulaşabilirim?",
    answer:
      "Resepsiyon 7/24 hizmet vermektedir. Oda telefonundan 0'ı tuşlayarak resepsiyona ulaşabilirsiniz.",
  },
  {
    question: "Ek hizmetler mevcut mu?",
    answer:
      "Oda servisi mevcuttur. Çamaşırhane hizmeti ek ücret karşılığında sunulur.",
  },
] as const;

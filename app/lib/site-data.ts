export const bookingUrl =
  "https://mi-hotel-boutique.rezervasyonal.com/?language=tr";

export const phoneNumber = "+90 242 243 64 64";
export const phoneHref = "tel:+902422436464";
export const hotelAddress = "Gençlik, 1330. Sk. No:11D, 07100 Muratpaşa/Antalya";
export const mapsUrl =
  "https://www.google.com/maps/place//data=!4m2!3m1!1s0x14c39aa695670d83:0x4dba9a93dca87d7a?sa=X&ved=1t:8290&ictx=111";
export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(hotelAddress)}&output=embed`;

export type Room = {
  slug: string;
  name: string;
  size: string;
  description: string;
  cover: string;
  gallery: readonly string[];
  amenities: readonly string[];
};

export const rooms: readonly Room[] = [
  {
    slug: "eco-oda",
    name: "Eco Oda",
    size: "9 m²",
    description:
      "Kısa şehir konaklamaları için yalın, işlevsel ve özenli bir dinlenme alanı.",
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
    amenities: ["Ücretsiz Wi-Fi", "Kasa", "Kettle", "Minibar", "Özel banyo"],
  },
  {
    slug: "double-oda",
    name: "Double Oda",
    size: "11 m²",
    description:
      "İki kişilik konaklamalarda ihtiyaç duyulan konforu kompakt bir düzende sunar.",
    cover: "/images/room-double.webp",
    gallery: [
      "/images/rooms/double/225-6.webp",
      "/images/rooms/double/225-1.webp",
      "/images/rooms/double/225-2.webp",
      "/images/rooms/double/225-3.webp",
      "/images/rooms/double/225-4.webp",
      "/images/rooms/double/225-5.webp",
    ],
    amenities: ["Ücretsiz Wi-Fi", "Kasa", "Kettle", "Minibar", "Terlik"],
  },
  {
    slug: "triple-oda",
    name: "Triple Oda",
    size: "14 m²",
    description:
      "Birlikte seyahat eden misafirler için daha geniş kullanım alanına sahip oda seçeneği.",
    cover: "/images/room-triple.webp",
    gallery: [
      "/images/rooms/triple/221-4.webp",
      "/images/rooms/triple/221-1.webp",
      "/images/rooms/triple/221-2.webp",
      "/images/rooms/triple/221-3.webp",
      "/images/rooms/triple/221-5.webp",
      "/images/rooms/triple/221-6.webp",
    ],
    amenities: ["Ücretsiz Wi-Fi", "Kasa", "Kettle", "Minibar", "Hijyen seti"],
  },
  {
    slug: "aile-odasi",
    name: "Aile Odası",
    size: "30 m²",
    description:
      "Ailece yapılan seyahatlerde rahat hareket alanı ve birlikte konaklama kolaylığı.",
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
    amenities: ["Ücretsiz Wi-Fi", "Kasa", "Kettle", "Minibar", "Geniş alan"],
  },
];

export function getRoomBySlug(slug: string) {
  return rooms.find((room) => room.slug === slug);
}

export const faqs = [
  {
    question: "Giriş ve çıkış saatleri nedir?",
    answer:
      "Standart giriş saati 14:00, standart çıkış saati 12:00'dir.",
  },
  {
    question: "Erken giriş yapılabilir mi?",
    answer:
      "Erken giriş, otelin müsaitlik durumuna bağlı olarak sağlanabilir ve önceden garanti edilemez.",
  },
  {
    question: "Wi-Fi ücretli mi?",
    answer: "Wi-Fi otelin tüm alanlarında ücretsiz olarak kullanılabilir.",
  },
  {
    question: "Minibar kullanımı ücretli mi?",
    answer:
      "Minibar ücretsizdir ve içerisinde misafirlerimiz için ücretsiz su bulunmaktadır.",
  },
  {
    question: "Resepsiyona nasıl ulaşabilirim?",
    answer:
      "Resepsiyon 7/24 hizmet verir. Otel içerisinden oda telefonunda 0 tuşlayarak ulaşabilirsiniz.",
  },
  {
    question: "Ek hizmetler mevcut mu?",
    answer:
      "Room service hizmeti bulunmaktadır. Çamaşırhane hizmeti ise ekstra ücretlidir.",
  },
] as const;

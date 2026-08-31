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
    cover: "/images/room-eco.jpg",
    gallery: [
      "/images/room-eco.jpg",
      "/images/room-eco-detail.jpg",
      "/images/room-eco-bath.jpg",
    ],
    amenities: ["Ücretsiz Wi-Fi", "Kasa", "Kettle", "Minibar", "Özel banyo"],
  },
  {
    slug: "double-oda",
    name: "Double Oda",
    size: "11 m²",
    description:
      "İki kişilik konaklamalarda ihtiyaç duyulan konforu kompakt bir düzende sunar.",
    cover: "/images/room-double.jpg",
    gallery: [
      "/images/room-double.jpg",
      "/images/room-double-detail.jpg",
      "/images/room-double-bath.jpg",
    ],
    amenities: ["Ücretsiz Wi-Fi", "Kasa", "Kettle", "Minibar", "Terlik"],
  },
  {
    slug: "triple-oda",
    name: "Triple Oda",
    size: "14 m²",
    description:
      "Birlikte seyahat eden misafirler için daha geniş kullanım alanına sahip oda seçeneği.",
    cover: "/images/room-triple.jpg",
    gallery: [
      "/images/room-triple.jpg",
      "/images/room-triple-detail.jpg",
      "/images/room-triple-bath.jpg",
    ],
    amenities: ["Ücretsiz Wi-Fi", "Kasa", "Kettle", "Minibar", "Hijyen seti"],
  },
  {
    slug: "aile-odasi",
    name: "Aile Odası",
    size: "30 m²",
    description:
      "Ailece yapılan seyahatlerde rahat hareket alanı ve birlikte konaklama kolaylığı.",
    cover: "/images/room-family.jpg",
    gallery: [
      "/images/room-family.jpg",
      "/images/room-family-detail.jpg",
      "/images/room-family-bath.jpg",
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

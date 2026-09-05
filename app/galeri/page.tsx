import type { Metadata } from "next";
import { HotelGallery, type HotelGalleryItem } from "../components/HotelGallery";
import { ImagePageHero } from "../components/ImagePageHero";
import { SectionWave } from "../components/SectionWave";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { rooms } from "../lib/site-data";

export const metadata: Metadata = {
  title: "Galeri",
  description:
    "Mİ Hotel Boutique ortak alanlarını, Eco, Double, Triple ve Aile odalarını fotoğraflarla keşfedin.",
};

const hotelPhotoDescriptions = [
  "Bitkili duvar ve beyaz merdiven",
  "Otel dış cephesi ve giriş",
  "Koridordaki duvar resmi",
  "Lobi oturma alanı",
  "Dekoratif at ve kanatlı figür kabartması",
  "Aydınlık otel koridoru",
  "Resepsiyon yanındaki oturma alanı ve duvar kabartması",
  "Geniş resepsiyon görünümü",
  "Lobi ve resepsiyon alanı",
  "Bitkilerle ayrılmış koridor ve oturma alanı",
  "Resepsiyon bankosu",
  "Lobi oturma alanı ve koridorlar",
  "Beyaz merdiven ve sarkıt aydınlatmalar",
] as const;

const hotelImages: readonly HotelGalleryItem[] = hotelPhotoDescriptions.map((description, index) => ({
  id: `hotel-${index + 1}`,
  src: `/images/gallery/hotel/genel-${String(index + 1).padStart(2, "0")}.webp`,
  category: "hotel",
  categoryLabel: "Otel & Ortak Alanlar",
  caption: description,
  alt: `Mİ Hotel Boutique — ${description.toLocaleLowerCase("tr-TR")}`,
}));

const roomImages: readonly HotelGalleryItem[] = rooms.flatMap((room) =>
  room.gallery.map((src, index) => ({
    id: `${room.slug}-${index + 1}`,
    src,
    category: room.slug,
    categoryLabel: room.name,
    caption: `${room.name} · ${index + 1} / ${room.gallery.length}`,
    alt: `${room.name} iç mekân görünümü ${index + 1} / ${room.gallery.length}`,
  })),
);

const galleryItems = [...hotelImages, ...roomImages];
const galleryCategories = [
  { id: "all", label: "Tümü" },
  { id: "hotel", label: "Otel & Ortak Alanlar" },
  ...rooms.map((room) => ({ id: room.slug, label: room.name })),
] as const;

export default function GalleryPage() {
  return (
    <>
      <SiteHeader overlay activePage="gallery" />
      <main className="reference-home reference-inner-page gallery-page">
        <ImagePageHero
          id="gallery-page-title"
          eyebrow="Galeri"
          title="Otelimizi ve odalarımızı"
          italic="yakından keşfedin."
          description="Mİ Hotel Boutique'in ortak alanlarından dört farklı oda tipine kadar tüm fotoğraflarını inceleyin."
          image="/images/gallery/hotel/genel-08.webp"
          imageAlt="Mİ Hotel Boutique lobi ve resepsiyon alanı"
          variant="gallery"
        />

        <div className="gallery-page__body shell">
          <HotelGallery items={galleryItems} categories={galleryCategories} />
        </div>

        <SectionWave from="paper" to="footer" mirrored />
      </main>
      <SiteFooter />
    </>
  );
}

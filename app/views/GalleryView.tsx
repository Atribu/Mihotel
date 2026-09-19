import { HotelGallery, type HotelGalleryItem } from "../components/HotelGallery";
import { ImagePageHero } from "../components/ImagePageHero";
import { SectionWave } from "../components/SectionWave";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import {
  getMessages,
  interpolate,
  type Locale,
} from "../lib/i18n";
import { getRooms } from "../lib/site-data";
import { hotelGalleryImages, hotelImages } from "../lib/hotel-images";
import { getRoomGalleryImage } from "../lib/room-images";

export function GalleryView({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const copy = messages.gallery;
  const rooms = getRooms(locale);

  const hotelItems: readonly HotelGalleryItem[] = hotelGalleryImages.map(
    (image, index) => ({
      ...image,
      category: "hotel",
      categoryLabel: copy.hotel,
      caption: copy.hotelDescriptions[index],
      alt: `Mİ Hotel Boutique — ${copy.hotelDescriptions[index]}`,
    }),
  );

  const roomImages: readonly HotelGalleryItem[] = rooms.flatMap((room) =>
    room.gallery.map((src, index) => ({
      id: `${room.slug}-${index + 1}`,
      ...getRoomGalleryImage(src),
      category: room.slug,
      categoryLabel: room.name,
      caption: interpolate(copy.roomCaption, {
        room: room.name,
        index: index + 1,
        count: room.gallery.length,
      }),
      alt: interpolate(copy.roomAlt, {
        room: room.name,
        index: index + 1,
        count: room.gallery.length,
      }),
    })),
  );

  const galleryItems = [...hotelItems, ...roomImages];
  const galleryCategories = [
    { id: "all", label: copy.all },
    { id: "hotel", label: copy.hotel },
    ...rooms.map((room) => ({ id: room.slug, label: room.name })),
  ];

  return (
    <>
      <SiteHeader locale={locale} currentPath="/galeri" overlay activePage="gallery" />
      <main className="reference-home reference-inner-page gallery-page" lang={locale}>
        <ImagePageHero
          id="gallery-page-title"
          eyebrow={copy.heroEyebrow}
          title={copy.heroTitle}
          italic={copy.heroItalic}
          description={copy.heroText}
          image={hotelImages.lobby.src}
          imageSrcSet={hotelImages.lobby.srcSet}
          imageAlt={copy.heroAlt}
          imageWidth={hotelImages.lobby.width}
          imageHeight={hotelImages.lobby.height}
          variant="gallery"
        />

        <div className="gallery-page__body shell">
          <HotelGallery locale={locale} items={galleryItems} categories={galleryCategories} />
        </div>

        <SectionWave from="paper" to="footer" mirrored />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}

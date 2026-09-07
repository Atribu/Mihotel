import Link from "next/link";
import {
  Bath,
  Check,
  Clock3,
  Coffee,
  ConciergeBell,
  Droplets,
  Maximize2,
  Refrigerator,
  ShieldCheck,
  Shirt,
  Sparkles,
  Wifi,
} from "lucide-react";
import { notFound } from "next/navigation";
import { BookingWidget } from "../components/BookingWidget";
import { RoomGallery } from "../components/RoomGallery";
import { SectionWave } from "../components/SectionWave";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import {
  getMessages,
  interpolate,
  localizedPath,
  type Locale,
} from "../lib/i18n";
import { getRoomBySlug, getRooms } from "../lib/site-data";

const amenityIcons = [
  Wifi,
  ShieldCheck,
  Coffee,
  Refrigerator,
  Droplets,
  Sparkles,
  Bath,
  ConciergeBell,
  Shirt,
  Clock3,
] as const;

export function RoomDetailView({ locale, slug }: { locale: Locale; slug: string }) {
  const messages = getMessages(locale);
  const copy = messages.detail;
  const rooms = getRooms(locale);
  const room = getRoomBySlug(slug, locale);

  if (!room) notFound();

  const otherRooms = rooms.filter((item) => item.slug !== room.slug);
  const detailItems = Array.from(
    new Set([...room.amenities, ...copy.extraItems]),
  );
  const currentPath = `/odalar/${room.slug}`;

  return (
    <>
      <SiteHeader locale={locale} currentPath={currentPath} activePage="rooms" />
      <main className="room-reference" lang={locale}>
        <section className="room-reference__intro shell">
          <nav className="room-reference__breadcrumb" aria-label={messages.a11y.breadcrumb}>
            <Link href={localizedPath(locale, "/")}>{copy.home}</Link>
            <span aria-hidden="true">›</span>
            <Link href={localizedPath(locale, "/odalar")}>{copy.rooms}</Link>
            <span aria-hidden="true">›</span>
            <span>{room.name}</span>
          </nav>

          <div className="room-reference__heading">
            <div>
              <p>Mİ Hotel Boutique</p>
              <h1>{room.name}</h1>
              <span>{room.description}</span>
            </div>
            <Link href={localizedPath(locale, "/odalar")}>{copy.viewAll}</Link>
          </div>

          <div className="room-reference__quick-facts" aria-label={messages.a11y.roomQuickFacts}>
            <span>
              <Maximize2 aria-hidden="true" size={17} strokeWidth={1.45} />
              {room.size}
            </span>
            <span>
              <Wifi aria-hidden="true" size={17} strokeWidth={1.45} />
              {copy.wifi}
            </span>
            <span>
              <Refrigerator aria-hidden="true" size={17} strokeWidth={1.45} />
              {copy.minibarWater}
            </span>
          </div>
        </section>

        <RoomGallery locale={locale} roomName={room.name} images={room.gallery} />

        <section className="room-reference__amenities shell" aria-label={messages.a11y.roomAmenities}>
          {amenityIcons.map((Icon, index) => {
            const label = copy.verifiedAmenities[index];
            return (
              <div key={label}>
                <Icon aria-hidden="true" size={22} strokeWidth={1.35} />
                <span>{label}</span>
              </div>
            );
          })}
        </section>

        <SectionWave from="paper" to="warm" />

        <section className="room-reference__details">
          <div className="room-reference__details-inner shell">
            <article className="room-reference__about">
              <p className="room-reference__eyebrow">{copy.about}</p>
              <h2>{interpolate(copy.experience, { room: room.name })}</h2>
              <p>{room.description} {copy.bodySuffix}</p>
              <ul>
                {detailItems.map((item) => (
                  <li key={item}>
                    <Check aria-hidden="true" size={15} strokeWidth={1.7} />
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <aside className="room-reference__booking" aria-label={messages.a11y.roomBookingSearch}>
              <p>{copy.bookingEyebrow}</p>
              <h2>{copy.bookingTitle}</h2>
              <span>{copy.bookingText}</span>
              <BookingWidget locale={locale} />
              <small>{copy.times}</small>
            </aside>
          </div>
        </section>

        <SectionWave from="warm" to="paper" mirrored />

        <section className="room-reference__recommendations shell" aria-labelledby="other-rooms-title">
          <div className="room-reference__section-heading">
            <div>
              <p className="room-reference__eyebrow">{copy.other}</p>
              <h2 id="other-rooms-title">{copy.recommendations}</h2>
            </div>
            <Link href={localizedPath(locale, "/odalar")}>{copy.allRooms}</Link>
          </div>

          <div className="room-reference__recommendation-grid">
            {otherRooms.map((item) => (
              <article key={item.slug}>
                <Link href={localizedPath(locale, `/odalar/${item.slug}`)}>
                  <img
                    src={item.cover}
                    alt={interpolate(messages.a11y.roomOverview, { room: item.name })}
                    loading="lazy"
                  />
                </Link>
                <div>
                  <h3>
                    <Link href={localizedPath(locale, `/odalar/${item.slug}`)}>{item.name}</Link>
                  </h3>
                  <span>{item.size}</span>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <SectionWave from="paper" to="footer" />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}

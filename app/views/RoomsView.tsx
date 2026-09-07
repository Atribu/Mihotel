import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Coffee,
  Headphones,
  Maximize2,
  ShieldCheck,
  Wifi,
} from "lucide-react";
import { BookingWidget } from "../components/BookingWidget";
import { SectionWave } from "../components/SectionWave";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import {
  getMessages,
  interpolate,
  localizedPath,
  type Locale,
} from "../lib/i18n";
import { getRooms } from "../lib/site-data";

const perkIcons = [Clock3, Wifi, Coffee, Headphones] as const;

export function RoomsView({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const copy = messages.catalog;
  const rooms = getRooms(locale);

  return (
    <>
      <SiteHeader locale={locale} currentPath="/odalar" overlay activePage="rooms" />
      <main className="reference-home rooms-catalog" lang={locale}>
        <section className="reference-hero rooms-catalog__hero">
          <img
            src="/images/room-family.webp"
            alt={copy.heroAlt}
            width={1800}
            height={1200}
            loading="eager"
            fetchPriority="high"
          />
          <div className="rooms-catalog__hero-veil" />
          <div className="rooms-catalog__hero-copy shell">
            <p className="reference-kicker reference-kicker--light">Mİ Hotel Boutique</p>
            <h1>{copy.heroTitle}</h1>
            <span>{copy.heroText}</span>
          </div>
          <section
            className="reference-hero__booking rooms-catalog__booking"
            id="rezervasyon"
            aria-label={messages.a11y.bookingSearch}
          >
            <BookingWidget locale={locale} />
          </section>
        </section>

        <nav className="rooms-catalog__filters shell" aria-label={messages.a11y.roomTypes}>
          <a className="is-active" href="#tum-odalar">
            <ShieldCheck aria-hidden="true" size={18} strokeWidth={1.5} />
            {copy.all}
          </a>
          {rooms.map((room) => (
            <a href={`#${room.slug}`} key={room.slug}>
              <span aria-hidden="true">◇</span>
              {room.name}
            </a>
          ))}
        </nav>

        <section
          className="rooms-catalog__list shell"
          id="tum-odalar"
          aria-label={messages.a11y.hotelRoomOptions}
        >
          {rooms.map((room, index) => (
            <article
              className={`rooms-catalog-card${index === rooms.length - 1 ? " rooms-catalog-card--wide" : ""}`}
              id={room.slug}
              key={room.slug}
            >
              <Link
                className="rooms-catalog-card__image"
                href={localizedPath(locale, `/odalar/${room.slug}`)}
                aria-label={interpolate(messages.a11y.roomDetails, { room: room.name })}
              >
                <img
                  src={room.cover}
                  alt={interpolate(messages.a11y.roomOverview, { room: room.name })}
                  loading="lazy"
                  decoding="async"
                />
              </Link>
              <div className="rooms-catalog-card__body">
                <p className="rooms-catalog-card__label">{copy.roomLabel}</p>
                <h2>{room.name}</h2>
                <div
                  className="rooms-catalog-card__facts"
                  aria-label={interpolate(messages.a11y.roomShortFacts, { room: room.name })}
                >
                  <span>
                    <Maximize2 aria-hidden="true" size={14} strokeWidth={1.5} />
                    {room.size}
                  </span>
                  <span>
                    <Wifi aria-hidden="true" size={14} strokeWidth={1.5} />
                    {copy.wifi}
                  </span>
                </div>
                <p>{room.description}</p>
                <Link
                  className="rooms-catalog-card__link"
                  href={localizedPath(locale, `/odalar/${room.slug}`)}
                >
                  {copy.details}
                  <ArrowRight aria-hidden="true" size={15} strokeWidth={1.5} />
                </Link>
              </div>
            </article>
          ))}
        </section>

        <SectionWave from="paper" to="warm" />

        <section className="rooms-catalog__perks" aria-label={messages.a11y.stayBenefits}>
          <div className="shell">
            {perkIcons.map((Icon, index) => {
              const perk = copy.perks[index];
              return (
                <article key={perk.title}>
                  <Icon aria-hidden="true" size={27} strokeWidth={1.35} />
                  <div>
                    <h2>{perk.title}</h2>
                    <p>{perk.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <SectionWave from="warm" to="footer" mirrored />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}

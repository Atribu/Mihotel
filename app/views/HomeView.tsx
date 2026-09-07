import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  BellRing,
  Clock3,
  Coffee,
  GlassWater,
  Ruler,
  ShieldCheck,
  UtensilsCrossed,
  WashingMachine,
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

const serviceVisuals = [
  { image: "/images/hotel-reception.webp", Icon: Clock3 },
  { image: "/images/hotel-lounge.webp", Icon: Wifi },
  { image: "/images/room-eco-detail.webp", Icon: GlassWater },
  { image: "/images/hotel-seating.webp", Icon: UtensilsCrossed },
  { image: "/images/hotel-corridor.webp", Icon: WashingMachine },
] as const;

const hotelSpaceImages = [
  "/images/hotel-lobby-wide.webp",
  "/images/hotel-lounge.webp",
  "/images/hotel-seating.webp",
  "/images/hotel-stairs.webp",
  "/images/mi-hotel-exterior.webp",
] as const;

const perkIcons = [BellRing, Wifi, Coffee, WashingMachine] as const;

export function HomeView({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const copy = messages.home;
  const rooms = getRooms(locale);

  return (
    <>
      <SiteHeader locale={locale} currentPath="/" overlay activePage="home" />
      <main className="reference-home reference-home--landing" lang={locale}>
        <section className="reference-hero" aria-labelledby="hero-title">
          <img
            className="reference-hero__image"
            src="/images/hero-lobby-relief-clean.webp"
            srcSet="/images/hero-lobby-relief-clean-720.webp 720w, /images/hero-lobby-relief-clean-1280.webp 1280w, /images/hero-lobby-relief-clean.webp 1800w"
            sizes="100vw"
            alt={copy.hero.imageAlt}
            width={1800}
            height={1200}
            loading="eager"
            fetchPriority="high"
          />
          <div className="reference-hero__veil" />
          <div className="reference-hero__content shell">
            <p className="reference-kicker reference-kicker--light">{copy.hero.eyebrow}</p>
            <h1 id="hero-title">{copy.hero.title} <br /><em>{copy.hero.italic}</em></h1>
            <p>{copy.hero.description}</p>
            <a className="reference-button reference-button--glass" href="#deneyimler">
              {copy.hero.cta}
            </a>
          </div>
          <div className="reference-hero__booking">
            <BookingWidget locale={locale} />
          </div>
        </section>

        <section className="reference-experiences" id="deneyimler" aria-labelledby="experiences-title">
          <div className="shell">
            <ReferenceHeading
              eyebrow={copy.services.eyebrow}
              title={copy.services.title}
              italic={copy.services.italic}
              id="experiences-title"
            />
            <div className="reference-experiences__grid">
              {serviceVisuals.map(({ image, Icon }, index) => {
                const item = copy.services.items[index];
                return (
                  <article className="reference-experience" key={image}>
                    <div className="reference-experience__image">
                      <img src={image} alt="" loading="lazy" decoding="async" />
                    </div>
                    <span className="reference-experience__icon" aria-hidden="true">
                      <Icon size={18} strokeWidth={1.45} />
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <SectionWave from="paper" to="warm" />

        <div className="reference-gallery-band">
          <section className="reference-tour reference-gallery-promo" aria-labelledby="gallery-promo-title">
            <div className="reference-tour__image">
              <img
                src="/images/hotel-lobby-wide.webp"
                alt={copy.gallery.imageAlt}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="reference-tour__copy">
              <p className="reference-kicker">{copy.gallery.eyebrow}</p>
              <h2 id="gallery-promo-title">{copy.gallery.title}<br /><em>{copy.gallery.italic}</em></h2>
              <p>{copy.gallery.description}</p>
              <Link className="reference-button reference-button--gold" href={localizedPath(locale, "/galeri")}>
                {copy.gallery.cta}
              </Link>
            </div>
          </section>
        </div>

        <SectionWave from="warm" to="paper" mirrored />

        <section className="reference-rooms shell" aria-labelledby="rooms-title">
          <div className="reference-section-heading reference-section-heading--split">
            <div>
              <p className="reference-kicker">{copy.rooms.eyebrow}</p>
              <h2 id="rooms-title">{copy.rooms.title} <em>{copy.rooms.italic}</em></h2>
            </div>
            <Link href={localizedPath(locale, "/odalar")}>
              {copy.rooms.all} <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>

          <div className="reference-room-showcase">
            <article className="reference-featured-room">
              <Link className="reference-featured-room__image" href={localizedPath(locale, "/odalar")}>
                <img
                  src="/images/room-family.webp"
                  alt={copy.rooms.imageAlt}
                  loading="lazy"
                  decoding="async"
                />
                <span>{copy.rooms.featuredLabel}</span>
              </Link>
              <div className="reference-featured-room__body">
                <h3>{copy.rooms.featuredTitle}</h3>
                <p>{copy.rooms.featuredText}</p>
                <Link className="reference-outline-button" href={localizedPath(locale, "/odalar")}>
                  {copy.rooms.cta}
                </Link>
                <div className="reference-room-meta" aria-label={messages.a11y.hotelRoomOptions}>
                  <span><BedDouble size={14} />{copy.rooms.count}</span>
                  <span><Ruler size={14} />9–30 m²</span>
                  <span><Wifi size={14} />{copy.rooms.wifi}</span>
                  <span><ShieldCheck size={14} />{copy.rooms.safe}</span>
                </div>
              </div>
            </article>

            <div className="reference-compact-rooms">
              {rooms.map((room) => (
                <article className="reference-compact-room" key={room.slug}>
                  <Link
                    href={localizedPath(locale, `/odalar/${room.slug}`)}
                    className="reference-compact-room__image"
                  >
                    <img
                      src={room.cover}
                      alt={interpolate(messages.a11y.roomInterior, { room: room.name })}
                      loading="lazy"
                      decoding="async"
                    />
                  </Link>
                  <div>
                    <h3>{room.name}</h3>
                    <p>{room.description}</p>
                    <span><Ruler size={12} aria-hidden="true" />{room.size}</span>
                    <Link href={localizedPath(locale, `/odalar/${room.slug}`)}>{copy.rooms.inspect}</Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <SectionWave from="paper" to="soft" />

        <section className="reference-perks" aria-label={messages.a11y.hotelServices}>
          <div className="shell">
            {perkIcons.map((Icon, index) => {
              const item = copy.perks[index];
              return (
                <div className="reference-perk" key={item.title}>
                  <Icon aria-hidden="true" size={25} strokeWidth={1.35} />
                  <span><strong>{item.title}</strong><small>{item.text}</small></span>
                </div>
              );
            })}
          </div>
        </section>

        <SectionWave from="soft" to="paper" mirrored />

        <section className="reference-about" aria-labelledby="about-title">
          <div className="reference-about__image">
            <img
              src="/images/hotel-reception.webp"
              alt={copy.about.imageAlt}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="reference-about__copy">
            <p className="reference-kicker">{copy.about.eyebrow}</p>
            <h2 id="about-title">{copy.about.title}<br /><em>{copy.about.italic}</em></h2>
            <p>{copy.about.text}</p>
            <Link className="reference-outline-button" href={localizedPath(locale, "/hakkimizda")}>
              {copy.about.cta}
            </Link>
          </div>
        </section>

        <SectionWave from="paper" to="soft" />

        <section className="reference-spaces" id="galeri" aria-labelledby="spaces-title">
          <div className="shell">
            <ReferenceHeading
              eyebrow={copy.spaces.eyebrow}
              title={copy.spaces.title}
              italic={copy.spaces.italic}
              id="spaces-title"
            />
            <div className="reference-spaces__grid">
              {hotelSpaceImages.map((image, index) => {
                const item = copy.spaces.items[index];
                return (
                  <article key={image}>
                    <img
                      src={image}
                      alt={`${item.title} — ${item.text}`}
                      loading="lazy"
                      decoding="async"
                    />
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <SectionWave from="soft" to="footer" mirrored />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}

function ReferenceHeading({
  eyebrow,
  title,
  italic,
  id,
}: {
  eyebrow: string;
  title: string;
  italic: string;
  id: string;
}) {
  return (
    <div className="reference-section-heading">
      <p className="reference-kicker">{eyebrow}</p>
      <h2 id={id}>{title} <em>{italic}</em></h2>
    </div>
  );
}

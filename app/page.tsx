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
import { BookingWidget } from "./components/BookingWidget";
import { SectionWave } from "./components/SectionWave";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { rooms } from "./lib/site-data";

const experiences = [
  {
    title: "7/24 Resepsiyon",
    description: "Günün her saati ihtiyaçlarınıza yardımcı olan ekip.",
    image: "/images/hotel-reception.webp",
    Icon: Clock3,
  },
  {
    title: "Ücretsiz Wi-Fi",
    description: "Otelin tüm alanlarında kesintisiz internet erişimi.",
    image: "/images/hotel-lounge.webp",
    Icon: Wifi,
  },
  {
    title: "Minibar Suyu",
    description: "Odanızdaki minibar suyu konaklamanıza dahildir.",
    image: "/images/room-eco-detail.webp",
    Icon: GlassWater,
  },
  {
    title: "Room Service",
    description: "Konaklamanızı kolaylaştıran oda servisi hizmeti.",
    image: "/images/hotel-seating.webp",
    Icon: UtensilsCrossed,
  },
  {
    title: "Çamaşırhane",
    description: "Talebiniz doğrultusunda sunulan ücretli hizmet.",
    image: "/images/hotel-corridor.webp",
    Icon: WashingMachine,
  },
] as const;

const hotelSpaces = [
  ["/images/hotel-lobby-wide.webp", "Resepsiyon", "Karşılama alanı"],
  ["/images/hotel-lounge.webp", "Lobi", "Dinlenme alanı"],
  ["/images/hotel-seating.webp", "Oturma Alanı", "Sakin bir mola"],
  ["/images/hotel-stairs.webp", "Ortak Alanlar", "Otelin detayları"],
  ["/images/mi-hotel-exterior.webp", "Mİ Hotel", "Muratpaşa, Antalya"],
] as const;

export default function Home() {
  return (
    <>
      <SiteHeader overlay activePage="home" />
      <main className="reference-home reference-home--landing">
        <section className="reference-hero" aria-labelledby="hero-title">
          <img
            className="reference-hero__image"
            src="/images/hero-lobby-relief-clean.webp"
            srcSet="/images/hero-lobby-relief-clean-720.webp 720w, /images/hero-lobby-relief-clean-1280.webp 1280w, /images/hero-lobby-relief-clean.webp 1800w"
            sizes="100vw"
            alt="Mİ Hotel Boutique mitolojik kabartmalı lobi ve resepsiyon alanı"
            width={1800}
            height={1200}
            loading="eager"
            fetchPriority="high"
          />
          <div className="reference-hero__veil" />
          <div className="reference-hero__content shell">
            <p className="reference-kicker reference-kicker--light">Antalya&apos;nın kalbinde</p>
            <h1 id="hero-title">Konforu hissedin, <br /><em>hikâyenizi yaşayın.</em></h1>
            <p>Mİ Hotel Boutique&apos;te sade konfor, özenli hizmet ve şehir hayatının enerjisi bir araya geliyor.</p>
            <a className="reference-button reference-button--glass" href="#deneyimler">
              Mİ Hotel&apos;i keşfedin
            </a>
          </div>
          <div className="reference-hero__booking">
            <BookingWidget />
          </div>
        </section>

        <section className="reference-experiences" id="deneyimler" aria-labelledby="experiences-title">
          <div className="shell">
            <ReferenceHeading eyebrow="Otel hizmetleri" title="Konforunuz için" italic="yanınızda." id="experiences-title" />
            <div className="reference-experiences__grid">
              {experiences.map(({ title, description, image, Icon }) => (
                <article className="reference-experience" key={title}>
                  <div className="reference-experience__image">
                    <img src={image} alt="" loading="lazy" decoding="async" />
                  </div>
                  <span className="reference-experience__icon" aria-hidden="true">
                    <Icon size={18} strokeWidth={1.45} />
                  </span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <SectionWave from="paper" to="warm" />

        <div className="reference-gallery-band">
          <section className="reference-tour reference-gallery-promo" aria-labelledby="gallery-promo-title">
            <div className="reference-tour__image">
              <img
                src="/images/hotel-lobby-wide.webp"
                alt="Mİ Hotel Boutique lobi ve resepsiyon alanı"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="reference-tour__copy">
              <p className="reference-kicker">Otel galerisi</p>
              <h2 id="gallery-promo-title">Mİ Hotel&apos;i<br /><em>yakından keşfedin.</em></h2>
              <p>Ortak alanlarımızı ve dört farklı oda tipimizi fotoğraflarla inceleyin.</p>
              <Link className="reference-button reference-button--gold" href="/galeri">Tüm fotoğrafları gör</Link>
            </div>
          </section>
        </div>

        <SectionWave from="warm" to="paper" mirrored />

        <section className="reference-rooms shell" aria-labelledby="rooms-title">
          <div className="reference-section-heading reference-section-heading--split">
            <div>
              <p className="reference-kicker">Odalarımız</p>
              <h2 id="rooms-title">Konforunuz için <em>tasarlandı.</em></h2>
            </div>
            <Link href="/odalar">Tüm odaları incele <ArrowRight size={14} aria-hidden="true" /></Link>
          </div>

          <div className="reference-room-showcase">
            <article className="reference-featured-room">
              <Link className="reference-featured-room__image" href="/odalar">
                <img
                  src="/images/room-family.webp"
                  alt="Mİ Hotel Boutique oda seçenekleri"
                  loading="lazy"
                  decoding="async"
                />
                <span>Odalarımız</span>
              </Link>
              <div className="reference-featured-room__body">
                <h3>Mİ Hotel Odaları</h3>
                <p>Eco, Double, Triple ve Aile odalarımız arasından konaklamanıza uygun seçeneği keşfedin.</p>
                <Link className="reference-outline-button" href="/odalar">Odaları incele</Link>
                <div className="reference-room-meta" aria-label="Mİ Hotel oda bilgileri">
                  <span><BedDouble size={14} />4 oda tipi</span>
                  <span><Ruler size={14} />9–30 m²</span>
                  <span><Wifi size={14} />Ücretsiz Wi-Fi</span>
                  <span><ShieldCheck size={14} />Kasa</span>
                </div>
              </div>
            </article>

            <div className="reference-compact-rooms">
              {rooms.map((room) => (
                <article className="reference-compact-room" key={room.slug}>
                  <Link href={`/odalar/${room.slug}`} className="reference-compact-room__image">
                    <img
                      src={room.cover}
                      alt={`${room.name} iç mekânı`}
                      loading="lazy"
                      decoding="async"
                    />
                  </Link>
                  <div>
                    <h3>{room.name}</h3>
                    <p>{room.description}</p>
                    <span><Ruler size={12} aria-hidden="true" />{room.size}</span>
                    <Link href={`/odalar/${room.slug}`}>İncele</Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <SectionWave from="paper" to="soft" />

        <section className="reference-perks" aria-label="Otel hizmet bilgileri">
          <div className="shell">
            {[
              { Icon: BellRing, title: "7/24 Resepsiyon", text: "Her an yanınızdayız." },
              { Icon: Wifi, title: "Ücretsiz Wi-Fi", text: "Tüm otel alanlarında." },
              { Icon: Coffee, title: "Ücretsiz Su", text: "Odanızdaki minibarda." },
              { Icon: WashingMachine, title: "Çamaşırhane", text: "Talebe bağlı ücretli hizmet." },
            ].map(({ Icon, title, text }) => (
              <div className="reference-perk" key={title}>
                <Icon aria-hidden="true" size={25} strokeWidth={1.35} />
                <span><strong>{title}</strong><small>{text}</small></span>
              </div>
            ))}
          </div>
        </section>

        <SectionWave from="soft" to="paper" mirrored />

        <section className="reference-about" aria-labelledby="about-title">
          <div className="reference-about__image">
            <img
              src="/images/hotel-reception.webp"
              alt="Mİ Hotel Boutique resepsiyon alanı"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="reference-about__copy">
            <p className="reference-kicker">Hakkımızda</p>
            <h2 id="about-title">Sadelik ve konforun<br /><em>buluşma noktası.</em></h2>
            <p>Aydınlık ortak alanlar, işlevsel odalar ve günün her saati yanınızda olan bir ekip. Antalya konaklamanız için özenli ve kolay bir deneyim.</p>
            <Link className="reference-outline-button" href="/hakkimizda">Daha fazlasını keşfedin</Link>
          </div>
        </section>

        <SectionWave from="paper" to="soft" />

        <section className="reference-spaces" id="galeri" aria-labelledby="spaces-title">
          <div className="shell">
            <ReferenceHeading eyebrow="Mİ Hotel'i keşfedin" title="Otelin" italic="detayları." id="spaces-title" />
            <div className="reference-spaces__grid">
              {hotelSpaces.map(([image, title, description]) => (
                <article key={title}>
                  <img
                    src={image}
                    alt={`${title} — ${description}`}
                    loading="lazy"
                    decoding="async"
                  />
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <SectionWave from="soft" to="footer" mirrored />
      </main>
      <SiteFooter />
    </>
  );
}

function ReferenceHeading({ eyebrow, title, italic, id }: { eyebrow: string; title: string; italic: string; id: string }) {
  return (
    <div className="reference-section-heading">
      <p className="reference-kicker">{eyebrow}</p>
      <h2 id={id}>{title} <em>{italic}</em></h2>
    </div>
  );
}

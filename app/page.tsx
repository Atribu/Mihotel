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
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { rooms } from "./lib/site-data";

const experiences = [
  {
    title: "7/24 Resepsiyon",
    description: "Günün her saati ihtiyaçlarınıza yardımcı olan ekip.",
    image: "/images/hotel-reception.jpg",
    Icon: Clock3,
  },
  {
    title: "Ücretsiz Wi-Fi",
    description: "Otelin tüm alanlarında kesintisiz internet erişimi.",
    image: "/images/hotel-lounge.jpg",
    Icon: Wifi,
  },
  {
    title: "Minibar Suyu",
    description: "Odanızdaki minibar suyu konaklamanıza dahildir.",
    image: "/images/room-eco-detail.jpg",
    Icon: GlassWater,
  },
  {
    title: "Room Service",
    description: "Konaklamanızı kolaylaştıran oda servisi hizmeti.",
    image: "/images/hotel-seating.jpg",
    Icon: UtensilsCrossed,
  },
  {
    title: "Çamaşırhane",
    description: "Talebiniz doğrultusunda sunulan ücretli hizmet.",
    image: "/images/hotel-corridor.jpg",
    Icon: WashingMachine,
  },
] as const;

const hotelSpaces = [
  ["/images/hotel-lobby-wide.jpg", "Resepsiyon", "Karşılama alanı"],
  ["/images/hotel-lounge.jpg", "Lobi", "Dinlenme alanı"],
  ["/images/hotel-seating.jpg", "Oturma Alanı", "Sakin bir mola"],
  ["/images/hotel-stairs.jpg", "Ortak Alanlar", "Otelin detayları"],
  ["/images/mi-hotel-exterior.jpg", "Mİ Hotel", "Muratpaşa, Antalya"],
] as const;

export default function Home() {
  return (
    <>
      <SiteHeader overlay activePage="home" />
      <main className="reference-home reference-home--landing">
        <section className="reference-hero" aria-labelledby="hero-title">
          <img
            className="reference-hero__image"
            src="/images/mi-hotel-exterior.jpg"
            alt="Mİ Hotel Boutique dış cephesi"
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
                    <img src={image} alt="" />
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

        <SectionWave tone="gallery" />

        <div className="reference-gallery-band">
          <section className="reference-tour reference-gallery-promo" aria-labelledby="gallery-promo-title">
            <div className="reference-tour__image">
              <img src="/images/hotel-lobby-wide.jpg" alt="Mİ Hotel Boutique lobi ve resepsiyon alanı" />
            </div>
            <div className="reference-tour__copy">
              <p className="reference-kicker">Otel galerisi</p>
              <h2 id="gallery-promo-title">Mİ Hotel&apos;i<br /><em>yakından keşfedin.</em></h2>
              <p>Ortak alanlarımızı ve dört farklı oda tipimizi fotoğraflarla inceleyin.</p>
              <Link className="reference-button reference-button--gold" href="/galeri">Tüm fotoğrafları gör</Link>
            </div>
          </section>
        </div>

        <SectionWave tone="gallery-paper" mirrored />

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
                <img src="/images/room-family.jpg" alt="Mİ Hotel Boutique oda seçenekleri" />
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
                    <img src={room.cover} alt={`${room.name} iç mekânı`} />
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

        <SectionWave tone="soft" />

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

        <SectionWave tone="paper" mirrored />

        <section className="reference-about" aria-labelledby="about-title">
          <div className="reference-about__image">
            <img src="/images/hotel-reception.jpg" alt="Mİ Hotel Boutique resepsiyon alanı" />
          </div>
          <div className="reference-about__copy">
            <p className="reference-kicker">Hakkımızda</p>
            <h2 id="about-title">Sadelik ve konforun<br /><em>buluşma noktası.</em></h2>
            <p>Aydınlık ortak alanlar, işlevsel odalar ve günün her saati yanınızda olan bir ekip. Antalya konaklamanız için özenli ve kolay bir deneyim.</p>
            <Link className="reference-outline-button" href="/hakkimizda">Daha fazlasını keşfedin</Link>
          </div>
        </section>

        <SectionWave tone="soft" />

        <section className="reference-spaces" id="galeri" aria-labelledby="spaces-title">
          <div className="shell">
            <ReferenceHeading eyebrow="Mİ Hotel'i keşfedin" title="Otelin" italic="detayları." id="spaces-title" />
            <div className="reference-spaces__grid">
              {hotelSpaces.map(([image, title, description]) => (
                <article key={title}>
                  <img src={image} alt={`${title} — ${description}`} />
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <SectionWave tone="footer" mirrored />
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

function SectionWave({
  tone,
  mirrored = false,
}: {
  tone: "gallery" | "gallery-paper" | "soft" | "paper" | "footer";
  mirrored?: boolean;
}) {
  return (
    <div
      className={`reference-section-wave reference-section-wave--${tone}${mirrored ? " reference-section-wave--mirrored" : ""}`}
      aria-hidden="true"
    />
  );
}

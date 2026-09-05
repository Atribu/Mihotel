import type { Metadata } from "next";
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
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { rooms } from "../lib/site-data";

export const metadata: Metadata = {
  title: "Odalar",
  description:
    "Mİ Hotel Boutique Eco, Double, Triple ve Aile Odası seçeneklerini keşfedin.",
};

const catalogPerks = [
  {
    icon: Clock3,
    title: "7/24 Resepsiyon",
    text: "İhtiyaç duyduğunuz her an yanınızdayız.",
  },
  {
    icon: Wifi,
    title: "Ücretsiz Wi-Fi",
    text: "Otelin tüm alanlarında kesintisiz bağlantı.",
  },
  {
    icon: Coffee,
    title: "Oda İçi Konfor",
    text: "Kettle, minibar suyu ve sıcak içecek seti.",
  },
  {
    icon: Headphones,
    title: "Misafir Hizmetleri",
    text: "Room service ve ücretli çamaşırhane hizmeti.",
  },
] as const;

export default function RoomsPage() {
  return (
    <>
      <SiteHeader overlay activePage="rooms" />
      <main className="reference-home rooms-catalog">
        <section className="rooms-catalog__hero">
          <img
            src="/images/room-family.webp"
            alt="Mİ Hotel Boutique Aile Odası"
            width={1800}
            height={1200}
            loading="eager"
            fetchPriority="high"
          />
          <div className="rooms-catalog__hero-veil" />
          <div className="rooms-catalog__hero-copy shell">
            <p className="reference-kicker reference-kicker--light">Mİ Hotel Boutique</p>
            <h1>Odalarımız</h1>
            <span>
              Her detayı dinlenmeniz için düşünülen dört farklı oda seçeneğini
              keşfedin.
            </span>
          </div>
        </section>

        <section
          className="rooms-catalog__booking shell"
          id="rezervasyon"
          aria-label="Rezervasyon arama"
        >
          <BookingWidget />
        </section>

        <nav className="rooms-catalog__filters shell" aria-label="Oda tipleri">
          <a className="is-active" href="#tum-odalar">
            <ShieldCheck aria-hidden="true" size={18} strokeWidth={1.5} />
            Tüm Odalar
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
          aria-label="Mİ Hotel Boutique oda seçenekleri"
        >
          {rooms.map((room, index) => (
            <article
              className={`rooms-catalog-card${index === rooms.length - 1 ? " rooms-catalog-card--wide" : ""}`}
              id={room.slug}
              key={room.slug}
            >
              <Link
                className="rooms-catalog-card__image"
                href={`/odalar/${room.slug}`}
                aria-label={`${room.name} detaylarını görüntüle`}
              >
                <img
                  src={room.cover}
                  alt={`${room.name} genel görünümü`}
                  loading="lazy"
                  decoding="async"
                />
              </Link>
              <div className="rooms-catalog-card__body">
                <p className="rooms-catalog-card__label">Oda</p>
                <h2>{room.name}</h2>
                <div className="rooms-catalog-card__facts" aria-label={`${room.name} kısa bilgiler`}>
                  <span>
                    <Maximize2 aria-hidden="true" size={14} strokeWidth={1.5} />
                    {room.size}
                  </span>
                  <span>
                    <Wifi aria-hidden="true" size={14} strokeWidth={1.5} />
                    Ücretsiz Wi-Fi
                  </span>
                </div>
                <p>{room.description}</p>
                <Link className="rooms-catalog-card__link" href={`/odalar/${room.slug}`}>
                  Detayları incele
                  <ArrowRight aria-hidden="true" size={15} strokeWidth={1.5} />
                </Link>
              </div>
            </article>
          ))}
        </section>

        <section className="rooms-catalog__perks" aria-label="Konaklama ayrıcalıkları">
          <div className="shell">
            {catalogPerks.map(({ icon: Icon, title, text }) => (
              <article key={title}>
                <Icon aria-hidden="true" size={27} strokeWidth={1.35} />
                <div>
                  <h2>{title}</h2>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { BookingWidget } from "../components/BookingWidget";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { bookingUrl, rooms } from "../lib/site-data";

export const metadata: Metadata = {
  title: "Odalar",
  description:
    "Mİ Hotel Boutique Eco, Double, Triple ve Aile Odası seçeneklerini keşfedin.",
};

export default function RoomsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero page-hero--rooms">
          <div className="shell page-hero__inner">
            <p className="eyebrow">Mİ Hotel Boutique</p>
            <h1>Odalarımız</h1>
            <p>
              Yalnız seyahatlerden aile konaklamalarına kadar farklı ihtiyaçlara göre
              şekillenen dört oda seçeneği.
            </p>
          </div>
        </section>

        <section className="booking-panel shell" id="rezervasyon" aria-label="Rezervasyon arama">
          <BookingWidget />
        </section>

        <section className="room-list section shell" aria-label="Oda tipleri">
          {rooms.map((room, index) => (
            <article className={`room-detail${index % 2 ? " room-detail--reverse" : ""}`} key={room.name}>
              <div className="room-detail__gallery">
                <img className="room-detail__main" src={room.gallery[0]} alt={`${room.name} genel görünümü`} loading="lazy" />
                <img src={room.gallery[1]} alt={`${room.name} oda detayı`} loading="lazy" />
                <img src={room.gallery[2]} alt={`${room.name} banyo alanı`} loading="lazy" />
              </div>
              <div className="room-detail__copy">
                <p className="eyebrow">{room.size}</p>
                <h2>{room.name}</h2>
                <p className="lead-copy">{room.description}</p>
                <div className="chip-list">
                  {room.amenities.map((amenity) => (
                    <span className="chip" key={amenity}>{amenity}</span>
                  ))}
                </div>
                <p className="room-detail__note">
                  Tüm odalarda terlik, şampuan ve temel hijyen ürünleri sunulur. Minibardaki su ücretsizdir.
                </p>
                <div className="room-detail__actions">
                  <Link className="text-link" href={`/odalar/${room.slug}`}>
                    Odayı incele <span aria-hidden="true">→</span>
                  </Link>
                  <a className="button button--gold" href={bookingUrl} target="_blank" rel="noreferrer">
                    Müsaitliği Gör
                  </a>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

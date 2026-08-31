import { BookingWidget } from "./components/BookingWidget";
import { RoomCard } from "./components/RoomCard";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { bookingUrl, faqs, rooms } from "./lib/site-data";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <img
            className="hero__image"
            src="/images/mi-hotel-exterior.jpg"
            alt="Mİ Hotel Boutique giriş cephesi"
          />
          <div className="hero__veil" />
          <div className="hero__content shell">
            <p className="eyebrow eyebrow--light">Modern butik konaklama</p>
            <h1 id="hero-title">Şehrin ritminde, evinizin huzurunda.</h1>
            <p className="hero__lead">
              Mİ Hotel Boutique; sade odaları, günün her saati yanınızda olan
              resepsiyonu ve özenli hizmetleriyle konforlu bir mola sunar.
            </p>
          </div>
          <div className="hero__booking shell">
            <BookingWidget />
          </div>
        </section>

        <section className="intro-section section shell">
          <div className="intro-section__copy">
            <p className="eyebrow">Mİ Hotel Boutique</p>
            <h2>Şehrin temposuna kısa bir ara.</h2>
            <p className="lead-copy">
              Aydınlık ortak alanlar, sade odalar ve ihtiyaç duyduğunuz anda yanınızda
              olan bir ekip. Mİ Hotel Boutique, konaklamanızı kolaylaştıran temel
              ayrıntıları yalın bir deneyimde buluşturur.
            </p>
            <LinkButton href="/hakkimizda" label="Otelimizi keşfedin" />
          </div>
          <div className="intro-section__media image-frame">
            <img src="/images/hotel-reception.jpg" alt="Mİ Hotel Boutique resepsiyon alanı" loading="lazy" />
          </div>
        </section>

        <section className="amenities-strip" aria-label="Otel hizmetleri">
          <div className="amenities-strip__inner shell">
            {[
              ["7/24", "Resepsiyon"],
              ["Ücretsiz", "Wi-Fi"],
              ["Dahil", "Minibar suyu"],
              ["Mevcut", "Room service"],
            ].map(([value, label]) => (
              <div className="amenity-stat" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section rooms-preview shell" aria-labelledby="rooms-title">
          <div className="section-heading section-heading--split">
            <div>
              <p className="eyebrow">Odalarımız</p>
              <h2 id="rooms-title">Her yolculuğa uygun bir oda.</h2>
            </div>
            <p>
              Eco, Double, Triple ve Aile Odası seçeneklerimizle yalnız seyahatlerden
              aile konaklamalarına kadar farklı ihtiyaçlara alan açıyoruz.
            </p>
          </div>
          <div className="rooms-grid">
            {rooms.map((room, index) => (
              <RoomCard key={room.name} room={room} featured={index === 0 || index === 3} />
            ))}
          </div>
        </section>

        <section className="gallery-section section" aria-labelledby="gallery-title">
          <div className="section-heading section-heading--center shell">
            <p className="eyebrow">Otel deneyimi</p>
            <h2 id="gallery-title">Aydınlık, sade ve size hazır.</h2>
          </div>
          <div className="gallery-grid shell">
            <img src="/images/hotel-stairs.jpg" alt="Otel merdiven ve ortak alanı" loading="lazy" />
            <img src="/images/hotel-lounge.jpg" alt="Otel dinlenme alanı" loading="lazy" />
            <img src="/images/hotel-seating.jpg" alt="Otel lobi oturma alanı" loading="lazy" />
          </div>
        </section>

        <section className="section faq-section shell" aria-labelledby="faq-title">
          <div className="section-heading">
            <p className="eyebrow">Bilmeniz gerekenler</p>
            <h2 id="faq-title">Konaklamadan önce.</h2>
          </div>
          <div className="faq-list">
            {faqs.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="booking-cta">
          <div className="booking-cta__inner shell">
            <div>
              <p className="eyebrow eyebrow--light">Doğrudan rezervasyon</p>
              <h2>Konaklamanızı birkaç adımda planlayın.</h2>
            </div>
            <a className="button button--light" href={bookingUrl} target="_blank" rel="noreferrer">
              Rezervasyona Başla
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function LinkButton({ href, label }: { href: string; label: string }) {
  return (
    <a className="text-link" href={href}>
      {label} <span aria-hidden="true">→</span>
    </a>
  );
}

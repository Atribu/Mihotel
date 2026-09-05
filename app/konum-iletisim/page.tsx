import type { Metadata } from "next";
import { ImagePageHero } from "../components/ImagePageHero";
import { SectionWave } from "../components/SectionWave";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { hotelAddress, mapsEmbedUrl, mapsUrl, phoneHref, phoneNumber } from "../lib/site-data";

export const metadata: Metadata = {
  title: "Konum ve İletişim",
  description: `Mİ Hotel Boutique adresi: ${hotelAddress}. İletişim ve yol tarifi bilgileri.`,
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader overlay activePage="contact" />
      <main className="reference-home reference-inner-page contact-page">
        <ImagePageHero
          id="contact-page-title"
          eyebrow="Konum & İletişim"
          title="Konaklamanız için"
          italic="temel bilgiler."
          description="Giriş, çıkış ve resepsiyon hizmetleri hakkında ihtiyaç duyacağınız bilgiler burada."
          image="/images/mi-hotel-exterior.webp"
          imageAlt="Mİ Hotel Boutique dış cephesi"
          variant="contact"
        />

        <section className="contact-layout section shell">
          <div className="contact-map">
            <iframe
              src={mapsEmbedUrl}
              title={`Google Maps üzerinde Mİ Hotel Boutique — ${hotelAddress}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="contact-cards">
            <article className="info-card">
              <span className="info-card__number">14:00</span>
              <h2>Giriş saati</h2>
              <p>Erken giriş, otelin müsaitlik durumuna göre sağlanabilir ve önceden garanti edilemez.</p>
            </article>
            <article className="info-card">
              <span className="info-card__number">12:00</span>
              <h2>Çıkış saati</h2>
              <p>Standart çıkış saatimiz 12:00&apos;dir.</p>
            </article>
            <article className="info-card info-card--dark">
              <span className="info-card__number">7/24</span>
              <h2>Resepsiyon</h2>
              <p>Otel içerisinden oda telefonunda 0 tuşlayarak resepsiyona ulaşabilirsiniz.</p>
            </article>
          </div>
        </section>

        <SectionWave from="paper" to="warm" />

        <div className="contact-page__closing">
          <section className="contact-pending shell">
            <div>
              <p className="reference-kicker">Adres &amp; Yol Tarifi</p>
              <h2>Mİ Hotel Boutique’a ulaşın.</h2>
              <address>{hotelAddress}</address>
              <a className="contact-phone-link" href={phoneHref}>{phoneNumber}</a>
            </div>
            <a className="reference-button reference-button--gold" href={mapsUrl} target="_blank" rel="noreferrer">
              Yol Tarifi Al
            </a>
          </section>
        </div>

        <SectionWave from="warm" to="footer" mirrored />
      </main>
      <SiteFooter />
    </>
  );
}

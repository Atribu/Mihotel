import type { Metadata } from "next";
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
      <SiteHeader />
      <main>
        <section className="page-hero page-hero--center">
          <div className="shell page-hero__inner">
            <p className="eyebrow">Konum &amp; İletişim</p>
            <h1>Konaklamanız için temel bilgiler.</h1>
            <p>Giriş, çıkış ve resepsiyon hizmetleri hakkında ihtiyaç duyacağınız bilgiler burada.</p>
          </div>
        </section>

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

        <section className="contact-pending shell">
          <div>
            <p className="eyebrow">Adres &amp; Yol Tarifi</p>
            <h2>Mİ Hotel Boutique’a ulaşın.</h2>
            <address>{hotelAddress}</address>
            <a className="contact-phone-link" href={phoneHref}>{phoneNumber}</a>
          </div>
          <a className="button button--gold" href={mapsUrl} target="_blank" rel="noreferrer">
            Yol Tarifi Al
          </a>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

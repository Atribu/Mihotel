import { ImagePageHero } from "../components/ImagePageHero";
import { SectionWave } from "../components/SectionWave";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { getMessages, interpolate, type Locale } from "../lib/i18n";
import {
  hotelAddress,
  getMapsEmbedUrl,
  mapsUrl,
  phoneHref,
  phoneNumber,
} from "../lib/site-data";

export function ContactView({ locale }: { locale: Locale }) {
  const copy = getMessages(locale).contact;
  const mapsEmbedUrl = getMapsEmbedUrl(locale);

  return (
    <>
      <SiteHeader locale={locale} currentPath="/konum-iletisim" overlay activePage="contact" />
      <main className="reference-home reference-inner-page contact-page" lang={locale}>
        <ImagePageHero
          id="contact-page-title"
          eyebrow={copy.heroEyebrow}
          title={copy.heroTitle}
          italic={copy.heroItalic}
          description={copy.heroText}
          image="/images/mi-hotel-exterior.webp"
          imageAlt={copy.heroAlt}
          variant="contact"
        />

        <section className="contact-layout section shell">
          <div className="contact-map">
            <iframe
              src={mapsEmbedUrl}
              title={interpolate(copy.mapTitle, { address: hotelAddress })}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="contact-cards">
            <article className="info-card">
              <span className="info-card__number">14:00</span>
              <h2>{copy.checkInTitle}</h2>
              <p>{copy.checkInText}</p>
            </article>
            <article className="info-card">
              <span className="info-card__number">12:00</span>
              <h2>{copy.checkOutTitle}</h2>
              <p>{copy.checkOutText}</p>
            </article>
            <article className="info-card info-card--dark">
              <span className="info-card__number">7/24</span>
              <h2>{copy.receptionTitle}</h2>
              <p>{copy.receptionText}</p>
            </article>
          </div>
        </section>

        <SectionWave from="paper" to="warm" />

        <div className="contact-page__closing">
          <section className="contact-pending shell">
            <div>
              <p className="reference-kicker">{copy.addressEyebrow}</p>
              <h2>{copy.addressTitle}</h2>
              <address>{hotelAddress}</address>
              <a className="contact-phone-link" href={phoneHref}>{phoneNumber}</a>
            </div>
            <a className="reference-button reference-button--gold" href={mapsUrl} target="_blank" rel="noreferrer">
              {copy.directions}
            </a>
          </section>
        </div>

        <SectionWave from="warm" to="footer" mirrored />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}

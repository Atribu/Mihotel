import { ImagePageHero } from "../components/ImagePageHero";
import { SectionWave } from "../components/SectionWave";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { getMessages, type Locale } from "../lib/i18n";
import { hotelImages } from "../lib/hotel-images";

export function AboutView({ locale }: { locale: Locale }) {
  const copy = getMessages(locale).about;

  return (
    <>
      <SiteHeader locale={locale} currentPath="/hakkimizda" overlay activePage="about" />
      <main className="reference-home reference-inner-page about-page" lang={locale}>
        <ImagePageHero
          id="about-page-title"
          eyebrow={copy.heroEyebrow}
          title={copy.heroTitle}
          italic={copy.heroItalic}
          description={copy.heroText}
          image={hotelImages.reception.src}
          imageSrcSet={hotelImages.reception.srcSet}
          imageAlt={copy.imageAlts[0]}
          imageWidth={hotelImages.reception.width}
          imageHeight={hotelImages.reception.height}
          variant="about"
        />

        <section className="about-feature shell">
          <img
            {...hotelImages.lobbyWide}
            sizes="100vw"
            alt={copy.imageAlts[0]}
            loading="lazy"
            decoding="async"
          />
        </section>

        <section className="section about-story shell">
          <div>
            <p className="reference-kicker">{copy.approachEyebrow}</p>
            <h2>{copy.approachTitle} <em>{copy.approachItalic}</em></h2>
          </div>
          <div className="about-story__copy">
            {copy.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </section>

        <SectionWave from="paper" to="warm" />

        <section className="values-section section">
          <div className="shell">
            <div className="section-heading section-heading--center">
              <p className="reference-kicker">{copy.valuesEyebrow}</p>
              <h2>{copy.valuesTitle} <em>{copy.valuesItalic}</em></h2>
            </div>
            <div className="values-grid">
              {copy.values.map((value, index) => (
                <article className="value-card" key={value.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{value.title}</h3>
                  <p>{value.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <SectionWave from="warm" to="paper" mirrored />

        <section className="about-gallery section shell">
          <img {...hotelImages.corridor} sizes="(max-width: 700px) 100vw, 50vw" alt={copy.imageAlts[1]} loading="lazy" decoding="async" />
          <img {...hotelImages.stairs} sizes="(max-width: 700px) 100vw, 50vw" alt={copy.imageAlts[2]} loading="lazy" decoding="async" />
        </section>

        <SectionWave from="paper" to="footer" />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}

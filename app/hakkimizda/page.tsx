import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Mİ Hotel Boutique'in sade konaklama yaklaşımını ve misafir deneyimini keşfedin.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero page-hero--center">
          <div className="shell page-hero__inner">
            <p className="eyebrow">Hakkımızda</p>
            <h1>Konforu sadeleştiren bir butik otel.</h1>
            <p>
              İyi bir konaklamanın; temiz, düzenli ve ihtiyaçlara cevap veren ayrıntılarla başladığına inanıyoruz.
            </p>
          </div>
        </section>

        <section className="about-feature shell">
          <img src="/images/hotel-lobby-wide.jpg" alt="Mİ Hotel Boutique resepsiyon ve lobi alanı" />
        </section>

        <section className="section about-story shell">
          <div>
            <p className="eyebrow">Yaklaşımımız</p>
            <h2>İhtiyacınız olan her şey, kararında.</h2>
          </div>
          <div className="about-story__copy">
            <p>
              Mİ Hotel Boutique, şehir yolculuklarında dinlenmeyi kolaylaştıran sade bir konaklama deneyimi sunar. Odalarımızda işlevsel çözümler ve temel konfor ayrıntıları bir aradadır.
            </p>
            <p>
              Resepsiyon ekibimiz günün her saati yanınızdadır. Room service, ücretli çamaşırhane ve ücretsiz Wi-Fi gibi hizmetlerle konaklamanız boyunca ihtiyaç duyduğunuz desteği sağlarız.
            </p>
          </div>
        </section>

        <section className="values-section section">
          <div className="shell">
            <div className="section-heading section-heading--center">
              <p className="eyebrow">Mİ deneyimi</p>
              <h2>Üç temel değer.</h2>
            </div>
            <div className="values-grid">
              {[
                ["01", "Sadelik", "Gereksiz ayrıntılardan arınmış, rahat ve anlaşılır alanlar."],
                ["02", "İşlevsellik", "Konaklamayı kolaylaştıran, günlük ihtiyaçlara cevap veren çözümler."],
                ["03", "Misafirperverlik", "Günün her saati ulaşılabilir, ilgili ve çözüm odaklı hizmet."],
              ].map(([number, title, description]) => (
                <article className="value-card" key={title}>
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-gallery section shell">
          <img src="/images/hotel-corridor.jpg" alt="Mİ Hotel Boutique koridoru" loading="lazy" />
          <img src="/images/hotel-stairs.jpg" alt="Mİ Hotel Boutique merdiven alanı" loading="lazy" />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

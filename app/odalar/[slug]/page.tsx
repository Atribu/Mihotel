import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { BookingWidget } from "../../components/BookingWidget";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { getRoomBySlug, rooms } from "../../lib/site-data";

type RoomPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return rooms.map((room) => ({ slug: room.slug }));
}

export async function generateMetadata({ params }: RoomPageProps): Promise<Metadata> {
  const { slug } = await params;
  const room = getRoomBySlug(slug);

  if (!room) {
    return { title: "Oda Bulunamadı" };
  }

  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const protocol = headerList.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const image = new URL(room.cover, `${protocol}://${host}`).toString();
  const description = `${room.name}, ${room.size}. ${room.description}`;

  return {
    title: room.name,
    description,
    openGraph: {
      type: "website",
      title: `${room.name} | Mİ Hotel Boutique`,
      description,
      images: [{ url: image, alt: `${room.name} iç mekânı` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${room.name} | Mİ Hotel Boutique`,
      description,
      images: [image],
    },
  };
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { slug } = await params;
  const room = getRoomBySlug(slug);

  if (!room) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main>
        <section className="room-page-hero">
          <img src={room.cover} alt={`${room.name} genel görünümü`} />
          <div className="room-page-hero__veil" />
          <div className="room-page-hero__content shell">
            <nav className="breadcrumb" aria-label="Sayfa yolu">
              <Link href="/">Ana Sayfa</Link>
              <span aria-hidden="true">/</span>
              <Link href="/odalar">Odalar</Link>
              <span aria-hidden="true">/</span>
              <span>{room.name}</span>
            </nav>
            <p className="eyebrow eyebrow--light">{room.size}</p>
            <h1>{room.name}</h1>
            <p>{room.description}</p>
          </div>
        </section>

        <section className="room-page-intro section shell">
          <div>
            <p className="eyebrow">Oda detayları</p>
            <h2>Şehir konaklamanız için sade ve kullanışlı.</h2>
            <p className="lead-copy">
              Mİ Hotel Boutique’un özenli ve işlevsel yaklaşımını yansıtan {room.name},
              konaklamanız boyunca ihtiyaç duyacağınız temel olanakları bir araya getirir.
            </p>
          </div>
          <div className="room-facts" aria-label="Konaklama bilgileri">
            <div><span>Oda büyüklüğü</span><strong>{room.size}</strong></div>
            <div><span>Giriş</span><strong>14:00</strong></div>
            <div><span>Çıkış</span><strong>12:00</strong></div>
            <div><span>Resepsiyon</span><strong>7/24</strong></div>
          </div>
        </section>

        <section className="room-page-gallery shell" aria-label={`${room.name} fotoğrafları`}>
          {room.gallery.map((image, index) => (
            <img
              src={image}
              alt={`${room.name} ${index === 0 ? "genel görünümü" : index === 1 ? "oda detayı" : "banyo alanı"}`}
              loading={index === 0 ? "eager" : "lazy"}
              key={image}
            />
          ))}
        </section>

        <section className="room-amenities section shell" aria-labelledby="amenities-title">
          <div className="section-heading">
            <p className="eyebrow">Oda olanakları</p>
            <h2 id="amenities-title">Konforunuz için odanızda.</h2>
          </div>
          <div className="room-amenities__grid">
            {room.amenities.map((amenity) => (
              <div key={amenity}><span aria-hidden="true">✓</span>{amenity}</div>
            ))}
            <div><span aria-hidden="true">✓</span>Terlik ve hijyen ürünleri</div>
            <div><span aria-hidden="true">✓</span>Ücretsiz minibar suyu</div>
          </div>
        </section>

        <section className="booking-panel booking-panel--room shell" aria-label="Rezervasyon arama">
          <BookingWidget />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

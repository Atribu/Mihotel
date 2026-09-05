import type { Metadata } from "next";
import Link from "next/link";
import {
  Bath,
  Check,
  Clock3,
  Coffee,
  ConciergeBell,
  Droplets,
  Maximize2,
  Refrigerator,
  ShieldCheck,
  Shirt,
  Sparkles,
  Wifi,
} from "lucide-react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { BookingWidget } from "../../components/BookingWidget";
import { RoomGallery } from "../../components/RoomGallery";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { getRoomBySlug, rooms } from "../../lib/site-data";

type RoomPageProps = {
  params: Promise<{ slug: string }>;
};

const verifiedAmenities = [
  { icon: Wifi, label: "Ücretsiz Wi-Fi" },
  { icon: ShieldCheck, label: "Oda kasası" },
  { icon: Coffee, label: "Kettle" },
  { icon: Refrigerator, label: "Minibar" },
  { icon: Droplets, label: "Ücretsiz su" },
  { icon: Sparkles, label: "Hijyen ürünleri" },
  { icon: Bath, label: "Terlik" },
  { icon: ConciergeBell, label: "Room service" },
  { icon: Shirt, label: "Çamaşırhane" },
  { icon: Clock3, label: "7/24 resepsiyon" },
] as const;

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

  const otherRooms = rooms.filter((item) => item.slug !== room.slug);
  const detailItems = Array.from(
    new Set([
      ...room.amenities,
      "Terlik ve temel hijyen ürünleri",
      "Minibarda ücretsiz su",
      "7/24 resepsiyon desteği",
    ]),
  );

  return (
    <>
      <SiteHeader activePage="rooms" />
      <main className="room-reference">
        <section className="room-reference__intro shell">
          <nav className="room-reference__breadcrumb" aria-label="Sayfa yolu">
            <Link href="/">Ana Sayfa</Link>
            <span aria-hidden="true">›</span>
            <Link href="/odalar">Odalar</Link>
            <span aria-hidden="true">›</span>
            <span>{room.name}</span>
          </nav>

          <div className="room-reference__heading">
            <div>
              <p>Mİ Hotel Boutique</p>
              <h1>{room.name}</h1>
              <span>{room.description}</span>
            </div>
            <Link href="/odalar">Tüm odaları görüntüle</Link>
          </div>

          <div className="room-reference__quick-facts" aria-label="Oda kısa bilgileri">
            <span>
              <Maximize2 aria-hidden="true" size={17} strokeWidth={1.45} />
              {room.size}
            </span>
            <span>
              <Wifi aria-hidden="true" size={17} strokeWidth={1.45} />
              Ücretsiz Wi-Fi
            </span>
            <span>
              <Refrigerator aria-hidden="true" size={17} strokeWidth={1.45} />
              Ücretsiz minibar suyu
            </span>
          </div>
        </section>

        <RoomGallery roomName={room.name} images={room.gallery} />

        <section className="room-reference__amenities shell" aria-label="Oda olanakları">
          {verifiedAmenities.map(({ icon: Icon, label }) => (
            <div key={label}>
              <Icon aria-hidden="true" size={22} strokeWidth={1.35} />
              <span>{label}</span>
            </div>
          ))}
        </section>

        <section className="room-reference__details">
          <div className="room-reference__details-inner shell">
            <article className="room-reference__about">
              <p className="room-reference__eyebrow">Oda hakkında</p>
              <h2>{room.name} deneyimi</h2>
              <p>
                {room.description} Mİ Hotel Boutique’un sade ve işlevsel yaklaşımıyla
                hazırlanan odanızda şehir konaklamanız için gereken temel olanaklar
                bir aradadır.
              </p>
              <ul>
                {detailItems.map((item) => (
                  <li key={item}>
                    <Check aria-hidden="true" size={15} strokeWidth={1.7} />
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <aside className="room-reference__booking" aria-label="Bu oda için rezervasyon arama">
              <p>Doğrudan rezervasyon</p>
              <h2>Konaklamanızı planlayın</h2>
              <span>Güncel fiyat ve müsaitliği güvenli rezervasyon sayfamızda görüntüleyin.</span>
              <BookingWidget />
              <small>Standart giriş 14:00 · Çıkış 12:00</small>
            </aside>
          </div>
        </section>

        <section className="room-reference__recommendations shell" aria-labelledby="other-rooms-title">
          <div className="room-reference__section-heading">
            <div>
              <p className="room-reference__eyebrow">Diğer seçenekler</p>
              <h2 id="other-rooms-title">Bunları da beğenebilirsiniz</h2>
            </div>
            <Link href="/odalar">Tüm odalar</Link>
          </div>

          <div className="room-reference__recommendation-grid">
            {otherRooms.map((item) => (
              <article key={item.slug}>
                <Link href={`/odalar/${item.slug}`}>
                  <img src={item.cover} alt={`${item.name} genel görünümü`} loading="lazy" />
                </Link>
                <div>
                  <h3><Link href={`/odalar/${item.slug}`}>{item.name}</Link></h3>
                  <span>{item.size}</span>
                  <p>{item.description}</p>
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

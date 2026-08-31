import Link from "next/link";
import { ChevronDown, Phone } from "lucide-react";
import { bookingUrl, phoneHref, phoneNumber, rooms } from "../lib/site-data";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner shell">
        <Link className="brand" href="/" aria-label="Mİ Hotel Boutique ana sayfa">
          <img src="/brand/mi-hotel-logo.png" alt="Mİ Hotel Boutique" />
        </Link>

        <nav className="desktop-nav" aria-label="Ana menü">
          <div className="nav-dropdown">
            <Link href="/odalar" aria-haspopup="true">
              Odalar <ChevronDown aria-hidden="true" size={14} strokeWidth={1.8} />
            </Link>
            <div className="nav-dropdown__menu" aria-label="Oda seçenekleri">
              {rooms.map((room) => (
                <Link href={`/odalar/${room.slug}`} key={room.slug}>{room.name}</Link>
              ))}
            </div>
          </div>
          <Link href="/hakkimizda">Hakkımızda</Link>
          <Link href="/konum-iletisim">Konum &amp; İletişim</Link>
        </nav>

        <div className="header-actions">
          <a className="button button--phone" href={phoneHref} aria-label={`${phoneNumber} numarasını ara`}>
            <Phone aria-hidden="true" size={16} strokeWidth={1.9} />
            {phoneNumber}
          </a>
          <a className="button button--gold header-booking" href={bookingUrl} target="_blank" rel="noreferrer">
            Rezervasyon
          </a>
        </div>

        <details className="mobile-menu">
          <summary aria-label="Menüyü aç">Menü</summary>
          <nav aria-label="Mobil menü">
            <Link href="/odalar">Tüm Odalar</Link>
            <div className="mobile-room-links">
              {rooms.map((room) => (
                <Link href={`/odalar/${room.slug}`} key={room.slug}>{room.name}</Link>
              ))}
            </div>
            <Link href="/hakkimizda">Hakkımızda</Link>
            <Link href="/konum-iletisim">Konum &amp; İletişim</Link>
            <a href={phoneHref}>Ara: {phoneNumber}</a>
            <a href={bookingUrl} target="_blank" rel="noreferrer">Rezervasyon</a>
          </nav>
        </details>
      </div>
    </header>
  );
}

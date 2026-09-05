import Link from "next/link";
import { bookingUrl, hotelAddress, phoneHref, phoneNumber } from "../lib/site-data";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__main shell">
        <div className="site-footer__brand">
          <img src="/brand/mi-hotel-logo.png" alt="Mİ Hotel Boutique" />
          <p>Sade, işlevsel ve özenli bir şehir konaklaması.</p>
          <address className="site-footer__contact">
            <span>{hotelAddress}</span>
            <a href={phoneHref}>{phoneNumber}</a>
          </address>
        </div>

        <nav className="site-footer__nav" aria-label="Alt menü">
          <strong>Keşfet</strong>
          <Link href="/">Ana Sayfa</Link>
          <Link href="/odalar">Odalar</Link>
          <Link href="/hakkimizda">Hakkımızda</Link>
          <Link href="/galeri">Galeri</Link>
          <Link href="/konum-iletisim">Konum &amp; İletişim</Link>
        </nav>

        <div className="site-footer__services">
          <strong>Misafir Hizmetleri</strong>
          <span>7/24 resepsiyon</span>
          <span>Ücretsiz Wi-Fi</span>
          <span>Giriş 14:00</span>
          <span>Çıkış 12:00</span>
        </div>

        <div className="site-footer__booking">
          <strong>Konaklamanızı planlayın</strong>
          <p>Güncel müsaitlik ve fiyatlar için güvenli rezervasyon sayfamızı kullanın.</p>
          <a className="text-link" href={bookingUrl} target="_blank" rel="noreferrer">
            Rezervasyona git <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <div className="site-footer__bottom shell">
        <span>© {new Date().getFullYear()} Mİ Hotel Boutique</span>
        <a
          className="site-footer__partner"
          href="https://dgtlface.com/"
          target="_blank"
          rel="noreferrer"
          aria-label="Powered by DGTLFACE — DGTLFACE web sitesini yeni sekmede aç"
        >
          <img
            src="/brand/powered-by-dgtlface-transparent.png"
            alt=""
            width="1588"
            height="237"
          />
        </a>
      </div>
    </footer>
  );
}

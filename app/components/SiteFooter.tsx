import Link from "next/link";
import { bookingUrl } from "../lib/site-data";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__main shell">
        <div className="site-footer__brand">
          <img src="/brand/mi-hotel-logo.png" alt="Mİ Hotel Boutique" />
          <p>Sade, işlevsel ve özenli bir şehir konaklaması.</p>
        </div>

        <nav className="site-footer__nav" aria-label="Alt menü">
          <strong>Keşfet</strong>
          <Link href="/">Ana Sayfa</Link>
          <Link href="/odalar">Odalar</Link>
          <Link href="/hakkimizda">Hakkımızda</Link>
          <Link href="/konum-iletisim">Konum &amp; İletişim</Link>
        </nav>

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
        <span>Resmî rezervasyon Rezervasyonal altyapısıyla tamamlanır.</span>
      </div>
    </footer>
  );
}

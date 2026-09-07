import Link from "next/link";
import { getMessages, localizedPath, type Locale } from "../lib/i18n";
import { getBookingUrl, hotelAddress, phoneHref, phoneNumber } from "../lib/site-data";

function FooterBrandLogo() {
  return (
    <svg
      className="site-footer__brand-logo"
      viewBox="0 0 219 108"
      role="img"
      aria-label="Mİ Hotel Boutique"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter
          id="mi-footer-logo-alpha"
          x="0"
          y="0"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -0.2126 -0.7152 -0.0722 0 1"
          />
        </filter>
      </defs>
      <image
        href="/brand/mi-hotel-logo.png"
        width="219"
        height="108"
        filter="url(#mi-footer-logo-alpha)"
      />
    </svg>
  );
}

export function SiteFooter({ locale = "tr" }: { locale?: Locale }) {
  const messages = getMessages(locale);
  const bookingUrl = getBookingUrl(locale);
  const href = (path: string) => localizedPath(locale, path);

  return (
    <footer className="site-footer" lang={locale}>
      <div className="site-footer__main shell">
        <div className="site-footer__brand">
          <FooterBrandLogo />
          <p>{messages.footer.tagline}</p>
          <address className="site-footer__contact">
            <span>{hotelAddress}</span>
            <a href={phoneHref}>{phoneNumber}</a>
          </address>
        </div>

        <nav className="site-footer__nav" aria-label={messages.a11y.footerMenu}>
          <strong>{messages.footer.explore}</strong>
          <Link href={href("/")}>{messages.nav.home}</Link>
          <Link href={href("/odalar")}>{messages.nav.rooms}</Link>
          <Link href={href("/galeri")}>{messages.nav.gallery}</Link>
          <Link href={href("/konum-iletisim")}>{messages.nav.contact}</Link>
        </nav>

        <div className="site-footer__services">
          <strong>{messages.footer.services}</strong>
          <span>{messages.footer.reception}</span>
          <span>{messages.footer.wifi}</span>
          <span>{messages.footer.checkIn}</span>
          <span>{messages.footer.checkOut}</span>
        </div>

        <div className="site-footer__booking">
          <strong>{messages.footer.plan}</strong>
          <p>{messages.footer.planText}</p>
          <a className="text-link" href={bookingUrl} target="_blank" rel="noreferrer">
            {messages.footer.bookingLink} <span aria-hidden="true">↗</span>
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
          aria-label={messages.a11y.poweredBy}
        >
          <img
            src="/brand/powered-by-dgtlface-transparent.png"
            alt=""
            width="1588"
            height="237"
            loading="lazy"
            decoding="async"
          />
        </a>
      </div>
    </footer>
  );
}

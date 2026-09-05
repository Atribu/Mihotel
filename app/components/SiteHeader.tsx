"use client";

import Link from "next/link";
import { ChevronDown, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { bookingUrl, phoneHref, phoneNumber, rooms } from "../lib/site-data";

type ActivePage = "home" | "rooms" | "about" | "gallery" | "contact";

function TransparentBrandLogo({ light = false }: { light?: boolean }) {
  const filterId = light ? "mi-logo-light" : "mi-logo-dark";
  const colorRows = light
    ? "0 0 0 0 1  0 0 0 0 1  0 0 0 0 1"
    : "0 0 0 0 0  0 0 0 0 0  0 0 0 0 0";

  return (
    <svg
      className="brand__transparent-logo"
      viewBox="0 0 219 108"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id={filterId} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values={`${colorRows}  -0.2126 -0.7152 -0.0722 0 1`}
          />
        </filter>
      </defs>
      <image
        href="/brand/mi-hotel-logo.png"
        width="219"
        height="108"
        filter={`url(#${filterId})`}
      />
    </svg>
  );
}

export function SiteHeader({
  overlay = false,
  activePage,
}: {
  overlay?: boolean;
  activePage?: ActivePage;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 24);

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    window.addEventListener("pageshow", updateHeader);

    return () => {
      window.removeEventListener("scroll", updateHeader);
      window.removeEventListener("pageshow", updateHeader);
    };
  }, []);

  const headerClassName = [
    "site-header",
    overlay ? "site-header--overlay" : "",
    scrolled ? "site-header--scrolled" : "",
    activePage === "home" ? "site-header--home" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClassName}>
      <div className="site-header__inner shell">
        <Link className="brand" href="/" aria-label="Mİ Hotel Boutique ana sayfa">
          <TransparentBrandLogo light={overlay && !scrolled} />
        </Link>

        <nav className="desktop-nav" aria-label="Ana menü">
          <Link href="/" aria-current={activePage === "home" ? "page" : undefined}>Ana Sayfa</Link>
          <div className="nav-dropdown">
            <Link href="/odalar" aria-haspopup="true" aria-current={activePage === "rooms" ? "page" : undefined}>
              Odalar <ChevronDown aria-hidden="true" size={14} strokeWidth={1.8} />
            </Link>
            <div className="nav-dropdown__menu" aria-label="Oda seçenekleri">
              {rooms.map((room) => (
                <Link href={`/odalar/${room.slug}`} key={room.slug}>{room.name}</Link>
              ))}
            </div>
          </div>
          <Link href="/galeri" aria-current={activePage === "gallery" ? "page" : undefined}>Galeri</Link>
          <Link href="/konum-iletisim" aria-current={activePage === "contact" ? "page" : undefined}>Konum &amp; İletişim</Link>
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
            <Link href="/">Ana Sayfa</Link>
            <Link href="/odalar">Tüm Odalar</Link>
            <div className="mobile-room-links">
              {rooms.map((room) => (
                <Link href={`/odalar/${room.slug}`} key={room.slug}>{room.name}</Link>
              ))}
            </div>
            <Link href="/galeri">Galeri</Link>
            <Link href="/konum-iletisim">Konum &amp; İletişim</Link>
            <a href={phoneHref}>Ara: {phoneNumber}</a>
            <a href={bookingUrl} target="_blank" rel="noreferrer">Rezervasyon</a>
          </nav>
        </details>
      </div>
    </header>
  );
}

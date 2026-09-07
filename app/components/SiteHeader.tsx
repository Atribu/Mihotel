"use client";

import Link from "next/link";
import { ChevronDown, Menu as MenuIcon, Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  getMessages,
  interpolate,
  localeInfo,
  locales,
  localizedPath,
  type Locale,
} from "../lib/i18n";
import { getBookingUrl, getRooms, phoneHref, phoneNumber } from "../lib/site-data";

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
  locale = "tr",
  currentPath = "/",
}: {
  overlay?: boolean;
  activePage?: ActivePage;
  locale?: Locale;
  currentPath?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);
  const mobileRoomsRef = useRef<HTMLDetailsElement>(null);
  const messages = getMessages(locale);
  const rooms = getRooms(locale);
  const bookingUrl = getBookingUrl(locale);
  const href = (path: string) => localizedPath(locale, path);

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

  useEffect(() => {
    const closeMobileMenu = (event: PointerEvent | KeyboardEvent) => {
      const menu = mobileMenuRef.current;
      if (!menu?.open) return;
      const restoreFocus = event instanceof KeyboardEvent;

      if (restoreFocus) {
        if (event.key !== "Escape") return;
      } else if (menu.contains(event.target as Node)) {
        return;
      }

      menu.open = false;
      if (mobileRoomsRef.current) mobileRoomsRef.current.open = false;
      if (restoreFocus) menu.querySelector<HTMLElement>(":scope > summary")?.focus();
    };

    document.addEventListener("pointerdown", closeMobileMenu);
    document.addEventListener("keydown", closeMobileMenu);

    return () => {
      document.removeEventListener("pointerdown", closeMobileMenu);
      document.removeEventListener("keydown", closeMobileMenu);
    };
  }, []);

  const closeMobileMenu = () => {
    if (mobileMenuRef.current) mobileMenuRef.current.open = false;
    if (mobileRoomsRef.current) mobileRoomsRef.current.open = false;
  };

  const headerClassName = [
    "site-header",
    overlay ? "site-header--overlay" : "",
    scrolled ? "site-header--scrolled" : "",
    activePage === "home" ? "site-header--home" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClassName} lang={locale}>
      <div className="site-header__inner shell">
        <Link className="brand" href={href("/")} aria-label={messages.a11y.brandHome}>
          <TransparentBrandLogo light={overlay && !scrolled} />
        </Link>

        <nav className="desktop-nav" aria-label={messages.a11y.mainMenu}>
          <Link href={href("/")} aria-current={activePage === "home" ? "page" : undefined}>{messages.nav.home}</Link>
          <div className="nav-dropdown">
            <Link href={href("/odalar")} aria-haspopup="true" aria-current={activePage === "rooms" ? "page" : undefined}>
              {messages.nav.rooms} <ChevronDown aria-hidden="true" size={14} strokeWidth={1.8} />
            </Link>
            <div className="nav-dropdown__menu" aria-label={messages.a11y.roomOptions}>
              {rooms.map((room) => (
                <Link href={href(`/odalar/${room.slug}`)} key={room.slug}>{room.name}</Link>
              ))}
            </div>
          </div>
          <Link href={href("/galeri")} aria-current={activePage === "gallery" ? "page" : undefined}>{messages.nav.gallery}</Link>
          <Link href={href("/konum-iletisim")} aria-current={activePage === "contact" ? "page" : undefined}>{messages.nav.contact}</Link>
        </nav>

        <div className="header-actions">
          <details className="language-switcher">
            <summary aria-label={`${messages.nav.language}: ${localeInfo[locale].name}`}>
              <span className="language-switcher__flag" aria-hidden="true">{localeInfo[locale].flag}</span>
              <span className="language-switcher__code">{locale.toUpperCase()}</span>
              <ChevronDown aria-hidden="true" size={13} strokeWidth={1.7} />
            </summary>
            <nav aria-label={messages.nav.language}>
              {locales.map((item) => (
                <a
                  href={localizedPath(item, currentPath)}
                  hrefLang={item}
                  lang={item}
                  aria-label={`${messages.nav.language}: ${localeInfo[item].name}`}
                  aria-current={item === locale ? "page" : undefined}
                  key={item}
                >
                  <span className="language-switcher__flag" aria-hidden="true">{localeInfo[item].flag}</span>
                  <span className="language-switcher__code">{item.toUpperCase()}</span>
                </a>
              ))}
            </nav>
          </details>
          <a className="button button--phone" href={phoneHref} aria-label={interpolate(messages.a11y.callNumber, { phone: phoneNumber })}>
            <Phone aria-hidden="true" size={16} strokeWidth={1.9} />
            {phoneNumber}
          </a>
          <a className="button button--gold header-booking" href={bookingUrl} target="_blank" rel="noreferrer">
            {messages.nav.booking}
          </a>
        </div>

        <details
          className="mobile-menu"
          ref={mobileMenuRef}
          onToggle={(event) => {
            if (!event.currentTarget.open && mobileRoomsRef.current) {
              mobileRoomsRef.current.open = false;
            }
          }}
        >
          <summary aria-label={messages.nav.menu}>
            <MenuIcon className="mobile-menu__open-icon" aria-hidden="true" size={24} strokeWidth={1.7} />
            <X className="mobile-menu__close-icon" aria-hidden="true" size={24} strokeWidth={1.7} />
          </summary>
          <nav aria-label={messages.a11y.mobileMenu}>
            <Link href={href("/")} aria-current={activePage === "home" ? "page" : undefined} onClick={closeMobileMenu}>{messages.nav.home}</Link>
            <details className="mobile-room-menu" ref={mobileRoomsRef}>
              <summary>
                <span>{messages.nav.rooms}</span>
                <ChevronDown aria-hidden="true" size={17} strokeWidth={1.7} />
              </summary>
              <div className="mobile-room-links">
                <Link href={href("/odalar")} aria-current={currentPath === "/odalar" ? "page" : undefined} onClick={closeMobileMenu}>{messages.nav.allRooms}</Link>
                {rooms.map((room) => (
                  <Link
                    href={href(`/odalar/${room.slug}`)}
                    aria-current={currentPath === `/odalar/${room.slug}` ? "page" : undefined}
                    onClick={closeMobileMenu}
                    key={room.slug}
                  >
                    {room.name}
                  </Link>
                ))}
              </div>
            </details>
            <Link href={href("/galeri")} aria-current={activePage === "gallery" ? "page" : undefined} onClick={closeMobileMenu}>{messages.nav.gallery}</Link>
            <Link href={href("/konum-iletisim")} aria-current={activePage === "contact" ? "page" : undefined} onClick={closeMobileMenu}>{messages.nav.contact}</Link>
            <div className="mobile-language-links" aria-label={messages.nav.language}>
              {locales.map((item) => (
                <a
                  href={localizedPath(item, currentPath)}
                  hrefLang={item}
                  lang={item}
                  aria-label={`${messages.nav.language}: ${localeInfo[item].name}`}
                  aria-current={item === locale ? "page" : undefined}
                  onClick={closeMobileMenu}
                  key={item}
                >
                  <span className="language-switcher__flag" aria-hidden="true">{localeInfo[item].flag}</span>
                  <span className="language-switcher__code">{item.toUpperCase()}</span>
                </a>
              ))}
            </div>
            <a href={phoneHref} onClick={closeMobileMenu}>{messages.nav.call} {phoneNumber}</a>
            <a href={bookingUrl} target="_blank" rel="noreferrer" onClick={closeMobileMenu}>{messages.nav.booking}</a>
          </nav>
        </details>
      </div>
    </header>
  );
}

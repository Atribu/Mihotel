"use client";

import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getMessages, interpolate, type Locale } from "../lib/i18n";

export type HotelGalleryItem = {
  id: string;
  src: string;
  category: string;
  categoryLabel: string;
  caption: string;
  alt: string;
};

type GalleryCategory = {
  id: string;
  label: string;
};

type HotelGalleryProps = {
  items: readonly HotelGalleryItem[];
  categories: readonly GalleryCategory[];
  locale?: Locale;
};

export function HotelGallery({ items, categories, locale = "tr" }: HotelGalleryProps) {
  const messages = getMessages(locale);
  const copy = messages.gallery;
  const a11y = messages.a11y;
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);

  const filteredItems = useMemo(
    () => activeCategory === "all" ? items : items.filter((item) => item.category === activeCategory),
    [activeCategory, items],
  );
  const isOpen = activeIndex !== null;

  const showPrevious = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? null : (current - 1 + filteredItems.length) % filteredItems.length,
    );
  }, [filteredItems.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? null : (current + 1) % filteredItems.length,
    );
  }, [filteredItems.length]);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();

      if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])",
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen, showNext, showPrevious]);

  const activeItem = activeIndex === null ? null : filteredItems[activeIndex];

  return (
    <section className="hotel-gallery" data-gallery-total={items.length} aria-labelledby="gallery-grid-title" lang={locale}>
      <div className="hotel-gallery__intro">
        <div>
          <p className="reference-kicker">{copy.introEyebrow}</p>
          <h2 id="gallery-grid-title">{copy.introTitle} <em>{copy.introItalic}</em></h2>
        </div>
        <p>{copy.introText}</p>
      </div>

      <div className="hotel-gallery__filters" aria-label={a11y.galleryCategories}>
        {categories.map((category) => {
          const count = category.id === "all"
            ? items.length
            : items.filter((item) => item.category === category.id).length;

          return (
            <button
              className={activeCategory === category.id ? "is-active" : undefined}
              type="button"
              aria-pressed={activeCategory === category.id}
              onClick={() => {
                setActiveIndex(null);
                setActiveCategory(category.id);
              }}
              key={category.id}
            >
              <span>{category.label}</span>
              <small>{count}</small>
            </button>
          );
        })}
      </div>

      <p className="hotel-gallery__result" aria-live="polite">
        {interpolate(copy.result, { count: filteredItems.length })}
      </p>

      <div className="hotel-gallery__grid">
        {filteredItems.map((item, index) => (
          <button
            className={`hotel-gallery__item${index === 0 ? " hotel-gallery__item--featured" : ""}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={interpolate(a11y.openFullscreen, { alt: item.alt })}
            data-gallery-item="true"
            key={item.id}
          >
            <img src={item.src} alt="" loading="lazy" decoding="async" />
            <span className="hotel-gallery__item-copy">
              <small>{item.categoryLabel}</small>
              <strong>{item.caption}</strong>
            </span>
            <span className="hotel-gallery__item-icon" aria-hidden="true">
              <Images size={18} strokeWidth={1.6} />
            </span>
          </button>
        ))}
      </div>

      {activeItem && activeIndex !== null && (
        <div
          className="gallery-lightbox hotel-gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={interpolate(a11y.galleryDialog, { category: activeItem.categoryLabel })}
          ref={dialogRef}
        >
          <div className="gallery-lightbox__topbar">
            <span>{activeItem.categoryLabel}</span>
            <span aria-live="polite">{activeIndex + 1} / {filteredItems.length}</span>
            <button ref={closeButtonRef} type="button" onClick={() => setActiveIndex(null)} aria-label={a11y.closeGallery}>
              <X aria-hidden="true" size={25} strokeWidth={1.7} />
            </button>
          </div>

          <button className="gallery-lightbox__arrow gallery-lightbox__arrow--previous" type="button" onClick={showPrevious} aria-label={a11y.previousPhoto}>
            <ChevronLeft aria-hidden="true" size={32} strokeWidth={1.6} />
          </button>

          <figure
            className="gallery-lightbox__stage"
            onTouchStart={(event) => {
              touchStartX.current = event.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
              const endX = event.changedTouches[0]?.clientX;
              if (touchStartX.current === null || endX === undefined) return;
              const distance = endX - touchStartX.current;
              if (Math.abs(distance) > 50) {
                if (distance > 0) showPrevious();
                else showNext();
              }
              touchStartX.current = null;
            }}
          >
            <img src={activeItem.src} alt={activeItem.alt} decoding="async" />
            <figcaption>{activeItem.caption}</figcaption>
          </figure>

          <button className="gallery-lightbox__arrow gallery-lightbox__arrow--next" type="button" onClick={showNext} aria-label={a11y.nextPhoto}>
            <ChevronRight aria-hidden="true" size={32} strokeWidth={1.6} />
          </button>

          <div className="gallery-lightbox__thumbnails" aria-label={a11y.thumbnails}>
            {filteredItems.map((item, index) => (
              <button
                className={index === activeIndex ? "is-active" : undefined}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={interpolate(a11y.showPhoto, { index: index + 1 })}
                aria-current={index === activeIndex ? "true" : undefined}
                key={item.id}
              >
                <img src={item.src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

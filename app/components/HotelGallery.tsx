"use client";

import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
};

export function HotelGallery({ items, categories }: HotelGalleryProps) {
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
    <section className="hotel-gallery" data-gallery-total={items.length} aria-labelledby="gallery-grid-title">
      <div className="hotel-gallery__intro">
        <div>
          <p className="reference-kicker">Fotoğraf galerisi</p>
          <h2 id="gallery-grid-title">Mİ Hotel&apos;in <em>tüm detayları.</em></h2>
        </div>
        <p>
          Otelimizin ortak alanlarını ve tüm oda tiplerini fotoğraflarla keşfedin.
          Bir görsele dokunarak galeriyi tam ekranda gezebilirsiniz.
        </p>
      </div>

      <div className="hotel-gallery__filters" aria-label="Galeri kategorileri">
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
        {filteredItems.length} fotoğraf gösteriliyor
      </p>

      <div className="hotel-gallery__grid">
        {filteredItems.map((item, index) => (
          <button
            className={`hotel-gallery__item${index === 0 ? " hotel-gallery__item--featured" : ""}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`${item.alt}; tam ekran galeride aç`}
            data-gallery-item="true"
            key={item.id}
          >
            <img src={item.src} alt="" loading={index < 4 ? "eager" : "lazy"} decoding="async" />
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
          aria-label={`${activeItem.categoryLabel} fotoğraf galerisi`}
          ref={dialogRef}
          onClick={(event) => {
            if (event.target === event.currentTarget) setActiveIndex(null);
          }}
        >
          <div className="gallery-lightbox__topbar">
            <span>{activeItem.categoryLabel}</span>
            <span aria-live="polite">{activeIndex + 1} / {filteredItems.length}</span>
            <button ref={closeButtonRef} type="button" onClick={() => setActiveIndex(null)} aria-label="Galeriyi kapat">
              <X aria-hidden="true" size={25} strokeWidth={1.7} />
            </button>
          </div>

          <button className="gallery-lightbox__arrow gallery-lightbox__arrow--previous" type="button" onClick={showPrevious} aria-label="Önceki fotoğraf">
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
              if (Math.abs(distance) > 50) distance > 0 ? showPrevious() : showNext();
              touchStartX.current = null;
            }}
          >
            <img src={activeItem.src} alt={activeItem.alt} />
            <figcaption>{activeItem.caption}</figcaption>
          </figure>

          <button className="gallery-lightbox__arrow gallery-lightbox__arrow--next" type="button" onClick={showNext} aria-label="Sonraki fotoğraf">
            <ChevronRight aria-hidden="true" size={32} strokeWidth={1.6} />
          </button>

          <div className="gallery-lightbox__thumbnails" aria-label="Galeri küçük resimleri">
            {filteredItems.map((item, index) => (
              <button
                className={index === activeIndex ? "is-active" : undefined}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`${index + 1}. fotoğrafı göster`}
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

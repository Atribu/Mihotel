"use client";

import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type RoomGalleryProps = {
  roomName: string;
  images: readonly string[];
};

export function RoomGallery({ roomName, images }: RoomGalleryProps) {
  const [inlineIndex, setInlineIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const isOpen = activeIndex !== null;

  const showPrevious = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? null : (current - 1 + images.length) % images.length,
    );
  }, [images.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? null : (current + 1) % images.length,
    );
  }, [images.length]);

  const showPreviousInline = () => {
    setInlineIndex((current) => (current - 1 + images.length) % images.length);
  };

  const showNextInline = () => {
    setInlineIndex((current) => (current + 1) % images.length);
  };

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
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen, showNext, showPrevious]);

  const activeImage = activeIndex === null ? null : images[activeIndex];
  const inlineImage = images[inlineIndex] ?? images[0];

  return (
    <>
      <section className="room-reference-gallery shell" aria-label={`${roomName} fotoğrafları`}>
        <div className="room-reference-gallery__thumbnails" aria-label="Oda fotoğrafları">
          {images.map((image, index) => (
            <button
              className={index === inlineIndex ? "is-active" : undefined}
              type="button"
              onClick={() => {
                setInlineIndex(index);
                setActiveIndex(index);
              }}
              aria-label={`${roomName} fotoğrafı ${index + 1} / ${images.length}; galeride aç`}
              aria-current={index === inlineIndex ? "true" : undefined}
              key={image}
            >
              <img src={image} alt="" loading={index < 5 ? "eager" : "lazy"} />
            </button>
          ))}
        </div>

        <div className="room-reference-gallery__stage">
          <button
            className="room-reference-gallery__image"
            type="button"
            onClick={() => setActiveIndex(inlineIndex)}
            aria-label={`${roomName} fotoğraf galerisini aç, fotoğraf ${inlineIndex + 1}`}
          >
            <img
              src={inlineImage}
              alt={`${roomName} fotoğrafı ${inlineIndex + 1} / ${images.length}`}
            />
            <span>
              <Images aria-hidden="true" size={17} strokeWidth={1.6} />
              {images.length} fotoğraf
            </span>
          </button>

          <button
            className="room-reference-gallery__arrow room-reference-gallery__arrow--previous"
            type="button"
            onClick={showPreviousInline}
            aria-label="Önceki oda fotoğrafı"
          >
            <ChevronLeft aria-hidden="true" size={27} strokeWidth={1.45} />
          </button>
          <button
            className="room-reference-gallery__arrow room-reference-gallery__arrow--next"
            type="button"
            onClick={showNextInline}
            aria-label="Sonraki oda fotoğrafı"
          >
            <ChevronRight aria-hidden="true" size={27} strokeWidth={1.45} />
          </button>
        </div>
      </section>

      {activeImage && activeIndex !== null && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${roomName} fotoğraf galerisi`}
          onClick={(event) => {
            if (event.target === event.currentTarget) setActiveIndex(null);
          }}
        >
          <div className="gallery-lightbox__topbar">
            <span>{roomName}</span>
            <span>{activeIndex + 1} / {images.length}</span>
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
            <img src={activeImage} alt={`${roomName} fotoğrafı ${activeIndex + 1} / ${images.length}`} />
          </figure>

          <button className="gallery-lightbox__arrow gallery-lightbox__arrow--next" type="button" onClick={showNext} aria-label="Sonraki fotoğraf">
            <ChevronRight aria-hidden="true" size={32} strokeWidth={1.6} />
          </button>

          <div className="gallery-lightbox__thumbnails" aria-label="Galeri küçük resimleri">
            {images.map((image, index) => (
              <button
                className={index === activeIndex ? "is-active" : undefined}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`${index + 1}. fotoğrafı göster`}
                aria-current={index === activeIndex ? "true" : undefined}
                key={image}
              >
                <img src={image} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

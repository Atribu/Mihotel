"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "../lib/i18n";

// Narrow desktop preview windows still need the original-quality video.
const mobileVideoMedia = "(max-width: 700px) and (pointer: coarse)";

const playbackLabels = {
  tr: { play: "Tanıtım videosunu oynat", pause: "Tanıtım videosunu duraklat" },
  en: { play: "Play hotel video", pause: "Pause hotel video" },
  de: { play: "Hotelvideo abspielen", pause: "Hotelvideo pausieren" },
  ru: { play: "Воспроизвести видео отеля", pause: "Приостановить видео отеля" },
} satisfies Record<Locale, { play: string; pause: string }>;

export function HeroVideo({ locale }: { locale: Locale }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const labels = playbackLabels[locale];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileViewport = window.matchMedia(mobileVideoMedia);
    const updatePlayback = () => {
      video.muted = true;
      if (reducedMotion.matches) {
        video.pause();
      } else {
        // Some devices require a tap even for muted autoplay; keep the play button available.
        void video.play().catch(() => {});
      }
    };

    const updateSource = () => {
      const shouldResume = !video.paused && !reducedMotion.matches;
      // Browsers may retain the selected <source> when its media query changes.
      // Reload it so widening a touch viewport also restores original quality.
      video.autoplay = shouldResume;
      video.load();
      if (shouldResume) void video.play().catch(() => {});
    };

    updatePlayback();
    reducedMotion.addEventListener("change", updatePlayback);
    mobileViewport.addEventListener("change", updateSource);
    return () => {
      reducedMotion.removeEventListener("change", updatePlayback);
      mobileViewport.removeEventListener("change", updateSource);
    };
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  return (
    <>
      <video
        ref={videoRef}
        className="reference-hero__image reference-hero__video"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/videos/mi-hotel-home-poster.jpg"
        aria-hidden="true"
        tabIndex={-1}
        disablePictureInPicture
        disableRemotePlayback
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setFailed(true)}
      >
        <source src="/videos/mi-hotel-home.mp4" type="video/mp4" media={mobileVideoMedia} />
        <source src="/videos/mi-hotel-home-hq.mp4" type="video/mp4" />
      </video>
      {!failed && (
        <button
          className="reference-hero__video-toggle"
          type="button"
          onClick={togglePlayback}
          aria-label={playing ? labels.pause : labels.play}
          title={playing ? labels.pause : labels.play}
        >
          {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
        </button>
      )}
    </>
  );
}

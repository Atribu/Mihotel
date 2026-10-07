"use client";

import { Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "../lib/i18n";

// Preserve a full-HD desktop version, including narrow desktop windows.
const mobileVideoMedia = "(max-width: 700px) and (pointer: coarse)";
const desktopVideo = "/videos/optimized-v1/home-1080.mp4";
const mobileVideo = "/videos/optimized-v1/home-720.mp4";

const playbackLabels = {
  tr: { play: "Tanıtım videosunu oynat", pause: "Tanıtım videosunu duraklat" },
  en: { play: "Play hotel video", pause: "Pause hotel video" },
  de: { play: "Hotelvideo abspielen", pause: "Hotelvideo pausieren" },
  ru: { play: "Воспроизвести видео отеля", pause: "Приостановить видео отеля" },
} satisfies Record<Locale, { play: string; pause: string }>;

export function HeroVideo({ locale }: { locale: Locale }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const userPaused = useRef(false);
  const manualPlay = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);
  const labels = playbackLabels[locale];

  const playVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const src = window.matchMedia(mobileVideoMedia).matches ? mobileVideo : desktopVideo;
    if (video.getAttribute("src") !== src) {
      setHasFrame(false);
      video.src = src;
    } else if (video.error) {
      video.load();
    }
    video.muted = true;
    // Autoplay may be blocked; the localized play button remains available.
    void video.play().catch(() => {});
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const poster = posterRef.current;
    if (!video || !poster) return;
    let firstFrame = 0;
    let secondFrame = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileViewport = window.matchMedia(mobileVideoMedia);
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    const saveData = connection?.saveData || /^(slow-)?2g$/.test(connection?.effectiveType ?? "");
    const updatePlayback = () => {
      if ((reducedMotion.matches || saveData) && !manualPlay.current) {
        video.pause();
      } else if (!userPaused.current && poster.complete && document.visibilityState === "visible") {
        playVideo();
      }
    };
    // Give the high-priority poster a chance to paint before video competes for bandwidth.
    const afterPoster = () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(updatePlayback);
      });
    };
    const updateSource = () => {
      // A paused video need not download a second version on viewport changes.
      if (!video.paused) playVideo();
    };
    const updateMotionPreference = () => {
      manualPlay.current = false;
      updatePlayback();
    };
    const updateVisibility = () => {
      if (document.visibilityState === "hidden") video.pause();
      else updatePlayback();
    };
    if (poster.complete) afterPoster();
    poster.addEventListener("load", afterPoster);
    poster.addEventListener("error", afterPoster);
    reducedMotion.addEventListener("change", updateMotionPreference);
    mobileViewport.addEventListener("change", updateSource);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      poster.removeEventListener("load", afterPoster);
      poster.removeEventListener("error", afterPoster);
      reducedMotion.removeEventListener("change", updateMotionPreference);
      mobileViewport.removeEventListener("change", updateSource);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, [playVideo]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      manualPlay.current = true;
      playVideo();
    } else {
      userPaused.current = true;
      manualPlay.current = false;
      video.pause();
    }
  };

  return (
    <>
      <link rel="preload" as="image" href="/images/home-v1/hero-desktop.webp" type="image/webp" media="(min-width: 701px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/images/home-v1/hero-mobile.webp" type="image/webp" media="(max-width: 700px)" fetchPriority="high" />
      <picture>
        <source media="(max-width: 700px)" srcSet="/images/home-v1/hero-mobile.webp" />
        <img
          ref={posterRef}
          className="reference-hero__image"
          src="/images/home-v1/hero-desktop.webp"
          width={1920}
          height={1080}
          alt=""
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
      </picture>
      <video
        ref={videoRef}
        className={`reference-hero__image reference-hero__video${hasFrame ? " reference-hero__video--visible" : ""}`}
        loop
        muted
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        disablePictureInPicture
        disableRemotePlayback
        onPlay={() => setPlaying(true)}
        onPlaying={() => setHasFrame(true)}
        onPause={() => setPlaying(false)}
        onError={() => { setPlaying(false); setHasFrame(false); }}
      />
      <button
        className="reference-hero__video-toggle"
        type="button"
        onClick={togglePlayback}
        aria-label={playing ? labels.pause : labels.play}
        title={playing ? labels.pause : labels.play}
      >
        {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
      </button>
    </>
  );
}

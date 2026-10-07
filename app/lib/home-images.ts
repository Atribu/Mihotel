import manifest from "./home-image-manifest.json";

// Keep the original fallback/SEO URL, but deliver smaller candidates in browsers.
export function homeImage<T extends { src: string; width: number; height: number }>(image: T) {
  const variants = manifest[image.src as keyof typeof manifest];
  return variants ? {
    ...image,
    srcSet: variants.map(({ src, width }) => `${src} ${width}w`).join(", "),
  } : image;
}

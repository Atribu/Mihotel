import type { MetadataRoute } from "next";
import {
  languageAlternates,
  localizedPath,
  locales,
} from "./lib/i18n";
import { roomSlugs } from "./lib/i18n";
import { absoluteUrl } from "./lib/seo";

const staticPaths = [
  "/",
  "/odalar",
  "/galeri",
  "/hakkimizda",
  "/konum-iletisim",
] as const;

function absoluteAlternates(path: string) {
  return Object.fromEntries(
    Object.entries(languageAlternates(path)).map(([language, href]) => [
      language,
      absoluteUrl(href),
    ]),
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...staticPaths,
    ...roomSlugs.map((slug) => `/odalar/${slug}` as const),
  ];

  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: absoluteUrl(localizedPath(locale, path)),
      changeFrequency: path === "/" ? "weekly" as const : "monthly" as const,
      priority: path === "/" ? 1 : path === "/odalar" ? 0.9 : path.startsWith("/odalar/") ? 0.8 : 0.7,
      alternates: {
        languages: absoluteAlternates(path),
      },
    })),
  );
}

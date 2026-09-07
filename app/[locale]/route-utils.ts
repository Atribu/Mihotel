import { notFound } from "next/navigation";
import { isLocale } from "../lib/i18n";
import { rooms } from "../lib/site-data";

export const translatedLocales = ["en", "de", "ru"] as const;
export type TranslatedLocale = (typeof translatedLocales)[number];

export function requireTranslatedLocale(value: string): TranslatedLocale {
  if (!isLocale(value) || value === "tr") notFound();
  return value;
}

export function localeStaticParams(): Array<{ locale: TranslatedLocale }> {
  return translatedLocales.map((locale) => ({ locale }));
}

export function localizedRoomStaticParams(): Array<{
  locale: TranslatedLocale;
  slug: string;
}> {
  return translatedLocales.flatMap((locale) =>
    rooms.map((room) => ({ locale, slug: room.slug })),
  );
}

export type LocalizedPageProps = {
  params: Promise<{ locale: string }>;
};

export type LocalizedRoomPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

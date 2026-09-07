import { messages, type Messages } from "./messages";

export const locales = ["tr", "en", "de", "ru"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "tr";

export type LocaleInfo = {
  code: Locale;
  name: string;
  flag: string;
  htmlLang: string;
  openGraphLocale: string;
  bookingLanguage: string;
  direction: "ltr" | "rtl";
};

export const localeInfo = {
  tr: {
    code: "tr",
    name: "Türkçe",
    flag: "🇹🇷",
    htmlLang: "tr",
    openGraphLocale: "tr_TR",
    bookingLanguage: "tr",
    direction: "ltr",
  },
  en: {
    code: "en",
    name: "English",
    flag: "🇬🇧",
    htmlLang: "en",
    openGraphLocale: "en_GB",
    bookingLanguage: "en",
    direction: "ltr",
  },
  de: {
    code: "de",
    name: "Deutsch",
    flag: "🇩🇪",
    htmlLang: "de",
    openGraphLocale: "de_DE",
    bookingLanguage: "de",
    direction: "ltr",
  },
  ru: {
    code: "ru",
    name: "Русский",
    flag: "🇷🇺",
    htmlLang: "ru",
    openGraphLocale: "ru_RU",
    bookingLanguage: "ru",
    direction: "ltr",
  },
} as const satisfies Record<Locale, LocaleInfo>;

export const roomSlugs = [
  "eco-oda",
  "double-oda",
  "triple-oda",
  "aile-odasi",
] as const;
export type RoomSlug = (typeof roomSlugs)[number];

export type LanguageAlternates = Record<Locale | "x-default", string>;
export type InterpolationValues = Record<string, string | number>;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

export function normalizeLocale(
  value: unknown,
  fallback: Locale = defaultLocale,
): Locale {
  return isLocale(value) ? value : fallback;
}

export function getLocaleInfo(locale: Locale): LocaleInfo {
  return localeInfo[locale];
}

/**
 * Adds the locale prefix used by the site while preserving query strings and
 * fragments. Turkish keeps the existing unprefixed URLs; the other locales
 * use /en, /de and /ru. Existing locale prefixes are replaced, not stacked.
 */
export function localizedPath(locale: Locale, path = "/"): string {
  const input = path.trim() || "/";

  if (/^[a-z][a-z\d+.-]*:\/\//i.test(input) || input.startsWith("//")) {
    return input;
  }

  const suffixIndex = input.search(/[?#]/);
  const rawPathname = suffixIndex === -1 ? input : input.slice(0, suffixIndex);
  const suffix = suffixIndex === -1 ? "" : input.slice(suffixIndex);
  let pathname = rawPathname || "/";

  if (!pathname.startsWith("/")) pathname = `/${pathname}`;
  pathname = pathname.replace(/\/{2,}/g, "/");

  const segments = pathname.split("/").filter(Boolean);
  if (isLocale(segments[0])) segments.shift();

  const unprefixed = segments.length === 0 ? "/" : `/${segments.join("/")}`;
  const normalized =
    unprefixed.length > 1 ? unprefixed.replace(/\/+$/, "") : unprefixed;
  const localized =
    locale === defaultLocale
      ? normalized
      : normalized === "/"
        ? `/${locale}`
        : `/${locale}${normalized}`;

  return `${localized}${suffix}`;
}

export function languageAlternates(path = "/"): LanguageAlternates {
  return {
    tr: localizedPath("tr", path),
    en: localizedPath("en", path),
    de: localizedPath("de", path),
    ru: localizedPath("ru", path),
    "x-default": localizedPath(defaultLocale, path),
  };
}

export function interpolate(
  template: string,
  values: InterpolationValues,
): string {
  return template.replace(/\{([\w]+)\}/g, (placeholder, key: string) =>
    Object.prototype.hasOwnProperty.call(values, key)
      ? String(values[key])
      : placeholder,
  );
}

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}

export { messages };
export type { Messages };

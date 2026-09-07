import type { Metadata } from "next";
import { GalleryView } from "../../views/GalleryView";
import { createPageMetadata } from "../../views/page-metadata";
import {
  localeStaticParams,
  requireTranslatedLocale,
  type LocalizedPageProps,
} from "../route-utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return localeStaticParams();
}

export async function generateMetadata({ params }: LocalizedPageProps): Promise<Metadata> {
  const locale = requireTranslatedLocale((await params).locale);
  return createPageMetadata(locale, "gallery");
}

export default async function LocalizedGalleryPage({ params }: LocalizedPageProps) {
  const locale = requireTranslatedLocale((await params).locale);
  return <GalleryView locale={locale} />;
}

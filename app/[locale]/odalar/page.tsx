import type { Metadata } from "next";
import { RoomsView } from "../../views/RoomsView";
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
  return createPageMetadata(locale, "rooms");
}

export default async function LocalizedRoomsPage({ params }: LocalizedPageProps) {
  const locale = requireTranslatedLocale((await params).locale);
  return <RoomsView locale={locale} />;
}

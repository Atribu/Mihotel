import type { Metadata } from "next";
import { HomeView } from "../views/HomeView";
import { createPageMetadata } from "../views/page-metadata";
import {
  localeStaticParams,
  requireTranslatedLocale,
  type LocalizedPageProps,
} from "./route-utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return localeStaticParams();
}

export async function generateMetadata({ params }: LocalizedPageProps): Promise<Metadata> {
  const locale = requireTranslatedLocale((await params).locale);
  return createPageMetadata(locale, "home");
}

export default async function LocalizedHomePage({ params }: LocalizedPageProps) {
  const locale = requireTranslatedLocale((await params).locale);
  return <HomeView locale={locale} />;
}

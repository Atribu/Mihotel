import type { Metadata } from "next";
import { ContactView } from "../../views/ContactView";
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
  return createPageMetadata(locale, "contact");
}

export default async function LocalizedContactPage({ params }: LocalizedPageProps) {
  const locale = requireTranslatedLocale((await params).locale);
  return <ContactView locale={locale} />;
}

import type { Metadata } from "next";
import { getMessages } from "../../../lib/i18n";
import { getRoomBySlug } from "../../../lib/site-data";
import { RoomDetailView } from "../../../views/RoomDetailView";
import { createRoomMetadata } from "../../../views/page-metadata";
import {
  localizedRoomStaticParams,
  requireTranslatedLocale,
  type LocalizedRoomPageProps,
} from "../../route-utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return localizedRoomStaticParams();
}

export async function generateMetadata({ params }: LocalizedRoomPageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = requireTranslatedLocale(rawLocale);
  const room = getRoomBySlug(slug, locale);

  return room
    ? createRoomMetadata(locale, room)
    : { title: getMessages(locale).meta.roomNotFound };
}

export default async function LocalizedRoomPage({ params }: LocalizedRoomPageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = requireTranslatedLocale(rawLocale);
  return <RoomDetailView locale={locale} slug={slug} />;
}

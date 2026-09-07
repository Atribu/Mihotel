import type { Metadata } from "next";
import { getMessages } from "../../lib/i18n";
import { getRoomBySlug, rooms } from "../../lib/site-data";
import { RoomDetailView } from "../../views/RoomDetailView";
import { createRoomMetadata } from "../../views/page-metadata";

type RoomPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return rooms.map((room) => ({ slug: room.slug }));
}

export async function generateMetadata({ params }: RoomPageProps): Promise<Metadata> {
  const { slug } = await params;
  const room = getRoomBySlug(slug, "tr");

  return room
    ? createRoomMetadata("tr", room)
    : { title: getMessages("tr").meta.roomNotFound };
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { slug } = await params;
  return <RoomDetailView locale="tr" slug={slug} />;
}

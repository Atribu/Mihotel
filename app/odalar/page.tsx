import type { Metadata } from "next";
import { RoomsView } from "../views/RoomsView";
import { createPageMetadata } from "../views/page-metadata";

export const metadata: Metadata = createPageMetadata("tr", "rooms");

export default function RoomsPage() {
  return <RoomsView locale="tr" />;
}

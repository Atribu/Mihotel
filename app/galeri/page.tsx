import type { Metadata } from "next";
import { GalleryView } from "../views/GalleryView";
import { createPageMetadata } from "../views/page-metadata";

export const metadata: Metadata = createPageMetadata("tr", "gallery");

export default function GalleryPage() {
  return <GalleryView locale="tr" />;
}

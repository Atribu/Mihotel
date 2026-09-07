import type { Metadata } from "next";
import { HomeView } from "./views/HomeView";
import { createPageMetadata } from "./views/page-metadata";

export const metadata: Metadata = createPageMetadata("tr", "home");

export default function HomePage() {
  return <HomeView locale="tr" />;
}

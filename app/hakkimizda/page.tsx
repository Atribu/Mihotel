import type { Metadata } from "next";
import { AboutView } from "../views/AboutView";
import { createPageMetadata } from "../views/page-metadata";

export const metadata: Metadata = createPageMetadata("tr", "about");

export default function AboutPage() {
  return <AboutView locale="tr" />;
}

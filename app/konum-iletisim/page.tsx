import type { Metadata } from "next";
import { ContactView } from "../views/ContactView";
import { createPageMetadata } from "../views/page-metadata";

export const metadata: Metadata = createPageMetadata("tr", "contact");

export default function ContactPage() {
  return <ContactView locale="tr" />;
}

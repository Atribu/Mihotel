"use client";

import { PhoneCall } from "lucide-react";
import { usePathname } from "next/navigation";
import { getMessages, interpolate, normalizeLocale } from "../lib/i18n";
import { phoneHref, phoneNumber } from "../lib/site-data";

export function FloatingPhone() {
  const pathname = usePathname();
  const locale = normalizeLocale(pathname?.split("/").filter(Boolean)[0]);
  const messages = getMessages(locale);

  return (
    <a
      className="floating-phone"
      href={phoneHref}
      lang={locale}
      aria-label={interpolate(messages.a11y.callNumber, { phone: phoneNumber })}
      title={phoneNumber}
    >
      <PhoneCall aria-hidden="true" size={25} strokeWidth={1.8} />
    </a>
  );
}

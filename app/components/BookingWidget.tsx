"use client";

import { FormEvent, useMemo, useState } from "react";
import { getMessages, interpolate, type Locale } from "../lib/i18n";

const bookingBaseUrl = "https://mi-hotel-boutique.rezervasyonal.com/";

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function BookingWidget({ locale = "tr" }: { locale?: Locale }) {
  const messages = getMessages(locale);
  const copy = messages.booking;
  const today = useMemo(() => new Date(), []);
  const [checkin, setCheckin] = useState(() => toDateInputValue(addDays(today, 1)));
  const [checkout, setCheckout] = useState(() => toDateInputValue(addDays(today, 2)));
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");
  const [childAges, setChildAges] = useState<string[]>([]);

  function updateChildren(value: string) {
    const count = Number(value);
    setChildren(value);
    setChildAges((current) =>
      Array.from({ length: count }, (_, index) => current[index] ?? "0"),
    );
  }

  function updateCheckin(value: string) {
    setCheckin(value);
    if (!checkout || checkout <= value) {
      const nextDay = addDays(new Date(`${value}T12:00:00`), 1);
      setCheckout(toDateInputValue(nextDay));
    }
  }

  function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams({
      Checkin: checkin,
      Checkout: checkout,
      Adult: adults,
      child: children,
      ChildAges: childAges.join("+"),
      language: locale,
    });

    window.open(`${bookingBaseUrl}?${params.toString()}`, "_blank", "noopener,noreferrer");
  }

  return (
    <form
      className="booking-widget"
      onSubmit={submitBooking}
      aria-label={messages.a11y.bookingSearch}
      lang={locale}
    >
      <div className="booking-widget__heading">
        <span>{copy.eyebrow}</span>
        <strong>{copy.title}</strong>
      </div>

      <label className="booking-field">
        <span>{copy.checkIn}</span>
        <input
          type="date"
          value={checkin}
          min={toDateInputValue(today)}
          onChange={(event) => updateCheckin(event.target.value)}
          required
        />
      </label>

      <label className="booking-field">
        <span>{copy.checkOut}</span>
        <input
          type="date"
          value={checkout}
          min={checkin}
          onChange={(event) => setCheckout(event.target.value)}
          required
        />
      </label>

      <label className="booking-field booking-field--compact">
        <span>{copy.adults}</span>
        <select value={adults} onChange={(event) => setAdults(event.target.value)}>
          {[1, 2, 3, 4, 5, 6].map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </label>

      <label className="booking-field booking-field--compact">
        <span>{copy.children}</span>
        <select value={children} onChange={(event) => updateChildren(event.target.value)}>
          {[0, 1, 2, 3, 4, 5, 6].map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </label>

      {childAges.length > 0 && (
        <div className="booking-widget__ages" aria-label={copy.childAges}>
          {childAges.map((age, index) => (
            <label className="booking-field booking-field--compact" key={index}>
              <span>{interpolate(copy.childAge, { index: index + 1 })}</span>
              <select
                value={age}
                onChange={(event) =>
                  setChildAges((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? event.target.value : item,
                    ),
                  )
                }
              >
                {Array.from({ length: 13 }, (_, value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </label>
          ))}
        </div>
      )}

      <button className="button button--gold booking-widget__submit" type="submit">
        {copy.submit}
      </button>
    </form>
  );
}

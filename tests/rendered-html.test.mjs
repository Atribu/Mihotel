import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

test("server-renders the Mİ Hotel Boutique home page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  const text = visibleText(html);
  assert.match(html, /<title>Mİ Hotel Boutique<\/title>/i);
  assert.match(text, /Konforu hissedin, hikâyenizi yaşayın\./);
  assert.match(text, /Müsaitliği Kontrol Et/);
  assert.match(text, /Ücretsiz Minibar/);
  assert.match(text, /yalnızca ücretsiz su/);
  assert.match(text, /Eco Oda/);
  assert.match(text, /Aile Odası/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("server-renders every primary route", async () => {
  const routes = [
    ["/odalar", /Odalarımız/],
    ["/hakkimizda", /Konforu sadeleştiren bir butik otel\./],
    ["/galeri", /Otelimizi ve odalarımızı yakından keşfedin\./],
    ["/konum-iletisim", /Konaklamanız için temel bilgiler\./],
  ];

  for (const [pathname, expectedContent] of routes) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
    assert.match(visibleText(await response.text()), expectedContent);
  }
});

test("server-renders the complete categorized photo gallery", async () => {
  const response = await render("/galeri");
  assert.equal(response.status, 200);

  const html = await response.text();
  const text = visibleText(html);
  const galleryItems = html.match(/data-gallery-item="true"/g) ?? [];

  assert.equal(galleryItems.length, 44);
  assert.match(text, /Tümü44/);
  assert.match(text, /Otel ve Ortak Alanlar13/);
  assert.match(text, /Eco Oda9/);
  assert.match(text, /Double Oda6/);
  assert.match(text, /Triple Oda6/);
  assert.match(text, /Aile Odası10/);
  assert.match(html, /\/images\/gallery\/hotel\/genel-13\.webp/);
  assert.match(html, /\/images\/rooms\/eco\/105-9\.webp/);
  assert.match(html, /\/images\/rooms\/family\/107-10\.webp/);
  assert.match(html, /href="\/galeri"/);
  assert.doesNotMatch(html, /href="\/#galeri"/);
});

test("server-renders every room detail route with its verified content", async () => {
  const routes = [
    ["/odalar/eco-oda", /Eco Oda/, /9 m²/],
    ["/odalar/double-oda", /Double Oda/, /11 m²/],
    ["/odalar/triple-oda", /Triple Oda/, /14 m²/],
    ["/odalar/aile-odasi", /Aile Odası/, /30 m²/],
  ];

  for (const [pathname, roomName, roomSize] of routes) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
    const text = visibleText(await response.text());
    assert.match(text, roomName);
    assert.match(text, roomSize);
    assert.match(text, /Diğer oda seçenekleri/);
    assert.match(text, /Müsaitliği Kontrol Et/);
    assert.match(text, /Ücretsiz minibar \(yalnızca su\)/);
  }
});

test("server-renders the complete English, German and Russian route sets", async () => {
  const routeSets = {
    en: [
      ["", /Feel the comfort, live your story\./],
      ["/odalar", /Our Rooms/],
      ["/galeri", /Explore our hotel and rooms up close\./],
      ["/hakkimizda", /A boutique hotel where comfort feels effortless\./],
      ["/konum-iletisim", /Essential information for your stay\./],
      ["/odalar/double-oda", /Double Room/],
    ],
    de: [
      ["", /Spüren Sie den Komfort, leben Sie Ihre Geschichte\./],
      ["/odalar", /Unsere Zimmer/],
      ["/galeri", /Entdecken Sie unser Hotel und unsere Zimmer aus nächster Nähe\./],
      ["/hakkimizda", /Ein Boutiquehotel, das Komfort unkompliziert macht\./],
      ["/konum-iletisim", /Wichtige Informationen für Ihren Aufenthalt\./],
      ["/odalar/double-oda", /Doppelzimmer/],
    ],
    ru: [
      ["", /Почувствуйте комфорт, проживите свою историю\./],
      ["/odalar", /Наши номера/],
      ["/galeri", /Познакомьтесь с нашим отелем и номерами поближе\./],
      ["/hakkimizda", /Бутик-отель, где комфорт — это просто\./],
      ["/konum-iletisim", /Основная информация для вашего проживания\./],
      ["/odalar/aile-odasi", /Семейный номер/],
    ],
  };

  for (const [locale, routes] of Object.entries(routeSets)) {
    for (const [suffix, expectedContent] of routes) {
      const pathname = `/${locale}${suffix}`;
      const response = await render(pathname);
      assert.equal(response.status, 200, pathname);
      const html = await response.text();
      assert.match(visibleText(html), expectedContent, pathname);
      assert.match(html, new RegExp(`<html[^>]+lang="${locale}"`), pathname);
      assert.match(html, new RegExp(`<main[^>]+lang="${locale}"`), pathname);
      assert.match(html, new RegExp(`language=${locale}`), pathname);
    }
  }
});

test("language choices preserve the current room and expose SEO alternates", async () => {
  const response = await render("/de/odalar/double-oda");
  assert.equal(response.status, 200);
  const html = await response.text();

  for (const href of [
    "/odalar/double-oda",
    "/en/odalar/double-oda",
    "/de/odalar/double-oda",
    "/ru/odalar/double-oda",
  ]) {
    assert.match(html, new RegExp(`href="${href}"`), href);
  }

  for (const locale of ["tr", "en", "de", "ru", "x-default"]) {
    assert.match(html, new RegExp(`hreflang="${locale}"`), locale);
  }
});

test("localized gallery keeps all 44 supplied photos", async () => {
  for (const locale of ["en", "de", "ru"]) {
    const response = await render(`/${locale}/galeri`);
    assert.equal(response.status, 200, locale);
    const html = await response.text();
    assert.equal((html.match(/data-gallery-item="true"/g) ?? []).length, 44, locale);
  }
});

test("describes the complimentary minibar accurately in every language", async () => {
  const expectations = {
    "/": [/Ücretsiz Minibar/, /yalnızca ücretsiz su/],
    "/en": [/Complimentary Minibar/, /complimentary water only/],
    "/de": [/Kostenfreie Minibar/, /ausschließlich kostenfreies Wasser/],
    "/ru": [/Бесплатный мини-бар/, /только бесплатная вода/],
  };

  for (const [pathname, patterns] of Object.entries(expectations)) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
    const text = visibleText(await response.text());
    for (const pattern of patterns) assert.match(text, pattern, pathname);
  }
});

test("unsupported locale routes return not found", async () => {
  for (const pathname of ["/fr", "/tr", "/en/odalar/bilinmeyen-oda"]) {
    const response = await render(pathname);
    assert.equal(response.status, 404, pathname);
  }
});

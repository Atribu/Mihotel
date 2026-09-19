import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import sharp from "sharp";

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
  assert.match(html, /<title>Mİ Hotel Boutique \| Antalya Merkezinde Butik Otel<\/title>/i);
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

  assert.equal(galleryItems.length, 62);
  assert.match(text, /Tümü62/);
  assert.match(text, /Otel ve Ortak Alanlar28/);
  assert.match(text, /Eco Oda10/);
  assert.match(text, /Double Oda6/);
  assert.match(text, /Triple Oda9/);
  assert.match(text, /Aile Odası9/);
  for (let number = 1; number <= 28; number += 1) {
    const filename = `genel-mekan-${String(number).padStart(2, "0")}-1920.webp`;
    assert.ok(html.includes(`/images/hotel/high-res/${filename}`), filename);
  }
  assert.doesNotMatch(html, /\/images\/gallery\/hotel\/genel-/);
  assert.doesNotMatch(html, /\/images\/hotel\/genel-mekan-/);
  assert.doesNotMatch(html, /<img\b[^>]*src="[^"]*-full\.webp"/);
  assert.match(html, /srcSet="[^"]*genel-mekan-26-640\.webp 640w/);
  for (let number = 1; number <= 10; number += 1) {
    const filename = `105-${String(number).padStart(2, "0")}-1920.webp`;
    assert.ok(html.includes(`/images/rooms/eco/high-res/${filename}`), filename);
  }
  assert.doesNotMatch(html, /\/images\/rooms\/eco\/105-\d+\.webp/);
  for (let number = 1; number <= 9; number += 1) {
    const filename = `202-${String(number).padStart(2, "0")}-1920.webp`;
    assert.ok(html.includes(`/images/rooms/triple/high-res/${filename}`), filename);
  }
  assert.doesNotMatch(html, /\/images\/rooms\/triple\/221-\d+\.webp/);
  for (let number = 1; number <= 6; number += 1) {
    const filename = `207-${String(number).padStart(2, "0")}-1920.webp`;
    assert.ok(html.includes(`/images/rooms/double/high-res/${filename}`), filename);
  }
  assert.doesNotMatch(html, /\/images\/rooms\/double\/225-\d+\.webp/);
  for (let number = 1; number <= 9; number += 1) {
    const filename = `220-${String(number).padStart(2, "0")}-1920.webp`;
    assert.ok(html.includes(`/images/rooms/family/high-res/${filename}`), filename);
  }
  assert.doesNotMatch(html, /\/images\/rooms\/family\/107-\d+\.webp/);
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

test("localized gallery includes 28 high-resolution hotel photos and 34 room photos", async () => {
  for (const locale of ["en", "de", "ru"]) {
    const response = await render(`/${locale}/galeri`);
    assert.equal(response.status, 200, locale);
    const html = await response.text();
    assert.equal((html.match(/data-gallery-item="true"/g) ?? []).length, 62, locale);
    assert.doesNotMatch(html, /\/images\/gallery\/hotel\/genel-/);
    assert.doesNotMatch(html, /Mİ Hotel Boutique — undefined/);
  }
});

test("Eco photos replace the cover, minibar and room gallery in all four languages", async () => {
  const prefix = "/images/rooms/eco/high-res/105-";
  for (const locale of ["", "/en", "/de", "/ru"]) {
    for (const suffix of ["/", "/odalar", "/odalar/eco-oda", "/odalar/double-oda", "/galeri"]) {
      const pathname = suffix === "/" ? locale || "/" : `${locale}${suffix}`;
      const response = await render(pathname);
      assert.equal(response.status, 200, pathname);
      const html = await response.text();
      assert.ok(html.includes(`${prefix}10-1920.webp`), pathname);
      assert.ok(html.includes(`${prefix}10-640.webp 640w`), pathname);
      assert.doesNotMatch(html, /\/images\/room-eco(?:-detail)?\.webp/);
      assert.doesNotMatch(html, /\/images\/rooms\/eco\/105-\d+\.webp/);
      assert.doesNotMatch(html, /<img\b[^>]*src="[^"]*-full\.webp"/);
      if (suffix === "/") assert.ok(html.includes(`${prefix}09-1920.webp`), pathname);
      if (suffix === "/odalar/eco-oda") {
        for (let number = 1; number <= 10; number += 1) {
          assert.ok(html.includes(`${prefix}${String(number).padStart(2, "0")}-640.webp`), pathname);
        }
        assert.match(html, /<meta property="og:image:width" content="1920"/);
        assert.match(html, /<meta property="og:image:height" content="1280"/);
        const structuredData = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
          .map((match) => JSON.parse(match[1]));
        const room = structuredData.flatMap((data) => data["@graph"] ?? [])
          .find((entity) => entity["@type"] === "HotelRoom");
        assert.equal(room.image.length, 10);
        assert.ok(room.image[0].endsWith(`${prefix}10-1920.webp`));
      }
    }
  }
});

test("all ten Eco photos preserve source dimensions and have correctly sized previews", async () => {
  const manifest = JSON.parse(await readFile(new URL("../app/lib/eco-photo-manifest.json", import.meta.url), "utf8"));
  const dimensions = [
    [3506, 5707], [6240, 4160], [6240, 4160], [5733, 4160], [4160, 6240],
    [6240, 4160], [6240, 4160], [5830, 3778], [6240, 4160], [6240, 4160],
  ];
  assert.equal(manifest.length, 10);
  assert.equal(new Set(manifest.map((photo) => photo.number)).size, 10);
  for (const photo of manifest) {
    assert.deepEqual([photo.full.width, photo.full.height], dimensions[photo.number - 1]);
    assert.equal(photo.variants.length, 3);
    for (const [index, variant] of photo.variants.entries()) {
      assert.equal(Math.max(variant.width, variant.height), [640, 1280, 1920][index]);
      assert.ok(Math.abs(variant.height - variant.width * photo.full.height / photo.full.width) < 2);
    }
    for (const asset of [...photo.variants, photo.full]) {
      const metadata = await sharp(new URL(`../public${asset.src}`, import.meta.url).pathname).metadata();
      assert.equal(metadata.format, "webp", asset.src);
      assert.deepEqual([metadata.width, metadata.height], [asset.width, asset.height], asset.src);
    }
  }
});

test("Triple photos replace the cover and room gallery in all four languages", async () => {
  const prefix = "/images/rooms/triple/high-res/202-";
  for (const locale of ["", "/en", "/de", "/ru"]) {
    for (const suffix of ["/", "/odalar", "/odalar/triple-oda", "/odalar/eco-oda", "/galeri"]) {
      const pathname = suffix === "/" ? locale || "/" : `${locale}${suffix}`;
      const response = await render(pathname);
      assert.equal(response.status, 200, pathname);
      const html = await response.text();
      assert.ok(html.includes(`${prefix}04-1920.webp`), pathname);
      assert.ok(html.includes(`${prefix}04-640.webp 640w`), pathname);
      assert.doesNotMatch(html, /\/images\/room-triple(?:-detail)?\.webp/);
      assert.doesNotMatch(html, /\/images\/rooms\/triple\/221-\d+\.webp/);
      assert.doesNotMatch(html, /<img\b[^>]*src="[^"]*-full\.webp"/);
      if (suffix === "/odalar/triple-oda") {
        for (let number = 1; number <= 9; number += 1) {
          assert.ok(html.includes(`${prefix}${String(number).padStart(2, "0")}-640.webp`), pathname);
        }
        assert.match(html, /<meta property="og:image:width" content="1920"/);
        assert.match(html, /<meta property="og:image:height" content="1280"/);
        const structuredData = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
          .map((match) => JSON.parse(match[1]));
        const room = structuredData.flatMap((data) => data["@graph"] ?? [])
          .find((entity) => entity["@type"] === "HotelRoom");
        assert.equal(room.image.length, 9);
        assert.ok(room.image[0].endsWith(`${prefix}04-1920.webp`));
      }
    }
  }
});

test("all nine Triple photos preserve source dimensions and have correctly sized previews", async () => {
  const manifest = JSON.parse(await readFile(new URL("../app/lib/triple-photo-manifest.json", import.meta.url), "utf8"));
  const dimensions = [
    [5175, 3861], [5567, 3481], [6240, 4160], [6240, 4160], [6240, 4160],
    [6240, 4160], [5056, 3368], [4111, 6240], [6240, 4160],
  ];
  assert.equal(manifest.length, 9);
  assert.equal(new Set(manifest.map((photo) => photo.number)).size, 9);
  for (const photo of manifest) {
    assert.deepEqual([photo.full.width, photo.full.height], dimensions[photo.number - 1]);
    assert.equal(photo.variants.length, 3);
    for (const [index, variant] of photo.variants.entries()) {
      assert.equal(Math.max(variant.width, variant.height), [640, 1280, 1920][index]);
      assert.ok(Math.abs(variant.height - variant.width * photo.full.height / photo.full.width) < 2);
    }
    for (const asset of [...photo.variants, photo.full]) {
      const metadata = await sharp(new URL(`../public${asset.src}`, import.meta.url).pathname).metadata();
      assert.equal(metadata.format, "webp", asset.src);
      assert.deepEqual([metadata.width, metadata.height], [asset.width, asset.height], asset.src);
    }
  }
});

test("Double photos replace the cover and room gallery in all four languages", async () => {
  const prefix = "/images/rooms/double/high-res/207-";
  for (const locale of ["", "/en", "/de", "/ru"]) {
    for (const suffix of ["/", "/odalar", "/odalar/double-oda", "/odalar/triple-oda", "/galeri"]) {
      const pathname = suffix === "/" ? locale || "/" : `${locale}${suffix}`;
      const response = await render(pathname);
      assert.equal(response.status, 200, pathname);
      const html = await response.text();
      assert.ok(html.includes(`${prefix}01-1920.webp`), pathname);
      assert.ok(html.includes(`${prefix}01-640.webp 640w`), pathname);
      assert.doesNotMatch(html, /\/images\/room-double(?:-detail)?\.webp/);
      assert.doesNotMatch(html, /\/images\/rooms\/double\/225-\d+\.webp/);
      assert.doesNotMatch(html, /<img\b[^>]*src="[^"]*-full\.webp"/);
      if (suffix === "/odalar/double-oda") {
        for (let number = 1; number <= 6; number += 1) {
          assert.ok(html.includes(`${prefix}${String(number).padStart(2, "0")}-640.webp`), pathname);
        }
        assert.match(html, /<meta property="og:image:width" content="1920"/);
        assert.match(html, /<meta property="og:image:height" content="1506"/);
        const structuredData = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
          .map((match) => JSON.parse(match[1]));
        const room = structuredData.flatMap((data) => data["@graph"] ?? [])
          .find((entity) => entity["@type"] === "HotelRoom");
        assert.equal(room.image.length, 6);
        assert.ok(room.image[0].endsWith(`${prefix}01-1920.webp`));
      }
    }
  }
});

test("all six Double photos preserve source dimensions and have correctly sized previews", async () => {
  const manifest = JSON.parse(await readFile(new URL("../app/lib/double-photo-manifest.json", import.meta.url), "utf8"));
  const dimensions = [
    [4818, 3779], [6240, 4160], [6240, 4160], [5409, 4160], [4160, 6240], [4160, 6240],
  ];
  assert.equal(manifest.length, 6);
  assert.equal(new Set(manifest.map((photo) => photo.number)).size, 6);
  for (const photo of manifest) {
    assert.deepEqual([photo.full.width, photo.full.height], dimensions[photo.number - 1]);
    assert.equal(photo.variants.length, 3);
    for (const [index, variant] of photo.variants.entries()) {
      assert.equal(Math.max(variant.width, variant.height), [640, 1280, 1920][index]);
      assert.ok(Math.abs(variant.height - variant.width * photo.full.height / photo.full.width) < 2);
    }
    for (const asset of [...photo.variants, photo.full]) {
      const metadata = await sharp(new URL(`../public${asset.src}`, import.meta.url).pathname).metadata();
      assert.equal(metadata.format, "webp", asset.src);
      assert.deepEqual([metadata.width, metadata.height], [asset.width, asset.height], asset.src);
    }
  }
});

test("Family photos replace the cover, featured images and room gallery in all four languages", async () => {
  const prefix = "/images/rooms/family/high-res/220-";
  const order = [7, 1, 3, 2, 9, 6, 8, 4, 5];
  for (const locale of ["", "/en", "/de", "/ru"]) {
    for (const suffix of ["/", "/odalar", "/odalar/aile-odasi", "/odalar/eco-oda", "/galeri"]) {
      const pathname = suffix === "/" ? locale || "/" : `${locale}${suffix}`;
      const response = await render(pathname);
      assert.equal(response.status, 200, pathname);
      const html = await response.text();
      assert.ok(html.includes(`${prefix}07-1920.webp`), pathname);
      assert.ok(html.includes(`${prefix}07-640.webp 640w`), pathname);
      assert.doesNotMatch(html, /\/images\/room-family(?:-(?:detail|bath))?\.webp/);
      assert.doesNotMatch(html, /\/images\/rooms\/family\/107-\d+\.webp/);
      assert.doesNotMatch(html, /<img\b[^>]*src="[^"]*-full\.webp"/);
      if (suffix === "/") {
        assert.match(html, /class="reference-featured-room__image"[^>]*>\s*<img[^>]*src="\/images\/rooms\/family\/high-res\/220-07-1920\.webp"/);
      }
      if (suffix === "/odalar") {
        assert.match(html, /class="reference-hero rooms-catalog__hero">\s*<img[^>]*src="\/images\/rooms\/family\/high-res\/220-07-1920\.webp"/);
      }
      if (suffix === "/odalar" || suffix === "/odalar/aile-odasi") {
        assert.match(html, /<meta property="og:image" content="[^"]*\/images\/rooms\/family\/high-res\/220-07-1920\.webp"/);
        assert.match(html, /<meta property="og:image:width" content="1920"/);
        assert.match(html, /<meta property="og:image:height" content="1157"/);
      }
      if (suffix === "/odalar/aile-odasi") {
        for (let number = 1; number <= 9; number += 1) {
          assert.ok(html.includes(`${prefix}${String(number).padStart(2, "0")}-640.webp`), pathname);
        }
        const structuredData = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
          .map((match) => JSON.parse(match[1]));
        const room = structuredData.flatMap((data) => data["@graph"] ?? [])
          .find((entity) => entity["@type"] === "HotelRoom");
        assert.equal(room.image.length, 9);
        assert.deepEqual(room.image.map((src) => new URL(src).pathname),
          order.map((number) => `${prefix}${String(number).padStart(2, "0")}-1920.webp`));
      }
    }
  }
});

test("all nine Family photos preserve source dimensions and have correctly sized previews", async () => {
  const manifest = JSON.parse(await readFile(new URL("../app/lib/family-photo-manifest.json", import.meta.url), "utf8"));
  const dimensions = [
    [6240, 4160], [6240, 4160], [6240, 4160], [6240, 4160], [4822, 4160],
    [5602, 3470], [5886, 3547], [6240, 4160], [6240, 4160],
  ];
  assert.equal(manifest.length, 9);
  assert.equal(new Set(manifest.map((photo) => photo.number)).size, 9);
  for (const photo of manifest) {
    assert.deepEqual([photo.full.width, photo.full.height], dimensions[photo.number - 1]);
    assert.equal(photo.variants.length, 3);
    for (const [index, variant] of photo.variants.entries()) {
      assert.equal(Math.max(variant.width, variant.height), [640, 1280, 1920][index]);
      assert.ok(Math.abs(variant.height - variant.width * photo.full.height / photo.full.width) < 2);
    }
    for (const asset of [...photo.variants, photo.full]) {
      const metadata = await sharp(new URL(`../public${asset.src}`, import.meta.url).pathname).metadata();
      assert.equal(metadata.format, "webp", asset.src);
      assert.deepEqual([metadata.width, metadata.height], [asset.width, asset.height], asset.src);
    }
  }
});

test("hotel photo assets preserve full resolution and supply smaller responsive previews", async () => {
  const manifest = JSON.parse(await readFile(new URL("../app/lib/hotel-photo-manifest.json", import.meta.url), "utf8"));
  assert.equal(manifest.length, 28);
  assert.equal(new Set(manifest.map((photo) => photo.number)).size, 28);
  assert.deepEqual([manifest[25].full.width, manifest[25].full.height], [5056, 3368]);
  assert.deepEqual([manifest[0].full.width, manifest[0].full.height], [4160, 6240]);

  for (const photo of manifest) {
    assert.ok(Math.min(photo.full.width, photo.full.height) >= 1760);
    assert.equal(photo.variants.length, 3);
    for (const [index, variant] of photo.variants.entries()) {
      assert.equal(Math.max(variant.width, variant.height), [640, 1280, 1920][index]);
      assert.ok(Math.abs(variant.height - variant.width * photo.full.height / photo.full.width) < 2);
    }
    for (const asset of [...photo.variants, photo.full]) {
      const metadata = await sharp(new URL(`../public${asset.src}`, import.meta.url).pathname).metadata();
      assert.equal(metadata.format, "webp", asset.src);
      assert.deepEqual([metadata.width, metadata.height], [asset.width, asset.height], asset.src);
    }
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

test("serves robots and a complete multilingual sitemap", async () => {
  const robotsResponse = await render("/robots.txt");
  assert.equal(robotsResponse.status, 200);
  assert.match(robotsResponse.headers.get("content-type") ?? "", /^text\/plain\b/i);
  const robots = await robotsResponse.text();
  assert.match(robots, /User-Agent: \*/i);
  assert.match(robots, /Allow: \//i);
  assert.match(robots, /Sitemap: https:\/\/mihotelboutique\.com\/sitemap\.xml/i);

  const sitemapResponse = await render("/sitemap.xml");
  assert.equal(sitemapResponse.status, 200);
  assert.match(sitemapResponse.headers.get("content-type") ?? "", /^application\/xml\b/i);
  const sitemap = await sitemapResponse.text();
  assert.equal((sitemap.match(/<url>/g) ?? []).length, 36);
  assert.match(sitemap, /<loc>https:\/\/mihotelboutique\.com\/odalar\/eco-oda<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/mihotelboutique\.com\/ru\/odalar\/aile-odasi<\/loc>/);
  for (const language of ["tr", "en", "de", "ru", "x-default"]) {
    assert.match(sitemap, new RegExp(`hreflang="${language}"`), language);
  }
});

test("permanently redirects indexed legacy Wix paths", async () => {
  const redirects = [
    ["/i-leti%C5%9Fim?ref=google", "/konum-iletisim?ref=google"],
    ["/en/i-leti%C5%9Fim", "/en/konum-iletisim"],
    ["/ke%C5%9Ffet", "/hakkimizda"],
    ["/en/ke%C5%9Ffet", "/en/hakkimizda"],
  ];

  for (const [pathname, destination] of redirects) {
    const response = await render(pathname);
    assert.equal(response.status, 308, pathname);
    assert.equal(response.headers.get("location"), destination, pathname);
  }
});

test("server-renders hotel, room and breadcrumb structured data", async () => {
  const homeResponse = await render("/");
  const homeHtml = await homeResponse.text();
  assert.match(homeHtml, /type="application\/ld\+json"/);
  assert.match(homeHtml, /"@type":"Hotel"/);
  assert.match(homeHtml, /"postalCode":"07100"/);
  assert.match(homeHtml, /"checkinTime":"14:00"/);

  const roomResponse = await render("/en/odalar/double-oda");
  const roomHtml = await roomResponse.text();
  assert.match(roomHtml, /"@type":"HotelRoom"/);
  assert.match(roomHtml, /"@type":"BreadcrumbList"/);
  assert.match(roomHtml, /"value":11,"unitCode":"MTK"/);
  assert.match(roomHtml, /https:\/\/mihotelboutique\.com\/en\/odalar\/double-oda/);
});

test("renders descriptive alt text for indexable gallery photos", async () => {
  const response = await render("/galeri");
  const html = await response.text();
  assert.match(
    html,
    /<img src="\/images\/hotel\/high-res\/genel-mekan-26-1920\.webp"[^>]*alt="Mİ Hotel Boutique — Otel cephesinin alacakaranlık görünümü"/,
  );
});

test("unsupported locale routes return not found", async () => {
  for (const pathname of ["/fr", "/tr", "/en/odalar/bilinmeyen-oda"]) {
    const response = await render(pathname);
    assert.equal(response.status, 404, pathname);
    assert.match(await response.text(), /<meta name="robots" content="noindex"\s*\/>/, pathname);
  }
});

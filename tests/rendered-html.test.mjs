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
  assert.match(text, /Müsaitliği Ara/);
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
  assert.match(text, /Otel &amp; Ortak Alanlar13/);
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
    assert.match(text, /Bunları da beğenebilirsiniz/);
    assert.match(text, /Müsaitliği Ara/);
  }
});

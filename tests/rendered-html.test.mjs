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

test("server-renders the Mİ Hotel Boutique home page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Mİ Hotel Boutique<\/title>/i);
  assert.match(html, /Şehrin ritminde, evinizin huzurunda\./);
  assert.match(html, /Müsaitliği Ara/);
  assert.match(html, /Eco Oda/);
  assert.match(html, /Aile Odası/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("server-renders every primary route", async () => {
  const routes = [
    ["/odalar", /Odalarımız/],
    ["/hakkimizda", /Konforu sadeleştiren bir butik otel\./],
    ["/konum-iletisim", /Konaklamanız için temel bilgiler\./],
  ];

  for (const [pathname, expectedContent] of routes) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
    assert.match(await response.text(), expectedContent);
  }
});

import assert from "node:assert/strict";
import { access } from "node:fs/promises";
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

test("server-renders the Well Within support page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Support \| Well Within<\/title>/i);
  assert.match(html, /Clear help for your chart—and your choices\./);
  assert.match(html, /mailto:WellWithinApp@gmail\.com/);
  assert.match(html, /href="\/privacy"/);
  assert.match(html, /Support and privacy, made clear\./);
  assert.doesNotMatch(html, /starter|Codex is working|react-loading-skeleton/i);
});

test("server-renders the privacy policy and social preview", async () => {
  const response = await render("/privacy");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>Privacy Policy \| Well Within<\/title>/i);
  assert.match(html, /Your chart, your choices\./);
  assert.match(html, /Effective July 14, 2026/);
  assert.match(html, /Device-only charting is the default\./);
  assert.match(html, /No third-party advertising or cross-app tracking\./);
  assert.match(html, /Supabase/);
  await access(new URL("../app/opengraph-image.png", import.meta.url));
});

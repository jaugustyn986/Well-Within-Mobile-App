import { cp, mkdir, rm, writeFile } from "node:fs/promises";

const projectRoot = new URL("../", import.meta.url);
const outputRoot = new URL("../static-export/", import.meta.url);
const basePath = "/Well-Within-Mobile-App";
const publicOrigin = "https://jaugustyn986.github.io";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("export", Date.now().toString());
const { default: worker } = await import(workerUrl.href);

await rm(outputRoot, { recursive: true, force: true });
await mkdir(new URL("assets/", outputRoot), { recursive: true });
await mkdir(new URL("privacy/", outputRoot), { recursive: true });

await cp(new URL("../dist/client/assets/", import.meta.url), new URL("assets/", outputRoot), {
  recursive: true,
});
await cp(new URL("../public/well-within-icon.png", import.meta.url), new URL("well-within-icon.png", outputRoot));
await cp(new URL("../app/opengraph-image.png", import.meta.url), new URL("opengraph-image.png", outputRoot));

for (const [pathname, output] of [
  ["/", new URL("index.html", outputRoot)],
  ["/privacy", new URL("privacy/index.html", outputRoot)],
]) {
  const response = await worker.fetch(
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

  if (!response.ok) {
    throw new Error(`Unable to render ${pathname}: HTTP ${response.status}`);
  }

  const html = makeStatic(await response.text());
  await writeFile(output, html);
}

await writeFile(new URL(".nojekyll", outputRoot), "");

function makeStatic(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<link\b(?=[^>]*\brel=["']modulepreload["'])[^>]*>/gi, "")
    .replaceAll('href="/privacy"', `href="${basePath}/privacy/"`)
    .replaceAll('href="/"', `href="${basePath}/"`)
    .replaceAll('href="/assets/', `href="${basePath}/assets/`)
    .replaceAll('src="/assets/', `src="${basePath}/assets/`)
    .replaceAll("url(/assets/", `url(${basePath}/assets/`)
    .replaceAll('href="/well-within-icon.png"', `href="${basePath}/well-within-icon.png"`)
    .replaceAll('src="/well-within-icon.png"', `src="${basePath}/well-within-icon.png"`)
    .replace(/content="\/opengraph-image\.png\?[^"']+"/g, `content="${publicOrigin}${basePath}/opengraph-image.png"`)
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .concat("\n");
}

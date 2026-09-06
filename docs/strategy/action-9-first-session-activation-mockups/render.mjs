import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createRequire } from 'node:module';
import fs from 'node:fs';

const dependencyRoot = process.env.WELL_WITHIN_NODE_MODULES;
if (!dependencyRoot) {
  throw new Error('WELL_WITHIN_NODE_MODULES must point to the bundled Node.js packages directory.');
}
const require = createRequire(path.join(dependencyRoot, 'package.json'));
const { chromium } = require('playwright');

const here = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(here, 'mockup.html');
const outputDirectory = path.join(here, 'v2');
fs.mkdirSync(outputDirectory, { recursive: true });
const screens = [
  'activation-v2-01-welcome',
  'activation-v2-02-chart-context',
  'activation-v2-03-observation',
  'activation-v2-04-privacy',
  'activation-v2-05-first-action',
];

const chromeExecutable = process.env.WELL_WITHIN_CHROME_EXECUTABLE;
const browser = await chromium.launch({
  headless: true,
  ...(chromeExecutable ? { executablePath: chromeExecutable } : {}),
});
const page = await browser.newPage({
  viewport: { width: 1600, height: 1200 },
  deviceScaleFactor: 3,
});

await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
await page.evaluate(async () => document.fonts.ready);

for (const id of screens) {
  const target = page.locator(`#${id}`);
  const footer = target.locator('.footer, .entry-footer');
  const [targetBox, footerBox] = await Promise.all([
    target.boundingBox(),
    footer.boundingBox(),
  ]);
  console.log(id, { targetBox, footerBox });
  await target.screenshot({
    path: path.join(outputDirectory, `${id}.png`),
  });
}

await browser.close();

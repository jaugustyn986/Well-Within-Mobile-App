import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import fs from 'node:fs';

const bundledNodeModules = '/Users/jimaugustyn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const bundledRequire = createRequire(path.join(bundledNodeModules, '_codex-render-anchor.cjs'));
const { chromium } = bundledRequire('playwright');

const here = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(here, 'mockup.html');
const outputDirectory = path.join(here, 'visuals');
fs.mkdirSync(outputDirectory, { recursive: true });

const screens = [
  ['screen-first-save', '01-first-save-confirmation.png'],
  ['screen-calendar-lesson', '02-calendar-contextual-lesson.png'],
  ['screen-lesson-detail', '03-contextual-lesson.png'],
  ['screen-tip-controls', '04-tip-controls.png'],
  ['screen-tips-exhausted', '05-tips-exhausted.png'],
  ['screen-first-chart', '06-first-completed-chart.png'],
];

const browser = await chromium.launch({
  headless: true,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});

const page = await browser.newPage({
  viewport: { width: 1900, height: 2400 },
  deviceScaleFactor: 2,
});

await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle' });
await page.evaluate(async () => document.fonts.ready);

for (const [id, filename] of screens) {
  const target = page.locator(`#${id}`);
  const box = await target.boundingBox();
  if (!box || box.width !== 390 || box.height !== 844) {
    throw new Error(`Unexpected mockup geometry for ${id}: ${JSON.stringify(box)}`);
  }
  await page.screenshot({
    path: path.join(outputDirectory, filename),
    clip: box,
  });
}

await page.locator('#flow-overview').screenshot({
  path: path.join(outputDirectory, 'user-flow-overview.png'),
});

const audit = await page.evaluate(() => {
  const phones = [...document.querySelectorAll('.phone')];
  return phones.map((phone) => ({
    id: phone.id,
    width: phone.clientWidth,
    height: phone.clientHeight,
    scrollWidth: phone.scrollWidth,
    scrollHeight: phone.scrollHeight,
  }));
});

for (const item of audit) {
  if (item.scrollWidth > item.width || item.scrollHeight > item.height) {
    throw new Error(`Mockup overflow in ${item.id}: ${JSON.stringify(item)}`);
  }
}

console.log(JSON.stringify({ screens: screens.length, audit }, null, 2));
await browser.close();

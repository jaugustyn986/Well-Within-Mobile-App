import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const DIR = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(DIR,'../learning-to-chart-starts-with-noticing-not-knowing/assets');
const files = [
  'pexels-kaboompics-4207707.jpg',
  'pexels-messalaciulla-942872.jpg',
  'pexels-dulce-espinoza-602900.jpg',
  'pexels-cup-of-couple-7657880.jpg',
  'pexels-eva-bronzini-8059957.jpg',
];
for (const f of files) {
  const m = await sharp(path.join(ASSETS,f)).metadata();
  console.log(`${f}: ${m.width}x${m.height}`);
}

import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const DIR = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(DIR,'../learning-to-chart-starts-with-noticing-not-knowing/assets');
const photos = [
  ['pexels-kaboompics-4207707.jpg','centre'],
  ['pexels-messalaciulla-942872.jpg','centre'],
  ['pexels-dulce-espinoza-602900.jpg','centre'],
  ['pexels-cup-of-couple-7657880.jpg','left'],
  ['pexels-eva-bronzini-8059957.jpg','centre'],
];
for (let i=0; i<photos.length; i++) {
  const [f, pos] = photos[i];
  await sharp(path.join(ASSETS,f))
    .resize(540,675,{fit:'cover',position:pos})
    .jpeg({quality:85})
    .toFile(path.join(DIR,`thumb-${i+1}.jpg`));
  console.log(`thumb-${i+1}.jpg`);
}

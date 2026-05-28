import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const DIR = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(DIR,'../learning-to-chart-starts-with-noticing-not-knowing/assets');
const W=1080, H=1350;

const photos = [
  { n:1, f:'pexels-kaboompics-4207707.jpg', pos:'centre' },
  { n:2, f:'pexels-messalaciulla-942872.jpg', pos:'centre' },
  { n:3, f:'pexels-dulce-espinoza-602900.jpg', pos:'centre' },
  { n:4, f:'pexels-cup-of-couple-7657880.jpg', pos:'left' },
  { n:5, f:'pexels-eva-bronzini-8059957.jpg', pos:'centre' },
];

for (const p of photos) {
  const { data } = await sharp(path.join(ASSETS,p.f))
    .resize(W,H,{fit:'cover',position:p.pos})
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Sample brightness at 50px intervals across full width at that y
  const zones = [];
  for (let y=0; y<H; y+=50) {
    let sum=0, count=0;
    // sample 10 equally-spaced x positions across width
    for (let xi=0; xi<10; xi++) {
      const x = Math.floor(xi * W/10) + 40;
      const idx = (y*W + x)*3;
      const brightness = (data[idx]+data[idx+1]+data[idx+2])/3;
      sum += brightness; count++;
    }
    const avg = Math.round(sum/count);
    // mark if very bright (likely paper) vs darker (wood/surface)
    const label = avg>200 ? 'PAPER/BRIGHT' : avg>150 ? 'MID' : 'WOOD/DARK';
    zones.push(`  y=${String(y).padStart(4)}: avg brightness ${String(avg).padStart(3)}  ${label}`);
  }
  console.log(`\n=== PHOTO ${p.n}: ${p.f} ===`);
  console.log(zones.join('\n'));
}

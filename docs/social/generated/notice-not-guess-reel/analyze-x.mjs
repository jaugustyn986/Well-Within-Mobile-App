import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const DIR = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(DIR,'../learning-to-chart-starts-with-noticing-not-knowing/assets');
const W=1080, H=1350;

// Check horizontal brightness for photos 1 and 2 (the problem ones)
// at the text zone (y=100-200) to see if there are vertical edges/bindings
for (const [n, f, pos] of [[1,'pexels-kaboompics-4207707.jpg','centre'],[2,'pexels-messalaciulla-942872.jpg','centre']]) {
  const { data } = await sharp(path.join(ASSETS,f))
    .resize(W,H,{fit:'cover',position:pos})
    .raw()
    .toBuffer({resolveWithObject:true});

  console.log(`\n=== PHOTO ${n}: x-axis scan at y=150 (title zone) ===`);
  for (let x=0; x<W; x+=60) {
    const idx = (150*W + x)*3;
    const b = Math.round((data[idx]+data[idx+1]+data[idx+2])/3);
    const bar = '█'.repeat(Math.round(b/10));
    console.log(`  x=${String(x).padStart(4)}: ${String(b).padStart(3)} ${bar}`);
  }
  
  console.log(`\n=== PHOTO ${n}: x-axis scan at y=300 ===`);
  for (let x=0; x<W; x+=60) {
    const idx = (300*W + x)*3;
    const b = Math.round((data[idx]+data[idx+1]+data[idx+2])/3);
    const bar = '█'.repeat(Math.round(b/10));
    console.log(`  x=${String(x).padStart(4)}: ${String(b).padStart(3)} ${bar}`);
  }
}

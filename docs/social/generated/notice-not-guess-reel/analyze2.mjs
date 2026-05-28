import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const DIR = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(DIR,'../learning-to-chart-starts-with-noticing-not-knowing/assets');
const W=1080, H=1350;

// Photo 1: x-scan at y=250, 350, 450 to find where vase shadow ends
console.log('=== PHOTO 1: vase shadow tracking ===');
const {data:d1} = await sharp(path.join(ASSETS,'pexels-kaboompics-4207707.jpg'))
  .resize(W,H,{fit:'cover',position:'centre'}).raw().toBuffer({resolveWithObject:true});
for (const y of [250,350,450,550]) {
  const row=[];
  for (let x=0; x<W; x+=60) {
    const i=(y*W+x)*3; const b=Math.round((d1[i]+d1[i+1]+d1[i+2])/3);
    row.push(`x${x}=${b}`);
  }
  console.log(`y=${y}: ${row.join('  ')}`);
}

// Photo 2: also show y=60,80,100,120,140,160 to see notebook top edge precisely
console.log('\n=== PHOTO 2: notebook top edge ===');
const {data:d2} = await sharp(path.join(ASSETS,'pexels-messalaciulla-942872.jpg'))
  .resize(W,H,{fit:'cover',position:'centre'}).raw().toBuffer({resolveWithObject:true});
for (const y of [40,60,80,100,120,140,160,180,200]) {
  const row=[];
  for (let x of [94,200,400,600,800,986]) {
    const i=(y*W+x)*3; const b=Math.round((d2[i]+d2[i+1]+d2[i+2])/3);
    row.push(`x${x}=${b}`);
  }
  console.log(`y=${y}: ${row.join('  ')}`);
}

// Photo 3: same top edge check
console.log('\n=== PHOTO 3: notepad top edge ===');
const {data:d3} = await sharp(path.join(ASSETS,'pexels-dulce-espinoza-602900.jpg'))
  .resize(W,H,{fit:'cover',position:'centre'}).raw().toBuffer({resolveWithObject:true});
for (const y of [60,100,140,180,220]) {
  const row=[];
  for (let x of [94,300,500,700,900,986]) {
    const i=(y*W+x)*3; const b=Math.round((d3[i]+d3[i+1]+d3[i+2])/3);
    row.push(`x${x}=${b}`);
  }
  console.log(`y=${y}: ${row.join('  ')}`);
}

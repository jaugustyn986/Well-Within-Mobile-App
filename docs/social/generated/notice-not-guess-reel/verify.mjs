import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const DIR = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(DIR,'../learning-to-chart-starts-with-noticing-not-knowing/assets');
const W=1080;

// For each slide: check brightness at new titleY across text x range (x=94 to x=814)
const checks = [
  { n:1, f:'pexels-kaboompics-4207707.jpg', pos:'centre', titleY:580, supY:880 },
  { n:2, f:'pexels-messalaciulla-942872.jpg', pos:'centre', titleY:300, supY:660 },
  { n:3, f:'pexels-dulce-espinoza-602900.jpg', pos:'centre', titleY:320, supY:650 },
  { n:4, f:'pexels-cup-of-couple-7657880.jpg', pos:'left', titleY:280, supY:740 },
  { n:5, f:'pexels-eva-bronzini-8059957.jpg', pos:'centre', titleY:240, supY:580 },
];

for (const s of checks) {
  const {data} = await sharp(path.join(ASSETS,s.f))
    .resize(W,1350,{fit:'cover',position:s.pos}).raw().toBuffer({resolveWithObject:true});
  
  const sample = (y, xs) => xs.map(x => {
    const i=(y*W+x)*3;
    return `x${x}=${Math.round((data[i]+data[i+1]+data[i+2])/3)}`;
  }).join(' ');
  
  const xs = [94, 200, 360, 500, 660, 800];
  console.log(`Slide ${s.n} — titleY=${s.titleY}: ${sample(s.titleY, xs)}`);
  console.log(`Slide ${s.n} — supY=${s.supY}:   ${sample(s.supY, xs)}`);
  console.log();
}

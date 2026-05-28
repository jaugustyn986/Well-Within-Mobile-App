import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const DIR = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(DIR,'../learning-to-chart-starts-with-noticing-not-knowing/assets');
const W=1080, H=1350;

// slide configs matching current generator
const slides = [
  { n:1, f:'pexels-kaboompics-4207707.jpg', pos:'centre', titleY:148, supY:560 },
  { n:2, f:'pexels-messalaciulla-942872.jpg', pos:'centre', titleY:180, supY:530 },
  { n:3, f:'pexels-dulce-espinoza-602900.jpg', pos:'centre', titleY:168, supY:510 },
  { n:4, f:'pexels-cup-of-couple-7657880.jpg', pos:'left', titleY:148, supY:590 },
  { n:5, f:'pexels-eva-bronzini-8059957.jpg', pos:'centre', titleY:168, supY:510 },
];

for (const s of slides) {
  const base = await sharp(path.join(ASSETS,s.f))
    .resize(W,H,{fit:'cover',position:s.pos})
    .toBuffer();

  // Grid lines at 100px intervals + markers at exact text Y positions
  const lines = [];
  // horizontal grid every 100px
  for (let y=100; y<H; y+=100) {
    lines.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="rgba(255,0,0,0.3)" stroke-width="1"/>`);
    lines.push(`<text x="8" y="${y-4}" font-family="Arial" font-size="20" fill="red">${y}</text>`);
  }
  // Bright markers at title Y and support Y
  lines.push(`<line x1="0" y1="${s.titleY}" x2="${W}" y2="${s.titleY}" stroke="blue" stroke-width="3"/>`);
  lines.push(`<text x="8" y="${s.titleY-6}" font-family="Arial" font-size="22" fill="blue">TITLE y=${s.titleY}</text>`);
  lines.push(`<line x1="0" y1="${s.supY}" x2="${W}" y2="${s.supY}" stroke="green" stroke-width="3"/>`);
  lines.push(`<text x="8" y="${s.supY-6}" font-family="Arial" font-size="22" fill="green">SUPPORT y=${s.supY}</text>`);
  // vertical center line
  lines.push(`<line x1="94" y1="0" x2="94" y2="${H}" stroke="orange" stroke-width="2" stroke-dasharray="8,4"/>`);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${lines.join('')}</svg>`;

  await sharp(base)
    .composite([{input:Buffer.from(svg)}])
    .jpeg({quality:85})
    .toFile(path.join(DIR,`grid-${s.n}.jpg`));
  console.log(`grid-${s.n}.jpg`);
}

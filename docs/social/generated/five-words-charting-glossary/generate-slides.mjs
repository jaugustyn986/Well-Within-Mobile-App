import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WIDTH  = 1080;
const HEIGHT = 1350;

const BG     = { r: 250, g: 244, b: 236, alpha: 1 };
const BROWN  = '#3A2316';
const GOLD   = '#C9A882';
const HANDLE = '#9B7B5E';
const LEAF_A = '#7A8B5C';
const LEAF_B = '#A67C52';

const leaf = (w = 60, h = 120) =>
  `M0,0 C${-w * 0.5},${-h * 0.6} ${w * 0.5},${-h} ${w * 0.7},${-h * 0.75} C${w * 1.0},${-h * 0.5} ${w * 0.5},0 0,0`;

// Same botanical system as hook, slightly pulled back so the word is the hero
const botanicals = `
  <g opacity="0.38">
    <path d="${leaf(55, 130)}" fill="${LEAF_A}" transform="translate(1040,1350) rotate(-40)"/>
    <path d="${leaf(45, 110)}" fill="${LEAF_A}" transform="translate(1060,1310) rotate(-65)"/>
    <path d="${leaf(38,  95)}" fill="${LEAF_B}" transform="translate(1080,1270) rotate(-85)"/>
    <path d="${leaf(50, 120)}" fill="${LEAF_A}" transform="translate(1000,1345) rotate(-20)"/>
    <path d="${leaf(32,  80)}" fill="${LEAF_B}" transform="translate(970,1340)  rotate(-8)"/>
  </g>
  <g opacity="0.30">
    <path d="${leaf(48, 115)}" fill="${LEAF_A}" transform="translate(40,40)  rotate(135)"/>
    <path d="${leaf(38,  95)}" fill="${LEAF_A}" transform="translate(70,30)  rotate(155)"/>
    <path d="${leaf(30,  80)}" fill="${LEAF_B}" transform="translate(20,80)  rotate(110)"/>
  </g>
  <g opacity="0.20">
    <path d="${leaf(35, 90)}" fill="${LEAF_A}" transform="translate(1060,60)  rotate(210)"/>
    <path d="${leaf(28, 72)}" fill="${LEAF_B}" transform="translate(1040,100) rotate(195)"/>
  </g>
`;

const words = [
  {
    index: '01',
    word: 'Observation',
    line1: 'What you write down each day.',
    line2: 'A sensation, an appearance — something you actually noticed.',
  },
  {
    index: '02',
    word: 'Fertile Window',
    line1: 'The days in your cycle when conception is possible.',
    line2: 'Not predicted by an app — noticed by you.',
  },
  {
    index: '03',
    word: 'Peak Day',
    line1: 'The last day you notice your most fertile signs.',
    line2: 'An anchor point you look back on, not forward to.',
  },
  {
    index: '04',
    word: 'Post-Peak',
    line1: 'The days that follow peak day.',
    line2: 'When your fertile window closes and a new phase begins.',
  },
  {
    index: '05',
    word: 'Pattern',
    line1: 'What emerges when you chart consistently over time.',
    line2: 'Not one day — the story of many days together.',
  },
];

// "Fertile Window" and "Post-Peak" are two tokens — shrink font slightly so they fit
const wordFontSize = (word) => (word.length > 10 ? 86 : 104);

for (const { index, word, line1, line2 } of words) {
  const fz = wordFontSize(word);

  const overlay = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#F7EFE5"/>
      <stop offset="55%"  stop-color="#FAF4EC"/>
      <stop offset="100%" stop-color="#EEE0CC"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="45%">
      <stop offset="0%"   stop-color="#FFFFFF" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>

  ${botanicals}

  <!-- Slide counter top-left -->
  <text
    x="72" y="92"
    font-family="Arial, Helvetica, sans-serif"
    font-size="22" font-weight="400"
    fill="${HANDLE}" text-anchor="start" letter-spacing="2"
  >${index} / 05</text>

  <!-- Label top-right -->
  <text
    x="${WIDTH - 72}" y="92"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="22" font-weight="400" font-style="italic"
    fill="${HANDLE}" text-anchor="end" letter-spacing="1"
  >a charting glossary</text>

  <!-- Thin horizontal rule under header -->
  <line x1="72" y1="110" x2="${WIDTH - 72}" y2="110"
    stroke="${GOLD}" stroke-width="1" stroke-linecap="round" opacity="0.5"/>

  <!-- WORD — the hero -->
  <text
    x="${WIDTH / 2}" y="650"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="${fz}" font-weight="400"
    fill="${BROWN}" text-anchor="middle" letter-spacing="-0.5"
  >${word}</text>

  <!-- Gold accent rule -->
  <line
    x1="${WIDTH / 2 - 90}" y1="690"
    x2="${WIDTH / 2 + 90}" y2="690"
    stroke="${GOLD}" stroke-width="2" stroke-linecap="round"
  />

  <!-- Definition — line 1 -->
  <text
    x="${WIDTH / 2}" y="760"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="34" font-weight="400" font-style="italic"
    fill="${BROWN}" text-anchor="middle" opacity="0.75"
  >${line1}</text>

  <!-- Definition — line 2 -->
  <text
    x="${WIDTH / 2}" y="808"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="34" font-weight="400" font-style="italic"
    fill="${BROWN}" text-anchor="middle" opacity="0.75"
  >${line2}</text>

  <!-- Handle -->
  <text
    x="${WIDTH / 2}" y="${HEIGHT - 58}"
    font-family="Arial, Helvetica, sans-serif"
    font-size="24" font-weight="400"
    fill="${HANDLE}" text-anchor="middle" letter-spacing="3"
  >@wellwithinapp</text>

</svg>`;

  const slideNum = parseInt(index) + 1; // hook is slide-1, so words start at slide-2
  const outPath = join(__dirname, `slide-${slideNum}.jpg`);

  await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 4, background: BG } })
    .composite([{ input: Buffer.from(overlay), top: 0, left: 0 }])
    .jpeg({ quality: 93 })
    .toFile(outPath);

  console.log(`Done → slide-${slideNum}.jpg  (${word})`);
}

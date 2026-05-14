import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WIDTH  = 1080;
const HEIGHT = 1350;

const BG     = { r: 250, g: 244, b: 236, alpha: 1 }; // #FAF4EC
const BROWN  = '#3A2316';
const GOLD   = '#C9A882';
const HANDLE = '#9B7B5E';
const LEAF_A = '#7A8B5C';  // warm olive green — main leaves
const LEAF_B = '#A67C52';  // warm terracotta — accent / smaller leaves

// Organic leaf bezier — reusable shape, caller applies transform
const leaf = (w = 60, h = 120) =>
  `M0,0 C${-w * 0.5},${-h * 0.6} ${w * 0.5},${-h} ${w * 0.7},${-h * 0.75} C${w * 1.0},${-h * 0.5} ${w * 0.5},0 0,0`;

const overlay = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background gradient — warm and layered -->
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#F7EFE5"/>
      <stop offset="55%"  stop-color="#FAF4EC"/>
      <stop offset="100%" stop-color="#EEE0CC"/>
    </linearGradient>
    <!-- Radial glow in centre — lifts the mid section -->
    <radialGradient id="glow" cx="50%" cy="55%" r="45%">
      <stop offset="0%"   stop-color="#FFFFFF" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>

  <!-- ── BOTANICAL ELEMENTS ──────────────────────────────────────── -->

  <!-- Bottom-right cluster: large olive-green leaves fanning out from corner -->
  <g opacity="0.52">
    <path d="${leaf(55, 130)}" fill="${LEAF_A}" transform="translate(1040,1350) rotate(-40)"/>
    <path d="${leaf(45, 110)}" fill="${LEAF_A}" transform="translate(1060,1310) rotate(-65)"/>
    <path d="${leaf(38,  95)}" fill="${LEAF_B}" transform="translate(1080,1270) rotate(-85)"/>
    <path d="${leaf(50, 120)}" fill="${LEAF_A}" transform="translate(1000,1345) rotate(-20)"/>
    <path d="${leaf(32,  80)}" fill="${LEAF_B}" transform="translate(970,1340)  rotate(-8)"/>
  </g>

  <!-- Top-left cluster — olive main, terracotta accent -->
  <g opacity="0.45">
    <path d="${leaf(48, 115)}" fill="${LEAF_A}" transform="translate(40,40)  rotate(135)"/>
    <path d="${leaf(38,  95)}" fill="${LEAF_A}" transform="translate(70,30)  rotate(155)"/>
    <path d="${leaf(30,  80)}" fill="${LEAF_B}" transform="translate(20,80)  rotate(110)"/>
  </g>

  <!-- Top-right pair — lighter presence, terracotta -->
  <g opacity="0.30">
    <path d="${leaf(35, 90)}" fill="${LEAF_A}" transform="translate(1060,60)  rotate(210)"/>
    <path d="${leaf(28, 72)}" fill="${LEAF_B}" transform="translate(1040,100) rotate(195)"/>
  </g>

  <!-- ── CONTENT ────────────────────────────────────────────────── -->

  <!-- Label -->
  <text
    x="${WIDTH / 2}" y="470"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="26" font-weight="400" font-style="italic"
    fill="${HANDLE}" text-anchor="middle" letter-spacing="1"
  >a charting glossary</text>

  <!-- Rule under label -->
  <line
    x1="${WIDTH / 2 - 62}" y1="492"
    x2="${WIDTH / 2 + 62}" y2="492"
    stroke="${GOLD}" stroke-width="1.5" stroke-linecap="round"
  />

  <!-- Large display "5" -->
  <text
    x="${WIDTH / 2}" y="660"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="200" font-weight="400"
    fill="${BROWN}" text-anchor="middle"
  >5</text>

  <!-- Headline — line 1 -->
  <text
    x="${WIDTH / 2}" y="740"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="44" font-weight="400"
    fill="${BROWN}" text-anchor="middle" letter-spacing="0.3"
  >words that make fertility</text>

  <!-- Headline — line 2: "charting click." with inline italic tspan -->
  <text
    x="${WIDTH / 2}" y="800"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="44" font-weight="400"
    fill="${BROWN}" text-anchor="middle" letter-spacing="0.3"
  >charting <tspan font-style="italic">click.</tspan></text>

  <!-- Gold accent rule -->
  <line
    x1="${WIDTH / 2 - 82}" y1="842"
    x2="${WIDTH / 2 + 82}" y2="842"
    stroke="${GOLD}" stroke-width="2" stroke-linecap="round"
  />

  <!-- Swipe nudge -->
  <text
    x="${WIDTH / 2}" y="892"
    font-family="Arial, Helvetica, sans-serif"
    font-size="22" font-weight="400"
    fill="${HANDLE}" text-anchor="middle" letter-spacing="1.5"
  >swipe to learn them →</text>

  <!-- Handle -->
  <text
    x="${WIDTH / 2}" y="${HEIGHT - 58}"
    font-family="Arial, Helvetica, sans-serif"
    font-size="24" font-weight="400"
    fill="${HANDLE}" text-anchor="middle" letter-spacing="3"
  >@wellwithinapp</text>

</svg>
`;

await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 4, background: BG } })
  .composite([{ input: Buffer.from(overlay), top: 0, left: 0 }])
  .jpeg({ quality: 93 })
  .toFile(join(__dirname, 'slide-1-hook.jpg'));

console.log('Done → slide-1-hook.jpg');

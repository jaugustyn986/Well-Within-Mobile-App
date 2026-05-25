/**
 * Post: A Charting App Should Help You Notice, Not Guess
 * Format: Text-on-screen slideshow Reel — 5 slides, 1080 × 1350 JPEG
 * Visual system: botanical typographic — warm cream, Georgia serif, gold, olive/terracotta
 * Diagonal: bottom-right primary cluster / top-left secondary (unique per post)
 */
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const W = 1080;
const H = 1350;

const BG    = { r: 250, g: 244, b: 236, alpha: 1 };
const BROWN = '#3A2316';
const GOLD  = '#C9A882';
const SAGE  = '#7A8B5C';
const TERRA = '#A67C52';
const DIM   = '#9B7B5E';

const leaf = (w = 60, h = 120) =>
  `M0,0 C${-w * 0.5},${-h * 0.6} ${w * 0.5},${-h} ${w * 0.7},${-h * 0.75} C${w * 1.0},${-h * 0.5} ${w * 0.5},0 0,0`;

const BOTS = `
  <!-- Primary cluster — bottom-right -->
  <g opacity="0.40">
    <path d="${leaf(60,140)}" fill="${SAGE}"  transform="translate(1080,1350) rotate(-50)"/>
    <path d="${leaf(50,120)}" fill="${SAGE}"  transform="translate(1050,1320) rotate(-30)"/>
    <path d="${leaf(42,100)}" fill="${TERRA}" transform="translate(1080,1300) rotate(-65)"/>
    <path d="${leaf(54,128)}" fill="${SAGE}"  transform="translate(1020,1345) rotate(-18)"/>
    <path d="${leaf(34, 85)}" fill="${TERRA}" transform="translate(1000,1290) rotate(-40)"/>
  </g>
  <!-- Secondary cluster — top-left -->
  <g opacity="0.30">
    <path d="${leaf(50,120)}" fill="${SAGE}"  transform="translate(0,0)   rotate(140)"/>
    <path d="${leaf(40,100)}" fill="${SAGE}"  transform="translate(28,32) rotate(155)"/>
    <path d="${leaf(32, 80)}" fill="${TERRA}" transform="translate(0,55)  rotate(120)"/>
    <path d="${leaf(44,108)}" fill="${SAGE}"  transform="translate(60,8)  rotate(165)"/>
  </g>
  <!-- Faint accent — top-right -->
  <g opacity="0.12">
    <path d="${leaf(36, 90)}" fill="${SAGE}"  transform="translate(1060,10) rotate(220)"/>
    <path d="${leaf(26, 65)}" fill="${TERRA}" transform="translate(1035,40) rotate(240)"/>
  </g>`;

const DEFS = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#F8EEE0"/>
      <stop offset="50%"  stop-color="#FAF4EC"/>
      <stop offset="100%" stop-color="#EEE0C8"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="48%" r="52%">
      <stop offset="0%"   stop-color="#FFFFFF" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>`;

const LABEL = `
  <text x="${W - 72}" y="88"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="20" font-style="italic"
    fill="${DIM}" text-anchor="end" letter-spacing="1">charting, not guessing</text>
  <line x1="72" y1="108" x2="${W - 72}" y2="108"
    stroke="${GOLD}" stroke-width="0.8" opacity="0.45"/>`;

const HANDLE = `
  <text x="${W / 2}" y="${H - 56}"
    font-family="Arial, Helvetica, sans-serif" font-size="24"
    fill="${DIM}" text-anchor="middle" letter-spacing="3">@wellwithinapp</text>`;

async function render(body, file) {
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  await sharp({ create: { width: W, height: H, channels: 4, background: BG } })
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 93 })
    .toFile(join(__dirname, file));
  console.log(`  ✓  ${file}`);
}

// ──────────────────────────────────────────────────────────────
// SLIDE 1 — HOOK
// ──────────────────────────────────────────────────────────────
await render(`
  ${DEFS}${BOTS}${LABEL}

  <text x="${W / 2}" y="460"
    font-family="Arial, Helvetica, sans-serif" font-size="24"
    fill="${DIM}" text-anchor="middle" letter-spacing="3">most apps</text>

  <text x="${W / 2}" y="580"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="128" font-style="italic"
    fill="${BROWN}" text-anchor="middle">Guess.</text>

  <line x1="${W / 2 - 140}" y1="614" x2="${W / 2 + 140}" y2="614"
    stroke="${GOLD}" stroke-width="2.5" stroke-linecap="round"/>

  <text x="${W / 2}" y="694"
    font-family="Georgia, 'Times New Roman', serif" font-size="42"
    fill="${BROWN}" text-anchor="middle">This one helps you</text>

  <text x="${W / 2}" y="756"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="42" font-style="italic"
    fill="${BROWN}" text-anchor="middle">notice.</text>

  <text x="${W / 2}" y="870"
    font-family="Arial, Helvetica, sans-serif" font-size="21"
    fill="${DIM}" text-anchor="middle" letter-spacing="2" opacity="0.75">watch to see the difference</text>

  ${HANDLE}
`, 'slide-1.jpg');

// ──────────────────────────────────────────────────────────────
// SLIDE 2 — THE CONTRAST
// ──────────────────────────────────────────────────────────────
await render(`
  ${DEFS}${BOTS}${LABEL}

  <!-- Left col: Predict -->
  <text x="${W / 2 - 10}" y="420"
    font-family="Arial, Helvetica, sans-serif" font-size="20"
    fill="${TERRA}" text-anchor="middle" letter-spacing="3">AN ALGORITHM</text>

  <text x="${W / 2 - 10}" y="524"
    font-family="Georgia, 'Times New Roman', serif" font-size="88" font-style="italic"
    fill="${BROWN}" text-anchor="middle">predicts.</text>

  <!-- Divider rule -->
  <line x1="${W / 2 - 180}" y1="570" x2="${W / 2 + 180}" y2="570"
    stroke="${GOLD}" stroke-width="1.5" opacity="0.6"/>

  <!-- Right col: Notice -->
  <text x="${W / 2}" y="636"
    font-family="Arial, Helvetica, sans-serif" font-size="20"
    fill="${SAGE}" text-anchor="middle" letter-spacing="3">CHARTING</text>

  <text x="${W / 2}" y="740"
    font-family="Georgia, 'Times New Roman', serif" font-size="52"
    fill="${BROWN}" text-anchor="middle">records what's</text>

  <text x="${W / 2}" y="808"
    font-family="Georgia, 'Times New Roman', serif" font-size="52" font-style="italic"
    fill="${BROWN}" text-anchor="middle">actually there.</text>

  ${HANDLE}
`, 'slide-2.jpg');

// ──────────────────────────────────────────────────────────────
// SLIDE 3 — THE HABIT
// ──────────────────────────────────────────────────────────────
await render(`
  ${DEFS}${BOTS}${LABEL}

  <text x="${W / 2}" y="420"
    font-family="Georgia, 'Times New Roman', serif" font-size="68"
    fill="${BROWN}" text-anchor="middle">One sign.</text>

  <text x="${W / 2}" y="510"
    font-family="Georgia, 'Times New Roman', serif" font-size="68"
    fill="${BROWN}" text-anchor="middle">One day.</text>

  <line x1="${W / 2 - 120}" y1="548" x2="${W / 2 + 120}" y2="548"
    stroke="${GOLD}" stroke-width="2" stroke-linecap="round"/>

  <text x="${W / 2}" y="640"
    font-family="Georgia, 'Times New Roman', serif" font-size="42"
    fill="${BROWN}" text-anchor="middle">Real patterns —</text>

  <text x="${W / 2}" y="700"
    font-family="Georgia, 'Times New Roman', serif" font-size="42" font-style="italic"
    fill="${BROWN}" text-anchor="middle">over time.</text>

  <text x="${W / 2}" y="820"
    font-family="Arial, Helvetica, sans-serif" font-size="22"
    fill="${DIM}" text-anchor="middle" letter-spacing="1" opacity="0.80">Not an estimate. Yours.</text>

  ${HANDLE}
`, 'slide-3.jpg');

// ──────────────────────────────────────────────────────────────
// SLIDE 4 — THE REFRAME
// ──────────────────────────────────────────────────────────────
await render(`
  ${DEFS}${BOTS}${LABEL}

  <text x="${W / 2}" y="470"
    font-family="Arial, Helvetica, sans-serif" font-size="24"
    fill="${DIM}" text-anchor="middle" letter-spacing="3">your cycle is</text>

  <text x="${W / 2}" y="600"
    font-family="Georgia, 'Times New Roman', serif" font-size="86"
    fill="${BROWN}" text-anchor="middle">not a forecast</text>

  <text x="${W / 2}" y="680"
    font-family="Georgia, 'Times New Roman', serif" font-size="86"
    fill="${BROWN}" text-anchor="middle">to solve.</text>

  <line x1="${W / 2 - 150}" y1="716" x2="${W / 2 + 150}" y2="716"
    stroke="${GOLD}" stroke-width="2" stroke-linecap="round"/>

  <text x="${W / 2}" y="800"
    font-family="Georgia, 'Times New Roman', serif" font-size="52" font-style="italic"
    fill="${BROWN}" text-anchor="middle">It's a pattern</text>

  <text x="${W / 2}" y="864"
    font-family="Georgia, 'Times New Roman', serif" font-size="52" font-style="italic"
    fill="${BROWN}" text-anchor="middle">you learn to notice.</text>

  ${HANDLE}
`, 'slide-4.jpg');

// ──────────────────────────────────────────────────────────────
// SLIDE 5 — CTA
// ──────────────────────────────────────────────────────────────
await render(`
  ${DEFS}${BOTS}${LABEL}

  <text x="${W / 2}" y="430"
    font-family="Georgia, 'Times New Roman', serif" font-size="68"
    fill="${BROWN}" text-anchor="middle">Fertility charting,</text>

  <text x="${W / 2}" y="520"
    font-family="Georgia, 'Times New Roman', serif" font-size="68" font-style="italic"
    fill="${BROWN}" text-anchor="middle">without the</text>

  <text x="${W / 2}" y="610"
    font-family="Georgia, 'Times New Roman', serif" font-size="68" font-style="italic"
    fill="${BROWN}" text-anchor="middle">guesswork.</text>

  <line x1="${W / 2 - 160}" y1="648" x2="${W / 2 + 160}" y2="648"
    stroke="${GOLD}" stroke-width="2" stroke-linecap="round"/>

  <text x="${W / 2}" y="736"
    font-family="Arial, Helvetica, sans-serif" font-size="26"
    fill="${DIM}" text-anchor="middle" letter-spacing="2">Well Within</text>

  <text x="${W / 2}" y="808"
    font-family="Georgia, 'Times New Roman', serif" font-size="30" font-style="italic"
    fill="${DIM}" text-anchor="middle">Save this. Follow for more.</text>

  <text x="${W / 2}" y="880"
    font-family="Georgia, 'Times New Roman', serif" font-size="30" font-style="italic"
    fill="${DIM}" text-anchor="middle">Download from the link in bio.</text>

  ${HANDLE}
`, 'slide-5.jpg');

console.log('\nAll 5 slides done.');

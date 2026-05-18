/**
 * Post: What Fertility Charting Can And Cannot Tell You
 * Format: 5-slide carousel, 1080 × 1350 JPEG
 * System: botanical typographic (warm cream, Georgia serif, gold, olive/terracotta)
 */
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const W = 1080;
const H = 1350;

const BG     = { r: 250, g: 244, b: 236, alpha: 1 };
const BROWN  = '#3A2316';
const GOLD   = '#C9A882';
const HANDLE = '#9B7B5E';
const OLIVE  = '#7A8B5C';
const TERRA  = '#A67C52';

const leaf = (w = 60, h = 120) =>
  `M0,0 C${-w * 0.5},${-h * 0.6} ${w * 0.5},${-h} ${w * 0.7},${-h * 0.75} C${w * 1.0},${-h * 0.5} ${w * 0.5},0 0,0`;

// Botanical arrangement: primary cluster TOP-RIGHT, secondary BOTTOM-LEFT
// This is the opposite diagonal from the five-words glossary (which was bottom-right / top-left)
const BOTS = `
  <!-- Primary cluster — top-right corner, fanning inward -->
  <g opacity="0.42">
    <path d="${leaf(58,135)}" fill="${OLIVE}" transform="translate(1080,0)   rotate(220)"/>
    <path d="${leaf(48,118)}" fill="${OLIVE}" transform="translate(1050,30)  rotate(200)"/>
    <path d="${leaf(40,100)}" fill="${TERRA}" transform="translate(1080,55)  rotate(235)"/>
    <path d="${leaf(52,125)}" fill="${OLIVE}" transform="translate(1020,8)   rotate(245)"/>
    <path d="${leaf(34, 85)}" fill="${TERRA}" transform="translate(1000,50)  rotate(215)"/>
  </g>
  <!-- Secondary cluster — bottom-left corner -->
  <g opacity="0.32">
    <path d="${leaf(50,120)}" fill="${OLIVE}" transform="translate(0,1350)   rotate(50)"/>
    <path d="${leaf(40,100)}" fill="${OLIVE}" transform="translate(30,1320)  rotate(35)"/>
    <path d="${leaf(32, 82)}" fill="${TERRA}" transform="translate(0,1290)   rotate(65)"/>
    <path d="${leaf(44,108)}" fill="${OLIVE}" transform="translate(55,1345)  rotate(22)"/>
  </g>
  <!-- Light accent — bottom-right, very faint -->
  <g opacity="0.14">
    <path d="${leaf(38, 95)}" fill="${OLIVE}" transform="translate(1060,1340) rotate(-30)"/>
    <path d="${leaf(28, 70)}" fill="${TERRA}" transform="translate(1035,1310) rotate(-55)"/>
  </g>`;

// Slightly warmer, more golden background vs. the cooler five-words cream
const DEFS = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#F5E8D5"/>
      <stop offset="50%"  stop-color="#F8EEE0"/>
      <stop offset="100%" stop-color="#E8D4B8"/>
    </linearGradient>
    <radialGradient id="glow" cx="38%" cy="52%" r="50%">
      <stop offset="0%"   stop-color="#FFFFFF" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>`;

const HDR = (n, label) => `
  <text x="72" y="92" font-family="Arial, Helvetica, sans-serif" font-size="22"
    fill="${HANDLE}" text-anchor="start" letter-spacing="2">0${n} / 05</text>
  <text x="${W - 72}" y="92" font-family="Georgia, 'Times New Roman', serif" font-size="22"
    font-style="italic" fill="${HANDLE}" text-anchor="end" letter-spacing="1">${label}</text>
  <line x1="72" y1="110" x2="${W - 72}" y2="110" stroke="${GOLD}" stroke-width="1" opacity="0.5"/>`;

const HDL = `
  <text x="${W / 2}" y="${H - 58}" font-family="Arial, Helvetica, sans-serif" font-size="24"
    fill="${HANDLE}" text-anchor="middle" letter-spacing="3">@wellwithinapp</text>`;

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
  ${DEFS}${BOTS}${HDR(1, 'an honest take')}

  <!-- Topic anchor — the keyword, large and clear -->
  <text x="${W / 2}" y="530"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="86"
    fill="${BROWN}" text-anchor="middle">Fertility Charting</text>

  <!-- Gold rule -->
  <line x1="${W / 2 - 160}" y1="570" x2="${W / 2 + 160}" y2="570"
    stroke="${GOLD}" stroke-width="2" stroke-linecap="round"/>

  <!-- Contrast lines — the premise -->
  <text x="${W / 2}" y="645"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="42"
    fill="${BROWN}" text-anchor="middle">What it can tell you.</text>

  <text x="${W / 2}" y="700"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="42" font-style="italic"
    fill="${BROWN}" text-anchor="middle" opacity="0.75">vs. what it can't.</text>

  <text x="${W / 2}" y="800"
    font-family="Arial, Helvetica, sans-serif" font-size="22"
    fill="${HANDLE}" text-anchor="middle" letter-spacing="2">swipe to find out  →</text>

  ${HDL}
`, 'slide-1.jpg');

// ──────────────────────────────────────────────────────────────
// SLIDE 2 — TWO-COLUMN COMPARISON
// ──────────────────────────────────────────────────────────────
// Column centers
const LX = 270;  // left (CAN)
const RX = 810;  // right (CAN'T)

// All items pre-wrapped at font-size 28, ~400px inner width per col
// (400 / (28 × 0.52) ≈ 27 chars safe limit)
const ITEM_Y = [360, 618, 876];  // baseline of first line per item row

const canLines  = [
  ['When fertile signs', 'are present'],
  ['How your cycle', 'behaves over time'],
  ["What's normal for you"],
];
const cantLines = [
  ['Predict ovulation', 'before it happens'],
  ['Diagnose a', 'health condition'],
  ['Replace your', 'care provider'],
];

function colSVG(items, x, yStarts, fill) {
  let out = '';
  for (let i = 0; i < items.length; i++) {
    let y = yStarts[i];
    for (const line of items[i]) {
      out += `<text x="${x}" y="${y}" font-family="Georgia, 'Times New Roman', serif"
        font-size="28" fill="${fill}" text-anchor="middle">${line}</text>\n`;
      y += 38;
    }
  }
  return out;
}

await render(`
  ${DEFS}${BOTS}${HDR(2, 'an honest take')}

  <!-- Column headers -->
  <text x="${LX}" y="195" font-family="Arial, Helvetica, sans-serif" font-size="18"
    fill="${OLIVE}" text-anchor="middle" letter-spacing="3">CAN TELL YOU</text>
  <text x="${RX}" y="195" font-family="Arial, Helvetica, sans-serif" font-size="18"
    fill="${TERRA}" text-anchor="middle" letter-spacing="3">CAN'T TELL YOU</text>

  <!-- Rule under column headers -->
  <line x1="72" y1="218" x2="${W - 72}" y2="218" stroke="${GOLD}" stroke-width="1" opacity="0.45"/>

  <!-- Vertical gold divider -->
  <line x1="540" y1="130" x2="540" y2="1200" stroke="${GOLD}" stroke-width="1" opacity="0.4"/>

  <!-- CAN items -->
  ${colSVG(canLines, LX, ITEM_Y, BROWN)}

  <!-- CAN'T items -->
  ${colSVG(cantLines, RX, ITEM_Y, BROWN)}

  <!-- Row separators — only inside each column half -->
  <line x1="100" y1="510" x2="510" y2="510" stroke="${GOLD}" stroke-width="0.8" opacity="0.3"/>
  <line x1="570" y1="510" x2="980" y2="510" stroke="${GOLD}" stroke-width="0.8" opacity="0.3"/>
  <line x1="100" y1="768" x2="510" y2="768" stroke="${GOLD}" stroke-width="0.8" opacity="0.3"/>
  <line x1="570" y1="768" x2="980" y2="768" stroke="${GOLD}" stroke-width="0.8" opacity="0.3"/>

  <!-- Closing note -->
  <line x1="72" y1="1040" x2="${W - 72}" y2="1040" stroke="${GOLD}" stroke-width="1" opacity="0.4"/>
  <text x="${W / 2}" y="1082" font-family="Georgia, 'Times New Roman', serif"
    font-size="22" font-style="italic" fill="${HANDLE}" text-anchor="middle">
    based on what you observe — not an algorithm
  </text>

  ${HDL}
`, 'slide-2.jpg');

// Left margin for editorial slides — creates journal-note feel vs. centered glossary cards
const LM = 108;

// ──────────────────────────────────────────────────────────────
// SLIDE 3 — WHAT CAN MEANS  (left-aligned editorial layout)
// ──────────────────────────────────────────────────────────────
await render(`
  ${DEFS}${BOTS}${HDR(3, 'an honest take')}

  <!-- Context label — left aligned -->
  <text x="${LM}" y="490"
    font-family="Georgia, 'Times New Roman', serif" font-size="24" font-style="italic"
    fill="${HANDLE}" text-anchor="start" letter-spacing="0.5">What charting can tell you</text>

  <!-- Short rule under label -->
  <line x1="${LM}" y1="510" x2="${LM + 220}" y2="510"
    stroke="${GOLD}" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>

  <!-- Hero word — left aligned, large -->
  <text x="${LM}" y="650"
    font-family="Georgia, 'Times New Roman', serif" font-size="118" font-style="italic"
    fill="${BROWN}" text-anchor="start">Notice.</text>

  <!-- Gold accent rule — left aligned, short -->
  <line x1="${LM}" y1="688" x2="${LM + 160}" y2="688"
    stroke="${GOLD}" stroke-width="2" stroke-linecap="round"/>

  <!-- Body copy — left aligned -->
  <text x="${LM}" y="754"
    font-family="Georgia, 'Times New Roman', serif" font-size="30"
    fill="${BROWN}" text-anchor="start" opacity="0.80">Charting gives you real observations.</text>

  <text x="${LM}" y="796"
    font-family="Georgia, 'Times New Roman', serif" font-size="30"
    fill="${BROWN}" text-anchor="start" opacity="0.80">Over time, those become patterns</text>

  <text x="${LM}" y="838"
    font-family="Georgia, 'Times New Roman', serif" font-size="30"
    fill="${BROWN}" text-anchor="start" opacity="0.80">you can actually read.</text>

  ${HDL}
`, 'slide-3.jpg');

// ──────────────────────────────────────────────────────────────
// SLIDE 4 — WHAT CAN'T MEANS  (left-aligned editorial layout)
// ──────────────────────────────────────────────────────────────
await render(`
  ${DEFS}${BOTS}${HDR(4, 'an honest take')}

  <!-- Context label — left aligned -->
  <text x="${LM}" y="490"
    font-family="Georgia, 'Times New Roman', serif" font-size="24" font-style="italic"
    fill="${HANDLE}" text-anchor="start" letter-spacing="0.5">What charting can't tell you</text>

  <!-- Short rule under label -->
  <line x1="${LM}" y1="510" x2="${LM + 220}" y2="510"
    stroke="${GOLD}" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>

  <!-- Hero word — left aligned, large, upright (contrasts slide 3 italic) -->
  <text x="${LM}" y="650"
    font-family="Georgia, 'Times New Roman', serif" font-size="118"
    fill="${BROWN}" text-anchor="start">Honest.</text>

  <!-- Gold accent rule -->
  <line x1="${LM}" y1="688" x2="${LM + 160}" y2="688"
    stroke="${GOLD}" stroke-width="2" stroke-linecap="round"/>

  <!-- Body copy — left aligned -->
  <text x="${LM}" y="754"
    font-family="Georgia, 'Times New Roman', serif" font-size="30"
    fill="${BROWN}" text-anchor="start" opacity="0.80">The best charting tools show you</text>

  <text x="${LM}" y="796"
    font-family="Georgia, 'Times New Roman', serif" font-size="30"
    fill="${BROWN}" text-anchor="start" opacity="0.80">what's there. They don't fill</text>

  <text x="${LM}" y="838"
    font-family="Georgia, 'Times New Roman', serif" font-size="30"
    fill="${BROWN}" text-anchor="start" opacity="0.80">gaps with guesses.</text>

  ${HDL}
`, 'slide-4.jpg');

// ──────────────────────────────────────────────────────────────
// SLIDE 5 — CLOSE / CTA  (left-aligned, large close)
// ──────────────────────────────────────────────────────────────
await render(`
  ${DEFS}${BOTS}${HDR(5, 'an honest take')}

  <!-- Main close — left aligned -->
  <text x="${LM}" y="530"
    font-family="Georgia, 'Times New Roman', serif" font-size="76"
    fill="${BROWN}" text-anchor="start">Honest tools.</text>

  <text x="${LM}" y="635"
    font-family="Georgia, 'Times New Roman', serif" font-size="76" font-style="italic"
    fill="${BROWN}" text-anchor="start">Real clarity.</text>

  <!-- Gold rule — left aligned -->
  <line x1="${LM}" y1="676" x2="${LM + 200}" y2="676"
    stroke="${GOLD}" stroke-width="2" stroke-linecap="round"/>

  <!-- CTA lines — left aligned -->
  <text x="${LM}" y="748"
    font-family="Georgia, 'Times New Roman', serif" font-size="28" font-style="italic"
    fill="${HANDLE}" text-anchor="start">Save this when comparing cycle apps.</text>

  <text x="${LM}" y="794"
    font-family="Georgia, 'Times New Roman', serif" font-size="28" font-style="italic"
    fill="${HANDLE}" text-anchor="start">Follow for calmer charting notes.</text>

  ${HDL}
`, 'slide-5.jpg');

console.log('\nAll 5 slides done.');

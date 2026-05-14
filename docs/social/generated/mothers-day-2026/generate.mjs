import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const OUT_DIR = path.dirname(fileURLToPath(import.meta.url));
const WIDTH = 1080;
const HEIGHT = 1350;

function overlaySvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="topVeil" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#FDF9F6" stop-opacity="0.74"/>
      <stop offset="28%"  stop-color="#FDF9F6" stop-opacity="0.42"/>
      <stop offset="55%"  stop-color="#FDF9F6" stop-opacity="0.0"/>
    </linearGradient>
    <linearGradient id="bottomVeil" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#1A0F0A" stop-opacity="0.0"/>
      <stop offset="100%" stop-color="#1A0F0A" stop-opacity="0.38"/>
    </linearGradient>
  </defs>

  <!-- Readability veils -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#topVeil)"/>
  <rect y="${HEIGHT - 180}" width="${WIDTH}" height="180" fill="url(#bottomVeil)"/>

  <!-- Primary: Happy Mother's Day. -->
  <text
    x="${WIDTH / 2}" y="148"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="70"
    font-weight="400"
    fill="#3A2316"
    text-anchor="middle"
    letter-spacing="-0.5"
  >Happy Mother&#x2019;s Day.</text>

  <!-- Accent line -->
  <line
    x1="${WIDTH / 2 - 52}" y1="174"
    x2="${WIDTH / 2 + 52}" y2="174"
    stroke="#C9A882" stroke-width="2.5" stroke-linecap="round"
  />

  <!-- Subline: two lines -->
  <text
    x="${WIDTH / 2}" y="230"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="37"
    font-weight="400"
    fill="#5C3D26"
    text-anchor="middle"
    font-style="italic"
  >To mothers and to those</text>
  <text
    x="${WIDTH / 2}" y="278"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="37"
    font-weight="400"
    fill="#5C3D26"
    text-anchor="middle"
    font-style="italic"
  >still on the way.</text>

  <!-- Handle -->
  <text
    x="${WIDTH / 2}" y="${HEIGHT - 52}"
    font-family="Arial, Helvetica, sans-serif"
    font-size="21"
    font-weight="400"
    fill="#F5EDE6"
    text-anchor="middle"
    letter-spacing="2.5"
  >@wellwithinapp</text>
</svg>`;
}

async function renderSlide() {
  const input = path.join(OUT_DIR, "assets", "candidate-pink-soft.jpg");

  const base = await sharp(input)
    .resize(WIDTH, HEIGHT, { fit: "cover", position: "top" })
    .modulate({ brightness: 1.02, saturation: 0.90 })
    .toBuffer();

  const overlay = Buffer.from(overlaySvg());
  const png = await sharp(base).composite([{ input: overlay }]).png().toBuffer();
  const jpg = await sharp(png).jpeg({ quality: 93 }).toBuffer();

  fs.writeFileSync(path.join(OUT_DIR, "slide-1.png"), png);
  fs.writeFileSync(path.join(OUT_DIR, "slide-1.jpg"), jpg);
  fs.writeFileSync(path.join(OUT_DIR, "slide-1.svg"), overlaySvg());

  console.log("Wrote slide-1.jpg");
  return jpg;
}

function writeCaption() {
  const caption = `Happy Mother\u2019s Day \u2014 to every kind.

To the mothers: we see what it took. The patience, the uncertainty, the love you already had before it was ever returned. We celebrate you today.

And to the women still on their way \u2014 hoping, waiting, wondering. This day can feel heavy. You are not forgotten.

We\u2019re here for your journey. However this day finds you.

\u2014 Well Within

#MothersDay #MothersDay2026 #TTCCommunity #FertilityJourney #TTC #FertilityAwareness #WomensHealth #TTCSupport #HappyMothersDay #WellWithin #WellWithinApp`;

  fs.writeFileSync(path.join(OUT_DIR, "caption.txt"), `${caption}\n`);
}

function writeCredits() {
  const lines = [
    "Photo credit:",
    "",
    "- slide-1.jpg background: candidate-pink-soft.jpg",
    "  Source: https://www.pexels.com/photo/931162/",
    "  Photographer: Pixabay",
    "  License: Pexels license, free to use",
    "",
  ];
  fs.writeFileSync(path.join(OUT_DIR, "assets", "PHOTO_CREDIT.txt"), lines.join("\n"));
}

async function main() {
  await renderSlide();
  writeCaption();
  writeCredits();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

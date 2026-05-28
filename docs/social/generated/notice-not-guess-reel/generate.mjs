/**
 * Notice-not-guess Reel generator
 * Format: 5-slide text-on-screen Reel, 1080×1350, journal-led aesthetic
 * Draft: "A Charting App Should Help You Notice, Not Guess"
 *
 * Run: node generate.mjs
 * After export, compile to video with: node generate.mjs --video
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { wrapWords, assertLinesFit } from "../lib/carousel-text.mjs";

const OUT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.join(OUT_DIR, "../learning-to-chart-starts-with-noticing-not-knowing/assets");

const WIDTH = 1080;
const HEIGHT = 1350;

const colors = {
  ink: "#3F3A36",
  secondary: "#5A5550",
  muted: "#6F6A65",
  warm: "#B89A8B",
  veil: "#F6F3EF",
  white: "#FFFFFF",
};

const slides = [
  {
    number: 1,
    // Warm blank paper — strong opening for hook copy
    source: "pexels-kaboompics-4207707.jpg",
    brightness: 1.05,
    saturation: 0.72,
    veilOpacity: 0.22,
    // Hook — large, anchored top-left
    title: "A charting app should help you notice, not guess.",
    titleSize: 62,
    titleX: 94,
    titleY: 148,
    titleMax: 760,
    support: null,
  },
  {
    number: 2,
    source: "pexels-messalaciulla-942872.jpg",
    brightness: 1.08,
    saturation: 0.62,
    veilOpacity: 0.14,
    title: "Prediction tells you what it thinks is happening.",
    titleSize: 54,
    titleX: 94,
    titleY: 254,
    titleMax: 680,
    support: null,
  },
  {
    number: 3,
    source: "pexels-dulce-espinoza-602900.jpg",
    brightness: 1.06,
    saturation: 0.70,
    veilOpacity: 0.16,
    title: "Observation shows you what you actually recorded.",
    titleSize: 54,
    titleX: 94,
    titleY: 294,
    titleMax: 680,
    support: null,
  },
  {
    number: 4,
    source: "pexels-cup-of-couple-7657880.jpg",
    brightness: 1.06,
    saturation: 0.65,
    veilOpacity: 0.18,
    title: "Your temperature.\nYour signs.\nYour pattern.",
    titleSize: 60,
    titleX: 94,
    titleY: 220,
    titleMax: 760,
    support: null,
    preWrapped: true,
  },
  {
    number: 5,
    source: "pexels-kaboompics-4210783.jpg",
    brightness: 1.05,
    saturation: 0.68,
    veilOpacity: 0.20,
    title: "That's what Well Within is for.",
    titleSize: 58,
    titleX: 94,
    titleY: 280,
    titleMax: 760,
    support: "@wellwithinapp",
    supportX: 94,
    supportY: 680,
    supportSize: 36,
    supportMax: 760,
  },
];

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function buildSvgText(lines, x, y, size, color, lineHeight = 1.25, weight = 400) {
  const lh = size * lineHeight;
  return lines
    .map(
      (line, i) =>
        `<text x="${x}" y="${y + i * lh}" font-size="${size}" font-weight="${weight}" fill="${color}">${line
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}</text>`,
    )
    .join("\n");
}

async function generateSlide(slide) {
  const sourcePath = path.join(ASSETS_DIR, slide.source);

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source photo not found: ${sourcePath}`);
  }

  // Load, resize, adjust background
  const bg = await sharp(sourcePath)
    .resize(WIDTH, HEIGHT, { fit: "cover", position: "centre" })
    .modulate({ brightness: slide.brightness, saturation: slide.saturation })
    .toBuffer();

  // Veil overlay (warm cream tint)
  const veilRgba = hexToRgb(colors.veil);
  const veilAlpha = Math.round(slide.veilOpacity * 255);
  const veil = await sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 4, background: { ...veilRgba, alpha: veilAlpha } },
  })
    .png()
    .toBuffer();

  const base = await sharp(bg).composite([{ input: veil, blend: "over" }]).toBuffer();

  // Build title lines
  let titleLines;
  if (slide.preWrapped) {
    titleLines = slide.title.split("\n");
  } else {
    titleLines = wrapWords(slide.title, slide.titleSize, slide.titleMax);
    assertLinesFit(titleLines, slide.titleSize, slide.titleMax, 0.52, `slide-${slide.number} title`);
  }

  // Build support lines
  let supportLines = [];
  if (slide.support) {
    supportLines = wrapWords(slide.support, slide.supportSize ?? 34, slide.supportMax ?? 680);
  }

  const titleSvg = buildSvgText(titleLines, slide.titleX, slide.titleY, slide.titleSize, colors.ink, 1.3, 400);
  const supportSvg = slide.support
    ? buildSvgText(supportLines, slide.supportX, slide.supportY, slide.supportSize ?? 34, colors.warm, 1.3, 400)
    : "";

  const svgOverlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <style>
    text {
      font-family: 'Cormorant Garamond', 'Cormorant', Georgia, 'Times New Roman', serif;
      letter-spacing: -0.01em;
    }
  </style>
  ${titleSvg}
  ${supportSvg}
</svg>`;

  const outPath = path.join(OUT_DIR, `slide-${slide.number}.jpg`);

  await sharp(base)
    .composite([{ input: Buffer.from(svgOverlay), blend: "over" }])
    .jpeg({ quality: 92 })
    .toFile(outPath);

  console.log(`✓ slide-${slide.number}.jpg`);
  return outPath;
}

async function main() {
  const buildVideo = process.argv.includes("--video");

  console.log("Generating notice-not-guess Reel slides…\n");

  const outPaths = [];
  for (const slide of slides) {
    outPaths.push(await generateSlide(slide));
  }

  console.log("\nAll slides exported.");

  if (buildVideo) {
    console.log("\nCompiling reel.mp4…");

    // Build concat list for ffmpeg
    const concatPath = path.join(OUT_DIR, "concat.txt");
    const lines = outPaths.map((p) => `file '${p}'\nduration 3.2`).join("\n");
    // Last frame needs a second entry without duration for ffmpeg concat
    const lastFrame = `file '${outPaths[outPaths.length - 1]}'`;
    fs.writeFileSync(concatPath, lines + "\n" + lastFrame + "\n");

    const videoPath = path.join(OUT_DIR, "reel.mp4");
    execSync(
      `ffmpeg -y -f concat -safe 0 -i "${concatPath}" -vf "scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=decrease,pad=${WIDTH}:${HEIGHT}:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -movflags +faststart "${videoPath}"`,
      { stdio: "inherit" }
    );

    const stat = fs.statSync(videoPath);
    console.log(`\n✓ reel.mp4 — ${Math.round(stat.size / 1024)}KB`);

    // Clean up concat file
    fs.unlinkSync(concatPath);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

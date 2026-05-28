/**
 * Notice-not-guess Reel generator  —  v2
 * Format: 5-slide text-on-photo carousel, 1080×1350, journal-led aesthetic
 * Visual system: diagonal gradient veil, Cormorant Garamond serif title,
 *   warm accent line, Arial support text, slide counter bottom-left.
 *
 * Run:         node generate.mjs
 * Build video: node generate.mjs --video
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { wrapWords, assertLinesFit } from "../lib/carousel-text.mjs";

const OUT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.join(OUT_DIR, "../learning-to-chart-starts-with-noticing-not-knowing/assets");
const TOTAL = 5;

const WIDTH = 1080;
const HEIGHT = 1350;

const colors = {
  ink: "#3F3A36",
  secondary: "#5A5550",
  muted: "#6F6A65",
  warm: "#B89A8B",
  veil: "#F6F3EF",
};

/**
 * Each slide:
 *   source       — filename in ASSETS_DIR
 *   position     — sharp crop anchor
 *   brightness / saturation / veilOpacity — image treatment
 *   title        — main serif heading
 *   titleSize, titleX, titleY, titleMax
 *   support      — smaller sans-serif body line(s), or null
 *   supportX, supportY, supportMax, supportSize
 *   preWrapped   — if true, split title on \n instead of word-wrapping
 */
const slides = [
  {
    number: 1,
    source: "pexels-kaboompics-4207707.jpg",
    position: "centre",
    brightness: 1.05,
    saturation: 0.76,
    veilOpacity: 0.18,
    title: "A charting app should help you notice, not guess.",
    titleSize: 66,
    titleX: 94,
    titleY: 148,
    titleMax: 780,
    support: "Observations you record — not estimates an algorithm makes for you.",
    supportX: 94,
    supportY: 560,
    supportMax: 680,
    supportSize: 30,
  },
  {
    number: 2,
    source: "pexels-messalaciulla-942872.jpg",
    position: "centre",
    brightness: 1.08,
    saturation: 0.62,
    veilOpacity: 0.12,
    title: "Prediction tells you what it thinks is happening.",
    titleSize: 56,
    titleX: 94,
    titleY: 180,
    titleMax: 680,
    support: "It fills the gaps with averages, not with what you actually noticed.",
    supportX: 94,
    supportY: 530,
    supportMax: 680,
    supportSize: 30,
  },
  {
    number: 3,
    source: "pexels-dulce-espinoza-602900.jpg",
    position: "centre",
    brightness: 1.06,
    saturation: 0.72,
    veilOpacity: 0.16,
    title: "Observation shows you what you recorded.",
    titleSize: 58,
    titleX: 94,
    titleY: 168,
    titleMax: 700,
    support: "Temperature. Signs. Written down on the day it happened.",
    supportX: 94,
    supportY: 510,
    supportMax: 660,
    supportSize: 30,
  },
  {
    number: 4,
    source: "pexels-cup-of-couple-7657880.jpg",
    position: "left",
    brightness: 1.05,
    saturation: 0.68,
    veilOpacity: 0.18,
    title: "Your temperature.\nYour signs.\nYour pattern.",
    titleSize: 62,
    titleX: 94,
    titleY: 148,
    titleMax: 780,
    preWrapped: true,
    support: "Nothing averaged across other people's cycles.",
    supportX: 94,
    supportY: 590,
    supportMax: 660,
    supportSize: 30,
  },
  {
    number: 5,
    source: "pexels-eva-bronzini-8059957.jpg",
    position: "centre",
    brightness: 1.05,
    saturation: 0.70,
    veilOpacity: 0.20,
    title: "That's what Well Within is for.",
    titleSize: 62,
    titleX: 94,
    titleY: 168,
    titleMax: 780,
    support: "Download from the link in bio and start your first chart today.",
    supportX: 94,
    supportY: 510,
    supportMax: 680,
    supportSize: 30,
  },
];

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildSerifLines(lines, x, y, size, color = colors.ink, lineHeight = 1.18) {
  const lh = size * lineHeight;
  return lines
    .map(
      (line, i) =>
        `<text x="${x}" y="${y + i * lh}" font-family="'Cormorant Garamond', Georgia, 'Times New Roman', serif" font-size="${size}" font-weight="400" fill="${color}">${escapeXml(line)}</text>`,
    )
    .join("\n");
}

function buildSansLines(lines, x, y, size, color = colors.secondary, lineHeight = 1.36) {
  const lh = size * lineHeight;
  return lines
    .map(
      (line, i) =>
        `<text x="${x}" y="${y + i * lh}" font-family="Arial, sans-serif" font-size="${size}" font-weight="400" fill="${color}">${escapeXml(line)}</text>`,
    )
    .join("\n");
}

function overlaySvg(slide, titleLines, supportLines) {
  const titleBlockHeight = titleLines.length * slide.titleSize * 1.18;
  const accentY = slide.titleY + titleBlockHeight + 16;

  const supportSvg =
    supportLines.length > 0
      ? buildSansLines(supportLines, slide.supportX, slide.supportY, slide.supportSize ?? 30)
      : "";

  // Diagonal gradient: heavy veil top-left fading to transparent bottom-right
  // so the photo bleeds through and the image stays alive
  const veilHigh = Math.min(slide.veilOpacity + 0.28, 0.62);
  const veilMid = slide.veilOpacity;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="vg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stop-color="${colors.veil}" stop-opacity="${veilHigh}"/>
      <stop offset="48%"  stop-color="${colors.veil}" stop-opacity="${veilMid}"/>
      <stop offset="100%" stop-color="${colors.veil}" stop-opacity="0.03"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#vg)"/>
  ${buildSerifLines(titleLines, slide.titleX, slide.titleY, slide.titleSize)}
  <line x1="${slide.titleX}" y1="${accentY}" x2="${slide.titleX + 96}" y2="${accentY}" stroke="${colors.warm}" stroke-width="4" stroke-linecap="round"/>
  ${supportSvg}
  <text x="72" y="1278" font-family="Arial, sans-serif" font-size="24" fill="${colors.muted}">${String(slide.number).padStart(2, "0")} / ${String(TOTAL).padStart(2, "0")}</text>
</svg>`;
}

async function generateSlide(slide) {
  const sourcePath = path.join(ASSETS_DIR, slide.source);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source photo not found: ${sourcePath}`);
  }

  const base = await sharp(sourcePath)
    .resize(WIDTH, HEIGHT, { fit: "cover", position: slide.position ?? "centre" })
    .modulate({ brightness: slide.brightness, saturation: slide.saturation })
    .toBuffer();

  const titleLines = slide.preWrapped
    ? slide.title.split("\n")
    : wrapWords(slide.title, slide.titleSize, slide.titleMax);

  assertLinesFit(titleLines, slide.titleSize, slide.titleMax, 0.52, `slide-${slide.number} title`);

  const supportLines =
    slide.support
      ? wrapWords(slide.support, slide.supportSize ?? 30, slide.supportMax ?? 680)
      : [];

  const svg = overlaySvg(slide, titleLines, supportLines);
  const outPath = path.join(OUT_DIR, `slide-${slide.number}.jpg`);

  await sharp(base)
    .composite([{ input: Buffer.from(svg), blend: "over" }])
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

  // Contact sheet
  const thumbW = 432;
  const thumbH = 540;
  const gap = 24;
  const sheetW = thumbW * TOTAL + gap * (TOTAL + 1);
  const sheetH = thumbH + gap * 2;

  const thumbs = await Promise.all(
    outPaths.map((p) =>
      sharp(p)
        .resize(thumbW, thumbH, { fit: "cover" })
        .jpeg({ quality: 85 })
        .toBuffer(),
    ),
  );

  await sharp({
    create: { width: sheetW, height: sheetH, channels: 3, background: "#F6F3EF" },
  })
    .composite(
      thumbs.map((input, i) => ({
        input,
        left: gap + i * (thumbW + gap),
        top: gap,
      })),
    )
    .jpeg({ quality: 90 })
    .toFile(path.join(OUT_DIR, "contact-sheet.jpg"));

  console.log("✓ contact-sheet.jpg");

  if (buildVideo) {
    console.log("\nCompiling reel.mp4…");
    const concatPath = path.join(OUT_DIR, "concat.txt");
    const concatLines =
      outPaths.map((p) => `file '${p}'\nduration 3.2`).join("\n") +
      `\nfile '${outPaths[outPaths.length - 1]}'`;
    fs.writeFileSync(concatPath, concatLines + "\n");

    const videoPath = path.join(OUT_DIR, "reel.mp4");
    execSync(
      `ffmpeg -y -f concat -safe 0 -i "${concatPath}" ` +
        `-vf "scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=decrease,pad=${WIDTH}:${HEIGHT}:(ow-iw)/2:(oh-ih)/2" ` +
        `-c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -movflags +faststart "${videoPath}"`,
      { stdio: "inherit" },
    );

    fs.unlinkSync(concatPath);
    const stat = fs.statSync(videoPath);
    console.log(`\n✓ reel.mp4 — ${Math.round(stat.size / 1024)} KB`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

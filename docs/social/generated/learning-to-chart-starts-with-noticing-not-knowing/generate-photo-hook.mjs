import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { assertLinesFit, wrapWords } from "../lib/carousel-text.mjs";

const OUT_DIR = path.dirname(fileURLToPath(import.meta.url));
const WIDTH = 1080;
const HEIGHT = 1350;
const BACKGROUND =
  "C:/Users/JimAugustyn/.cursor/projects/c-Users-JimAugustyn-Creighton-Modern-Charting/assets/learning-charting-hook-background-portrait.png";

const colors = {
  ink: "#3F3A36",
  secondary: "#5A5550",
  muted: "#6F6A65",
  warm: "#B89A8B",
  veil: "#F6F3EF",
};

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function textLines(lines, x, y, size, options = {}) {
  const {
    color = colors.ink,
    family = "Georgia, serif",
    weight = 500,
    lineHeight = 1.13,
  } = options;

  return lines
    .map((line, index) => {
      const dy = index === 0 ? 0 : index * size * lineHeight;
      return `<text x="${x}" y="${y + dy}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${color}">${escapeXml(line)}</text>`;
    })
    .join("\n");
}

function overlaySvg() {
  const title = "Learning to chart starts with noticing, not knowing.";
  const support = "Let the pattern build before you ask it to explain everything.";
  const titleLines = wrapWords(title, 66, 770, 0.5);
  const supportLines = wrapWords(support, 30, 690, 0.5);

  assertLinesFit(titleLines, 66, 770, 0.5, "hook title");
  assertLinesFit(supportLines, 30, 690, 0.5, "support line");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
    <defs>
      <linearGradient id="readability" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${colors.veil}" stop-opacity="0.72"/>
        <stop offset="48%" stop-color="${colors.veil}" stop-opacity="0.42"/>
        <stop offset="100%" stop-color="${colors.veil}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#readability)"/>
    <g transform="translate(94 226)">
      ${textLines(titleLines, 0, 0, 66)}
      <line x1="0" y1="${titleLines.length * 66 * 1.13 + 12}" x2="92" y2="${titleLines.length * 66 * 1.13 + 12}" stroke="${colors.warm}" stroke-width="4" stroke-linecap="round"/>
    </g>
    <g transform="translate(94 628)">
      ${textLines(supportLines, 0, 0, 30, {
        color: colors.secondary,
        family: "Arial, sans-serif",
        weight: 400,
        lineHeight: 1.36,
      })}
    </g>
    <text x="72" y="1242" font-family="Arial, sans-serif" font-size="24" fill="${colors.muted}">01 / 05</text>
  </svg>`;
}

async function buildPortraitBase() {
  const cover = await sharp(BACKGROUND)
    .resize(WIDTH, HEIGHT, {
      fit: "cover",
      position: "left",
    })
    .modulate({ brightness: 1.02, saturation: 0.88 })
    .toBuffer();

  return sharp(cover)
    .composite([
      {
        input: Buffer.from(
          `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
            <rect width="${WIDTH}" height="${HEIGHT}" fill="#F6F3EF" opacity="0.10"/>
          </svg>`,
        ),
      },
    ])
    .png()
    .toBuffer();
}

async function main() {
  const base = await buildPortraitBase();
  const overlay = Buffer.from(overlaySvg());
  const png = await sharp(base).composite([{ input: overlay }]).png().toBuffer();
  const jpg = await sharp(png).jpeg({ quality: 92 }).toBuffer();

  const pngPath = path.join(OUT_DIR, "slide-1-photo.png");
  const jpgPath = path.join(OUT_DIR, "slide-1-photo.jpg");
  const svgPath = path.join(OUT_DIR, "slide-1-photo-overlay.svg");

  fs.writeFileSync(svgPath, overlaySvg());
  fs.writeFileSync(pngPath, png);
  fs.writeFileSync(jpgPath, jpg);

  console.log(`Wrote ${svgPath}`);
  console.log(`Wrote ${pngPath}`);
  console.log(`Wrote ${jpgPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

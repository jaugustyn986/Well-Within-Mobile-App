import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { assertLinesFit, wrapWords } from "../lib/carousel-text.mjs";

const OUT_DIR = path.dirname(fileURLToPath(import.meta.url));
const WIDTH = 1080;
const HEIGHT = 1350;

const candidates = [
  {
    name: "stock-paper",
    source: path.join(OUT_DIR, "assets", "pexels-kaboompics-4207707.jpg"),
    position: "center",
    brightness: 1.08,
    saturation: 0.78,
    textY: 134,
    supportX: 294,
    supportY: 522,
    veilOpacity: 0.14,
  },
  {
    name: "stock-notebook",
    source: path.join(OUT_DIR, "assets", "pexels-messalaciulla-942872.jpg"),
    position: "top",
    brightness: 1.18,
    saturation: 0.58,
    textY: 168,
    supportX: 94,
    supportY: 562,
    veilOpacity: 0.42,
  },
];

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

function overlaySvg(candidate) {
  const title = "Learning to chart starts with noticing, not knowing.";
  const support = "Let the pattern build before you ask it to explain everything.";
  const titleLines = wrapWords(title, 66, 770, 0.5);
  const supportLines = wrapWords(support, 30, 690, 0.5);

  assertLinesFit(titleLines, 66, 770, 0.5, "hook title");
  assertLinesFit(supportLines, 30, 690, 0.5, "support line");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
    <defs>
      <linearGradient id="readability" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${colors.veil}" stop-opacity="${candidate.veilOpacity + 0.24}"/>
        <stop offset="46%" stop-color="${colors.veil}" stop-opacity="${candidate.veilOpacity}"/>
        <stop offset="100%" stop-color="${colors.veil}" stop-opacity="0.04"/>
      </linearGradient>
    </defs>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#readability)"/>
    <g transform="translate(94 ${candidate.textY})">
      ${textLines(titleLines, 0, 0, 66)}
      <line x1="0" y1="${titleLines.length * 66 * 1.13 + 12}" x2="92" y2="${titleLines.length * 66 * 1.13 + 12}" stroke="${colors.warm}" stroke-width="4" stroke-linecap="round"/>
    </g>
    <g transform="translate(${candidate.supportX ?? 94} ${candidate.supportY})">
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

async function renderCandidate(candidate) {
  const base = await sharp(candidate.source)
    .resize(WIDTH, HEIGHT, {
      fit: "cover",
      position: candidate.position,
    })
    .modulate({
      brightness: candidate.brightness,
      saturation: candidate.saturation,
    })
    .toBuffer();

  const overlay = Buffer.from(overlaySvg(candidate));
  const png = await sharp(base).composite([{ input: overlay }]).png().toBuffer();
  const jpg = await sharp(png).jpeg({ quality: 92 }).toBuffer();

  fs.writeFileSync(path.join(OUT_DIR, `${candidate.name}.png`), png);
  fs.writeFileSync(path.join(OUT_DIR, `${candidate.name}.jpg`), jpg);
  fs.writeFileSync(path.join(OUT_DIR, `${candidate.name}-overlay.svg`), overlaySvg(candidate));
}

async function main() {
  for (const candidate of candidates) {
    await renderCandidate(candidate);
    console.log(`Wrote ${candidate.name}.jpg`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

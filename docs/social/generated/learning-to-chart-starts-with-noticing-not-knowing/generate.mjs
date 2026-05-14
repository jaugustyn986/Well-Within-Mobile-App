import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { assertLinesFit, wrapWords } from "../lib/carousel-text.mjs";

const OUT_DIR = path.dirname(fileURLToPath(import.meta.url));
const WIDTH = 1080;
const HEIGHT = 1350;

const colors = {
  cream: "#F6F3EF",
  linen: "#F9F4EC",
  paper: "#FFFDF8",
  ink: "#3F3A36",
  secondary: "#5A5550",
  muted: "#8F867E",
  line: "#D9D0C8",
  warm: "#B89A8B",
  sage: "#9EAA98",
  shadow: "#D8CEC5",
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
    anchor = "start",
  } = options;

  return lines
    .map((line, index) => {
      const dy = index === 0 ? 0 : index * size * lineHeight;
      return `<text x="${x}" y="${y + dy}" text-anchor="${anchor}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${color}">${escapeXml(line)}</text>`;
    })
    .join("\n");
}

function backgroundTexture() {
  const threads = [];
  for (let i = 0; i < 84; i += 1) {
    const y = 18 + i * 16;
    const opacity = i % 2 === 0 ? 0.1 : 0.055;
    threads.push(`<path d="M0 ${y} C280 ${y - 14}, 620 ${y + 18}, 1080 ${y - 6}" stroke="${colors.shadow}" stroke-width="1" opacity="${opacity}" />`);
  }

  const flecks = [];
  for (let i = 0; i < 120; i += 1) {
    const x = (i * 83) % WIDTH;
    const y = (i * 137) % HEIGHT;
    const r = 0.8 + (i % 3) * 0.45;
    const opacity = 0.055 + (i % 4) * 0.012;
    flecks.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${colors.warm}" opacity="${opacity}" />`);
  }

  return `${threads.join("\n")}\n${flecks.join("\n")}`;
}

function notebookScene() {
  return `
    <g opacity="0.98">
      <path d="M0 842 C170 782 340 764 530 812 C720 860 900 810 1080 746 L1080 1350 L0 1350 Z" fill="${colors.linen}" opacity="0.72"/>
      <g transform="translate(130 806) rotate(-4)">
        <rect x="0" y="0" width="430" height="350" rx="22" fill="${colors.paper}" stroke="${colors.line}" stroke-width="2"/>
        <path d="M44 78 H366 M44 132 H348 M44 186 H366 M44 240 H320" stroke="${colors.line}" stroke-width="3" stroke-linecap="round" opacity="0.62"/>
        <path d="M92 292 C154 250 218 326 310 246" fill="none" stroke="${colors.sage}" stroke-width="5" stroke-linecap="round"/>
        <circle cx="92" cy="292" r="7" fill="${colors.sage}"/>
        <circle cx="206" cy="286" r="7" fill="${colors.warm}"/>
        <circle cx="310" cy="246" r="7" fill="${colors.sage}"/>
      </g>
      <g transform="translate(548 782) rotate(5)">
        <rect x="0" y="0" width="380" height="410" rx="24" fill="#FDF8F1" stroke="${colors.line}" stroke-width="2"/>
        <path d="M48 78 H324 M48 134 H314 M48 190 H324 M48 246 H282 M48 302 H304" stroke="${colors.line}" stroke-width="3" stroke-linecap="round" opacity="0.55"/>
        <path d="M22 0 C16 96 16 218 22 410" stroke="${colors.shadow}" stroke-width="6" opacity="0.38"/>
      </g>
      <g transform="translate(810 674) rotate(21)" opacity="0.82">
        <rect x="0" y="0" width="26" height="310" rx="13" fill="${colors.warm}"/>
        <path d="M13 312 L3 354 L23 354 Z" fill="${colors.ink}" opacity="0.72"/>
      </g>
    </g>`;
}

function slideSvg() {
  const title = "Learning to chart starts with noticing, not knowing.";
  const support = "Let the pattern build before you ask it to explain everything.";
  const titleLines = wrapWords(title, 68, 790, 0.5);
  const supportLines = wrapWords(support, 32, 720, 0.5);

  assertLinesFit(titleLines, 68, 790, 0.5, "hook title");
  assertLinesFit(supportLines, 32, 720, 0.5, "support line");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
    <defs>
      <linearGradient id="warmWash" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FFFDF8"/>
        <stop offset="54%" stop-color="${colors.cream}"/>
        <stop offset="100%" stop-color="#EEE6DD"/>
      </linearGradient>
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#CFC2B7" flood-opacity="0.22"/>
      </filter>
    </defs>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#warmWash)"/>
    ${backgroundTexture()}
    <circle cx="888" cy="188" r="260" fill="#FFFFFF" opacity="0.28"/>
    <circle cx="130" cy="1180" r="340" fill="#EDE3DA" opacity="0.34"/>

    <g transform="translate(94 164)">
      <text x="0" y="0" font-family="Arial, sans-serif" font-size="22" letter-spacing="8" font-weight="700" fill="${colors.muted}">FERTILITY CHARTING</text>
      <line x1="0" y1="34" x2="138" y2="34" stroke="${colors.warm}" stroke-width="4" stroke-linecap="round"/>
    </g>

    <g transform="translate(94 300)">
      ${textLines(titleLines, 0, 0, 68)}
    </g>

    <g transform="translate(98 620)">
      ${textLines(supportLines, 0, 0, 32, {
        color: colors.secondary,
        family: "Arial, sans-serif",
        weight: 400,
        lineHeight: 1.35,
      })}
    </g>

    <g filter="url(#softShadow)">
      ${notebookScene()}
    </g>

    <text x="72" y="1240" font-family="Arial, sans-serif" font-size="24" fill="${colors.muted}">01 / 05</text>
  </svg>`;
}

async function main() {
  const svg = slideSvg();
  const svgPath = path.join(OUT_DIR, "slide-1.svg");
  const pngPath = path.join(OUT_DIR, "slide-1.png");
  const jpgPath = path.join(OUT_DIR, "slide-1.jpg");

  fs.writeFileSync(svgPath, svg);
  await sharp(Buffer.from(svg)).png().toFile(pngPath);
  await sharp(Buffer.from(svg)).jpeg({ quality: 92 }).toFile(jpgPath);

  console.log(`Wrote ${svgPath}`);
  console.log(`Wrote ${pngPath}`);
  console.log(`Wrote ${jpgPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

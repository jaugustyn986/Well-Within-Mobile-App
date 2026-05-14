import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { assertLinesFit, wrapWords } from "../lib/carousel-text.mjs";

const OUT_DIR = path.dirname(fileURLToPath(import.meta.url));
const WIDTH = 1080;
const HEIGHT = 1350;

const colors = {
  ink: "#3F3A36",
  secondary: "#5A5550",
  muted: "#6F6A65",
  warm: "#B89A8B",
  veil: "#F6F3EF",
};

const slides = [
  {
    number: 1,
    source: "pexels-kaboompics-4207707.jpg",
    sourceUrl: "https://www.pexels.com/photo/blank-white-paper-sheet-on-wooden-table-4207707/",
    credit: "Kaboompics.com",
    position: "center",
    brightness: 1.08,
    saturation: 0.78,
    veilOpacity: 0.14,
    title: "Learning to chart starts with noticing, not knowing.",
    titleSize: 66,
    titleX: 94,
    titleY: 134,
    titleMax: 770,
    support: "Let the pattern build before you ask it to explain everything.",
    supportX: 294,
    supportY: 522,
    supportMax: 690,
  },
  {
    number: 2,
    source: "pexels-messalaciulla-942872.jpg",
    sourceUrl: "https://www.pexels.com/photo/notebook-with-blank-pages-942872/",
    credit: "Messala Ciulla",
    position: "center",
    brightness: 1.1,
    saturation: 0.62,
    veilOpacity: 0.1,
    title: "Begin with one clear observation.",
    titleSize: 58,
    titleX: 104,
    titleY: 254,
    titleMax: 390,
    support: "One detail is enough to start a charting habit.",
    supportX: 628,
    supportY: 356,
    supportMax: 360,
  },
  {
    number: 3,
    source: "pexels-dulce-espinoza-602900.jpg",
    sourceUrl: "https://www.pexels.com/photo/white-notepad-on-brown-surface-602900/",
    credit: "Dulce Espinoza",
    position: "center",
    brightness: 1.08,
    saturation: 0.72,
    veilOpacity: 0.16,
    title: "Write it down before you interpret it.",
    titleSize: 58,
    titleX: 142,
    titleY: 294,
    titleMax: 610,
    support: "Observation first. Meaning can come later.",
    supportX: 176,
    supportY: 600,
    supportMax: 520,
  },
  {
    number: 4,
    source: "pexels-cup-of-couple-7657880.jpg",
    sourceUrl: "https://www.pexels.com/photo/a-cup-of-coffee-sticky-note-and-notebook-on-a-table-7657880/",
    credit: "Cup of Couple",
    position: "left",
    brightness: 1.05,
    saturation: 0.7,
    veilOpacity: 0.18,
    title: "Let days sit beside days.",
    titleSize: 60,
    titleX: 92,
    titleY: 132,
    titleMax: 700,
    support: "That is how small notes become a pattern.",
    supportX: 92,
    supportY: 316,
    supportMax: 520,
  },
  {
    number: 5,
    source: "pexels-eva-bronzini-8059957.jpg",
    sourceUrl: "https://www.pexels.com/photo/blank-white-paper-on-leafy-background-8059957/",
    credit: "Eva Bronzini",
    position: "center",
    brightness: 1.09,
    saturation: 0.62,
    veilOpacity: 0.2,
    title: "Save this for your next charting day.",
    titleSize: 58,
    titleX: 152,
    titleY: 314,
    titleMax: 680,
    support: "Follow for calmer fertility charting notes.",
    supportX: 172,
    supportY: 640,
    supportMax: 560,
  },
];

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

function overlaySvg(slide) {
  const titleLines = wrapWords(slide.title, slide.titleSize, slide.titleMax, 0.5);
  const supportLines = wrapWords(slide.support, 30, slide.supportMax, 0.5);

  assertLinesFit(titleLines, slide.titleSize, slide.titleMax, 0.5, `slide ${slide.number} title`);
  assertLinesFit(supportLines, 30, slide.supportMax, 0.5, `slide ${slide.number} support`);

  const titleBlockHeight = titleLines.length * slide.titleSize * 1.13;
  const accentY = slide.titleY + titleBlockHeight + 12;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
    <defs>
      <linearGradient id="readability" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${colors.veil}" stop-opacity="${Math.min(slide.veilOpacity + 0.24, 0.58)}"/>
        <stop offset="52%" stop-color="${colors.veil}" stop-opacity="${slide.veilOpacity}"/>
        <stop offset="100%" stop-color="${colors.veil}" stop-opacity="0.03"/>
      </linearGradient>
    </defs>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#readability)"/>
    ${textLines(titleLines, slide.titleX, slide.titleY, slide.titleSize)}
    <line x1="${slide.titleX}" y1="${accentY}" x2="${slide.titleX + 92}" y2="${accentY}" stroke="${colors.warm}" stroke-width="4" stroke-linecap="round"/>
    ${textLines(supportLines, slide.supportX, slide.supportY, 30, {
      color: colors.secondary,
      family: "Arial, sans-serif",
      weight: 400,
      lineHeight: 1.36,
    })}
    <text x="72" y="1242" font-family="Arial, sans-serif" font-size="24" fill="${colors.muted}">${String(slide.number).padStart(2, "0")} / 05</text>
  </svg>`;
}

async function renderSlide(slide) {
  const input = path.join(OUT_DIR, "assets", slide.source);
  const base = await sharp(input)
    .resize(WIDTH, HEIGHT, {
      fit: "cover",
      position: slide.position,
    })
    .modulate({
      brightness: slide.brightness,
      saturation: slide.saturation,
    })
    .toBuffer();

  const overlay = Buffer.from(overlaySvg(slide));
  const png = await sharp(base).composite([{ input: overlay }]).png().toBuffer();
  const jpg = await sharp(png).jpeg({ quality: 92 }).toBuffer();
  const stem = `slide-${slide.number}`;

  fs.writeFileSync(path.join(OUT_DIR, `${stem}.png`), png);
  fs.writeFileSync(path.join(OUT_DIR, `${stem}.jpg`), jpg);
  fs.writeFileSync(path.join(OUT_DIR, `${stem}.svg`), overlaySvg(slide));

  return jpg;
}

async function renderContactSheet(jpegs) {
  const thumbWidth = 432;
  const thumbHeight = 540;
  const gap = 24;
  const sheetWidth = thumbWidth * 5 + gap * 6;
  const sheetHeight = thumbHeight + gap * 2;

  const thumbs = await Promise.all(
    jpegs.map((jpg) =>
      sharp(jpg)
        .resize(thumbWidth, thumbHeight, { fit: "cover" })
        .jpeg({ quality: 88 })
        .toBuffer(),
    ),
  );

  await sharp({
    create: {
      width: sheetWidth,
      height: sheetHeight,
      channels: 3,
      background: "#F6F3EF",
    },
  })
    .composite(
      thumbs.map((input, index) => ({
        input,
        left: gap + index * (thumbWidth + gap),
        top: gap,
      })),
    )
    .jpeg({ quality: 90 })
    .toFile(path.join(OUT_DIR, "contact-sheet.jpg"));
}

function writeCaption() {
  const caption = `Learning to chart starts with noticing, not knowing.

You do not have to understand the whole pattern before you begin.

Start with one clear observation. Write it down before you interpret it. Let the next day sit beside it.

Over time, the chart becomes easier to read because you gave the small details somewhere to go.

Save this for your next charting day.

#fertilitycharting #fertilityawareness #cyclecharting #bodyliteracy #naturalcyclesupport #wellwithinapp`;

  fs.writeFileSync(path.join(OUT_DIR, "caption.txt"), `${caption}\n`);
}

function writeCredits() {
  const lines = [
    "Stock sources used for final carousel:",
    "",
    ...slides.flatMap((slide) => [
      `- Slide ${slide.number}: \`${slide.source}\``,
      `  Source: ${slide.sourceUrl}`,
      `  Photographer/source: ${slide.credit}`,
      "  License: Pexels license, free to use",
      "",
    ]),
    "Rejected candidates:",
    "",
    "- `pexels-polina-kovaleva-5717418.jpg`",
    "  Source: https://www.pexels.com/photo/white-notebook-on-the-table-5717418/",
    "  Photographer: Polina Kovaleva",
    "  Reason: visible handwriting and darker stationery made it less suitable for a Well Within hook slide.",
    "",
    "- `pexels-torsten-dettlaff-195030.jpg`",
    "  Source: https://www.pexels.com/photo/white-calendar-on-white-surface-195030/",
    "  Photographer: Torsten Dettlaff",
    "  Reason: seasonal calendar imagery pulled the post away from daily charting.",
    "",
    "- `pexels-esra-nur-kalay-26647072.jpg`",
    "  Source: https://www.pexels.com/photo/cup-of-coffee-on-journal-by-flowers-and-flask-26647072/",
    "  Photographer: Esra Nur Kalay",
    "  Reason: visible magazine branding distracted from the charting message.",
    "",
    "- `pexels-bich-tran-1059383.jpg`",
    "  Source: https://www.pexels.com/photo/white-and-black-weekly-planner-on-gray-surface-1059383/",
    "  Photographer: Bich Tran",
    "  Reason: bold handwritten days and decorative borders competed with the overlay copy.",
    "",
  ];

  fs.writeFileSync(path.join(OUT_DIR, "assets", "PHOTO_CREDIT.txt"), lines.join("\n"));
}

async function main() {
  const jpegs = [];
  for (const slide of slides) {
    jpegs.push(await renderSlide(slide));
    console.log(`Wrote slide-${slide.number}.jpg`);
  }
  await renderContactSheet(jpegs);
  writeCaption();
  writeCredits();
  console.log("Wrote contact-sheet.jpg and caption.txt");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

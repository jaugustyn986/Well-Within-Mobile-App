import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import {
  CAROUSEL_SAFE,
  assertLinesFit,
  wrapBulletLines,
  wrapWords,
} from "../lib/carousel-text.mjs";

const OUT_DIR = path.dirname(fileURLToPath(import.meta.url));
const WIDTH = CAROUSEL_SAFE.canvasWidth;
const HEIGHT = CAROUSEL_SAFE.canvasHeight;

const colors = {
  page: "#F6F3EF",
  paper: "#FDFCFB",
  paperAlt: "#FBF7F1",
  ink: "#3F3A36",
  secondary: "#5A5550",
  muted: "#8F867E",
  line: "#E7E2DE",
  warm: "#B89A8B",
  warmLight: "#E7D8CF",
  sage: "#A7B5A2",
  sageLight: "#E9EFE6",
};

const slides = [
  {
    eyebrow: "A gentle distinction",
    title: ["Cycle tracking", "and fertility charting", "are not always", "the same thing."],
    note: "For anyone learning what charting actually means.",
    sketch: "split",
  },
  {
    eyebrow: "Cycle tracking",
    title: ["Tracking often", "starts with dates."],
    body: ["Period starts.", "Period ends.", "Maybe a predicted next cycle."],
    note: "Useful, but usually date-led.",
    sketch: "calendar",
  },
  {
    eyebrow: "Fertility charting",
    title: ["Fertility charting", "starts with daily", "observations."],
    body: ["What did you notice today?", "What changed from yesterday?"],
    note: "Observation first. Interpretation later.",
    sketch: "notebook",
  },
  {
    eyebrow: "What gets noticed",
    title: ["Sensation.", "Appearance.", "Pattern over time."],
    body: ["Simple words can make charting feel less overwhelming."],
    note: "Well Within keeps the language neutral and observable.",
    sketch: "labels",
  },
  {
    eyebrow: "A calmer frame",
    title: ["The goal is not", "to predict your body."],
    body: ["Your body does not need to match a forecast."],
    note: "No prediction claims. No pressure.",
    sketch: "forecast",
  },
  {
    eyebrow: "The real value",
    title: ["The goal is to", "notice your pattern", "more clearly."],
    body: ["One recorded day becomes more useful when it sits beside the next."],
    note: "Clarity grows through consistency.",
    sketch: "chart",
  },
  {
    eyebrow: "Save for later",
    title: ["Learning fertility", "charting?", "Start here."],
    body: ["Save this if you are learning to chart more clearly."],
    note: "Follow @wellwithinapp for calmer charting notes.",
    sketch: "bookmark",
  },
];

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function textLines(lines, x, y, size, weight = 500, lineHeight = 1.14, color = colors.ink, family = "Georgia") {
  return lines
    .map((line, index) => {
      const dy = index === 0 ? 0 : index * size * lineHeight;
      return `<text x="${x}" y="${y + dy}" font-family="${family}, serif" font-size="${size}" font-weight="${weight}" fill="${color}">${escapeXml(line)}</text>`;
    })
    .join("\n");
}

function bodyLines(lines = [], x, y) {
  return lines
    .map((line, index) => {
      const yy = y + index * 48;
      return `<text x="${x}" y="${yy}" font-family="Arial, sans-serif" font-size="34" fill="${colors.secondary}">${escapeXml(line)}</text>`;
    })
    .join("\n");
}

function renderFooter(note, index, total) {
  const noteLines = wrapWords(note, 28);
  assertLinesFit(noteLines, 28, CAROUSEL_SAFE.innerMaxPx, 0.52, "footer note");
  const noteSvg = noteLines
    .map(
      (line, i) =>
        `<text x="0" y="${64 + i * 34}" font-family="Arial, sans-serif" font-size="28" fill="${colors.secondary}">${escapeXml(line)}</text>`,
    )
    .join("\n");
  const handleY = 64 + noteLines.length * 34 + 28;
  return `
    <line x1="0" y1="0" x2="804" y2="0" stroke="${colors.line}" stroke-width="2"/>
    ${noteSvg}
    <text x="0" y="${handleY}" font-family="Arial, sans-serif" font-size="24" fill="${colors.muted}">@wellwithinapp</text>
    <text x="748" y="${handleY}" text-anchor="end" font-family="Arial, sans-serif" font-size="24" fill="${colors.muted}">${index + 1}/${total}</text>`;
}

function subtleTexture() {
  const marks = [];
  for (let i = 0; i < 90; i += 1) {
    const x = 52 + ((i * 97) % 976);
    const y = 44 + ((i * 149) % 1260);
    const opacity = 0.035 + ((i % 5) * 0.008);
    marks.push(`<circle cx="${x}" cy="${y}" r="${1 + (i % 3)}" fill="${colors.warm}" opacity="${opacity}" />`);
  }
  return marks.join("\n");
}

function sketch(type) {
  const common = `stroke="${colors.warm}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
  if (type === "split") {
    return `
      <g transform="translate(690 790)" opacity="0.92">
        <rect x="0" y="0" width="250" height="310" rx="22" fill="${colors.paperAlt}" stroke="${colors.line}" stroke-width="3"/>
        <line x1="42" y1="72" x2="208" y2="72" ${common}/>
        <line x1="42" y1="126" x2="150" y2="126" ${common}/>
        <path d="M50 206 C96 164 140 244 206 188" ${common}/>
        <circle cx="72" cy="236" r="8" fill="${colors.sage}" opacity="0.8"/>
        <circle cx="124" cy="218" r="8" fill="${colors.warm}" opacity="0.8"/>
        <circle cx="178" cy="194" r="8" fill="${colors.sage}" opacity="0.8"/>
      </g>`;
  }
  if (type === "calendar") {
    return `
      <g transform="translate(660 768)">
        <rect x="0" y="0" width="300" height="330" rx="28" fill="${colors.paperAlt}" stroke="${colors.line}" stroke-width="3"/>
        <line x1="0" y1="82" x2="300" y2="82" stroke="${colors.line}" stroke-width="3"/>
        ${[0, 1, 2, 3].map((row) => [0, 1, 2, 3].map((col) => `<circle cx="${58 + col * 62}" cy="${132 + row * 46}" r="9" fill="${row === 1 && col === 2 ? colors.warm : colors.line}"/>`).join("")).join("")}
        <path d="M82 286 H218" ${common}/>
      </g>`;
  }
  if (type === "notebook") {
    return `
      <g transform="translate(648 760)">
        <rect x="0" y="0" width="310" height="350" rx="24" fill="${colors.paperAlt}" stroke="${colors.line}" stroke-width="3"/>
        <path d="M58 70 H252 M58 126 H236 M58 182 H252 M58 238 H214" ${common} opacity="0.55"/>
        <circle cx="38" cy="72" r="7" fill="${colors.warmLight}"/>
        <circle cx="38" cy="128" r="7" fill="${colors.warmLight}"/>
        <circle cx="38" cy="184" r="7" fill="${colors.warmLight}"/>
        <path d="M206 276 C232 240 274 244 284 206" ${common}/>
      </g>`;
  }
  if (type === "labels") {
    return `
      <g transform="translate(640 770)">
        <rect x="0" y="0" width="332" height="74" rx="37" fill="${colors.sageLight}" stroke="${colors.line}" stroke-width="2"/>
        <rect x="34" y="118" width="260" height="74" rx="37" fill="${colors.paperAlt}" stroke="${colors.line}" stroke-width="2"/>
        <rect x="0" y="236" width="332" height="74" rx="37" fill="${colors.warmLight}" opacity="0.68" stroke="${colors.line}" stroke-width="2"/>
        <text x="54" y="48" font-family="Arial, sans-serif" font-size="28" fill="${colors.secondary}">sensation</text>
        <text x="88" y="166" font-family="Arial, sans-serif" font-size="28" fill="${colors.secondary}">appearance</text>
        <text x="76" y="284" font-family="Arial, sans-serif" font-size="28" fill="${colors.secondary}">pattern</text>
      </g>`;
  }
  if (type === "forecast") {
    return `
      <g transform="translate(650 774)">
        <rect x="0" y="0" width="320" height="320" rx="28" fill="${colors.paperAlt}" stroke="${colors.line}" stroke-width="3"/>
        <path d="M72 214 C112 162 162 252 240 118" stroke="${colors.muted}" stroke-width="4" fill="none" stroke-dasharray="10 12" stroke-linecap="round"/>
        <path d="M70 214 C118 208 158 190 242 172" ${common}/>
        <line x1="76" y1="74" x2="244" y2="74" stroke="${colors.line}" stroke-width="4"/>
        <text x="66" y="278" font-family="Arial, sans-serif" font-size="26" fill="${colors.muted}">notice, not forecast</text>
      </g>`;
  }
  if (type === "chart") {
    return `
      <g transform="translate(620 770)">
        <rect x="0" y="0" width="360" height="330" rx="28" fill="${colors.paperAlt}" stroke="${colors.line}" stroke-width="3"/>
        <line x1="58" y1="258" x2="304" y2="258" stroke="${colors.line}" stroke-width="4"/>
        <line x1="58" y1="76" x2="58" y2="258" stroke="${colors.line}" stroke-width="4"/>
        <path d="M72 224 C118 210 126 160 166 168 C210 176 214 112 282 104" ${common}/>
        <circle cx="72" cy="224" r="8" fill="${colors.sage}"/>
        <circle cx="166" cy="168" r="8" fill="${colors.warm}"/>
        <circle cx="282" cy="104" r="8" fill="${colors.sage}"/>
      </g>`;
  }
  return `
    <g transform="translate(675 770)">
      <rect x="0" y="0" width="250" height="320" rx="28" fill="${colors.paperAlt}" stroke="${colors.line}" stroke-width="3"/>
      <path d="M86 74 H190 V248 L138 210 L86 248 Z" fill="${colors.sageLight}" stroke="${colors.warm}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M56 286 H206" ${common} opacity="0.5"/>
    </g>`;
}

function slideSvg(slide, index) {
  const titleJoined = slide.title.join(" ");
  const titleLinesWrapped = wrapWords(titleJoined, 68);
  assertLinesFit(titleLinesWrapped, 68, CAROUSEL_SAFE.innerMaxPx, 0.52, "title");

  const bodyLinesWrapped = slide.body?.length ? wrapBulletLines(slide.body, 34) : [];
  if (bodyLinesWrapped.length) {
    assertLinesFit(bodyLinesWrapped, 34, CAROUSEL_SAFE.innerMaxPx, 0.52, "body");
  }

  const titleY = titleLinesWrapped.length >= 5 ? 264 : 330;
  const lh = 68 * 1.14;
  const bodyY = titleY + titleLinesWrapped.length * lh + 96;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${colors.page}"/>
  ${subtleTexture()}
  <rect x="80" y="86" width="920" height="1178" rx="44" fill="${colors.paper}" stroke="${colors.line}" stroke-width="3"/>
  <path d="M138 184 H942" stroke="${colors.line}" stroke-width="2"/>
  <text x="138" y="154" font-family="Arial, sans-serif" font-size="24" letter-spacing="3" text-transform="uppercase" fill="${colors.muted}">${escapeXml(slide.eyebrow)}</text>
  ${textLines(titleLinesWrapped, 138, titleY, 68, 500)}
  ${bodyLines(bodyLinesWrapped, 142, bodyY)}
  ${sketch(slide.sketch)}
  <g transform="translate(138 1132)">
    ${renderFooter(slide.note, index, slides.length)}
  </g>
</svg>`;
}

async function render() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const [index, slide] of slides.entries()) {
    const svg = slideSvg(slide, index);
    const base = path.join(OUT_DIR, `slide-${index + 1}`);
    fs.writeFileSync(`${base}.svg`, svg);
    await sharp(Buffer.from(svg)).png().toFile(`${base}.png`);
    await sharp(Buffer.from(svg)).jpeg({ quality: 92, mozjpeg: true }).toFile(`${base}.jpg`);
  }
  fs.writeFileSync(
    path.join(OUT_DIR, "caption.txt"),
    `Cycle tracking and fertility charting are not always the same thing.

Tracking can help you remember dates. Fertility charting goes a little deeper: it asks what you noticed today, then helps patterns become clearer over time.

Well Within is built for observation-based fertility charting, without prediction claims or pressure.

Save this if you're learning to chart more clearly. Follow @wellwithinapp for calmer fertility charting notes.

#FertilityCharting #CycleAwareness #FertilityAwareness #BodyLiteracy #NaturalPlanning #CycleTracking
`,
  );
}

render().catch((error) => {
  console.error(error);
  process.exit(1);
});

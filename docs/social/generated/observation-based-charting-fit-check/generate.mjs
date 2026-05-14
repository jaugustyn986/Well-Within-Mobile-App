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

/** Typography / rhythm — uniform across slides */
const LAYOUT = Object.freeze({
  eyebrowBaselineY: 154,
  dividerY: 182,
  /**
   * First title baseline. Must clear divider + serif caps/ascenders (~0.72× font size above baseline).
   * 228px sat too tight (caps visually touched the rule); 266px gives stable breathing room on every slide.
   */
  titleTopY: 266,
  gapTitleToBody: 44,
  gapCopyToSketch: 56,
  /** Illustrations must end above this rule; footer copy draws below */
  footerRuleY: 998,
  footerNoteStartY: 1030,
  slideIndexBaselineY: 980,
  textX: 146,
  cardInnerLeft: 72,
  cardInnerWidth: 936,
  /** Space between illustration bottom and footer rule */
  gapSketchToRule: 22,
});

const colors = {
  page: "#F1F4EF",
  paper: "#FBFCFA",
  paperAlt: "#F5F7F3",
  ink: "#353832",
  secondary: "#4F544C",
  muted: "#8A9088",
  line: "#DDE3D8",
  sage: "#8FA894",
  sageDeep: "#6E7F72",
  sageLight: "#E4EDE6",
  warm: "#C4A99A",
  warmLight: "#EDE4DE",
};

/**
 * Bounding height for each sketch (positive coords only). Used to place art above footer.
 * Illustrations are horizontally centered in the card.
 */
const SKETCH_HEIGHT = Object.freeze({
  /** Slide 1: embedded stock photo (see assets/slide-1-stock.jpg + PHOTO_CREDIT.txt) */
  hookStock: 300,
  clipboard: 248,
  sparkline: 222,
  badge1: 152,
  badge2: 152,
  badge3: 152,
  papers: 200,
});

/**
 * Slide 1 = hook ("doable / not homework"). Slide 2 = frames observation-based fit.
 */
const slides = [
  {
    eyebrow: "Charting & you",
    title: "Do you want charting to feel doable—not like homework?",
    body: [],
    note: "This account is for learning at your own pace.",
    sketch: "hookStock",
  },
  {
    eyebrow: "Observation-based charting",
    title:
      "It may be a fit if you want a calmer way to notice your cycle—with daily observations instead of noise.",
    body: [],
    note: "A soft checklist—not pressure, not predictions.",
    sketch: "clipboard",
  },
  {
    eyebrow: "What “observation-based” can mean",
    title:
      "You record what you notice day to day. Patterns become easier to see across weeks—not from one isolated day.",
    body: [],
    note: "Still observational language—no forecasts baked into the promise.",
    sketch: "sparkline",
  },
  {
    eyebrow: "May be a fit — 1",
    title:
      "You want one steady place for daily observations—so details do not live in scattered notes.",
    body: [],
    note: "Routine-friendly, not perfection-driven.",
    sketch: "badge1",
  },
  {
    eyebrow: "May be a fit — 2",
    title:
      "You are curious how signs shift through your cycle—and you want plain words, not jargon-first lessons.",
    body: [],
    note: "Curiosity over hype.",
    sketch: "badge2",
  },
  {
    eyebrow: "May be a fit — 3",
    title:
      "You care about your own chart history more than a generic “what happens next” storyline.",
    body: [],
    note: "Patterns over time—not a daily verdict.",
    sketch: "badge3",
  },
  {
    eyebrow: "Save for later",
    title: "Still deciding? That is allowed.",
    body: [
      "Save this. Follow for calmer fertility charting notes.",
      "Link in bio if you want a structured place to chart on your phone.",
    ],
    note: "@wellwithinapp",
    sketch: "papers",
  },
];

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function titleLineHeight(size) {
  return size * 1.15;
}

function titleBlockBottom(titleTopY, titleLines, size) {
  const lh = titleLineHeight(size);
  const lastBaseline = titleTopY + (titleLines.length - 1) * lh;
  return lastBaseline + size * 0.28;
}

function bodyBlockMetrics(bodyRaw, bodyY) {
  if (!bodyRaw.length) {
    return { bodyBottom: bodyY };
  }
  const size = 29;
  const lh = size * 1.42;
  const lastBaseline = bodyY + (bodyRaw.length - 1) * lh;
  const bodyBottom = lastBaseline + size * 0.22;
  return { bodyBottom };
}

function textLines(lines, x, y, size, weight = 500, lineHeight = 1.15, color = colors.ink, family = "Georgia") {
  const lh = size * lineHeight;
  return lines
    .map((line, index) => {
      const dy = index === 0 ? 0 : index * lh;
      return `<text x="${x}" y="${y + dy}" font-family="${family}, serif" font-size="${size}" font-weight="${weight}" fill="${color}">${escapeXml(line)}</text>`;
    })
    .join("\n");
}

function bodyLines(lines = [], x, y, size = 29, lineHeight = 1.42) {
  const lh = size * lineHeight;
  return lines
    .map((line, index) => {
      const yy = y + index * lh;
      return `<text x="${x}" y="${yy}" font-family="Arial, sans-serif" font-size="${size}" fill="${colors.secondary}">${escapeXml(line)}</text>`;
    })
    .join("\n");
}

function footerNoteLines(note, startY, textX) {
  const wrapped = wrapWords(note, 26);
  assertLinesFit(wrapped, 26, CAROUSEL_SAFE.innerMaxPx, 0.52, "footer");
  const lineGap = 32;
  return wrapped
    .map((line, index) => {
      const yy = startY + index * lineGap;
      return `<text x="${textX}" y="${yy}" font-family="Arial, sans-serif" font-size="26" fill="${colors.secondary}">${escapeXml(line)}</text>`;
    })
    .join("\n");
}

function subtleTexture() {
  const marks = [];
  for (let i = 0; i < 72; i += 1) {
    const x = 48 + ((i * 101) % 984);
    const y = 40 + ((i * 143) % 1270);
    const opacity = 0.028 + ((i % 5) * 0.007);
    marks.push(`<circle cx="${x}" cy="${y}" r="${1 + (i % 3)}" fill="${colors.sage}" opacity="${opacity}" />`);
  }
  return marks.join("\n");
}

/**
 * Sketch primitives live in a local 0..h box; caller supplies translate(x,y) for placement.
 * Heights must match SKETCH_HEIGHT[type].
 */
function sketchInner(type) {
  const common = `stroke="${colors.sageDeep}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
  if (type === "clipboard") {
    return `
      <g>
        <rect x="0" y="18" width="248" height="230" rx="22" fill="${colors.paperAlt}" stroke="${colors.line}" stroke-width="3"/>
        <rect x="18" y="0" width="188" height="44" rx="16" fill="${colors.sageLight}" stroke="${colors.line}" stroke-width="2"/>
        <line x1="32" y1="78" x2="216" y2="78" stroke="${colors.line}" stroke-width="3"/>
        ${[118, 156, 194].map(
          (yy, i) =>
            `<circle cx="42" cy="${yy}" r="11" fill="${i === 1 ? colors.sage : "none"}" stroke="${colors.sage}" stroke-width="3"/><line x1="68" y1="${yy}" x2="214" y2="${yy}" stroke="${colors.line}" stroke-width="3"/>`,
        ).join("")}
      </g>`;
  }
  if (type === "sparkline") {
    return `
      <g>
        <rect x="0" y="0" width="304" height="188" rx="26" fill="${colors.paperAlt}" stroke="${colors.line}" stroke-width="3"/>
        <path d="M38 138 C78 112 102 150 138 118 C174 86 198 112 266 66" ${common}/>
        <circle cx="38" cy="138" r="8" fill="${colors.sage}"/>
        <circle cx="138" cy="118" r="8" fill="${colors.warm}"/>
        <circle cx="266" cy="66" r="8" fill="${colors.sage}"/>
        <text x="36" y="176" font-family="Arial, sans-serif" font-size="22" fill="${colors.muted}">weeks, not one day</text>
      </g>`;
  }
  if (type === "badge1" || type === "badge2" || type === "badge3") {
    const n = type === "badge1" ? "1" : type === "badge2" ? "2" : "3";
    const fill = type === "badge2" ? colors.warmLight : colors.sageLight;
    const numFill = type === "badge2" ? colors.warm : colors.sageDeep;
    return `
      <g>
        <circle cx="64" cy="64" r="62" fill="${fill}" stroke="${colors.line}" stroke-width="3"/>
        <text x="64" y="78" text-anchor="middle" font-family="Georgia, serif" font-size="40" fill="${numFill}">${n}</text>
        <rect x="148" y="18" width="176" height="92" rx="18" fill="${colors.paperAlt}" stroke="${colors.line}" stroke-width="2"/>
        <path d="M168 54 H312" stroke="${colors.line}" stroke-width="3"/>
        <path d="M168 76 H292" stroke="${colors.line}" stroke-width="3"/>
      </g>`;
  }
  if (type === "papers") {
    return `
      <g>
        <rect x="0" y="0" width="268" height="200" rx="26" fill="${colors.paperAlt}" stroke="${colors.line}" stroke-width="3"/>
        <rect x="30" y="38" width="200" height="22" rx="9" fill="${colors.sageLight}"/>
        <rect x="30" y="76" width="176" height="22" rx="9" fill="${colors.line}" opacity="0.55"/>
        <rect x="30" y="114" width="188" height="22" rx="9" fill="${colors.line}" opacity="0.45"/>
        <path d="M48 172 H220" stroke="${colors.sage}" stroke-width="5" stroke-linecap="round"/>
      </g>`;
  }
  return "";
}

function sketchPlaced(type, topY) {
  const inner = sketchInner(type);
  if (!inner) {
    return "";
  }
  const w =
    type === "sparkline"
      ? 304
      : type === "badge1" || type === "badge2" || type === "badge3"
        ? 324
        : type === "papers"
          ? 268
          : 248;
  const cx = LAYOUT.cardInnerLeft + LAYOUT.cardInnerWidth / 2;
  const x = cx - w / 2;
  return `<g transform="translate(${x.toFixed(1)} ${topY})">${inner}</g>`;
}

/** Hook photo uses most of the card width; taller frame shows more context without harsh cropping */
const HOOK_STOCK_W = 720;

function paperRgb() {
  const hex = colors.paper.replace("#", "");
  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  };
}

/**
 * Fit whole image inside WxH (letterboxed on paper) so faces/notebook are not cut off.
 * Slightly larger frame + "inside" reads cleaner than cover crop for emotional stock shots.
 */
async function loadHookStockDataUri() {
  const src = path.join(OUT_DIR, "assets", "slide-1-stock.jpg");
  if (!fs.existsSync(src)) {
    throw new Error(
      `[carousel] Missing ${src}. Add a charting-adjacent stock JPG (see assets/PHOTO_CREDIT.txt).`,
    );
  }
  const W = HOOK_STOCK_W;
  const H = SKETCH_HEIGHT.hookStock;
  const bg = paperRgb();
  const buf = await sharp(src)
    .resize(W, H, { fit: "inside", background: bg })
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

function hookStockPlaced(topY, dataUri) {
  if (!dataUri) {
    throw new Error("[carousel] hookStock slide missing image data URI.");
  }
  const w = HOOK_STOCK_W;
  const h = SKETCH_HEIGHT.hookStock;
  const cx = LAYOUT.cardInnerLeft + LAYOUT.cardInnerWidth / 2;
  const x = cx - w / 2;
  const clipId = "hookStockClip";
  return `
  <g transform="translate(${x.toFixed(1)} ${topY})">
    <defs>
      <clipPath id="${clipId}"><rect width="${w}" height="${h}" rx="22"/></clipPath>
    </defs>
    <image href="${dataUri}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet" clip-path="url(#${clipId})"/>
    <rect width="${w}" height="${h}" rx="22" fill="none" stroke="${colors.line}" stroke-width="3"/>
  </g>`;
}

function slideSvg(slide, index, hookStockDataUri) {
  const tx = LAYOUT.textX;
  const sketchH = SKETCH_HEIGHT[slide.sketch];
  /** Lowest allowed top edge for illustration so its bottom clears the footer rule */
  const sketchTopCeiling = LAYOUT.footerRuleY - LAYOUT.gapSketchToRule - sketchH;

  const bodyRaw = slide.body?.length ? wrapBulletLines(slide.body, 29) : [];
  if (bodyRaw.length) {
    assertLinesFit(bodyRaw, 29, CAROUSEL_SAFE.innerMaxPx, 0.52, "body");
  }

  const sizes = [56, 52, 48, 44, 40, 36, 32, 30, 28];

  for (const size of sizes) {
    const titleLines = wrapWords(slide.title, size);
    assertLinesFit(titleLines, size, CAROUSEL_SAFE.innerMaxPx, 0.52, "title");

    const titleBottom = titleBlockBottom(LAYOUT.titleTopY, titleLines, size);
    const bodyY = bodyRaw.length ? titleBottom + LAYOUT.gapTitleToBody : titleBottom;
    const { bodyBottom } = bodyBlockMetrics(bodyRaw, bodyY);
    const contentBottom = bodyRaw.length ? bodyBottom : titleBottom;
    const sketchTop = contentBottom + LAYOUT.gapCopyToSketch;
    const sketchBottom = sketchTop + sketchH;

    if (sketchTop <= sketchTopCeiling + 0.5 && sketchBottom <= LAYOUT.footerRuleY - LAYOUT.gapSketchToRule + 0.5) {
      const titleSvg = textLines(titleLines, tx, LAYOUT.titleTopY, size, 500);
      const bodySvg = bodyRaw.length ? bodyLines(bodyRaw, tx, bodyY, 29, 1.42) : "";
      const footerNotes = footerNoteLines(slide.note, LAYOUT.footerNoteStartY, tx);
      return composeSvg({
        eyebrow: slide.eyebrow,
        index,
        sketchType: slide.sketch,
        titleSvg,
        bodySvg,
        sketchTop,
        footerNotes,
        hookStockDataUri: slide.sketch === "hookStock" ? hookStockDataUri : null,
      });
    }
  }

  throw new Error(`[layout] Slide ${index + 1}: shorten title/body—vertical budget exceeded (max illustration top ${sketchTopCeiling.toFixed(0)}px).`);
}

function composeSvg({ eyebrow, index, sketchType, titleSvg, bodySvg, sketchTop, footerNotes, hookStockDataUri }) {
  const illustration =
    sketchType === "hookStock" ? hookStockPlaced(sketchTop, hookStockDataUri) : sketchPlaced(sketchType, sketchTop);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${colors.page}"/>
  ${subtleTexture()}
  <rect x="72" y="78" width="936" height="1194" rx="42" fill="${colors.paper}" stroke="${colors.line}" stroke-width="3"/>
  <rect x="72" y="78" width="14" height="1194" rx="6" fill="${colors.sageLight}" opacity="0.85"/>
  <path d="M146 182 H932" stroke="${colors.line}" stroke-width="2"/>
  <text x="146" y="154" font-family="Arial, sans-serif" font-size="22" letter-spacing="4" font-weight="600" fill="${colors.muted}">${escapeXml(eyebrow.toUpperCase())}</text>
  ${titleSvg}
  ${bodySvg}
  ${illustration}
  <line x1="146" y1="${LAYOUT.footerRuleY}" x2="926" y2="${LAYOUT.footerRuleY}" stroke="${colors.line}" stroke-width="2"/>
  ${footerNotes}
  <text x="926" y="${LAYOUT.slideIndexBaselineY}" text-anchor="end" font-family="Arial, sans-serif" font-size="22" fill="${colors.muted}">${index + 1}/${slides.length}</text>
</svg>`;
}

async function render() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const hookStockDataUri = await loadHookStockDataUri();
  for (const [index, slide] of slides.entries()) {
    const svg = slideSvg(slide, index, hookStockDataUri);
    const base = path.join(OUT_DIR, `slide-${index + 1}`);
    fs.writeFileSync(`${base}.svg`, svg);
    await sharp(Buffer.from(svg)).png().toFile(`${base}.png`);
    await sharp(Buffer.from(svg)).jpeg({ quality: 92, mozjpeg: true }).toFile(`${base}.jpg`);
  }
  fs.writeFileSync(
    path.join(OUT_DIR, "caption.txt"),
    `Want charting to feel doable—not like homework? This account is for learning at your own pace. Observation-based fertility charting might be a fit if you prefer calm, daily observations over noise.

This carousel is a gentle checklist: patterns show up across weeks—not from one isolated day.

Save this if you are deciding whether to learn. Follow @wellwithinapp for calmer charting notes. Link in bio if you want a structured place to chart on your phone.

#FertilityCharting #FertilityAwareness #CycleAwareness #BodyLiteracy #NaturalPlanning #Charting
`,
  );
}

render().catch((error) => {
  console.error(error);
  process.exit(1);
});

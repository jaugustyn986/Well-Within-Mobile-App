/**
 * SVG <text> does not wrap. Carousel generators must wrap lines explicitly or copy
 * will clip past the safe zone on Instagram (1080×1350).
 *
 * Defaults target the Well Within card layout: text starts at x≈138; keep lines
 * within a conservative inner width so glyphs do not run past ~photo edges on mobile.
 */
export const CAROUSEL_SAFE = Object.freeze({
  canvasWidth: 1080,
  canvasHeight: 1350,
  /** Match generators: main copy anchor */
  textX: 138,
  /**
   * Conservative inner measure for proportional serif/sans at Instagram sizes.
   * Tighter than the raw card interior so long strings never kiss the border.
   */
  innerMaxPx: 760,
});

/**
 * Rough word-wrap using estimated string width = length * fontSize * ratio.
 * Biases slightly wide so we stay safe on dense punctuation / caps.
 */
export function wrapWords(text, fontSize, innerPx = CAROUSEL_SAFE.innerMaxPx, charWidthRatio = 0.52) {
  const words = String(text).trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";

  const widthOf = (s) => s.length * fontSize * charWidthRatio;

  for (const word of words) {
    const trial = current ? `${current} ${word}` : word;
    if (widthOf(trial) <= innerPx) {
      current = trial;
      continue;
    }
    if (current) {
      lines.push(current);
      current = word;
    } else {
      current = word;
    }
    while (widthOf(current) > innerPx && current.length > 1) {
      let low = 1;
      let high = current.length;
      let best = 1;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const chunk = current.slice(0, mid);
        if (widthOf(chunk) <= innerPx) {
          best = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }
      lines.push(current.slice(0, best));
      current = current.slice(best).trimStart();
    }
  }
  if (current) {
    lines.push(current);
  }
  return lines;
}

/** Wrap independent bullets/lines while preserving one blank line between bullets is NOT done here — join in caller. */
export function wrapBulletLines(bullets, fontSize, innerPx = CAROUSEL_SAFE.innerMaxPx, charWidthRatio = 0.52) {
  const out = [];
  for (const bullet of bullets) {
    out.push(...wrapWords(bullet, fontSize, innerPx, charWidthRatio));
  }
  return out;
}

/**
 * Throws if any wrapped line still exceeds the budget (should not happen if wrapWords is used).
 * Call in CI or during `generate.mjs` runs so overflow fails loudly before export.
 */
export function assertLinesFit(lines, fontSize, innerPx = CAROUSEL_SAFE.innerMaxPx, charWidthRatio = 0.52, label = "block") {
  for (const line of lines) {
    const w = line.length * fontSize * charWidthRatio;
    if (w > innerPx + 1) {
      throw new Error(
        `[carousel-text] ${label} overflow: needs narrower copy or smaller type — "${line.slice(0, 48)}…" (${Math.round(w)}px > ${innerPx}px)`,
      );
    }
  }
}

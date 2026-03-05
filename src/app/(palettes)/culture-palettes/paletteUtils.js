// Shared palette generation logic — no external dependencies
// Used by SmartRandomize.jsx and CultureRandomize.jsx

import { oklchToHex, hexToOklch, wcagContrast } from "../custom-palettes/_components/Pickers/components/colorutil";

// ─── Basic random helpers ───

export function rand(min, max) {
  return min + Math.random() * (max - min);
}

export function pickFromRanges(ranges) {
  const range = ranges[Math.floor(Math.random() * ranges.length)];
  return rand(range[0], range[1]);
}

// ─── Stratified hue sampling ───
// Divides the total hue span into n equal slots, picks randomly within each.
// Guarantees no two hues are too close while keeping randomness within each slot.


export function stratifiedHues(ranges, count) {
const pickCount = Math.min(ranges.length, count);
const shuffledRanges = [...ranges].sort(() => Math.random() - 0.5);
const guaranteed = shuffledRanges.slice(0, pickCount).map(([a, b]) => rand(a, b));
const remaining = count - pickCount;

  const extra = [];
  if (remaining > 0) {
    const totalSpan = ranges.reduce((sum, [a, b]) => sum + (b - a), 0);
    const slotSize = totalSpan / remaining;
    for (let i = 0; i < remaining; i++) {
      const slotStart = i * slotSize;
      let r = rand(slotStart, slotStart + slotSize);
      for (const [a, b] of ranges) {
        const span = b - a;
        if (r <= span) { extra.push(a + r); break; }
        r -= span;
      }
    }
  }

  const hues = [...guaranteed, ...extra].slice(0, count);
  while (hues.length < count) hues.push(rand(...ranges[hues.length % ranges.length]));

  for (let i = hues.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [hues[i], hues[j]] = [hues[j], hues[i]];
  }
  return hues;
}

// ─── clampOklch ───
// Reduces chroma until a valid hex is produced.
// Replaces chroma.oklch(l, c, h).hex()

export function clampOklch(l, c, h) {
  h = ((h % 360) + 360) % 360;
  let cc = c;
  while (cc > 0.01) {
    try {
      const hex = oklchToHex(l, cc, h);
      if (hex) return { l, c: cc, h, hex };
    } catch (e) {}
    cc -= 0.01;
  }
  return { l, c: 0, h, hex: oklchToHex(l, 0, h) };
}

// ─── Harmony hue generation ───

export function clampHueToRanges(hue, ranges) {
  for (const [a, b] of ranges) {
    if (hue >= a && hue <= b) return hue;
  }
  let best = ranges[0][0];
  let bestDist = Infinity;
  for (const [a, b] of ranges) {
    const distA = Math.min(Math.abs(hue - a), Math.abs(hue - a + 360), Math.abs(hue - a - 360));
    const distB = Math.min(Math.abs(hue - b), Math.abs(hue - b + 360), Math.abs(hue - b - 360));
    if (distA < bestDist) { bestDist = distA; best = a; }
    if (distB < bestDist) { bestDist = distB; best = b; }
  }
  return best;
}

export function generateHarmonyHues(baseHue, harmony, count) {
  switch (harmony) {
    case "analogous":
      return Array.from(
        { length: count },
        (_, i) => baseHue + (i - Math.floor(count / 2)) * 28
      );

    case "complementary": {
      const hues = [];
      for (let i = 0; i < count; i++) {
        hues.push(
          i % 2 === 0
            ? baseHue + rand(-15, 15)
            : baseHue + 180 + rand(-15, 15)
        );
      }
      return hues;
    }

    case "triadic": {
      const hues = [];
      const bases = [baseHue, baseHue + 120, baseHue + 240];
      for (let i = 0; i < count; i++)
        hues.push(bases[i % 3] + rand(-10, 10));
      return hues;
    }

    case "split": {
      const hues = [];
      const bases = [baseHue, baseHue + 150, baseHue + 210];
      for (let i = 0; i < count; i++)
        hues.push(bases[i % 3] + rand(-10, 10));
      return hues;
    }

    default:
      return null; // free
  }
}

// ─── WCAG contrast check ───
// Replaces chroma.contrast()

export function meetsContrast(hex, mode) {
  if (mode === "none") return true;
  const minRatio = mode === "aaa" ? 7 : 4.5;
  return (
    wcagContrast(hex, "#ffffff") >= minRatio ||
    wcagContrast(hex, "#000000") >= minRatio
  );
}

// ─── Contrast info for a single color ───
// Returns ratios, pass/fail flags, and best text color

export function getContrastInfo(hex) {
  const cw = wcagContrast(hex, "#ffffff");
  const cb = wcagContrast(hex, "#000000");
  const best = Math.max(cw, cb);
  return {
    cw:        cw.toFixed(1),
    cb:        cb.toFixed(1),
    best:      best.toFixed(1),
    aa:        best >= 4.5,
    aaa:       best >= 7,
    textColor: cw > cb ? "white" : "black",
  };
}

// ─── Core palette generator ───
// palette definition shape:
// {
//   hues:      [[min, max], ...],   // one or more hue ranges
//   chroma:    [min, max],
//   lightness: [min, max],
// }

export function generatePalette(paletteDef, harmony, contrastMode, count, locks) {
  const baseHue = pickFromRanges(paletteDef.hues);
  const harmonyHues =
    harmony !== "free"
      ? generateHarmonyHues(baseHue, harmony, count)
      : null;

  const freeHues = !harmonyHues
    ? stratifiedHues(paletteDef.hues, count)
    : null;

  const colors = [];
  for (let i = 0; i < count; i++) {
    if (locks[i]) {
      colors.push(locks[i]);
      continue;
    }

    let fixedH;
    if (harmonyHues) {
      const raw = ((harmonyHues[i] % 360) + 360) % 360;
      fixedH = clampHueToRanges(raw, paletteDef.hues);
    } else {
      fixedH = freeHues[i];
    }

    let attempts = 0;
    let color;
    do {
      const c = rand(paletteDef.chroma[0], paletteDef.chroma[1]);
      const l = rand(paletteDef.lightness[0], paletteDef.lightness[1]);
      color = clampOklch(l, c, fixedH);
      attempts++;
    } while (!meetsContrast(color.hex, contrastMode) && attempts < 40);

    if (!meetsContrast(color.hex, contrastMode)) {
      const fallbackL = contrastMode === "aaa" ? 0.92 : 0.85;
      color = clampOklch(fallbackL, paletteDef.chroma[0], fixedH);
    }

    colors.push(color);
  }
  return colors;
}
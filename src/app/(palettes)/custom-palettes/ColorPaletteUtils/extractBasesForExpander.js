/**
 * extractBasesForExpander.js
 *
 * Fully automatic — no palette type or subtype required.
 *
 * Pipeline:
 *   1. Cluster input colors into distinct hue families
 *   2. Pick the best (most chromatic, mid-tonal) rep per family
 *   3. Infer a theme profile from the palette's actual chroma + lightness
 *   4. Generate one hue-tinted neutral per chromatic family
 *
 * paletteType / paletteSubType are optional hints only.
 */

// ── Constants ─────────────────────────────────────────────────────────────────

const DEFAULT_HUE_SEP = 28;  // degrees — distinct hue threshold
const TIGHT_HUE_SEP   = 14;  // used for tight analogous palettes
const MAX_FAMILIES    = 5;   // safety cap on hue families

// ── Mono subtype profiles (explicit overrides when subType is known) ──────────

export const MONO_PROFILES = {
  vintageMono: { label: "Vintage",  lightCeiling: 0.88, darkFloor: 0.22, chromaScale: 0.70 },
  earthMono:   { label: "Earth",    lightCeiling: 0.88, darkFloor: 0.20, chromaScale: 0.65 },
  neonMono:    { label: "Neon",     lightCeiling: 0.94, darkFloor: 0.15, chromaScale: 1.25 },
  kidsMono:    { label: "Kids",     lightCeiling: 0.95, darkFloor: 0.15, chromaScale: 1.20 },
  pastelMono:  { label: "Pastel",   lightCeiling: 0.97, darkFloor: 0.30, chromaScale: 0.65 },
  luxuryMono:  { label: "Luxury",   lightCeiling: 0.80, darkFloor: 0.13, chromaScale: 1.10 },
  neutralMono: { label: "Neutral",  lightCeiling: 0.97, darkFloor: 0.12, chromaScale: 0.28 },
  classicMono: { label: "Classic",  lightCeiling: 0.97, darkFloor: 0.12, chromaScale: 1.00 },
};

export const THEME_PROFILES = {
  ...MONO_PROFILES,
  default: { label: "Standard", lightCeiling: 0.97, darkFloor: 0.12, chromaScale: 1.00 },
};

// ── Math helpers ──────────────────────────────────────────────────────────────

function hueDist(a, b) {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function avg(arr) { return arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0; }

// ── Step 1: Cluster by hue ────────────────────────────────────────────────────
// Seeds from most-chromatic colors. Uses chroma-weighted circular mean
// to keep cluster centers accurate as members are added.

function clusterByHue(colors, minHueSep) {
  const sorted = [...colors].sort((a, b) => b.c - a.c);
  const clusters = [];

  for (const color of sorted) {
    if (color.c < 0.04) continue; // skip near-achromatic

    const closest = clusters.reduce((best, cl) => {
      const d = hueDist(cl.centerH, color.h);
      return d < best.d ? { cl, d } : best;
    }, { cl: null, d: Infinity });

    if (closest.d < minHueSep && closest.cl) {
      closest.cl.colors.push(color);
      // Recompute center as chroma-weighted circular mean
      const members = closest.cl.colors;
      const totalC = members.reduce((s, c) => s + c.c, 0);
      const sinSum = members.reduce((s, c) => s + Math.sin(c.h * Math.PI / 180) * c.c, 0);
      const cosSum = members.reduce((s, c) => s + Math.cos(c.h * Math.PI / 180) * c.c, 0);
      closest.cl.centerH = ((Math.atan2(sinSum / totalC, cosSum / totalC) * 180 / Math.PI) + 360) % 360;
    } else {
      clusters.push({ centerH: color.h, colors: [color] });
    }

    if (clusters.length >= MAX_FAMILIES) break;
  }

  return clusters;
}

// ── Post-clustering: merge weak tonal variants into dominant family ───────────
// If two clusters are within 80° AND the weaker one's max chroma is < 65%
// of the stronger one's, it's a tonal variant not a true separate hue family.

function mergeTonalVariants(clusters) {
  if (clusters.length <= 1) return clusters;

  let changed = true;
  let result = clusters.map(cl => ({
    ...cl,
    maxC: Math.max(...cl.colors.map(c => c.c)),
  }));

  while (changed) {
    changed = false;
    for (let i = 0; i < result.length; i++) {
      for (let j = i + 1; j < result.length; j++) {
        const dist = hueDist(result[i].centerH, result[j].centerH);
        const stronger = result[i].maxC >= result[j].maxC ? i : j;
        const weaker   = stronger === i ? j : i;
        const chromaRatio = result[weaker].maxC / result[stronger].maxC;
        if (dist < 80 && chromaRatio < 0.65) {
          // Merge weaker into stronger
          result[stronger].colors.push(...result[weaker].colors);
          result[stronger].maxC = Math.max(result[stronger].maxC, result[weaker].maxC);
          result.splice(weaker, 1);
          changed = true;
          break;
        }
      }
      if (changed) break;
    }
  }

  return result;
}
// Score = chroma − penalty for distance from ideal mid-tone (l ≈ 0.50)

function bestRepresentative(cluster) {
  return cluster.colors.reduce((best, c) => {
    const score    = c.c - Math.abs(c.l - 0.50) * 0.4;
    const bestScore = best.c - Math.abs(best.l - 0.50) * 0.4;
    return score > bestScore ? c : best;
  });
}

function normalizeMidTone(color, targetL = 0.52) {
  return { l: targetL, c: clamp(color.c, 0.01, 0.38), h: color.h };
}

// ── Step 3: Infer theme profile from the actual colors ────────────────────────
//
// Measures three axes of the palette's character:
//   avgChroma     → chromaScale  (vivid vs muted)
//   avgLightness  → lightCeiling (bright vs deep)
//   minLightness  → darkFloor    (how deep shadows go)
//   hueSpread     → tweak chroma for tight analogous palettes

function inferThemeProfile(rawColors, clusters) {
  const chromatic = rawColors.filter(c => c.c >= 0.04);

  if (chromatic.length === 0) {
    return { label: "Achromatic", lightCeiling: 0.97, darkFloor: 0.08, chromaScale: 0.15 };
  }

  const avgC = avg(chromatic.map(c => c.c));
  const avgL = avg(chromatic.map(c => c.l));
  const minL = Math.min(...chromatic.map(c => c.l));

  // chromaScale: linearly mapped from measured avgChroma
  let chromaScale;
  if      (avgC < 0.06) chromaScale = 0.55;
  else if (avgC < 0.10) chromaScale = 0.72;
  else if (avgC < 0.14) chromaScale = 0.88;
  else if (avgC < 0.18) chromaScale = 1.00;
  else if (avgC < 0.23) chromaScale = 1.08;
  else                  chromaScale = clamp(1.08 + (avgC - 0.23) * 2, 1.08, 1.30);

  // lightCeiling: darker palettes shouldn't be pushed to paper-white
  const lightCeiling = clamp(0.88 + (avgL - 0.40) * 0.22, 0.80, 0.97);

  // darkFloor: palettes with very dark colors can go deeper
  const darkFloor = clamp(0.08 + (minL - 0.10) * 0.25, 0.08, 0.28);

  // Hue spread: tight analogous palettes get a small chroma pullback for harmony
  const hueSpread = clusters.length <= 1 ? 0 : Math.max(
    ...clusters.map((f, i) =>
      clusters.slice(i + 1).reduce((mx, g) => Math.max(mx, hueDist(f.centerH, g.centerH)), 0)
    )
  );
  if (hueSpread < 60 && clusters.length >= 2) chromaScale *= 0.92;

  // Human-readable label for UI display
  let label = "Standard";
  if      (avgC < 0.06)  label = "Achromatic";
  else if (avgC < 0.10)  label = "Muted";
  else if (avgC < 0.14)  label = avgL > 0.65 ? "Pastel" : "Earth";
  else if (avgC >= 0.22) label = avgL < 0.45 ? "Deep"   : "Vivid";
  else if (hueSpread < 60 && clusters.length >= 2) label = "Analogous";

  return {
    label,
    lightCeiling: Math.round(lightCeiling * 1000) / 1000,
    darkFloor:    Math.round(darkFloor    * 1000) / 1000,
    chromaScale:  Math.round(chromaScale  * 1000) / 1000,
  };
}

// ── Step 4: Generate hue-tinted neutrals ─────────────────────────────────────
// One per chromatic family. Same hue, chroma crushed to 0.016 —
// enough to feel warm or cool, not enough to read as a color.

function makeNeutral(hue) {
  return { l: 0.52, c: 0.016, h: hue };
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * @param {Array}   palette          - Array of { name, value: { l, c, h } }
 * @param {string}  [paletteType]    - Optional hint e.g. "complementary"
 * @param {string}  [paletteSubType] - Optional mono style e.g. "vintageMono"
 * @returns {{ bases, themeProfile, label }}
 */
export default function extractBasesForExpander(palette, paletteType, paletteSubType) {
  if (!palette || palette.length === 0) {
    return { bases: [], themeProfile: THEME_PROFILES.default, label: "Standard" };
  }

  // ── Validate and extract raw colors ───────────────────────────────────────
  const rawColors = palette
    .map(item => item?.value)
    .filter(v => v
      && typeof v.l === "number" && v.l >= 0 && v.l <= 1
      && typeof v.c === "number" && v.c >= 0
      && typeof v.h === "number"
    );

  if (rawColors.length === 0) {
    return { bases: [], themeProfile: THEME_PROFILES.default, label: "Standard" };
  }

  // ── Known mono subtype: skip clustering, use explicit profile ─────────────
  if (paletteSubType && MONO_PROFILES[paletteSubType]) {
    const themeProfile = MONO_PROFILES[paletteSubType];
    const chromatic = rawColors.filter(c => c.c >= 0.04);
    const best = (chromatic.length ? chromatic : rawColors)
      .sort((a, b) => (b.c - Math.abs(b.l - 0.50) * 0.4) - (a.c - Math.abs(a.l - 0.50) * 0.4))[0];
    const base    = normalizeMidTone(best);
    const neutral = makeNeutral(base.h);
    return {
      bases: [
        { name: "Base-1",    value: base,    isNeutral: false },
        { name: "Neutral-1", value: neutral, isNeutral: true  },
      ],
      themeProfile,
      label: themeProfile.label,
    };
  }

  // ── Detect hue spread to choose clustering sensitivity ────────────────────
  const chromatic = rawColors.filter(c => c.c >= 0.04);
  const hues = chromatic.map(c => c.h);
  const hueSpreadRough = hues.length <= 1 ? 0 : Math.max(
    ...hues.map((h, i) => hues.slice(i + 1).reduce((mx, g) => Math.max(mx, hueDist(h, g)), 0))
  );
  const minHueSep = hueSpreadRough < 80 ? TIGHT_HUE_SEP : DEFAULT_HUE_SEP;

  // ── Cluster into hue families, then merge tonal variants ─────────────────
  const rawClusters = clusterByHue(rawColors, minHueSep);
  const clusters    = mergeTonalVariants(rawClusters);

  // Edge case: all colors were achromatic — treat as single neutral palette
  if (clusters.length === 0) {
    const base = normalizeMidTone(rawColors[0]);
    const neutral = makeNeutral(base.h);
    return {
      bases: [
        { name: "Base-1",    value: base,    isNeutral: false },
        { name: "Neutral-1", value: neutral, isNeutral: true  },
      ],
      themeProfile: { label: "Achromatic", lightCeiling: 0.97, darkFloor: 0.08, chromaScale: 0.15 },
      label: "Achromatic",
    };
  }

  // ── Best rep per family, normalized to mid-tone ───────────────────────────
  const chromaticBases = clusters.map(cl => normalizeMidTone(bestRepresentative(cl)));

  // ── Infer theme profile ───────────────────────────────────────────────────
  const themeProfile = inferThemeProfile(rawColors, clusters);

  // ── One neutral per chromatic hue family ──────────────────────────────────
  const neutralBases = chromaticBases.map(base => makeNeutral(base.h));

  // ── Assemble: chromatic bases first, neutrals after ───────────────────────
  return {
    bases: [
      ...chromaticBases.map((value, i) => ({ name: `Base-${i + 1}`,    value, isNeutral: false })),
      ...neutralBases.map(  (value, i) => ({ name: `Neutral-${i + 1}`, value, isNeutral: true  })),
    ],
    themeProfile,
    label: themeProfile.label,
  };
}
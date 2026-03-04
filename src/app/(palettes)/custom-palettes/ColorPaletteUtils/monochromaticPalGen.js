/**
 * monochromaticPalGen.js - World-class monochromatic palette generator
 *
 * Generates N perceptually-balanced monochromatic variants (4 to 15 colors)
 * Color space: OKLCH (perceptually uniform lightness, chroma, hue)
 *
 * PALETTE TIERS:
 *
 *   PURE — hue is locked. Only lightness and chroma vary.
 *   True monochromatic by definition. hueDrift defaults to 0.
 *     classicMono  - Full dynamic range
 *     neutralMono  - Near-grays, minimal saturation
 *     pastelMono   - Soft, high-lightness
 *     luxuryMono   - Deep jewel tones, rich saturation
 *
 *   TONAL — hue drifts across the scale for aesthetic effect.
 *   Expressive and pleasing, but not strictly monochromatic.
 *     vintageMono  - Warm darks, cool lights, aged aesthetic
 *     earthMono    - Natural, organic, warm-shifted
 *     neonMono     - Electric, digital-forward, cyberpunk
 *     kidsMono     - Bright, vibrant, cheerful
 *
 * HUE DRIFT (0–15°):
 *   Controls total hue rotation from darkest → lightest stop.
 *   Pure palettes default to 0 (mathematically pure).
 *   Tonal palettes default to their naturalDrift value.
 *   The caller can override either with any value 0–15.
 *   Drift is centred on the base hue so the input color remains
 *   the visual midpoint of the scale.
 *
 * OUTPUT per token:
 *   l, c, h · stop · contrastOnWhite · contrastOnBlack
 *   wcagOnWhite · wcagOnBlack · bestTextColor · inSRGB · role
 */

// ============================================================================
// TOKEN STOP NAMES — canonical Tailwind-style scale (dark → light)
// ============================================================================

const ALL_STOPS = [950, 900, 800, 700, 600, 500, 400, 300, 200, 100, 75, 50, 25, 15, 5];

/**
 * Pick N stops from ALL_STOPS with maximum perceptual spread.
 * Always anchors darkest (950) and lightest (5).
 * A mild shadow-bias (γ=0.85) puts slightly more steps in dark tones
 * where perceptual discrimination is harder.
 */
function selectStops(count) {
  const n = Math.max(4, Math.min(15, count));
  const total = ALL_STOPS.length; // 15

  if (n >= total) return [...ALL_STOPS];

  const indices = new Set([0, total - 1]);

  for (let i = 1; i < n - 1; i++) {
    const t      = i / (n - 1);
    const biased = Math.pow(t, 0.85);
    const idx    = Math.min(total - 2, Math.max(1, Math.round(biased * (total - 1))));
    indices.add(idx);
  }

  // Backfill if de-duping collapsed entries
  for (let i = 1; indices.size < n && i < total - 1; i++) indices.add(i);

  return [...indices]
    .sort((a, b) => a - b)
    .slice(0, n)
    .map((i) => ALL_STOPS[i]);
}

// ============================================================================
// PERCEPTUAL UTILITIES
// ============================================================================

/**
 * Hue-lightness perceptual correction.
 * Yellows (h≈100) appear lighter; blues (h≈265) appear darker at the same L.
 * Nudging L compensates so the scale feels visually even.
 */
function perceptualLightnessCorrection(h) {
  const hueRad = ((h - 100) * Math.PI) / 180;
  return -Math.sin(hueRad) * 0.055;
}

function applyPerceptualCorrection(color) {
  const delta = perceptualLightnessCorrection(color.h);
  return { ...color, l: Math.min(0.99, Math.max(0.01, color.l + delta)) };
}

/** Approximate sRGB gamut ceiling for a given hue + lightness */
function approxMaxChroma(h, l) {
  const lightnessBonus = 1 - Math.pow((l - 0.65) / 0.5, 2);
  const baseMax = 0.33 * Math.max(0, lightnessBonus);
  if (h >= 80  && h < 140) return baseMax * 1.10; // Yellow-green
  if (h >= 20  && h < 80)  return baseMax * 1.00; // Red-orange
  if (h >= 160 && h < 220) return baseMax * 0.75; // Cyan (narrowest)
  if (h >= 220 && h < 300) return baseMax * 0.82; // Blue-violet
  return baseMax;
}

function gamutClamp(color) {
  const maxC = approxMaxChroma(color.h, color.l);
  return { ...color, c: Math.min(color.c, maxC), inSRGB: color.c <= maxC };
}

// ============================================================================
// WCAG CONTRAST UTILITIES
// ============================================================================

function oklchToLuminance(l) {
  return Math.pow(Math.max(0, Math.min(1, l)), 2.2);
}

function contrastRatio(l1, l2) {
  const lum1    = oklchToLuminance(l1);
  const lum2    = oklchToLuminance(l2);
  const lighter = Math.max(lum1, lum2);
  const darker  = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

function wcagRating(ratio) {
  if (ratio >= 7)   return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3)   return "AA Large";
  return "Fail";
}

function getBestTextColor(bgL) {
  return contrastRatio(bgL, 0.0) > contrastRatio(bgL, 1.0) ? "black" : "white";
}

function getColorRole(l, onWhite, onBlack) {
  if (onWhite >= 4.5 || onBlack >= 4.5) return "text";
  if (l > 0.85 || l < 0.2) return "background";
  return "border";
}

function annotateColor(color, stop) {
  const onWhite = contrastRatio(color.l, 1.0);
  const onBlack = contrastRatio(color.l, 0.0);
  const clamped = gamutClamp(color);
  return {
    l:               color.l,
    c:               color.c,
    h:               color.h,
    stop,
    contrastOnWhite: Math.round(onWhite * 100) / 100,
    contrastOnBlack: Math.round(onBlack * 100) / 100,
    wcagOnWhite:     wcagRating(onWhite),
    wcagOnBlack:     wcagRating(onBlack),
    bestTextColor:   getBestTextColor(color.l),
    role:            getColorRole(color.l, onWhite, onBlack),
    inSRGB:          clamped.inSRGB,
  };
}

// ============================================================================
// PALETTE STRATEGY CONFIGURATIONS
// ============================================================================

/**
 * tier: "pure"  — hue locked by default (naturalDrift = 0)
 *       "tonal" — hue drifts for aesthetic effect
 *
 * naturalDrift: total hue rotation (°) across the full scale at default.
 *
 * hueShiftDirection: +1 = dark stops shift positive / light stops shift negative
 *                    -1 = inverted (darks cool, lights warm)
 *
 * chromaCurve:
 *   "bell"     — peaks in midtones, falls at extremes
 *   "flat"     — uniform chroma
 *   "peak-mid" — skewed bell, peak at ~55%
 *
 * distribution:
 *   "perceptual" — γ=0.75 power curve, denser in shadows
 *   "linear"     — even spacing
 */
const PALETTE_STRATEGIES = {

  // ── PURE ──────────────────────────────────────────────────────────────────

  classicMono: {
    tier: "pure",
    name: "Classic",
    description: "Full dynamic range — pure hue, only L and C vary",
    chromaMultiplier: 1.0,
    lightnessRange:   [0.08, 0.98],
    chromaRange:      [0.0,  0.40],
    naturalDrift:     0,
    hueShiftDirection: 1,
    chromaCurve:      "bell",
    distribution:     "perceptual",
  },

  neutralMono: {
    tier: "pure",
    name: "Neutral",
    description: "Near-grays for UI — minimal saturation, maximum versatility",
    chromaMultiplier: 0.28,
    lightnessRange:   [0.12, 0.98],
    chromaRange:      [0.005, 0.08],
    naturalDrift:     0,
    hueShiftDirection: 1,
    chromaCurve:      "flat",
    distribution:     "linear",
  },

  pastelMono: {
    tier: "pure",
    name: "Pastel",
    description: "Soft, high-lightness — gentle and approachable",
    chromaMultiplier: 0.65,
    lightnessRange:   [0.60, 0.97],
    chromaRange:      [0.06, 0.20],
    naturalDrift:     0,
    hueShiftDirection: 1,
    chromaCurve:      "flat",
    distribution:     "linear",
  },

  luxuryMono: {
    tier: "pure",
    name: "Luxury",
    description: "Deep jewel tones — rich saturation, premium sophistication",
    chromaMultiplier: 1.15,
    lightnessRange:   [0.13, 0.78],
    chromaRange:      [0.12, 0.35],
    naturalDrift:     0,
    hueShiftDirection: 1,
    chromaCurve:      "bell",
    distribution:     "linear",
  },

  // ── TONAL ─────────────────────────────────────────────────────────────────

  vintageMono: {
    tier: "tonal",
    name: "Vintage",
    description: "Warm darks, cool lights — aged poster aesthetic",
    chromaMultiplier: 0.60,
    lightnessRange:   [0.22, 0.88],
    chromaRange:      [0.03, 0.20],
    naturalDrift:     6,
    hueShiftDirection: 1,   // darks warm (+), lights cool (-)
    chromaCurve:      "flat",
    distribution:     "perceptual",
  },

  earthMono: {
    tier: "tonal",
    name: "Earth",
    description: "Natural, organic — terracotta, sage, warm-shifted tones",
    chromaMultiplier: 0.48,
    lightnessRange:   [0.22, 0.88],
    chromaRange:      [0.04, 0.18],
    naturalDrift:     8,
    hueShiftDirection: 1,
    warmShift:        8,    // rotates the entire base hue warmer before drift
    chromaCurve:      "flat",
    distribution:     "linear",
  },

  neonMono: {
    tier: "tonal",
    name: "Neon",
    description: "Maximum chroma — electric, digital-forward, cyberpunk",
    chromaMultiplier: 1.30,
    lightnessRange:   [0.42, 0.92],
    chromaRange:      [0.22, 0.38],
    naturalDrift:     4,
    hueShiftDirection: -1,  // darks shift cool, lights warm — electric feel
    chromaCurve:      "peak-mid",
    distribution:     "linear",
  },

  kidsMono: {
    tier: "tonal",
    name: "Kids",
    description: "Bright, vibrant — cheerful and playful, high energy",
    chromaMultiplier: 1.25,
    lightnessRange:   [0.35, 0.94],
    chromaRange:      [0.14, 0.37],
    naturalDrift:     5,
    hueShiftDirection: 1,
    chromaCurve:      "bell",
    distribution:     "perceptual",
  },
};

// ============================================================================
// LIGHTNESS DISTRIBUTION
// ============================================================================

function mapLightness(t, lMin, lMax, distribution) {
  const mapped = distribution === "perceptual"
    ? Math.pow(t, 0.75)  // γ < 1 → extra steps in shadows
    : t;
  return lMin + mapped * (lMax - lMin);
}

// ============================================================================
// CHROMA CURVE
// ============================================================================

function chromaCurveMultiplier(t, curve) {
  switch (curve) {
    case "bell":
      return 0.55 + 0.45 * Math.exp(-Math.pow((t - 0.50) / 0.35, 2));
    case "peak-mid":
      return 0.60 + 0.40 * Math.exp(-Math.pow((t - 0.55) / 0.30, 2));
    default: // "flat"
      return 1.0;
  }
}

// ============================================================================
// HUE DRIFT
// ============================================================================

/**
 * Compute hue offset for position t ∈ [0,1] (0=dark, 1=light).
 *
 * Drift is centred: the input hue stays the visual midpoint of the palette.
 *   t=0.0 → offset = +(drift/2) * direction
 *   t=0.5 → offset = 0
 *   t=1.0 → offset = -(drift/2) * direction
 *
 * This way, the user's chosen hue is never "pulled" to one end.
 */
function computeHueDrift(t, totalDrift, direction) {
  if (totalDrift === 0) return 0;
  return -(t - 0.5) * totalDrift * direction;
}

// ============================================================================
// MAIN EXPORT
// ============================================================================

/**
 * @param {Object} oklch             - Base color { l, c, h }
 * @param {string} monoPalType       - Key from PALETTE_STRATEGIES
 * @param {number} colorCount        - Number of stops (4–15), default 8
 * @param {number|null} hueDrift     - Total hue rotation in ° (0–15).
 *                                     null → use strategy's naturalDrift
 * @param {number} sliderLightValue  - Lightness offset applied to base
 * @param {number} sliderChromaValue - Chroma offset applied to base
 * @returns {Array} colorCount annotated color tokens
 */
export default function monochromaticPalGen(
  oklch,
  monoPalType       = "classicMono",
  colorCount        = 8,
  hueDrift          = null,
  sliderLightValue  = 0,
  sliderChromaValue = 0,
) {
  const clamp    = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const n        = clamp(colorCount, 4, 15);
  const strategy = PALETTE_STRATEGIES[monoPalType] || PALETTE_STRATEGIES.classicMono;

  const {
    chromaMultiplier,
    lightnessRange:    [lMin, lMax],
    chromaRange:       [cMin, cMax],
    naturalDrift,
    hueShiftDirection,
    chromaCurve  = "flat",
    warmShift    = 0,
    distribution,
  } = strategy;

  // hueDrift: caller value takes precedence, otherwise use strategy default
  const effectiveDrift = hueDrift !== null ? clamp(hueDrift, 0, 15) : naturalDrift;

  // Base color with user adjustments + optional warm pre-rotation
  const baseColor = {
    l: clamp(oklch.l + sliderLightValue,  0.01, 0.99),
    c: clamp(oklch.c + sliderChromaValue, 0.00, 0.40),
    h: (oklch.h + warmShift + 360) % 360,
  };

  const stops = selectStops(n);

  return stops.map((stop, i) => {
    const t = n === 1 ? 0.5 : i / (n - 1); // normalised 0→1

    const l = clamp(mapLightness(t, lMin, lMax, distribution), 0.01, 0.99);
    const c = clamp(baseColor.c * chromaMultiplier * chromaCurveMultiplier(t, chromaCurve), cMin, cMax);
    const h = (baseColor.h + computeHueDrift(t, effectiveDrift, hueShiftDirection) + 360) % 360;

    return {
      name:  `Base-${stop}`,
      value: annotateColor(applyPerceptualCorrection({ l, c, h }), stop),
    };
  });
}

// ============================================================================
// NAMED EXPORTS
// ============================================================================

export const MONO_PALETTE_TYPES = Object.keys(PALETTE_STRATEGIES);

export const MONO_PALETTE_INFO = Object.entries(PALETTE_STRATEGIES).map(
  ([key, cfg]) => ({
    id:           key,
    tier:         cfg.tier,
    name:         cfg.name,
    description:  cfg.description,
    naturalDrift: cfg.naturalDrift,
  }),
);

export const PURE_PALETTE_INFO  = MONO_PALETTE_INFO.filter((p) => p.tier === "pure");
export const TONAL_PALETTE_INFO = MONO_PALETTE_INFO.filter((p) => p.tier === "tonal");
/**
 * tetradicPalGen.js — World-class tetradic palette generator
 * Color space: OKLCH (perceptually uniform — lightness, chroma, hue)
 *
 * TETRADIC FORMS:
 *   squareTetra:      0°, 90°, 180°, 270°  — maximally balanced
 *   rectTetra:        0°, 60°, 180°, 240°  — two complementary pairs, more harmonious
 *
 * PALETTE TYPES (each available in both forms):
 *   classicTetra   — Vivid, design-system-ready, clear 60/20/10/10 hierarchy
 *   vintageTetra   — Muted, warm-shifted, aged-poster aesthetic
 *   neutralTetra   — Near-grays with barely-there hue undertones
 *   pastelTetra    — Soft, high-lightness, gentle chroma
 *   luxuryTetra    — Deep jewel tones, tight lightness band, rich saturation
 *   earthTetra     — Terracotta, sage, warm stone, desaturated naturals
 *   neonTetra      — Maximum chroma, digital/UI-forward, near-fluorescent
 *   kidsTetrad     — Bright, high-chroma, cheerful, no scary darks
 *
 * OUTPUT per palette: 16 tokens
 *   Primary   → -D  (dark), base, -L (light), -LL (lightest/text safe)
 *   Secondary → -D, base, -L, -LL
 *   Accent1   → -D, base, -L, -LL
 *   Accent2   → -D, base, -L, -LL
 *
 * Each token also carries:
 *   contrastOnWhite  — WCAG contrast ratio vs white
 *   contrastOnBlack  — WCAG contrast ratio vs black
 *   wcagOnWhite      — "AAA" | "AA" | "AA Large" | "Fail"
 *   wcagOnBlack      — "AAA" | "AA" | "AA Large" | "Fail"
 *   inSRGB           — whether this color is within the sRGB gamut (approx)
 */

// ============================================================================
// PERCEPTUAL UTILITIES
// ============================================================================

/**
 * Hue-lightness correction factor.
 * In OKLCH, yellows (h≈100) are perceptually much lighter than blues (h≈265)
 * at the same `l` value. We compensate by nudging `l` to look visually balanced.
 *
 * Returns a delta to ADD to `l` to counteract the perceptual bias.
 * (Positive = this hue appears darker than average → boost l to compensate)
 */
function perceptualLightnessCorrection(h) {
  // Yellow peak at h≈100 (appears ~10-12% lighter) → we darken slightly
  // Blue trough at h≈265 (appears ~8% darker) → we lighten slightly
  // Formula: smooth sine approximation over 360° hue wheel
  const hueRad = ((h - 100) * Math.PI) / 180;
  return -Math.sin(hueRad) * 0.055; // Range ≈ ±0.055
}

/**
 * Apply perceptual correction to an OKLCH color object.
 * Returns corrected { l, c, h } without mutating the original.
 */
function applyPerceptualCorrection(color) {
  const delta = perceptualLightnessCorrection(color.h);
  return {
    ...color,
    l: Math.min(0.99, Math.max(0.01, color.l + delta)),
  };
}

/**
 * Approximate maximum sRGB-safe chroma for a given hue and lightness.
 * This is a simplified piecewise model — accurate enough for palette generation.
 * For production, consider culori's gamut mapping.
 */
function approxMaxChroma(h, l) {
  // Base gamut curve: widest chroma at l≈0.65
  const lightnessBonus = 1 - Math.pow((l - 0.65) / 0.5, 2);
  const baseMax = 0.33 * Math.max(0, lightnessBonus);

  // Hue-dependent gamut width (empirical approximations):
  // Yellows/greens: wide gamut
  if (h >= 80 && h < 140) return baseMax * 1.1;
  // Red-orange: medium-wide
  if (h >= 20 && h < 80) return baseMax * 1.0;
  // Cyan: narrowest
  if (h >= 160 && h < 220) return baseMax * 0.75;
  // Blue-violet: medium-narrow
  if (h >= 220 && h < 300) return baseMax * 0.82;
  return baseMax;
}

/**
 * Clamp OKLCH chroma to approximate sRGB gamut.
 * Also returns inSRGB flag.
 */
function gamutClamp(color) {
  const maxC = approxMaxChroma(color.h, color.l);
  const wasInGamut = color.c <= maxC;
  return {
    ...color,
    c: Math.min(color.c, maxC),
    inSRGB: wasInGamut,
  };
}

// ============================================================================
// WCAG CONTRAST UTILITIES (OKLCH → relative luminance → contrast ratio)
// ============================================================================

/**
 * Convert OKLCH lightness (l) to approximate sRGB relative luminance.
 * OKLCH `l` ≈ perceptual lightness; we need WCAG's linear luminance.
 * Approximate: Y ≈ l^2.2 (close enough for contrast guidance).
 */
function oklchToLuminance(l) {
  // l in OKLCH is roughly ≈ perceived lightness (0–1)
  // WCAG relative luminance is closer to l^2.2 for this approximation
  return Math.pow(Math.max(0, Math.min(1, l)), 2.2);
}

function contrastRatio(l1, l2) {
  const lum1 = oklchToLuminance(l1);
  const lum2 = oklchToLuminance(l2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

function wcagRating(ratio) {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA Large";
  return "Fail";
}

/**
 * Annotate a raw { l, c, h } color with contrast metadata.
 */
function annotateColor(color) {
  const onWhite = contrastRatio(color.l, 1.0);
  const onBlack = contrastRatio(color.l, 0.0);
  const clamped = gamutClamp(color);
  return {
    l: color.l,
    c: color.c,
    h: color.h,
    contrastOnWhite: Math.round(onWhite * 100) / 100,
    contrastOnBlack: Math.round(onBlack * 100) / 100,
    wcagOnWhite: wcagRating(onWhite),
    wcagOnBlack: wcagRating(onBlack),
    inSRGB: clamped.inSRGB,
  };
}

// ============================================================================
// HUES: Compute the 4 tetradic hues
// ============================================================================

/**
 * Returns the 4 hues for the chosen tetradic form.
 *   squareTetra:  [h, h+90, h+180, h+270]
 *   rectTetra:    [h, h+60, h+180, h+240]  (two complementary pairs)
 */
function getTetradicHues(baseHue, form = "squareTetra") {
  const h = ((baseHue % 360) + 360) % 360; // Normalize to [0, 360)
  if (form === "rectTetra") {
    return [h, (h + 60) % 360, (h + 180) % 360, (h + 240) % 360];
  }
  // Default: squareTetra
  return [h, (h + 90) % 360, (h + 180) % 360, (h + 270) % 360];
}

// ============================================================================
// VARIANT BUILDER FACTORY
// Creates a context-aware variant builder for each palette type
// ============================================================================

function makeVariantBuilder(lMin, lMax, cMin, cMax) {
  return function createVariant(base, lightnessDelta, chromaFactor) {
    // Apply correction BEFORE clamping so clamp uses already-corrected value
    const correctedL = base.l + lightnessDelta;
    return {
      l: Math.min(lMax, Math.max(lMin, correctedL)),
      c: Math.min(cMax, Math.max(cMin, base.c * chromaFactor)),
      h: base.h,
    };
  };
}

// ============================================================================
// PALETTE TYPE STRATEGIES
// Each returns { lMin, lMax, cMin, cMax, buildBase(hue, oklch) }
// ============================================================================

const PALETTE_STRATEGIES = {
  // ──────────────────────────────────────────────────────────────────
  classicTetra: {
    lMin: 0.3,
    lMax: 0.85,
    cMin: 0.08,
    cMax: 0.32,
    // Dominance: Primary is most vivid; accents step down subtly but perceptibly
    dominanceScale: [1.0, 0.9, 0.82, 0.88], // Per color: [primary, sec, acc1, acc2]
    // lightnessDelta: [dark, base boost, light, lightest]
    variants: [-0.26, 0, 0.25, 0.42],
    // chromaFactor for each variant
    chromaFactors: [1.18, 1.0, 0.72, 0.5],
    buildBase(hue, oklch, dominance) {
      const l = Math.min(0.75, Math.max(0.4, oklch.l));
      const c = Math.min(0.28, Math.max(0.12, oklch.c)) * dominance;
      return applyPerceptualCorrection({ l, c, h: hue });
    },
  },

  // ──────────────────────────────────────────────────────────────────
  vintageTetra: {
    lMin: 0.35,
    lMax: 0.75,
    cMin: 0.03,
    cMax: 0.2,
    dominanceScale: [1.0, 0.95, 0.88, 0.92],
    variants: [-0.2, 0, 0.22, 0.36],
    chromaFactors: [1.15, 1.0, 0.75, 0.55],
    buildBase(hue, oklch, dominance) {
      // Warm-shift hues
      let shiftedHue = hue;
      if (hue >= 0 && hue < 45) shiftedHue = (hue + 12) % 360;
      else if (hue >= 45 && hue < 100) shiftedHue = (hue + 18) % 360;
      else if (hue >= 100 && hue < 160) shiftedHue = (hue + 10) % 360;
      else if (hue >= 160 && hue < 200) shiftedHue = (hue - 5 + 360) % 360;
      else if (hue >= 200 && hue < 280) shiftedHue = (hue - 8 + 360) % 360;
      else shiftedHue = (hue + 6) % 360;

      // Hue-dependent vintage chroma
      const baseDesaturation =
        Math.min(0.25, Math.max(0.1, oklch.c)) * 0.5 * dominance;
      let c;
      if (shiftedHue >= 20 && shiftedHue < 80)
        c = Math.min(0.2, Math.max(0.03, baseDesaturation * 1.4));
      else if (shiftedHue >= 340 || shiftedHue < 20)
        c = Math.min(0.18, Math.max(0.03, baseDesaturation * 1.2));
      else if (shiftedHue >= 180 && shiftedHue < 280)
        c = Math.min(0.14, Math.max(0.03, baseDesaturation * 0.9));
      else c = Math.min(0.16, Math.max(0.03, baseDesaturation * 1.1));

      const l = Math.min(0.58, Math.max(0.42, oklch.l));
      return applyPerceptualCorrection({ l, c, h: shiftedHue });
    },
  },

  // ──────────────────────────────────────────────────────────────────
  neutralTetra: {
    lMin: 0.2,
    lMax: 0.92,
    cMin: 0.01,
    cMax: 0.1,
    dominanceScale: [1.0, 0.95, 0.88, 0.92],
    variants: [-0.3, 0, 0.3, 0.48],
    chromaFactors: [1.2, 1.0, 0.7, 0.5],
    buildBase(hue, oklch, dominance) {
      const l = Math.min(0.65, Math.max(0.45, oklch.l));
      const c = Math.min(0.1, Math.max(0.01, oklch.c * 0.38 * dominance));
      return applyPerceptualCorrection({ l, c, h: hue });
    },
  },

  // ──────────────────────────────────────────────────────────────────
  pastelTetra: {
    lMin: 0.65,
    lMax: 0.96,
    cMin: 0.06,
    cMax: 0.2,
    dominanceScale: [1.0, 0.95, 0.88, 0.92],
    variants: [-0.14, 0, 0.1, 0.18],
    chromaFactors: [1.1, 1.0, 0.82, 0.65],
    buildBase(hue, oklch, dominance) {
      const l = Math.min(0.82, Math.max(0.72, oklch.l + 0.15));
      const c = Math.min(0.2, Math.max(0.06, oklch.c * 0.65 * dominance));
      return applyPerceptualCorrection({ l, c, h: hue });
    },
  },

  // ──────────────────────────────────────────────────────────────────
  luxuryTetra: {
    lMin: 0.22,
    lMax: 0.68,
    cMin: 0.1,
    cMax: 0.34,
    dominanceScale: [1.0, 0.92, 0.85, 0.9],
    variants: [-0.16, 0, 0.18, 0.3],
    chromaFactors: [1.15, 1.0, 0.78, 0.55],
    buildBase(hue, oklch, dominance) {
      // Luxury: Push toward deeper, jewel-tone territory
      const l = Math.min(0.52, Math.max(0.32, oklch.l - 0.08));
      const c = Math.min(0.34, Math.max(0.14, oklch.c * 1.15 * dominance));
      return applyPerceptualCorrection({ l, c, h: hue });
    },
  },

  // ──────────────────────────────────────────────────────────────────
  earthTetra: {
    lMin: 0.3,
    lMax: 0.82,
    cMin: 0.03,
    cMax: 0.18,
    dominanceScale: [1.0, 0.92, 0.85, 0.9],
    variants: [-0.22, 0, 0.24, 0.4],
    chromaFactors: [1.12, 1.0, 0.72, 0.5],
    buildBase(hue, oklch, dominance) {
      // Warm-shift everything toward earthy ochres, terracotta, sage
      let earthHue = hue;
      // Push cool hues toward their warm neighbours for earth palette
      if (hue >= 200 && hue < 280) earthHue = (hue + 20) % 360; // Blues → purple (denim, slate)
      if (hue >= 140 && hue < 200) earthHue = (hue - 15 + 360) % 360; // Cyans → sage green

      const l = Math.min(0.68, Math.max(0.4, oklch.l));
      const c = Math.min(0.18, Math.max(0.04, oklch.c * 0.52 * dominance));
      return applyPerceptualCorrection({ l, c, h: earthHue });
    },
  },

  // ──────────────────────────────────────────────────────────────────
  neonTetra: {
    lMin: 0.45,
    lMax: 0.88,
    cMin: 0.22,
    cMax: 0.38,
    dominanceScale: [1.0, 0.95, 0.9, 0.92],
    variants: [-0.2, 0, 0.2, 0.35],
    chromaFactors: [1.05, 1.0, 0.88, 0.72],
    buildBase(hue, oklch, dominance) {
      // Max out chroma — rein it in only for gamut safety later
      const l = Math.min(0.72, Math.max(0.52, oklch.l));
      const c = Math.min(0.38, Math.max(0.22, oklch.c * 1.3 * dominance));
      return applyPerceptualCorrection({ l, c, h: hue });
    },
  },

  // ──────────────────────────────────────────────────────────────────
  kidsTetrad: {
    lMin: 0.5,
    lMax: 0.92,
    cMin: 0.12,
    cMax: 0.35,
    dominanceScale: [1.0, 0.95, 0.9, 0.92],
    variants: [-0.18, 0, 0.16, 0.28],
    chromaFactors: [1.1, 1.0, 0.88, 0.7],
    buildBase(hue, oklch, dominance) {
      const l = Math.min(0.82, Math.max(0.6, oklch.l + 0.1));
      const c = Math.min(0.35, Math.max(0.14, oklch.c * 1.25 * dominance));
      return applyPerceptualCorrection({ l, c, h: hue });
    },
  },
};

// ============================================================================
// MAIN EXPORT
// ============================================================================

/**
 * @param {Object} oklch        - Base color: { l: 0–1, c: 0–0.4, h: 0–360 }
 * @param {string} palType      - One of the PALETTE_STRATEGIES keys (default: "classicTetra")
 * @param {string} tetraForm    - "squareTetra" | "rectTetra" (default: "squareTetra")
 * @returns {Array}             - 16 annotated color tokens
 */
export default function tetradicPalGen(
  oklch,
  palType = "classicTetra",
  tetraForm = "squareTetra",
) {
  // Resolve strategy (fall back to classicTetra for unknown keys)
  const strategy =
    PALETTE_STRATEGIES[palType] ?? PALETTE_STRATEGIES.classicTetra;
  const {
    lMin,
    lMax,
    cMin,
    cMax,
    dominanceScale,
    variants,
    chromaFactors,
    buildBase,
  } = strategy;

  // Get the 4 hues for the chosen tetradic form
  const hues = getTetradicHues(oklch.h, tetraForm);
  const colorLabels = ["Primary", "Secondary", "Accent1", "Accent2"];
  const variantSuffixes = ["-D", "", "-L", "-LL"];

  const createVariant = makeVariantBuilder(lMin, lMax, cMin, cMax);

  const result = [];

  hues.forEach((hue, colorIndex) => {
    const dominance = dominanceScale[colorIndex];
    const base = buildBase(hue, oklch, dominance);

    variantSuffixes.forEach((suffix, varIdx) => {
      const lightnessDelta = variants[varIdx];
      const chromaFactor = chromaFactors[varIdx];

      const raw =
        lightnessDelta === 0
          ? { l: base.l, c: base.c, h: base.h }
          : createVariant(base, lightnessDelta, chromaFactor);

      const annotated = annotateColor(raw);
      const label = colorLabels[colorIndex];
      const name = suffix === "" ? label : `${label}${suffix}`;

      result.push({ name, value: annotated });
    });
  });

  return result;
}

// ============================================================================
// NAMED EXPORT: List all available palette types
// ============================================================================
export const TETRADIC_PALETTE_TYPES = Object.keys(PALETTE_STRATEGIES);

// ============================================================================
// NAMED EXPORT: List all available tetradic forms
// ============================================================================
export const TETRADIC_FORMS = ["squareTetra", "rectTetra"];

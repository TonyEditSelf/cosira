/**
 * monochromaticPalGen.js - World-class monochromatic palette generator
 *
 * Generates 8 perceptually-balanced monochromatic variants (Base-950 to Base-50)
 * Color space: OKLCH (perceptually uniform lightness, chroma, hue)
 *
 * PALETTE TYPES:
 *   classicMono   - Pure monochromatic, full dynamic range
 *   vintageMono   - Desaturated, warm darks + cool lights, aged aesthetic
 *   neutralMono   - Near-grays for UI, minimal saturation
 *   pastelMono    - Soft, high-lightness, gentle chroma
 *   luxuryMono    - Deep jewel tones, rich saturation, premium feel
 *   earthMono     - Natural, warm-shifted, desaturated organics
 *   neonMono      - Maximum chroma, digital-forward, electric
 *   kidsMono      - Bright, vibrant, cheerful, playful
 *
 * OUTPUT per palette: 8 tokens (Base-950, 800, 700, 600, 400, 300, 200, 50)
 * Each token carries:
 *   - l, c, h (OKLCH values)
 *   - contrastOnWhite / contrastOnBlack (WCAG ratios)
 *   - wcagOnWhite / wcagOnBlack ("AAA" | "AA" | "AA Large" | "Fail")
 *   - bestTextColor ("black" | "white")
 *   - inSRGB (gamut safety flag)
 *   - role (semantic usage hint: "text" | "border" | "background")
 */

// ============================================================================
// PERCEPTUAL UTILITIES
// ============================================================================

/**
 * Hue-lightness correction factor
 * Yellows (h≈100) appear lighter, blues (h≈265) darker at same L
 */
function perceptualLightnessCorrection(h) {
  const hueRad = ((h - 100) * Math.PI) / 180;
  return -Math.sin(hueRad) * 0.055; // ±5.5% correction
}

function applyPerceptualCorrection(color) {
  const delta = perceptualLightnessCorrection(color.h);
  return {
    ...color,
    l: Math.min(0.99, Math.max(0.01, color.l + delta)),
  };
}

/**
 * Approximate sRGB gamut boundaries for OKLCH
 */
function approxMaxChroma(h, l) {
  const lightnessBonus = 1 - Math.pow((l - 0.65) / 0.5, 2);
  const baseMax = 0.33 * Math.max(0, lightnessBonus);

  // Hue-dependent gamut width
  if (h >= 80 && h < 140) return baseMax * 1.1; // Yellow-green
  if (h >= 20 && h < 80) return baseMax * 1.0; // Red-orange
  if (h >= 160 && h < 220) return baseMax * 0.75; // Cyan (narrowest)
  if (h >= 220 && h < 300) return baseMax * 0.82; // Blue-violet
  return baseMax;
}

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
// WCAG CONTRAST UTILITIES
// ============================================================================

function oklchToLuminance(l) {
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

function getBestTextColor(bgL) {
  const onWhite = contrastRatio(bgL, 1.0);
  const onBlack = contrastRatio(bgL, 0.0);
  return onBlack > onWhite ? "black" : "white";
}

/**
 * Determine semantic role based on lightness and contrast
 */
function getColorRole(l, contrastOnWhite, contrastOnBlack) {
  if (contrastOnWhite >= 4.5) return "text"; // Dark enough for text on white
  if (contrastOnBlack >= 4.5) return "text"; // Light enough for text on black
  if (l > 0.85 || l < 0.2) return "background"; // Very light or very dark
  return "border"; // Mid-tones good for borders/dividers
}

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
    bestTextColor: getBestTextColor(color.l),
    role: getColorRole(color.l, onWhite, onBlack),
    inSRGB: clamped.inSRGB,
  };
}

// ============================================================================
// PALETTE TYPE CONFIGURATIONS
// ============================================================================

const PALETTE_STRATEGIES = {
  classicMono: {
    name: "Classic",
    description:
      "Pure monochromatic - full dynamic range, only lightness varies",
    chromaMultiplier: 1.0,
    lightnessRange: [0.08, 0.98],
    chromaRange: [0, 0.4],
    hueShift: { dark: 0, light: 0 },
    distribution: "exponential",
  },

  vintageMono: {
    name: "Vintage",
    description:
      "Desaturated with warm darks, cool lights - aged poster aesthetic",
    chromaMultiplier: 0.6,
    lightnessRange: [0.22, 0.88],
    chromaRange: [0.03, 0.2],
    hueShift: { dark: 3, light: -3 },
    distribution: "exponential",
  },

  neutralMono: {
    name: "Neutral",
    description: "Near-grays for UI - minimal saturation, maximum versatility",
    chromaMultiplier: 0.28,
    lightnessRange: [0.12, 0.98],
    chromaRange: [0.005, 0.08],
    hueShift: { dark: 0, light: 0 },
    distribution: "linear",
  },

  pastelMono: {
    name: "Pastel",
    description: "Soft, high-lightness - gentle and approachable",
    chromaMultiplier: 0.65,
    lightnessRange: [0.58, 0.96],
    chromaRange: [0.06, 0.2],
    hueShift: { dark: 2, light: -1 },
    distribution: "linear",
  },

  luxuryMono: {
    name: "Luxury",
    description: "Deep jewel tones - rich saturation, premium sophistication",
    chromaMultiplier: 1.15,
    lightnessRange: [0.15, 0.75], // ← Even wider: 60% range
    chromaRange: [0.12, 0.35],
    hueShift: { dark: 4, light: -2 },
    distribution: "linear", // ← CHANGED to linear for even spacing
  },

  earthMono: {
    name: "Earth",
    description: "Natural, warm-shifted - terracotta, sage, organic tones",
    chromaMultiplier: 0.48,
    lightnessRange: [0.25, 0.85], // ← Slightly wider
    chromaRange: [0.04, 0.18],
    hueShift: { dark: 5, light: -3 },
    warmShift: 8,
    distribution: "linear", // ← CHANGED from "exponential"
  },

  neonMono: {
    name: "Neon",
    description: "Maximum chroma - electric, digital-forward, cyberpunk",
    chromaMultiplier: 1.3,
    lightnessRange: [0.45, 0.88],
    chromaRange: [0.22, 0.38],
    hueShift: { dark: 2, light: -2 },
    distribution: "linear",
  },

  kidsMono: {
    name: "Kids",
    description: "Bright, vibrant - cheerful and playful, high energy",
    chromaMultiplier: 1.25,
    lightnessRange: [0.35, 0.92],
    chromaRange: [0.14, 0.37],
    hueShift: { dark: 0, light: 0 },
    distribution: "exponential",
  },
};

// ============================================================================
// LIGHTNESS DISTRIBUTION FUNCTIONS
// ============================================================================

/**
 * Generate 8 lightness values with proper distribution
 *
 * Exponential: More granularity at extremes (better for text/backgrounds)
 * Linear: Even spacing (better for UI elements in tight ranges)
 */
function getLightnessScale(baseL, distribution, lMin, lMax) {
  const clamp = (val) => Math.min(lMax, Math.max(lMin, val));

  if (distribution === "linear") {
    // Even spacing - ideal for pastels/neutrals/neon
    const span = lMax - lMin;
    return {
      l950: clamp(lMin + span * 0.05),
      l800: clamp(lMin + span * 0.2),
      l700: clamp(lMin + span * 0.35),
      l600: clamp(lMin + span * 0.45),
      l400: clamp(lMin + span * 0.62),
      l300: clamp(lMin + span * 0.75),
      l200: clamp(lMin + span * 0.88),
      l50: clamp(lMin + span * 0.98),
    };
  }

  // Exponential distribution - more steps at extremes
  // Uses user's base as anchor, scales around it
  const darkestRatio = 0.3; // 950 is 30% of base
  const darkerRatio = 0.5; // 800 is 50% of base
  const darkRatio = 0.7; // 700 is 70% of base
  const midDarkRatio = 0.85; // 600 is 85% of base

  return {
    l950: clamp(baseL * darkestRatio),
    l800: clamp(baseL * darkerRatio),
    l700: clamp(baseL * darkRatio),
    l600: clamp(baseL * midDarkRatio),
    l400: clamp(baseL + (1 - baseL) * 0.25),
    l300: clamp(baseL + (1 - baseL) * 0.45),
    l200: clamp(baseL + (1 - baseL) * 0.68),
    l50: clamp(baseL + (1 - baseL) * 0.88),
  };
}

// ============================================================================
// MAIN EXPORT
// ============================================================================

/**
 * @param {Object} oklch - Base color: { l: 0-1, c: 0-0.4, h: 0-360 }
 * @param {string} monoPalType - One of PALETTE_STRATEGIES keys
 * @param {number} sliderLightValue - Optional lightness adjustment
 * @param {number} sliderChromaValue - Optional chroma adjustment
 * @returns {Array} - 8 annotated color tokens
 */
export default function monochromaticPalGen(
  oklch,
  monoPalType = "classicMono",
  sliderLightValue = 0,
  sliderChromaValue = 0,
) {
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const strategy =
    PALETTE_STRATEGIES[monoPalType] || PALETTE_STRATEGIES.classicMono;

  const {
    chromaMultiplier,
    lightnessRange: [lMin, lMax],
    chromaRange: [cMin, cMax],
    hueShift,
    warmShift = 0,
    distribution,
  } = strategy;

  // User's base color with adjustments
  const userBaseColor = {
    l: clamp(oklch.l + sliderLightValue, 0, 1),
    c: clamp(oklch.c + sliderChromaValue, 0, 0.4),
    h: (oklch.h + warmShift + 360) % 360,
  };

  // Generate lightness scale
  const scale = getLightnessScale(userBaseColor.l, distribution, lMin, lMax);

  // Color creation helper
  const createColor = (lightnessValue, chromaFactor, hueShiftVal) => {
    const rawC = userBaseColor.c * chromaMultiplier * chromaFactor;
    const rawH = (userBaseColor.h + hueShiftVal + 360) % 360;

    const color = applyPerceptualCorrection({
      l: lightnessValue,
      c: clamp(rawC, cMin, cMax),
      h: rawH,
    });

    return annotateColor(color);
  };

  // Generate 8-color palette with progressive hue shifts
  return [
    {
      name: "Base-950",
      value: createColor(scale.l950, 1.0, hueShift.dark * 1.0),
    },
    {
      name: "Base-800",
      value: createColor(scale.l800, 1.0, hueShift.dark * 0.7),
    },
    {
      name: "Base-700",
      value: createColor(scale.l700, 1.0, hueShift.dark * 0.4),
    },
    {
      name: "Base-600",
      value: createColor(scale.l600, 0.98, hueShift.dark * 0.2),
    },
    {
      name: "Base-400",
      value: createColor(scale.l400, 0.95, hueShift.light * 0.2),
    },
    {
      name: "Base-300",
      value: createColor(scale.l300, 0.88, hueShift.light * 0.4),
    },
    {
      name: "Base-200",
      value: createColor(scale.l200, 0.75, hueShift.light * 0.7),
    },
    {
      name: "Base-50",
      value: createColor(scale.l50, 0.6, hueShift.light * 1.0),
    },
  ];
}

// ============================================================================
// NAMED EXPORTS
// ============================================================================

export const MONO_PALETTE_TYPES = Object.keys(PALETTE_STRATEGIES);

export const MONO_PALETTE_INFO = Object.entries(PALETTE_STRATEGIES).map(
  ([key, config]) => ({
    id: key,
    name: config.name,
    description: config.description,
  }),
);

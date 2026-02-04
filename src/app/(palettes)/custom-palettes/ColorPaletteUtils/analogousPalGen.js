import { clampToGamut, clampColorToGamut } from "./gamutMapping";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/**
 * Chroma compensation for perceptual uniformity across hues
 * Applied ONCE per color creation
 */
function getChromaCompensation(hue) {
  const h = ((hue % 360) + 360) % 360;

  // Yellow (30-90): NEEDS more chroma to look vibrant in OKLCH
  if (h >= 30 && h < 90) return 1.15;
  // Green (90-150): Already appears saturated
  if (h >= 90 && h < 150) return 1.0;
  // Cyan (150-210): Very saturated, reduce slightly
  if (h >= 150 && h < 210) return 0.85;
  // Blue (210-270): Naturally saturated in OKLCH
  if (h >= 210 && h < 270) return 0.95;
  // Magenta (270-330): Needs boost
  if (h >= 270 && h < 330) return 1.1;
  // Red (330-30): Slight boost
  return 1.05;
}

/**
 * Get palette-specific default angles
 */
export function getBaseAngles(palType) {
  if (palType.includes("vintage")) return 20;
  if (palType.includes("neutral")) return 15;
  if (palType.includes("pastel")) return 30;
  return 35; // classic
}

/**
 * Palette type configurations
 */
const PALETTE_CONFIGS = {
  classic: {
    chromaMultiplier: 1.0,
    lightnessMin: 0,
    lightnessMax: 1,
    chromaMin: 0,
    chromaMax: 0.4, // Will be overridden by gamut mapping
    hueShift: 0,
    // Variant multipliers to ensure distinction
    darkerL: 0.6,
    darkerC: 1.2,
    darkL: 0.8,
    darkC: 1.1,
    lightL: 0.3, // Additive strength
    lightC: 0.85,
  },
  vintage: {
    chromaMultiplier: 0.55,
    lightnessMin: 0.3,
    lightnessMax: 0.9,
    chromaMin: 0.04,
    chromaMax: 0.25,
    hueShift: 8,
    // Tighter range but still distinct
    darkerL: 0.7,
    darkerC: 1.2,
    darkL: 0.85,
    darkC: 1.1,
    lightL: 0.25,
    lightC: 0.8,
  },
  neutral: {
    chromaMultiplier: 0.4,
    lightnessMin: 0.15,
    lightnessMax: 0.98,
    chromaMin: 0.01,
    chromaMax: 0.12,
    hueShift: 0,
    // Wider lightness range for low chroma
    darkerL: 0.5,
    darkerC: 1.15,
    darkL: 0.7,
    darkC: 1.08,
    lightL: 0.4,
    lightC: 0.85,
  },
  pastel: {
    chromaMultiplier: 0.6,
    lightnessMultiplier: 1.15,
    lightnessMin: 0.7,
    lightnessMax: 0.95,
    chromaMin: 0.08,
    chromaMax: 0.22,
    hueShift: 0,
    // Subtle but distinct variations
    darkerL: 0.88, // Stay very light
    darkerC: 1.12,
    darkL: 0.94,
    darkC: 1.05,
    lightL: 0.4, // Small steps in tight range
    lightC: 0.92,
  },
};

/**
 * Create a color with chroma compensation and gamut mapping applied ONCE
 * This is the ONLY place where compensation happens
 */
function createColor(l, c, h, config) {
  // Apply chroma compensation ONCE
  const compensatedC = c * getChromaCompensation(h);

  // Clamp to config limits
  const clampedL = clamp(l, config.lightnessMin, config.lightnessMax);
  const clampedC = clamp(compensatedC, config.chromaMin, config.chromaMax);

  // Apply gamut mapping (this is the REAL ceiling, not 0.4)
  const gamutSafeC = clampToGamut(clampedL, clampedC, h);

  return {
    l: clampedL,
    c: gamutSafeC,
    h: (h + 360) % 360,
  };
}

/**
 * Generate 4 DISTINCT tonal variants for a base color
 * FIXED: Each variant uses different multipliers to ensure distinction
 */
function generateVariants(baseL, baseC, baseH, config, paletteType) {
  // Hue shifts for depth (warmer darks, cooler lights)
  const hueShifts = {
    classic: { darker: 5, dark: 3, light: -2 },
    vintage: { darker: 6, dark: 4, light: -3 },
    neutral: { darker: 2, dark: 1, light: -1 },
    pastel: { darker: 3, dark: 2, light: -1 },
  };

  const shifts = hueShifts[paletteType] || hueShifts.classic;

  // CRITICAL: Use config-specific multipliers for each variant
  return {
    darker: createColor(
      baseL * config.darkerL,
      baseC * config.darkerC,
      baseH + shifts.darker,
      config,
    ),
    dark: createColor(
      baseL * config.darkL,
      baseC * config.darkC,
      baseH + shifts.dark,
      config,
    ),
    base: createColor(baseL, baseC, baseH, config),
    light: createColor(
      baseL + (config.lightnessMax - baseL) * config.lightL,
      baseC * config.lightC,
      baseH + shifts.light,
      config,
    ),
  };
}

/**
 * Get palette type from analogPalType string
 */
function getPaletteType(analogPalType) {
  if (analogPalType.includes("vintage")) return "vintage";
  if (analogPalType.includes("neutral")) return "neutral";
  if (analogPalType.includes("pastel")) return "pastel";
  return "classic";
}

/**
 * Get layout type from analogPalType string
 */
function getLayoutType(analogPalType) {
  if (analogPalType.includes("Left")) return "left";
  if (analogPalType.includes("Right")) return "right";
  return "centered";
}

/**
 * Calculate analogous color angles based on layout
 */
function getAnalogousAngles(layout, angle1, angle2) {
  const absAngle1 = Math.abs(angle1);
  const absAngle2 = Math.abs(angle2);

  switch (layout) {
    case "left":
      return {
        a1: -absAngle1 * 2, // Far left
        a2: -absAngle1, // Mid left
      };
    case "right":
      return {
        a1: absAngle2, // Mid right
        a2: absAngle2 * 2, // Far right
      };
    case "centered":
    default:
      return {
        a1: angle1, // Left of base
        a2: angle2, // Right of base
      };
  }
}

/**
 * Assemble final palette in correct order based on layout
 * 12 colors total (4 variants × 3 hues)
 */
function assemblePalette(
  baseVariants,
  a1Variants,
  a2Variants,
  layout,
  prefix = "",
) {
  const createGroup = (variants, name) => [
    { name: `${prefix}${name}-DD`, value: variants.darker },
    { name: `${prefix}${name}-D`, value: variants.dark },
    { name: `${prefix}${name}`, value: variants.base },
    { name: `${prefix}${name}-L`, value: variants.light },
  ];

  switch (layout) {
    case "left":
      return [
        ...createGroup(a1Variants, "A1"),
        ...createGroup(a2Variants, "A2"),
        ...createGroup(baseVariants, "Base"),
      ];
    case "right":
      return [
        ...createGroup(baseVariants, "Base"),
        ...createGroup(a1Variants, "A1"),
        ...createGroup(a2Variants, "A2"),
      ];
    case "centered":
    default:
      return [
        ...createGroup(a1Variants, "A1"),
        ...createGroup(baseVariants, "Base"),
        ...createGroup(a2Variants, "A2"),
      ];
  }
}

/**
 * MAIN GENERATOR - Single unified algorithm
 * Generates 12 DISTINCT colors
 */
export default function analogousPalGen(
  oklch,
  analogOptions,
  analogPalType,
  sliderLightValue = 0,
  sliderChromaValue = 0,
) {
  // Extract palette type and layout
  const paletteType = getPaletteType(analogPalType);
  const layout = getLayoutType(analogPalType);
  const config = PALETTE_CONFIGS[paletteType];

  // Get angles (use defaults if not provided)
  const baseAngle = getBaseAngles(analogPalType);
  const angle1 = analogOptions?.analogousAngle1 ?? -baseAngle;
  const angle2 = analogOptions?.analogousAngle2 ?? baseAngle;
  const angles = getAnalogousAngles(layout, angle1, angle2);

  // Calculate base color with palette-specific modifications
  let baseL = oklch.l + sliderLightValue;
  let baseC = oklch.c + sliderChromaValue;
  let baseH = oklch.h;

  // Apply palette-specific modifications to input
  if (paletteType === "pastel") {
    baseL = baseL * (config.lightnessMultiplier || 1);
  }

  baseC = baseC * config.chromaMultiplier;
  baseH = (baseH + config.hueShift) % 360;

  // Clamp to palette limits before creating colors
  baseL = clamp(baseL, config.lightnessMin, config.lightnessMax);
  baseC = clamp(baseC, config.chromaMin, config.chromaMax);

  // Generate variants for base color
  const baseVariants = generateVariants(
    baseL,
    baseC,
    baseH,
    config,
    paletteType,
  );

  // Generate variants for analogous color 1
  const a1H = (baseH + angles.a1 + 360) % 360;
  const a1Variants = generateVariants(baseL, baseC, a1H, config, paletteType);

  // Generate variants for analogous color 2
  const a2H = (baseH + angles.a2 + 360) % 360;
  const a2Variants = generateVariants(baseL, baseC, a2H, config, paletteType);

  // Assemble palette with correct layout
  const prefix = paletteType === "pastel" ? "Pastel-" : "";
  return assemblePalette(baseVariants, a1Variants, a2Variants, layout, prefix);
}

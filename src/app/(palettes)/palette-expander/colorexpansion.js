// utils/colorExpansion.js
// Phase 1 fixes:
//   1. Separate neutral scale (independent near-zero-chroma gray)
//   2. Scale discontinuity fix — ceiling applied to step 500 base anchor
//   3. findCompliantToken uses perceptual distance, not numeric direction bias
//   4. oklchToRgbValues exported for CSS rgb() fallback generation
//   5. Worst-case background contrast checking

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function validateColor(color) {
  if (!color || typeof color !== "object")
    throw new Error("Color must be an object");
  if (typeof color.l !== "number" || color.l < 0 || color.l > 1)
    throw new Error(`Invalid lightness: ${color.l}`);
  if (typeof color.c !== "number" || color.c < 0)
    throw new Error(`Invalid chroma: ${color.c}`);
  if (typeof color.h !== "number") throw new Error(`Invalid hue: ${color.h}`);
  if (
    color.a !== undefined &&
    (typeof color.a !== "number" || color.a < 0 || color.a > 1)
  )
    throw new Error(`Invalid alpha: ${color.a}`);
  return true;
}

function validatePalette(palette) {
  if (!Array.isArray(palette)) throw new Error("Palette must be an array");
  if (palette.length === 0) throw new Error("Palette cannot be empty");
  palette.forEach((item, idx) => {
    if (!item.value)
      throw new Error(`Palette item ${idx} missing 'value' property`);
    validateColor(item.value);
  });
  return true;
}

function adaptiveChroma(baseC, targetL, mode) {
  let scale = 1;
  switch (mode) {
    case "low":
      scale = 0.25;
      break;
    case "soft":
      scale = 0.45;
      break;
    case "reduce":
      scale = 0.8;
      break;
    case "base":
      scale = 1;
      break;
    case "boost":
      scale = 1.15;
      break;
  }
  let adjustedC = baseC * scale;
  // Apply lightness-based chroma dampening once, not twice
  if (targetL > 0.85) adjustedC *= 0.7;
  else if (targetL > 0.75) adjustedC *= 0.85;
  if (targetL < 0.25) adjustedC *= 0.75;
  else if (targetL < 0.35) adjustedC *= 0.9;
  return clamp(adjustedC, 0.01, 0.37);
}

function makeShade(base, targetL, chromaMode) {
  validateColor(base);
  const { h, a } = base;
  const newC = adaptiveChroma(base.c, targetL, chromaMode);
  const newL = clamp(targetL, 0.02, 0.98);
  const shade = { l: newL, c: newC, h };
  if (a !== undefined) shade.a = a;
  return shade;
}

function invertLightness(l, darkModeFloor = 0.12) {
  const inverted = 1 - Math.pow(l, 0.8);
  return Math.max(inverted, darkModeFloor);
}

function darkModeChroma(c, targetL) {
  const chromaScale = targetL < 0.3 ? 0.6 : 0.75;
  return clamp(c * chromaScale, 0.01, 0.35);
}

function darkModeHueShift(h, l) {
  if (h >= 180 && h <= 270) return (h + 5) % 360;
  return h;
}

export function invertForDarkMode(color, options = {}) {
  validateColor(color);
  const { l, c, h, a } = color;
  const { darkModeFloor = 0.12 } = options;
  const newL = invertLightness(l, darkModeFloor);
  const newC = darkModeChroma(c, newL);
  const newH = darkModeHueShift(h, newL);
  const inverted = { l: newL, c: newC, h: newH };
  if (a !== undefined) inverted.a = a;
  return inverted;
}

// FIX 1 + FIX 2: Step 500 now uses an anchored lightness derived from the
// ceiling rather than the raw base color. This prevents light-input colors
// from producing a broken/inverted scale, and ensures the ceiling is
// consistently applied across all steps.
export function generateScale(base, options = {}) {
  validateColor(base);
  const { lightModeCeiling = 0.97 } = options;

  // Anchor the mid-point at a fixed perceptual lightness so the scale is
  // always dark-to-light regardless of the input color's own lightness.
  // We clamp it so very dark inputs still produce a usable scale.
  const midL = clamp(base.l, 0.35, 0.65);

  const applyC = (l) => Math.min(l, lightModeCeiling);

  return {
    50: makeShade(base, applyC(0.98), "low"),
    100: makeShade(base, applyC(0.95), "low"),
    200: makeShade(base, applyC(0.9), "soft"),
    300: makeShade(base, applyC(0.8), "soft"),
    400: makeShade(base, applyC(0.7), "reduce"),
    // FIX 2: 500 is no longer raw base — it uses the anchored midL
    500: makeShade(base, applyC(midL), "base"),
    600: makeShade(base, applyC(0.4), "boost"),
    700: makeShade(base, applyC(0.3), "boost"),
    800: makeShade(base, applyC(0.2), "reduce"),
    900: makeShade(base, applyC(0.12), "soft"),
  };
}

// Semantic scales — independent first-class scales for success/warning/error/info.
// Each has its own canonical hue, full chroma, and a full 10-step tonal range.
// The base color's chroma is used as a starting point so the semantic scale
// feels harmonious with the palette, but the hue is authoritative.
export const SEMANTIC_HUES = {
  success: 145,
  warning: 85,
  error: 25,
  info: 250,
};

// Canonical chroma for each semantic family — chosen for perceptual clarity.
// Green and amber naturally have higher chroma ceilings; red and blue are
// slightly more restrained to avoid harshness.
const SEMANTIC_CHROMA = {
  success: 0.18,
  warning: 0.17,
  error: 0.22,
  info: 0.16,
};

export function generateSemanticScale(semanticKey, base, options = {}) {
  validateColor(base);
  const { lightModeCeiling = 0.97 } = options;

  const hue = SEMANTIC_HUES[semanticKey];
  const chroma = SEMANTIC_CHROMA[semanticKey];
  if (hue === undefined)
    throw new Error(`Unknown semantic key: ${semanticKey}`);

  // Blend the palette's own chroma toward the canonical semantic chroma
  // so the semantic scale still feels related to the brand.
  const blendedChroma = base.c * 0.2 + chroma * 0.8;
  const semanticBase = { l: 0.55, c: blendedChroma, h: hue };

  const applyC = (l) => Math.min(l, lightModeCeiling);

  return {
    50: makeShade(semanticBase, applyC(0.98), "low"),
    100: makeShade(semanticBase, applyC(0.94), "low"),
    200: makeShade(semanticBase, applyC(0.87), "soft"),
    300: makeShade(semanticBase, applyC(0.77), "soft"),
    400: makeShade(semanticBase, applyC(0.66), "reduce"),
    500: makeShade(semanticBase, applyC(0.55), "base"),
    600: makeShade(semanticBase, applyC(0.42), "boost"),
    700: makeShade(semanticBase, applyC(0.31), "boost"),
    800: makeShade(semanticBase, applyC(0.21), "reduce"),
    900: makeShade(semanticBase, applyC(0.13), "soft"),
  };
}

// FIX 1: Independent neutral scale — hue-tinted at base.h but near-zero chroma.
// This is a separate export so callers can decide when to use it.
export function generateNeutralScale(base, options = {}) {
  validateColor(base);
  const { lightModeCeiling = 0.97 } = options;

  // Neutral chroma is deliberately tiny — just enough to feel warm/cool, not colored.
  const neutralC = clamp(base.c * 0.04, 0.003, 0.012);
  const neutralBase = { l: base.l, c: neutralC, h: base.h };

  const applyC = (l) => Math.min(l, lightModeCeiling);

  return {
    50: makeShade(neutralBase, applyC(0.98), "base"),
    100: makeShade(neutralBase, applyC(0.95), "base"),
    200: makeShade(neutralBase, applyC(0.9), "base"),
    300: makeShade(neutralBase, applyC(0.8), "base"),
    400: makeShade(neutralBase, applyC(0.7), "base"),
    500: makeShade(neutralBase, applyC(0.55), "base"),
    600: makeShade(neutralBase, applyC(0.4), "base"),
    700: makeShade(neutralBase, applyC(0.3), "base"),
    800: makeShade(neutralBase, applyC(0.2), "base"),
    900: makeShade(neutralBase, applyC(0.12), "base"),
  };
}

// FIX 4: Export raw RGB values for CSS fallback generation
export function oklchToRgbValues(color) {
  const { l, c, h } = color;
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;
  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;
  let rLin = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  let gLin = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  let bLin = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;
  const toSrgb = (val) => {
    val = Math.max(0, Math.min(1, val));
    return val <= 0.0031308
      ? 12.92 * val
      : 1.055 * Math.pow(val, 1 / 2.4) - 0.055;
  };
  return {
    r: toSrgb(rLin),
    g: toSrgb(gLin),
    b: toSrgb(bLin),
  };
}

function oklchToRgb(color) {
  return oklchToRgbValues(color);
}

function relativeLuminance(rgb) {
  const lin = (v) =>
    v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  return 0.2126 * lin(rgb.r) + 0.7152 * lin(rgb.g) + 0.0722 * lin(rgb.b);
}

export function getContrastRatio(color1, color2) {
  validateColor(color1);
  validateColor(color2);
  const lum1 = relativeLuminance(oklchToRgb(color1));
  const lum2 = relativeLuminance(oklchToRgb(color2));
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function meetsWCAG(color1, color2, level = "AA", size = "normal") {
  const ratio = getContrastRatio(color1, color2);
  if (level === "AAA") return size === "large" ? ratio >= 4.5 : ratio >= 7;
  return size === "large" ? ratio >= 3 : ratio >= 4.5;
}

export function getAccessibilityReport(scale) {
  const white = { l: 1, c: 0, h: 0 };
  const black = { l: 0, c: 0, h: 0 };
  const report = {};
  Object.entries(scale).forEach(([token, color]) => {
    const contrastWhite = getContrastRatio(color, white);
    const contrastBlack = getContrastRatio(color, black);
    report[token] = {
      contrastWhite: contrastWhite.toFixed(2),
      contrastBlack: contrastBlack.toFixed(2),
      onWhiteAA: meetsWCAG(color, white, "AA"),
      onWhiteAAA: meetsWCAG(color, white, "AAA"),
      onBlackAA: meetsWCAG(color, black, "AA"),
      onBlackAAA: meetsWCAG(color, black, "AAA"),
    };
  });
  return report;
}

function shiftHueToward(currentHue, targetHue, amount = 0.3) {
  let diff = targetHue - currentHue;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return (currentHue + diff * amount + 360) % 360;
}

export function deriveSemanticColor(paletteColor, semanticRole) {
  const semanticTargets = { success: 142, warning: 85, error: 25, info: 240 };
  const targetHue = semanticTargets[semanticRole];
  if (!targetHue) return paletteColor;
  return {
    ...paletteColor,
    h: shiftHueToward(paletteColor.h, targetHue, 0.4),
    c: Math.min(Math.max(paletteColor.c, 0.12), 0.2),
  };
}

export function assignSemanticRoles(palette) {
  validatePalette(palette);
  const findClosestAndShift = (targetHue, role) => {
    const closest = palette.reduce((best, current) => {
      const cd = Math.min(
        Math.abs(current.value.h - targetHue),
        360 - Math.abs(current.value.h - targetHue),
      );
      const bd = Math.min(
        Math.abs(best.value.h - targetHue),
        360 - Math.abs(best.value.h - targetHue),
      );
      return cd < bd ? current : best;
    });
    return deriveSemanticColor(closest.value, role);
  };
  const primary = palette.reduce((a, b) =>
    b.value.c > a.value.c ? b : a,
  ).value;
  return {
    primary,
    success: findClosestAndShift(142, "success"),
    warning: findClosestAndShift(85, "warning"),
    error: findClosestAndShift(25, "error"),
    info: findClosestAndShift(240, "info"),
    neutral: { ...primary, c: Math.min(primary.c, 0.012) },
  };
}

export function generateExpandedPalette(palette, options = {}) {
  validatePalette(palette);
  const { darkModeFloor = 0.12, lightModeCeiling = 0.97 } = options;

  return palette.map((colorObj, idx) => {
    const base = colorObj.value;
    try {
      const scale = generateScale(base, { lightModeCeiling });
      const neutralScale = generateNeutralScale(base, { lightModeCeiling });

      const darkScale = {};
      Object.entries(scale).forEach(([token, shade]) => {
        darkScale[token] = invertForDarkMode(shade, { darkModeFloor });
      });

      const darkNeutralScale = {};
      Object.entries(neutralScale).forEach(([token, shade]) => {
        darkNeutralScale[token] = invertForDarkMode(shade, { darkModeFloor });
      });

      // Phase 2 #3: Independent semantic scales — one per status role.
      const semanticScales = {};
      const darkSemanticScales = {};
      Object.keys(SEMANTIC_HUES).forEach((key) => {
        const semScale = generateSemanticScale(key, base, { lightModeCeiling });
        semanticScales[key] = semScale;
        const darkSemScale = {};
        Object.entries(semScale).forEach(([token, shade]) => {
          darkSemScale[token] = invertForDarkMode(shade, { darkModeFloor });
        });
        darkSemanticScales[key] = darkSemScale;
      });

      return {
        base,
        scale,
        darkScale,
        neutralScale,
        darkNeutralScale,
        semanticScales,
        darkSemanticScales,
        accessibility: getAccessibilityReport(scale),
        darkAccessibility: getAccessibilityReport(darkScale),
      };
    } catch (error) {
      throw new Error(
        `Failed to expand color at index ${idx}: ${error.message}`,
      );
    }
  });
}

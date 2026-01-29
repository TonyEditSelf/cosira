// utils/colorExpansion.js
// Requires palette colors in OKLCH format: { l, c, h, a? }

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Validate OKLCH color object
function validateColor(color) {
  if (!color || typeof color !== "object") {
    throw new Error("Color must be an object");
  }
  if (typeof color.l !== "number" || color.l < 0 || color.l > 1) {
    throw new Error(`Invalid lightness: ${color.l}`);
  }
  if (typeof color.c !== "number" || color.c < 0) {
    throw new Error(`Invalid chroma: ${color.c}`);
  }
  if (typeof color.h !== "number") {
    throw new Error(`Invalid hue: ${color.h}`);
  }
  if (
    color.a !== undefined &&
    (typeof color.a !== "number" || color.a < 0 || color.a > 1)
  ) {
    throw new Error(`Invalid alpha: ${color.a}`);
  }
  return true;
}

// Validate palette array
function validatePalette(palette) {
  if (!Array.isArray(palette)) {
    throw new Error("Palette must be an array");
  }
  if (palette.length === 0) {
    throw new Error("Palette cannot be empty");
  }
  palette.forEach((item, idx) => {
    if (!item.value) {
      throw new Error(`Palette item ${idx} missing 'value' property`);
    }
    validateColor(item.value);
  });
  return true;
}

// Adaptive chroma scaling based on lightness
// Lighter colors can handle less chroma, darker colors need reduction too
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

  // Reduce chroma for very light colors (avoid pastels looking washed out)
  if (targetL > 0.85) {
    adjustedC *= 0.7;
  } else if (targetL > 0.75) {
    adjustedC *= 0.85;
  }

  // Reduce chroma for very dark colors (avoid over-saturation)
  if (targetL < 0.25) {
    adjustedC *= 0.75;
  } else if (targetL < 0.35) {
    adjustedC *= 0.9;
  }

  // Keep chroma within reasonable bounds
  return clamp(adjustedC, 0.01, 0.37);
}

// Generate a single shade with adaptive chroma
function makeShade(base, targetL, chromaMode) {
  validateColor(base);
  const { h, a } = base;

  const newC = adaptiveChroma(base.c, targetL, chromaMode);
  const newL = clamp(targetL, 0.02, 0.98);

  const shade = { l: newL, c: newC, h };
  if (a !== undefined) shade.a = a;

  return shade;
}

// Improved dark mode lightness curve
// Creates more natural inversion with better contrast
function invertLightness(l) {
  // Using a curve that keeps mid-tones reasonable
  // Maps: 0.95 -> 0.15, 0.5 -> 0.35, 0.1 -> 0.85
  const inverted = 1 - l;

  // Apply compression curve to avoid extremes
  if (inverted < 0.3) {
    // Very dark becomes moderately light (but not too bright)
    return 0.15 + inverted * 1.8;
  } else if (inverted > 0.7) {
    // Very light becomes quite dark
    return 0.15 + (inverted - 0.7) * 0.5 + 0.7 * 0.85;
  } else {
    // Mid-range gets moderate compression
    return 0.15 + inverted * 0.85;
  }
}

// Adaptive chroma for dark mode
// Reduces chroma more aggressively for bright colors in dark mode
function darkModeChroma(c, originalL) {
  let reduction = 0.8;

  // Colors that were very light need more chroma reduction in dark mode
  if (originalL > 0.85) {
    reduction = 0.6;
  } else if (originalL > 0.7) {
    reduction = 0.7;
  }

  // Colors that were very saturated need extra reduction to prevent eye strain
  if (c > 0.25) {
    reduction *= 0.85;
  }

  return clamp(c * reduction, 0.01, 0.35);
}

// Subtle hue shift for dark mode (optional, can be disabled)
function darkModeHueShift(h, l) {
  // Blues get slightly cooler, reds slightly warmer in dark mode
  // Only apply subtle shifts
  if (h >= 200 && h <= 280) {
    // Blues: shift cooler
    return (h + 3) % 360;
  } else if ((h >= 0 && h <= 30) || (h >= 330 && h <= 360)) {
    // Reds: shift warmer
    return (h + 360 - 2) % 360;
  }
  return h;
}

// Invert a shade for dark mode with proper curve and chroma adjustment
export function invertForDarkMode(color, options = {}) {
  validateColor(color);
  const { l, c, h, a } = color;
  const { enableHueShift = true } = options;

  const newL = invertLightness(l);
  const newC = darkModeChroma(c, l);
  const newH = enableHueShift ? darkModeHueShift(h, l) : h;

  const inverted = { l: newL, c: newC, h: newH };
  if (a !== undefined) inverted.a = a;

  return inverted;
}

// Generate 10-step scale for a base color
export function generateScale(base) {
  validateColor(base);

  // Use proportional steps instead of fixed deltas
  const baseL = base.l;

  return {
    50: makeShade(base, 0.97, "low"),
    100: makeShade(base, 0.93, "low"),
    200: makeShade(base, 0.87, "soft"),
    300: makeShade(base, 0.78, "reduce"),
    400: makeShade(base, Math.max(baseL * 1.15, 0.65), "base"),
    500: base,
    600: makeShade(base, Math.max(baseL * 0.85, 0.35), "boost"),
    700: makeShade(base, Math.max(baseL * 0.7, 0.28), "boost"),
    800: makeShade(base, Math.max(baseL * 0.55, 0.2), "reduce"),
    900: makeShade(base, Math.max(baseL * 0.4, 0.12), "soft"),
  };
}

// OKLCH to sRGB conversion for contrast calculation
function oklchToRgb(color) {
  const { l, c, h } = color;

  // Convert OKLCH to Oklab
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  // Oklab to linear RGB
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  let r = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  let b_ = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  // Gamma correction
  const toSrgb = (val) => {
    val = Math.max(0, Math.min(1, val));
    return val <= 0.0031308
      ? 12.92 * val
      : 1.055 * Math.pow(val, 1 / 2.4) - 0.055;
  };

  return {
    r: toSrgb(r),
    g: toSrgb(g),
    b: toSrgb(b_),
  };
}

// Calculate relative luminance for contrast ratio
function relativeLuminance(rgb) {
  const { r, g, b } = rgb;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Calculate WCAG contrast ratio between two colors
export function getContrastRatio(color1, color2) {
  validateColor(color1);
  validateColor(color2);

  const rgb1 = oklchToRgb(color1);
  const rgb2 = oklchToRgb(color2);

  const lum1 = relativeLuminance(rgb1);
  const lum2 = relativeLuminance(rgb2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

// Check if color combination meets WCAG standards
export function meetsWCAG(color1, color2, level = "AA", size = "normal") {
  const ratio = getContrastRatio(color1, color2);

  if (level === "AAA") {
    return size === "large" ? ratio >= 4.5 : ratio >= 7;
  }
  // AA level
  return size === "large" ? ratio >= 3 : ratio >= 4.5;
}

// Generate accessibility report for a scale
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

// Generate proper semantic colors from scratch
export function generateSemanticColor(role) {
  const semanticDefaults = {
    success: { l: 0.55, c: 0.15, h: 142 }, // Green
    warning: { l: 0.65, c: 0.17, h: 85 }, // Yellow-orange
    error: { l: 0.55, c: 0.2, h: 25 }, // Red-orange
    info: { l: 0.6, c: 0.16, h: 240 }, // Blue
    neutral: { l: 0.5, c: 0.02, h: 260 }, // Desaturated blue-gray
  };

  return semanticDefaults[role] || semanticDefaults.neutral;
}

// Assign semantic roles from palette with proper fallbacks
export function assignSemanticRoles(palette) {
  validatePalette(palette);

  // Find best matches or generate from scratch
  const findOrGenerate = (hueMin, hueMax, role) => {
    const match = palette.find((c) => {
      const h = c.value.h;
      // Handle wrap-around for reds
      if (hueMin > hueMax) {
        return h >= hueMin || h <= hueMax;
      }
      return h >= hueMin && h <= hueMax;
    });
    return match?.value || generateSemanticColor(role);
  };

  // Find highest chroma color for primary
  const primary = palette.reduce((a, b) =>
    b.value.c > a.value.c ? b : a,
  ).value;

  return {
    primary,
    success: findOrGenerate(110, 160, "success"),
    warning: findOrGenerate(40, 90, "warning"),
    error: findOrGenerate(0, 35, "error") || findOrGenerate(345, 360, "error"),
    info: findOrGenerate(210, 260, "info"),
    neutral: generateSemanticColor("neutral"),
  };
}

// Generate expanded palette (light + dark) with validation
export function generateExpandedPalette(palette, options = {}) {
  validatePalette(palette);

  return palette.map((colorObj, idx) => {
    const base = colorObj.value;

    try {
      const scale = generateScale(base);
      const darkScale = {};

      Object.entries(scale).forEach(([token, shade]) => {
        darkScale[token] = invertForDarkMode(shade, options);
      });

      return {
        base,
        scale,
        darkScale,
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

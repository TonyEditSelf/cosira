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

function invertLightness(l) {
  // Ottosson's perceptual inversion with gentle curve
  // MODIFIED: Add slight compression to prevent pure black backgrounds
  const inverted = 1 - Math.pow(l, 0.8);

  // Ensure dark mode backgrounds aren't too dark (minimum 20% lightness)
  return Math.max(inverted, 0.2);
}

function darkModeChroma(c, targetL) {
  // More aggressive reduction for softer dark mode
  const chromaScale = targetL < 0.3 ? 0.6 : 0.75; // Increased reduction

  return clamp(c * chromaScale, 0.01, 0.35); // Lower ceiling
}

function darkModeHueShift(h, l) {
  // Add subtle warmth to prevent cold, harsh appearance
  if (h >= 180 && h <= 270) {
    // Blues/cyans
    return (h + 5) % 360; // Shift slightly warmer
  }
  return h;
}

// Invert a shade for dark mode with proper curve and chroma adjustment
export function invertForDarkMode(color, options = {}) {
  validateColor(color);
  const { l, c, h, a } = color;

  const newL = invertLightness(l);
  const newC = darkModeChroma(c, newL);
  const newH = darkModeHueShift(h, newL); // ← Changed from just `h`

  const inverted = { l: newL, c: newC, h: newH };
  if (a !== undefined) inverted.a = a;

  return inverted;
}

export function generateScale(base) {
  validateColor(base);

  // Create MUCH wider lightness range for better contrast
  return {
    50: makeShade(base, 0.98, "low"), // Near white
    100: makeShade(base, 0.95, "low"), // Very light
    200: makeShade(base, 0.9, "soft"), // Light
    300: makeShade(base, 0.8, "soft"), // Medium-light
    400: makeShade(base, 0.7, "reduce"), // Medium
    500: base, // Base (unchanged)
    600: makeShade(base, 0.4, "boost"), // Medium-dark
    700: makeShade(base, 0.3, "boost"), // Dark
    800: makeShade(base, 0.2, "reduce"), // Very dark
    900: makeShade(base, 0.12, "soft"), // Near black
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

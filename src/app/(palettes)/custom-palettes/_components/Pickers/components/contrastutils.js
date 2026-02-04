/**
 * WCAG Contrast Utilities for OKLCH Colors
 * Provides contrast ratio calculations and filtering
 */

/**
 * Convert OKLCH to sRGB (simplified but more accurate)
 * Based on OKLab color space conversion
 */
function oklchToSrgb(l, c, h) {
  // Convert OKLCH to OKLab
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);

  // OKLab to linear RGB (approximate)
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  let r = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  let blue = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  // Clamp to valid range
  r = Math.max(0, Math.min(1, r));
  g = Math.max(0, Math.min(1, g));
  blue = Math.max(0, Math.min(1, blue));

  return { r, g, b: blue };
}

/**
 * Convert sRGB to relative luminance for contrast calculation
 */
function srgbToLuminance(r, g, b) {
  // Convert to linear RGB
  const toLinear = (val) => {
    if (val <= 0.04045) {
      return val / 12.92;
    }
    return Math.pow((val + 0.055) / 1.055, 2.4);
  };

  const rLinear = toLinear(r);
  const gLinear = toLinear(g);
  const bLinear = toLinear(b);

  // Calculate relative luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Convert OKLCH to relative luminance
 */
function oklchToRelativeLuminance(l, c, h) {
  const rgb = oklchToSrgb(l, c, h);
  return srgbToLuminance(rgb.r, rgb.g, rgb.b);
}

/**
 * Calculate WCAG 2.1 contrast ratio between two OKLCH colors
 * Returns ratio from 1 to 21
 */
export function getContrastRatio(color1, color2) {
  const l1 = oklchToRelativeLuminance(color1.l, color1.c, color1.h);
  const l2 = oklchToRelativeLuminance(color2.l, color2.c, color2.h);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if color meets WCAG contrast requirements
 */
export function meetsContrastRequirement(
  color1,
  color2,
  level = "AA",
  size = "normal",
) {
  const ratio = getContrastRatio(color1, color2);

  // WCAG 2.1 requirements
  const requirements = {
    "AAA-large": 4.5, // Large text (18pt+ or 14pt+ bold)
    "AA-large": 3.0,
    "AAA-normal": 7.0, // Normal text
    "AA-normal": 4.5,
  };

  const key = `${level}-${size}`;
  const required = requirements[key] || 4.5;

  return {
    passes: ratio >= required,
    ratio: ratio,
    required: required,
  };
}

/**
 * Get contrast grade (AAA, AA, or Fail)
 */
export function getContrastGrade(color1, color2, size = "normal") {
  const ratio = getContrastRatio(color1, color2);

  if (size === "large") {
    if (ratio >= 4.5) return "AAA";
    if (ratio >= 3.0) return "AA";
    return "Fail";
  } else {
    if (ratio >= 7.0) return "AAA";
    if (ratio >= 4.5) return "AA";
    return "Fail";
  }
}

/**
 * Filter palette to only include colors meeting contrast requirement
 * Checks contrast against a reference color (usually white or black)
 */
export function filterByContrast(palette, referenceColor, minRatio = 4.5) {
  return palette.filter((item) => {
    const ratio = getContrastRatio(item.value, referenceColor);
    return ratio >= minRatio;
  });
}

/**
 * Find best text color (black or white) for a background
 */
export function getBestTextColor(backgroundColor) {
  const white = { l: 1, c: 0, h: 0 };
  const black = { l: 0, c: 0, h: 0 };

  const whiteContrast = getContrastRatio(backgroundColor, white);
  const blackContrast = getContrastRatio(backgroundColor, black);

  return whiteContrast > blackContrast ? white : black;
}

/**
 * Annotate palette with contrast information
 */
export function annotateWithContrast(palette, options = {}) {
  const {
    againstWhite = true,
    againstBlack = true,
    level = "AA",
    size = "normal",
  } = options;

  const white = { l: 1, c: 0, h: 0 };
  const black = { l: 0, c: 0, h: 0 };

  return palette.map((item) => {
    const annotated = { ...item };

    if (againstWhite) {
      const whiteCheck = meetsContrastRequirement(
        item.value,
        white,
        level,
        size,
      );
      annotated.contrastWhite = {
        ratio: whiteCheck.ratio,
        passes: whiteCheck.passes,
        grade: getContrastGrade(item.value, white, size),
      };
    }

    if (againstBlack) {
      const blackCheck = meetsContrastRequirement(
        item.value,
        black,
        level,
        size,
      );
      annotated.contrastBlack = {
        ratio: blackCheck.ratio,
        passes: blackCheck.passes,
        grade: getContrastGrade(item.value, black, size),
      };
    }

    return annotated;
  });
}

/**
 * Sort palette by different criteria
 */
export function sortPalette(palette, sortBy = "lightness", order = "desc") {
  const sorted = [...palette].sort((a, b) => {
    let aVal, bVal;

    switch (sortBy) {
      case "lightness":
        aVal = a.value.l;
        bVal = b.value.l;
        break;
      case "chroma":
        aVal = a.value.c;
        bVal = b.value.c;
        break;
      case "hue":
        aVal = a.value.h;
        bVal = b.value.h;
        break;
      case "original":
        return 0; // Keep original order
      default:
        aVal = a.value.l;
        bVal = b.value.l;
    }

    return order === "desc" ? bVal - aVal : aVal - bVal;
  });

  return sorted;
}

/**
 * Get accessible color pairs from palette
 * Returns pairs that meet minimum contrast ratio
 */
export function getAccessiblePairs(palette, minRatio = 4.5) {
  const pairs = [];

  for (let i = 0; i < palette.length; i++) {
    for (let j = i + 1; j < palette.length; j++) {
      const ratio = getContrastRatio(palette[i].value, palette[j].value);

      if (ratio >= minRatio) {
        pairs.push({
          color1: palette[i],
          color2: palette[j],
          ratio: ratio,
          grade: getContrastGrade(palette[i].value, palette[j].value),
        });
      }
    }
  }

  // Sort by contrast ratio (highest first)
  return pairs.sort((a, b) => b.ratio - a.ratio);
}

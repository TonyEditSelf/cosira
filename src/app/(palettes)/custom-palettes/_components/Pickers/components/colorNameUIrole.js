/**
 * Analyzes a palette of OKLCH colors, assigning a primitive name (based on L, C, H)
 * and a functional UI role (based on L, C, H, and accurate WCAG contrast) to each color.
 *
 * @param {Array<Object>} palette - An array of color objects, e.g., [{ l: 0.65, c: 0.18, h: 250 }].
 * @returns {Array<Object>} A new array where each object contains the original color,
 * its primitive name, its UI role, a hex value, and its contrast ratios.
 */
export function colorNameUIrole(palette) {
  // --- HELPER FUNCTIONS (SELF-CONTAINED WITHIN THE MAIN FUNCTION) ---

  // Section 1: Accurate WCAG Contrast Calculation
  const contrastHelpers = {
    oklchToSrgb: ({ l, c, h }) => {
      if (l === 1) return { r: 1, g: 1, b: 1 };
      if (l === 0) return { r: 0, g: 0, b: 0 };

      const hRad = h * (Math.PI / 180);
      const a = c * Math.cos(hRad);
      const b_oklab = c * Math.sin(hRad);

      const l_ = l + 0.3963377774 * a + 0.2158037573 * b_oklab;
      const m_ = l - 0.1055613458 * a - 0.0638541728 * b_oklab;
      const s_ = l - 0.0894841775 * a - 1.291485548 * b_oklab;

      const l_cubed = l_ * l_ * l_;
      const m_cubed = m_ * m_ * m_;
      const s_cubed = s_ * s_ * s_;

      const r_linear =
        4.0767416621 * l_cubed -
        3.3077115913 * m_cubed +
        0.2309699292 * s_cubed;
      const g_linear =
        -1.2684380046 * l_cubed +
        2.6097574011 * m_cubed -
        0.3413193965 * s_cubed;
      const b_linear =
        -0.0041960863 * l_cubed -
        0.7034186147 * m_cubed +
        1.707614701 * s_cubed;

      const to_srgb = (c_linear) => {
        if (c_linear <= 0.0031308) {
          return Math.max(0, Math.min(1, 12.92 * c_linear));
        }
        return Math.max(
          0,
          Math.min(1, 1.055 * Math.pow(c_linear, 1 / 2.4) - 0.055)
        );
      };

      return {
        r: to_srgb(r_linear),
        g: to_srgb(g_linear),
        b: to_srgb(b_linear),
      };
    },
    srgbToLinear: (c) =>
      c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
    getWcagLuminance: function ({ r, g, b }) {
      const R = this.srgbToLinear(r);
      const G = this.srgbToLinear(g);
      const B = this.srgbToLinear(b);
      return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    },
    getContrast: (Y1, Y2) => {
      const lighter = Math.max(Y1, Y2);
      const darker = Math.min(Y1, Y2);
      return (lighter + 0.05) / (darker + 0.05);
    },
    srgbToHex: ({ r, g, b }) => {
      const toHex = (c) =>
        Math.round(c * 255)
          .toString(16)
          .padStart(2, "0");
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    },
  };

  // Section 2: Primitive Naming based on L, C, H (IMPROVED with chroma-aware hue naming)
  const namingHelpers = {
    getHueName: (h, c) => {
      // If chroma is very low, treat it as achromatic regardless of hue angle
      if (c < 0.02) return "gray";

      if (h === undefined || h === null) return "gray";
      if (h >= 25 && h < 65) return "yellow";
      if (h >= 65 && h < 155) return "green";
      if (h >= 155 && h < 200) return "cyan";
      if (h >= 200 && h < 275) return "blue";
      if (h >= 275 && h < 320) return "purple";
      if (h >= 320 || h < 25) return "red";
      return "gray"; // Fallback
    },
    getLightnessStep: (L) => {
      if (L >= 0.98) return "100";
      if (L > 0.92) return "200";
      if (L > 0.84) return "300";
      if (L > 0.7) return "400";
      if (L > 0.58) return "500";
      if (L > 0.45) return "600";
      if (L > 0.32) return "700";
      if (L > 0.2) return "800";
      if (L > 0.1) return "900";
      return "1000";
    },
    getChromaName: (C) => {
      if (C < 0.02) return "neutral";
      if (C < 0.07) return "muted";
      if (C < 0.14) return "soft";
      return "vibrant";
    },
  };

  // Section 3: UI Role Assignment Logic (MODIFIED for resilient Dark Mode Text)
  const assignUiRole = (oklch, contrastData) => {
    const { l, c, h } = oklch;
    const { contrastWhite, contrastBlack } = contrastData;
    const hueName = namingHelpers.getHueName(h, c);
    const isVibrant = c > 0.14;
    const isNeutral = c < 0.02;

    // --- NEW DARK TEXT PRIORITY (Resilient Gray Text Fix) ---

    // Priority 0: Dark Mode Neutral Text (High L colors with high contrast vs Black)
    // This captures the necessary high-L grays (like L=0.6) for dark backgrounds.
    if (isNeutral) {
      // Highly light text (near white) for highest contrast on dark bg
      if (contrastBlack >= 15.0) return "dark-text-default";

      // Mid-to-high L grays that still meet WCAG AA contrast on dark bg
      if (contrastBlack >= 4.5) return "dark-text-muted";
    }

    // --- DARK MODE ASSIGNMENT (L < 0.5) ---

    if (l < 0.5) {
      // Priority 1: Neutral Dark Surfaces
      if (isNeutral) {
        if (l < 0.05) return "dark-surface-canvas";
        if (l < 0.1) return "dark-surface-base"; // Base background
        if (l < 0.15) return "dark-surface-elevated"; // Cards, modals
      }

      // Priority 2: High-contrast Dark Text (Semantic Colors that are Light on Dark)
      // These are generally vibrant colors that are high-L and passed the check above,
      // but we use this to capture SEMANTIC light-on-dark text/icons.
      if (contrastBlack >= 4.5) {
        if (hueName === "red") return "dark-text-error";
        if (hueName === "green") return "dark-text-success";
        if (hueName === "blue" && l > 0.55) return "dark-text-link";
        return "dark-text-high-contrast";
      }
    }

    // --- LIGHT MODE ASSIGNMENT (L > 0.5) ---

    if (l > 0.5) {
      // Priority 1: Neutral Light Surfaces and Text
      if (isNeutral) {
        if (l > 0.97) return "light-surface-canvas";
        if (l > 0.9) return "light-surface-subtle";
        if (l > 0.8) return "light-surface-moderate";

        // Light Text (darker on light surfaces)
        // These are low-L colors with high contrast vs white
        if (contrastWhite >= 15.0) return "light-text-default";
        if (contrastWhite >= 4.5) return "light-text-muted";

        // Light Borders (mid-to-high lightness)
        if (l >= 0.7 && l <= 0.85) return "light-border-neutral";
      }

      // Priority 2: High-contrast Light Text (Semantic Dark on Light)
      if (contrastWhite >= 4.5) {
        if (hueName === "red") return "light-text-error";
        if (hueName === "green") return "light-text-success";
        if (hueName === "blue" && l < 0.4) return "light-text-link";
        if (hueName === "yellow") return "light-text-warning";
        return "light-text-high-contrast";
      }
    }

    // --- THEME-AGNOSTIC ROLES (MID-TONES, ACTIONS, ETC.) ---

    // Fallback for neutral colors not caught above (mid-range neutrals/borders)
    if (isNeutral) return "border-neutral-mid";

    // Priority 3: Subtle backgrounds (low contrast, muted colors)
    if (c < 0.07 && l > 0.85) {
      // Assuming subtle backgrounds are high L for light theme
      if (hueName === "red") return "surface-error-subtle";
      if (hueName === "green") return "surface-success-subtle";
      if (hueName === "blue") return "surface-info-subtle";
      if (hueName === "yellow") return "surface-warning-subtle";
      return "surface-tinted-subtle";
    }

    // Priority 4: Primary action colors (vibrant blues/purples in mid-range)
    if (isVibrant && (hueName === "blue" || hueName === "purple")) {
      if (l >= 0.45 && l <= 0.65) return "action-primary-default";
      if (l >= 0.35 && l < 0.45) return "action-primary-hover";
      if (l > 0.65) return "action-primary-subtle";
    }

    // Priority 5: Secondary/accent actions
    if (isVibrant && (hueName === "green" || hueName === "cyan")) {
      if (l >= 0.45 && l <= 0.65) return "action-secondary-default";
      if (l >= 0.35 && l < 0.45) return "action-secondary-hover";
    }

    // Priority 6: Status/state colors (colors that work well against both light and dark if possible)
    if (contrastWhite >= 3.0 || contrastBlack >= 3.0) {
      if (hueName === "red" && isVibrant) return "state-error-default";
      if (hueName === "green" && isVibrant) return "state-success-default";
      if (hueName === "yellow" && isVibrant) return "state-warning-default";
      if (hueName === "blue" && isVibrant) return "state-info-default";
    }

    // Priority 7: Decorative/accent colors
    if (isVibrant && l >= 0.5) {
      return "accent-decorative";
    }

    // Priority 8: Border colors
    if (c >= 0.07 && l >= 0.4 && l <= 0.8) {
      if (hueName === "red") return "border-error";
      if (hueName === "green") return "border-success";
      return "border-accent";
    }

    // Final fallback
    return "utility-general";
  };

  // --- MAIN EXECUTION ---

  // Pre-calculate reference luminance values for contrast comparison
  const whiteLuminance = 1.0; // Pure white
  const blackLuminance = 0.0; // Pure black

  return palette.map((color) => {
    // Validate input
    if (
      !color ||
      typeof color.l !== "number" ||
      typeof color.c !== "number" ||
      typeof color.h !== "number"
    ) {
      console.warn("Invalid color object:", color);
      return {
        oklch: color,
        primitiveName: "invalid-color",
        role: "utility-general",
        hex: "#000000",
        contrastWhite: 1,
        contrastBlack: 21,
      };
    }

    // Convert to sRGB for hex and contrast calculation
    const srgb = contrastHelpers.oklchToSrgb(color);
    const luminance = contrastHelpers.getWcagLuminance(srgb);

    // Calculate contrast ratios
    const contrastWhite = contrastHelpers.getContrast(
      luminance,
      whiteLuminance
    );
    const contrastBlack = contrastHelpers.getContrast(
      luminance,
      blackLuminance
    );

    const contrastData = { contrastWhite, contrastBlack };

    // Generate primitive name
    const primitiveName = `${namingHelpers.getHueName(
      color.h,
      color.c
    )}-${namingHelpers.getChromaName(color.c)}-${namingHelpers.getLightnessStep(
      color.l
    )}`;

    // Assign UI role
    const role = assignUiRole(color, contrastData);

    // Generate hex representation
    const hex = contrastHelpers.srgbToHex(srgb);

    return {
      oklch: color,
      primitiveName,
      role,
      hex: hex.toUpperCase(),
      contrastWhite: Math.round(contrastWhite * 100) / 100, // Round to 2 decimal places
      contrastBlack: Math.round(contrastBlack * 100) / 100,
    };
  });
}

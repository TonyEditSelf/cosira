export function colorNameUIrole(color) {
  // Configuration for tuning contrast ratios and rules
  const config = {
    contrast: {
      AA: 4.5, // WCAG AA minimum contrast
      AAA: 7.0, // WCAG AAA minimum contrast
      HIGH_LUM: 15.0, // High Luminance Contrast (used for default text on canvas)
    },
    // Allows customization of which hues are considered primary/secondary actions
    action: {
      primaryHues: ["blue", "purple"],
      secondaryHues: ["green", "cyan"],
    },
    // Configurable background luminances (Y) for contrast calculation
    backgroundLuminance: {
      light: 1.0, // Default to pure white (1.0)
      dark: 0.0, // Default to pure black (0.0)
    },
  };

  // Section 1: Accurate WCAG Contrast Calculation
  const contrastHelpers = {
    oklchToSrgb: ({ l, c, h }) => {
      // Handle achromatic extremes directly
      if (l === 1)
        return { r: 1, g: 1, b: 1, r_linear: 1, g_linear: 1, b_linear: 1 };
      if (l === 0)
        return { r: 0, g: 0, b: 0, r_linear: 0, g_linear: 0, b_linear: 0 };

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
        r_linear: Math.max(0, Math.min(1, r_linear)),
        g_linear: Math.max(0, Math.min(1, g_linear)),
        b_linear: Math.max(0, Math.min(1, b_linear)),
      };
    },
    srgbToLinear: (c) =>
      c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
    // NOTE: This function is only used for the luminance of the reference backgrounds (white/black),
    // which are already defined as 1.0 and 0.0 in config.
    getWcagLuminance: function ({ r, g, b }) {
      const R = this.srgbToLinear(r);
      const G = this.srgbToLinear(g);
      const B = this.srgbToLinear(b);
      return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    },
    // New helper to handle alpha blending and return the resulting opaque luminance
    blendAndGetLuminance: function (fgLinear, alpha, bgLinear) {
      // Blend components in linear space: C_result = C_fg * alpha + C_bg * (1 - alpha)
      const R_blend = fgLinear.r_linear * alpha + bgLinear.r * (1 - alpha);
      const G_blend = fgLinear.g_linear * alpha + bgLinear.g * (1 - alpha);
      const B_blend = fgLinear.b_linear * alpha + bgLinear.b * (1 - alpha);

      // WCAG Luminance is calculated from the resulting opaque linear components
      return 0.2126 * R_blend + 0.7152 * G_blend + 0.0722 * B_blend;
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

  // Section 2: Primitive Naming based on L, C, H
  const namingHelpers = {
    getHueName: (h, c) => {
      // If chroma is very low, treat it as achromatic regardless of hue angle
      if (c < 0.02) return "gray";

      if (h === undefined || h === null) return "gray";
      // Refined Hue Boundaries: Adjusted for perceptual balance (e.g., Yellow/Green split at 100)
      // Red: 330-30 (60)
      // Yellow: 30-100 (70)
      // Green: 100-150 (50)
      // Cyan: 150-210 (60)
      // Blue: 210-270 (60)
      // Purple: 270-330 (60)
      if (h >= 30 && h < 100) return "yellow";
      if (h >= 100 && h < 150) return "green";
      if (h >= 150 && h < 210) return "cyan";
      if (h >= 210 && h < 270) return "blue";
      if (h >= 270 && h < 330) return "purple";
      if (h >= 330 || h < 30) return "red";
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
      if (C < 0.02) return "achromatic"; // Renamed from "neutral" for clarity
      // Updated threshold to classify C=0.08 as "muted"
      if (C < 0.09) return "muted";
      if (C < 0.14) return "soft";
      if (C < 0.22) return "strong";

      if (C < 0.27) return "vibrant";
      return "brilliant";
    },
  };

  // Section 3: UI Role Assignment Logic
  const assignUiRole = (oklch, contrastData) => {
    const { l, c, h } = oklch;
    const { contrastWhite, contrastBlack } = contrastData;
    const hueName = namingHelpers.getHueName(h, c);

    // Chroma Statuses
    const isHighChroma = c > 0.14; // Vibrant/Strong/Brilliant
    const isBrilliant = c >= 0.27;
    const isAchromatic = c < 0.02;
    const isErrorHue = hueName === "red"; // Simplify checking for error colors

    // --- Priority 0: Achromatic Text (Theme-Agnostic, Contrast-Based Override) ---
    // Achromatic colors with sufficient contrast are always classified as text.
    if (isAchromatic) {
      // Dark text on Light Surface
      if (contrastWhite >= config.contrast.AA) {
        if (contrastWhite >= config.contrast.HIGH_LUM)
          return "dark-text-default";
        return "dark-text-muted";
      }
      // Light text on Dark Surface
      if (contrastBlack >= config.contrast.AA) {
        if (contrastBlack >= config.contrast.HIGH_LUM)
          return "light-text-default";
        return "light-text-muted";
      }
    }

    // --- Priority 1 & 2: Achromatic Surfaces/Borders (Same as before) ---

    // Dark Mode Achromatic Surfaces / Borders (L < 0.5)
    if (l < 0.5 && isAchromatic) {
      if (l < 0.05) return "dark-surface-canvas";
      if (l < 0.1) return "dark-surface-base";
      if (l < 0.15) return "dark-surface-elevated";
      if (l >= 0.2 && l < 0.45) return "dark-surface-moderate";
      if (l >= 0.15 && l < 0.2) return "dark-surface-subtle";

      return "border-neutral-mid";
    }

    // Light Mode Achromatic Surfaces / Borders (L > 0.5)
    if (l > 0.5 && isAchromatic) {
      if (l > 0.97) return "light-surface-canvas";
      if (l > 0.9) return "light-surface-subtle";
      if (l > 0.8) return "light-surface-moderate";
      if (l >= 0.7 && l <= 0.85) return "light-border-neutral";
      if (l <= 0.7 && l > 0.6) return "light-surface-interactive";
      if (l <= 0.6 && l > 0.45) return "light-surface-mid";

      return "border-neutral-mid";
    }

    // --- Priority 3: Semantic Text on Dark Backgrounds (PRACTICAL TWEAKS) ---
    // Color is LIGHT, background is DARK. Role should be light-text-*.
    if (l > 0.5 && contrastBlack >= config.contrast.AA) {
      // PRACTICAL RULE: Very light, high-chroma colors (L > 0.7) are visually harsh as primary text. Skip them here.
      // Also skip light, low-chroma colors (L > 0.75 and C < 0.14) as they should be subtle backgrounds.
      if ((l > 0.7 && isHighChroma) || (l > 0.75 && c < 0.14)) {
        // Force fall-through to Accent/State/Surface roles (P5, P8, P10)
      } else if (isErrorHue) {
        return "light-text-error";
      } else if (hueName === "green") return "light-text-success";
      else if (hueName === "yellow") return "light-text-warning";
      else if (hueName === "blue" || hueName === "cyan")
        return "light-text-link";

      // Nuanced contrast fallbacks for generic high-contrast colored text
      if (contrastBlack >= config.contrast.AAA) return "light-text-default";
      return "light-text-muted";
    }

    // --- Priority 4: Semantic Text on Light Backgrounds (PRACTICAL TWEAKS) ---
    // Color is DARK, background is LIGHT. Role should be dark-text-*.
    if (l < 0.5 && contrastWhite >= config.contrast.AA) {
      // PRACTICAL RULE: Exclude highly saturated colors (vibrant/strong) from dark text
      // as they are too visually aggressive for body text.
      if (isErrorHue && isHighChroma) {
        // Skip dark-text-error assignment for vibrant reds (C>0.14). These fall to P8.
      } else if (isErrorHue) {
        return "dark-text-error";
      } else if (hueName === "green") return "dark-text-success";
      else if (hueName === "yellow") return "dark-text-warning";
      else if (hueName === "blue" || hueName === "cyan")
        return "dark-text-link";

      // Nuanced contrast fallbacks for generic high-contrast colored text
      if (contrastWhite >= config.contrast.AAA) return "dark-text-default";
      return "dark-text-muted";
    }

    // --- THEME-AGNOSTIC ROLES (MID-TONES, ACTIONS, ETC.) ---

    // Priority 5: Subtle backgrounds (catches L=0.76 to L=0.82 low-chroma colors)
    // PRACTICAL RULE: Colors that were too bright/low-chroma for text in P3 land here.
    if (l > 0.75 && c < 0.14) {
      if (isErrorHue) return "surface-error-subtle";
      if (hueName === "green") return "surface-success-subtle";
      if (hueName === "blue") return "surface-info-subtle";
      if (hueName === "yellow") return "surface-warning-subtle";
      return "surface-tinted-subtle";
    }

    // Priority 6 & 7: Action colors (Same as before)
    if (isBrilliant && config.action.primaryHues.includes(hueName)) {
      if (l >= 0.45 && l <= 0.65) return "action-primary-default";
      if (l >= 0.35 && l < 0.45) return "action-primary-hover";
      if (l > 0.65) return "action-primary-subtle";
    }
    if (isBrilliant && config.action.secondaryHues.includes(hueName)) {
      if (l >= 0.45 && l <= 0.65) return "action-secondary-default";
      if (l >= 0.35 && l < 0.45) return "action-secondary-hover";
    }

    // Priority 8: Status/state colors
    // This catches the vibrant reds (C=0.24, L ~0.45) that were rejected from P4.
    if (isHighChroma && (contrastWhite >= 3.0 || contrastBlack >= 3.0)) {
      if (isErrorHue) return "state-error-default";
      if (hueName === "green") return "state-success-default";
      if (hueName === "yellow") return "state-warning-default";
      if (hueName === "blue") return "state-info-default";
    }

    // Priority 9 & 10: Decorative Accents (Same as before)
    if (isBrilliant && l >= 0.35 && l <= 0.85) {
      return "accent-decorative-brilliant";
    }
    if (isHighChroma && !isBrilliant && l >= 0.35) {
      return "accent-decorative-vibrant";
    }

    // Priority 11: Border colors
    // This catches the L=0.76, C=0.12 (soft) that skipped P5 but isn't a dominant accent.
    if (c >= 0.09 && l >= 0.4 && l <= 0.8) {
      if (isErrorHue) return "border-error";
      if (hueName === "green") return "border-success";
      if (hueName === "yellow") return "border-warning";
      return "border-accent";
    }

    // Final fallback
    return "utility-general";
  };

  // --- MAIN EXECUTION ---

  // Define linear sRGB components for pure white and pure black (backgrounds)
  const WHITE_LINEAR_RGB = { r: 1.0, g: 1.0, b: 1.0 };
  const BLACK_LINEAR_RGB = { r: 0.0, g: 0.0, b: 0.0 };

  // Pre-calculate reference luminance values for contrast comparison
  const whiteLuminance = config.backgroundLuminance.light;
  const blackLuminance = config.backgroundLuminance.dark;

  // Determine alpha, defaulting to 1 (opaque)
  const alpha =
    typeof color.a === "number" && color.a >= 0 && color.a <= 1 ? color.a : 1;

  // Validate input
  if (
    !color ||
    typeof color.l !== "number" ||
    typeof color.c !== "number" ||
    typeof color.h !== "number"
  ) {
    console.warn("Invalid color object:", color);
    // Return a single object
    return {
      oklch: color,
      primitiveName: "invalid-color",
      role: "utility-general",
      hex: "#000000",
      contrastWhite: 1,
      contrastBlack: 21,
    };
  }

  // Convert to sRGB for hex and linear sRGB for blending/contrast calculation
  const srgb = contrastHelpers.oklchToSrgb(color);

  let finalLuminance;
  let finalContrastWhite;
  let finalContrastBlack;

  // If alpha is 1 (opaque), use the calculated luminance directly
  if (alpha === 1) {
    // Luminance of the foreground color (which is opaque)
    finalLuminance = contrastHelpers.blendAndGetLuminance(
      srgb,
      1,
      WHITE_LINEAR_RGB
    ); // Effectively just calculating its luminance

    finalContrastWhite = contrastHelpers.getContrast(
      finalLuminance,
      whiteLuminance
    );
    finalContrastBlack = contrastHelpers.getContrast(
      finalLuminance,
      blackLuminance
    );
  } else {
    // If translucent, calculate the blended luminance against white and black backgrounds
    const blendedLuminanceWhite = contrastHelpers.blendAndGetLuminance(
      srgb,
      alpha,
      WHITE_LINEAR_RGB
    );
    const blendedLuminanceBlack = contrastHelpers.blendAndGetLuminance(
      srgb,
      alpha,
      BLACK_LINEAR_RGB
    );

    // We use the blended luminance to determine contrast
    finalContrastWhite = contrastHelpers.getContrast(
      blendedLuminanceWhite,
      whiteLuminance
    );
    finalContrastBlack = contrastHelpers.getContrast(
      blendedLuminanceBlack,
      blackLuminance
    );

    // For the primitive name/display, we still primarily use the original Oklch L
    finalLuminance = color.l;
  }

  const contrastData = {
    contrastWhite: finalContrastWhite,
    contrastBlack: finalContrastBlack,
  };

  // Generate primitive name
  const primitiveName = `${namingHelpers.getHueName(
    color.h,
    color.c
  )}-${namingHelpers.getChromaName(color.c)}-${namingHelpers.getLightnessStep(
    color.l
  )}`;

  // Assign UI role
  const role = assignUiRole(color, contrastData);

  // Generate hex representation (without alpha in the #RRGGBB format)
  const hex = contrastHelpers.srgbToHex(srgb);

  // Return a single object instead of an array.
  return {
    oklch: color,
    primitiveName,
    role,
    hex: hex.toUpperCase(),
    alpha: alpha,
    contrastWhite: Math.round(finalContrastWhite * 100) / 100, // Round to 2 decimal places
    contrastBlack: Math.round(finalContrastBlack * 100) / 100,
  };
}

export default function UIBrandPalGen(oklch, type = "light") {
  const { l: L_base, c: C_base, h: H_base } = oklch;

  const isDark = type === "dark";
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const wrapHue = (h) => ((h % 360) + 360) % 360;

  const oklchObj = (L, C, H, A = 1) => ({
    l: clamp(L, 0, 1),
    c: clamp(C, 0, 0.4),
    h: wrapHue(H),
    a: A,
  });

  // Normalize input
  const H = wrapHue(H_base);
  const C = clamp(C_base, 0.04, 0.4);
  const L = clamp(L_base, 0.2, 0.95);

  // ========== PRIMARY SHADES & TINTS ==========
  const primary = oklchObj(L, C, H);

  const primary50 = oklchObj(isDark ? L + 0.4 : L + 0.45, C * 0.3, H);
  const primary100 = oklchObj(isDark ? L + 0.3 : L + 0.35, C * 0.4, H);
  const primary200 = oklchObj(isDark ? L + 0.15 : L + 0.2, C * 0.6, H);
  const primary300 = oklchObj(isDark ? L + 0.08 : L + 0.12, C * 0.8, H);
  const primary400 = oklchObj(isDark ? L + 0.04 : L + 0.06, C * 0.95, H);
  const primary500 = oklchObj(L, C, H); // base
  const primary600 = oklchObj(isDark ? L - 0.08 : L - 0.08, C * 1.05, H);
  const primary700 = oklchObj(isDark ? L - 0.15 : L - 0.15, C * 1.1, H);
  const primary800 = oklchObj(isDark ? L - 0.25 : L - 0.25, C * 1.05, H);
  const primary900 = oklchObj(isDark ? L - 0.35 : L - 0.35, C * 0.9, H);

  // ========== PRIMARY INTERACTIONS ==========
  const primaryHover = oklchObj(
    isDark ? L + 0.08 : L - 0.06,
    C * 1.15,
    H + (isDark ? 4 : -4)
  );

  const primaryActive = oklchObj(
    isDark ? L - 0.08 : L + 0.08,
    C * 0.85,
    H + (isDark ? -8 : 8)
  );

  // ========== ACCENT (Complementary - 180°) ==========
  const accentHue = wrapHue(H + 180);
  const accentL = isDark ? Math.min(L + 0.15, 0.9) : Math.max(L - 0.15, 0.3);

  const accent = oklchObj(accentL, C * 1.15, accentHue);
  const accentHover = oklchObj(
    isDark ? accentL + 0.08 : accentL - 0.06,
    C * 1.25,
    accentHue + (isDark ? 4 : -4)
  );
  const accentActive = oklchObj(
    isDark ? accentL - 0.08 : accentL + 0.08,
    C * 0.95,
    accentHue + (isDark ? -8 : 8)
  );

  // ========== SEMANTIC COLORS ==========
  // Success (Green ~120°)
  const successHue = wrapHue(H + 120);
  const successL = isDark ? 0.65 : 0.55;
  const success = oklchObj(successL, C * 0.9, successHue);
  const successLight = oklchObj(
    isDark ? successL + 0.2 : successL + 0.25,
    C * 0.4,
    successHue
  );

  // Error (Red ~0° or adjust based on brand)
  const errorHue = wrapHue(H - 40);
  const errorL = isDark ? 0.7 : 0.5;
  const error = oklchObj(errorL, C * 1.1, errorHue);
  const errorLight = oklchObj(
    isDark ? errorL + 0.2 : errorL + 0.3,
    C * 0.4,
    errorHue
  );

  // Warning (Yellow ~60°)
  const warningHue = 60;
  const warningL = isDark ? 0.75 : 0.6;
  const warning = oklchObj(warningL, C * 1.0, warningHue);
  const warningLight = oklchObj(
    isDark ? warningL + 0.15 : warningL + 0.25,
    C * 0.3,
    warningHue
  );

  // Info (Cyan ~180°)
  const infoHue = wrapHue(H + 180);
  const infoL = isDark ? 0.68 : 0.52;
  const info = oklchObj(infoL, C * 0.95, infoHue);
  const infoLight = oklchObj(
    isDark ? infoL + 0.2 : infoL + 0.28,
    C * 0.4,
    infoHue
  );

  // ========== NEUTRALS ==========
  const background = oklchObj(isDark ? 0.08 : 0.99, 0.01, H);
  const surface = oklchObj(isDark ? 0.18 : 0.95, 0.015, H);
  const surfaceVariant = oklchObj(isDark ? 0.25 : 0.9, 0.02, H);
  const border = oklchObj(isDark ? 0.32 : 0.85, 0.025, H);
  const borderLight = oklchObj(isDark ? 0.22 : 0.92, 0.015, H);

  // ========== TEXT ==========
  const textPrimary = oklchObj(isDark ? 0.95 : 0.15, 0.02, H);
  const textSecondary = oklchObj(isDark ? 0.8 : 0.4, 0.025, H);
  const textTertiary = oklchObj(isDark ? 0.65 : 0.55, 0.02, H);
  const textDisabled = oklchObj(isDark ? 0.45 : 0.7, 0.01, H);

  // ========== RETURN STRUCTURE ==========
  return [
    // Primary Scale
    { name: "Primary-50", value: primary50 },
    { name: "Primary-100", value: primary100 },
    { name: "Primary-200", value: primary200 },
    { name: "Primary-300", value: primary300 },
    { name: "Primary-400", value: primary400 },
    { name: "Primary-500", value: primary500 },
    { name: "Primary-600", value: primary600 },
    { name: "Primary-700", value: primary700 },
    { name: "Primary-800", value: primary800 },
    { name: "Primary-900", value: primary900 },

    // Primary Interactions
    { name: "Primary-Hover", value: primaryHover },
    { name: "Primary-Active", value: primaryActive },

    // Accent
    { name: "Accent", value: accent },
    { name: "Accent-Hover", value: accentHover },
    { name: "Accent-Active", value: accentActive },

    // Semantic: Success
    { name: "Success", value: success },
    { name: "Success-Light", value: successLight },

    // Semantic: Error
    { name: "Error", value: error },
    { name: "Error-Light", value: errorLight },

    // Semantic: Warning
    { name: "Warning", value: warning },
    { name: "Warning-Light", value: warningLight },

    // Semantic: Info
    { name: "Info", value: info },
    { name: "Info-Light", value: infoLight },

    // Neutrals
    { name: "Background", value: background },
    { name: "Surface", value: surface },
    { name: "Surface-Variant", value: surfaceVariant },
    { name: "Border", value: border },
    { name: "Border-Light", value: borderLight },

    // Text
    { name: "Text-Primary", value: textPrimary },
    { name: "Text-Secondary", value: textSecondary },
    { name: "Text-Tertiary", value: textTertiary },
    { name: "Text-Disabled", value: textDisabled },
  ];
}

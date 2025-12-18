export default function brandPalGen(oklch) {
  const LMAX = 0.95;
  const LMIN = 0.25;
  const CMAX = 0.28;
  const CMIN = 0.08;

  const baseColor = oklch;
  const baseLightness = baseColor.l;

  // Adaptive lightness shifts based on base lightness
  // If base is light, we can't go much higher; if dark, we can't go much lower
  const maxLightShift = Math.min(0.25, LMAX - baseLightness - 0.05);
  const maxDarkShift = Math.min(0.25, baseLightness - LMIN - 0.05);

  // Normalize chroma to 0-1 range for consistent adjustments
  const chromaNorm = Math.min(1, baseColor.c / CMAX);

  // Primary brand color (base)
  const primary = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c)),
  };

  const primaryDark = {
    ...primary,
    c: Math.min(CMAX, Math.max(CMIN, primary.c * 1.08)),
    l: Math.max(LMIN, primary.l - maxDarkShift),
  };

  const primaryLight = {
    ...primary,
    c: Math.min(CMAX, Math.max(CMIN, primary.c * 0.9)),
    l: Math.min(LMAX, primary.l + maxLightShift),
  };

  // Secondary brand color (+120° for triadic harmony)
  const secondary = {
    ...baseColor,
    h: (baseColor.h + 120) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.92)),
  };

  const secondaryDark = {
    ...secondary,
    c: Math.min(CMAX, Math.max(CMIN, secondary.c * 1.08)),
    l: Math.max(LMIN, secondary.l - maxDarkShift),
  };

  const secondaryLight = {
    ...secondary,
    c: Math.min(CMAX, Math.max(CMIN, secondary.c * 0.9)),
    l: Math.min(LMAX, secondary.l + maxLightShift),
  };

  // Accent brand color (+240° for triadic balance)
  const accent = {
    ...baseColor,
    h: (baseColor.h + 240) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.98)),
  };

  const accentDark = {
    ...accent,
    c: Math.min(CMAX, Math.max(CMIN, accent.c * 1.08)),
    l: Math.max(LMIN, accent.l - maxDarkShift),
  };

  const accentLight = {
    ...accent,
    c: Math.min(CMAX, Math.max(CMIN, accent.c * 0.9)),
    l: Math.min(LMAX, accent.l + maxLightShift),
  };

  // Neutral: desaturated version at complementary lightness
  // If base is light, neutral is darker; if base is dark, neutral is lighter
  const neutralLightness =
    baseLightness > 0.6 ? 0.88 : baseLightness < 0.4 ? 0.32 : 0.5;

  const neutral = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.12)),
    l: Math.min(LMAX, Math.max(LMIN, neutralLightness)),
  };

  return [
    { name: "Primary-Dark", value: primaryDark },
    { name: "Primary", value: primary },
    { name: "Primary-Light", value: primaryLight },
    { name: "Secondary-Dark", value: secondaryDark },
    { name: "Secondary", value: secondary },
    { name: "Secondary-Light", value: secondaryLight },
    { name: "Accent-Dark", value: accentDark },
    { name: "Accent", value: accent },
    { name: "Accent-Light", value: accentLight },
    { name: "Neutral", value: neutral },
  ];
}

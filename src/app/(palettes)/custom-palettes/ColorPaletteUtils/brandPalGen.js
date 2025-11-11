export default function brandPalGen(oklch) {
  const LMAX = 0.95;
  const LMIN = 0.25;
  const CMAX = 0.28;
  const CMIN = 0.08;

  const baseColor = oklch;

  // Primary brand color (base)
  const primary = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c)),
  };

  const primaryDark = {
    ...primary,
    c: Math.min(CMAX, Math.max(CMIN, primary.c * 1.15)),
    l: Math.min(LMAX, Math.max(LMIN, primary.l - 0.25)),
  };

  const primaryLight = {
    ...primary,
    c: Math.min(CMAX, Math.max(CMIN, primary.c * 0.85)),
    l: Math.min(LMAX, Math.max(LMIN, primary.l + 0.25)),
  };

  // Secondary brand color (+120° for distinct but harmonious)
  const secondary = {
    ...baseColor,
    h: (baseColor.h + 120) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.95)),
  };

  const secondaryDark = {
    ...secondary,
    c: Math.min(CMAX, Math.max(CMIN, secondary.c * 1.12)),
    l: Math.min(LMAX, Math.max(LMIN, secondary.l - 0.22)),
  };

  const secondaryLight = {
    ...secondary,
    c: Math.min(CMAX, Math.max(CMIN, secondary.c * 0.88)),
    l: Math.min(LMAX, Math.max(LMIN, secondary.l + 0.22)),
  };

  // Accent brand color (+240° for maximum distinction)
  const accent = {
    ...baseColor,
    h: (baseColor.h + 240) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.1)),
  };

  const accentDark = {
    ...accent,
    c: Math.min(CMAX, Math.max(CMIN, accent.c * 1.15)),
    l: Math.min(LMAX, Math.max(LMIN, accent.l - 0.22)),
  };

  const accentLight = {
    ...accent,
    c: Math.min(CMAX, Math.max(CMIN, accent.c * 0.85)),
    l: Math.min(LMAX, Math.max(LMIN, accent.l + 0.22)),
  };

  // Neutral brand color (desaturated base for backgrounds)
  const neutral = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.15)),
    l: Math.min(LMAX, Math.max(LMIN, 0.92)),
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

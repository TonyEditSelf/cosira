export default function uipalettePalGen(baseOklch) {
  const LMAX = 0.95;
  const LMIN = 0.25;
  const CMAX = 0.25;
  const CMIN = 0.05;

  // Primary (base color)
  const primary = {
    ...baseOklch,
    c: Math.min(CMAX, Math.max(CMIN, baseOklch.c)),
    l: Math.min(LMAX, Math.max(LMIN, baseOklch.l)),
  };

  const primaryDark = {
    ...primary,
    c: Math.min(CMAX, Math.max(CMIN, primary.c * 1.12)),
    l: Math.min(LMAX, Math.max(LMIN, primary.l - 0.18)),
  };

  // Secondary (120° triadic)
  const secondary = {
    ...baseOklch,
    h: (baseOklch.h + 120) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseOklch.c * 0.95)),
    l: Math.min(LMAX, Math.max(LMIN, baseOklch.l)),
  };

  const secondaryDark = {
    ...secondary,
    c: Math.min(CMAX, Math.max(CMIN, secondary.c * 1.12)),
    l: Math.min(LMAX, Math.max(LMIN, secondary.l - 0.18)),
  };

  // Tertiary (240° triadic)
  const tertiary = {
    ...baseOklch,
    h: (baseOklch.h + 240) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseOklch.c * 0.9)),
    l: Math.min(LMAX, Math.max(LMIN, baseOklch.l)),
  };

  const tertiaryDark = {
    ...tertiary,
    c: Math.min(CMAX, Math.max(CMIN, tertiary.c * 1.12)),
    l: Math.min(LMAX, Math.max(LMIN, tertiary.l - 0.18)),
  };

  // Accent (complementary - 180°)
  const accent = {
    ...baseOklch,
    h: (baseOklch.h + 180) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseOklch.c * 1.05)),
    l: Math.min(LMAX, Math.max(LMIN, baseOklch.l)),
  };

  const accentDark = {
    ...accent,
    c: Math.min(CMAX, Math.max(CMIN, accent.c * 1.12)),
    l: Math.min(LMAX, Math.max(LMIN, accent.l - 0.18)),
  };

  // Neutral (desaturated base)
  const neutral = {
    ...baseOklch,
    c: Math.min(CMAX, Math.max(CMIN, baseOklch.c * 0.15)),
    l: Math.min(LMAX, Math.max(LMIN, baseOklch.l)),
  };

  const neutralDark = {
    ...neutral,
    c: Math.min(CMAX, Math.max(CMIN, neutral.c * 1.1)),
    l: Math.min(LMAX, Math.max(LMIN, neutral.l - 0.18)),
  };

  return [
    { name: "Primary", value: primary },
    { name: "Primary-Dark", value: primaryDark },
    { name: "Secondary", value: secondary },
    { name: "Secondary-Dark", value: secondaryDark },
    { name: "Tertiary", value: tertiary },
    { name: "Tertiary-Dark", value: tertiaryDark },
    { name: "Accent", value: accent },
    { name: "Accent-Dark", value: accentDark },
    { name: "Neutral", value: neutral },
    { name: "Neutral-Dark", value: neutralDark },
  ];
}

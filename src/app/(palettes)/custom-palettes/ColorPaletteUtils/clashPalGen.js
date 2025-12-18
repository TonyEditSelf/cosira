export default function clashPalGen(oklch) {
  const LMAX = 0.95;
  const LMIN = 0.2;
  const CMAX = 0.32;
  const CMIN = 0.05;

  const baseColor = oklch;

  // Asymmetric, organic clash angles
  const clash1 = {
    ...baseColor,
    h: (baseColor.h + 67) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.25)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 1.15)),
  };

  const clash2 = {
    ...baseColor,
    h: (baseColor.h + 157) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.3)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.75)),
  };

  const clash3 = {
    ...baseColor,
    h: (baseColor.h + 241) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.2)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 1.25)),
  };

  const clash4 = {
    ...baseColor,
    h: (baseColor.h + 293) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.35)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l)),
  };

  // Base variants
  const baseBright = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.35)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.25)),
  };

  const baseDark = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.4)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.3)),
  };

  // Strategic neutrals
  const baseNeutralDark = {
    ...baseColor,
    c: 0.03,
    l: 0.15,
  };

  const baseNeutralLight = {
    ...baseColor,
    c: 0.04,
    l: 0.92,
  };

  // Extreme variants
  const clash1Extreme = {
    ...clash1,
    c: Math.min(CMAX, clash1.c * 1.2),
    l: Math.min(LMAX, Math.max(LMIN, 0.88)),
  };

  const clash2Extreme = {
    ...clash2,
    c: Math.min(CMAX, clash2.c * 1.25),
    l: Math.min(LMAX, Math.max(LMIN, 0.28)),
  };

  return [
    { name: "Neutral-Dark", value: baseNeutralDark },
    { name: "Neutral-Light", value: baseNeutralLight },
    { name: "Base", value: baseColor },
    { name: "Base-Bright", value: baseBright },
    { name: "Base-Dark", value: baseDark },
    { name: "Clash1", value: clash1 },
    { name: "Clash1-Extreme", value: clash1Extreme },
    { name: "Clash2", value: clash2 },
    { name: "Clash2-Extreme", value: clash2Extreme },
    { name: "Clash3", value: clash3 },
  ];
}

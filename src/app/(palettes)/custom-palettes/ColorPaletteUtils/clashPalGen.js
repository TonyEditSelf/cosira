export default function clashPalGen(oklch) {
  const LMAX = 0.95;
  const LMIN = 0.25;
  const CMAX = 0.3; // Higher saturation for jarring effect
  const CMIN = 0.08;

  const baseColor = oklch;

  // Intentionally off-harmony angles (30-60° off from harmonious positions)
  const clash1 = {
    ...baseColor,
    h: (baseColor.h + 45) % 360, // Halfway between analogous and complementary
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.1)),
  };

  const clash2 = {
    ...baseColor,
    h: (baseColor.h + 135) % 360, // Off-split-complementary
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.15)),
  };

  const clash3 = {
    ...baseColor,
    h: (baseColor.h + 225) % 360, // Another discord point
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.12)),
  };

  const clash4 = {
    ...baseColor,
    h: (baseColor.h + 315) % 360, // Fourth discord point
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.08)),
  };

  // Base variants (high saturation)
  const baseBright = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.2)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.1)),
  };

  const baseDark = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.25)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.2)),
  };

  // Clash variants
  const clash1Bright = {
    ...clash1,
    c: Math.min(CMAX, Math.max(CMIN, clash1.c * 1.15)),
    l: Math.min(LMAX, Math.max(LMIN, clash1.l + 0.15)),
  };

  const clash2Dark = {
    ...clash2,
    c: Math.min(CMAX, Math.max(CMIN, clash2.c * 1.18)),
    l: Math.min(LMAX, Math.max(LMIN, clash2.l - 0.18)),
  };

  const clash3Bright = {
    ...clash3,
    c: Math.min(CMAX, Math.max(CMIN, clash3.c * 1.12)),
    l: Math.min(LMAX, Math.max(LMIN, clash3.l + 0.12)),
  };

  const clash4Dark = {
    ...clash4,
    c: Math.min(CMAX, Math.max(CMIN, clash4.c * 1.15)),
    l: Math.min(LMAX, Math.max(LMIN, clash4.l - 0.15)),
  };

  return [
    { name: "Base-Bright", value: baseBright },
    { name: "Base", value: baseColor },
    { name: "Base-Dark", value: baseDark },
    { name: "Clash1", value: clash1 },
    { name: "Clash1-Bright", value: clash1Bright },
    { name: "Clash2", value: clash2 },
    { name: "Clash2-Dark", value: clash2Dark },
    { name: "Clash3", value: clash3 },
    { name: "Clash3-Bright", value: clash3Bright },
    { name: "Clash4", value: clash4 },
  ];
}

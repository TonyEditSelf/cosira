export default function accentedAnalogousPalGen(oklch) {
  const LMAX = 0.95;
  const LMIN = 0.25;
  const CMAX = 0.25;
  const CMIN = 0.05;

  const baseColor = oklch;

  // Analogous neighbors
  const analog1 = {
    ...baseColor,
    h: (baseColor.h - 30 + 360) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.95)),
  };

  const analog2 = {
    ...baseColor,
    h: (baseColor.h + 30) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.95)),
  };

  // Complementary accent
  const accent = {
    ...baseColor,
    h: (baseColor.h + 180) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.15)),
  };

  // Base variants
  const baseDark = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.1)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.25)),
  };

  const baseLight = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.9)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.25)),
  };

  // Analog1 variants
  const analog1Dark = {
    ...analog1,
    c: Math.min(CMAX, Math.max(CMIN, analog1.c * 1.1)),
    l: Math.min(LMAX, Math.max(LMIN, analog1.l - 0.2)),
  };

  const analog1Light = {
    ...analog1,
    c: Math.min(CMAX, Math.max(CMIN, analog1.c * 0.9)),
    l: Math.min(LMAX, Math.max(LMIN, analog1.l + 0.2)),
  };

  // Analog2 variants
  const analog2Dark = {
    ...analog2,
    c: Math.min(CMAX, Math.max(CMIN, analog2.c * 1.1)),
    l: Math.min(LMAX, Math.max(LMIN, analog2.l - 0.2)),
  };

  const analog2Light = {
    ...analog2,
    c: Math.min(CMAX, Math.max(CMIN, analog2.c * 0.9)),
    l: Math.min(LMAX, Math.max(LMIN, analog2.l + 0.2)),
  };

  // Accent variant
  const accentLight = {
    ...accent,
    c: Math.min(CMAX, Math.max(CMIN, accent.c * 0.85)),
    l: Math.min(LMAX, Math.max(LMIN, accent.l + 0.2)),
  };

  return [
    { name: "Base-D", value: baseDark },
    { name: "Base", value: baseColor },
    { name: "Base-L", value: baseLight },
    { name: "Analog1-D", value: analog1Dark },
    { name: "Analog1", value: analog1 },
    { name: "Analog1-L", value: analog1Light },
    { name: "Analog2-D", value: analog2Dark },
    { name: "Analog2", value: analog2 },
    { name: "Analog2-L", value: analog2Light },
    { name: "Accent", value: accent },
  ];
}

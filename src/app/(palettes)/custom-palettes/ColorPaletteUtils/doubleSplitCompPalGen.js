export default function doubleSplitCompPalGen(oklch) {
  const LMAX = 0.95;
  const LMIN = 0.25;
  const CMAX = 0.25;
  const CMIN = 0.05;

  const baseColor = oklch;

  // First split-complementary triad
  const splitLeft1 = {
    ...baseColor,
    h: (baseColor.h + 150) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.95)),
  };

  const splitRight1 = {
    ...baseColor,
    h: (baseColor.h + 210) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.95)),
  };

  // Second split-complementary triad (from opposite side)
  const opposite = {
    ...baseColor,
    h: (baseColor.h + 180) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c)),
  };

  const splitLeft2 = {
    ...opposite,
    h: (opposite.h - 30 + 360) % 360,
    c: Math.min(CMAX, Math.max(CMIN, opposite.c * 0.95)),
  };

  const splitRight2 = {
    ...opposite,
    h: (opposite.h + 30) % 360,
    c: Math.min(CMAX, Math.max(CMIN, opposite.c * 0.95)),
  };

  // Variants
  const baseDark = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.1)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.22)),
  };

  const baseLight = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.9)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.22)),
  };

  const oppositeDark = {
    ...opposite,
    c: Math.min(CMAX, Math.max(CMIN, opposite.c * 1.1)),
    l: Math.min(LMAX, Math.max(LMIN, opposite.l - 0.22)),
  };

  const oppositeLight = {
    ...opposite,
    c: Math.min(CMAX, Math.max(CMIN, opposite.c * 0.9)),
    l: Math.min(LMAX, Math.max(LMIN, opposite.l + 0.22)),
  };

  return [
    { name: "Base-D", value: baseDark },
    { name: "Base", value: baseColor },
    { name: "Base-L", value: baseLight },
    { name: "Split-L1", value: splitLeft1 },
    { name: "Split-R1", value: splitRight1 },
    { name: "Opp-D", value: oppositeDark },
    { name: "Opposite", value: opposite },
    { name: "Opp-L", value: oppositeLight },
    { name: "Split-L2", value: splitLeft2 },
    { name: "Split-R2", value: splitRight2 },
  ];
}

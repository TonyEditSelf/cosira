export default function nearCompPalGen(oklch) {
  const LMAX = 0.95;
  const LMIN = 0.25;
  const CMAX = 0.25;
  const CMIN = 0.05;

  const baseColor = oklch;

  // Near-complement at ~150-165° instead of 180°
  const nearComp1 = {
    ...baseColor,
    h: (baseColor.h + 150) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.98)),
  };

  const nearComp2 = {
    ...baseColor,
    h: (baseColor.h + 165) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.98)),
  };

  // Base variants
  const baseDarkest = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.15)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.28)),
  };

  const baseDark = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.08)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.15)),
  };

  const baseLight = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.93)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.15)),
  };

  const baseLightest = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.85)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.28)),
  };

  // Near-comp1 variants
  const nearComp1Dark = {
    ...nearComp1,
    c: Math.min(CMAX, Math.max(CMIN, nearComp1.c * 1.12)),
    l: Math.min(LMAX, Math.max(LMIN, nearComp1.l - 0.22)),
  };

  const nearComp1Light = {
    ...nearComp1,
    c: Math.min(CMAX, Math.max(CMIN, nearComp1.c * 0.9)),
    l: Math.min(LMAX, Math.max(LMIN, nearComp1.l + 0.22)),
  };

  // Near-comp2 variants
  const nearComp2Dark = {
    ...nearComp2,
    c: Math.min(CMAX, Math.max(CMIN, nearComp2.c * 1.12)),
    l: Math.min(LMAX, Math.max(LMIN, nearComp2.l - 0.22)),
  };

  const nearComp2Light = {
    ...nearComp2,
    c: Math.min(CMAX, Math.max(CMIN, nearComp2.c * 0.9)),
    l: Math.min(LMAX, Math.max(LMIN, nearComp2.l + 0.22)),
  };

  return [
    { name: "Base-DD", value: baseDarkest },
    { name: "Base-D", value: baseDark },
    { name: "Base", value: baseColor },
    { name: "Base-L", value: baseLight },
    { name: "Base-LL", value: baseLightest },
    { name: "Near1-D", value: nearComp1Dark },
    { name: "Near1", value: nearComp1 },
    { name: "Near1-L", value: nearComp1Light },
    { name: "Near2-D", value: nearComp2Dark },
    { name: "Near2", value: nearComp2 },
  ];
}

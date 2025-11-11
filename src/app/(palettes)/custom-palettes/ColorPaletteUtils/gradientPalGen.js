export default function gradientPalGen(oklch) {
  const LMAX = 0.95;
  const LMIN = 0.25;
  const CMAX = 0.25;
  const CMIN = 0.05;

  const baseColor = oklch;

  // Smooth hue transition from base to complement (180°)
  const step1 = {
    ...baseColor,
    h: baseColor.h,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l)),
  };

  const step2 = {
    ...baseColor,
    h: (baseColor.h + 20) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.98)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.02)),
  };

  const step3 = {
    ...baseColor,
    h: (baseColor.h + 40) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.96)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.04)),
  };

  const step4 = {
    ...baseColor,
    h: (baseColor.h + 60) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.94)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.06)),
  };

  const step5 = {
    ...baseColor,
    h: (baseColor.h + 90) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.92)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.08)),
  };

  const step6 = {
    ...baseColor,
    h: (baseColor.h + 120) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.94)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.06)),
  };

  const step7 = {
    ...baseColor,
    h: (baseColor.h + 140) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.96)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.04)),
  };

  const step8 = {
    ...baseColor,
    h: (baseColor.h + 160) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.98)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.02)),
  };

  const step9 = {
    ...baseColor,
    h: (baseColor.h + 170) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.99)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.01)),
  };

  const step10 = {
    ...baseColor,
    h: (baseColor.h + 180) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l)),
  };

  return [
    { name: "Step-1", value: step1 },
    { name: "Step-2", value: step2 },
    { name: "Step-3", value: step3 },
    { name: "Step-4", value: step4 },
    { name: "Step-5", value: step5 },
    { name: "Step-6", value: step6 },
    { name: "Step-7", value: step7 },
    { name: "Step-8", value: step8 },
    { name: "Step-9", value: step9 },
    { name: "Step-10", value: step10 },
  ];
}

export default function warmCoolPalGen(oklch) {
  const LMAX = 0.95;
  const LMIN = 0.25;
  const CMAX = 0.25;
  const CMIN = 0.05;

  const baseColor = oklch;

  // Determine if base is warm or cool
  const isWarm = baseColor.h >= 0 && baseColor.h < 180;

  // Warm side (red-yellow: 0-180°)
  const warm1 = {
    ...baseColor,
    h: isWarm ? baseColor.h : (baseColor.h + 180) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c)),
  };

  const warm2 = {
    ...warm1,
    h: (warm1.h + 40) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.92)),
  };

  const warm3 = {
    ...warm1,
    h: (warm1.h - 40 + 360) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.92)),
  };

  const warm1Dark = {
    ...warm1,
    c: Math.min(CMAX, Math.max(CMIN, warm1.c * 1.12)),
    l: Math.min(LMAX, Math.max(LMIN, warm1.l - 0.25)),
  };

  const warm1Light = {
    ...warm1,
    c: Math.min(CMAX, Math.max(CMIN, warm1.c * 0.88)),
    l: Math.min(LMAX, Math.max(LMIN, warm1.l + 0.25)),
  };

  // Cool side (blue-green: 180-360°)
  const cool1 = {
    ...baseColor,
    h: !isWarm ? baseColor.h : (baseColor.h + 180) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c)),
  };

  const cool2 = {
    ...cool1,
    h: (cool1.h + 40) % 360,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.92)),
  };

  const cool1Dark = {
    ...cool1,
    c: Math.min(CMAX, Math.max(CMIN, cool1.c * 1.12)),
    l: Math.min(LMAX, Math.max(LMIN, cool1.l - 0.25)),
  };

  const cool1Light = {
    ...cool1,
    c: Math.min(CMAX, Math.max(CMIN, cool1.c * 0.88)),
    l: Math.min(LMAX, Math.max(LMIN, cool1.l + 0.25)),
  };

  const cool2Light = {
    ...cool2,
    c: Math.min(CMAX, Math.max(CMIN, cool2.c * 0.85)),
    l: Math.min(LMAX, Math.max(LMIN, cool2.l + 0.2)),
  };

  return [
    { name: "Warm1-D", value: warm1Dark },
    { name: "Warm1", value: warm1 },
    { name: "Warm1-L", value: warm1Light },
    { name: "Warm2", value: warm2 },
    { name: "Warm3", value: warm3 },
    { name: "Cool1-D", value: cool1Dark },
    { name: "Cool1", value: cool1 },
    { name: "Cool1-L", value: cool1Light },
    { name: "Cool2", value: cool2 },
    { name: "Cool2-L", value: cool2Light },
  ];
}

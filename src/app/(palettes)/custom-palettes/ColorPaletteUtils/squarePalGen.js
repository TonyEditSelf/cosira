export default function squarePalGen(oklch) {
  const LMAX = 0.95;
  const LMIN = 0.25;
  const CMAX = 0.25;
  const CMIN = 0.05;

  const baseColor = oklch;

  // Four hues evenly spaced at 90° intervals
  const hue2 = (baseColor.h + 90) % 360;
  const hue3 = (baseColor.h + 180) % 360;
  const hue4 = (baseColor.h + 270) % 360;

  // Color 1 (Base)
  const color1Dark = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.15)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.25)),
  };

  const color1Light = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.9)),
    l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.25)),
  };

  // Color 2 (+90°)
  const color2 = {
    ...baseColor,
    h: hue2,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c)),
  };

  const color2Dark = {
    ...color2,
    c: Math.min(CMAX, Math.max(CMIN, color2.c * 1.1)),
    l: Math.min(LMAX, Math.max(LMIN, color2.l - 0.2)),
  };

  const color2Light = {
    ...color2,
    c: Math.min(CMAX, Math.max(CMIN, color2.c * 0.92)),
    l: Math.min(LMAX, Math.max(LMIN, color2.l + 0.2)),
  };

  // Color 3 (+180°)
  const color3 = {
    ...baseColor,
    h: hue3,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c)),
  };

  const color3Dark = {
    ...color3,
    c: Math.min(CMAX, Math.max(CMIN, color3.c * 1.1)),
    l: Math.min(LMAX, Math.max(LMIN, color3.l - 0.2)),
  };

  const color3Light = {
    ...color3,
    c: Math.min(CMAX, Math.max(CMIN, color3.c * 0.92)),
    l: Math.min(LMAX, Math.max(LMIN, color3.l + 0.2)),
  };

  // Color 4 (+270°)
  const color4 = {
    ...baseColor,
    h: hue4,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c)),
  };

  const color4Dark = {
    ...color4,
    c: Math.min(CMAX, Math.max(CMIN, color4.c * 1.1)),
    l: Math.min(LMAX, Math.max(LMIN, color4.l - 0.2)),
  };

  return [
    { name: "Color1-D", value: color1Dark },
    { name: "Base", value: baseColor },
    { name: "Color1-L", value: color1Light },
    { name: "Color2-D", value: color2Dark },
    { name: "Color2", value: color2 },
    { name: "Color2-L", value: color2Light },
    { name: "Color3-D", value: color3Dark },
    { name: "Color3", value: color3 },
    { name: "Color4-D", value: color4Dark },
    { name: "Color4", value: color4 },
  ];
}

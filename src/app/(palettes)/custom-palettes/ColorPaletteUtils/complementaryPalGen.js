export default function complementaryPalGen(oklch, options) {
  let baseColor,
    darkBase,
    lightBase,
    lightestBase,
    baseAccent,
    compColor,
    darkComp,
    lightComp,
    lightestComp,
    compAccent;

  baseColor = oklch;
  darkBase = { ...baseColor, l: Math.max(0, baseColor.l - 0.15) };
  lightBase = { ...baseColor, l: Math.min(1, baseColor.l + 0.15) };
  lightestBase = { ...baseColor, l: Math.min(1, baseColor.l + 0.25) };
  baseAccent = {
    ...baseColor,
    h: (baseColor.h + 10) % 360,
    c: Math.min(0.4, baseColor.c + 0.05),
  };

  compColor = { ...oklch, h: (baseColor.h + 180) % 360 };
  darkComp = { ...compColor, l: Math.max(0, compColor.l - 0.15) };
  lightComp = { ...compColor, l: Math.min(1, compColor.l + 0.15) };
  lightestComp = { ...compColor, l: Math.max(0, compColor.l + 0.25) };
  compAccent = {
    ...compColor,
    h: (compColor.h + 10) % 360,
    c: Math.min(0.4, compColor.c + 0.05),
  };

  return [
    { name: "Base-D", value: darkBase },
    { name: "Base", value: baseColor },
    { name: "Base-L", value: lightBase },
    { name: "Base-LL", value: lightestBase },
    { name: "Base-A", value: baseAccent },
    { name: "Comp-A", value: compAccent },
    { name: "Comp-LL", value: lightestComp },
    { name: "Comp-L", value: lightComp },
    { name: "Comp", value: compColor },
    { name: "Comp-D", value: darkComp },
  ];
}

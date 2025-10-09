export default function complementaryPalGen(oklch) {
  let baseAccent, compColor, compAccent;

  const baseColor = oklch;
  const darkBase = {
    ...baseColor,
    l: Math.min(1, Math.max(0, baseColor.l * 0.85)),
  };
  const lightBase = {
    ...baseColor,
    l: Math.min(1, Math.max(0, baseColor.l * 1.15)),
  };
  const lightestBase = {
    ...baseColor,
    l: Math.min(1, Math.max(0, baseColor.l * 1.25)),
  };

  baseAccent = {
    ...baseColor,
    h: (baseColor.h + 10) % 360,
    l: Math.min(1, Math.max(0, baseColor.l * 1.05)),
    c: Math.min(1, Math.max(0, baseColor.c * 1.1)),
  };

  compColor = { ...oklch, h: (baseColor.h + 180) % 360 };

  const darkComp = {
    ...compColor,
    l: Math.min(1, Math.max(0, compColor.l * 0.85)),
  };
  const lightComp = {
    ...compColor,
    l: Math.min(1, Math.max(0, compColor.l * 1.15)),
  };
  const lightestComp = {
    ...compColor,
    l: Math.min(1, Math.max(0, compColor.l * 1.25)),
  };

  compAccent = {
    ...compColor,
    h: (compColor.h + 10) % 360,
    l: Math.min(1, Math.max(0, compColor.l * 1.05)),
    c: Math.min(1, Math.max(0, compColor.c * 1.1)),
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

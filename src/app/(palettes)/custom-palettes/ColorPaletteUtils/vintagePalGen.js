export default function vintagePalGen(oklch) {
  const baseColor = { ...oklch, l: 0.45, c: 0.28 };

  const baseColorDark = { ...oklch, l: 0.35, c: 0.2 };

  const baseColorLight = { ...oklch, l: 0.65, c: 0.15 };

  const baseColorMuted = { ...oklch, l: 0.55, c: 0.1 };
  const baseColorModSaturated = { ...oklch, l: 0.5, c: 0.2 };

  const compColor = {
    ...baseColor,
    h: (baseColor.h + 180) % 360,
    l: 0.45,
    c: 0.25,
  };

  const compColorDark = {
    ...compColor,
    l: 0.35,
    c: 0.18,
  };

  const compColorLight = {
    ...compColor,
    l: 0.65,
    c: 0.12,
  };

  const compColorMuted = {
    ...compColor,
    l: 0.55,
    c: 0.1,
  };
  const compColorModSaturated = {
    ...compColor,
    l: 0.55,
    c: 0.2,
  };

  return [
    { name: "Base", value: baseColor },
    { name: "Base-D", value: baseColorDark },
    { name: "Base-L", value: baseColorLight },
    { name: "Comp", value: compColor },
    { name: "Comp-D", value: compColorDark },
    { name: "Comp-L", value: compColorLight },
    { name: "Base-M", value: baseColorMuted },
    { name: "Base-Mod-S", value: baseColorModSaturated },
    { name: "Comp-M", value: compColorMuted },
    { name: "Comp-Mod-S", value: compColorModSaturated },
  ];
}

export default function vintagePalGen(oklch) {
  const baseColor = {
    ...oklch,
    l: Math.min(0.9, Math.max(0.3, oklch.l)),
    c: Math.min(0.15, Math.max(0.02, oklch.c)),
  };

  const baseColorDark = {
    ...oklch,
    l: Math.min(0.9, Math.max(0.3, oklch.l * 0.8)),
    c: Math.min(0.15, Math.max(0.02, oklch.c * 0.71)),
  };

  const baseColorLight = {
    ...oklch,
    l: Math.min(0.9, Math.max(0.3, oklch.l * 1.44)),
    c: Math.min(0.15, Math.max(0.02, oklch.c * 0.53)),
  };

  const baseColorMuted = {
    ...oklch,
    l: Math.min(0.9, Math.max(0.3, oklch.l * 1.2)),
    c: Math.min(0.15, Math.max(0.02, oklch.c * 0.36)),
  };

  const baseColorModSaturated = {
    ...oklch,
    l: Math.min(0.9, Math.max(0.3, oklch.l * 1.0)),
    c: Math.min(0.15, Math.max(0.02, oklch.c * 0.71)),
  };

  const compColor = {
    ...oklch,
    h: (oklch.h + 180) % 360,
    l: Math.min(0.9, Math.max(0.3, oklch.l * 1.0)),
    c: Math.min(0.15, Math.max(0.02, oklch.c * 0.78)),
  };

  const compColorDark = {
    ...compColor,
    l: Math.min(0.9, Math.max(0.3, compColor.l * 0.78)),
    c: Math.min(0.15, Math.max(0.02, compColor.c * 0.72)),
  };

  const compColorLight = {
    ...compColor,
    l: Math.min(0.9, Math.max(0.3, compColor.l * 1.44)),
    c: Math.min(0.15, Math.max(0.02, compColor.c * 0.48)),
  };

  const compColorMuted = {
    ...compColor,
    l: Math.min(0.9, Math.max(0.3, compColor.l * 1.2)),
    c: Math.min(0.15, Math.max(0.02, compColor.c * 0.4)),
  };

  const compColorModSaturated = {
    ...compColor,
    l: Math.min(0.9, Math.max(0.3, compColor.l * 1.0)),
    c: Math.min(0.15, Math.max(0.02, compColor.c * 0.8)),
  };

  return [
    { name: "Base", value: baseColor },
    { name: "Base-D", value: baseColorDark },
    { name: "Base-Mod-S", value: baseColorModSaturated },
    { name: "Base-L", value: baseColorLight },
    { name: "Base-M", value: baseColorMuted },
    { name: "Comp", value: compColor },
    { name: "Comp-D", value: compColorDark },
    { name: "Comp-Mod-S", value: compColorModSaturated },
    { name: "Comp-L", value: compColorLight },
    { name: "Comp-M", value: compColorMuted },
  ];
}

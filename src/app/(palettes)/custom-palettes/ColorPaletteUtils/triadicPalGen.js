export default function triadicPalGen(oklch) {
  let baseColor = oklch;

  const darkBase = { ...baseColor, l: Math.max(0, baseColor.l * 0.85) };
  const lightBase = { ...baseColor, l: Math.min(1, baseColor.l * 1.15) };

  const triadicColor1 = { ...baseColor, h: (baseColor.h + 120) % 360 };
  const darkTriad1 = {
    ...triadicColor1,
    l: Math.max(0, triadicColor1.l * 0.85),
  };

  const lightTriad1 = {
    ...triadicColor1,
    l: Math.min(1, triadicColor1.l * 1.15),
  };

  const darkestTriad1 = {
    ...darkTriad1,
    l: Math.max(0, darkTriad1.l * 0.85),
  };

  const triadicColor2 = { ...baseColor, h: (baseColor.h + 240) % 360 };
  const darkTriad2 = {
    ...triadicColor2,
    l: Math.max(0, triadicColor2.l * 0.85),
  };

  const lightTriad2 = {
    ...triadicColor2,
    l: Math.min(1, triadicColor2.l * 1.15),
  };

  const darkestTriad2 = {
    ...darkTriad2,
    l: Math.max(0, darkTriad2.l * 0.85),
  };

  return [
    { name: "Base-L", value: lightBase },
    { name: "Base", value: baseColor },
    { name: "Base-D", value: darkBase },
    { name: "Triad1-L", value: lightTriad1 },
    { name: "Triad1", value: triadicColor1 },
    { name: "Triad1-D", value: darkTriad1 },
    { name: "Triad1-DD", value: darkestTriad1 },
    { name: "Triad2-L", value: lightTriad2 },
    { name: "Triad2", value: triadicColor2 },
    { name: "Triad2-D", value: darkTriad2 },
    { name: "Triad2-DD", value: darkestTriad2 },
  ];
}

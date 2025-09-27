export default function triadicPalGen(oklch) {
  let baseColor = oklch;

  const darkBase = { ...baseColor, l: Math.max(0, baseColor.l - 0.15) };
  const lightBase = { ...baseColor, l: Math.min(1, baseColor.l + 0.15) };

  const triadicColor1 = { ...baseColor, h: (baseColor.h + 120) % 360 };
  const darkTriad1 = {
    ...triadicColor1,
    l: Math.max(0, triadicColor1.l - 0.15),
  };
  const lightTriad1 = {
    ...triadicColor1,
    l: Math.min(1, triadicColor1.l + 0.15),
  };

  const midBaseTriad1 = {
    h: (baseColor.h + triadicColor1.h) / 2,
    c: (baseColor.c + triadicColor1.c) / 2,
    l: (baseColor.l + triadicColor1.l) / 2,
  };

  const triadicColor2 = { ...baseColor, h: (baseColor.h + 240) % 360 };
  const darkTriad2 = {
    ...triadicColor2,
    l: Math.max(0, triadicColor2.l - 0.15),
  };
  const lightTriad2 = {
    ...triadicColor2,
    l: Math.min(1, triadicColor2.l + 0.15),
  };

  const midBaseTriad2 = {
    h: (baseColor.h + triadicColor2.h) / 2,
    c: (baseColor.c + triadicColor2.c) / 2,
    l: (baseColor.l + triadicColor2.l) / 2,
  };

  return [
    { name: "Base", value: baseColor },
    { name: "Base-L", value: lightBase },
    { name: "Base-D", value: darkBase },
    { name: "Triad1", value: triadicColor1 },
    { name: "Triad1-L", value: lightTriad1 },
    { name: "Triad1-D", value: darkTriad1 },
    { name: "Triad2", value: triadicColor2 },
    { name: "Triad2-L", value: lightTriad2 },
    { name: "Triad2-D", value: darkTriad2 },
    { name: "midBaseTriad1", value: midBaseTriad1 },
    { name: "midBaseTriad2", value: midBaseTriad2 },
  ];
}

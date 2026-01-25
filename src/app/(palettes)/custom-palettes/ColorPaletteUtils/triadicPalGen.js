export default function triadicPalGen(
  oklch,
  vintagePalType = null,
  neutralPalType = null,
  kidsPalType = null,
) {
  let lightBase,
    baseColor,
    darkBase,
    lightTriad1,
    triadicColor1,
    darkTriad1,
    darkestTriad1,
    lightTriad2,
    triadicColor2,
    darkTriad2,
    darkestTriad2;

  if (
    vintagePalType === null &&
    neutralPalType === null &&
    kidsPalType === null
  ) {
    baseColor = oklch;

    darkBase = {
      ...baseColor,
      l: Math.min(1, Math.max(0, baseColor.l * 0.7)), // More pronounced dark
      c: Math.min(0.4, baseColor.c * 1.1), // Slightly boost chroma
    };

    lightBase = {
      ...baseColor,
      l: Math.min(1, Math.max(0, baseColor.l * 1.25)), // More pronounced light
      c: Math.min(0.4, baseColor.c * 0.9), // Slightly reduce chroma for lighter variant
    };

    // Triadic colors with chroma and lightness adjustments
    triadicColor1 = {
      ...baseColor,
      h: (baseColor.h + 120) % 360,
      c: Math.min(0.4, baseColor.c * 0.95), // Slightly less saturated than base
    };

    darkTriad1 = {
      ...triadicColor1,
      l: Math.min(1, Math.max(0, triadicColor1.l * 0.65)),
      c: Math.min(0.4, triadicColor1.c * 1.15), // Boost chroma in darks
    };

    lightTriad1 = {
      ...triadicColor1,
      l: Math.min(1, Math.max(0, triadicColor1.l * 1.3)),
      c: Math.min(0.4, triadicColor1.c * 0.85), // Reduce chroma in lights
    };

    darkestTriad1 = {
      ...darkTriad1,
      l: Math.min(1, Math.max(0.1, darkTriad1.l * 0.7)), // Keep minimum lightness
      c: Math.min(0.4, darkTriad1.c * 1.2),
    };

    // Second triadic color
    triadicColor2 = {
      ...baseColor,
      h: (baseColor.h + 240) % 360,
      c: Math.min(0.4, baseColor.c * 1.05), // Slightly more saturated than base
    };

    darkTriad2 = {
      ...triadicColor2,
      l: Math.min(1, Math.max(0, triadicColor2.l * 0.65)),
      c: Math.min(0.4, triadicColor2.c * 1.15),
    };

    lightTriad2 = {
      ...triadicColor2,
      l: Math.min(1, Math.max(0, triadicColor2.l * 1.3)),
      c: Math.min(0.4, triadicColor2.c * 0.85),
    };

    darkestTriad2 = {
      ...darkTriad2,
      l: Math.min(1, Math.max(0.1, darkTriad2.l * 0.7)),
      c: Math.min(0.4, darkTriad2.c * 1.2),
    };
  }

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

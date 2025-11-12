export default function designsystemPalGen(baseOklch) {
  // Define general boundaries
  const CMAX = 0.25;
  const CMIN = 0.04;

  // Use the base hue for the Primary color
  const primaryHue = baseOklch.h % 360;
  // Use a complementary hue (180 deg offset) for the Accent color
  const accentHue = (baseOklch.h + 180) % 360;

  // --- Tonal Steps Definition ---
  // Define 5 Lightness (L) steps from dark to light.
  // We'll use names 500 (Base) up to 900 (Darkest) and 100 (Lightest).
  // Note: These L values are chosen for good perceptual distribution in OKLCH.
  const tonalSteps = [
    { name: "900", l: 0.25, cMult: 1.1 }, // Darkest
    { name: "700", l: 0.45, cMult: 1.05 }, // Darker
    { name: "500", l: 0.65, cMult: 1.0 }, // Base / Default
    { name: "300", l: 0.85, cMult: 0.8 }, // Lighter
    { name: "100", l: 0.95, cMult: 0.4 }, // Lightest
  ];

  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  // Helper to create a single color object
  function makeColor(hue, lValue, cMult) {
    // Determine the base chroma using the input, but clamp it to CMAX first
    const baseChroma = clamp(baseOklch.c, CMIN, CMAX);

    return {
      ...baseOklch, // Inherit other properties (like alpha)
      h: hue,
      // Chroma is reduced for lighter steps and increased for darker steps
      c: clamp(baseChroma * cMult, CMIN, CMAX),
      l: lValue,
    };
  }

  const palette = [];

  // 1. Generate Primary Tonal Range (5 colors)
  tonalSteps.forEach((step) => {
    palette.push({
      name: `Primary-${step.name}`,
      value: makeColor(primaryHue, step.l, step.cMult),
    });
  });

  // 2. Generate Accent Tonal Range (5 colors)
  // We use the same tonal steps but apply to the Accent hue.
  tonalSteps.forEach((step) => {
    palette.push({
      name: `Accent-${step.name}`,
      value: makeColor(accentHue, step.l, step.cMult),
    });
  });

  return palette;
}

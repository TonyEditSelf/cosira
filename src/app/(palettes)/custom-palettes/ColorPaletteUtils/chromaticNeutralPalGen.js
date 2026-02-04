export default function chromaticNeutralPalGen(oklch) {
  const baseHue = oklch.h;
  const baseLightness = oklch.l;
  const baseChroma = oklch.c;

  // Determine chroma bias based on input color's saturation
  // More saturated input = more tinted grays
  // Less saturated input = purer grays
  const chromaBias = Math.min(0.035, baseChroma * 0.15);

  // Define the neutral scale with intentional chroma curve
  // Chroma peaks in mid-tones where color perception is strongest
  const steps = [
    { name: "975", l: 0.06, chromaMultiplier: 0.5 }, // Deepest black for dark mode
    { name: "950", l: 0.12, chromaMultiplier: 0.65 }, // Dark mode backgrounds
    { name: "900", l: 0.2, chromaMultiplier: 0.8 }, // Very dark text
    { name: "800", l: 0.3, chromaMultiplier: 0.9 }, // Dark text, headings
    { name: "700", l: 0.42, chromaMultiplier: 1.0 }, // Body text (peak chroma)
    { name: "600", l: 0.54, chromaMultiplier: 1.0 }, // Muted text (peak chroma)
    { name: "500", l: 0.65, chromaMultiplier: 0.95 }, // Borders, icons
    { name: "400", l: 0.75, chromaMultiplier: 0.85 }, // Disabled states
    { name: "300", l: 0.83, chromaMultiplier: 0.7 }, // Subtle borders
    { name: "200", l: 0.89, chromaMultiplier: 0.6 }, // Hover backgrounds
    { name: "100", l: 0.94, chromaMultiplier: 0.5 }, // Card backgrounds
    { name: "50", l: 0.98, chromaMultiplier: 0.4 }, // Lightest backgrounds
  ];

  // For very light input colors (pastel brands), shift the whole scale darker
  // For very dark input colors, shift the whole scale lighter
  const lightnessAdjustment =
    baseLightness > 0.75
      ? -0.03 // Light input: darken slightly
      : baseLightness < 0.35
        ? 0.03 // Dark input: lighten slightly
        : 0; // Mid-tone input: no adjustment

  return steps.map(({ name, l, chromaMultiplier }) => {
    // Apply lightness adjustment
    const adjustedL = Math.max(0.04, Math.min(0.99, l + lightnessAdjustment));

    // Calculate chroma with perceptual curve
    // Mid-tones get more chroma, extremes get less
    const finalChroma = Math.max(
      0.005,
      Math.min(0.04, chromaBias * chromaMultiplier),
    );

    return {
      name,
      value: {
        h: baseHue,
        c: finalChroma,
        l: adjustedL,
      },
    };
  });
}

export default function dataVizPalettePalGen_HighContrast(oklch) {
  const baseHue = oklch.h % 360;
  const baseL = oklch.l;
  const baseC = oklch.c;

  const count = 10;

  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  // High-contrast accessible hue offsets (avoiding confusion for common colorblind types)
  const hueOffsets = [0, 36, 72, 108, 144, 180, 216, 252, 288, 324];

  function makeColor(i) {
    const t = i / (count - 1);

    // Hue: apply colorblind-friendly offsets
    const h = (baseHue + hueOffsets[i]) % 360;

    // Lightness: ensure perceptual separation
    const l = clamp(baseL * 0.6 + t * 0.35, 0.15, 0.85);

    // Chroma: boosted for readability but clamped to prevent oversaturation
    const c = clamp(baseC * 0.8 + (1 - Math.abs(t - 0.5)) * 0.15, 0.05, 0.28);

    return { ...oklch, h, l, c };
  }

  return Array.from({ length: count }, (_, i) => ({
    name: `HighContrast-${i + 1}`,
    value: makeColor(i),
  }));
}

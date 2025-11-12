export default function achromaticPalGen(baseOklch) {
  const LMAX = 0.98;
  const LMIN = 0.12;
  const CMAX = 0.01; // upper limit for chroma
  const CMIN = 0.0; // lower limit for chroma

  // Clamp utility
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  // Normalize base lightness and chroma
  const baseL = clamp(baseOklch.l, LMIN, LMAX);
  const baseC = clamp(baseOklch.c, CMIN, CMAX); // chroma scales to grayscale range

  // Relative lightness offsets centered around base
  const offsets = [-0.4, -0.3, -0.2, -0.1, -0.05, 0, 0.08, 0.16, 0.26, 0.35];

  const names = [
    "Black",
    "Darkest",
    "Darker",
    "Dark",
    "Medium-Dark",
    "Medium",
    "Medium-Light",
    "Light",
    "Lighter",
    "White",
  ];

  // Generate grayscale variants
  const palette = offsets.map((offset, i) => {
    const newL = clamp(baseL + offset, LMIN, LMAX);
    const newC = clamp(baseC * 0.8, CMIN, CMAX); // small proportional variation, not hardcoded
    return {
      name: names[i],
      value: {
        ...baseOklch,
        c: newC,
        l: newL,
      },
    };
  });

  return palette;
}

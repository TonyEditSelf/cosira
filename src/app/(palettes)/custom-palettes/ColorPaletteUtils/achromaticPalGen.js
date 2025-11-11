export default function achromaticPalGen(oklch) {
  const LMAX = 0.98;
  const LMIN = 0.12;
  const CMAX = 0.02; // Near-zero for pure grayscale
  const CMIN = 0.0;

  const baseColor = oklch;

  // Pure grayscale progression (chroma ≈ 0)
  const black = {
    ...baseColor,
    c: 0,
    l: Math.min(LMAX, Math.max(LMIN, 0.15)),
  };

  const darkest = {
    ...baseColor,
    c: 0,
    l: Math.min(LMAX, Math.max(LMIN, 0.25)),
  };

  const darker = {
    ...baseColor,
    c: 0,
    l: Math.min(LMAX, Math.max(LMIN, 0.35)),
  };

  const dark = {
    ...baseColor,
    c: 0,
    l: Math.min(LMAX, Math.max(LMIN, 0.45)),
  };

  const mediumDark = {
    ...baseColor,
    c: 0,
    l: Math.min(LMAX, Math.max(LMIN, 0.55)),
  };

  const medium = {
    ...baseColor,
    c: 0,
    l: Math.min(LMAX, Math.max(LMIN, 0.65)),
  };

  const mediumLight = {
    ...baseColor,
    c: 0,
    l: Math.min(LMAX, Math.max(LMIN, 0.75)),
  };

  const light = {
    ...baseColor,
    c: 0,
    l: Math.min(LMAX, Math.max(LMIN, 0.83)),
  };

  const lighter = {
    ...baseColor,
    c: 0,
    l: Math.min(LMAX, Math.max(LMIN, 0.91)),
  };

  const white = {
    ...baseColor,
    c: 0,
    l: Math.min(LMAX, Math.max(LMIN, 0.97)),
  };

  return [
    { name: "Black", value: black },
    { name: "Darkest", value: darkest },
    { name: "Darker", value: darker },
    { name: "Dark", value: dark },
    { name: "Medium-Dark", value: mediumDark },
    { name: "Medium", value: medium },
    { name: "Medium-Light", value: mediumLight },
    { name: "Light", value: light },
    { name: "Lighter", value: lighter },
    { name: "White", value: white },
  ];
}

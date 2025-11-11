export default function chromaticNeutralPalGen(oklch) {
  const LMAX = 0.95;
  const LMIN = 0.25;
  const CMAX = 0.08; // Very low saturation for neutrals
  const CMIN = 0.01;

  const baseColor = oklch;

  // Very desaturated versions at different lightness levels
  const darkest = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.15)),
    l: Math.min(LMAX, Math.max(LMIN, 0.3)),
  };

  const darker = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.18)),
    l: Math.min(LMAX, Math.max(LMIN, 0.4)),
  };

  const dark = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.2)),
    l: Math.min(LMAX, Math.max(LMIN, 0.5)),
  };

  const mediumDark = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.22)),
    l: Math.min(LMAX, Math.max(LMIN, 0.6)),
  };

  const medium = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.25)),
    l: Math.min(LMAX, Math.max(LMIN, 0.65)),
  };

  const mediumLight = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.22)),
    l: Math.min(LMAX, Math.max(LMIN, 0.72)),
  };

  const light = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.2)),
    l: Math.min(LMAX, Math.max(LMIN, 0.8)),
  };

  const lighter = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.18)),
    l: Math.min(LMAX, Math.max(LMIN, 0.87)),
  };

  const lightest = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.15)),
    l: Math.min(LMAX, Math.max(LMIN, 0.93)),
  };

  const nearWhite = {
    ...baseColor,
    c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.12)),
    l: Math.min(LMAX, Math.max(LMIN, 0.97)),
  };

  return [
    { name: "Darkest", value: darkest },
    { name: "Darker", value: darker },
    { name: "Dark", value: dark },
    { name: "Medium-Dark", value: mediumDark },
    { name: "Medium", value: medium },
    { name: "Medium-Light", value: mediumLight },
    { name: "Light", value: light },
    { name: "Lighter", value: lighter },
    { name: "Lightest", value: lightest },
    { name: "Near-White", value: nearWhite },
  ];
}

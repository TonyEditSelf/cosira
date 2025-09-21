export default function monochromaticPalGen(oklch, options) {
  let baseColor,
    darkBase,
    darkerBase,
    darkestBase,
    lightBase,
    lighterBase,
    lightestBase,
    darkerNeutralBase,
    mutedDarkerBase,
    lighterNeutralBase,
    mutedLighterBase;

  baseColor = oklch;

  darkBase = { ...baseColor, l: Math.max(0, baseColor.l - 0.15) };
  darkerBase = { ...baseColor, l: Math.max(0, baseColor.l - 0.2) };
  darkestBase = { ...baseColor, l: Math.max(0, baseColor.l - 0.25) };

  darkerNeutralBase = {
    ...baseColor,
    l: Math.max(0, baseColor.l - 0.1),
    c: Math.max(0, baseColor.c - 0.08),
  };

  mutedDarkerBase = {
    ...baseColor,
    l: Math.max(0, baseColor.l - 0.12),
    c: Math.max(0, baseColor.c - 0.12),
  };

  lightBase = { ...baseColor, l: Math.min(1, baseColor.l + 0.15) };
  lighterBase = { ...baseColor, l: Math.min(1, baseColor.l + 0.2) };
  lightestBase = { ...baseColor, l: Math.min(1, baseColor.l + 0.25) };

  lighterNeutralBase = {
    ...baseColor,
    l: Math.min(1, baseColor.l + 0.1),
    c: Math.min(1, baseColor.c - 0.08),
  };

  mutedLighterBase = {
    ...baseColor,
    l: Math.min(1, baseColor.l + 0.12),
    c: Math.max(0, baseColor.c - 0.12),
  };

  return [
    baseColor,
    darkBase,
    darkerBase,
    darkestBase,
    darkerNeutralBase,
    mutedDarkerBase,
    lightBase,
    lighterBase,
    lightestBase,
    lighterNeutralBase,
    mutedLighterBase,
  ];
}

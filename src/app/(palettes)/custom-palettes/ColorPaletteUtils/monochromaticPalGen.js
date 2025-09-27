export default function monochromaticPalGen(oklch) {
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
    { name: "Base-D", value: darkBase },
    { name: "Base-DD", value: darkerBase },
    { name: "Base-DDD", value: darkestBase },
    { name: "Base-DN", value: darkerNeutralBase },
    { name: "Base-MD", value: mutedDarkerBase },
    { name: "Base", value: baseColor },
    { name: "Base-L", value: lightBase },
    { name: "Base-LL", value: lighterBase },
    { name: "Base-LLL", value: lightestBase },
    { name: "Base-LN", value: lighterNeutralBase },
    { name: "Base-ML", value: mutedLighterBase },
  ];
}

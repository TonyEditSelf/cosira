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

  darkBase = {
    ...baseColor,
    l: Math.max(0, baseColor.l * 0.85), // 15% darker
  };

  darkerBase = {
    ...baseColor,
    l: Math.max(0, baseColor.l * 0.8), // 20% darker
  };

  darkestBase = {
    ...baseColor,
    l: Math.max(0, baseColor.l * 0.75), // 25% darker
  };

  darkerNeutralBase = {
    ...darkestBase,
    c: Math.min(darkestBase.c * 0.5, 0.08),
  };

  mutedDarkerBase = {
    ...darkestBase,
    l: darkestBase.l * 0.8, // 20% darker
    c: Math.min(darkestBase.c * 0.5, 0.08), // 50% less saturated, capped at 0.08
  };

  lightBase = {
    ...baseColor,
    l: Math.min(1, baseColor.l * 1.15), // 15% lighter
  };

  lighterBase = {
    ...baseColor,
    l: Math.min(1, baseColor.l * 1.2), // 20% lighter
  };

  lightestBase = {
    ...baseColor,
    l: Math.min(1, baseColor.l * 1.25), // 25% lighter
  };

  lighterNeutralBase = {
    ...lightestBase,
    l: Math.min(1, lightestBase.l * 1.1), // 10% lighter (scaled)
    c: Math.min(lightestBase.c * 0.5, 0.08), // scaled neutral chroma
  };

  mutedLighterBase = {
    ...lightBase,
    l: Math.min(1, lightBase.l * 1.1), // 10% lighter (scales instead of adds)
    c: Math.min(lightBase.c * 0.6, 0.12), // 40% less chroma, capped at 0.12
  };

  return [
    { name: "Base-DN", value: darkerNeutralBase },
    { name: "Base-MD", value: mutedDarkerBase },
    { name: "Base-DDD", value: darkestBase },
    { name: "Base-DD", value: darkerBase },
    { name: "Base-D", value: darkBase },
    { name: "Base", value: baseColor },
    { name: "Base-L", value: lightBase },
    { name: "Base-LL", value: lighterBase },
    { name: "Base-LLL", value: lightestBase },
    { name: "Base-LN", value: lighterNeutralBase },
    { name: "Base-ML", value: mutedLighterBase },
  ];
}

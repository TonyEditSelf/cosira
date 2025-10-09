export default function monochromaticPalGen(oklch) {
  let baseColor = oklch;

  let darkBase = {
    ...baseColor,
    l: Math.min(1, Math.max(0, baseColor.l * 0.85)), // 15% darker
  };

  let darkerBase = {
    ...baseColor,
    l: Math.min(1, Math.max(0, baseColor.l * 0.8)), // 20% darker
  };

  let darkestBase = {
    ...baseColor,
    l: Math.min(1, Math.max(0, baseColor.l * 0.75)), // 25% darker
  };

  let darkerNeutralBase = {
    ...darkestBase,
    c: Math.min(0.08, Math.max(0, darkestBase.c * 0.5)),
  };

  let mutedDarkerBase = {
    ...darkestBase,
    l: Math.min(1, Math.max(0, darkestBase.l * 0.8)), // 20% darker, clamped
    c: Math.min(0.08, Math.max(0, darkestBase.c * 0.5)), // chroma clamped
  };

  let lightBase = {
    ...baseColor,
    l: Math.min(1, Math.max(0, baseColor.l * 1.15)), // 15% lighter
  };

  let lighterBase = {
    ...baseColor,
    l: Math.min(1, Math.max(0, baseColor.l * 1.2)), // 20% lighter
  };

  let lightestBase = {
    ...baseColor,
    l: Math.min(1, Math.max(0, baseColor.l * 1.25)), // 25% lighter
  };

  let lighterNeutralBase = {
    ...lightestBase,
    l: Math.min(1, Math.max(0, lightestBase.l * 1.1)), // 10% lighter (scaled), clamped
    c: Math.min(0.08, Math.max(0, lightestBase.c * 0.5)), // chroma clamped
  };

  let mutedLighterBase = {
    ...lightBase,
    l: Math.min(1, Math.max(0, lightBase.l * 1.1)), // 10% lighter, clamped
    c: Math.min(0.12, Math.max(0, lightBase.c * 0.6)), // chroma clamped
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

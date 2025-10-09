export default function analogousPalGen(oklch, options) {
  const baseColor = oklch;

  const darkBase = {
    ...baseColor,
    l: Math.min(1, Math.max(0, baseColor.l * 0.85)),
  };
  const lightBase = {
    ...baseColor,
    l: Math.min(1, Math.max(0, baseColor.l * 1.15)),
  };

  const analogousOne = {
    ...baseColor,
    h: (baseColor.h + options.analogousAngle1 + 360) % 360,
  };

  const analogousOneDark = {
    ...analogousOne,
    l: Math.min(1, Math.max(0, analogousOne.l * 0.85)), // 15% darker, clamped between 0–1
  };

  const analogousOneLight = {
    ...analogousOne,
    l: Math.min(1, Math.max(0, analogousOne.l * 1.15)), // 15% lighter, clamped between 0–1
  };

  const analogousTwo = {
    ...analogousOne,
    h: (baseColor.h + options.analogousAngle2 + 360) % 360,
  };

  const analogousTwoDark = {
    ...analogousTwo,
    l: Math.min(1, Math.max(0, analogousTwo.l * 0.85)), // 15% darker, clamped between 0–1
  };

  const analogousTwoLight = {
    ...analogousTwo,
    l: Math.min(1, Math.max(0, analogousTwo.l * 1.15)), // 15% lighter,
  };

  const analogousThree = {
    ...analogousTwo,
    h: (baseColor.h + options.analogousAngle3 + 360) % 360,
  };

  const analogousThreeDark = {
    ...analogousThree,
    l: Math.min(1, Math.max(0, analogousThree.l * 0.85)), // 15% darker,
  };

  const analogousThreeLight = {
    ...analogousThree,
    l: Math.min(1, Math.max(0, analogousThree.l * 1.15)), // 15% lighter,
  };

  return [
    { name: "A1-D", value: analogousOneDark },
    { name: "A1", value: analogousOne },
    { name: "A1-L", value: analogousOneLight },
    { name: "Base-D", value: darkBase },
    { name: "Base", value: baseColor },
    { name: "Base-L", value: lightBase },
    { name: "A2-D", value: analogousTwoDark },
    { name: "A2", value: analogousTwo },
    { name: "A2-L", value: analogousTwoLight },
    { name: "A3-D", value: analogousThreeDark },
    { name: "A3", value: analogousThree },
    { name: "A3-L", value: analogousThreeLight },
  ];
}

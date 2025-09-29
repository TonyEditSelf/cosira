export default function analogousPalGen(oklch, options) {
  let baseColor,
    darkBase,
    lightBase,
    analogousOne,
    analogousOneDark,
    analogousOneLight,
    analogousTwo,
    analogousTwoDark,
    analogousTwoLight,
    analogousThree,
    analogousThreeDark,
    analogousThreeLight;

  baseColor = oklch;

  darkBase = { ...baseColor, l: Math.max(0, baseColor.l - 0.15) };
  lightBase = {
    ...baseColor,
    l: Math.min(1, baseColor.l + 0.15),
  };

  analogousOne = {
    ...baseColor,
    h: (baseColor.h + options.analogousAngle1 + 360) % 360,
  };

  analogousOneDark = {
    ...analogousOne,
    l: Math.max(0, analogousOne.l - 0.15),
  };

  analogousOneLight = {
    ...analogousOne,
    l: Math.max(0, analogousOne.l + 0.15),
  };

  analogousTwo = {
    ...analogousOne,
    h: (baseColor.h + options.analogousAngle2 + 360) % 360,
  };

  analogousTwoDark = {
    ...analogousTwo,
    l: Math.max(0, analogousTwo.l - 0.15),
  };

  analogousTwoLight = {
    ...analogousTwo,
    l: Math.max(0, analogousTwo.l + 0.15),
  };

  analogousThree = {
    ...analogousTwo,
    h: (baseColor.h + options.analogousAngle3 + 360) % 360,
  };

  analogousThreeDark = {
    ...analogousThree,
    l: Math.max(0, analogousThree.l - 0.15),
  };

  analogousThreeLight = {
    ...analogousThree,
    l: Math.max(0, analogousThree.l + 0.15),
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

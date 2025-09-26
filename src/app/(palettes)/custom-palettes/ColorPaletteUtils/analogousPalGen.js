export default function analogousPalGen(oklch, options) {
  let baseColor,
    darkBase,
    darkerNeutralBase,
    lightBase,
    analogousOne,
    analogousOneDark,
    analogousOneLight,
    analogousTwo,
    analogousTwoDark,
    analogousTwoLight,
    analogousThree;

  baseColor = oklch;

  darkBase = { ...baseColor, l: Math.max(0, baseColor.l - options.darkOffset) };
  lightBase = {
    ...baseColor,
    l: Math.min(1, baseColor.l + 0.15),
  };
  darkerNeutralBase = {
    ...baseColor,
    l: Math.max(0, baseColor.l - 0.15),
    c: Math.max(0, baseColor.c - 0.08),
  };
  analogousOne = {
    ...baseColor,
    h: (baseColor.h + options.analogousStep1 + 360) % 360,
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
    h: (baseColor.h + options.analogousStep2) % 360,
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
    h: (baseColor.h + options.analogousStep3) % 360,
  };

  return [
    { name: "A1-D", value: analogousOneDark },
    { name: "A1", value: analogousOne },
    { name: "A1-L", value: analogousOneLight },
    { name: "Base-D", value: darkBase },
    { name: "Base-N", value: darkerNeutralBase },
    { name: "Base", value: baseColor },
    { name: "Base-L", value: lightBase },
    { name: "A2-D", value: analogousTwoDark },
    { name: "A2", value: analogousTwo },
    { name: "A2-L", value: analogousTwoLight },
    { name: "A3", value: analogousThree },
  ];
}

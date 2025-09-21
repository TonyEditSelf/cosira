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
    l: Math.min(1, baseColor.l + options.lightOffset),
  };
  darkerNeutralBase = {
    ...baseColor,
    l: Math.max(0, baseColor.l - options.neutralLightOffSet),
    c: Math.max(0, baseColor.c - options.neutralChromaOffset),
  };
  analogousOne = {
    ...baseColor,
    h: (baseColor.h + options.analogousStep) % 360,
  };
  analogousOneDark = {
    ...analogousOne,
    l: Math.max(0, analogousOne.l - options.darkOffset),
  };

  analogousOneLight = {
    ...analogousOne,
    l: Math.max(0, analogousOne.l + options.lightOffset),
  };
  analogousTwo = {
    ...analogousOne,
    h: (analogousOne.h + options.analogousStep) % 360,
  };

  analogousTwoDark = {
    ...analogousTwo,
    l: Math.max(0, analogousTwo.l - options.darkOffset),
  };

  analogousTwoLight = {
    ...analogousTwo,
    l: Math.max(0, analogousTwo.l + options.lightOffset),
  };

  analogousThree = {
    ...analogousTwo,
    h: (analogousTwo.h + options.analogousStep) % 360,
  };

  return [
    baseColor,
    darkBase,
    darkerNeutralBase,
    lightBase,
    analogousOne,
    analogousOneDark,
    analogousOneLight,
    analogousTwo,
    analogousTwoDark,
    analogousTwoLight,
    analogousThree,
  ];
}

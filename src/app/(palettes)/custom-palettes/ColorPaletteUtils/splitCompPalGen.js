import chroma from "chroma-js";

export default function splitCompPalGen(oklch, options) {
  let baseColor;

  baseColor = oklch;

  const darkBase = { ...baseColor, l: Math.max(0, baseColor.l * 0.85) };
  const lightBase = { ...baseColor, l: Math.min(1, baseColor.l * 1.15) };

  const compColor = { ...baseColor, h: (baseColor.h + 180) % 360 };

  const splitComp1 = {
    ...compColor,
    h: (compColor.h + options.splitCompAngle1 + 360) % 360,
  };
  const darkSplitComp1 = { ...splitComp1, l: Math.max(0, splitComp1.l * 0.85) };

  const lightSplitComp1 = {
    ...splitComp1,
    l: Math.min(1, splitComp1.l * 1.15),
  };

  const darkNeuSplitComp1 = {
    ...darkSplitComp1,
    c: Math.min(darkSplitComp1.c * 0.5, 0.08),
  };

  const splitComp2 = {
    ...compColor,
    h: (compColor.h + options.splitCompAngle2) % 360,
  };

  const darkSplitComp2 = { ...splitComp2, l: Math.max(0, splitComp2.l * 0.85) };

  const lightSplitComp2 = {
    ...splitComp2,
    l: Math.min(1, splitComp2.l * 1.15),
  };

  const darkNeuSplitComp2 = {
    ...darkSplitComp2,
    c: Math.min(darkSplitComp2.c * 0.5, 0.08),
  };

  return [
    { name: "Base-D", value: darkBase },
    { name: "Base", value: baseColor },
    { name: "Base-L", value: lightBase },
    { name: "SC1-DN", value: darkNeuSplitComp1 },
    { name: "SC1-D", value: darkSplitComp1 },
    { name: "SC1", value: splitComp1 },
    { name: "SC1-L", value: lightSplitComp1 },
    { name: "SC2-DN", value: darkNeuSplitComp2 },
    { name: "SC2-D", value: darkSplitComp2 },
    { name: "SC2", value: splitComp2 },
    { name: "SC2-L", value: lightSplitComp2 },
  ];
}

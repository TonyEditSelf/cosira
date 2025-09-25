import chroma from "chroma-js";

export default function splitCompPalGen(oklch, options) {
  let baseColor;

  baseColor = oklch;

  const base = chroma.oklch(baseColor.l, baseColor.c, baseColor.h);

  const darkBase = { ...baseColor, l: Math.max(0, baseColor.l - 0.1) };
  const lightBase = { ...baseColor, l: Math.min(1, baseColor.l + 0.1) };

  const compColor = { ...baseColor, h: (baseColor.h + 180) % 360 };

  const splitComp1 = { ...compColor, h: (compColor.h + 30) % 360 };
  const darkSplitComp1 = { ...splitComp1, l: Math.max(0, splitComp1.l - 0.15) };
  const lightSplitComp1 = {
    ...splitComp1,
    l: Math.min(1, splitComp1.l + 0.15),
  };

  const splitComp2 = { ...compColor, h: (compColor.h - 30) % 360 };
  const darkSplitComp2 = { ...splitComp2, l: Math.max(0, splitComp2.l - 0.15) };
  const lightSplitComp2 = {
    ...splitComp2,
    l: Math.min(1, splitComp2.l + 0.15),
  };

  return [
    { name: "Base", value: baseColor },
    { name: "Base-D", value: darkBase },
    { name: "Base-L", value: lightBase },
    { name: "SC1", value: splitComp1 },
    { name: "SC1-D", value: darkSplitComp1 },
    { name: "SC1-L", value: lightSplitComp1 },
    { name: "SC2", value: splitComp2 },
    { name: "SC2-D", value: darkSplitComp2 },
    { name: "SC2-L", value: lightSplitComp2 },
  ];
}

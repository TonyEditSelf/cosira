export default function tetradicPalGen(oklch, tetradicAngle) {
  const baseColor1 = oklch;

  const baseColor1Dark = {
    ...baseColor1,
    l: Math.max(0, baseColor1.l * 0.85),
  };

  const baseColor1Light = {
    ...baseColor1,
    l: Math.min(1, baseColor1.l * 1.15),
  };

  const baseColor1Comp = {
    ...baseColor1,
    h: (baseColor1.h + 180) % 360,
  };

  const baseColor1CompDark = {
    ...baseColor1Comp,
    l: Math.max(0, baseColor1Comp.l * 0.85),
  };

  const baseColor1CompLight = {
    ...baseColor1Comp,
    l: Math.min(1, baseColor1Comp.l * 1.15),
  };

  const baseColor1CompNeutral = {
    ...baseColor1Comp,
    c: 0.03,
  };

  const baseColor2 = {
    ...baseColor1,
    h: (baseColor1.h + tetradicAngle) % 360,
  };

  const baseColor2Light = {
    ...baseColor2,
    l: Math.min(1, baseColor2.l * 1.15),
  };

  const baseColor2Comp = {
    ...baseColor2,
    h: (baseColor2.h + 180) % 360,
  };

  const baseColor2CompLight = {
    ...baseColor2Comp,
    l: Math.min(1, baseColor2Comp.l * 1.15),
  };

  return [
    { name: "Base-D", value: baseColor1Dark },
    { name: "Base", value: baseColor1 },
    { name: "Base-L", value: baseColor1Light },
    { name: "Base2", value: baseColor2 },
    { name: "Base2-L", value: baseColor2Light },
    { name: "Base-C-N", value: baseColor1CompNeutral },
    { name: "Base-C-D", value: baseColor1CompDark },
    { name: "Base-C", value: baseColor1Comp },
    { name: "Base-C-L", value: baseColor1CompLight },
    { name: "Base2-C", value: baseColor2Comp },
    { name: "Base2-C-L", value: baseColor2CompLight },
  ];
}

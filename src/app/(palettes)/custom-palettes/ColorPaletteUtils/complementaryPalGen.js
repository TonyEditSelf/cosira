import {
  converter,
  clampChroma,
  formatCss,
  formatHex8,
  displayable,
} from "culori";

export default function complementaryPalGen(hexColorState, source) {
  const toOKLCH = converter("oklch");

  let baseColor, compColor;

  if (source === 0) {
    baseColor = toOKLCH(hexColorState);

    compColor = {
      ...baseColor,
      l: baseColor.l,
      c: baseColor.c,
      h: (baseColor.h + 180) % 360,
    };
  }

  if (source === 1) {
    compColor = toOKLCH(hexColorState);
    baseColor = {
      ...compColor,
      l: compColor.l,
      c: compColor.c,
      h: (compColor.h + 180) % 360,
    };
  }

  // const ableToShowCompColor = displayable(compColor);
  // const ableToShowBaseColor = displayable(baseColor);

  // let showableCompColor;
  // let showableBaseColor;

  // if (!ableToShowCompColor) {
  //   showableCompColor = clampChroma(compColor, "oklch");
  // } else {
  //   showableCompColor = compColor;
  // }

  // if (!ableToShowBaseColor) {
  //   showableBaseColor = clampChroma(baseColor, "oklch");
  // } else {
  //   showableBaseColor = baseColor;
  // }

  // console.log(showableBaseColor);
  // console.log(showableCompColor);
  return [baseColor, compColor];
  // return [showableBaseColor, showableCompColor];
}

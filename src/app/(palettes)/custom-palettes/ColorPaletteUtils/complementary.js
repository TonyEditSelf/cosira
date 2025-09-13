import { converter, clampChroma, formatCss, displayable } from "culori";

export default function complementary(oklchAriaString) {
  const toOKLCH = converter("oklch");

  const baseColor = toOKLCH(oklchAriaString);

  const compColor = { ...baseColor, h: (baseColor.h + 180) % 360 };
  const ableToShowCompColor = displayable(compColor);
  const ableToShowBaseColor = displayable(baseColor);

  let showableCompColor;
  let showableBaseColor;

  if (!ableToShowCompColor) {
    showableCompColor = clampChroma(compColor);
  } else {
    showableCompColor = compColor;
  }

  if (!ableToShowBaseColor) {
    showableBaseColor = clampChroma(baseColor);
  } else {
    showableBaseColor = baseColor;
  }

  return {
    colorStringsArray: [
      formatCss(showableBaseColor),
      formatCss(showableCompColor),
    ],
    colorObjectsArray: [showableBaseColor, showableCompColor],
  };
}

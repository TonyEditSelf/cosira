import {
  converter,
  clampChroma,
  formatCss,
  formatHex8,
  displayable,
} from "culori";

export default function complementaryPalGen(hexColorState) {
  const toOKLCH = converter("oklch");

  const baseColor = toOKLCH(hexColorState);

  const compColor = { ...baseColor, h: (baseColor.h + 180) % 360 };
  const ableToShowCompColor = displayable(compColor);
  const ableToShowBaseColor = displayable(baseColor);

  let showableCompColor;
  let showableBaseColor;

  if (!ableToShowCompColor) {
    showableCompColor = clampChroma(compColor, "oklch");
  } else {
    showableCompColor = compColor;
  }

  if (!ableToShowBaseColor) {
    showableBaseColor = clampChroma(baseColor, "oklch");
  } else {
    showableBaseColor = baseColor;
  }

  return [showableBaseColor, showableCompColor];
}

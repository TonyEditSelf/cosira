import complementaryPalGen from "./complementaryPalGen";
import monochromaticPalGen from "./monochromaticPalGen";
import analogousPalGen from "./analogousPalGen";
import splitCompPalGen from "./splitCompPalGen";
import triadicPalGen from "./triadicPalGen";
import tetradicPalGen from "./tetradicPalGen";

export default function paletteDecider(
  oklch,
  analogOptions,
  splitCompOptions,
  tetradicAngle,
  selectedPaletteType,
  compPalType,
  monoPalType,
  analogPalType
) {
  if (selectedPaletteType === "complementary") {
    return complementaryPalGen(oklch, compPalType);
  } else if (selectedPaletteType === "monochromatic") {
    return monochromaticPalGen(oklch, monoPalType);
  } else if (selectedPaletteType === "analogous") {
    return analogousPalGen(oklch, analogOptions, analogPalType);
  } else if (selectedPaletteType === "splitComplementary") {
    return splitCompPalGen(oklch, splitCompOptions);
  } else if (selectedPaletteType === "triadic") {
    return triadicPalGen(oklch);
  } else if (selectedPaletteType === "tetradic") {
    return tetradicPalGen(oklch, tetradicAngle);
  }

  return null;
}

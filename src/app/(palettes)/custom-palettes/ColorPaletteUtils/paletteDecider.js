import complementaryPalGen from "./complementaryPalGen";
import monochromaticPalGen from "./monochromaticPalGen";
import analogousPalGen from "./analogousPalGen";
import splitCompPalGen from "./splitCompPalGen";
import triadicPalGen from "./triadicPalGen";
import tetradicPalGen from "./tetradicPalGen";

export default function paletteDecider(
  oklch,
  analogOptions,
  splitCompAngles,
  selectedPaletteType
) {
  if (selectedPaletteType === "complementary") {
    return complementaryPalGen(oklch);
  } else if (selectedPaletteType === "monochromatic") {
    return monochromaticPalGen(oklch);
  } else if (selectedPaletteType === "analogous") {
    return analogousPalGen(oklch, analogOptions);
  } else if (selectedPaletteType === "splitComplementary") {
    return splitCompPalGen(oklch, splitCompAngles);
  } else if (selectedPaletteType === "triadic") {
    return triadicPalGen(oklch);
  } else if (selectedPaletteType === "tetradic") {
    return tetradicPalGen(oklch, tetradicOptions);
  }

  return null;
}

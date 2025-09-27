import complementaryPalGen from "./complementaryPalGen";
import monochromaticPalGen from "./monochromaticPalGen";
import analogousPalGen from "./analogousPalGen";
import splitCompPalGen from "./splitCompPalGen";
import triadicPalGen from "./triadicPalGen";

export default function paletteDecider(
  oklch,
  analogOptions,
  splitCompOptions,
  selectedPaletteType
) {
  if (selectedPaletteType === "complementary") {
    return complementaryPalGen(oklch);
  } else if (selectedPaletteType === "monochromatic") {
    return monochromaticPalGen(oklch);
  } else if (selectedPaletteType === "analogous") {
    return analogousPalGen(oklch, analogOptions);
  } else if (selectedPaletteType === "splitComplementary") {
    return splitCompPalGen(oklch, splitCompOptions);
  } else if (selectedPaletteType === "triadic") {
    return triadicPalGen(oklch);
  }

  return null;
}

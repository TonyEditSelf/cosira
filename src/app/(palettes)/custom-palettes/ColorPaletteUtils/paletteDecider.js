import complementaryPalGen from "./complementaryPalGen";
import monochromaticPalGen from "./monochromaticPalGen";
import analogousPalGen from "./analogousPalGen";
import splitCompPalGen from "./splitCompPalGen";

export default function paletteDecider(oklch, options, selectedPaletteType) {
  if (selectedPaletteType === "complementary") {
    return complementaryPalGen(oklch, options);
  } else if (selectedPaletteType === "monochromatic") {
    return monochromaticPalGen(oklch, options);
  } else if (selectedPaletteType === "analogous") {
    return analogousPalGen(oklch, options);
  } else if (selectedPaletteType === "splitComplementary") {
    return splitCompPalGen(oklch, options);
  }

  return null;
}

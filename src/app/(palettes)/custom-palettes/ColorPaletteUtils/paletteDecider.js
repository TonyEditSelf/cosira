import complementaryPalGen from "./complementaryPalGen";

export default function paletteDecider(
  oklchColor,
  selectedPaletteType,
  source
) {
  if (selectedPaletteType === "complementary") {
    return complementaryPalGen(oklchColor, source);
  }
  return null;
}

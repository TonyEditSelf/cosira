import complementaryPalGen from "./complementaryPalGen";

export default function paletteDecider(
  hexColorState,
  selectedPaletteType,
  source
) {
  if (selectedPaletteType === "complementary") {
    return complementaryPalGen(hexColorState, source);
  } else {
    return null;
  }
}

import complementaryPalGen from "./complementaryPalGen";

export default function paletteDecider(hexColorState, selectedPaletteType) {
  if (selectedPaletteType === "complementary") {
    return complementaryPalGen(hexColorState);
  } else {
    return null;
  }
}

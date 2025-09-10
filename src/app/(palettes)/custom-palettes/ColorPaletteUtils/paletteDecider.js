import complementary from "./complementary";

export default function paletteDecider(ariaColor, selectedPaletteType) {
  if (selectedPaletteType === "complementary") {
    console.log("selectedPaletteType: ", selectedPaletteType);
    // console.log("ariaColor: ", ariaColor);
    return complementary(ariaColor);
  }
  console.log("selectedPaletteType: ", selectedPaletteType);
}

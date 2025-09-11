import complementary from "./complementary";

export default function paletteDecider(ariaColor, selectedPaletteType) {
  if (selectedPaletteType === "complementary") {
    console.log("selectedPaletteType: ", selectedPaletteType);
    // console.log("ariaColor: ", ariaColor);
    return complementary(ariaColor);
  }
  if (process.env.NODE_ENV === "development") {
    console.log("selectedPaletteType:", selectedPaletteType);
  }
}

import complementary from "./complementary";

export default function paletteDecider(oklchAriaString, selectedPaletteType) {
  if (selectedPaletteType === "complementary") {
    const palette = complementary(oklchAriaString);

    return palette;
  } else {
    return null;
  }
}

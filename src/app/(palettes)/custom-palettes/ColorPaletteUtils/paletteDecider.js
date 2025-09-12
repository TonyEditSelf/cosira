import complementary from "./complementary";

export default function paletteDecider(ariaColor, selectedPaletteType) {
  if (selectedPaletteType === "complementary") {    
    
    const palette =  complementary(ariaColor);

return palette;

  } else {
    return null;
  }

}

import complementaryPalGen from "./complementaryPalGen";
import monochromaticPalGen from "./monochromaticPalGen";
import analogousPalGen from "./analogousPalGen";
import splitCompPalGen from "./splitCompPalGen";
import triadicPalGen from "./triadicPalGen";
import tetradicPalGen from "./tetradicPalGen";
import vintagePalGen from "./vintagePalGen";
import neutralPalGen from "./neutralPalGen";
import kidsPalGen from "./kidsPalGen";

export default function paletteDecider(
  oklch,
  analogOptions,
  splitCompOptions,
  tetradicAngle,
  selectedPaletteType,
  vintagePalType,
  neutralPalType,
  kidsPalType
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
  } else if (selectedPaletteType === "tetradic") {
    return tetradicPalGen(oklch, tetradicAngle);
  } else if (selectedPaletteType === "vintage") {
    return vintagePalGen(
      oklch,
      analogOptions,
      splitCompOptions,
      tetradicAngle,
      selectedPaletteType,
      vintagePalType
    );
  } else if (selectedPaletteType === "neutral") {
    return neutralPalGen(
      oklch,
      analogOptions,
      splitCompOptions,
      tetradicAngle,
      selectedPaletteType,
      neutralPalType
    );
  } else if (selectedPaletteType === "kidFriendly") {
    return kidsPalGen(
      oklch,
      analogOptions,
      splitCompOptions,
      tetradicAngle,
      selectedPaletteType,
      kidsPalType
    );
  }

  return null;
}

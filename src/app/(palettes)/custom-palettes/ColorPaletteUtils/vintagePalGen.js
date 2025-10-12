import analogousPalGen from "./analogousPalGen";
import complementaryPalGen from "./complementaryPalGen";
import monochromaticPalGen from "./monochromaticPalGen";
import splitCompPalGen from "./splitCompPalGen";
import tetradicPalGen from "./tetradicPalGen";
import triadicPalGen from "./triadicPalGen";

export default function vintagePalGen(
  oklch,
  analogOptions,
  splitCompOptions,
  tetradicAngle,
  selectedPaletteType,
  vintagePalType
) {
  if (vintagePalType === "vintageComp") {
    const vintageCompPal = complementaryPalGen(oklch, vintagePalType);
    return vintageCompPal;
  } else if (vintagePalType === "vintageSplitComp") {
    const vintageSplitCompPal = splitCompPalGen(
      oklch,
      splitCompOptions,
      vintagePalType
    );
    return vintageSplitCompPal;
  } else if (vintagePalType === "vintageMono") {
    const vintageMonoPal = monochromaticPalGen(oklch, vintagePalType);
    return vintageMonoPal;
  } else if (vintagePalType === "vintageAnalog") {
    const vintageAnalogPal = analogousPalGen(
      oklch,
      analogOptions,
      vintagePalType
    );
    return vintageAnalogPal;
  } else if (vintagePalType === "vintageTetra") {
    const vintageTetraPal = tetradicPalGen(
      oklch,
      tetradicAngle,
      vintagePalType,
      null
    );
    return vintageTetraPal;
  } else if (vintagePalType === "vintageTriad") {
    const vintageTriadPal = triadicPalGen(oklch, vintagePalType);
    return vintageTriadPal;
  }
}

import complementaryPalGen from "./complementaryPalGen";
import analogousPalGen from "./analogousPalGen";
import monochromaticPalGen from "./monochromaticPalGen";
import splitCompPalGen from "./splitCompPalGen";
import triadicPalGen from "./triadicPalGen";
import tetradicPalGen from "./tetradicPalGen";

export default function neutralPalGen(
  oklch,
  analogOptions,
  splitCompOptions,
  tetradicAngle,
  selectedPaletteType,
  neutralPalType
) {
  if (neutralPalType === "neutralComp") {
    const neutralCompPal = complementaryPalGen(oklch, null, neutralPalType);
    return neutralCompPal;
  } else if (neutralPalType === "neutralSplitComp") {
    const neutralSplitCompPal = splitCompPalGen(
      oklch,
      splitCompOptions,
      null,
      neutralPalType
    );
    return neutralSplitCompPal;
  } else if (neutralPalType === "neutralMono") {
    const neutralMonoPal = monochromaticPalGen(oklch, null, neutralPalType);
    return neutralMonoPal;
  } else if (neutralPalType === "neutralAnalog") {
    const neutralAnalogPal = analogousPalGen(
      oklch,
      analogOptions,
      null,
      neutralPalType
    );
    return neutralAnalogPal;
  } else if (neutralPalType === "neutralTetra") {
    const neutralTetraPal = tetradicPalGen(
      oklch,
      tetradicAngle,
      null,
      neutralPalType
    );
    return neutralTetraPal;
  } else if (neutralPalType === "neutralTriad") {
    const neutralTriadPal = triadicPalGen(oklch, null, neutralPalType);
    return neutralTriadPal;
  }
}

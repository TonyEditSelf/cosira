import monochromaticPalGen from "./monochromaticPalGen";
import analogousPalGen from "./analogousPalGen";
import complementaryPalGen from "./complementaryPalGen";
import splitCompPalGen from "./splitCompPalGen";
import triadicPalGen from "./triadicPalGen";
import splitTriadicPalGen from "./splitTriadicPalGen";
import tetradicPalGen from "./tetradicPalGen";

export default function kidsPalGen(
  oklch,
  analogOptions,
  splitCompOptions,
  tetradicAngle,
  selectedPaletteType,
  kidsPalType
) {
  if (kidsPalType === "kidsComp") {
    const kidsCompPal = complementaryPalGen(oklch, null, null, kidsPalType);
    return kidsCompPal;
  } else if (kidsPalType === "kidsSplitComp") {
    const kidsSplitCompPal = splitCompPalGen(
      oklch,
      splitCompOptions,
      null,
      null,
      kidsPalType
    );
    return kidsSplitCompPal;
  } else if (kidsPalType === "kidsMono") {
    const kidsMonoPal = monochromaticPalGen(oklch, null, kidsPalType);
    return kidsMonoPal;
  } else if (kidsPalType === "kidsAnalog") {
    const kidsAnalogPal = analogousPalGen(
      oklch,
      analogOptions,
      null,
      kidsPalType
    );
    return kidsAnalogPal;
  } else if (kidsPalType === "kidsTetra") {
    const kidsTetraPal = tetradicPalGen(
      oklch,
      tetradicAngle,
      null,
      kidsPalType
    );
    return kidsTetraPal;
  } else if (kidsPalType === "kidsTriad") {
    const kidsTriadPal = triadicPalGen(oklch, null, kidsPalType);
    return kidsTriadPal;
  }
}

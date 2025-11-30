import complementaryPalGen from "./complementaryPalGen";
import monochromaticPalGen from "./monochromaticPalGen";
import analogousPalGen from "./analogousPalGen";
import splitCompPalGen from "./splitCompPalGen";
import triadicPalGen from "./triadicPalGen";
import tetradicPalGen from "./tetradicPalGen";
import squarePalGen from "./squarePalGen";
import accentedAnalogousPalGen from "./accentedAnalogousPalGen";
import compoundPalGen from "./compoundPalGen";
import warmCoolPalGen from "./warmCoolPalGen";
import chromaticNeutralPalGen from "./chromaticNeutralPalGen";
import doubleSplitCompPalGen from "./doubleSplitCompPalGen";
import nearCompPalGen from "./nearCompPalGen";
import clashPalGen from "./clashPalGen";
import achromaticPalGen from "./achromaticPalGen";
import brandPalGen from "./brandPalGen";
import gradientPalGen from "./gradientPalGen";
import seasonalPalGen from "./seasonalPalGen";
import uiPalettePalGen from "./uiPalettePalGen";
import dataVizPalettePalGen from "./dataVizPalettePalGen";
import designsystemPalGen from "./designsystemPalGen";
import flowerPalGen from "./flowerPalGen";

export default function paletteDecider(
  oklch,
  analogOptions,
  splitCompOptions,
  tetradicAngle,
  selectedPaletteType,
  compPalType,
  monoPalType,
  analogPalType,
  doubleSplitCompPalType,
  gradientPalType,
  seasonalPalType,
  dataVizPalType,
  flowerPalType
) {
  if (selectedPaletteType === "complementary") {
    return complementaryPalGen(oklch, compPalType);
  } else if (selectedPaletteType === "monochromatic") {
    return monochromaticPalGen(oklch, monoPalType);
  } else if (selectedPaletteType === "analogous") {
    return analogousPalGen(oklch, analogOptions, analogPalType);
  } else if (selectedPaletteType === "splitComplementary") {
    return splitCompPalGen(oklch, splitCompOptions);
  } else if (selectedPaletteType === "triadic") {
    return triadicPalGen(oklch);
  } else if (selectedPaletteType === "tetradic") {
    return tetradicPalGen(oklch, tetradicAngle);
  } else if (selectedPaletteType === "square") {
    return squarePalGen(oklch);
  } else if (selectedPaletteType === "accentedAnalogous") {
    return accentedAnalogousPalGen(oklch);
  } else if (selectedPaletteType === "compound") {
    return compoundPalGen(oklch);
  } else if (selectedPaletteType === "warmCool") {
    return warmCoolPalGen(oklch, true);
  } else if (selectedPaletteType === "chromaticNeutral") {
    return chromaticNeutralPalGen(oklch);
  } else if (selectedPaletteType === "doubleSplitComp") {
    return doubleSplitCompPalGen(oklch, doubleSplitCompPalType);
  } else if (selectedPaletteType === "nearComplementary") {
    return nearCompPalGen(oklch);
  } else if (selectedPaletteType === "clash") {
    return clashPalGen(oklch);
  } else if (selectedPaletteType === "achromatic") {
    return achromaticPalGen(oklch);
  } else if (selectedPaletteType === "brandPalette") {
    return brandPalGen(oklch);
  } else if (selectedPaletteType === "gradient") {
    return gradientPalGen(oklch, gradientPalType);
  } else if (selectedPaletteType === "seasonal") {
    return seasonalPalGen(oklch, seasonalPalType);
  } else if (selectedPaletteType === "uiPalette") {
    return uiPalettePalGen(oklch);
  } else if (selectedPaletteType === "dataVizPalette") {
    return dataVizPalettePalGen(oklch, dataVizPalType);
  } else if (selectedPaletteType === "designSystemPalette") {
    return designsystemPalGen(oklch);
  } else if (selectedPaletteType === "flowerPalette") {
    return flowerPalGen(oklch, flowerPalType);
  }
  return null;
}

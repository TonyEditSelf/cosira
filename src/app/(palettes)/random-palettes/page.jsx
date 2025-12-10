"use client";

import PaletteViewer from "../custom-palettes/_components/Pickers/components/PaletteViewer";

import { useEffect, useState } from "react";
import { useColorPaletteContext } from "../ColorContext";
import PageWrapper from "@/components/ui/PageWrapper";
import { paletteTypes } from "@/app/data/paletteTypes";

import analogousPalGen from "../custom-palettes/ColorPaletteUtils/analogousPalGen";
import accentedAnalogousPalGen from "../custom-palettes/ColorPaletteUtils/accentedAnalogousPalGen";
import brandPalGen from "../custom-palettes/ColorPaletteUtils/brandPalGen";
import chromaticNeutralPalGen from "../custom-palettes/ColorPaletteUtils/chromaticNeutralPalGen";
import clashPalGen from "../custom-palettes/ColorPaletteUtils/clashPalGen";
import complementaryPalGen from "../custom-palettes/ColorPaletteUtils/complementaryPalGen";
import dataVizPalettePalGen from "../custom-palettes/ColorPaletteUtils/dataVizPalettePalGen";
import designsystemPalGen from "../custom-palettes/ColorPaletteUtils/designsystemPalGen";
import doubleSplitCompPalGen from "../custom-palettes/ColorPaletteUtils/doubleSplitCompPalGen";
import gradientPalGen from "../custom-palettes/ColorPaletteUtils/gradientPalGen";
import monochromaticPalGen from "../custom-palettes/ColorPaletteUtils/monochromaticPalGen";
import nearCompPalGen from "../custom-palettes/ColorPaletteUtils/nearCompPalGen";
import seasonalPalGen from "../custom-palettes/ColorPaletteUtils/seasonalPalGen";
import splitCompPalGen from "../custom-palettes/ColorPaletteUtils/splitCompPalGen";
import squarePalGen from "../custom-palettes/ColorPaletteUtils/squarePalGen";
import tetradicPalGen from "../custom-palettes/ColorPaletteUtils/tetradicPalGen";
import triadicPalGen from "../custom-palettes/ColorPaletteUtils/triadicPalGen";
import uiPalettePalGen from "../custom-palettes/ColorPaletteUtils/uiPalettePalGen";
import warmCoolPalGen from "../custom-palettes/ColorPaletteUtils/warmCoolPalGen";

// Import other palette generators as needed
import chroma from "chroma-js";
import nearestColor from "nearest-color";
import * as allColors from "color-name-list";

import {
  oklchToCss,
  oklchToHex,
} from "../custom-palettes/_components/Pickers/components/colorutil";

import { colorNameUIrole } from "../custom-palettes/_components/Pickers/components/colorNameUIrole";
import { AnimatePresence, motion } from "framer-motion";

let colors = {};
allColors.colornames.forEach((color) => {
  colors[color.name] = color.hex;
});

const nearestColorName = nearestColor.from(colors);

// Define all available palette variations for each type
const paletteVariations = {
  analogous: [
    "classicCenteredAnalog",
    "classicLeftAnalog",
    "classicRightAnalog",
    "vintageCenteredAnalog",
    "vintageLeftAnalog",
    "vintageRightAnalog",
    "neutralCenteredAnalog",
    "neutralLeftAnalog",
    "neutralRightAnalog",
    "kidsBrightCentered",
    "kidsBrightLeft",
    "kidsBrightRight",
    "toyLikeCentered",
    "toyLikeLeft",
    "toyLikeRight",
    "pastelKidCentered",
    "pastelKidLeft",
    "pastelKidRight",
    "neoKidCentered",
    "neoKidLeft",
    "neoKidRight",
  ],
  accentedAnalogous: [],
  complementary: [
    "classicComp",
    "OpalComp",
    "BioLumComp",
    "AtmosphericComp",
    "vintageComp",
    "MCMComp",
    "retroComp",
    "moodyComp",
    "earthyComp",
    "neutralComp",
    "kidsComp",
    "pastelComp",
    "neonComp",
    "luxuriousComp",
  ],

  dataVizPalette: [
    "dataVizPalOne",
    "dataVizPalTwo",
    "dataVizPalThree",
    "dataVizPalFour",
    "dataVizPalFive",
    "dataVizPalSix",
  ],
  doubleSplitComp: ["leftDoubleSplitComp", "rightDoubleSplitComp"],
  // Add other palette types here as needed
};

export default function RandomPalettes() {
  const {
    palette,
    setPalette,
    oklch,
    setOklch,
    toggles,
    analogOptions,
    setAnalogPalType,
    setCompPalType,
    setFlowerPalType,
    setDataVizPalType,
    setDoubleSplitCompPalType,
  } = useColorPaletteContext();

  const [currentPaletteInfo, setCurrentPaletteInfo] = useState({
    type: "",
    variation: "",
    typeName: "",
  });

  // Function to generate random OKLCH color
  const generateRandomColor = () => {
    return {
      l: Math.random() * 0.7 + 0.3, // 0.3 to 1.0
      c: Math.random() * 0.3, // 0 to 0.3
      h: Math.random() * 360, // 0 to 360
      a: 1,
    };
  };

  // Function to generate random palette
  const generateRandomPalette = () => {
    // Generate random base color
    const randomColor = generateRandomColor();
    setOklch(randomColor);

    // Select random palette type
    const randomTypeIndex = Math.floor(Math.random() * paletteTypes.length);
    const selectedType = paletteTypes[randomTypeIndex];
    const paletteTypeValue = selectedType.value;

    let generatedPalette = null;
    let selectedVariation = null;

    // Check if this palette type has variations
    if (paletteVariations[paletteTypeValue]) {
      const variations = paletteVariations[paletteTypeValue];
      const randomVariationIndex = Math.floor(
        Math.random() * variations.length
      );
      selectedVariation = variations[randomVariationIndex];

      // Generate palette based on type and variation
      switch (paletteTypeValue) {
        case "analogous":
          setAnalogPalType(selectedVariation);
          generatedPalette = analogousPalGen(
            randomColor,
            analogOptions,
            selectedVariation
          );
          break;
        case "complementary":
          setCompPalType(selectedVariation);
          generatedPalette = complementaryPalGen(
            randomColor,
            selectedVariation
          );
          break;
        case "flowerPalette":
          setFlowerPalType(selectedVariation);
          generatedPalette = flowerPalGen(randomColor, selectedVariation);
          break;
        case "dataVizPalette":
          setDataVizPalType(selectedVariation);
          generatedPalette = dataVizPalettePalGen(
            randomColor,
            selectedVariation
          );
          break;
        case "doubleSplitComp":
          setDoubleSplitCompPalType(selectedVariation);
          generatedPalette = doubleSplitCompPalGen(
            randomColor,
            selectedVariation
          );
          break;
        // Add other cases for other palette types
        default:
          generatedPalette = [{ name: "Base", value: randomColor }];
      }
    } else {
      // For palette types without variations, generate basic palette
      generatedPalette = [{ name: "Base", value: randomColor }];
    }

    if (generatedPalette) {
      setPalette(generatedPalette);
      setCurrentPaletteInfo({
        type: paletteTypeValue,
        variation: selectedVariation || "Default",
        typeName: selectedType.label,
      });
    }
  };

  // Generate initial random palette on mount
  useEffect(() => {
    generateRandomPalette();
  }, []);

  return (
    <PageWrapper>
      <PaletteViewer />
    </PageWrapper>
  );
}

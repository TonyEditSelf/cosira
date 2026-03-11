"use client";

import { useEffect } from "react";
import { paletteVariations } from "@/app/data/paletteVarities";
import { randomPaletteTypes } from "@/app/data/randomPaletteTypes";
import analogousPalGen from "../custom-palettes/ColorPaletteUtils/analogousPalGen";
import complementaryPalGen from "../custom-palettes/ColorPaletteUtils/complementaryPalGen";
import flowerPalGen from "../custom-palettes/ColorPaletteUtils/flowerPalGen";
import dataVizPalettePalGen from "../custom-palettes/ColorPaletteUtils/dataVizPalettePalGen";
import doubleSplitCompPalGen from "../custom-palettes/ColorPaletteUtils/doubleSplitCompPalGen";
import monochromaticPalGen from "../custom-palettes/ColorPaletteUtils/monochromaticPalGen";
import triadicPalGen from "../custom-palettes/ColorPaletteUtils/triadicPalGen";
import tetradicPalGen from "../custom-palettes/ColorPaletteUtils/tetradicPalGen";
import splitCompPalGen from "../custom-palettes/ColorPaletteUtils/splitCompPalGen";

/**
 * Generates a random vivid OKLCH color.
 */
export function generateRandomColor() {
  return {
    l: Math.random() * 0.15 + 0.65, // 0.65–0.80 (bright & luminous)
    c: Math.random() * 0.12 + 0.18, // 0.18–0.30 (vivid & saturated)
    h: Math.random() * 360, // 0–360 (full hue range)
    a: 1,
  };
}

/**
 * Generates a full random palette given the current context setters.
 *
 * @param {object} setters - All the state setters needed from ColorContext
 */
export function generateRandomPalette({
  analogOptions,
  setOklch,
  setSelectedPaletteType,
  setAnalogPalType,
  setCompPalType,
  setFlowerPalType,
  setDataVizPalType,
  setDoubleSplitCompPalType,
  setPalette,
  setCurrentPaletteInfo,
}) {
  const randomColor = generateRandomColor();
  setOklch(randomColor);

  const randomTypeIndex = Math.floor(Math.random() * randomPaletteTypes.length);
  const selectedType = randomPaletteTypes[randomTypeIndex];
  const paletteTypeValue = selectedType.value;

  setSelectedPaletteType(paletteTypeValue);

  let generatedPalette = null;
  let selectedVariation = null;

  if (paletteVariations[paletteTypeValue]) {
    const variations = paletteVariations[paletteTypeValue];
    const randomVariationIndex = Math.floor(Math.random() * variations.length);
    selectedVariation = variations[randomVariationIndex];

    switch (paletteTypeValue) {
      case "analogous":
        setAnalogPalType(selectedVariation);
        generatedPalette = analogousPalGen(
          randomColor,
          analogOptions,
          selectedVariation,
        );
        break;
      case "complementary":
        setCompPalType(selectedVariation);
        generatedPalette = complementaryPalGen(randomColor, selectedVariation);
        break;
      case "flowerPalette":
        setFlowerPalType(selectedVariation);
        generatedPalette = flowerPalGen(randomColor, selectedVariation);
        break;
      case "dataVizPalette":
        setDataVizPalType(selectedVariation);
        generatedPalette = dataVizPalettePalGen(randomColor, selectedVariation);
        break;
      case "doubleSplitComp":
        setDoubleSplitCompPalType(selectedVariation);
        generatedPalette = doubleSplitCompPalGen(
          randomColor,
          selectedVariation,
        );
        break;
      default:
        generatedPalette = [{ name: "Base", value: randomColor }];
    }
  } else {
    switch (paletteTypeValue) {
      case "monochromatic":
        generatedPalette = monochromaticPalGen(randomColor);
        break;
      case "triadic":
        generatedPalette = triadicPalGen(randomColor);
        break;
      case "tetradic":
        generatedPalette = tetradicPalGen(randomColor);
        break;
      case "splitComplementary":
        generatedPalette = splitCompPalGen(randomColor);
        break;
      default:
        generatedPalette = [{ name: "Base", value: randomColor }];
    }
  }

  if (generatedPalette) {
    setPalette(generatedPalette);
    setCurrentPaletteInfo({
      type: paletteTypeValue,
      variation: selectedVariation || "Default",
      typeName: selectedType.label,
    });
  }
}

/**
 * Hook that wires up generateRandomPalette and fires it once on mount.
 *
 * @param {object} setters - State setters from ColorContext
 * @returns {{ generateRandomColor, generateRandomPalette: () => void }}
 */
export function useRandomPalette(setters) {
  const boundGenerate = () => generateRandomPalette(setters);

  // Fire once on mount to populate the initial palette
  useEffect(() => {
    boundGenerate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    generateRandomColor,
    generateRandomPalette: boundGenerate,
  };
}

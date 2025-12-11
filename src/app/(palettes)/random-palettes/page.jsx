"use client";

import PaletteViewer from "../custom-palettes/_components/Pickers/components/PaletteViewer";

import { useEffect, useState } from "react";
import { useColorPaletteContext } from "../ColorContext";
import PageWrapper from "@/components/ui/PageWrapper";

// Import other palette generators as needed

import nearestColor from "nearest-color";
import * as allColors from "color-name-list";

let colors = {};
allColors.colornames.forEach((color) => {
  colors[color.name] = color.hex;
});

const nearestColorName = nearestColor.from(colors);

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
    generateRandomColor,
    generateRandomPalette,
  } = useColorPaletteContext();

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

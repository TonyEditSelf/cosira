"use client";

import { createContext, useContext, useState, useRef, useEffect } from "react";
import { parseColor } from "react-aria-components";
import paletteDecider from "./custom-palettes/ColorPaletteUtils/paletteDecider";
import { formatHex8, converter } from "culori";

export const ColorPaletteContext = createContext(null);

export function ColorPaletteContextProvider({ children }) {
  const [showHexColorPicker, setShowHexColorPicker] = useState(true);
  const [showAdvancedPickers, setShowAdvancedPickers] = useState(false);
  const pickerRef = useRef(null);

  const [leftPaletteAdjusterOpen, setLeftPaletteAdjusterOpen] = useState(false);
  const [myColorPickerOpen, setMyColorPickerOpen] = useState(false);
  const [selectedPaletteType, setSelectedPaletteType] =
    useState("complementary");
  const [source, setSource] = useState(0);

  const values = {
    source,
    setSource,

    pickerRef,
    showHexColorPicker,
    setShowHexColorPicker,
    showAdvancedPickers,
    setShowAdvancedPickers,
    leftPaletteAdjusterOpen,
    setLeftPaletteAdjusterOpen,
    myColorPickerOpen,
    setMyColorPickerOpen,
    selectedPaletteType,
    setSelectedPaletteType,
  };

  return (
    <ColorPaletteContext.Provider value={values}>
      {children}
    </ColorPaletteContext.Provider>
  );
}

export function useColorPaletteContext() {
  const ctx = useContext(ColorPaletteContext);

  if (!ctx) {
    throw new Error(
      "To use ColorPaletteContextProvider, component must be wrapped in corresponding provider"
    );
  }
  return ctx;
}

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { parseColor } from "react-aria-components";
// import { paletteTypes } from "@/app/data/paletteTypes";
import paletteDecider from "./custom-palettes/ColorPaletteUtils/paletteDecider";

export const ColorPaletteContext = createContext(null);

export function ColorPaletteContextProvider({ children }) {
  const [showHexColorPicker, setShowHexColorPicker] = useState(true);
  const [showAdvancedPickers, setShowAdvancedPickers] = useState(false);
  const pickerRef = useRef(null);
  const [hexColor, setHexColor] = useState("#e60073");
  const [ariaColor, setAriaColor] = useState(
    parseColor("hsla(330, 100%, 45.1%, 1)")
  );
  const handleAriaColorChange = (newAriaColor) => {
    const hslaColor = parseColor(newAriaColor.toString("hsla"));
    setAriaColor(hslaColor);

    const nexHex = newAriaColor.toString("hex");
    setHexColor(nexHex);
  };

  const handleHexColorChange = (newHexColor) => {
    setHexColor(newHexColor);

    const hslaColor = parseColor(parseColor(newHexColor).toString("hsla"));
    setAriaColor(hslaColor);
  };

  const [leftPaletteAdjusterOpen, setLeftPaletteAdjusterOpen] = useState(false);

  const [myColorPickerOpen, setMyColorPickerOpen] = useState(false);

  const [selectedPaletteType, setSelectedPaletteType] =
    useState("complementary");

  useEffect(() => {
    // expose the state to window for debugging
    window.selectedPaletteType = selectedPaletteType;
    window.setSelectedPaletteType = setSelectedPaletteType;
    console.log("Selected Palette Type:", selectedPaletteType);
  }, [selectedPaletteType]);

  const palette = useMemo(() => {
    return paletteDecider(ariaColor, selectedPaletteType);
  }, [ariaColor, selectedPaletteType]);

  const values = {
    hexColor,
    setHexColor,
    ariaColor,
    setAriaColor,
    pickerRef,
    showHexColorPicker,
    setShowHexColorPicker,
    showAdvancedPickers,
    setShowAdvancedPickers,
    handleAriaColorChange,
    handleHexColorChange,
    leftPaletteAdjusterOpen,
    setLeftPaletteAdjusterOpen,
    myColorPickerOpen,
    setMyColorPickerOpen,
    selectedPaletteType,
    setSelectedPaletteType,
    palette,
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

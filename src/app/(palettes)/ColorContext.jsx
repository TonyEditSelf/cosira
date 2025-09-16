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
  let [palette, setPalette] = useState();
  const [source, setSource] = useState(0);

  let parsedColorObject = parseColor("#e60073FF");
  let hslaColorObject = parsedColorObject.toFormat("hsla");

  const [hslaColorObjectState, setHslaColorObjectState] =
    useState(hslaColorObject);

  const [hexColorState, setHexColorState] = useState("#e60073FF");

  function handleHexcColorChange(newHexColor) {
    setHexColorState(newHexColor);
    let parsedColorObject = parseColor(newHexColor);
    let hslaColorObject = parsedColorObject.toFormat("hsla");

    setHslaColorObjectState(hslaColorObject);
  }

  function handleHslaColorChange(newAriaColor) {
    setHslaColorObjectState(newAriaColor);
    const ariaHSLString = `hsla(${newAriaColor.hue}, ${newAriaColor.saturation}%, ${newAriaColor.lightness}%, ${newAriaColor.alpha})`;

    const colorObj = parseColor(ariaHSLString);
    const hexString = colorObj.toString("hexa");
    setHexColorState(hexString);
  }

  useEffect(() => {
    const pal = paletteDecider(hexColorState, selectedPaletteType, source);
    setPalette(pal);
  }, [hexColorState, selectedPaletteType]);

  const toHsl = converter("hsl");

  function updateOklchPalette(index, channel, newValue, source) {
    setPalette((prev) => {
      return prev.map((color, i) => {
        if (i === index) {
          const newCol = { ...color, [channel]: parseFloat(newValue) };

          const newhexval = formatHex8(newCol);

          setSource(source);
          setHexColorState(newhexval);

          let parsedColorObject = parseColor(newhexval);
          let hslaColorObject = parsedColorObject.toFormat("hsla");
          setHslaColorObjectState(hslaColorObject);

          return newCol;
        }
        return color;
      });
    });
  }

  const values = {
    source,
    setSource,
    updateOklchPalette,
    palette,
    setPalette,
    hexColorState,
    handleHexcColorChange,
    handleHslaColorChange,
    hslaColorObjectState,
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

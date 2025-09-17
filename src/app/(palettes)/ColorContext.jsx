"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";

import {
  oklchToRgb,
  oklchToCss,
} from "./custom-palettes/_components/Pickers/components/colorutil";

import { parseColor } from "react-aria-components";
import paletteDecider from "./custom-palettes/ColorPaletteUtils/paletteDecider";
import { formatHex8, converter } from "culori";

export const ColorPaletteContext = createContext(null);

export function ColorPaletteContextProvider({ children }) {
  const [oklch, setOklch] = useState({
    l: 0.597, // lightness (0-1) 0.7
    c: 0.240854, // chroma (0-0.4) 0.15
    h: 2.4025, // hue (0-360) 180
  });
  const [rgbcopied, setRgbCopied] = useState(false);
  const [csscopied, setCssCopied] = useState(false);

  const handleColorChange = useCallback((newValues) => {
    setOklch((prev) => ({ ...prev, ...newValues }));
  }, []);

  const handleCopy = async (color) => {
    if (color === "css") {
      const colorString = `oklch(${(oklch.l * 100).toFixed(
        1
      )}% ${oklch.c.toFixed(3)} ${oklch.h.toFixed(1)}deg)`;
      await navigator.clipboard.writeText(colorString);
      await navigator.clipboard.writeText(cssColor);
      setCssCopied(true);
    } else if (color === "rgb") {
      await navigator.clipboard.writeText(rgbColor);
      setRgbCopied(true);
    }

    setTimeout(() => setCssCopied(false), 2000);
    setTimeout(() => setRgbCopied(false), 2000);
  };

  const [r, g, b] = oklchToRgb(oklch.l, oklch.c, oklch.h);
  const cssColor = oklchToCss(oklch.l, oklch.c, oklch.h);
  const rgbColor = `rgb(${Math.round(r * 255)}, ${Math.round(
    g * 255
  )}, ${Math.round(b * 255)})`;
  const hexColor = `#${Math.round(r * 255)
    .toString(16)
    .padStart(2, "0")}${Math.round(g * 255)
    .toString(16)
    .padStart(2, "0")}${Math.round(b * 255)
    .toString(16)
    .padStart(2, "0")}`;

  const [myColorPickerOpen, setMyColorPickerOpen] = useState(false);
  const pickerRef = useRef(null);

  const [leftPaletteAdjusterOpen, setLeftPaletteAdjusterOpen] = useState(false);

  const [selectedPaletteType, setSelectedPaletteType] =
    useState("complementary");
  const [source, setSource] = useState(0);

  const values = {
    source,
    setSource,
    oklch,
    setOklch,
    cssColor,
    rgbColor,
    hexColor,
    rgbcopied,
    csscopied,
    handleColorChange,
    handleCopy,
    pickerRef,
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

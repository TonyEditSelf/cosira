"use client";

import { createContext, useContext, useState } from "react";
import { parseColor } from "react-aria-components";

export const ColorPaletteContext = createContext(null);

export function ColorPaletteContextProvider({ children }) {
  const [hexColor, setHexColor] = useState("#e60073");
  const [ariaColor, setAriaColor] = useState(
    parseColor("hsla(330, 100%, 45.1%, 1)")
  );

  const values = {
    hexColor,
    setHexColor,
    ariaColor,
    setAriaColor,
  };

  return (
    <ColorPaletteContext.Provider value={values}>
      {children}
    </ColorPaletteContext.Provider>
  );
}

export function useColorPaletteContextProvider() {
  const ctx = useContext(ColorPaletteContext);

  if (!ctx) {
    throw new Error(
      "To use ColorPaletteContextProvider, component must be wrapped in corresponding provider"
    );
  }
  return ctx;
}

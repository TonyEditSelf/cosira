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
  oklchToHex,
} from "./custom-palettes/_components/Pickers/components/colorutil";

import paletteDecider from "./custom-palettes/ColorPaletteUtils/paletteDecider";

export const ColorPaletteContext = createContext(null);

export function ColorPaletteContextProvider({ children }) {
  const [oklch, setOklch] = useState({
    l: 0.597,
    c: 0.240854,
    h: 2.4025,
    a: 1,
  });

  const [options, setOptions] = useState({
    darkOffset: 0.15,
    lightOffset: 0.15,
    neutralLightOffSet: 0.1,
    neutralChromaOffset: 0.08,
    analogousStep1: -20,
    analogousStep2: 20,
    analogousStep3: 40,
  });
  const [rgbcopied, setRgbCopied] = useState(false);
  const [csscopied, setCssCopied] = useState(false);

  const [toggles, setToggles] = useState({
    colorNames: true,
    colorTypes: false,
    makeBaseOn: false,
    hexOn: false,
    hueOn: true,
    lightOn: true,
    chromaOn: true,
    alphaOn: false,
    whiteContrastOn: false,
    blackContrastOn: false,
  });

  const handleToggle = (key) => {
    setToggles((prev) => {
      return { ...prev, [key]: !prev[key] };
    });
  };

  const handleColorChange = useCallback((newValues) => {
    setOklch((prev) => ({ ...prev, ...newValues }));
  }, []);

  const handleOptionsChange = useCallback((value, id) => {
    setOptions((prev) => ({ ...prev, [id]: value }));
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
  const cssColor = oklchToCss(oklch.l, oklch.c, oklch.h, oklch.a);
  const alpha = oklch?.a ?? 1;

  const rgbColor = `rgba(${Math.round(r * 255)}, ${Math.round(
    g * 255
  )}, ${Math.round(b * 255)}, ${alpha.toFixed(2)})`;
  const hexColor = oklchToHex(oklch.l, oklch.c, oklch.h, oklch.a);

  const [myColorPickerOpen, setMyColorPickerOpen] = useState(false);
  const pickerRef = useRef(null);

  const [leftPaletteAdjusterOpen, setLeftPaletteAdjusterOpen] = useState(false);
  const [cellObjecttoEdit, setCellObjecttoEdit] = useState({});
  const [cellObjectIndex, SetCellObjectIndex] = useState();
  const [editCell, setEditCell] = useState(false);
  const [editPalette, setEditPalette] = useState(false);

  const [selectedPaletteType, setSelectedPaletteType] =
    useState("splitComplementary");
  const [palette, setPalette] = useState([]);

  useEffect(() => {
    const pal = paletteDecider(oklch, options, selectedPaletteType);

    setPalette(pal);
  }, [oklch, options, selectedPaletteType]);

  const values = {
    toggles,
    handleToggle,
    options,
    setOptions,
    cellObjectIndex,
    SetCellObjectIndex,
    editPalette,
    setEditPalette,
    editCell,
    setEditCell,
    cellObjecttoEdit,
    setCellObjecttoEdit,
    palette,
    oklch,
    setOklch,
    cssColor,
    rgbColor,
    hexColor,
    rgbcopied,
    csscopied,
    handleColorChange,
    handleOptionsChange,
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

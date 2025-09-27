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

  const [analogOptions, setAnalogOptions] = useState({
    analogousAngle1: -20,
    analogousAngle2: 20,
    analogousAngle3: 40,
  });

  const [splitCompOptions, setSplitCompOptions] = useState({
    splitCompAngle1: -30,
    splitCompAngle2: 30,
  });

  const [rgbcopied, setRgbCopied] = useState(false);
  const [csscopied, setCssCopied] = useState(false);

  const [toggles, setToggles] = useState({
    colorNames: true,
    colorTypes: true,
    makeBaseOn: false,
    hexOn: true,
    hueOn: true,
    lightOn: false,
    chromaOn: false,
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

  const handleAnalogOptionsChange = useCallback((value, id) => {
    setAnalogOptions((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleSplitCompOptionsChange = useCallback((value, id) => {
    setSplitCompOptions((prev) => ({ ...prev, [id]: value }));
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

  const [shadesTintsTonesOn, setShadesTintsTonesOn] = useState(false);
  const [shadesTintsTonesIndex, setShadesTintsTonesIndex] = useState(null);
  const [colorForShadesTintsTones, setColorForShadesTintsTones] = useState();
  const [allShadesTintsTones, setAllShadesTintsTones] = useState();
  const [pickedShadesOrTones, setPickedShadesOrTones] = useState(null);

  const shadesTintsTonesFunction = (obj, typeShadeOrTint) => {
    if (typeShadeOrTint === "tones") {
      const newToneObj = { ...obj, c: 0 };
      const middleTone = obj.c;
      let tones = [];

      for (let i = 0.01; i < middleTone; i += 0.01) {
        let newObj = { ...newToneObj, c: newToneObj.c + i };
        tones.push(newObj);
      }

      tones.push(obj);

      for (let i = middleTone + 0.01; i < 0.4; i += 0.01) {
        let newObj = { ...newToneObj, c: newToneObj.c + i };
        tones.push(newObj);
      }

      setAllShadesTintsTones(tones);
    } else if (typeShadeOrTint === "shadesTints") {
      const newShadeObj = { ...obj, l: 0 };
      const middleShade = obj.l;
      let shadesAndTints = [];

      for (let i = 0.03; i < middleShade; i += 0.03) {
        let newObj = { ...newShadeObj, l: newShadeObj.l + i };
        shadesAndTints.push(newObj);
      }

      shadesAndTints.push(obj);

      for (let i = middleShade + 0.03; i < 1; i += 0.03) {
        let newObj = { ...newShadeObj, l: newShadeObj.l + i };
        shadesAndTints.push(newObj);
      }

      setAllShadesTintsTones(shadesAndTints);
    }
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

  const [selectedPaletteType, setSelectedPaletteType] = useState("triadic");
  const [palette, setPalette] = useState([]);

  useEffect(() => {
    setShadesTintsTonesIndex(null);
    const pal = paletteDecider(
      oklch,
      analogOptions,
      splitCompOptions,
      selectedPaletteType
    );
    setPalette(pal);
  }, [oklch, analogOptions, splitCompOptions, selectedPaletteType]);

  const values = {
    toggles,
    handleToggle,
    analogOptions,
    setAnalogOptions,
    palette,
    setPalette,
    oklch,
    setOklch,
    cssColor,
    rgbColor,
    hexColor,
    rgbcopied,
    csscopied,
    handleColorChange,
    handleAnalogOptionsChange,
    handleCopy,
    pickerRef,
    leftPaletteAdjusterOpen,
    setLeftPaletteAdjusterOpen,
    myColorPickerOpen,
    setMyColorPickerOpen,
    selectedPaletteType,
    setSelectedPaletteType,
    shadesTintsTonesOn,
    setShadesTintsTonesOn,
    shadesTintsTonesIndex,
    setShadesTintsTonesIndex,
    setColorForShadesTintsTones,
    colorForShadesTintsTones,
    allShadesTintsTones,
    setAllShadesTintsTones,
    shadesTintsTonesFunction,
    pickedShadesOrTones,
    setPickedShadesOrTones,
    handleSplitCompOptionsChange,
    splitCompOptions,
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

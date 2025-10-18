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
    analogousAngle1: -30,
    analogousAngle2: 30,
    analogousAngle3: 60,
  });

  const [splitCompOptions, setSplitCompOptions] = useState({
    splitCompAngle1: -30,
    splitCompAngle2: 30,
  });

  const [tetradicAngle, setTetradicAngle] = useState(90);

  const [rgbcopied, setRgbCopied] = useState(false);
  const [csscopied, setCssCopied] = useState(false);

  const [toggles, setToggles] = useState({
    colorNames: false,
    colorTypes: true,
    makeBaseOn: false,
    role: false,
    primitiveName: false,
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

  const handleAnalogOptionsChange = useCallback((value, id) => {
    setAnalogOptions((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleSplitCompAngleChange = useCallback((value, id) => {
    setSplitCompOptions((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleTetradicAngleChange = useCallback((value) => {
    setTetradicAngle(value);
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
  const [shadesTintsTonesValues, setShadesTintsTonesValues] = useState();

  const shadesTintsTonesFunction = (obj, typeShadeOrTint) => {
    if (typeShadeOrTint === "tones") {
      const newToneObj = { ...obj, c: 0 };
      const middleTone = obj.c;
      let tones = [];
      let iValues = [];

      for (let i = 0.01; i < middleTone; i += 0.01) {
        let newObj = { ...newToneObj, c: newToneObj.c + i };
        tones.push(newObj);
        iValues.push(i);
      }

      tones.push(obj);
      iValues.push(middleTone);

      for (let i = middleTone + 0.01; i <= 0.4; i += 0.01) {
        let newObj = { ...newToneObj, c: newToneObj.c + i };
        tones.push(newObj);
        iValues.push(i);
      }

      setAllShadesTintsTones(tones);
      setShadesTintsTonesValues(iValues);
    } else if (typeShadeOrTint === "shadesTints") {
      const newShadeObj = { ...obj, l: 0 };
      const middleShade = obj.l;
      let shadesAndTints = [];
      let iValues = [];

      for (let i = 0.01; i < middleShade; i += 0.01) {
        let newObj = { ...newShadeObj, l: newShadeObj.l + i };
        shadesAndTints.push(newObj);
        iValues.push(i);
      }

      shadesAndTints.push(obj);
      iValues.push(middleShade);

      for (let i = middleShade + 0.01; i <= 1; i += 0.01) {
        let newObj = { ...newShadeObj, l: newShadeObj.l + i };
        shadesAndTints.push(newObj);
        iValues.push(i);
      }
      setAllShadesTintsTones(shadesAndTints);
      setShadesTintsTonesValues(iValues);
    }
  };

  const [vintagePalType, setVintagePalType] = useState("vintageComp");

  const [neutralPalType, setNeutralPalType] = useState("neutralComp");

  const [kidsPalType, setKidsPalType] = useState("kidsMono");

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
  const [showHidePanelOpen, setShowHidePanelOpen] = useState(false);

  const [selectedPaletteType, setSelectedPaletteType] =
    useState("complementary");

  const [compPalType, setCompPalType] = useState("classicComp");

  const [palette, setPalette] = useState([]);

  useEffect(() => {
    setShadesTintsTonesIndex(null);

    if (
      selectedPaletteType !== "vintage" &&
      selectedPaletteType !== "neutral" &&
      selectedPaletteType !== "kidFriendly"
    ) {
      setKidsPalType(null);
      const pal = paletteDecider(
        oklch,
        analogOptions,
        splitCompOptions,
        tetradicAngle,
        selectedPaletteType
      );
      setPalette(pal);
    } else {
      const pal = paletteDecider(
        oklch,
        analogOptions,
        splitCompOptions,
        tetradicAngle,
        selectedPaletteType,
        vintagePalType,
        neutralPalType,
        kidsPalType
      );
      setPalette(pal);
    }
  }, [
    oklch,
    analogOptions,
    splitCompOptions,
    tetradicAngle,
    selectedPaletteType,
    vintagePalType,
    neutralPalType,
    kidsPalType,
  ]);

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
    handleSplitCompAngleChange,
    splitCompOptions,
    tetradicAngle,
    handleTetradicAngleChange,
    showHidePanelOpen,
    setShowHidePanelOpen,
    vintagePalType,
    setVintagePalType,
    neutralPalType,
    setNeutralPalType,
    kidsPalType,
    setKidsPalType,
    shadesTintsTonesValues,
    compPalType,
    setCompPalType,
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

"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  use,
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
    analogousAngle1: -35,
    analogousAngle2: 35,
  });

  const [splitCompOptions, setSplitCompOptions] = useState({
    splitCompAngle1: -30,
    splitCompAngle2: 30,
  });

  const [tetradicAngle, setTetradicAngle] = useState(90);

  const [rgbcopied, setRgbCopied] = useState(false);
  const [csscopied, setCssCopied] = useState(false);

  const [toggles, setToggles] = useState({
    showAll: false,
    showNone: false,
    colorNames: true,
    colorTypes: false,
    makeBaseOn: false,
    // role: false,
    primitiveName: false,
    hexOn: false,
    hueOn: false,
    lightOn: false,
    chromaOn: false,
    alphaOn: false,
    whiteContrastOn: false,
    blackContrastOn: false,
    shades: false,
    tints: false,
    addColor: true,
  });

  const toggleKeys = [
    "colorNames",
    "colorTypes",
    "makeBaseOn",
    "primitiveName",
    "hexOn",
    "hueOn",
    "lightOn",
    "chromaOn",
    "alphaOn",
    "whiteContrastOn",
    "blackContrastOn",
    "shades",
    "tints",
    "addColor",
  ];

  const handleToggle = (key) => {
    setToggles((prev) => {
      // ---- 1. Handle SHOW ALL ----------------------------------------
      if (key === "showAll") {
        const newValue = !prev.showAll;

        if (newValue === true) {
          // showAll → true = turn everything on, showNone = false
          const newState = { ...prev, showAll: true, showNone: false };
          toggleKeys.forEach((k) => (newState[k] = true));
          return newState;
        } else {
          // toggling off showAll just disables showAll
          return { ...prev, showAll: false };
        }
      }

      // ---- 2. Handle SHOW NONE ---------------------------------------
      if (key === "showNone") {
        const newValue = !prev.showNone;

        if (newValue === true) {
          // showNone → true = turn everything off, showAll = false
          const newState = { ...prev, showNone: true, showAll: false };
          toggleKeys.forEach((k) => (newState[k] = false));
          return newState;
        } else {
          return { ...prev, showNone: false };
        }
      }

      // ---- 3. Any normal toggle → uncheck showAll and showNone -------
      return {
        ...prev,
        [key]: !prev[key],
        showAll: false,
        showNone: false,
      };
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
  const [databaseOpen, setDatabaseOpen] = useState(false);

  const [sliderLightValue, setSliderLightValue] = useState(0);
  const [sliderChromaValue, setSliderChromaValue] = useState(0);

  const [selectedPaletteType, setSelectedPaletteType] =
    useState("monochromatic");

  const [compPalType, setCompPalType] = useState("classicComp");
  const [monoPalType, setMonoPalType] = useState("classicMono");
  const [analogPalType, setAnalogPalType] = useState("classicCenteredAnalog");
  const [doubleSplitCompPalType, setDoubleSplitCompPalType] = useState(
    "leftDoubleSplitComp"
  );
  const [gradientPalType, setGradientPalType] = useState("leftGradient");
  const [seasonalPalType, setSeasonalPalType] = useState("seasonalCombined");
  const [dataVizPalType, setDataVizPalType] = useState("dataVizPalOne");
  const [flowerPalType, setFlowerPalType] = useState("sunflower");

  const [palette, setPalette] = useState([]);
  const [duplicatePalette, setDuplicatePalette] = useState([]);
  const [duplicatePaletteType, setDuplicatePaletteType] = useState("");
  const [paletteHistory, setPaletteHistory] = useState([]);
  const [paletteHistoryCounter, setPaletteHistoryCounter] = useState(-2);
  const [historyNavigation, setHistoryNavigation] = useState(false);
  const [hoverOn, setHoverOn] = useState(false);

  const [favColors, setFavColors] = useState([]);
  const [favPalette, setFavPalette] = useState([]);

  // Load once on mount (browser only)
  useEffect(() => {
    try {
      const savedFavColors =
        typeof window !== "undefined" && localStorage.getItem("favColors");
      const savedFavPalette =
        typeof window !== "undefined" && localStorage.getItem("favPalette");

      if (savedFavColors) setFavColors(JSON.parse(savedFavColors));
      if (savedFavPalette) setFavPalette(JSON.parse(savedFavPalette));
    } catch (err) {
      console.error("Failed to read from localStorage:", err);
    }
  }, []);

  // Persist favColors
  useEffect(() => {
    try {
      localStorage.setItem("favColors", JSON.stringify(favColors));
    } catch (err) {
      console.error("Failed to write favColors to localStorage:", err);
    }
  }, [favColors]);

  // Persist favPalette
  useEffect(() => {
    try {
      localStorage.setItem("favPalette", JSON.stringify(favPalette));
    } catch (err) {
      console.error("Failed to write favPalette to localStorage:", err);
    }
  }, [favPalette]);

  useEffect(() => {
    setPaletteHistory((prevHistory) => {
      if (palette.length > 0) {
        const lastEntry = prevHistory[prevHistory.length - 1];

        if (JSON.stringify(lastEntry) !== JSON.stringify(palette)) {
          const historyObject = {
            palette: palette,
            type: selectedPaletteType,
          };

          return [...prevHistory, historyObject];
        }
      }
      return prevHistory;
    });
    setPaletteHistoryCounter((prev) => prev + 1);
  }, [duplicatePalette]);

  // useEffect(() => {
  //   console.log("PaletteHistory: ", paletteHistory);
  //   console.log("PaletteHistoryCounter: ", paletteHistoryCounter);
  //   console.log("historyLength", paletteHistory.length);
  // }, [paletteHistoryCounter, paletteHistory]);

  useEffect(() => {
    setSliderChromaValue(0);
    setSliderLightValue(0);
  }, [compPalType, monoPalType]);

  useEffect(() => {
    if (selectedPaletteType === "flowerPalette") {
      setOklch({ l: 0.88, c: 0.25, h: 100, a: 1 });
    }
  }, [selectedPaletteType]);

  useEffect(() => {
    setShadesTintsTonesIndex(null);
    setHistoryNavigation(false);

    const pal = paletteDecider(
      oklch,
      analogOptions,
      splitCompOptions,
      tetradicAngle,
      selectedPaletteType,
      compPalType,
      monoPalType,
      analogPalType,
      doubleSplitCompPalType,
      gradientPalType,
      seasonalPalType,
      dataVizPalType,
      flowerPalType
    );
    setPalette(pal);

    if (
      selectedPaletteType === "analogous" &&
      (analogOptions.analogousAngle2 !== 40 ||
        analogOptions.analogousAngle1 !== -40)
    ) {
      setDuplicatePalette(null);
    } else {
      setDuplicatePalette(pal);
    }
  }, [
    oklch,
    // analogOptions,
    splitCompOptions,
    tetradicAngle,
    selectedPaletteType,
  ]);

  const values = {
    toggles,
    handleToggle,
    analogOptions,
    setAnalogOptions,
    palette,
    setPalette,
    duplicatePalette,
    setDuplicatePalette,
    paletteHistory,
    setPaletteHistory,
    paletteHistoryCounter,
    setPaletteHistoryCounter,
    duplicatePaletteType,
    setDuplicatePaletteType,
    historyNavigation,
    setHistoryNavigation,
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
    databaseOpen,
    setDatabaseOpen,
    shadesTintsTonesValues,
    compPalType,
    setCompPalType,
    monoPalType,
    setMonoPalType,
    analogPalType,
    setAnalogPalType,
    doubleSplitCompPalType,
    setDoubleSplitCompPalType,
    gradientPalType,
    setGradientPalType,
    seasonalPalType,
    setSeasonalPalType,
    dataVizPalType,
    setDataVizPalType,
    flowerPalType,
    setFlowerPalType,
    sliderLightValue,
    setSliderLightValue,
    sliderChromaValue,
    setSliderChromaValue,
    hoverOn,
    setHoverOn,
    favColors,
    setFavColors,
    favPalette,
    setFavPalette,
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

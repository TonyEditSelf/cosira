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

import extractBasesForExpander from "./custom-palettes/ColorPaletteUtils/extractBasesForExpander";

import {
  oklchToRgb,
  oklchToCss,
  oklchToHex,
} from "./custom-palettes/_components/Pickers/components/colorutil";

import paletteDecider from "./custom-palettes/ColorPaletteUtils/paletteDecider";
import {
  useRandomPalette,
  generateRandomColor,
} from "./random-palettes/randompalette";
// import { paletteTypes } from "../data/paletteTypes";
// import accentedAnalogousPalGen from "./custom-palettes/ColorPaletteUtils/accentedAnalogousPalGen";
// import achromaticPalGen from "./custom-palettes/ColorPaletteUtils/achromaticPalGen";
// import brandPalGen from "./custom-palettes/ColorPaletteUtils/brandPalGen";
// import chromaticNeutralPalGen from "./custom-palettes/ColorPaletteUtils/chromaticNeutralPalGen";
// import clashPalGen from "./custom-palettes/ColorPaletteUtils/clashPalGen";
// import compoundPalGen from "./custom-palettes/ColorPaletteUtils/compoundPalGen";
// import designsystemPalGen from "./custom-palettes/ColorPaletteUtils/designsystemPalGen";
// import nearCompPalGen from "./custom-palettes/ColorPaletteUtils/nearCompPalGen";
// import seasonalPalGen from "./custom-palettes/ColorPaletteUtils/seasonalPalGen";
// import squarePalGen from "./custom-palettes/ColorPaletteUtils/squarePalGen";
// import uiPalettePalGen from "./custom-palettes/ColorPaletteUtils/uiPalettePalGen";
// import warmCoolPalGen from "./custom-palettes/ColorPaletteUtils/warmCoolPalGen";

export const ColorPaletteContext = createContext(null);

export function ColorPaletteContextProvider({ children }) {
  const [oklch, setOklch] = useState({
    l: 0.597,
    c: 0.240854,
    h: 2.4025,
    a: 1,
  });

  const [currentPaletteInfo, setCurrentPaletteInfo] = useState({
    type: "",
    variation: "",
    typeName: "",
  });

  const [analogOptions, setAnalogOptions] = useState({
    analogousAngle1: null, // null = use palette-specific defaults
    analogousAngle2: null,
  });

  // When user changes palette type, reset angles to null
  const handlePaletteTypeChange = (newType) => {
    setAnalogPalType(newType);
    setAnalogOptions({
      analogousAngle1: null,
      analogousAngle2: null,
    });
  };

  // Only set angles when user actually moves the sliders
  const handleAngleChange = (newAngle1, newAngle2) => {
    setAnalogOptions({
      analogousAngle1: newAngle1,
      analogousAngle2: newAngle2,
    });
  };

  const [expanderBases, setExpanderBases] = useState(null);
  const [expanderThemeProfile, setExpanderThemeProfile] = useState(null);

  // Helper to get current effective angles (for display in UI)
  const getCurrentAngles = () => {
    const baseAngle = getBaseAngles(analogPalType);
    return {
      angle1: analogOptions.analogousAngle1 ?? -baseAngle,
      angle2: analogOptions.analogousAngle2 ?? baseAngle,
    };
  };

  const [splitCompOptions, setSplitCompOptions] = useState({
    splitCompAngle1: -30,
    splitCompAngle2: 30,
  });

  const [tetradicAngle, setTetradicAngle] = useState(90);

  const [tetradicForm, setTetradicForm] = useState("squareTetra");

  const [rgbcopied, setRgbCopied] = useState(false);
  const [csscopied, setCssCopied] = useState(false);

  const [toggles, setToggles] = useState({
    showAll: false,
    showNone: false,
    colorNames: true,
    colorTypes: true,
    makeBaseOn: false,
    primitiveName: false,
    hexOn: false,
    hueOn: true,
    lightOn: true,
    chromaOn: true,
    alphaOn: false,
    whiteContrastOn: false,
    blackContrastOn: false,
    shades: true,
    tints: true,
    addColor: false,
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
        1,
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
    g * 255,
  )}, ${Math.round(b * 255)}, ${alpha.toFixed(2)})`;
  const hexColor = oklchToHex(oklch.l, oklch.c, oklch.h, oklch.a);

  const [myColorPickerOpen, setMyColorPickerOpen] = useState(false);
  const pickerRef = useRef(null);
  const paletteHistoryCounterRef = useRef(-2);
  const historyNavigationRef = useRef(false);

  const [leftPaletteAdjusterOpen, setLeftPaletteAdjusterOpen] = useState(false);
  const [showHidePanelOpen, setShowHidePanelOpen] = useState(false);
  const [databaseOpen, setDatabaseOpen] = useState(false);

  const [sliderLightValue, setSliderLightValue] = useState(0);
  const [sliderChromaValue, setSliderChromaValue] = useState(0);

  const [selectedPaletteType, setSelectedPaletteType] = useState("");

  const [compPalType, setCompPalType] = useState("classic");

  const [monoPalType, setMonoPalType] = useState("classicMono");
  const [monoColorCount, setMonoColorCount] = useState(8);
  const [monoHueDrift, setMonoHueDrift] = useState(null);

  const [analogPalType, setAnalogPalType] = useState("classicCenteredAnalog");
  const [doubleSplitCompPalType, setDoubleSplitCompPalType] =
    useState("balanced");

  const [triadicPalType, setTriadicPalType] = useState("classicTriad");
  const [tetradicPalType, setTetradicPalType] = useState("classicTetra");
  const [seasonalPalType, setSeasonalPalType] = useState("seasonalCombined");
  const [dataVizPalType, setDataVizPalType] = useState("dataVizPalOne");
  const [flowerPalType, setFlowerPalType] = useState("sunflower");
  const [uiBrandPalType, setUiBrandPalType] = useState("light");
  const [arcPalType, setArcPalType] = useState("hues");
  const [achroPalType, setAchroPalType] = useState("tinted");
  const [chromaticNeutralPalType, setChromaticNeutralPalType] =
    useState("standard");
  const [splitCompPalType, setSplitCompPalType] = useState("standard");

  const [nearCompPalType, setNearCompPalType] = useState("warm-lean");

  const [paletteState, setPaletteState] = useState([]);

  const setPalette = useCallback((newPalette) => {
    if (newPalette !== undefined && newPalette !== null) {
      setPaletteState(newPalette);
    } else {
      console.error("Attempted to set palette to undefined/null - blocked");
      console.trace();
    }
  }, []);

  const palette = paletteState;

  const prepareForExpander = useCallback(() => {
    const { bases, themeProfile, label } = extractBasesForExpander(palette);
    setExpanderBases(bases);
    setExpanderThemeProfile(themeProfile);
    return { bases, themeProfile, label };
  }, [palette]);

  useEffect(() => {
    if (!palette || palette.length === 0) return;
    prepareForExpander();
  }, [palette]);

  const [duplicatePalette, setDuplicatePalette] = useState([]);
  const [duplicatePaletteType, setDuplicatePaletteType] = useState("");
  const [paletteHistory, setPaletteHistory] = useState([]);
  const [paletteHistoryCounter, setPaletteHistoryCounter] = useState(-2);

  const setCounter = (valueOrUpdater) => {
    setPaletteHistoryCounter((prev) => {
      const next =
        typeof valueOrUpdater === "function"
          ? valueOrUpdater(prev)
          : valueOrUpdater;
      paletteHistoryCounterRef.current = next;
      return next;
    });
  };

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
    if (historyNavigationRef.current) return;

    setPaletteHistory((prevHistory) => {
      if (!palette || palette.length === 0) return prevHistory;

      const currentIndex = paletteHistoryCounterRef.current;
      const historyObject = { palette, type: selectedPaletteType, oklch };

      const currentEntry = prevHistory[currentIndex];
      if (JSON.stringify(currentEntry) === JSON.stringify(historyObject)) {
        return prevHistory;
      }

      const insertAt = currentIndex + 1;
      const newHistory = [...prevHistory];
      newHistory.splice(insertAt, 0, historyObject);
      return newHistory;
    });

    setCounter((prev) => prev + 1);
  }, [duplicatePalette]);

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

    // Skip if no palette type selected yet (initial load)
    if (!selectedPaletteType) return; // This exits early, so no error below

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
      seasonalPalType,
      dataVizPalType,
      flowerPalType,
      uiBrandPalType,
      arcPalType,
      triadicPalType,
      tetradicPalType,
      achroPalType,
      chromaticNeutralPalType,
      splitCompPalType,
      nearCompPalType,
      monoColorCount,
      monoHueDrift,
    );

    if (pal && Array.isArray(pal) && pal.length > 0) {
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
    }
  }, [
    oklch,
    analogOptions,
    splitCompOptions,
    tetradicAngle,
    selectedPaletteType,
    compPalType,
    monoPalType,
    analogPalType,
    doubleSplitCompPalType,
    seasonalPalType,
    dataVizPalType,
    flowerPalType,
    uiBrandPalType,
    arcPalType,
    triadicPalType,
    tetradicPalType,
    achroPalType,
    chromaticNeutralPalType,
    splitCompPalType,
    nearCompPalType,
    monoColorCount,
    monoHueDrift,
  ]);

  const { generateRandomColor, generateRandomPalette } = useRandomPalette({
    analogOptions,
    setOklch,
    setSelectedPaletteType,
    setAnalogPalType,
    setCompPalType,
    setFlowerPalType,
    setDataVizPalType,
    setDoubleSplitCompPalType,
    setPalette,
    setCurrentPaletteInfo,
  });

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
    tetradicForm,
    setTetradicForm,
    setPaletteHistory,
    paletteHistoryCounter,
    setPaletteHistoryCounter,
    duplicatePaletteType,
    setDuplicatePaletteType,
    historyNavigation,
    setHistoryNavigation,
    historyNavigationRef,
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
    splitCompPalType,
    setSplitCompPalType,
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
    generateRandomColor,
    generateRandomPalette,
    chromaticNeutralPalType,
    setChromaticNeutralPalType,
    nearCompPalType,
    setNearCompPalType,
    uiBrandPalType,
    setUiBrandPalType,
    arcPalType,
    setArcPalType,
    triadicPalType,
    setTriadicPalType,
    tetradicPalType,
    setTetradicPalType,
    achroPalType,
    setAchroPalType,
    monoColorCount,
    setMonoColorCount,
    monoHueDrift,
    setMonoHueDrift,
    expanderBases,
    setExpanderBases,
    expanderThemeProfile,
    setExpanderThemeProfile,
    prepareForExpander,
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
      "To use ColorPaletteContextProvider, component must be wrapped in corresponding provider",
    );
  }
  return ctx;
}

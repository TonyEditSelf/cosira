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

import { paletteTypes } from "../data/paletteTypes";
import { paletteVariations } from "../data/paletteVarities";
import analogousPalGen from "./custom-palettes/ColorPaletteUtils/analogousPalGen";
import accentedAnalogousPalGen from "./custom-palettes/ColorPaletteUtils/accentedAnalogousPalGen";
import achromaticPalGen from "./custom-palettes/ColorPaletteUtils/achromaticPalGen";
import brandPalGen from "./custom-palettes/ColorPaletteUtils/brandPalGen";
import chromaticNeutralPalGen from "./custom-palettes/ColorPaletteUtils/chromaticNeutralPalGen";
import clashPalGen from "./custom-palettes/ColorPaletteUtils/clashPalGen";
import complementaryPalGen from "./custom-palettes/ColorPaletteUtils/complementaryPalGen";
import compoundPalGen from "./custom-palettes/ColorPaletteUtils/compoundPalGen";
import dataVizPalettePalGen from "./custom-palettes/ColorPaletteUtils/dataVizPalettePalGen";
import designsystemPalGen from "./custom-palettes/ColorPaletteUtils/designsystemPalGen";
import doubleSplitCompPalGen from "./custom-palettes/ColorPaletteUtils/doubleSplitCompPalGen";
import flowerPalGen from "./custom-palettes/ColorPaletteUtils/flowerPalGen";
import gradientPalGen from "./custom-palettes/ColorPaletteUtils/gradientPalGen";
import monochromaticPalGen from "./custom-palettes/ColorPaletteUtils/monochromaticPalGen";
import nearCompPalGen from "./custom-palettes/ColorPaletteUtils/nearCompPalGen";
import seasonalPalGen from "./custom-palettes/ColorPaletteUtils/seasonalPalGen";
import splitCompPalGen from "./custom-palettes/ColorPaletteUtils/splitCompPalGen";
import squarePalGen from "./custom-palettes/ColorPaletteUtils/squarePalGen";
import tetradicPalGen from "./custom-palettes/ColorPaletteUtils/tetradicPalGen";
import triadicPalGen from "./custom-palettes/ColorPaletteUtils/triadicPalGen";
import uiPalettePalGen from "./custom-palettes/ColorPaletteUtils/uiPalettePalGen";
import warmCoolPalGen from "./custom-palettes/ColorPaletteUtils/warmCoolPalGen";

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

  const generateRandomColor = () => {
    return {
      l: Math.random() * 0.4 + 0.4, // 0.4 to 0.8 (avoid very dark and very bright)
      c: Math.random() * 0.15 + 0.08, // 0.08 to 0.23 (avoid both gray and oversaturated)
      h: Math.random() * 360, // 0 to 360
      a: 1,
    };
  };

  // Function to generate random palette
  const generateRandomPalette = () => {
    // Generate random base color
    const randomColor = generateRandomColor();
    setOklch(randomColor);

    // Select random palette type
    const randomTypeIndex = Math.floor(Math.random() * paletteTypes.length);
    const selectedType = paletteTypes[randomTypeIndex];
    const paletteTypeValue = selectedType.value;

    setSelectedPaletteType(paletteTypeValue);

    let generatedPalette = null;
    let selectedVariation = null;

    // Check if this palette type has variations
    if (paletteVariations[paletteTypeValue]) {
      const variations = paletteVariations[paletteTypeValue];
      const randomVariationIndex = Math.floor(
        Math.random() * variations.length
      );
      selectedVariation = variations[randomVariationIndex];

      // Generate palette based on type and variation
      switch (paletteTypeValue) {
        case "analogous":
          setAnalogPalType(selectedVariation);
          generatedPalette = analogousPalGen(
            randomColor,
            analogOptions,
            selectedVariation
          );
          break;
        case "complementary":
          setCompPalType(selectedVariation);
          generatedPalette = complementaryPalGen(
            randomColor,
            selectedVariation
          );
          break;
        case "flowerPalette":
          setFlowerPalType(selectedVariation);
          generatedPalette = flowerPalGen(randomColor, selectedVariation);
          break;
        case "dataVizPalette":
          setDataVizPalType(selectedVariation);
          generatedPalette = dataVizPalettePalGen(
            randomColor,
            selectedVariation
          );
          break;
        case "doubleSplitComp":
          setDoubleSplitCompPalType(selectedVariation);
          generatedPalette = doubleSplitCompPalGen(
            randomColor,
            selectedVariation
          );
          break;
        // Add other cases for other palette types
        default:
          generatedPalette = [{ name: "Base", value: randomColor }];
      }
    } else {
      // For palette types without variations
      switch (paletteTypeValue) {
        case "monochromatic":
          generatedPalette = monochromaticPalGen(randomColor);
          break;
        case "triadic":
          generatedPalette = triadicPalGen(randomColor);
          break;
        case "tetradic":
          generatedPalette = tetradicPalGen(randomColor);
          break;
        case "splitComplementary":
          generatedPalette = splitCompPalGen(randomColor);
          break;
        // Add other palette types without variations
        default:
          generatedPalette = [{ name: "Base", value: randomColor }];
      }
    }

    if (generatedPalette) {
      setPalette(generatedPalette);
      setCurrentPaletteInfo({
        type: paletteTypeValue,
        variation: selectedVariation || "Default",
        typeName: selectedType.label,
      });
    }
  };

  // Generate initial random palette on mount
  useEffect(() => {
    generateRandomPalette();
  }, []);

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

  const [paletteState, setPaletteState] = useState([]);

  const setPalette = useCallback((newPalette) => {
    if (newPalette !== undefined && newPalette !== null) {
      setPaletteState(newPalette);
    } else {
      console.error("Attempted to set palette to undefined/null - blocked");
      console.trace(); // This will show the call stack
    }
  }, []);

  const palette = paletteState;

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
      if (palette && palette.length > 0) {
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
    console.log("=== COLOR CONTEXT USEEFFECT RUNNING ===");
    console.log("selectedPaletteType:", selectedPaletteType);
    console.log("analogPalType:", analogPalType);

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

    console.log("Palette from paletteDecider:", pal);

    // CRITICAL FIX: Only set palette if pal is valid
    if (pal && Array.isArray(pal) && pal.length > 0) {
      setPalette(pal);
    } else {
      console.error("paletteDecider returned invalid palette:", pal);
    }

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
    analogOptions, // Add this back!
    splitCompOptions,
    tetradicAngle,
    selectedPaletteType,
    compPalType, // Add this
    monoPalType, // Add this
    analogPalType, // Add this - THIS IS THE KEY ONE
    doubleSplitCompPalType, // Add this
    gradientPalType, // Add this
    seasonalPalType, // Add this
    dataVizPalType, // Add this
    flowerPalType,
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
    generateRandomColor,
    generateRandomPalette,
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

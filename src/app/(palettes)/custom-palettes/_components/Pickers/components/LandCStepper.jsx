import { useColorPaletteContext } from "@/app/(palettes)/ColorContext";
import complementaryPalGen from "../../../ColorPaletteUtils/complementaryPalGen";
import monochromaticPalGen from "../../../ColorPaletteUtils/monochromaticPalGen";
import { useEffect } from "react";

export default function LandCStepper({ type }) {
  const {
    oklch,
    compPalType,
    monoPalType,
    setPalette,
    sliderLightValue,
    setSliderLightValue,
    sliderChromaValue,
    setSliderChromaValue,
    selectedPaletteType,
  } = useColorPaletteContext();

  const isLight = type === "light";
  const value = isLight ? sliderLightValue : sliderChromaValue;
  const setValue = isLight ? setSliderLightValue : setSliderChromaValue;

  // Define limits for each palette type
  const limits = {
    light: {
      vintageComp: { min: -0.15, max: 0.15 },
      vintageMono: { min: -0.15, max: 0.15 },
      neutralComp: { min: -0.39, max: 0.39 },
      kidsComp: { min: -0.26, max: 0.26 },
      luxuriousComp: { min: -0.25, max: 0.25 },
      moodyComp: { min: -0.2, max: 0.2 },
      pastelComp: { min: -0.13, max: 0.11 },
      neonComp: { min: -0.44, max: 0.13 },
      retroComp: { min: -0.18, max: 0.18 },
      earthyComp: { min: -0.2, max: 0.18 },
    },
    chroma: {
      vintageComp: { min: -0.05, max: 0.05 },
      vintageMono: { min: -0.05, max: 0.05 },
      neutralComp: { min: -0.03, max: 0.03 },
      kidsComp: { min: -0.06, max: 0.06 },
      luxuriousComp: { min: -0.06, max: 0.06 },
      moodyComp: { min: -0.08, max: 0.08 },
      pastelComp: { min: -0.05, max: 0.04 },
      neonComp: { min: -0.1, max: 0.07 },
      retroComp: { min: -0.06, max: 0.06 },
      earthyComp: { min: -0.05, max: 0.06 },
    },
  };

  const currentPalType =
    selectedPaletteType === "complementary" ? compPalType : monoPalType;
  const currentLimits = limits[type]?.[currentPalType];

  useEffect(() => {
    setSliderChromaValue(0);
    setSliderLightValue(0);
  }, [oklch, setSliderChromaValue, setSliderLightValue]);

  useEffect(() => {
    let pal;
    if (selectedPaletteType === "complementary") {
      pal = complementaryPalGen(
        oklch,
        compPalType,
        sliderLightValue,
        sliderChromaValue
      );
    } else if (selectedPaletteType === "monochromatic") {
      pal = monochromaticPalGen(
        oklch,
        monoPalType,
        sliderLightValue,
        sliderChromaValue
      );
    }
    if (pal) {
      setPalette(pal);
    }
  }, [
    sliderLightValue,
    sliderChromaValue,
    selectedPaletteType,
    compPalType,
    monoPalType,
    oklch,
    setPalette,
  ]);

  const handleIncrement = (delta) => {
    if (!currentLimits) return;

    const newValue = value + delta;
    const { min, max } = currentLimits;

    if (delta < 0 && value >= min) {
      setValue((prev) => prev + delta);
    } else if (delta > 0 && value <= max) {
      setValue((prev) => prev + delta);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        className="size-7 cursor-pointer border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)] flex justify-center items-center"
        onClick={() => handleIncrement(-0.01)}
      >
        -
      </button>
      <button
        className="size-7 cursor-pointer border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)] flex justify-center items-center"
        onClick={() => handleIncrement(0.01)}
      >
        +
      </button>
    </div>
  );
}

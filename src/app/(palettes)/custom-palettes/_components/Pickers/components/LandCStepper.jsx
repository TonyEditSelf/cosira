import { useColorPaletteContext } from "@/app/(palettes)/ColorContext";
import complementaryPalGen from "../../../ColorPaletteUtils/complementaryPalGen";
import monochromaticPalGen from "../../../ColorPaletteUtils/monochromaticPalGen";
import { useEffect } from "react";
useEffect;

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

  let chromaLightValue, setChromaLightValue;

  if (type === "light") {
    chromaLightValue = sliderLightValue;
    setChromaLightValue = setSliderLightValue;
  } else if (type === "chroma") {
    chromaLightValue = sliderChromaValue;
    setChromaLightValue = setSliderChromaValue;
  }

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
    setPalette(pal);
  }, [sliderLightValue, sliderChromaValue]);

  return (
    <div className="flex gap-2">
      <button
        className="size-7 cursor-pointer border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)] flex justify-center items-center "
        onClick={() => {
          if (type === "light") {
            if (
              compPalType === "vintageComp" ||
              monoPalType === "vintageMono"
            ) {
              if (chromaLightValue >= -0.15) {
                setChromaLightValue((prev) => prev - 0.01);
              }
            } else if (compPalType === "neutralComp") {
              if (chromaLightValue >= -0.39) {
                setChromaLightValue((prev) => prev - 0.01);
              }
            } else if (compPalType === "kidsComp") {
              if (chromaLightValue >= -0.26) {
                setChromaLightValue((prev) => prev - 0.01);
              }
            } else if (compPalType === "luxuriousComp") {
              if (chromaLightValue >= -0.25) {
                setChromaLightValue((prev) => prev - 0.01);
              }
            } else if (compPalType === "moodyComp") {
              if (chromaLightValue >= -0.2) {
                setChromaLightValue((prev) => prev - 0.01);
              }
            } else if (compPalType === "pastelComp") {
              if (chromaLightValue >= -0.13) {
                setChromaLightValue((prev) => prev - 0.01);
              }
            } else if (compPalType === "neonComp") {
              if (chromaLightValue >= -0.44) {
                setChromaLightValue((prev) => prev - 0.01);
              }
            } else if (compPalType === "retroComp") {
              if (chromaLightValue >= -0.18) {
                setChromaLightValue((prev) => prev - 0.01);
              }
            } else if (compPalType === "earthyComp") {
              if (chromaLightValue >= -0.2) {
                setChromaLightValue((prev) => prev - 0.01);
              }
            }
          } else if (type === "chroma") {
            if (
              compPalType === "vintageComp" ||
              monoPalType === "vintageMono"
            ) {
              if (chromaLightValue >= -0.05) {
                setChromaLightValue((prev) => prev - 0.01);
              }
            } else if (compPalType === "neutralComp") {
              if (chromaLightValue >= -0.03) {
                setChromaLightValue((prev) => prev - 0.01);
              }
            } else if (compPalType === "kidsComp") {
              if (chromaLightValue >= -0.06) {
                setChromaLightValue((prev) => prev - 0.01);
              }
            } else if (compPalType === "luxuriousComp") {
              if (chromaLightValue >= -0.06) {
                setChromaLightValue((prev) => prev - 0.01);
              }
            } else if (compPalType === "moodyComp") {
              if (chromaLightValue >= -0.08) {
                setChromaLightValue((prev) => prev - 0.01);
              }
            } else if (compPalType === "pastelComp") {
              if (chromaLightValue >= -0.05) {
                setChromaLightValue((prev) => prev - 0.01);
              }
            } else if (compPalType === "neonComp") {
              if (chromaLightValue >= -0.1) {
                setChromaLightValue((prev) => prev - 0.01);
              }
            } else if (compPalType === "retroComp") {
              if (chromaLightValue >= -0.06) {
                setChromaLightValue((prev) => prev - 0.01);
              }
            } else if (compPalType === "earthyComp") {
              if (chromaLightValue >= -0.05) {
                setChromaLightValue((prev) => prev - 0.01);
              }
            }
          }
        }}
      >
        -
      </button>
      <button
        className="size-7 cursor-pointer border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)] flex justify-center items-center"
        onClick={() => {
          if (type === "light") {
            if (
              compPalType === "vintageComp" ||
              monoPalType === "vintageMono"
            ) {
              if (chromaLightValue <= 0.15) {
                setChromaLightValue((prev) => prev + 0.01);
              }
            } else if (compPalType === "neutralComp") {
              if (chromaLightValue <= 0.39) {
                setChromaLightValue((prev) => prev + 0.01);
              }
            } else if (compPalType === "kidsComp") {
              if (chromaLightValue <= 0.26) {
                setChromaLightValue((prev) => prev + 0.01);
              }
            } else if (compPalType === "luxuriousComp") {
              if (chromaLightValue <= 0.25) {
                setChromaLightValue((prev) => prev + 0.01);
              }
            } else if (compPalType === "moodyComp") {
              if (chromaLightValue <= 0.2) {
                setChromaLightValue((prev) => prev + 0.01);
              }
            } else if (compPalType === "pastelComp") {
              if (chromaLightValue <= 0.11) {
                setChromaLightValue((prev) => prev + 0.01);
              }
            } else if (compPalType === "neonComp") {
              if (chromaLightValue <= 0.13) {
                setChromaLightValue((prev) => prev + 0.01);
              }
            } else if (compPalType === "retroComp") {
              if (chromaLightValue <= 0.18) {
                setChromaLightValue((prev) => prev + 0.01);
              }
            } else if (compPalType === "earthyComp") {
              if (chromaLightValue <= 0.18) {
                setChromaLightValue((prev) => prev + 0.01);
              }
            }
          } else if (type === "chroma") {
            if (
              compPalType === "vintageComp" ||
              monoPalType === "vintageMono"
            ) {
              if (chromaLightValue <= 0.05) {
                setChromaLightValue((prev) => prev + 0.01);
              }
            } else if (compPalType === "neutralComp") {
              if (chromaLightValue <= 0.03) {
                setChromaLightValue((prev) => prev + 0.01);
              }
            } else if (compPalType === "kidsComp") {
              if (chromaLightValue <= 0.06) {
                setChromaLightValue((prev) => prev + 0.01);
              }
            } else if (compPalType === "luxuriousComp") {
              if (chromaLightValue <= 0.06) {
                setChromaLightValue((prev) => prev + 0.01);
              }
            } else if (compPalType === "moodyComp") {
              if (chromaLightValue <= 0.08) {
                setChromaLightValue((prev) => prev + 0.01);
              }
            } else if (compPalType === "pastelComp") {
              if (chromaLightValue <= 0.04) {
                setChromaLightValue((prev) => prev + 0.01);
              }
            } else if (compPalType === "neonComp") {
              if (chromaLightValue <= 0.07) {
                setChromaLightValue((prev) => prev + 0.01);
              }
            } else if (compPalType === "retroComp") {
              if (chromaLightValue <= 0.06) {
                setChromaLightValue((prev) => prev + 0.01);
              }
            } else if (compPalType === "earthyComp") {
              if (chromaLightValue <= 0.06) {
                setChromaLightValue((prev) => prev + 0.01);
              }
            }
          }
        }}
      >
        +
      </button>
    </div>
  );
}

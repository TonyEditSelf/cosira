import { useColorPaletteContext } from "@/app/(palettes)/ColorContext";
import complementaryPalGen from "../../../ColorPaletteUtils/complementaryPalGen";
import { useEffect } from "react";
useEffect;

export default function LandCStepper({ type }) {
  const {
    oklch,
    compPalType,
    setPalette,
    sliderLightValue,
    setSliderLightValue,
    sliderChromaValue,
    setSliderChromaValue,
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
    const pal = complementaryPalGen(
      oklch,
      compPalType,
      sliderLightValue,
      sliderChromaValue
    );
    setPalette(pal);
  }, [oklch, compPalType, sliderLightValue, sliderChromaValue]);

  return (
    <div className="flex gap-2">
      <button
        className="size-7 cursor-pointer border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)] flex justify-center items-center "
        onClick={() => {
          if (type === "light") {
            if (chromaLightValue >= -0.18) {
              setChromaLightValue((prev) => prev - 0.01);
            }
          } else if (type === "chroma") {
            if (chromaLightValue >= -0.1) {
              setChromaLightValue((prev) => prev - 0.01);
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
            if (chromaLightValue <= 0.18) {
              setChromaLightValue((prev) => prev + 0.01);
            }
          } else if (type === "chroma") {
            if (chromaLightValue <= 0.1) {
              setChromaLightValue((prev) => prev + 0.01);
            }
          }
        }}
      >
        +
      </button>
    </div>
  );
}

import HueSlider from "./Pickers/components/HueSlider";
import ChromaSlider from "./Pickers/components/ChromaSlider";
import LightnessSlider from "./Pickers/components/LightnessSlider";
import AlphaSlider from "./Pickers/components/AlphaSlider";
import TemperatureSlider from "./Pickers/components/TemperatureSlider";
import AnalogousOptions from "../ColorPaletteUtils/AnalogousOptions";
import SplitCompOptions from "../ColorPaletteUtils/SplitCompOptions";
import { useColorPaletteContext } from "../../ColorContext";
import VintageOptions from "../ColorPaletteUtils/VintageOptions";
import NeutralOptions from "../ColorPaletteUtils/NeutralOptions";
import KidsPalOptions from "../ColorPaletteUtils/KidsPalOptions";
import TetradicOptions from "../ColorPaletteUtils/TetradicOptions";

export default function PalettteProperties() {
  const {
    oklch,
    handleColorChange,
    selectedPaletteType,
    vintagePalType,
    neutralPalType,
    kidsPalType,
  } = useColorPaletteContext();

  return (
    <div className="flex px-4 py-2 flex-col gap-10">
      <div className="flex flex-col w-full">
        <h1 className="text-[12px] font-bold space-y-3 mb-5">
          ADJUST BY BASE COLOR
        </h1>
        <div className="flex flex-1 flex-col w-full gap-4">
          <div>
            <h4 className="text-[11px] font-semibold mb-3">Hue</h4>
            <HueSlider
              hue={oklch.h}
              lightness={oklch.l}
              chroma={oklch.c}
              alpha={oklch.a}
              onChange={handleColorChange}
            />
          </div>
          <div>
            <h4 className="text-[11px] font-semibold mb-3">Lightness</h4>
            <LightnessSlider
              lightness={oklch.l}
              chroma={oklch.c}
              hue={oklch.h}
              alpha={oklch.a}
              onChange={handleColorChange}
            />
          </div>
          <div>
            <h4 className="text-[11px] font-semibold mb-3">Chroma</h4>
            <ChromaSlider
              lightness={oklch.l}
              chroma={oklch.c}
              hue={oklch.h}
              alpha={oklch.a}
              onChange={handleColorChange}
            />
          </div>
          <div>
            <h4 className="text-[11px] font-semibold mb-3">Temperature</h4>
            <TemperatureSlider
              lightness={oklch.l}
              chroma={oklch.c}
              hue={oklch.h}
              alpha={oklch.a}
              onChange={handleColorChange}
            />
          </div>
          <div>
            <h4 className="text-[11px] font-semibold mb-3">Alpha</h4>
            <AlphaSlider
              lightness={oklch.l}
              chroma={oklch.c}
              hue={oklch.h}
              alpha={oklch.a}
              onChange={handleColorChange}
            />
          </div>
        </div>
      </div>

      {selectedPaletteType === "analogous" && <AnalogousOptions />}

      {selectedPaletteType === "splitComplementary" && <SplitCompOptions />}

      {selectedPaletteType === "tetradic" && <TetradicOptions />}

      {selectedPaletteType === "vintage" && <VintageOptions />}

      {selectedPaletteType === "vintage" &&
        vintagePalType === "vintageSplitComp" && <SplitCompOptions />}

      {selectedPaletteType === "vintage" &&
        vintagePalType === "vintageAnalog" && <AnalogousOptions />}

      {selectedPaletteType === "vintage" &&
        vintagePalType === "vintageTetra" && <TetradicOptions />}

      {selectedPaletteType === "neutral" && <NeutralOptions />}

      {selectedPaletteType === "neutral" &&
        neutralPalType === "neutralSplitComp" && <SplitCompOptions />}

      {selectedPaletteType === "neutral" &&
        neutralPalType === "neutralAnalog" && <AnalogousOptions />}

      {selectedPaletteType === "neutral" &&
        neutralPalType === "neutralTetra" && <TetradicOptions />}

      {selectedPaletteType === "kidFriendly" && <KidsPalOptions />}

      {selectedPaletteType === "kidFriendly" &&
        kidsPalType === "kidsSplitComp" && <SplitCompOptions />}

      {selectedPaletteType === "kidFriendly" &&
        kidsPalType === "kidsAnalog" && <AnalogousOptions />}

      {selectedPaletteType === "kidFriendly" && kidsPalType === "kidsTetra" && (
        <TetradicOptions />
      )}
    </div>
  );
}

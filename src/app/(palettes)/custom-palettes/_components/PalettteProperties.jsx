import HueSlider from "./Pickers/components/HueSlider";
import ChromaSlider from "./Pickers/components/ChromaSlider";
import LightnessSlider from "./Pickers/components/LightnessSlider";
import AlphaSlider from "./Pickers/components/AlphaSlider";
import TemperatureSlider from "./Pickers/components/TemperatureSlider";
import AnalogousOptions from "../ColorPaletteUtils/AnalogousOptions";
import SplitCompOptions from "../ColorPaletteUtils/SplitCompOptions";
import { useColorPaletteContext } from "../../ColorContext";
import TetradicOptions from "../ColorPaletteUtils/TetradicOptions";
import ComplementaryOptions from "../ColorPaletteUtils/ComplementaryOptions";
import MonochromaticOptions from "../ColorPaletteUtils/MonochromaticOptions";
import DoubleSplitCompOptions from "../ColorPaletteUtils/DoubleSplitCompOptions";
import GradientOptions from "../ColorPaletteUtils/GradientOptions";
import LandCStepper from "./Pickers/components/LandCStepper";
import SeasonalOptions from "../ColorPaletteUtils/SeasonalOptions";
import DataVizOptions from "../ColorPaletteUtils/DataVizOptions";
import FlowerPalOptions from "../ColorPaletteUtils/FlowerPalOptions";

export default function PalettteProperties() {
  const {
    oklch,
    handleColorChange,
    selectedPaletteType,
    compPalType,
    monoPalType,
    sliderLightValue,
    setSliderLightValue,
    setPalette,
  } = useColorPaletteContext();

  return (
    <div className="flex px-4 py-2 flex-col gap-10">
      <div className="flex flex-col w-full">
        <h1 className="text-[12px] font-bold space-y-3 mb-5">
          ADJUST BY BASE COLOR
        </h1>
        <div className="flex flex-1 flex-col w-full gap-5">
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
      if(monoPalType === 'vintageMono' || monoPalType === 'neutralMono' ||
      monoPalType === 'kidsMono' || compPalType === 'vintageComp' || compPalType
      === '80sNeonComp' || compPalType === 'MCMComp' || compPalType ===
      'neutralComp' || compPalType === 'kidsComp' || compPalType ===
      'luxuriousComp' || compPalType === 'moodyComp' || compPalType ===
      'pastelComp' || compPalType === 'neonComp' || compPalType === 'retroComp'
      || compPalType === 'earthyComp' || analogPalType ===
      'neutralCenteredAnalog' || analogPalType === 'neutralLeftAnalog' ||
      analogPalType === 'neutralRightAnalog' || analogPalType ===
      'kidsBrightCentered' || analogPalType === 'kidsBrightLeft' ||
      analogPalType === 'kidsBrightRight' || analogPalType === 'toyLikeCentered'
      || analogPalType === 'toyLikeLeft' || analogPalType === 'toyLikeRight' ||
      analogPalType === 'pastelKidCentered' || analogPalType === 'pastelKidLeft'
      || analogPalType === 'pastelKidRight' || analogPalType ===
      'neoKidCentered' || analogPalType === 'neoKidLeft' || analogPalType ===
      'neoKidRight') && (
      <div className="flex flex-col gap-2">
        <div>
          <div className="flex justify-between">
            <label htmlFor="lightInput">Lightness</label>
            <div>
              <LandCStepper id="lightInput" type="light" />
            </div>
          </div>
        </div>
        <div>
          <div className="flex justify-between">
            <label htmlFor="chromaInput">Chroma</label>
            <div>
              <LandCStepper id="chromaInput" type="chroma" />
            </div>
          </div>
        </div>
      </div>
      ){selectedPaletteType === "monochromatic" && <MonochromaticOptions />}
      {selectedPaletteType === "complementary" && <ComplementaryOptions />}
      {selectedPaletteType === "analogous" && <AnalogousOptions />}
      {selectedPaletteType === "splitComplementary" && <SplitCompOptions />}
      {selectedPaletteType === "tetradic" && <TetradicOptions />}
      {selectedPaletteType === "doubleSplitComp" && <DoubleSplitCompOptions />}
      {selectedPaletteType === "gradient" && <GradientOptions />}
      {selectedPaletteType === "seasonal" && <SeasonalOptions />}
      {selectedPaletteType === "dataVizPalette" && <DataVizOptions />}
      {selectedPaletteType === "flowerPalette" && <FlowerPalOptions />}
    </div>
  );
}

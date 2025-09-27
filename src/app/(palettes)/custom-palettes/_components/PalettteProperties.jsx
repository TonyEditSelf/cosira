import HueSlider from "./Pickers/components/HueSlider";
import ChromaSlider from "./Pickers/components/ChromaSlider";
import LightnessSlider from "./Pickers/components/LightnessSlider";
import AlphaSlider from "./Pickers/components/AlphaSlider";
import TemperatureSlider from "./Pickers/components/TemperatureSlider";
import AnalogousOptions from "../ColorPaletteUtils/AnalogousOptions";
import SplitCompOptions from "../ColorPaletteUtils/SplitCompOptions";
import { useColorPaletteContext } from "../../ColorContext";
import OffAndOn from "./OffAndOn";

export default function PalettteProperties() {
  const {
    oklch,
    handleColorChange,
    toggles,
    handleToggle,
    selectedPaletteType,
  } = useColorPaletteContext();

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col w-full">
        <h1 className="text-[15px] font-bold space-y-3 mb-5">
          ADJUST BY BASE COLOR
        </h1>
        <div className="flex flex-1 flex-col w-full gap-4">
          <div>
            <h4 className="text-sm font-semibold mb-3">Hue</h4>
            <HueSlider
              hue={oklch.h}
              lightness={oklch.l}
              chroma={oklch.c}
              alpha={oklch.a}
              onChange={handleColorChange}
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Lightness</h4>
            <LightnessSlider
              lightness={oklch.l}
              chroma={oklch.c}
              hue={oklch.h}
              alpha={oklch.a}
              onChange={handleColorChange}
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Chroma</h4>
            <ChromaSlider
              lightness={oklch.l}
              chroma={oklch.c}
              hue={oklch.h}
              alpha={oklch.a}
              onChange={handleColorChange}
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Temperature</h4>
            <TemperatureSlider
              lightness={oklch.l}
              chroma={oklch.c}
              hue={oklch.h}
              alpha={oklch.a}
              onChange={handleColorChange}
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Alpha</h4>
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

      <div className="w-full">
        <h1 className="text-[15px] font-bold space-y-3 mb-3">SHOW/HIDE</h1>

        <div className="flex flex-col gap-1">
          <span>Show Color Names: </span>

          <OffAndOn
            isItOn={toggles.colorNames}
            setItOn={() => handleToggle("colorNames")}
          />

          <span>Show Color Types: </span>

          <OffAndOn
            isItOn={toggles.colorTypes}
            setItOn={() => handleToggle("colorTypes")}
          />

          <span>Show Make Base: </span>

          <OffAndOn
            isItOn={toggles.makeBaseOn}
            setItOn={() => handleToggle("makeBaseOn")}
          />
          <span>Show Hex: </span>

          <OffAndOn
            isItOn={toggles.hexOn}
            setItOn={() => handleToggle("hexOn")}
          />

          <span>Show Hue: </span>
          <OffAndOn
            isItOn={toggles.hueOn}
            setItOn={() => handleToggle("hueOn")}
          />
          <span>Show Lightness</span>
          <OffAndOn
            isItOn={toggles.lightOn}
            setItOn={() => handleToggle("lightOn")}
          />

          <span>Show Chroma</span>
          <OffAndOn
            isItOn={toggles.chromaOn}
            setItOn={() => handleToggle("chromaOn")}
          />
          <span>Show Alpha</span>
          <OffAndOn
            isItOn={toggles.alphaOn}
            setItOn={() => handleToggle("alphaOn")}
          />
          <span>Show White Contrast</span>
          <OffAndOn
            isItOn={toggles.whiteContrastOn}
            setItOn={() => handleToggle("whiteContrastOn")}
          />
          <span>Show Black Contrast</span>
          <OffAndOn
            isItOn={toggles.blackContrastOn}
            setItOn={() => handleToggle("blackContrastOn")}
          />
        </div>
      </div>
    </div>
  );
}

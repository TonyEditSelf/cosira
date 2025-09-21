import OklchArea from "./Pickers/components/OklchArea";
import HueSlider from "./Pickers/components/HueSlider";
import LightnessSlider from "./Pickers/components/LightnessSlider";
import ChromaSlider from "./Pickers/components/ChromaSlider";
import ColorDisplay from "./Pickers/components/ColorDisplay";
import OklchColorWheel from "./Pickers/components/OklchColorWheel";
import AlphaSlider from "./Pickers/components/AlphaSlider";
import HexInput from "./Pickers/components/HexInput";
import { easeIn, motion } from "framer-motion";
import { useClickOutsideRef } from "@/hooks/useHooks";
import { useColorPaletteContext } from "../../ColorContext";

export default function MyColorPicker() {
  const {
    pickerRef,
    myColorPickerOpen,
    setMyColorPickerOpen,
    oklch,
    handleColorChange,
  } = useColorPaletteContext();

  useClickOutsideRef(pickerRef, setMyColorPickerOpen);

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 10, opacity: 0 }}
      transition={{ duration: 0.1, ease: easeIn }}
      ref={pickerRef}
      className={`absolute flex justify-center items-center gap-3 left-1/2 -translate-x-1/2 bottom-2 rounded-md bg-[var(--background)] w-[590px] h-[460px] border border-[var(--navBorder)]`}
    >
      {myColorPickerOpen && (
        <div className="flex flex-col justify-center items-center gap-7 w-full px-10">
          <div className="flex w-full gap-10">
            <div className="flex w-fit flex-col gap-1 justify-center items-center">
              <OklchColorWheel
                hue={oklch.h}
                lightness={oklch.l}
                chroma={oklch.c}
                alpha={oklch.a}
                onChange={handleColorChange}
              />
              <OklchArea
                lightness={oklch.l}
                chroma={oklch.c}
                hue={oklch.h}
                alpha={oklch.a}
                onChange={handleColorChange}
              />
            </div>

            <div className="flex flex-1 flex-col w-full gap-2">
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

          <div className="w-full flex justify-center items-center gap-2">
            <HexInput oklch={oklch} onChange={handleColorChange} />
            <ColorDisplay />
          </div>
        </div>
      )}
    </motion.div>
  );
}

import OklchArea from "./Pickers/components/OklchArea";
import HueSlider from "./Pickers/components/HueSlider";
import LightnessSlider from "./Pickers/components/LightnessSlider";
import ChromaSlider from "./Pickers/components/ChromaSlider";
import ColorDisplay from "./Pickers/components/ColorDisplay";
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
      className={`absolute flex justify-center items-center gap-3 left-1/2 -translate-x-1/2 bottom-2 rounded-md pb-2 bg-[var(--background)] w-[750px] h-[400px] border border-[var(--navBorder)]`}
    >
      {myColorPickerOpen && (
        <div className="flex gap-10">
          <div className="flex flex-col gap-5 justify-center items-center">
            <OklchArea
              lightness={oklch.l}
              chroma={oklch.c}
              hue={oklch.h}
              onChange={handleColorChange}
            />
            <ColorDisplay />
          </div>

          <div className="flex flex-col gap-5 pt-3">
            <div>
              <h4 className="text-sm font-semibold mb-3">Hue</h4>
              <HueSlider
                hue={oklch.h}
                lightness={oklch.l}
                chroma={oklch.c}
                onChange={handleColorChange}
              />
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3">Lightness</h4>
              <LightnessSlider
                lightness={oklch.l}
                chroma={oklch.c}
                hue={oklch.h}
                onChange={handleColorChange}
              />
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3">Chroma</h4>
              <ChromaSlider
                lightness={oklch.l}
                chroma={oklch.c}
                hue={oklch.h}
                onChange={handleColorChange}
              />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

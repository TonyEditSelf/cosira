import HexColors from "./Pickers/HexColors";
import { easeIn, motion } from "framer-motion";
import { useClickOutsideRef } from "@/hooks/useHooks";
import { useColorPaletteContext } from "../../ColorContext";

export default function MyColorPicker() {
  const {
    pickerRef,
    showHexColorPicker,
    setShowHexColorPicker,
    showAdvancedPickers,
    setShowAdvancedPickers,
    setMyColorPickerOpen,
  } = useColorPaletteContext();

  useClickOutsideRef(pickerRef, setMyColorPickerOpen);

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 10, opacity: 0 }}
      transition={{ duration: 0.1, ease: easeIn }}
      ref={pickerRef}
      className={`absolute flex flex-col justify-center items-center gap-3 left-1/2 -translate-x-1/2 bottom-2 rounded-md p-4 bg-[var(--background)] ${
        showHexColorPicker ? "w-[240px] h-[340px]" : "w-[580px] h-[435px]"
      }  border border-[var(--navBorder)]`}
    >
      {showHexColorPicker && <HexColors />}

      {/* {showAdvancedPickers && <HslaColors />} */}

      <button
        onClick={() => {
          setShowHexColorPicker((prev) => !prev);
          setShowAdvancedPickers((prev) => !prev);
        }}
        className="border border-[var(--navBorder)] rounded-md p-1 px-3 w-full"
      >
        {showHexColorPicker ? "Advanced Color Picker" : "Simple Color Picker"}
      </button>
    </motion.div>
  );
}

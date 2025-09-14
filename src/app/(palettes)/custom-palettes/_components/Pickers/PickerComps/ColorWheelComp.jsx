import {
  ColorWheel,
  ColorWheelTrack,
  ColorThumb,
  parseColor,
} from "react-aria-components";
import { useColorPaletteContext } from "@/app/(palettes)/ColorContext";

export default function ColorWheelComp() {
  const { hslaColorObjectState, handleHslaColorChange } =
    useColorPaletteContext();

  return (
    <>
      <ColorWheel
        value={hslaColorObjectState}
        onChange={handleHslaColorChange}
        outerRadius={80}
        innerRadius={20}
      >
        <ColorWheelTrack />
        <ColorThumb className="border-2 border-black size-4 rounded-full" />
      </ColorWheel>
    </>
  );
}

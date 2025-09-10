import { ColorWheel, ColorWheelTrack, ColorThumb } from "react-aria-components";
import { useColorPaletteContext } from "@/app/(palettes)/ColorContext";

export default function ColorWheelComp() {
  const { ariaColor, handleAriaColorChange } = useColorPaletteContext();

  return (
    <>
      <ColorWheel
        value={ariaColor}
        onChange={handleAriaColorChange}
        // onChangeEnd={onChangeEnd}
        outerRadius={80}
        innerRadius={0}
      >
        <ColorWheelTrack />
        <ColorThumb className="border-2 border-black size-4 rounded-full" />
      </ColorWheel>
    </>
  );
}

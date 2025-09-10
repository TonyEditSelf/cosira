import { useColorPaletteContext } from "@/app/(palettes)/ColorContext";
import { HexColorInput } from "react-colorful";
import { HexColorPicker } from "react-colorful";

export default function HexColors() {
  const { hexColor, handleHexColorChange } = useColorPaletteContext();

  return (
    <>
      <HexColorPicker color={hexColor} onChange={handleHexColorChange} />
      <HexColorInput
        className="border border-[var(--navBorder)] rounded-md p-1 px-3"
        color={hexColor}
        onChange={handleHexColorChange}
      />
    </>
  );
}

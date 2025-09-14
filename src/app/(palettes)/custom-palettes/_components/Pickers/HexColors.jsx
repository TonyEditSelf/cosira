import { useColorPaletteContext } from "@/app/(palettes)/ColorContext";
import { HexColorInput } from "react-colorful";
import { HexColorPicker } from "react-colorful";

export default function HexColors() {
  const { hexColorState, handleHexcColorChange } = useColorPaletteContext();

  return (
    <>
      <HexColorPicker color={hexColorState} onChange={handleHexcColorChange} />
      <HexColorInput
        className="border border-[var(--navBorder)] rounded-md p-1 px-3"
        color={hexColorState}
        onChange={handleHexcColorChange}
      />
    </>
  );
}

import { ColorThumb, ColorArea } from "react-aria-components";
import { useColorPaletteContext } from "@/app/(palettes)/ColorContext";
export default function ColorAreaComp() {
  const { ariaColor, handleAriaColorChange } = useColorPaletteContext();

  return (
    <>
      <ColorArea
        value={ariaColor}
        onChange={handleAriaColorChange}
        xChannel="saturation"
        yChannel="lightness"
        width={200}
        height={200}
        className="w-[160px] h-[160px] rounded-md overflow-hidden"
      >
        <ColorThumb className="border-2 border-black size-4 rounded-full" />
      </ColorArea>
    </>
  );
}

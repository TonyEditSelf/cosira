import { Label, ColorField, Input } from "react-aria-components";
import { useColorPaletteContext } from "@/app/(palettes)/ColorContext";

export default function ColorFieldComp({ label, colorSpace, channel = "" }) {
  const { ariaColor, handleAriaColorChange } = useColorPaletteContext();

  return (
    <>
      <ColorField
        label="label"
        value={ariaColor}
        onChange={handleAriaColorChange}
        colorSpace={colorSpace}
        channel={channel}
      >
        <div className="flex gap-2 justify-between">
          <Label>{label}</Label>
          <Input className="border border-[var(--navBorder)] rounded-md w-[85px] px-2"></Input>
        </div>
      </ColorField>
    </>
  );
}

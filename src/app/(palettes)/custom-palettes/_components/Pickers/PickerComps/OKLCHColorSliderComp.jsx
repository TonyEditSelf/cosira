import {
  ColorThumb,
  ColorSlider,
  Label,
  SliderOutput,
  SliderTrack,
} from "react-aria-components";
import { useColorPaletteContext } from "@/app/(palettes)/ColorContext";

export default function OKLCHColorSliderComp({
  value,
  onChange,
  channel,
  label,
  checkerboard,
  className,
}) {
  const { ariaColor, handleAriaColorChange } = useColorPaletteContext();

  return (
    <>
      <ColorSlider
        channel={channel}
        value={value}
        onChange={onChange}
        className="react-aria-ColorSlider"
      >
        <div className="flex justify-between">
          <Label>{label}</Label>
          <SliderOutput />
        </div>
        <SliderTrack
          style={({ defaultStyle }) => ({
            height: "12px",
            borderRadius: "0.375rem",
            background: checkerboard
              ? `${defaultStyle.background},
         repeating-conic-gradient(#CCC 0% 25%, white 0% 50%) 50% / 16px 16px`
              : defaultStyle.background,
          })}
        >
          <ColorThumb className="border-2 border-black size-4 rounded-full" />
        </SliderTrack>
      </ColorSlider>
    </>
  );
}

import {
  ColorThumb,
  ColorSlider,
  Label,
  SliderOutput,
  SliderTrack,
} from "react-aria-components";
import { useColorPaletteContext } from "@/app/(palettes)/ColorContext";
import ColorFieldComp from "./PickerComps/ColorFieldComp";
import ColorWheelComp from "./PickerComps/ColorWheelComp";
import ColorAreaComp from "./PickerComps/ColorAreaComp";
import ColorSliderComp from "./PickerComps/ColorSliderComp";

export default function HslaColors() {
  const { handleAriaColorChange, ariaColor } = useColorPaletteContext();

  return (
    <div className="w-full flex flex-col gap-5 p-2">
      <div className="flex justify-end items-center gap-10 w-full">
        {/* ------------ COLOR FIELDS ------------- */}

        <div className="w-32 flex flex-col gap-1">
          <ColorFieldComp label="Hex" colorSpace="hex" channel="" />

          <ColorFieldComp label="Hue" colorSpace="hsla" channel="hue" />

          <ColorFieldComp label="Sat" colorSpace="hsla" channel="saturation" />

          <ColorFieldComp label="Lit" colorSpace="hsla" channel="lightness" />

          <ColorFieldComp label="Alp" colorSpace="hsla" channel="alpha" />
        </div>
        {/* ------------- COLOR WHEEL ---------- */}
        <ColorWheelComp />
        {/* ----------- COLOR AREA -------------- */}

        <ColorAreaComp />
      </div>
      {/* -------------- COLOR SLIDERS ------------- */}
      <div className="flex flex-col gap-2">
        <ColorSliderComp channel="hue" label="Hue" checkerboard={false} />

        <ColorSliderComp channel="saturation" label="Saturation" />

        <ColorSliderComp
          channel="lightness"
          label="Lightness"
          checkerboard={false}
        />

        <ColorSliderComp channel="alpha" label="Alpha" checkerboard={true} />
      </div>
    </div>
  );
}

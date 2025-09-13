import { useColorPaletteContext } from "@/app/(palettes)/ColorContext";
import ColorFieldComp from "./PickerComps/ColorFieldComp";
import ColorWheelComp from "./PickerComps/ColorWheelComp";
import ColorAreaComp from "./PickerComps/ColorAreaComp";
import HSLColorSliderComp from "./PickerComps/HSLColorSliderComp";

export default function HslaColors() {
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
        <HSLColorSliderComp channel="hue" label="Hue" checkerboard={false} />

        <HSLColorSliderComp channel="saturation" label="Saturation" />

        <HSLColorSliderComp
          channel="lightness"
          label="Lightness"
          checkerboard={false}
        />

        <HSLColorSliderComp channel="alpha" label="Alpha" checkerboard={true} />
      </div>
    </div>
  );
}

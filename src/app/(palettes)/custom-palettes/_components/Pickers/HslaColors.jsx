import { useColorPaletteContext } from "@/app/(palettes)/ColorContext";
import ColorFieldComp from "./PickerComps/ColorFieldComp";
import ColorWheelComp from "./PickerComps/ColorWheelComp";
import ColorAreaComp from "./PickerComps/ColorAreaComp";
import HslaColorSliderComp from "./PickerComps/HslaColorSliderComp";

export default function HslaColors() {
  return (
    <div className="w-full flex flex-col gap-5 p-2">
      <div className="flex justify-end items-center gap-10 w-full">
        {/* ------------ COLOR FIELDS ------------- */}

        <div className="w-32 flex flex-col gap-1">
          <ColorFieldComp label="Hex" colorSpace="hex" channel="" />
          <ColorFieldComp label="H" colorSpace="hsl" channel="hue" />
          <ColorFieldComp label="S" colorSpace="hsl" channel="saturation" />
          <ColorFieldComp label="L" colorSpace="hsl" channel="lightness" />
          <ColorFieldComp label="A" colorSpace="hsl" channel="alpha" />
        </div>
        {/* ------------- COLOR WHEEL ---------- */}
        <ColorWheelComp />
        {/* ----------- COLOR AREA -------------- */}

        <ColorAreaComp />
      </div>
      {/* -------------- COLOR SLIDERS ------------- */}
      <div className="flex flex-col gap-2">
        <HslaColorSliderComp channel="hue" label="Hue" checkerboard={false} />

        <HslaColorSliderComp channel="saturation" label="Saturation" />

        <HslaColorSliderComp
          channel="lightness"
          label="Lightness"
          checkerboard={false}
        />

        <HslaColorSliderComp
          channel="alpha"
          label="Alpha"
          checkerboard={true}
        />
      </div>
    </div>
  );
}

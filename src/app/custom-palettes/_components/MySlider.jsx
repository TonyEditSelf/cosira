"use client";

import {
  Label,
  Slider,
  SliderOutput,
  SliderThumb,
  SliderTrack,
} from "react-aria-components";

export function MySlider({ label, defaultValue, minValue, maxValue, step }) {
  return (
    <Slider
      minValue={minValue}
      maxValue={maxValue}
      step={step}
      defaultValue={defaultValue}
      className="flex flex-col items-center w-64"
    >
      <div className="flex justify-between w-full mb-2">
        <Label className="text-sm font-semibold text-[var(--foreground)]">
          {label}
        </Label>
        <SliderOutput className="text-sm font-bold text-[var(--brand)]" />
      </div>
      <SliderTrack className="w-full h-2 bg-[var(--muted)] rounded-full relative">
        {/* bg-gray-200 */}
        <SliderThumb
          className="
            h-4 w-4 rounded-full border-2 border-white
            bg-[var(--brand)] transition-all
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]
            data-[dragging]:bg-[var(--brand)]
            absolute top-1/2 -translate-y-1/2
          "
        />
      </SliderTrack>
    </Slider>
  );
}

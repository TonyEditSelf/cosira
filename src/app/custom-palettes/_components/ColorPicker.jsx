"use client";

import { ColorWheel, ColorWheelTrack, ColorThumb } from "react-aria-components";

export default function ColorPicker({ CWvalue, CWonChange, CWonChangeEnd }) {
  return (
    <div>
      <ColorWheel
        value={CWvalue}
        onChange={CWonChange}
        onChangeEnd={CWonChangeEnd}
        outerRadius={70}
        innerRadius={0}
      >
        <ColorWheelTrack />
        <ColorThumb className="border-10 border-black size-5 rounded-full" />
      </ColorWheel>
    </div>
  );
}

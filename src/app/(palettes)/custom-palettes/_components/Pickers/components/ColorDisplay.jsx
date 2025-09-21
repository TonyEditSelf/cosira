import React from "react";
import { useColorPaletteContext } from "@/app/(palettes)/ColorContext";

export default function ColorDisplay() {
  const { cssColor, rgbColor, rgbcopied, csscopied, handleCopy } =
    useColorPaletteContext();

  return (
    <div className="w-fit flex justify-center items-center gap-2">
      <div
        onClick={() => handleCopy("css")}
        className="w-fit border border-[var(--navBorder)] hover:border-[var(--muted-foreground)] rounded-md py-[6px] px-5 flex justify-center font-mono"
      >
        {csscopied ? <>Copied!</> : <span>Copy OKLCH-A</span>}
      </div>

      <div
        onClick={() => handleCopy("rgb")}
        className="w-fit border border-[var(--navBorder)] hover:border-[var(--muted-foreground)] rounded-md py-[6px] px-5 flex justify-center font-mono"
      >
        {rgbcopied ? <>Copied!</> : <> Copy RGBA</>}
      </div>
    </div>
  );
}

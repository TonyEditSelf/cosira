import React from "react";
import { useColorPaletteContext } from "@/app/(palettes)/ColorContext";
import { Button } from "@/components/ui/button";

export default function ColorDisplay() {
  const { cssColor, rgbColor, rgbcopied, csscopied, handleCopy } =
    useColorPaletteContext();

  return (
    <div className="w-fit flex justify-center items-center gap-2">
      <div
        onClick={() => handleCopy("css")}
        className="w-fit bg-[var(--background)] text-xs px-3 py-[7px]"
      >
        {csscopied ? <>Copied!</> : <>Copy {cssColor}</>}
      </div>

      <div
        onClick={() => handleCopy("rgb")}
        className="w-fit bg-[var(--background)] text-[var(--foreground)] border-[var(--navBorder)] px-3 py-[7px]"
      >
        {rgbcopied ? <>Copied!</> : <>Copy {rgbColor}</>}
      </div>

      {/* <code className="text-sm font-mono">CSS: {cssColor}</code> */}
      {/* <code className="text-sm font-mono"> RGB:{rgbColor}</code> */}
      {/* <code className="text-sm font-mono">HEX: {hexColor.toUpperCase()}</code> */}
    </div>
  );
}

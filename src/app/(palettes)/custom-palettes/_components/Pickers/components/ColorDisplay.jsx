import React from "react";
import { useColorPaletteContext } from "@/app/(palettes)/ColorContext";
import { Button } from "@/components/ui/button";

export default function ColorDisplay() {
  const { cssColor, rgbColor, rgbcopied, csscopied, handleCopy } =
    useColorPaletteContext();

  return (
    <div className="w-full flex flex-col justify-center items-center gap-2">
      <Button
        onClick={() => handleCopy("css")}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-all duration-300 hover:shadow-xl"
        size="lg"
      >
        {csscopied ? <>Copied!</> : <>Copy {cssColor}</>}
      </Button>

      <Button
        onClick={() => handleCopy("rgb")}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-all duration-300 hover:shadow-xl"
        size="lg"
      >
        {rgbcopied ? <>Copied!</> : <>Copy {rgbColor}</>}
      </Button>

      {/* <code className="text-sm font-mono">CSS: {cssColor}</code> */}
      {/* <code className="text-sm font-mono"> RGB:{rgbColor}</code> */}
      {/* <code className="text-sm font-mono">HEX: {hexColor.toUpperCase()}</code> */}
    </div>
  );
}

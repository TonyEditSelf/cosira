import { useState, useMemo } from "react";
import chroma from "chroma-js";
import { useColorPaletteContext } from "../ColorContext";

const presetSecondColors = [
  { name: "Gold", hex: "#FFD700" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Bronze", hex: "#CD7F32" },
  { name: "Neon Pink", hex: "#FF10F0" },
  { name: "Neon Green", hex: "#39FF14" },
  { name: "Neon Blue", hex: "#1F51FF" },
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Gray", hex: "#808080" },
];

export default function BlendColors() {
  const { palette } = useColorPaletteContext(); // array of color objects
  const [mode, setMode] = useState("palette"); // "palette" | "single"
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [blendColor, setBlendColor] = useState("#FFD700");
  const [percent, setPercent] = useState(10);

  const colorsToBlend = useMemo(() => {
    if (mode === "single" && selectedIndex !== null) {
      return [palette[selectedIndex]];
    }
    return palette;
  }, [mode, selectedIndex, palette]);

  const blendedColors = useMemo(() => {
    return colorsToBlend.map((c) => {
      const baseHex = chroma.oklch(c.value.l, c.value.c, c.value.h).hex();
      const mixed = chroma.mix(baseHex, blendColor, percent / 100, "oklch");
      const [l, cVal, h] = mixed.oklch();

      return {
        baseHex,
        hex: mixed.hex(),
        l: l.toFixed(3),
        c: cVal.toFixed(3),
        h: h.toFixed(1),
      };
    });
  }, [colorsToBlend, blendColor, percent]);

  return (
    <div className="p-2">
      {/* 1. Set a defined height on the container (e.g., h-[80vh]) */}
      <div className="flex h-[80vh] bg-background rounded-md border border-(--navBorder) overflow-hidden">
        {/* LEFT PANEL: Added overflow-y-auto and h-full */}
        <div className="w-1/3 p-5 space-y-4 border-r border-(--navBorder) overflow-y-auto h-full custom-scrollbar">
          <h2 className="font-semibold text-sm uppercase tracking-wider">
            Blend Mode
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setMode("palette")}
              className={`btn border border-(--navBorder) p-2 text-xs transition-colors ${mode === "palette" ? "bg-primary text-white" : ""}`}
            >
              Whole Palette
            </button>
            <button
              onClick={() => setMode("single")}
              className={`btn border border-(--navBorder) p-2 text-xs transition-colors ${mode === "single" ? "bg-primary text-white" : ""}`}
            >
              Single Color
            </button>
          </div>

          {mode === "single" && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold">Select Base Color</h3>
              <div className="grid grid-cols-5 gap-2">
                {palette.map((c, i) => {
                  const hex = chroma
                    .oklch(c.value.l, c.value.c, c.value.h)
                    .hex();
                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedIndex(i)}
                      className={`h-8 w-8 rounded cursor-pointer border-2 transition-transform hover:scale-110 ${
                        selectedIndex === i
                          ? "border-blue-500"
                          : "border-transparent"
                      }`}
                      style={{ background: hex }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          <h3 className="text-xs font-bold">Second Blend Color</h3>
          <div className="grid grid-cols-3 gap-2">
            {presetSecondColors.map((c) => (
              <button
                key={c.name}
                onClick={() => setBlendColor(c.hex)}
                className="p-2 text-[10px] rounded border border-(--navBorder) truncate"
                style={{
                  background: c.hex,
                  color: chroma(c.hex).luminance() > 0.5 ? "#000" : "#fff",
                }}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="pt-4">
            <h3 className="text-xs font-bold mb-2">
              Blend Strength: {percent}%
            </h3>
            <input
              type="range"
              min="1"
              max="100"
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
              className="w-full accent-blue-500"
            />
          </div>
        </div>

        {/* RIGHT PANEL: Optimized for high density */}
        {/* RIGHT PANEL: High-Density Color Grid */}
        <div className="flex-1 overflow-y-auto h-full bg-gray-50 dark:bg-black/20 custom-scrollbar">
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-px bg-gray-200 dark:bg-white/10">
            {blendedColors.map((c, i) => {
              // Calculate best contrast: White vs Black text
              const textColor =
                chroma.contrast(c.hex, "white") >
                chroma.contrast(c.hex, "black")
                  ? "#ffffff"
                  : "#000000";

              return (
                <div
                  key={i}
                  className="aspect-[4/3] flex flex-col justify-center p-1 font-mono text-[8px] overflow-hidden leading-tight transition-transform hover:scale-125 hover:z-20 hover:shadow-2xl cursor-crosshair"
                  style={{
                    backgroundColor: c.hex,
                    color: textColor,
                  }}
                >
                  <div className="font-bold text-center mb-0.5 truncate">
                    {c.hex.toUpperCase()}
                  </div>

                  <div className="flex flex-col items-center opacity-80 scale-90 origin-top">
                    <div className="flex gap-1">
                      <span>L{Math.round(c.l * 100)}</span>
                      <span>C{c.c.substring(1)}</span>
                      <span>H{Math.round(c.h)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

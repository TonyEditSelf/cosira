import { useState, useMemo } from "react";
import chroma from "chroma-js";
import { useColorPaletteContext } from "../ColorContext";
import { oklchToHex, oklchToCss } from "../custom-palettes/_components/Pickers/components/colorutil";

// Warm and cool anchor hues in OKLCH hue space
// Warm: reds/oranges/yellows cluster around 20–80°
// Cool: blues/cyans/purples cluster around 200–290°
const WARM_HUE = 40;   // warm amber anchor
const COOL_HUE = 240;  // cool blue anchor

// How much to shift the hue toward the temperature anchor (0–1)
// Also slightly boosts chroma to make the shift feel alive
function shiftTemperature(color, amount, direction) {
  // amount: 0 = no change, 1 = full shift
  // direction: "warm" | "cool"
  const targetHue = direction === "warm" ? WARM_HUE : COOL_HUE;

  // Calculate shortest arc on the hue wheel
  let diff = targetHue - color.h;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;

  const newHue = (color.h + diff * amount + 360) % 360;

  // Slightly boost chroma when shifting toward warm, slightly reduce for cool
  const chromaFactor = direction === "warm"
    ? 1 + amount * 0.15
    : 1 - amount * 0.08;
  const newChroma = Math.min(Math.max(color.c * chromaFactor, 0.01), 0.37);

  return { ...color, h: newHue, c: newChroma };
}

const PRESETS = [
  { label: "Golden Hour", direction: "warm", amount: 0.35, description: "Amber warmth" },
  { label: "Sunset", direction: "warm", amount: 0.6, description: "Deep warm shift" },
  { label: "Arctic", direction: "cool", amount: 0.35, description: "Icy clarity" },
  { label: "Midnight", direction: "cool", amount: 0.6, description: "Deep cool shift" },
];

export default function TempShifter() {
  const { palette } = useColorPaletteContext();

  const [direction, setDirection] = useState("warm"); // "warm" | "cool"
  const [amount, setAmount] = useState(0.3);
  const [copiedColor, setCopiedColor] = useState(null);
  const [copiedMessage, setCopiedMessage] = useState("");

  const shiftedPalette = useMemo(() => {
    return palette.map((color, colorIndex) => {
      const base = color.value; // { l, c, h }
      const baseHex = oklchToHex(base.l, base.c, base.h);

      // Generate a range of steps for this color: original + 4 shifted steps
      const steps = [0, 0.25, 0.5, 0.75, 1].map((stepAmount) => {
        const shifted = shiftTemperature(base, stepAmount * amount, direction);
        const hex = oklchToHex(shifted.l, shifted.c, shifted.h);
        const contrastWhite = chroma.contrast(hex, "white");
        const contrastBlack = chroma.contrast(hex, "black");
        const wcagAA = contrastWhite >= 4.5 || contrastBlack >= 4.5;
        const wcagAAA = contrastWhite >= 7 || contrastBlack >= 7;
        return {
          stepAmount,
          shifted,
          hex,
          l: (shifted.l * 100).toFixed(0),
          c: shifted.c.toFixed(2),
          h: shifted.h.toFixed(0),
          contrastWhite: contrastWhite.toFixed(1),
          contrastBlack: contrastBlack.toFixed(1),
          wcagAA,
          wcagAAA,
          isBase: stepAmount === 0,
        };
      });

      return { base, baseHex, colorIndex, steps };
    });
  }, [palette, direction, amount]);

  const handleColorClick = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setCopiedMessage(`Copied ${hex}`);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const applyPreset = (preset) => {
    setDirection(preset.direction);
    setAmount(preset.amount);
  };

  const exportAsCSS = () => {
    const css = shiftedPalette
      .map((color, i) => {
        const colorName = `color-${i + 1}`;
        const dirLabel = direction === "warm" ? "warm" : "cool";
        // export only the fully shifted result (last step)
        const final = color.steps[color.steps.length - 1];
        return `  --${colorName}-${dirLabel}: ${final.hex};`;
      })
      .join("\n");
    navigator.clipboard.writeText(`:root {\n${css}\n}`);
    setCopiedMessage("Copied as CSS variables!");
    setCopiedColor("css");
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const exportAsJSON = () => {
    const json = shiftedPalette.map((color, i) => ({
      name: `Color ${i + 1}`,
      base: color.baseHex,
      direction,
      amount: `${(amount * 100).toFixed(0)}%`,
      shifted: color.steps[color.steps.length - 1].hex,
      steps: color.steps.map((s) => ({
        amount: `${(s.stepAmount * amount * 100).toFixed(0)}%`,
        hex: s.hex,
      })),
    }));
    navigator.clipboard.writeText(JSON.stringify(json, null, 2));
    setCopiedMessage("Copied as JSON!");
    setCopiedColor("json");
    setTimeout(() => setCopiedColor(null), 2000);
  };

  // Direction gradient background for the slider track
  const sliderTrackStyle = direction === "warm"
    ? "linear-gradient(to right, hsl(0,0%,50%), hsl(40,90%,55%))"
    : "linear-gradient(to right, hsl(0,0%,50%), hsl(220,80%,55%))";

  return (
    <div className="hidden bg-background lg:flex flex-col pt-3 h-full">

      {/* ── Top header bar ── */}
      <div className="mx-2 mb-2 ml-4 mr-4 p-4 border border-(--navBorder) rounded-md bg-foreground/[0.015] flex-shrink-0">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                Temperature Shifter
              </span>
              <div className="h-4 w-[1px] bg-(--navBorder)" />
              <span className="text-[9px] text-foreground/30">
                Shift your palette warmer or cooler
              </span>
            </div>
            <div className="h-4 w-[1px] bg-(--navBorder)" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-foreground/40 uppercase">
                Direction
              </span>
              <span
                className="text-[10px] font-bold text-(--brand)"
                style={{ textTransform: "capitalize" }}
              >
                {direction === "warm" ? "🔆 Warm" : "❄️ Cool"}
              </span>
            </div>
            <div className="h-4 w-[1px] bg-(--navBorder)" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-foreground/40 uppercase">
                Intensity
              </span>
              <span className="text-[10px] font-mono font-bold bg-foreground/5 text-(--brand) px-2 py-0.5 rounded">
                {(amount * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportAsCSS}
              className="px-3 py-1.5 text-[10px] font-bold border border-(--navBorder) rounded hover:bg-foreground/5 hover:border-(--brand) transition-colors"
            >
              Export CSS
            </button>
            <button
              onClick={exportAsJSON}
              className="px-3 py-1.5 text-[10px] font-bold border border-(--navBorder) rounded hover:bg-foreground/5 hover:border-(--brand) transition-colors"
            >
              JSON
            </button>
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="flex flex-1 gap-2 mx-2 mb-2 min-h-0">

        {/* ── Left panel ── */}
        <div
          className="flex flex-col ml-2 border border-(--navBorder) rounded-md bg-foreground/[0.015] overflow-y-auto custom-scrollbar flex-shrink-0"
          style={{ width: "20%" }}
        >

          {/* Direction */}
          <div className="p-4 border-b border-(--navBorder) flex-shrink-0">
            <span className="text-[8px] font-bold text-foreground/25 uppercase tracking-widest block mb-3">
              Direction
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setDirection("warm")}
                className={`flex-1 py-2.5 rounded-md text-[10px] font-bold border transition-all ${
                  direction === "warm"
                    ? "border-(--brand) text-(--brand) bg-foreground/[0.03]"
                    : "border-(--navBorder) text-foreground/40 hover:text-foreground/70 hover:border-foreground/30"
                }`}
              >
                🔆 Warm
              </button>
              <button
                onClick={() => setDirection("cool")}
                className={`flex-1 py-2.5 rounded-md text-[10px] font-bold border transition-all ${
                  direction === "cool"
                    ? "border-(--brand) text-(--brand) bg-foreground/[0.03]"
                    : "border-(--navBorder) text-foreground/40 hover:text-foreground/70 hover:border-foreground/30"
                }`}
              >
                ❄️ Cool
              </button>
            </div>
          </div>

          {/* Intensity slider */}
          <div className="p-4 border-b border-(--navBorder) flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[8px] font-bold text-foreground/25 uppercase tracking-widest">
                Intensity
              </span>
              <span className="text-[10px] font-mono font-bold text-(--brand)">
                {(amount * 100).toFixed(0)}%
              </span>
            </div>
            {/* Custom styled slider */}
            <div className="relative h-5 flex items-center">
              <div
                className="absolute w-full h-2 rounded-full"
                style={{ background: sliderTrackStyle }}
              />
              <input
                type="range"
                min="0.05"
                max="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                className="relative w-full h-2 rounded-full appearance-none cursor-pointer bg-transparent accent-(--brand)"
                style={{ WebkitAppearance: "none" }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[8px] text-foreground/25">Subtle</span>
              <span className="text-[8px] text-foreground/25">Full</span>
            </div>
          </div>

          {/* Presets */}
          <div className="p-4 flex-shrink-0">
            <span className="text-[8px] font-bold text-foreground/25 uppercase tracking-widest block mb-3">
              Presets
            </span>
            <div className="flex flex-col gap-1.5">
              {PRESETS.map((preset) => {
                const isActive =
                  direction === preset.direction &&
                  Math.abs(amount - preset.amount) < 0.01;
                return (
                  <button
                    key={preset.label}
                    onClick={() => applyPreset(preset)}
                    className={`w-full px-3 py-2 rounded-md text-left border transition-all ${
                      isActive
                        ? "border-(--brand) bg-foreground/[0.03]"
                        : "border-(--navBorder) hover:border-foreground/30 hover:bg-foreground/[0.02]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold ${
                          isActive ? "text-(--brand)" : "text-foreground/60"
                        }`}
                      >
                        {preset.label}
                      </span>
                      <span className="text-[8px] font-mono text-foreground/30">
                        {(preset.amount * 100).toFixed(0)}%
                      </span>
                    </div>
                    <span className="text-[8px] text-foreground/30">
                      {preset.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Palette preview — original colors */}
          {palette.length > 0 && (
            <div className="p-4 border-t border-(--navBorder) flex-shrink-0">
              <span className="text-[8px] font-bold text-foreground/25 uppercase tracking-widest block mb-3">
                Your Palette
              </span>
              <div className="flex gap-1.5 flex-wrap">
                {palette.map((c, i) => {
                  const hex = oklchToHex(c.value.l, c.value.c, c.value.h);
                  return (
                    <div
                      key={i}
                      className="h-7 w-7 rounded border border-(--navBorder)/50 shadow-sm"
                      style={{ background: hex }}
                      title={hex}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: results canvas ── */}
        <div className="flex-1 mr-2 border border-(--navBorder) rounded-md overflow-hidden bg-gradient-to-br from-foreground/[0.01] to-foreground/[0.03] relative min-w-0">
          <div className="h-full overflow-y-auto custom-scrollbar p-6">

            {palette.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-[11px] text-foreground/30">
                  No colors in palette yet.
                </p>
              </div>
            ) : (
              <div className="space-y-10">
                {shiftedPalette.map((colorData) => (
                  <div
                    key={colorData.colorIndex}
                    className="space-y-4 pb-10 border-b border-(--navBorder) last:border-0"
                  >
                    {/* Color row header */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full border border-black/10 shadow-sm"
                        style={{ backgroundColor: colorData.baseHex }}
                      />
                      <span className="text-[11px] font-bold text-foreground/80 uppercase tracking-wider">
                        Color {colorData.colorIndex + 1}
                      </span>
                      <span className="text-[9px] font-mono text-foreground/30">
                        {colorData.baseHex}
                      </span>
                      <span className="text-[8px] text-foreground/20">
                        → {direction} shift {(amount * 100).toFixed(0)}%
                      </span>
                    </div>

                    {/* Gradient strip: base → shifted */}
                    <div className="flex h-16 rounded-lg overflow-hidden border border-(--navBorder) shadow-sm">
                      {colorData.steps.map((step, si) => {
                        const isLast = si === colorData.steps.length - 1;
                        return (
                          <div
                            key={si}
                            onClick={() => handleColorClick(step.hex)}
                            className="flex-1 cursor-pointer group relative transition-all hover:flex-[1.5]"
                            style={{ backgroundColor: step.hex }}
                            title={step.hex}
                          >
                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity text-white">
                              <span className="text-[9px] font-mono font-bold">
                                {step.isBase ? "BASE" : `${(step.stepAmount * amount * 100).toFixed(0)}%`}
                              </span>
                            </div>
                            {isLast && (
                              <div className="absolute top-1 right-1">
                                <span className="text-[7px] font-bold px-1 py-0.5 rounded bg-black/30 text-white">
                                  {direction === "warm" ? "🔆" : "❄️"}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Before / After comparison + detail cards */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Before */}
                      <div
                        onClick={() => handleColorClick(colorData.baseHex)}
                        className="group p-3 bg-background border border-(--navBorder) rounded-lg cursor-pointer transition-all hover:border-(--brand) hover:shadow-md"
                      >
                        <div
                          className="w-full h-16 rounded-md border border-black/5 mb-3 flex items-end justify-start p-2 transition-transform group-hover:scale-[1.02]"
                          style={{ backgroundColor: colorData.baseHex }}
                        >
                          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-black/20 text-white">
                            ORIGINAL
                          </span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-foreground/80 block">
                          {colorData.baseHex.toUpperCase()}
                        </span>
                        <div className="flex gap-2 text-[8px] font-mono text-foreground/40 mt-0.5">
                          <span>L:{(colorData.base.l * 100).toFixed(0)}</span>
                          <span>C:{colorData.base.c.toFixed(2)}</span>
                          <span>H:{colorData.base.h.toFixed(0)}°</span>
                        </div>
                      </div>

                      {/* After */}
                      {(() => {
                        const final = colorData.steps[colorData.steps.length - 1];
                        const textColor =
                          chroma.contrast(final.hex, "white") >
                          chroma.contrast(final.hex, "black")
                            ? "white"
                            : "black";
                        return (
                          <div
                            onClick={() => handleColorClick(final.hex)}
                            className="group p-3 bg-background border border-(--navBorder) rounded-lg cursor-pointer transition-all hover:border-(--brand) hover:shadow-md"
                          >
                            <div
                              className="w-full h-16 rounded-md border border-black/5 mb-3 flex items-end justify-start p-2 transition-transform group-hover:scale-[1.02]"
                              style={{ backgroundColor: final.hex }}
                            >
                              <span
                                className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-black/20"
                                style={{ color: textColor }}
                              >
                                {direction === "warm" ? "🔆 WARM" : "❄️ COOL"}
                              </span>
                            </div>
                            <span className="text-[11px] font-mono font-bold text-foreground/80 block">
                              {final.hex.toUpperCase()}
                            </span>
                            <div className="flex gap-2 text-[8px] font-mono text-foreground/40 mt-0.5">
                              <span>L:{final.l}</span>
                              <span>C:{final.c}</span>
                              <span>H:{final.h}°</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-(--navBorder)">
                              {final.wcagAAA && (
                                <div className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-[8px] font-bold text-emerald-600 uppercase">
                                  AAA
                                </div>
                              )}
                              {final.wcagAA && !final.wcagAAA && (
                                <div className="px-1.5 py-0.5 bg-yellow-500/10 border border-yellow-500/30 rounded text-[8px] font-bold text-yellow-600 uppercase">
                                  AA
                                </div>
                              )}
                              {!final.wcagAA && (
                                <div className="px-1.5 py-0.5 bg-red-500/10 border border-red-500/30 rounded text-[8px] font-bold text-red-600 uppercase">
                                  Fail
                                </div>
                              )}
                              <span className="text-[8px] text-foreground/30 ml-auto">
                                ↑{Math.abs(final.h - colorData.base.h).toFixed(0)}° hue
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Intermediate steps — all 5 step cards */}
                    <div className="grid grid-cols-5 gap-2">
                      {colorData.steps.map((step, si) => {
                        const textColor =
                          chroma.contrast(step.hex, "white") >
                          chroma.contrast(step.hex, "black")
                            ? "white"
                            : "black";
                        return (
                          <div
                            key={si}
                            onClick={() => handleColorClick(step.hex)}
                            className="group p-2 bg-background border border-(--navBorder) rounded-lg cursor-pointer transition-all hover:border-(--brand) hover:shadow-lg"
                          >
                            <div
                              className="w-full h-14 rounded-md border border-black/5 mb-2 flex items-center justify-center transition-transform group-hover:scale-105"
                              style={{ backgroundColor: step.hex, color: textColor }}
                            >
                              <span className="text-[9px] font-bold font-mono opacity-60 group-hover:opacity-100">
                                {step.isBase ? "0%" : `${(step.stepAmount * amount * 100).toFixed(0)}%`}
                              </span>
                            </div>
                            <span className="text-[9px] font-mono font-bold text-foreground/70 block truncate">
                              {step.hex.toUpperCase()}
                            </span>
                            <div className="flex gap-1 text-[7px] font-mono text-foreground/30 mt-0.5">
                              <span>H:{step.h}°</span>
                            </div>
                            <div className="mt-1.5 pt-1.5 border-t border-(--navBorder)">
                              {step.wcagAAA ? (
                                <span className="text-[7px] font-bold text-emerald-600">AAA</span>
                              ) : step.wcagAA ? (
                                <span className="text-[7px] font-bold text-yellow-600">AA</span>
                              ) : (
                                <span className="text-[7px] font-bold text-red-500">Fail</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Copied toast */}
          {copiedColor && (
            <div className="absolute bottom-6 right-6 bg-foreground text-background px-4 py-2 rounded-full shadow-2xl z-50 text-[10px] font-bold uppercase tracking-widest animate-in slide-in-from-bottom-2">
              {copiedMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
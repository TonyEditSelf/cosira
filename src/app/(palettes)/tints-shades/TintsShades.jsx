import { useMemo, useState } from "react";
import chroma from "chroma-js";
import { useColorPaletteContext } from "../ColorContext";

export default function TintsShades() {
  const { palette } = useColorPaletteContext();
  const [steps, setSteps] = useState(35);
  const [copiedColor, setCopiedColor] = useState(null);

  const tonalScales = useMemo(() => {
    return palette.map((color, index) => {
      const baseHex = chroma
        .oklch(color.value.l, color.value.c, color.value.h)
        .hex();
      const baseColor = chroma(baseHex);
      const [baseL] = baseColor.oklch();

      // Create scale from dark to light using absolute lightness values
      const lightnesses = [];
      for (let i = 0; i < steps; i++) {
        // Linear distribution from 0.1 to 0.98
        lightnesses.push(0.1 + (0.88 * i) / (steps - 1));
      }

      const scale = lightnesses.map((l) => {
        return chroma(baseHex).set("oklch.l", l).hex();
      });

      // Find which step is closest to the original color's lightness
      let closestIndex = 0;
      let minDiff = Infinity;
      scale.forEach((hex, i) => {
        const [l] = chroma(hex).oklch();
        const diff = Math.abs(l - baseL);
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = i;
        }
      });

      return {
        baseHex,
        baseL: baseL.toFixed(3),
        baseIndex: closestIndex,
        scale: scale.map((hex, i) => {
          const c = chroma(hex);
          const [l, ch, h] = c.oklch();
          return {
            hex,
            l: l.toFixed(3),
            c: ch.toFixed(3),
            h: h.toFixed(1),
            isBase: i === closestIndex,
          };
        }),
        originalIndex: index,
      };
    });
  }, [palette, steps]);

  const handleColorClick = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const exportAllScales = () => {
    const css = tonalScales
      .map((scale, i) => {
        const vars = scale.scale
          .map((c, j) => `  --color-${i + 1}-${j + 1}: ${c.hex};`)
          .join("\n");
        return vars;
      })
      .join("\n");

    navigator.clipboard.writeText(`:root {\n${css}\n}`);
    setCopiedColor("CSS Variables");
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="hidden bg-background lg:flex flex-col pt-3 h-full">
      <div className="flex flex-col gap-3 flex-1 ml-2 mr-2 mb-2 bg-background overflow-hidden">
        {/* Header Controls */}
        <div className="p-4 border border-(--navBorder) rounded-md bg-foreground/[0.01]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                  Steps per Color
                </span>
                <input
                  type="range"
                  min="15"
                  max="40"
                  value={steps}
                  onChange={(e) => setSteps(parseInt(e.target.value))}
                  className="w-32 h-1.5 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-(--brand)"
                />
                <span className="text-[10px] font-mono font-bold bg-(--brand)/10 text-(--brand) px-2 py-0.5 rounded min-w-[32px] text-center">
                  {steps}
                </span>
              </div>

              <div className="h-4 w-[1px] bg-(--navBorder)" />

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                  Palette Colors
                </span>
                <span className="text-[10px] font-mono font-bold bg-foreground/5 text-foreground/60 px-2 py-0.5 rounded">
                  {palette.length}
                </span>
              </div>

              <div className="h-4 w-[1px] bg-(--navBorder)" />

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                  Total Swatches
                </span>
                <span className="text-[10px] font-mono font-bold bg-foreground/5 text-foreground/60 px-2 py-0.5 rounded">
                  {palette.length * steps}
                </span>
              </div>
            </div>

            <button
              onClick={exportAllScales}
              className="px-4 py-1.5 text-[10px] font-bold border border-(--navBorder) rounded hover:bg-(--brand) hover:text-white transition-all uppercase cursor-pointer"
            >
              Export CSS
            </button>
          </div>
        </div>

        {/* Tonal Scales Grid */}
        <div className="flex-1 border border-(--navBorder) rounded-md overflow-hidden bg-gradient-to-br from-foreground/[0.01] to-foreground/[0.03] relative">
          <div className="h-full overflow-y-auto custom-scrollbar p-6">
            <div
              className="inline-grid gap-x-0.5 gap-y-[0.9px]"
              style={{ gridTemplateColumns: `repeat(${steps}, 1fr)` }}
            >
              {tonalScales.map((tonal) =>
                tonal.scale.map((color, stepIndex) => {
                  const textColor =
                    chroma.contrast(color.hex, "white") >
                    chroma.contrast(color.hex, "black")
                      ? "#ffffff"
                      : "#000000";

                  return (
                    <div
                      key={`${tonal.originalIndex}-${stepIndex}`}
                      onClick={() => handleColorClick(color.hex)}
                      className={`
                        w-8 h-8 cursor-pointer
                        transition-all duration-200
                        hover:scale-[1.5] hover:shadow-2xl hover:z-50 over:rounded-lg
                        group relative
                        ${color.isBase ? "ring-2 ring-(--brand) ring-inset z-[1]" : ""}
                      `}
                      style={{ backgroundColor: color.hex }}
                      title={color.hex}
                    >
                      {/* Hover Info */}
                      <div
                        className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-sm rounded-xs p-1 gap-0"
                        style={{ color: textColor }}
                      >
                        <div className="text-[10px] font-mono font-bold tracking-tight leading-tight scale-[0.6] origin-center">
                          {color.hex}
                        </div>
                        <div className="text-[10px] font-mono opacity-90 leading-tight scale-[0.6] origin-center">
                          L: {color.l}
                        </div>
                      </div>

                      {/* Base Indicator */}
                      {color.isBase && (
                        <div className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-(--brand) shadow-md group-hover:w-1.5 group-hover:h-1.5 transition-all" />
                      )}
                    </div>
                  );
                }),
              )}
            </div>
          </div>

          {/* Copy Notification */}
          {copiedColor && (
            <div className="absolute bottom-6 right-6 bg-foreground text-background px-4 py-2 rounded-full shadow-2xl z-50 text-[10px] font-bold uppercase tracking-widest animate-bounce">
              Copied {copiedColor}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

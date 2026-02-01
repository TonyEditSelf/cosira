import { useMemo, useState } from "react";
import chroma from "chroma-js";
import { useColorPaletteContext } from "../ColorContext";

export default function Tonalist() {
  const { palette } = useColorPaletteContext();
  const [copiedColor, setCopiedColor] = useState(null);
  const [copiedMessage, setCopiedMessage] = useState("");
  const [colorNames, setColorNames] = useState({});
  const [mode, setMode] = useState("standard"); // standard or granular
  const [granularSteps, setGranularSteps] = useState(20);

  // Generate tints & shades based on mode
  const tintShadeScales = useMemo(() => {
    if (mode === "standard") {
      // Standard 10-step scale with proper weights
      const weights = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
      return palette.map((color, index) => {
        const baseHex = chroma
          .oklch(color.value.l, color.value.c, color.value.h)
          .hex();

        return {
          baseHex,
          name: colorNames[index] || `Color ${index + 1}`,
          scale: weights.map((weight) => {
            // Map weights to lightness: 50=0.95, 500=base, 900=0.1
            let targetL;
            if (weight < 500) {
              targetL =
                color.value.l + ((500 - weight) / 450) * (0.95 - color.value.l);
            } else {
              targetL =
                color.value.l - ((weight - 500) / 400) * (color.value.l - 0.1);
            }

            const hex = chroma
              .oklch(targetL, color.value.c, color.value.h)
              .hex();
            const [l, c, h] = chroma(hex).oklch();

            // Contrast checks
            const contrastWhite = chroma.contrast(hex, "white");
            const contrastBlack = chroma.contrast(hex, "black");
            const wcagAA = contrastWhite >= 4.5 || contrastBlack >= 4.5;
            const wcagAAA = contrastWhite >= 7 || contrastBlack >= 7;

            return {
              weight,
              hex,
              l: (l * 100).toFixed(0),
              c: c.toFixed(2),
              h: h.toFixed(0),
              contrastWhite: contrastWhite.toFixed(1),
              contrastBlack: contrastBlack.toFixed(1),
              wcagAA,
              wcagAAA,
              isBase: weight === 500,
            };
          }),
          originalIndex: index,
        };
      });
    } else {
      // Granular mode with custom number of steps
      return palette.map((color, index) => {
        const baseHex = chroma
          .oklch(color.value.l, color.value.c, color.value.h)
          .hex();
        const [baseL] = chroma(baseHex).oklch();

        // Create linear lightness distribution
        const lightnesses = [];
        for (let i = 0; i < granularSteps; i++) {
          lightnesses.push(0.05 + (0.9 * i) / (granularSteps - 1));
        }

        const scale = lightnesses.map((targetL, i) => {
          const hex = chroma.oklch(targetL, color.value.c, color.value.h).hex();
          const [l, c, h] = chroma(hex).oklch();

          // Contrast checks
          const contrastWhite = chroma.contrast(hex, "white");
          const contrastBlack = chroma.contrast(hex, "black");
          const wcagAA = contrastWhite >= 4.5 || contrastBlack >= 4.5;
          const wcagAAA = contrastWhite >= 7 || contrastBlack >= 7;

          return {
            weight: i + 1,
            hex,
            l: (l * 100).toFixed(0),
            c: c.toFixed(2),
            h: h.toFixed(0),
            contrastWhite: contrastWhite.toFixed(1),
            contrastBlack: contrastBlack.toFixed(1),
            wcagAA,
            wcagAAA,
            isBase: false, // Will be set after we find the closest
            actualL: l, // Keep for finding closest
          };
        });

        // Find the single closest step to the base color
        let closestIndex = 0;
        let minDiff = Infinity;
        scale.forEach((step, i) => {
          const diff = Math.abs(step.actualL - baseL);
          if (diff < minDiff) {
            minDiff = diff;
            closestIndex = i;
          }
        });
        scale[closestIndex].isBase = true;

        return {
          baseHex,
          name: colorNames[index] || `Color ${index + 1}`,
          scale,
          originalIndex: index,
        };
      });
    }
  }, [palette, colorNames, mode, granularSteps]);

  const handleColorClick = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setCopiedMessage(`Copied ${hex}`);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const handleNameChange = (index, newName) => {
    setColorNames((prev) => ({
      ...prev,
      [index]: newName,
    }));
  };

  const exportAsCSS = () => {
    const css = tintShadeScales
      .map((scale) => {
        const name = scale.name.toLowerCase().replace(/\s+/g, "-");
        const vars = scale.scale
          .map((c) => `  --${name}-${c.weight}: ${c.hex};`)
          .join("\n");
        return vars;
      })
      .join("\n");

    navigator.clipboard.writeText(`:root {\n${css}\n}`);
    setCopiedMessage("Copied all scales as CSS variables!");
    setCopiedColor("css");
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const exportAsTailwind = () => {
    const colors = tintShadeScales.map((scale) => {
      const name = scale.name.toLowerCase().replace(/\s+/g, "-");
      const shades = scale.scale
        .map((c) => `          ${c.weight}: '${c.hex}',`)
        .join("\n");
      return `        '${name}': {\n${shades}\n        }`;
    });

    const tailwind = `// Add to your tailwind.config.js\ncolors: {\n${colors.join(",\n")}\n}`;
    navigator.clipboard.writeText(tailwind);
    setCopiedMessage("Copied as Tailwind config!");
    setCopiedColor("tailwind");
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const exportAsJSON = () => {
    const json = tintShadeScales.map((scale) => ({
      name: scale.name,
      base: scale.baseHex,
      shades: Object.fromEntries(scale.scale.map((c) => [c.weight, c.hex])),
    }));

    navigator.clipboard.writeText(JSON.stringify(json, null, 2));
    setCopiedMessage("Copied as JSON!");
    setCopiedColor("json");
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="hidden bg-background lg:flex flex-col pt-3 h-full">
      <div className="flex flex-col gap-3 flex-1 ml-2 mr-2 mb-2 bg-background overflow-hidden">
        {/* Header Controls */}
        <div className="p-4 border border-(--navBorder) rounded-md bg-foreground/[0.015]">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              {/* MODE TOGGLE */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                  Mode
                </span>
                <div className="flex bg-foreground/5 p-0.5 rounded-lg border border-(--navBorder)">
                  <button
                    onClick={() => setMode("standard")}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all uppercase ${
                      mode === "standard"
                        ? "bg-background text-(--brand) shadow-sm"
                        : "text-foreground/50 hover:text-foreground"
                    }`}
                  >
                    Standard
                  </button>
                  <button
                    onClick={() => setMode("granular")}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all uppercase ${
                      mode === "granular"
                        ? "bg-background text-(--brand) shadow-sm"
                        : "text-foreground/50 hover:text-foreground"
                    }`}
                  >
                    Granular
                  </button>
                </div>
              </div>

              {/* GRANULAR STEPS SLIDER (only shown in granular mode) */}
              {mode === "granular" && (
                <>
                  <div className="h-4 w-[1px] bg-(--navBorder)" />
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                      Steps
                    </span>
                    <input
                      type="range"
                      min="10"
                      max="40"
                      value={granularSteps}
                      onChange={(e) =>
                        setGranularSteps(parseInt(e.target.value))
                      }
                      className="w-28 h-1.5 cursor-pointer accent-(--brand)"
                    />
                    <span className="text-[10px] font-mono font-bold text-(--brand)">
                      {granularSteps}
                    </span>
                  </div>
                </>
              )}

              <div className="h-4 w-[1px] bg-(--navBorder)" />

              <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                Tints & Shades Generator
              </span>
              <div className="h-4 w-[1px] bg-(--navBorder)" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-foreground/40 uppercase">
                  Palette Colors
                </span>
                <span className="text-[10px] font-mono font-bold bg-foreground/5 text-(--brand) px-2 py-0.5 rounded">
                  {palette.length}
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
                onClick={exportAsTailwind}
                className="px-3 py-1.5 text-[10px] font-bold border border-(--navBorder) rounded hover:bg-foreground/5 hover:border-(--brand) transition-colors"
              >
                Tailwind
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

        {/* Scales */}
        <div className="flex-1 border border-(--navBorder) rounded-md overflow-hidden bg-gradient-to-br from-foreground/[0.01] to-foreground/[0.03] relative">
          <div className="h-full overflow-y-auto custom-scrollbar p-6">
            <div className="space-y-8">
              {tintShadeScales.map((colorScale) => (
                <div
                  key={colorScale.originalIndex}
                  className="space-y-4 pb-8 border-b border-(--navBorder) last:border-0"
                >
                  {/* Color Name Header */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full border border-black/10 shadow-sm"
                      style={{ backgroundColor: colorScale.baseHex }}
                    />
                    <input
                      type="text"
                      value={colorScale.name}
                      onChange={(e) =>
                        handleNameChange(
                          colorScale.originalIndex,
                          e.target.value,
                        )
                      }
                      placeholder={`Color ${colorScale.originalIndex + 1}`}
                      className="text-[11px] font-bold text-foreground/80 uppercase tracking-wider bg-transparent border-b border-transparent hover:border-(--navBorder) focus:border-(--brand) outline-none px-1 py-0.5 transition-colors"
                    />
                    <span className="text-[9px] font-mono text-foreground/30">
                      {colorScale.baseHex}
                    </span>
                    {mode === "granular" && (
                      <span className="text-[8px] font-bold text-foreground/20 uppercase ml-2">
                        {granularSteps} steps
                      </span>
                    )}
                  </div>

                  {/* Scale Progression */}
                  <div
                    className={`flex gap-1 rounded-lg overflow-hidden border border-(--navBorder) shadow-sm ${mode === "granular" ? "h-16" : "h-20"}`}
                  >
                    {colorScale.scale.map((color) => (
                      <div
                        key={color.weight}
                        onClick={() => handleColorClick(color.hex)}
                        className={`flex-1 cursor-pointer transition-all hover:flex-[1.5] group relative ${
                          color.isBase
                            ? "ring-2 ring-(--brand) ring-inset z-10"
                            : ""
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={`${color.weight} • ${color.hex}`}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 text-white text-[10px] font-mono font-bold transition-opacity">
                          {mode === "standard"
                            ? color.weight
                            : `#${color.weight}`}
                        </div>
                        {color.isBase && (
                          <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-(--brand) shadow-md" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Detailed Grid - Only show in standard mode or for granular mode with <= 15 steps */}
                  {(mode === "standard" || granularSteps <= 15) && (
                    <div
                      className={`grid gap-3 ${
                        mode === "standard"
                          ? "grid-cols-2 md:grid-cols-5 lg:grid-cols-10"
                          : "grid-cols-3 md:grid-cols-5 lg:grid-cols-" +
                            Math.min(granularSteps, 10)
                      }`}
                    >
                      {colorScale.scale.map((color) => {
                        const textColor =
                          chroma.contrast(color.hex, "white") >
                          chroma.contrast(color.hex, "black")
                            ? "white"
                            : "black";

                        return (
                          <div
                            key={color.weight}
                            onClick={() => handleColorClick(color.hex)}
                            className={`group p-3 bg-background border border-(--navBorder) rounded-lg cursor-pointer transition-all hover:border-(--brand) hover:shadow-lg ${
                              color.isBase ? "ring-1 ring-(--brand)/30" : ""
                            }`}
                          >
                            {/* Swatch */}
                            <div
                              className="w-full h-16 rounded-md shadow-inner border border-black/5 mb-3 flex items-center justify-center transition-transform group-hover:scale-105"
                              style={{
                                backgroundColor: color.hex,
                                color: textColor,
                              }}
                            >
                              <span className="text-[11px] font-bold font-mono opacity-60 group-hover:opacity-100">
                                {mode === "standard"
                                  ? color.weight
                                  : `#${color.weight}`}
                              </span>
                            </div>

                            {/* Info */}
                            <div className="space-y-2">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[11px] font-mono font-bold text-foreground/80">
                                  {color.hex.toUpperCase()}
                                </span>
                                <div className="flex gap-2 text-[8px] font-mono text-foreground/40">
                                  <span>L:{color.l}</span>
                                  <span>C:{color.c}</span>
                                  <span>H:{color.h}°</span>
                                </div>
                              </div>

                              {/* Contrast Badges */}
                              <div className="flex flex-wrap gap-1 pt-2 border-t border-(--navBorder)">
                                {color.wcagAAA && (
                                  <div className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-[8px] font-bold text-emerald-600 uppercase">
                                    AAA
                                  </div>
                                )}
                                {color.wcagAA && !color.wcagAAA && (
                                  <div className="px-1.5 py-0.5 bg-yellow-500/10 border border-yellow-500/30 rounded text-[8px] font-bold text-yellow-600 uppercase">
                                    AA
                                  </div>
                                )}
                                {!color.wcagAA && (
                                  <div className="px-1.5 py-0.5 bg-red-500/10 border border-red-500/30 rounded text-[8px] font-bold text-red-600 uppercase">
                                    Fail
                                  </div>
                                )}
                              </div>

                              {/* Contrast Values */}
                              <div className="flex flex-col gap-1 text-[8px] text-foreground/40">
                                <div className="flex items-center justify-between">
                                  <span>vs White</span>
                                  <span className="font-mono font-bold">
                                    {color.contrastWhite}:1
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>vs Black</span>
                                  <span className="font-mono font-bold">
                                    {color.contrastBlack}:1
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}

              {/* Compact view message for granular mode with many steps - show once at bottom */}
              {mode === "granular" && granularSteps > 15 && (
                <div className="p-4 bg-foreground/5 border border-(--navBorder) rounded-lg text-center">
                  <span className="text-[10px] text-foreground/40">
                    Detailed view hidden for {granularSteps} steps. Hover over
                    the gradient bars above to see individual colors.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Copy Notification */}
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

import { useMemo, useState } from "react";
import chroma from "chroma-js";
import { useColorPaletteContext } from "../ColorContext";

// ---------- ACCESSIBILITY HELPERS ----------
const getReadableTextColor = (bg) =>
  chroma.contrast(bg, "white") > chroma.contrast(bg, "black")
    ? "#FFFFFF"
    : "#000000";

function UIPreview({ base, hover, active }) {
  return (
    <div className="flex gap-1 justify-center items-center mt-7">
      <button
        style={{ background: base, color: getReadableTextColor(base) }}
        className="px-3 py-1.5 rounded-md text-[11px] font-bold"
      >
        Default
      </button>
      <button
        style={{ background: hover, color: getReadableTextColor(hover) }}
        className="px-3 py-1.5 rounded-md text-[11px] font-bold"
      >
        Hover
      </button>
      <button
        style={{ background: active, color: getReadableTextColor(active) }}
        className="px-3 py-1.5 rounded-md text-[11px] font-bold"
      >
        Active
      </button>
    </div>
  );
}

export default function ColorAdjust() {
  const { palette } = useColorPaletteContext();
  const [hoverIntensity, setHoverIntensity] = useState(0.5);
  const [activeIntensity, setActiveIntensity] = useState(0.8);
  const [copiedColor, setCopiedColor] = useState(null);
  const [copiedMessage, setCopiedMessage] = useState("");

  // Helper to get hex from oklch palette object
  const getHex = (c) => chroma.oklch(c.value.l, c.value.c, c.value.h).hex();

  // Generate interaction states for each color
  const colorStates = useMemo(() => {
    return palette.map((color, index) => {
      const base = chroma.oklch(color.value.l, color.value.c, color.value.h);

      return {
        index,
        base: base.hex(),
        hover: base.brighten(hoverIntensity * 0.5).hex(),
        active: base.darken(activeIntensity).hex(),
      };
    });
  }, [palette, hoverIntensity, activeIntensity]);

  // Check for similar colors
  const similarityWarnings = useMemo(() => {
    const warnings = [];
    for (let i = 0; i < colorStates.length; i++) {
      for (let j = i + 1; j < colorStates.length; j++) {
        const dE = chroma.deltaE(
          chroma(colorStates[i].base),
          chroma(colorStates[j].base),
        );
        if (dE < 6) {
          warnings.push({
            colors: [i, j],
            deltaE: dE.toFixed(1),
            message: `Color ${i + 1} & ${j + 1} are too similar (ΔE ${dE.toFixed(1)}) - consider adjusting one`,
          });
        }
      }
    }
    return warnings;
  }, [colorStates]);

  const handleColorClick = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setCopiedMessage(`Copied ${hex}`);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const exportAsCSS = () => {
    const css = colorStates
      .map((color, i) => {
        return `  --color-${i + 1}: ${color.base};
  --color-${i + 1}-hover: ${color.hover};
  --color-${i + 1}-active: ${color.active};`;
      })
      .join("\n");

    const fullCSS = `:root {\n${css}\n}`;
    navigator.clipboard.writeText(fullCSS);
    setCopiedMessage("Copied all colors as CSS variables!");
    setCopiedColor("css");
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const exportAsJSON = () => {
    const json = colorStates.map((color, i) => ({
      name: `color-${i + 1}`,
      base: color.base,
      hover: color.hover,
      active: color.active,
    }));

    navigator.clipboard.writeText(JSON.stringify(json, null, 2));
    setCopiedMessage("Copied all colors as JSON!");
    setCopiedColor("json");
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="hidden bg-background lg:flex flex-col pt-3 h-full">
      <div className="flex flex-col gap-3 flex-1 ml-2 mr-2 mb-2 bg-background overflow-hidden">
        {/* Header Controls */}
        <div className="p-4 border border-(--navBorder) rounded-md bg-foreground/[0.015]">
          <div className="flex items-center gap-8 flex-wrap">
            {/* HOVER INTENSITY */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                Hover
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={hoverIntensity}
                onChange={(e) => setHoverIntensity(parseFloat(e.target.value))}
                className="w-28 h-1.5 accent-(--brand)"
              />
              <span className="text-[10px] font-mono text-(--brand)">
                {(hoverIntensity * 100).toFixed(0)}%
              </span>
            </div>

            {/* ACTIVE INTENSITY */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                Active
              </span>
              <input
                type="range"
                min="0"
                max="2"
                step="0.01"
                value={activeIntensity}
                onChange={(e) => setActiveIntensity(parseFloat(e.target.value))}
                className="w-28 h-1.5 accent-(--brand)"
              />
              <span className="text-[10px] font-mono text-(--brand)">
                {(activeIntensity * 100).toFixed(0)}%
              </span>
            </div>

            {/* EXPORT BUTTONS */}
            <div className="ml-auto flex items-center gap-2">
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
                Export JSON
              </button>
            </div>
          </div>
        </div>

        {/* Workspace */}
        <div className="flex-1 border border-(--navBorder) rounded-md overflow-hidden bg-gradient-to-b from-foreground/[0.01] to-transparent relative">
          <div className="h-full overflow-y-auto custom-scrollbar p-6">
            <div className="flex flex-col gap-8">
              {/* Similarity Warnings */}
              {similarityWarnings.length > 0 && (
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 space-y-2">
                  <div className="text-[10px] font-bold text-yellow-600 uppercase tracking-widest mb-2">
                    ⚠ Similarity Warnings
                  </div>
                  {similarityWarnings.map((warning, i) => (
                    <div
                      key={i}
                      className="text-[11px] text-yellow-700 flex items-center gap-2"
                    >
                      <div className="flex gap-1">
                        <div
                          className="w-4 h-4 rounded border border-yellow-600/30"
                          style={{
                            backgroundColor:
                              colorStates[warning.colors[0]].base,
                          }}
                        />
                        <div
                          className="w-4 h-4 rounded border border-yellow-600/30"
                          style={{
                            backgroundColor:
                              colorStates[warning.colors[1]].base,
                          }}
                        />
                      </div>
                      <span>{warning.message}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Color States Grid */}
              {colorStates.map((color) => (
                <div key={color.index} className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color.base }}
                    />
                    <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-tighter">
                      Color {color.index + 1}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* BASE STATE */}
                    <div
                      onClick={() => handleColorClick(color.base)}
                      className="group px-3 py-2 rounded-lg border border-(--navBorder) bg-background hover:border-(--brand) transition-all cursor-pointer relative overflow-hidden ring-1 ring-(--brand)/30 ring-inset bg-foreground/[0.01]"
                    >
                      <div className="flex items-center gap-3 relative z-10">
                        <div
                          className="w-12 h-12 rounded-lg shadow-inner flex items-center justify-center text-[8px] font-bold mix-blend-difference text-white"
                          style={{ backgroundColor: color.base }}
                        >
                          BASE
                        </div>
                        <div className="flex flex-col gap-[2px]">
                          <span className="text-[9px] font-bold text-foreground/80 leading-none mb-0">
                            Default State
                          </span>
                          <span className="text-[11px] font-mono text-foreground/40">
                            {color.base.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <UIPreview
                        base={color.base}
                        hover={color.hover}
                        active={color.active}
                      />
                    </div>

                    {/* HOVER STATE */}
                    <div
                      onClick={() => handleColorClick(color.hover)}
                      className="group px-3 py-2 rounded-lg border border-(--navBorder) bg-background hover:border-(--brand) transition-all cursor-pointer relative overflow-hidden"
                    >
                      <div className="flex items-center gap-3 relative z-10">
                        <div
                          className="w-12 h-12 rounded-lg shadow-inner"
                          style={{ backgroundColor: color.hover }}
                        />
                        <div className="flex flex-col gap-[2px]">
                          <span className="text-[9px] font-bold text-foreground/80 leading-none mb-0">
                            Hover State
                          </span>
                          <span className="text-[11px] font-mono text-foreground/40">
                            {color.hover.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ACTIVE STATE */}
                    <div
                      onClick={() => handleColorClick(color.active)}
                      className="group px-3 py-2 rounded-lg border border-(--navBorder) bg-background hover:border-(--brand) transition-all cursor-pointer relative overflow-hidden"
                    >
                      <div className="flex items-center gap-3 relative z-10">
                        <div
                          className="w-12 h-12 rounded-lg shadow-inner"
                          style={{ backgroundColor: color.active }}
                        />
                        <div className="flex flex-col gap-[2px]">
                          <span className="text-[9px] font-bold text-foreground/80 leading-none mb-0">
                            Active State
                          </span>
                          <span className="text-[11px] font-mono text-foreground/40">
                            {color.active.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

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

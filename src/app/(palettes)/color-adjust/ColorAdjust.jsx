import { useMemo, useState } from "react";
import chroma from "chroma-js";
import { useColorPaletteContext } from "../ColorContext";

// ---------- ACCESSIBILITY HELPERS ----------
const getReadableTextColor = (bg) =>
  chroma.contrast(bg, "white") > chroma.contrast(bg, "black")
    ? "#FFFFFF"
    : "#000000";

const getContrastRating = (bg) => {
  const white = chroma.contrast(bg, "white");
  const black = chroma.contrast(bg, "black");
  const best = Math.max(white, black);

  if (best >= 7) return { label: "AAA", color: "text-green-500" };
  if (best >= 4.5) return { label: "AA", color: "text-yellow-500" };
  return { label: "Fail", color: "text-red-500" };
};

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
  const [mode, setMode] = useState("interaction"); // interaction, focus, alignment
  const [intensity, setIntensity] = useState(0.5);
  const [copiedColor, setCopiedColor] = useState(null);

  // Helper to get hex from oklch palette object
  const getHex = (c) => chroma.oklch(c.value.l, c.value.c, c.value.h).hex();

  // --- MASTER CONTROL LOGIC ---
  const [globalRefinement, setGlobalRefinement] = useState({
    brightness: 0,
    saturation: 0,
    normalization: null,
  });

  const presets = {
    calm: { brightness: 0.3, saturation: -0.5, normalization: 0.75 },
    bold: { brightness: 0, saturation: 1, normalization: null },
    soft: { brightness: 0.5, saturation: -1, normalization: 0.8 },
  };

  const comparisonData = useMemo(() => {
    return palette.map((color) => {
      const original = chroma.oklch(
        color.value.l,
        color.value.c,
        color.value.h,
      );
      let refined = original;
      if (globalRefinement.brightness !== 0) {
        refined =
          globalRefinement.brightness > 0
            ? refined.brighten(globalRefinement.brightness)
            : refined.darken(Math.abs(globalRefinement.brightness));
      }
      if (globalRefinement.saturation !== 0) {
        refined =
          globalRefinement.saturation > 0
            ? refined.saturate(globalRefinement.saturation)
            : refined.desaturate(Math.abs(globalRefinement.saturation));
      }
      if (globalRefinement.normalization !== null) {
        refined = refined.set("oklch.l", globalRefinement.normalization);
      }
      return {
        original: original.hex(),
        refined: refined.hex(),
        deltaE: chroma.deltaE(original, refined).toFixed(1),
      };
    });
  }, [palette, globalRefinement]);

  const similarityWarnings = useMemo(() => {
    const warnings = [];
    for (let i = 0; i < comparisonData.length; i++) {
      for (let j = i + 1; j < comparisonData.length; j++) {
        const dE = chroma.deltaE(
          chroma(comparisonData[i].refined),
          chroma(comparisonData[j].refined),
        );
        if (dE < 6) {
          warnings.push(
            `Color ${i + 1} & ${j + 1} are visually similar (ΔE ${dE.toFixed(1)})`,
          );
        }
      }
    }
    return warnings;
  }, [comparisonData]);

  // Update your existing adjustedScales useMemo to use globalRefinement
  const adjustedScales = useMemo(() => {
    return palette.map((color, index) => {
      const pair = comparisonData[index];
      const base = chroma(pair.refined); // Use the refined color as the new base

      let variations = [];
      if (mode === "interaction") {
        variations = [
          { label: "Subtle Hover", hex: base.brighten(intensity * 0.5).hex() },
          { label: "Refined Base", hex: base.hex(), isBase: true },
          { label: "Deep Active", hex: base.darken(intensity).hex() },
        ];
      } else if (mode === "focus") {
        variations = [
          { label: "Ghosted", hex: base.desaturate(intensity * 3).hex() },
          { label: "Muted", hex: base.desaturate(intensity).hex() },
          { label: "Base", hex: base.hex(), isBase: true },
          { label: "Vivid", hex: base.saturate(intensity).hex() },
        ];
      } else if (mode === "alignment") {
        const targetL = 0.2 + intensity * 0.7;
        variations = [
          { label: "Base Color", hex: base.hex(), isBase: true },
          {
            label: `Aligned (L: ${targetL.toFixed(2)})`,
            hex: base.set("oklch.l", targetL).hex(),
          },
        ];
      }
      return { index, variations, baseHex: base.hex() };
    });
  }, [palette, mode, intensity, comparisonData]);

  const handleColorClick = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="hidden bg-background lg:flex flex-col pt-3 h-full">
      <div className="flex flex-col gap-3 flex-1 ml-2 mr-2 mb-2 bg-background overflow-hidden">
        {/* Header Controls */}

        <div className="p-4 border border-(--navBorder) rounded-md bg-foreground/[0.015]">
          <div className="flex items-center gap-8 flex-wrap">
            {/* MODE */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                Logic
              </span>
              <div className="flex bg-foreground/5 p-0.5 rounded-lg border border-(--navBorder)">
                {[
                  { id: "interaction", label: "States" },
                  { id: "focus", label: "Focus" },
                  { id: "alignment", label: "Align" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md uppercase ${
                      mode === m.id
                        ? "bg-background text-(--brand) shadow-sm"
                        : "text-foreground/50 hover:text-foreground"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* INTENSITY */}
            <div className="grid items-center gap-3 text-xs">
              <span className="text-[10px] font-bold text-foreground/40 uppercase">
                Intensity
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={intensity}
                onChange={(e) => setIntensity(parseFloat(e.target.value))}
                className="w-28 h-1.5 accent-(--brand)"
              />
              <span className="text-[10px] font-mono text-(--brand)">
                {(intensity * 100).toFixed(0)}%
              </span>
            </div>

            {/* PRESETS */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-foreground/40 uppercase">
                Presets
              </span>
              {Object.entries(presets).map(([name, p]) => (
                <button
                  key={name}
                  onClick={() => setGlobalRefinement(p)}
                  className="px-2 py-1 text-[9px] font-bold border border-(--navBorder) rounded hover:bg-foreground/5"
                >
                  {name}
                </button>
              ))}
            </div>

            {/* BRIGHTNESS */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-foreground/40 uppercase">
                Bright
              </span>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={globalRefinement.brightness}
                onChange={(e) =>
                  setGlobalRefinement((s) => ({
                    ...s,
                    brightness: parseFloat(e.target.value),
                  }))
                }
                className="w-24 h-1 accent-(--brand)"
              />
            </div>

            {/* SATURATION */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-foreground/40 uppercase">
                Sat
              </span>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={globalRefinement.saturation}
                onChange={(e) =>
                  setGlobalRefinement((s) => ({
                    ...s,
                    saturation: parseFloat(e.target.value),
                  }))
                }
                className="w-24 h-1 accent-(--brand)"
              />
            </div>

            {/* NORMALIZE */}
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setGlobalRefinement((s) => ({
                    ...s,
                    normalization: s.normalization === null ? 0.7 : null,
                  }))
                }
                className={`px-2 py-1 text-[9px] font-bold rounded border ${
                  globalRefinement.normalization !== null
                    ? "bg-(--brand) text-white border-(--brand)"
                    : "border-(--navBorder) text-foreground/40"
                }`}
              >
                Normalize
              </button>

              <div className="w-20 h-4 flex items-center">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={globalRefinement.normalization ?? 0.7}
                  onChange={(e) =>
                    setGlobalRefinement((s) => ({
                      ...s,
                      normalization: parseFloat(e.target.value),
                    }))
                  }
                  className={`w-20 h-1 accent-(--brand) transition-opacity ${
                    globalRefinement.normalization !== null
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                />
              </div>
            </div>

            {/* RESET */}
            <button
              onClick={() =>
                setGlobalRefinement({
                  brightness: 0,
                  saturation: 0,
                  normalization: null,
                })
              }
              className="ml-auto text-[9px] font-bold text-foreground/40 hover:text-(--brand)"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Workspace */}
        <div className="flex-1 border border-(--navBorder) rounded-md overflow-hidden bg-gradient-to-b from-foreground/[0.01] to-transparent relative">
          <div className="h-full overflow-y-auto custom-scrollbar p-6">
            <div className="flex flex-col gap-8">
              <div className="overflow-hidden border border-(--navBorder) rounded-xl bg-background shadow-sm">
                <div className="px-4 py-2 border-b border-(--navBorder) flex justify-between items-center bg-foreground/[0.01]">
                  <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest">
                    DNA Shift Analysis (Original Top | Refined Bottom)
                  </span>
                </div>
                <div className="flex h-20 w-full">
                  {comparisonData.map((pair, i) => (
                    <div
                      key={i}
                      className="flex-1 group relative flex flex-col border-r border-(--navBorder) last:border-0"
                    >
                      <div
                        className="flex-1"
                        style={{ backgroundColor: pair.original }}
                      />
                      <div
                        className="flex-1"
                        style={{ backgroundColor: pair.refined }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 text-white transition-opacity pointer-events-none">
                        <span className="text-[8px] font-mono font-bold">
                          ΔE {pair.deltaE}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {similarityWarnings.length > 0 && (
                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-[10px] font-bold text-yellow-600 space-y-1">
                  {similarityWarnings.map((w, i) => (
                    <div key={i}>⚠ {w}</div>
                  ))}
                </div>
              )}

              {adjustedScales.map((item) => (
                <div key={item.index} className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.baseHex }}
                    />
                    <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-tighter">
                      System Color {item.index + 1}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {item.variations.map((v, i) => (
                      <div
                        key={i}
                        onClick={() => handleColorClick(v.hex)}
                        className={`group px-3 py-2 rounded-lg border border-(--navBorder) bg-background hover:border-(--brand) transition-all cursor-pointer relative overflow-hidden ${v.isBase ? "ring-1 ring-(--brand)/30 ring-inset bg-foreground/[0.01]" : ""}`}
                      >
                        <div className="flex items-center gap-3 relative z-10">
                          <div
                            className="w-12 h-12 rounded-lg shadow-inner flex items-center justify-center text-[8px] font-bold mix-blend-difference text-white"
                            style={{ backgroundColor: v.hex }}
                          >
                            {v.isBase ? "BASE" : ""}
                          </div>
                          <div className="flex flex-col gap-[2px]">
                            <span className="text-[9px] font-bold text-foreground/80 leading-none mb-0">
                              {v.label}
                            </span>
                            <span className="text-[11px] font-mono text-foreground/40">
                              {v.hex.toUpperCase()}
                            </span>
                            {(() => {
                              const contrast = getContrastRating(v.hex);
                              return (
                                <span
                                  className={`text-[9px] font-bold ${contrast.color}`}
                                >
                                  Contrast: {contrast.label}
                                </span>
                              );
                            })()}
                          </div>
                        </div>

                        {/* REAL BUTTON PREVIEW (ONLY FOR INTERACTION MODE) */}
                        {mode === "interaction" &&
                          item.variations.length >= 3 && (
                            <UIPreview
                              base={item.variations[1].hex}
                              hover={item.variations[0].hex}
                              active={item.variations[2].hex}
                            />
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {copiedColor && (
            <div className="absolute bottom-6 right-6 bg-foreground text-background px-4 py-2 rounded-full shadow-2xl z-50 text-[10px] font-bold uppercase tracking-widest animate-in slide-in-from-bottom-2">
              Copied {copiedColor}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

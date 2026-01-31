import { useState, useMemo } from "react";
import chroma from "chroma-js";
import { useColorPaletteContext } from "../ColorContext";

const presetSecondColors = [
  { name: "Gold", hex: "#FFD700" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Bronze", hex: "#CD7F32" },
  { name: "Rose Gold", hex: "#B76E79" },
  { name: "Copper", hex: "#B87333" },
  { name: "Brass", hex: "#B5A642" },
  { name: "Neon Pink", hex: "#FF10F0" },
  { name: "Neon Green", hex: "#39FF14" },
  { name: "Neon Blue", hex: "#1F51FF" },
  { name: "Neon Orange", hex: "#FF6600" },
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Gray", hex: "#808080" },
  { name: "Navy", hex: "#000080" },
  { name: "Burgundy", hex: "#800020" },
];

const presetPercentages = [5, 10, 15, 25, 50, 75];

export default function BlendColors() {
  const { palette } = useColorPaletteContext();
  const [mode, setMode] = useState("palette");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [customBaseColor, setCustomBaseColor] = useState("#FF5733");
  const [blendColor, setBlendColor] = useState("#FFD700");
  const [customBlendColor, setCustomBlendColor] = useState("");
  const [percent, setPercent] = useState(10);
  const [copiedColor, setCopiedColor] = useState(null);
  const [savedColors, setSavedColors] = useState([]);
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const colorsToBlend = useMemo(() => {
    if (mode === "single" && selectedIndex !== null) {
      return [palette[selectedIndex]];
    }
    if (mode === "custom") {
      try {
        const chromaColor = chroma(customBaseColor);
        const [l, c, h] = chromaColor.oklch();
        return [{ value: { l, c, h } }];
      } catch {
        return [];
      }
    }
    return palette;
  }, [mode, selectedIndex, palette, customBaseColor]);

  const harmonySuggestions = useMemo(() => {
    let baseColor = null;
    if (mode === "single" && selectedIndex !== null && palette[selectedIndex]) {
      baseColor = palette[selectedIndex].value;
    } else if (mode === "custom") {
      try {
        const chromaColor = chroma(customBaseColor);
        const [l, c, h] = chromaColor.oklch();
        baseColor = { l, c, h };
      } catch {
        return [];
      }
    }

    if (baseColor) {
      const baseChroma = chroma.oklch(baseColor.l, baseColor.c, baseColor.h);
      return [
        {
          name: "Complement",
          hex: baseChroma.set("oklch.h", (baseColor.h + 180) % 360).hex(),
        },
        {
          name: "Analogous +",
          hex: baseChroma.set("oklch.h", (baseColor.h + 30) % 360).hex(),
        },
        {
          name: "Analogous -",
          hex: baseChroma.set("oklch.h", (baseColor.h - 30 + 360) % 360).hex(),
        },
        {
          name: "Triadic +",
          hex: baseChroma.set("oklch.h", (baseColor.h + 120) % 360).hex(),
        },
        {
          name: "Triadic -",
          hex: baseChroma.set("oklch.h", (baseColor.h - 120 + 360) % 360).hex(),
        },
      ];
    }
    return [];
  }, [selectedIndex, palette, mode, customBaseColor]);

  const blendedColors = useMemo(() => {
    return colorsToBlend.map((c, originalIndex) => {
      const baseHex = chroma.oklch(c.value.l, c.value.c, c.value.h).hex();
      const mixed = chroma.mix(baseHex, blendColor, percent / 100, "oklch");
      const [l, cVal, h] = mixed.oklch();
      return {
        baseHex,
        hex: mixed.hex(),
        l: l.toFixed(3),
        c: cVal.toFixed(3),
        h: h.toFixed(1),
        originalIndex: mode === "single" ? selectedIndex : originalIndex,
      };
    });
  }, [colorsToBlend, blendColor, percent, mode, selectedIndex]);

  const handleColorClick = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const handleSaveColor = (colorData) => {
    if (!savedColors.find((c) => c.hex === colorData.hex)) {
      setSavedColors([...savedColors, colorData]);
    }
  };

  const handleRemoveSaved = (hex) => {
    setSavedColors(savedColors.filter((c) => c.hex !== hex));
  };

  const exportAsCSS = () => {
    const cssVars = blendedColors
      .map((c, i) => `  --blend-color-${i + 1}: ${c.hex};`)
      .join("\n");
    navigator.clipboard.writeText(`:root {\n${cssVars}\n}`);
    setCopiedColor("CSS Variables");
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const exportAsJSON = () => {
    const json = JSON.stringify(
      blendedColors.map((c) => ({
        hex: c.hex,
        oklch: { l: c.l, c: c.c, h: c.h },
      })),
      null,
      2,
    );
    navigator.clipboard.writeText(json);
    setCopiedColor("JSON");
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const handleCustomColorChange = (e) => {
    const value = e.target.value;
    setCustomBlendColor(value);
    try {
      if (chroma.valid(value)) setBlendColor(value);
    } catch (err) {}
  };

  return (
    <div className="hidden bg-background lg:flex flex-col pt-3 h-full">
      <div className="flex flex-col gap-3 flex-1 ml-2 mr-2 mb-2 bg-background overflow-hidden">
        <div className="p-4 border border-(--navBorder) rounded-md bg-foreground/[0.01]">
          <div className="flex flex-row flex-wrap gap-8 items-start">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest block">
                Secondary Pigments
              </label>
              <div className="flex flex-wrap gap-1.5 max-w-[280px]">
                {presetSecondColors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setBlendColor(c.hex)}
                    className={`h-7 w-7 rounded-md cursor-pointer transition-all ${blendColor === c.hex ? "ring-2 ring-(--brand) ring-offset-1 ring-offset-background scale-110 shadow-sm" : "hover:scale-105 border border-(--navBorder)"}`}
                    style={{ background: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest block">
                Source Palette
              </label>
              <div className="flex flex-wrap gap-1.5 max-w-[500px]">
                {palette.map((c, i) => {
                  const hex = chroma
                    .oklch(c.value.l, c.value.c, c.value.h)
                    .hex();
                  return (
                    <button
                      key={i}
                      onClick={() => setBlendColor(hex)}
                      className={`h-7 w-7 rounded-md cursor-pointer transition-all ${blendColor === hex ? "ring-2 ring-(--brand) ring-offset-1 ring-offset-background scale-110 shadow-sm" : "hover:scale-105 border border-(--navBorder)/50"}`}
                      style={{ background: hex }}
                      title={hex}
                    />
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 min-w-[240px]">
              <label className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest block">
                Dynamic Harmonies & Custom
              </label>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {harmonySuggestions.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setBlendColor(c.hex)}
                    className={`h-7 w-7 rounded-md cursor-pointer transition-all ${blendColor === c.hex ? "ring-2 ring-(--brand) ring-offset-1 ring-offset-background scale-110 shadow-sm" : "hover:scale-105 border border-(--navBorder)"}`}
                    style={{ background: c.hex }}
                    title={c.name}
                  />
                ))}
                <input
                  type="color"
                  value={blendColor}
                  onChange={(e) => setBlendColor(e.target.value)}
                  className="h-7 w-7 rounded-md border border-(--navBorder) cursor-pointer"
                  title="Custom Picker"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customBlendColor}
                  onChange={handleCustomColorChange}
                  placeholder="HEX Code..."
                  className="w-32 px-2 py-1 text-[11px] font-mono border border-(--navBorder) rounded bg-background outline-none focus:border-(--brand) cursor-pointer"
                />
              </div>
            </div>

            <div className="ml-auto space-y-3">
              <label className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest block text-right">
                Engine Export
              </label>
              <div className="flex gap-2">
                <button
                  onClick={exportAsCSS}
                  className="px-3 py-1 text-[10px] font-bold border border-(--navBorder) rounded hover:bg-(--brand) hover:text-white transition-all uppercase cursor-pointer"
                >
                  CSS
                </button>
                <button
                  onClick={exportAsJSON}
                  className="px-3 py-1 text-[10px] font-bold border border-(--navBorder) rounded hover:bg-(--brand) hover:text-white transition-all uppercase cursor-pointer"
                >
                  JSON
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 flex-1 overflow-hidden">
          <div className="flex-1 border border-(--navBorder) rounded-md overflow-hidden relative bg-gradient-to-br from-foreground/[0.01] to-foreground/[0.03] flex flex-col">
            <div className="bg-background/95 backdrop-blur-sm border-b border-(--navBorder) px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-foreground/40 uppercase">
                    Processing:
                  </span>
                  <div className="flex bg-foreground/5 p-0.5 rounded-lg border border-(--navBorder)">
                    {["palette", "single", "custom"].map((m) => (
                      <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all uppercase cursor-pointer ${mode === m ? "bg-background text-(--brand) shadow-sm" : "text-foreground/50 hover:text-foreground"}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-4 w-[1px] bg-(--navBorder) mx-2" />

                <div className="flex items-center gap-4">
                  {mode === "single" && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-foreground/40 uppercase">
                        Source:
                      </span>
                      <div className="flex gap-1">
                        {palette.map((c, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedIndex(i)}
                            className={`h-5 w-5 rounded-full border cursor-pointer transition-all ${selectedIndex === i ? "ring-2 ring-(--brand) scale-110 shadow-md" : "border-foreground/20"}`}
                            style={{
                              background: chroma
                                .oklch(c.value.l, c.value.c, c.value.h)
                                .hex(),
                            }}
                            title="Select color from palette"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {mode === "custom" && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-foreground/40 uppercase">
                        Base:
                      </span>
                      <input
                        type="color"
                        value={customBaseColor}
                        onChange={(e) => setCustomBaseColor(e.target.value)}
                        className="h-6 w-10 rounded cursor-pointer border border-(--navBorder) bg-transparent"
                        title="Choose custom base color"
                      />
                      <span className="text-[10px] font-mono font-bold opacity-60 uppercase">
                        {customBaseColor}
                      </span>
                    </div>
                  )}
                </div>

                <div className="h-4 w-[1px] bg-(--navBorder) mx-2" />

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-foreground/40 uppercase">
                    Intensity:
                  </span>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={percent}
                    onChange={(e) => setPercent(parseInt(e.target.value))}
                    className="w-32 h-1.5 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-(--brand)"
                  />
                  <span className="text-[10px] font-mono font-bold bg-(--brand)/10 text-(--brand) px-1.5 py-0.5 rounded">
                    {percent}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                {blendedColors.map((c, i) => {
                  const textColor =
                    chroma.contrast(c.hex, "white") >
                    chroma.contrast(c.hex, "black")
                      ? "#ffffff"
                      : "#000000";
                  const isSaved = savedColors.some((s) => s.hex === c.hex);
                  return (
                    <div
                      key={i}
                      className="aspect-[4/5] flex flex-col justify-between p-2 font-mono text-[10px] transition-all hover:scale-105 hover:shadow-xl cursor-pointer relative group rounded-lg border border-black/5"
                      style={{ backgroundColor: c.hex, color: textColor }}
                      onClick={() => handleColorClick(c.hex)}
                    >
                      <div className="flex justify-between items-start">
                        <div
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: c.baseHex }}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveColor(c);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[12px]"
                        >
                          {isSaved ? "★" : "☆"}
                        </button>
                      </div>
                      <div className="text-center font-bold tracking-tighter uppercase">
                        {c.hex}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {copiedColor && (
              <div className="absolute bottom-6 right-6 bg-foreground text-background px-4 py-2 rounded-full shadow-2xl z-50 text-[10px] font-bold uppercase tracking-widest animate-bounce">
                Copied {copiedColor}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

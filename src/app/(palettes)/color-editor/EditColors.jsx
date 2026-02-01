import { useMemo, useState } from "react";
import chroma from "chroma-js";
import { useColorPaletteContext } from "../ColorContext";
import { RotateCcw, Check, AlertTriangle, Info } from "lucide-react";

export default function EditColors() {
  const { palette, setPalette } = useColorPaletteContext();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [adjustments, setAdjustments] = useState({ l: 0, c: 0, h: 0 });
  const [showSuccess, setShowSuccess] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [batchAdjustments, setBatchAdjustments] = useState({
    l: 0,
    c: 0,
    h: 0,
  });

  // Get the selected color with adjustments applied
  const originalColor = useMemo(() => {
    if (!palette[selectedColorIndex]) return null;
    return palette[selectedColorIndex].value;
  }, [palette, selectedColorIndex]);

  const adjustedColor = useMemo(() => {
    if (!originalColor) return null;

    return {
      l: Math.max(0, Math.min(1, originalColor.l + adjustments.l)),
      c: Math.max(0, Math.min(0.4, originalColor.c + adjustments.c)),
      h: (originalColor.h + adjustments.h + 360) % 360,
      a: originalColor.a || 1,
    };
  }, [originalColor, adjustments]);

  // Calculate suggestions for better contrast
  const suggestions = useMemo(() => {
    if (!adjustedColor) return [];

    const suggestionsList = [];
    const color = chroma.oklch(
      adjustedColor.l,
      adjustedColor.c,
      adjustedColor.h,
    );
    const white = chroma("#ffffff");
    const black = chroma("#000000");
    const contrastWhite = chroma.contrast(color, white);
    const contrastBlack = chroma.contrast(color, black);

    // Check if it fails WCAG AA on both
    if (contrastWhite < 4.5 && contrastBlack < 4.5) {
      // Suggest lightness adjustment
      if (adjustedColor.l < 0.5) {
        // Dark color, suggest darkening more
        const targetL = Math.max(0.1, adjustedColor.l - 0.15);
        const improvement = ((targetL - adjustedColor.l) * 100).toFixed(0);
        suggestionsList.push({
          type: "lighten",
          message: `Darken by ${Math.abs(improvement)}% for better contrast with white`,
          adjustment: { l: targetL - adjustedColor.l, c: 0, h: 0 },
        });
      } else {
        // Light color, suggest lightening more
        const targetL = Math.min(0.95, adjustedColor.l + 0.15);
        const improvement = ((targetL - adjustedColor.l) * 100).toFixed(0);
        suggestionsList.push({
          type: "lighten",
          message: `Brighten by ${improvement}% for better contrast with black`,
          adjustment: { l: targetL - adjustedColor.l, c: 0, h: 0 },
        });
      }
    }

    // Check if chroma is too low (grayish)
    if (adjustedColor.c < 0.05) {
      suggestionsList.push({
        type: "saturate",
        message: "Increase saturation by 10% for more vibrant color",
        adjustment: { l: 0, c: 0.1, h: 0 },
      });
    }

    // Check if chroma is too high (oversaturated)
    if (adjustedColor.c > 0.3) {
      suggestionsList.push({
        type: "desaturate",
        message: "Reduce saturation by 10% for better balance",
        adjustment: { l: 0, c: -0.1, h: 0 },
      });
    }

    return suggestionsList;
  }, [adjustedColor]);
  const deltaE = useMemo(() => {
    if (!originalColor || !adjustedColor) return 0;
    try {
      return chroma.deltaE(
        chroma.oklch(originalColor.l, originalColor.c, originalColor.h),
        chroma.oklch(adjustedColor.l, adjustedColor.c, adjustedColor.h),
      );
    } catch {
      return 0;
    }
  }, [originalColor, adjustedColor]);

  // Find similar colors in palette
  const similarColors = useMemo(() => {
    if (!adjustedColor) return [];

    return palette
      .map((color, idx) => {
        if (idx === selectedColorIndex) return null;
        try {
          const delta = chroma.deltaE(
            chroma.oklch(adjustedColor.l, adjustedColor.c, adjustedColor.h),
            chroma.oklch(color.value.l, color.value.c, color.value.h),
          );
          return { idx, delta };
        } catch {
          return null;
        }
      })
      .filter((item) => item && item.delta < 15)
      .sort((a, b) => a.delta - b.delta);
  }, [adjustedColor, palette, selectedColorIndex]);

  // Contrast ratios
  const contrastInfo = useMemo(() => {
    if (!adjustedColor) return null;

    try {
      const color = chroma.oklch(
        adjustedColor.l,
        adjustedColor.c,
        adjustedColor.h,
      );
      const white = chroma("#ffffff");
      const black = chroma("#000000");

      return {
        vsWhite: chroma.contrast(color, white).toFixed(2),
        vsBlack: chroma.contrast(color, black).toFixed(2),
      };
    } catch {
      return { vsWhite: 0, vsBlack: 0 };
    }
  }, [adjustedColor]);

  const handleSliderChange = (type, value) => {
    setAdjustments((prev) => ({ ...prev, [type]: parseFloat(value) }));
  };

  const handleReset = () => {
    setAdjustments({ l: 0, c: 0, h: 0 });
  };

  const handleApply = () => {
    if (!adjustedColor) return;

    if (batchMode) {
      // Apply to all colors
      const newPalette = palette.map((colorObj) => {
        const base = colorObj.value;
        return {
          ...colorObj,
          value: {
            l: Math.max(0, Math.min(1, base.l + batchAdjustments.l)),
            c: Math.max(0, Math.min(0.4, base.c + batchAdjustments.c)),
            h: (base.h + batchAdjustments.h + 360) % 360,
            a: base.a || 1,
          },
        };
      });
      setPalette(newPalette);
      setBatchAdjustments({ l: 0, c: 0, h: 0 });
    } else {
      // Apply to selected color only
      const newPalette = [...palette];
      newPalette[selectedColorIndex] = {
        ...newPalette[selectedColorIndex],
        value: adjustedColor,
      };
      setPalette(newPalette);
      setAdjustments({ l: 0, c: 0, h: 0 });
    }

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleApplySuggestion = (suggestion) => {
    setAdjustments((prev) => ({
      l: prev.l + suggestion.adjustment.l,
      c: prev.c + suggestion.adjustment.c,
      h: prev.h + suggestion.adjustment.h,
    }));
  };

  const hasChanges = batchMode
    ? batchAdjustments.l !== 0 ||
      batchAdjustments.c !== 0 ||
      batchAdjustments.h !== 0
    : adjustments.l !== 0 || adjustments.c !== 0 || adjustments.h !== 0;

  const getContrastText = (color) => {
    try {
      const c = chroma.oklch(color.l, color.c, color.h);
      return chroma.contrast(c, "white") > chroma.contrast(c, "black")
        ? "#ffffff"
        : "#000000";
    } catch {
      return "#000000";
    }
  };

  if (!originalColor || !adjustedColor) return null;

  const originalHex = chroma
    .oklch(originalColor.l, originalColor.c, originalColor.h)
    .hex();
  const adjustedHex = chroma
    .oklch(adjustedColor.l, adjustedColor.c, adjustedColor.h)
    .hex();

  return (
    <div className="hidden bg-background lg:flex h-full">
      {/* Left Sidebar - Controls */}
      <aside className="w-80 border-r border-(--navBorder) bg-background flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-3 border-b border-(--navBorder) flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-xs font-bold text-foreground/80 uppercase tracking-wider mb-1">
                Color Editor
              </h2>
              <p className="text-[9px] text-foreground/40">
                {batchMode
                  ? "Adjust all colors at once"
                  : "Adjust lightness, chroma, and hue"}
              </p>
            </div>
            <button
              onClick={() => {
                setBatchMode(!batchMode);
                setAdjustments({ l: 0, c: 0, h: 0 });
                setBatchAdjustments({ l: 0, c: 0, h: 0 });
              }}
              className={`px-2 py-1 text-[8px] font-bold rounded transition-all ${
                batchMode
                  ? "bg-(--brand) text-white"
                  : "border border-(--navBorder) hover:border-(--brand)"
              }`}
            >
              {batchMode ? "Batch Mode ON" : "Batch Mode"}
            </button>
          </div>
        </div>

        {/* Color Selection */}
        <div className="p-3 border-b border-(--navBorder) flex-shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[9px] font-bold text-foreground/50 uppercase tracking-widest">
              Select Color
            </span>
            <span className="text-[8px] text-foreground/30 font-mono">
              {selectedColorIndex + 1}/{palette.length}
            </span>
          </div>
          <div className="grid grid-cols-12 gap-1.5">
            {palette.map((color, idx) => {
              const hex = chroma
                .oklch(color.value.l, color.value.c, color.value.h)
                .hex();
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedColorIndex(idx);
                    setAdjustments({ l: 0, c: 0, h: 0 });
                  }}
                  className={`aspect-square rounded transition-all ${
                    idx === selectedColorIndex
                      ? "ring-2 ring-(--brand) ring-offset-1 ring-offset-background scale-110 shadow-lg"
                      : "hover:scale-105 border border-(--navBorder)"
                  }`}
                  style={{ backgroundColor: hex }}
                  title={`Color ${idx + 1}`}
                />
              );
            })}
          </div>
        </div>

        {/* Scrollable Middle Section */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Adjustment Sliders */}
          <div className="p-3 border-b border-(--navBorder)">
            <div className="text-[9px] font-bold text-foreground/50 uppercase tracking-widest mb-3">
              Adjustments
            </div>

            <div className="space-y-4">
              {/* Lightness */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[9px] font-semibold text-foreground/70">
                    Lightness
                  </label>
                  <span className="text-[9px] font-mono font-bold text-(--brand)">
                    {(batchMode ? batchAdjustments.l : adjustments.l) > 0
                      ? "+"
                      : ""}
                    {(
                      (batchMode ? batchAdjustments.l : adjustments.l) * 100
                    ).toFixed(0)}
                    %
                  </span>
                </div>
                <input
                  type="range"
                  min="-0.3"
                  max="0.3"
                  step="0.01"
                  value={batchMode ? batchAdjustments.l : adjustments.l}
                  onChange={(e) =>
                    batchMode
                      ? setBatchAdjustments((prev) => ({
                          ...prev,
                          l: parseFloat(e.target.value),
                        }))
                      : handleSliderChange("l", e.target.value)
                  }
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-black via-gray-400 to-white"
                  style={{ accentColor: "var(--brand)" }}
                />
                <div className="flex justify-between text-[7px] text-foreground/30 mt-0.5">
                  <span>Darken</span>
                  <span>Brighten</span>
                </div>
              </div>

              {/* Chroma */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[9px] font-semibold text-foreground/70">
                    Chroma
                  </label>
                  <span className="text-[9px] font-mono font-bold text-(--brand)">
                    {(batchMode ? batchAdjustments.c : adjustments.c) > 0
                      ? "+"
                      : ""}
                    {(
                      (batchMode ? batchAdjustments.c : adjustments.c) * 100
                    ).toFixed(0)}
                    %
                  </span>
                </div>
                <input
                  type="range"
                  min="-0.15"
                  max="0.15"
                  step="0.005"
                  value={batchMode ? batchAdjustments.c : adjustments.c}
                  onChange={(e) =>
                    batchMode
                      ? setBatchAdjustments((prev) => ({
                          ...prev,
                          c: parseFloat(e.target.value),
                        }))
                      : handleSliderChange("c", e.target.value)
                  }
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: batchMode
                      ? "linear-gradient(to right, #888888, #ff00ff)"
                      : `linear-gradient(to right, ${chroma.oklch(adjustedColor.l, 0.01, adjustedColor.h).hex()}, ${chroma.oklch(adjustedColor.l, 0.3, adjustedColor.h).hex()})`,
                    accentColor: "var(--brand)",
                  }}
                />
                <div className="flex justify-between text-[7px] text-foreground/30 mt-0.5">
                  <span>Desaturate</span>
                  <span>Saturate</span>
                </div>
              </div>

              {/* Hue */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[9px] font-semibold text-foreground/70">
                    Hue Shift
                  </label>
                  <span className="text-[9px] font-mono font-bold text-(--brand)">
                    {(batchMode ? batchAdjustments.h : adjustments.h) > 0
                      ? "+"
                      : ""}
                    {(batchMode ? batchAdjustments.h : adjustments.h).toFixed(
                      0,
                    )}
                    °
                  </span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={batchMode ? batchAdjustments.h : adjustments.h}
                  onChange={(e) =>
                    batchMode
                      ? setBatchAdjustments((prev) => ({
                          ...prev,
                          h: parseFloat(e.target.value),
                        }))
                      : handleSliderChange("h", e.target.value)
                  }
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
                    accentColor: "var(--brand)",
                  }}
                />
                <div className="flex justify-between text-[7px] text-foreground/30 mt-0.5">
                  <span>-180°</span>
                  <span>+180°</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contrast Info */}
          {contrastInfo && (
            <div className="p-3 border-b border-(--navBorder)">
              <div className="flex items-center gap-1.5 mb-2">
                <Info className="w-3 h-3 text-foreground/40" />
                <span className="text-[9px] font-bold text-foreground/50 uppercase tracking-widest">
                  Contrast
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-white border border-gray-200">
                  <div className="text-[7px] text-gray-500 mb-0.5">
                    vs White
                  </div>
                  <div className="text-sm font-bold font-mono">
                    {contrastInfo.vsWhite}:1
                  </div>
                  <div className="mt-1">
                    {parseFloat(contrastInfo.vsWhite) >= 7 && (
                      <span className="text-[6px] bg-green-500 text-white px-1 py-0.5 rounded font-bold">
                        AAA
                      </span>
                    )}
                    {parseFloat(contrastInfo.vsWhite) >= 4.5 &&
                      parseFloat(contrastInfo.vsWhite) < 7 && (
                        <span className="text-[6px] bg-blue-500 text-white px-1 py-0.5 rounded font-bold">
                          AA
                        </span>
                      )}
                    {parseFloat(contrastInfo.vsWhite) < 4.5 && (
                      <span className="text-[6px] bg-red-500 text-white px-1 py-0.5 rounded font-bold">
                        FAIL
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-2 rounded bg-black border border-gray-700">
                  <div className="text-[7px] text-gray-400 mb-0.5">
                    vs Black
                  </div>
                  <div className="text-sm font-bold font-mono text-white">
                    {contrastInfo.vsBlack}:1
                  </div>
                  <div className="mt-1">
                    {parseFloat(contrastInfo.vsBlack) >= 7 && (
                      <span className="text-[6px] bg-green-500 text-white px-1 py-0.5 rounded font-bold">
                        AAA
                      </span>
                    )}
                    {parseFloat(contrastInfo.vsBlack) >= 4.5 &&
                      parseFloat(contrastInfo.vsBlack) < 7 && (
                        <span className="text-[6px] bg-blue-500 text-white px-1 py-0.5 rounded font-bold">
                          AA
                        </span>
                      )}
                    {parseFloat(contrastInfo.vsBlack) < 4.5 && (
                      <span className="text-[6px] bg-red-500 text-white px-1 py-0.5 rounded font-bold">
                        FAIL
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Similarity Warning */}
          {similarColors.length > 0 && !batchMode && (
            <div className="p-3 border-b border-yellow-500/30 bg-yellow-500/5">
              <div className="flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-[9px] font-bold text-yellow-700 uppercase tracking-widest">
                  Similar Colors
                </span>
              </div>
              <p className="text-[9px] text-yellow-700 mb-2">
                Too similar to {similarColors.length} color
                {similarColors.length > 1 ? "s" : ""}:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {similarColors.map(({ idx, delta }) => {
                  const hex = chroma
                    .oklch(
                      palette[idx].value.l,
                      palette[idx].value.c,
                      palette[idx].value.h,
                    )
                    .hex();
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/50 border border-yellow-500/30"
                    >
                      <div
                        className="w-4 h-4 rounded border border-black/10"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="text-[9px] font-semibold text-yellow-800">
                        #{idx + 1}
                      </span>
                      <span className="text-[9px] text-yellow-600 font-mono">
                        {delta.toFixed(1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI Suggestions */}
          {suggestions.length > 0 && !batchMode && (
            <div className="p-3 border-b border-blue-500/30 bg-blue-500/5">
              <div className="flex items-center gap-1.5 mb-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span className="text-[9px] font-bold text-blue-700 uppercase tracking-widest">
                  Suggestions
                </span>
              </div>
              <div className="space-y-2">
                {suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-white/50 border border-blue-500/30"
                  >
                    <p className="text-[9px] text-blue-700 mb-1.5">
                      {suggestion.message}
                    </p>
                    <button
                      onClick={() => handleApplySuggestion(suggestion)}
                      className="px-2 py-1 text-[8px] font-bold bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Apply This
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-3 border-t border-(--navBorder) flex gap-2 flex-shrink-0">
          <button
            onClick={() =>
              batchMode
                ? setBatchAdjustments({ l: 0, c: 0, h: 0 })
                : handleReset()
            }
            disabled={!hasChanges}
            className={`flex-1 px-3 py-2 text-[9px] font-bold border rounded transition-all flex items-center justify-center gap-1 ${
              hasChanges
                ? "border-(--navBorder) hover:border-(--brand) hover:bg-foreground/5"
                : "border-(--navBorder) opacity-40 cursor-not-allowed"
            }`}
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
          <button
            onClick={handleApply}
            disabled={!hasChanges}
            className={`flex-1 px-3 py-2 text-[9px] font-bold rounded transition-all flex items-center justify-center gap-1 ${
              hasChanges
                ? "bg-(--brand) text-white hover:opacity-90"
                : "bg-foreground/10 text-foreground/40 cursor-not-allowed"
            }`}
          >
            <Check className="w-3 h-3" />
            {batchMode ? "Apply to All" : "Apply"}
          </button>
        </div>
      </aside>

      {/* Right Panel - Preview */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {/* Preview Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider">
                Live Preview
              </h3>
              {deltaE > 0 && (
                <span className="text-[9px] font-mono bg-(--brand)/10 text-(--brand) px-2 py-0.5 rounded font-bold">
                  ΔE: {deltaE.toFixed(1)}
                </span>
              )}
            </div>
            <p className="text-[10px] text-foreground/40">
              Compare original and adjusted colors in real-time
            </p>
          </div>

          {/* Before/After Comparison */}
          <div className="grid grid-cols-2 gap-6">
            {/* Original */}
            <div>
              <div className="text-[9px] font-bold text-foreground/40 uppercase tracking-wider mb-3">
                Original
              </div>
              <div
                className="h-32 rounded-xl border border-(--navBorder) shadow-lg flex items-center justify-center transition-all"
                style={{
                  backgroundColor: originalHex,
                  color: getContrastText(originalColor),
                }}
              >
                <div className="text-center">
                  <div className="text-xl font-bold font-mono mb-1">
                    {originalHex.toUpperCase()}
                  </div>
                  <div className="text-xs opacity-70 font-mono">
                    L:{(originalColor.l * 100).toFixed(0)} C:
                    {originalColor.c.toFixed(2)} H:{originalColor.h.toFixed(0)}°
                  </div>
                </div>
              </div>
            </div>

            {/* Adjusted */}
            <div>
              <div className="text-[9px] font-bold text-foreground/40 uppercase tracking-wider mb-3">
                Adjusted
              </div>
              <div
                className="h-32 rounded-xl border-2 shadow-2xl flex items-center justify-center transition-all"
                style={{
                  backgroundColor: adjustedHex,
                  color: getContrastText(adjustedColor),
                  borderColor: hasChanges ? "var(--brand)" : "var(--navBorder)",
                }}
              >
                <div className="text-center">
                  <div className="text-xl font-bold font-mono mb-1">
                    {adjustedHex.toUpperCase()}
                  </div>
                  <div className="text-xs opacity-70 font-mono">
                    L:{(adjustedColor.l * 100).toFixed(0)} C:
                    {adjustedColor.c.toFixed(2)} H:{adjustedColor.h.toFixed(0)}°
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Large Preview */}
          <div className="mt-6">
            <div className="text-[9px] font-bold text-foreground/40 uppercase tracking-wider mb-3">
              Full Preview
            </div>
            <div
              className="h-48 rounded-xl border-2 shadow-xl flex items-center justify-center transition-all"
              style={{
                backgroundColor: adjustedHex,
                color: getContrastText(adjustedColor),
                borderColor: hasChanges ? "var(--brand)" : "var(--navBorder)",
              }}
            >
              <div className="text-center">
                <div className="text-4xl font-bold mb-4">Sample Text</div>
                <p className="text-lg opacity-80">
                  The quick brown fox jumps over the lazy dog
                </p>
              </div>
            </div>
          </div>

          {/* UI Elements Preview */}
          {!batchMode && (
            <div className="mt-6">
              <div className="text-[9px] font-bold text-foreground/40 uppercase tracking-wider mb-3">
                UI Elements Preview
              </div>
              <div className="grid grid-cols-3 gap-4">
                {/* Button */}
                <div className="space-y-2">
                  <div className="text-[8px] text-foreground/50 uppercase font-semibold">
                    Button
                  </div>
                  <button
                    className="w-full px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
                    style={{
                      backgroundColor: adjustedHex,
                      color: getContrastText(adjustedColor),
                    }}
                  >
                    Click Me
                  </button>
                </div>

                {/* Badge */}
                <div className="space-y-2">
                  <div className="text-[8px] text-foreground/50 uppercase font-semibold">
                    Badge
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{
                        backgroundColor: adjustedHex,
                        color: getContrastText(adjustedColor),
                      }}
                    >
                      New
                    </span>
                    <span
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{
                        backgroundColor: "transparent",
                        color: adjustedHex,
                        border: `2px solid ${adjustedHex}`,
                      }}
                    >
                      Outlined
                    </span>
                  </div>
                </div>

                {/* Icon */}
                <div className="space-y-2">
                  <div className="text-[8px] text-foreground/50 uppercase font-semibold">
                    Icon
                  </div>
                  <div className="flex gap-2">
                    <Check className="w-6 h-6" style={{ color: adjustedHex }} />
                    <AlertTriangle
                      className="w-6 h-6"
                      style={{ color: adjustedHex }}
                    />
                    <Info className="w-6 h-6" style={{ color: adjustedHex }} />
                  </div>
                </div>
              </div>

              {/* Card Preview */}
              <div
                className="mt-4 p-4 rounded-xl border-2 transition-all"
                style={{ borderColor: adjustedHex }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg"
                    style={{ backgroundColor: adjustedHex }}
                  />
                  <div>
                    <h3
                      className="text-sm font-bold"
                      style={{ color: adjustedHex }}
                    >
                      Card Title
                    </h3>
                    <p className="text-xs text-foreground/60">Subtitle text</p>
                  </div>
                </div>
                <p className="text-xs text-foreground/70 mb-3">
                  This card uses your adjusted color for accents, borders, and
                  highlights.
                </p>
                <button
                  className="px-3 py-1.5 rounded text-xs font-semibold"
                  style={{
                    backgroundColor: adjustedHex,
                    color: getContrastText(adjustedColor),
                  }}
                >
                  Card Action
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-2 z-50">
          <Check className="w-4 h-4" />
          <span className="text-sm font-semibold">Color updated!</span>
        </div>
      )}
    </div>
  );
}

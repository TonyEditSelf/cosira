import { useState, useMemo, useRef, useEffect } from "react";
import chroma from "chroma-js";
import { useColorPaletteContext } from "../ColorContext";

import OklchColorWheel from "../custom-palettes/_components/Pickers/components/OklchColorWheel";
import OklchArea from "../custom-palettes/_components/Pickers/components/OklchArea";
import HueSlider from "../custom-palettes/_components/Pickers/components/HueSlider";
import LightnessSlider from "../custom-palettes/_components/Pickers/components/LightnessSlider";
import ChromaSlider from "../custom-palettes/_components/Pickers/components/ChromaSlider";
import AlphaSlider from "../custom-palettes/_components/Pickers/components/AlphaSlider";
import HsvPicker from "./HsvPicker";

const presetBlendColors = [
  { name: "Gold", hex: "#FFD700", category: "Metallic" },
  { name: "Silver", hex: "#C0C0C0", category: "Metallic" },
  { name: "Bronze", hex: "#CD7F32", category: "Metallic" },
  { name: "Rose Gold", hex: "#B76E79", category: "Metallic" },
  { name: "Copper", hex: "#B87333", category: "Metallic" },
  { name: "Neon Pink", hex: "#FF10F0", category: "Neon" },
  { name: "Neon Green", hex: "#39FF14", category: "Neon" },
  { name: "Neon Blue", hex: "#1F51FF", category: "Neon" },
  { name: "Neon Orange", hex: "#FF6600", category: "Neon" },
  { name: "Black", hex: "#000000", category: "Neutral" },
  { name: "White", hex: "#FFFFFF", category: "Neutral" },
  { name: "Gray", hex: "#808080", category: "Neutral" },
];

const blendIntensities = [5, 15, 30, 50, 70, 90];

export default function BlendColors() {
  const { palette } = useColorPaletteContext();
  const [blendColor, setBlendColor] = useState("#FFD700");
  const [blendColorName, setBlendColorName] = useState("Gold");
  const [customBlendInput, setCustomBlendInput] = useState("");
  const [copiedColor, setCopiedColor] = useState(null);
  const [copiedMessage, setCopiedMessage] = useState("");

  // Picker popup state
  const [showPickerPopup, setShowPickerPopup] = useState(false);
  const [pickerTab, setPickerTab] = useState("hex"); // "hex" | "oklch"
  const [oklchValues, setOklchValues] = useState({
    l: 0.7,
    c: 0.15,
    h: 50,
    a: 1,
  });

  const pickerPopupRef = useRef(null);
  const swatchButtonRef = useRef(null);

  const handleBlendColorSelect = (hex, name) => {
    setBlendColor(hex);
    setBlendColorName(name);
    setCustomBlendInput("");
  };

  const handleOklchChange = (newValues) => {
    const updated = { ...oklchValues, ...newValues };
    setOklchValues(updated);
    try {
      const hex = chroma.oklch(updated.l, updated.c, updated.h).hex();
      setBlendColor(hex);
      setBlendColorName("Custom");
      setCustomBlendInput(hex);
    } catch (err) {}
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        pickerPopupRef.current &&
        !pickerPopupRef.current.contains(e.target) &&
        swatchButtonRef.current &&
        !swatchButtonRef.current.contains(e.target)
      ) {
        setShowPickerPopup(false);
      }
    };
    if (showPickerPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPickerPopup]);

  const handleCustomBlendChange = (e) => {
    const value = e.target.value;
    setCustomBlendInput(value);
    try {
      if (chroma.valid(value)) {
        setBlendColor(value);
        setBlendColorName("Custom");
      }
    } catch (err) {}
  };

  const blendedPalette = useMemo(() => {
    return palette.map((color, colorIndex) => {
      const baseHex = chroma
        .oklch(color.value.l, color.value.c, color.value.h)
        .hex();

      const blends = blendIntensities.map((intensity) => {
        const mixed = chroma.mix(baseHex, blendColor, intensity / 100, "oklch");
        const [l, c, h] = mixed.oklch();

        const contrastWhite = chroma.contrast(mixed.hex(), "white");
        const contrastBlack = chroma.contrast(mixed.hex(), "black");
        const wcagAA = contrastWhite >= 4.5 || contrastBlack >= 4.5;
        const wcagAAA = contrastWhite >= 7 || contrastBlack >= 7;

        return {
          intensity,
          hex: mixed.hex(),
          l: (l * 100).toFixed(0),
          c: c.toFixed(2),
          h: h.toFixed(0),
          contrastWhite: contrastWhite.toFixed(1),
          contrastBlack: contrastBlack.toFixed(1),
          wcagAA,
          wcagAAA,
        };
      });

      return { baseHex, colorIndex, blends };
    });
  }, [palette, blendColor]);

  const handleColorClick = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setCopiedMessage(`Copied ${hex}`);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const exportAsCSS = () => {
    const css = blendedPalette
      .map((color, i) => {
        const colorName = `color-${i + 1}`;
        const blendName = blendColorName.toLowerCase().replace(/\s+/g, "-");
        const vars = color.blends
          .map(
            (blend) =>
              `  --${colorName}-${blendName}-${blend.intensity}: ${blend.hex};`,
          )
          .join("\n");
        return vars;
      })
      .join("\n");
    navigator.clipboard.writeText(`:root {\n${css}\n}`);
    setCopiedMessage("Copied all blends as CSS variables!");
    setCopiedColor("css");
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const exportAsTailwind = () => {
    const colors = blendedPalette.map((color, i) => {
      const colorName = `color-${i + 1}-${blendColorName.toLowerCase().replace(/\s+/g, "-")}`;
      const shades = color.blends
        .map((blend) => `          ${blend.intensity}: '${blend.hex}',`)
        .join("\n");
      return `        '${colorName}': {\n${shades}\n        }`;
    });
    const tailwind = `// Add to your tailwind.config.js\ncolors: {\n${colors.join(",\n")}\n}`;
    navigator.clipboard.writeText(tailwind);
    setCopiedMessage("Copied as Tailwind config!");
    setCopiedColor("tailwind");
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const exportAsJSON = () => {
    const json = blendedPalette.map((color, i) => ({
      name: `Color ${i + 1}`,
      base: color.baseHex,
      blendWith: blendColorName,
      variations: Object.fromEntries(
        color.blends.map((blend) => [
          `${blend.intensity}%`,
          { hex: blend.hex, oklch: { l: blend.l, c: blend.c, h: blend.h } },
        ]),
      ),
    }));
    navigator.clipboard.writeText(JSON.stringify(json, null, 2));
    setCopiedMessage("Copied as JSON!");
    setCopiedColor("json");
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="hidden bg-background lg:flex flex-col pt-3 h-full">
      {/* Top header bar */}
      <div className="mx-2 mb-2 ml-2 mr-2 p-4 border border-(--navBorder) rounded-md bg-foreground/[0.015] flex-shrink-0">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                Palette Blender
              </span>
              <div className="h-4 w-[1px] bg-(--navBorder)" />
              <span className="text-[9px] text-foreground/30">
                Create metallic, neon, or branded color variations
              </span>
            </div>
            <div className="h-4 w-[1px] bg-(--navBorder)" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-foreground/40 uppercase">
                Blending with
              </span>
              <div
                className="w-5 h-5 rounded border border-(--navBorder) shadow-sm"
                style={{ backgroundColor: blendColor }}
              />
              <span className="text-[10px] font-bold text-(--brand)">
                {blendColorName}
              </span>
            </div>
            <div className="h-4 w-[1px] bg-(--navBorder)" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-foreground/40 uppercase">
                Intensities
              </span>
              <span className="text-[10px] font-mono font-bold bg-foreground/5 text-(--brand) px-2 py-0.5 rounded">
                {blendIntensities.join("%, ")}%
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

      {/* Main content area: left toolbar + right canvas */}
      <div className="flex flex-1 gap-2 mx-2 mb-2 min-h-0">
        {/* ── Left vertical toolbar ~20% width ── */}
        <div
          className="flex flex-col ml-2 border border-(--navBorder) rounded-md bg-foreground/[0.015] overflow-y-auto custom-scrollbar flex-shrink-0"
          style={{ width: "20%" }}
        >
          {/* Metallic */}
          <div className="p-5 border-b border-(--navBorder) flex-shrink-0">
            <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest block mb-2">
              Metallic
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {presetBlendColors
                .filter((c) => c.category === "Metallic")
                .map((c) => (
                  <button
                    key={c.name}
                    onClick={() => handleBlendColorSelect(c.hex, c.name)}
                    className={`h-8 w-full rounded-md transition-all ${
                      blendColor === c.hex
                        ? "ring-2 ring-(--brand) ring-offset-1 ring-offset-background scale-105 shadow-lg"
                        : "hover:scale-105 border border-(--navBorder)"
                    }`}
                    style={{ background: c.hex }}
                    title={c.name}
                  />
                ))}
            </div>
          </div>

          {/* Neon */}
          <div className="p-5 border-b border-(--navBorder) flex-shrink-0">
            <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest block mb-2">
              Neon
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {presetBlendColors
                .filter((c) => c.category === "Neon")
                .map((c) => (
                  <button
                    key={c.name}
                    onClick={() => handleBlendColorSelect(c.hex, c.name)}
                    className={`h-8 w-full rounded-md transition-all ${
                      blendColor === c.hex
                        ? "ring-2 ring-(--brand) ring-offset-1 ring-offset-background scale-105 shadow-lg"
                        : "hover:scale-105 border border-(--navBorder)"
                    }`}
                    style={{ background: c.hex }}
                    title={c.name}
                  />
                ))}
            </div>
          </div>

          {/* Neutral */}
          <div className="p-5 border-b border-(--navBorder) flex-shrink-0">
            <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest block mb-2">
              Neutral
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {presetBlendColors
                .filter((c) => c.category === "Neutral")
                .map((c) => (
                  <button
                    key={c.name}
                    onClick={() => handleBlendColorSelect(c.hex, c.name)}
                    className={`h-8 w-full rounded-md transition-all ${
                      blendColor === c.hex
                        ? "ring-2 ring-(--brand) ring-offset-1 ring-offset-background scale-105 shadow-lg"
                        : "hover:scale-105 border border-(--navBorder)"
                    }`}
                    style={{ background: c.hex }}
                    title={c.name}
                  />
                ))}
            </div>
          </div>

          {/* Palette colors */}
          {palette.length > 0 && (
            <div className="p-5 border-b border-(--navBorder) flex-shrink-0">
              <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest block mb-2">
                Palette
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {palette.map((c, i) => {
                  const hex = chroma
                    .oklch(c.value.l, c.value.c, c.value.h)
                    .hex();
                  return (
                    <button
                      key={i}
                      onClick={() =>
                        handleBlendColorSelect(hex, `Palette ${i + 1}`)
                      }
                      className={`h-8 w-full rounded-md transition-all ${
                        blendColor === hex
                          ? "ring-2 ring-(--brand) ring-offset-1 ring-offset-background scale-105 shadow-lg"
                          : "hover:scale-105 border border-(--navBorder)/50"
                      }`}
                      style={{ background: hex }}
                      title={hex}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom */}
          <div className="p-3 flex-shrink-0">
            <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest block mb-2">
              Custom
            </span>
            <div className="flex flex-col gap-2">
              {/* Clicking this opens the unified picker popup */}
              <button
                ref={swatchButtonRef}
                onClick={() => setShowPickerPopup((v) => !v)}
                className={`h-9 w-full rounded-md border transition-all flex items-center overflow-hidden ${
                  showPickerPopup
                    ? "border-(--brand) ring-1 ring-(--brand)"
                    : "border-(--navBorder) hover:border-(--brand)"
                }`}
                title="Open color picker"
              >
                <div
                  className="h-full w-10 flex-shrink-0"
                  style={{ backgroundColor: blendColor }}
                />
                <span className="text-[10px] font-mono text-foreground/50 px-2 truncate">
                  {blendColor.toUpperCase()}
                </span>
              </button>

              <input
                type="text"
                value={customBlendInput}
                onChange={handleCustomBlendChange}
                placeholder="Enter HEX…"
                className="w-full px-2 py-1.5 text-[11px] font-mono border border-(--navBorder) rounded bg-background outline-none focus:border-(--brand) placeholder:text-foreground/20"
              />
            </div>
          </div>
        </div>

        {/* ── Unified color picker popup — fixed, floats above everything ── */}
        {showPickerPopup && (
          <div
            ref={pickerPopupRef}
            className="fixed z-50 bg-background border border-(--navBorder) rounded-md shadow-2xl flex flex-col"
            style={{
              top: "60.5%",
              left: "0.5%",
              transform: "translateY(-50%)",
              width: "500px",
              maxHeight: "90vh",
            }}
          >
            {/* Header: tabs + close */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-(--navBorder) flex-shrink-0">
              <div className="flex items-center gap-1 bg-foreground/5 rounded-lg p-1">
                <button
                  onClick={() => setPickerTab("hex")}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                    pickerTab === "hex"
                      ? "bg-background text-(--brand) border border-(--brand) shadow-sm"
                      : "text-foreground/40 hover:text-foreground/70"
                  }`}
                >
                  Hex Picker
                </button>
                <button
                  onClick={() => setPickerTab("oklch")}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                    pickerTab === "oklch"
                      ? "bg-background text-(--brand) border border-(--brand) shadow-sm"
                      : "text-foreground/40 hover:text-foreground/70"
                  }`}
                >
                  OKLCH Picker
                </button>
              </div>
              <button
                onClick={() => setShowPickerPopup(false)}
                className="text-[11px] text-foreground/40 hover:text-foreground transition-colors px-2 py-0.5 rounded hover:bg-foreground/5"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto custom-scrollbar p-4 flex flex-col gap-4">
              {pickerTab === "hex" ? (
                /* ── Inline HSV/Hex picker ── */
                <HsvPicker
                  color={blendColor}
                  onChange={(hex) => handleBlendColorSelect(hex, "Custom")}
                />
              ) : (
                /* ── OKLCH picker ── */
                <div className="flex gap-5">
                  <div className="flex flex-col gap-2 items-center flex-shrink-0">
                    <OklchColorWheel
                      hue={oklchValues.h}
                      lightness={oklchValues.l}
                      chroma={oklchValues.c}
                      alpha={oklchValues.a}
                      onChange={handleOklchChange}
                    />
                    <OklchArea
                      lightness={oklchValues.l}
                      chroma={oklchValues.c}
                      hue={oklchValues.h}
                      alpha={oklchValues.a}
                      onChange={handleOklchChange}
                    />
                  </div>
                  <div className="flex flex-col justify-center w-full gap-4">
                    <div>
                      <h4 className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-2">
                        Hue
                      </h4>
                      <HueSlider
                        hue={oklchValues.h}
                        lightness={oklchValues.l}
                        chroma={oklchValues.c}
                        alpha={oklchValues.a}
                        onChange={handleOklchChange}
                      />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-2">
                        Lightness
                      </h4>
                      <LightnessSlider
                        lightness={oklchValues.l}
                        chroma={oklchValues.c}
                        hue={oklchValues.h}
                        alpha={oklchValues.a}
                        onChange={handleOklchChange}
                      />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-2">
                        Chroma
                      </h4>
                      <ChromaSlider
                        lightness={oklchValues.l}
                        chroma={oklchValues.c}
                        hue={oklchValues.h}
                        alpha={oklchValues.a}
                        onChange={handleOklchChange}
                      />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-2">
                        Alpha
                      </h4>
                      <AlphaSlider
                        lightness={oklchValues.l}
                        chroma={oklchValues.c}
                        hue={oklchValues.h}
                        alpha={oklchValues.a}
                        onChange={handleOklchChange}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Right: blend results canvas ── */}
        <div className="flex-1 mr-2 border border-(--navBorder) rounded-md overflow-hidden bg-gradient-to-br from-foreground/[0.01] to-foreground/[0.03] relative min-w-0">
          <div className="h-full overflow-y-auto custom-scrollbar p-6">
            <div className="space-y-8">
              {blendedPalette.map((colorData) => (
                <div
                  key={colorData.colorIndex}
                  className="space-y-4 pb-8 border-b border-(--navBorder) last:border-0"
                >
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
                      blended with {blendColorName}
                    </span>
                  </div>

                  <div className="flex gap-1 h-20 rounded-lg overflow-hidden border border-(--navBorder) shadow-sm">
                    <div
                      className="w-20 cursor-pointer transition-all hover:w-24 group relative flex items-center justify-center"
                      style={{ backgroundColor: colorData.baseHex }}
                      onClick={() => handleColorClick(colorData.baseHex)}
                    >
                      <span className="text-[10px] font-bold text-white mix-blend-difference opacity-60 group-hover:opacity-100">
                        BASE
                      </span>
                    </div>
                    {colorData.blends.map((blend) => (
                      <div
                        key={blend.intensity}
                        onClick={() => handleColorClick(blend.hex)}
                        className="flex-1 cursor-pointer transition-all hover:flex-[1.5] group relative"
                        style={{ backgroundColor: blend.hex }}
                        title={`${blend.intensity}% • ${blend.hex}`}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 text-white text-[10px] font-mono font-bold transition-opacity">
                          {blend.intensity}%
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {colorData.blends.map((blend) => {
                      const textColor =
                        chroma.contrast(blend.hex, "white") >
                        chroma.contrast(blend.hex, "black")
                          ? "white"
                          : "black";
                      return (
                        <div
                          key={blend.intensity}
                          onClick={() => handleColorClick(blend.hex)}
                          className="group p-3 bg-background border border-(--navBorder) rounded-lg cursor-pointer transition-all hover:border-(--brand) hover:shadow-lg"
                        >
                          <div
                            className="w-full h-20 rounded-md shadow-inner border border-black/5 mb-3 flex items-center justify-center transition-transform group-hover:scale-105"
                            style={{
                              backgroundColor: blend.hex,
                              color: textColor,
                            }}
                          >
                            <span className="text-[12px] font-bold font-mono opacity-60 group-hover:opacity-100">
                              {blend.intensity}%
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[11px] font-mono font-bold text-foreground/80">
                                {blend.hex.toUpperCase()}
                              </span>
                              <div className="flex gap-2 text-[8px] font-mono text-foreground/40">
                                <span>L:{blend.l}</span>
                                <span>C:{blend.c}</span>
                                <span>H:{blend.h}°</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1 pt-2 border-t border-(--navBorder)">
                              {blend.wcagAAA && (
                                <div className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-[8px] font-bold text-emerald-600 uppercase">
                                  AAA
                                </div>
                              )}
                              {blend.wcagAA && !blend.wcagAAA && (
                                <div className="px-1.5 py-0.5 bg-yellow-500/10 border border-yellow-500/30 rounded text-[8px] font-bold text-yellow-600 uppercase">
                                  AA
                                </div>
                              )}
                              {!blend.wcagAA && (
                                <div className="px-1.5 py-0.5 bg-red-500/10 border border-red-500/30 rounded text-[8px] font-bold text-red-600 uppercase">
                                  Fail
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-1 text-[8px] text-foreground/40">
                              <div className="flex items-center justify-between">
                                <span>vs White</span>
                                <span className="font-mono font-bold">
                                  {blend.contrastWhite}:1
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>vs Black</span>
                                <span className="font-mono font-bold">
                                  {blend.contrastBlack}:1
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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

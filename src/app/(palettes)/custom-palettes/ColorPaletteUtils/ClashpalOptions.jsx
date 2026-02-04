import { useState, useEffect } from "react";
import clashPalGen from "./clashPalGen";
import { useColorPaletteContext } from "../../ColorContext";

export default function ClashpalOptions() {
  const { oklch, setPalette } = useColorPaletteContext();

  const [strategy, setStrategy] = useState("structured");
  const [intensity, setIntensity] = useState(0.7);
  const [colorCount, setColorCount] = useState("balanced");
  const [ensureLightnessSpread, setEnsureLightnessSpread] = useState(true);

  useEffect(() => {
    const generatedPalette = clashPalGen(oklch, {
      strategy,
      intensity,
      colorCount,
      ensureLightnessSpread,
    });
    setPalette(generatedPalette);
  }, [
    oklch,
    strategy,
    intensity,
    colorCount,
    ensureLightnessSpread,
    setPalette,
  ]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-[12px] font-bold">CLASH PALETTE OPTIONS</h1>

      {/* Strategy selector */}
      <div>
        <label className="text-[11px] font-semibold mb-2 block">
          Clash Strategy
        </label>
        <select
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
          className="w-full px-3 py-2 border rounded-md bg-background text-[11px]"
        >
          <option value="structured">Structured Clash</option>
          <option value="chaos">Pure Chaos</option>
          <option value="neon-pastel">Neon vs Pastel</option>
          <option value="temperature-war">Temperature War</option>
        </select>
      </div>

      {/* Intensity slider */}
      <div>
        <label className="text-[11px] font-semibold mb-2 block">
          Clash Intensity: {intensity.toFixed(1)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={intensity}
          onChange={(e) => setIntensity(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="text-[10px] mt-1 text-muted-foreground">
          {intensity === 0
            ? "😌 Harmonious"
            : intensity < 0.5
              ? "🎨 Subtle Clash"
              : intensity < 0.8
                ? "⚡ Bold Clash"
                : "🔥 Maximum Chaos"}
        </div>
      </div>

      {/* Color count selector */}
      <div>
        <label className="text-[11px] font-semibold mb-2 block">
          Palette Size
        </label>
        <select
          value={colorCount}
          onChange={(e) => setColorCount(e.target.value)}
          className="w-full px-3 py-2 border rounded-md bg-background text-[11px]"
        >
          <option value="minimal">Minimal (6 colors)</option>
          <option value="balanced">Balanced (10 colors)</option>
          <option value="maximal">Maximal (14 colors)</option>
        </select>
      </div>

      {/* NEW: Lightness spread toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="lightness-spread"
          checked={ensureLightnessSpread}
          onChange={(e) => setEnsureLightnessSpread(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="lightness-spread" className="text-[11px] font-semibold">
          Prevent muddy mid-tones
        </label>
      </div>
      <p className="text-[10px] text-muted-foreground -mt-2">
        Spreads clash colors across lightness range for better contrast
      </p>
    </div>
  );
}

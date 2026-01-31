import { useMemo, useState } from "react";
import chroma from "chroma-js";
import { useColorPaletteContext } from "../ColorContext";

export default function BezierBlends() {
  const { palette } = useColorPaletteContext();
  const [mode, setMode] = useState("data-viz"); // data-viz, growth, theming
  const [steps, setSteps] = useState(12);
  const [copiedColor, setCopiedColor] = useState(null);

  // Helper: Convert palette objects to hex array
  const paletteHex = useMemo(
    () =>
      palette.map((c) => chroma.oklch(c.value.l, c.value.c, c.value.h).hex()),
    [palette],
  );

  // Logic: Data Viz Spectrum (One continuous smooth ramp)
  // Add this state to your component
  const [curve, setCurve] = useState("linear"); // linear, ease-in, ease-out

  const vizScale = useMemo(() => {
    if (paletteHex.length < 2) return [];

    // 1. Define the bezier path
    const bezierPath = chroma.bezier(paletteHex);

    const scale = [];
    for (let i = 0; i < steps; i++) {
      let t = i / (steps - 1);

      // 2. Apply Easing Math
      if (curve === "ease-in") {
        t = t * t;
      } else if (curve === "ease-out") {
        t = t * (2 - t);
      }

      // 3. bezierPath(t) returns a color object.
      // Just call .hex() on it.
      scale.push(bezierPath(t).hex());
    }

    return scale;
  }, [paletteHex, steps, curve]);

  // Logic: System Growth (Generates intermediate steps between each palette pair)
  const growthScales = useMemo(() => {
    const rows = [];
    for (let i = 0; i < paletteHex.length - 1; i++) {
      const pair = [paletteHex[i], paletteHex[i + 1]];
      rows.push({
        pair,
        ramp: chroma.bezier(pair).scale().mode("oklch").colors(8),
      });
    }
    return rows;
  }, [paletteHex]);

  // Logic: Theming (Light/Dark surface washes based on the palette's average curve)
  const themeScales = useMemo(() => {
    if (paletteHex.length < 2) return [];

    // Use the Bezier path as the "source of truth"
    const bezier = chroma.bezier(paletteHex);

    return [
      {
        name: "Surface (Atmosphere)",
        description: "Backgrounds & Card Washes",
        ramp: chroma
          .scale([bezier(0), "#ffffff"])
          .mode("oklch")
          .colors(6),
      },
      {
        name: "Accent (Brand)",
        description: "Buttons & Interaction States",
        ramp: chroma
          .scale([paletteHex[0], paletteHex[paletteHex.length - 1]])
          .mode("oklch")
          .colors(6),
      },
      {
        name: "Neutral (UI)",
        description: "Text, Icons & Borders",
        ramp: chroma.scale(["#444444", "#000000"]).mode("oklch").colors(6),
      },
    ];
  }, [paletteHex]);

  const handleColorClick = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="hidden bg-background lg:flex flex-col pt-3 h-full">
      <div className="flex flex-col gap-3 flex-1 ml-2 mr-2 mb-2 bg-background overflow-hidden">
        {/* Header Controls */}
        <div className="p-4 border border-(--navBorder) rounded-md bg-foreground/[0.01]">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                  Bezier Mode
                </span>
                <div className="flex bg-foreground/5 p-0.5 rounded-lg border border-(--navBorder)">
                  {[
                    { id: "data-viz", label: "Data Viz" },
                    { id: "growth", label: "System Growth" },
                    { id: "theming", label: "Theming" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all uppercase cursor-pointer ${
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

              {mode === "data-viz" && (
                <>
                  <div className="h-4 w-[1px] bg-(--navBorder)" />
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                      Resolution
                    </span>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      value={steps}
                      onChange={(e) => setSteps(parseInt(e.target.value))}
                      className="w-24 h-1 cursor-pointer accent-(--brand)"
                    />
                    <span className="text-[10px] font-mono font-bold text-foreground/60">
                      {steps}
                    </span>
                  </div>
                  <div className="h-4 w-[1px] bg-(--navBorder)" />

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                      Curve Preset
                    </span>
                    <div className="flex bg-foreground/5 p-0.5 rounded-lg border border-(--navBorder)">
                      {[
                        { id: "linear", label: "Linear" },
                        { id: "ease-in", label: "Ease In" },
                        { id: "ease-out", label: "Ease Out" },
                      ].map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setCurve(c.id)}
                          className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all uppercase cursor-pointer ${
                            curve === c.id
                              ? "bg-background text-(--brand) shadow-sm"
                              : "text-foreground/50 hover:text-foreground"
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Work Surface */}
        <div className="flex-1 border border-(--navBorder) rounded-md overflow-hidden bg-gradient-to-br from-foreground/[0.01] to-foreground/[0.03] relative">
          <div className="h-full overflow-y-auto custom-scrollbar p-8">
            {/* MODE: DATA VIZ (Continuous Spectrum) */}
            {mode === "data-viz" && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em]">
                    Perceptual Bezier Path
                  </span>
                  <div className="flex h-32 rounded-xl overflow-hidden border border-black/10 shadow-2xl">
                    {vizScale.map((hex, i) => (
                      <div
                        key={i}
                        className="flex-1 hover:flex-[1.5] transition-all cursor-pointer group relative"
                        style={{ backgroundColor: hex }}
                        onClick={() => handleColorClick(hex)}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/10 text-white text-[10px] font-mono font-bold">
                          {hex.toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Path Analyzer: Lightness & Chroma Graphs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-foreground/[0.02] p-6 rounded-xl border border-(--navBorder)">
                  <div className="flex flex-col gap-4">
                    <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                      Lightness Curve ($L$)
                    </span>
                    <div className="relative h-24 w-full flex items-end gap-[1px]">
                      {vizScale.map((hex, i) => {
                        const [l] = chroma(hex).oklch();
                        return (
                          <div
                            key={i}
                            className="flex-1 bg-(--brand) opacity-30 rounded-t-sm transition-all hover:opacity-100"
                            style={{ height: `${l * 100}%` }}
                            title={`Lightness: ${(l * 100).toFixed(1)}%`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                      Chroma Curve ($C$)
                    </span>
                    <div className="relative h-24 w-full flex items-end gap-[1px]">
                      {vizScale.map((hex, i) => {
                        const [, c] = chroma(hex).oklch();
                        const height = (c / 0.4) * 100;
                        return (
                          <div
                            key={i}
                            className="flex-1 bg-amber-400 opacity-30 rounded-t-sm transition-all hover:opacity-100"
                            style={{ height: `${Math.min(height, 100)}%` }}
                            title={`Chroma: ${c.toFixed(3)}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Contrast Checker / Step Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {vizScale.map((hex, i) => {
                    // Calculate contrast ratios
                    const contrastWhite = chroma.contrast(hex, "white");
                    const contrastBlack = chroma.contrast(hex, "black");

                    // Determine if it passes WCAG AA (4.5:1)
                    const passesWhite = contrastWhite >= 4.5;
                    const passesBlack = contrastBlack >= 4.5;

                    return (
                      <div
                        key={i}
                        className="p-3 bg-background border border-(--navBorder) rounded-lg flex flex-col gap-3 transition-all hover:border-(--brand)/50"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-md shadow-inner border border-black/5"
                            style={{ backgroundColor: hex }}
                          />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-mono font-bold tracking-tight">
                              {hex.toUpperCase()}
                            </span>
                            <span className="text-[9px] text-foreground/40 font-bold uppercase">
                              Step {i + 1}
                            </span>
                          </div>
                        </div>

                        {/* Accessibility Scoring */}
                        <div className="flex flex-col gap-1.5 pt-2 border-t border-(--navBorder)">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] font-bold text-foreground/30 uppercase">
                              On White
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`text-[9px] font-mono font-bold ${passesWhite ? "text-emerald-500" : "text-foreground/40"}`}
                              >
                                {contrastWhite.toFixed(1)}:1
                              </span>
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${passesWhite ? "bg-emerald-500" : "bg-foreground/10"}`}
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] font-bold text-foreground/30 uppercase">
                              On Black
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`text-[9px] font-mono font-bold ${passesBlack ? "text-emerald-500" : "text-foreground/40"}`}
                              >
                                {contrastBlack.toFixed(1)}:1
                              </span>
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${passesBlack ? "bg-emerald-500" : "bg-foreground/10"}`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MODE: SYSTEM GROWTH (Intermediate Pairs) */}
            {mode === "growth" && (
              <div className="space-y-6">
                <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em]">
                  Palette Interpolation Pairs
                </span>
                {growthScales.map((row, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[9px] font-mono text-foreground/40">
                      <span>{row.pair[0]}</span>
                      <span>Interpolation Curve {i + 1}</span>
                      <span>{row.pair[1]}</span>
                    </div>
                    <div className="flex h-10 gap-1">
                      {row.ramp.map((hex, j) => (
                        <div
                          key={j}
                          className="flex-1 rounded-sm cursor-pointer hover:scale-105 transition-transform"
                          style={{ backgroundColor: hex }}
                          onClick={() => handleColorClick(hex)}
                          title={hex}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* MODE: THEMING (Expanded Design System) */}
            {mode === "theming" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {themeScales.map((theme, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-foreground/80 uppercase tracking-[0.2em]">
                        {theme.name}
                      </span>
                      <span className="text-[8px] text-foreground/40 font-medium uppercase">
                        {theme.description}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {theme.ramp.map((hex, j) => (
                        <div
                          key={j}
                          className="h-14 rounded-lg border border-(--navBorder) px-4 flex items-center justify-between cursor-pointer hover:border-(--brand) transition-all"
                          style={{ backgroundColor: hex }}
                          onClick={() => handleColorClick(hex)}
                        >
                          <span className="text-[10px] font-mono font-bold mix-blend-difference text-white opacity-60">
                            {hex.toUpperCase()}
                          </span>
                          <div className="h-2 w-2 rounded-full mix-blend-difference text-white opacity-20 border border-white" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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

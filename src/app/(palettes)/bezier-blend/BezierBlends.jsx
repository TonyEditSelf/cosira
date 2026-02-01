import { useMemo, useState } from "react";
import chroma from "chroma-js";
import { useColorPaletteContext } from "../ColorContext";

export default function BezierBlends() {
  const { palette } = useColorPaletteContext();
  const [steps, setSteps] = useState(12);
  const [curve, setCurve] = useState("linear");
  const [copiedColor, setCopiedColor] = useState(null);
  const [copiedMessage, setCopiedMessage] = useState("");

  // Helper: Convert palette objects to hex array
  const paletteHex = useMemo(
    () =>
      palette.map((c) => chroma.oklch(c.value.l, c.value.c, c.value.h).hex()),
    [palette],
  );

  // Generate the bezier color scale
  const vizScale = useMemo(() => {
    if (paletteHex.length < 2) return [];

    const bezierPath = chroma.bezier(paletteHex);
    const scale = [];

    for (let i = 0; i < steps; i++) {
      let t = i / (steps - 1);

      // Apply easing
      if (curve === "ease-in") {
        t = t * t;
      } else if (curve === "ease-out") {
        t = t * (2 - t);
      } else if (curve === "ease-in-out") {
        t = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      }

      scale.push(bezierPath(t).hex());
    }

    return scale;
  }, [paletteHex, steps, curve]);

  // Analyze perceptual uniformity
  const analysis = useMemo(() => {
    if (vizScale.length === 0) return null;

    const lightnessSteps = [];
    const chromaSteps = [];

    for (let i = 1; i < vizScale.length; i++) {
      const [l1, c1] = chroma(vizScale[i - 1]).oklch();
      const [l2, c2] = chroma(vizScale[i]).oklch();
      lightnessSteps.push(Math.abs(l2 - l1));
      chromaSteps.push(Math.abs(c2 - c1));
    }

    const avgLightness =
      lightnessSteps.reduce((a, b) => a + b, 0) / lightnessSteps.length;
    const avgChroma =
      chromaSteps.reduce((a, b) => a + b, 0) / chromaSteps.length;

    const lightnessVariance =
      lightnessSteps.reduce(
        (sum, val) => sum + Math.pow(val - avgLightness, 2),
        0,
      ) / lightnessSteps.length;
    const chromaVariance =
      chromaSteps.reduce((sum, val) => sum + Math.pow(val - avgChroma, 2), 0) /
      chromaSteps.length;

    return {
      lightnessUniformity: Math.max(0, 1 - lightnessVariance / avgLightness),
      chromaUniformity: Math.max(0, 1 - chromaVariance / (avgChroma || 0.001)),
    };
  }, [vizScale]);

  const handleColorClick = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setCopiedMessage(`Copied ${hex}`);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const exportAsCSS = () => {
    const css = vizScale
      .map((hex, i) => `  --scale-${i + 1}: ${hex};`)
      .join("\n");

    const fullCSS = `:root {\n${css}\n}`;
    navigator.clipboard.writeText(fullCSS);
    setCopiedMessage("Copied scale as CSS variables!");
    setCopiedColor("css");
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const exportAsJSON = () => {
    const json = vizScale.map((hex, i) => ({
      step: i + 1,
      color: hex,
      oklch: chroma(hex).oklch(),
    }));

    navigator.clipboard.writeText(JSON.stringify(json, null, 2));
    setCopiedMessage("Copied scale as JSON!");
    setCopiedColor("json");
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const exportAsTailwind = () => {
    const tailwind = vizScale
      .map((hex, i) => `        ${(i + 1) * 50}: '${hex}',`)
      .join("\n");

    const fullTailwind = `// Add to your tailwind.config.js\ncolors: {\n  custom: {\n${tailwind}\n  }\n}`;
    navigator.clipboard.writeText(fullTailwind);
    setCopiedMessage("Copied as Tailwind config!");
    setCopiedColor("tailwind");
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="hidden bg-background lg:flex flex-col pt-3 h-full">
      <div className="flex flex-col gap-3 flex-1 ml-2 mr-2 mb-2 bg-background overflow-hidden">
        {/* Header Controls */}
        <div className="p-4 border border-(--navBorder) rounded-md bg-foreground/[0.015]">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6 flex-wrap">
              {/* STEPS */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                  Steps
                </span>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={steps}
                  onChange={(e) => setSteps(parseInt(e.target.value))}
                  className="w-28 h-1.5 cursor-pointer accent-(--brand)"
                />
                <span className="text-[10px] font-mono font-bold text-(--brand)">
                  {steps}
                </span>
              </div>

              {/* CURVE */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                  Easing
                </span>
                <div className="flex bg-foreground/5 p-0.5 rounded-lg border border-(--navBorder)">
                  {[
                    { id: "linear", label: "Linear" },
                    { id: "ease-in", label: "Ease In" },
                    { id: "ease-out", label: "Ease Out" },
                    { id: "ease-in-out", label: "In-Out" },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCurve(c.id)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all uppercase ${
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

              {/* UNIFORMITY SCORE */}
              {analysis && (
                <div className="flex items-center gap-3 pl-4 border-l border-(--navBorder)">
                  <span className="text-[8px] font-bold text-foreground/30 uppercase tracking-wider">
                    Uniformity
                  </span>
                  <div className="px-3 py-1 bg-foreground/5 rounded-md border border-(--navBorder)">
                    <span className="text-[11px] font-mono font-bold text-(--brand)">
                      {(analysis.lightnessUniformity * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* EXPORT BUTTONS */}
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

        {/* Main Work Surface */}
        <div className="flex-1 border border-(--navBorder) rounded-md overflow-hidden bg-gradient-to-br from-foreground/[0.01] to-foreground/[0.03] relative">
          <div className="h-full overflow-y-auto custom-scrollbar p-6">
            <div className="space-y-6">
              {/* Perceptual Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-foreground/[0.02] p-6 rounded-xl border border-(--navBorder)">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                      Lightness Distribution
                    </span>
                    <span className="text-[8px] font-mono text-foreground/30">
                      Step consistency
                    </span>
                  </div>
                  <div className="relative h-32 w-full flex items-end gap-[2px] bg-foreground/5 rounded-lg p-2">
                    {vizScale.map((hex, i) => {
                      const [l] = chroma(hex).oklch();
                      return (
                        <div
                          key={i}
                          className="flex-1 bg-(--brand) opacity-40 rounded-t transition-all hover:opacity-100 cursor-pointer"
                          style={{ height: `${l * 100}%` }}
                          title={`L: ${(l * 100).toFixed(1)}%`}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                      Chroma Distribution
                    </span>
                    <span className="text-[8px] font-mono text-foreground/30">
                      Saturation curve
                    </span>
                  </div>
                  <div className="relative h-32 w-full flex items-end gap-[2px] bg-foreground/5 rounded-lg p-2">
                    {vizScale.map((hex, i) => {
                      const [, c] = chroma(hex).oklch();
                      const height = (c / 0.4) * 100;
                      return (
                        <div
                          key={i}
                          className="flex-1 bg-amber-400 opacity-40 rounded-t transition-all hover:opacity-100 cursor-pointer"
                          style={{ height: `${Math.min(height, 100)}%` }}
                          title={`C: ${c.toFixed(3)}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Color Scale Grid with Accessibility */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {vizScale.map((hex, i) => {
                  const contrastWhite = chroma.contrast(hex, "white");
                  const contrastBlack = chroma.contrast(hex, "black");
                  const passesWhite = contrastWhite >= 4.5;
                  const passesBlack = contrastBlack >= 4.5;
                  const [l, c, h] = chroma(hex).oklch();

                  return (
                    <div
                      key={i}
                      onClick={() => handleColorClick(hex)}
                      className="group p-4 bg-background border border-(--navBorder) rounded-lg flex flex-col gap-3 transition-all hover:border-(--brand) hover:shadow-lg cursor-pointer"
                    >
                      {/* Color Swatch */}
                      <div
                        className="w-full h-20 rounded-md shadow-inner border border-black/5 transition-transform group-hover:scale-105"
                        style={{ backgroundColor: hex }}
                      />

                      {/* Color Info */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-foreground/40 uppercase">
                            Step {i + 1}
                          </span>
                          <span className="text-[8px] font-mono text-foreground/30">
                            {((i / (vizScale.length - 1)) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-foreground/80">
                          {hex.toUpperCase()}
                        </span>
                      </div>

                      {/* OKLCH Values */}
                      <div className="flex gap-2 text-[8px] font-mono text-foreground/40 pt-2 border-t border-(--navBorder)">
                        <span>L:{(l * 100).toFixed(0)}</span>
                        <span>C:{c.toFixed(2)}</span>
                        <span>H:{h.toFixed(0)}°</span>
                      </div>

                      {/* Contrast Ratings */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-bold text-foreground/30 uppercase">
                            vs White
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[9px] font-mono font-bold ${passesWhite ? "text-emerald-500" : "text-foreground/40"}`}
                            >
                              {contrastWhite.toFixed(1)}
                            </span>
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${passesWhite ? "bg-emerald-500" : "bg-foreground/10"}`}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-bold text-foreground/30 uppercase">
                            vs Black
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[9px] font-mono font-bold ${passesBlack ? "text-emerald-500" : "text-foreground/40"}`}
                            >
                              {contrastBlack.toFixed(1)}
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

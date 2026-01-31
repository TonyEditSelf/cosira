import { useMemo, useState } from "react";
import chroma from "chroma-js";
import { useColorPaletteContext } from "../ColorContext";

export default function Tonalist() {
  const { palette } = useColorPaletteContext();
  const [mode, setMode] = useState("tints-shades"); // tints-shades, harmony, overlay
  const [copiedColor, setCopiedColor] = useState(null);

  // Tints & Shades: 50, 100, 200...900
  const tintShadeScales = useMemo(() => {
    const weights = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    return palette.map((color, index) => {
      const baseHex = chroma
        .oklch(color.value.l, color.value.c, color.value.h)
        .hex();

      return {
        baseHex,
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

          const hex = chroma.oklch(targetL, color.value.c, color.value.h).hex();
          const [l, c, h] = chroma(hex).oklch();
          const [r, g, b] = chroma(hex).rgb();

          return {
            weight,
            hex,
            l: l.toFixed(3),
            c: c.toFixed(3),
            h: h.toFixed(1),
            rgba: `rgba(${r}, ${g}, ${b}, 1)`,
            isBase: weight === 500,
          };
        }),
        originalIndex: index,
      };
    });
  }, [palette]);

  // Harmony Blender: Complement, Analogous, Triadic
  const harmonyScales = useMemo(() => {
    return palette.map((color, index) => {
      const baseHex = chroma
        .oklch(color.value.l, color.value.c, color.value.h)
        .hex();
      const baseChroma = chroma(baseHex);

      const harmonies = [
        { name: "Base", offset: 0 },
        { name: "Analogous -30°", offset: -30 },
        { name: "Analogous +30°", offset: 30 },
        { name: "Tetradic -90°", offset: -90 },
        { name: "Tetradic +90°", offset: 90 },
        { name: "Complement", offset: 180 },
        { name: "Triadic -120°", offset: -120 },
        { name: "Triadic +120°", offset: 120 },
        { name: "Split Comp -150°", offset: -150 },
        { name: "Split Comp +150°", offset: 150 },
      ];

      return {
        baseHex,
        scale: harmonies.map((harmony) => {
          const newHue = (color.value.h + harmony.offset + 360) % 360;
          const hex = chroma.oklch(color.value.l, color.value.c, newHue).hex();
          const [l, c, h] = chroma(hex).oklch();
          const [r, g, b] = chroma(hex).rgb();

          return {
            name: harmony.name,
            hex,
            l: l.toFixed(3),
            c: c.toFixed(3),
            h: h.toFixed(1),
            rgba: `rgba(${r}, ${g}, ${b}, 1)`,
            isBase: harmony.offset === 0,
          };
        }),
        originalIndex: index,
      };
    });
  }, [palette]);

  // Material/Overlay: White/Black overlays at different opacities
  const overlayScales = useMemo(() => {
    const opacities = [10, 20, 30, 40, 50, 60, 70, 80, 90];
    return palette.map((color, index) => {
      const baseHex = chroma
        .oklch(color.value.l, color.value.c, color.value.h)
        .hex();

      // White overlays (tints)
      const whiteTints = opacities.map((opacity) => {
        const hex = chroma
          .mix(baseHex, "#FFFFFF", opacity / 100, "oklch")
          .hex();
        const [l, c, h] = chroma(hex).oklch();
        const [r, g, b] = chroma(hex).rgb();
        return {
          label: `W${opacity}`,
          hex,
          l: l.toFixed(3),
          c: c.toFixed(3),
          h: h.toFixed(1),
          rgba: `rgba(${r}, ${g}, ${b}, 1)`,
          overlay: `White ${opacity}%`,
        };
      });

      // Base color
      const base = {
        label: "Base",
        hex: baseHex,
        l: color.value.l.toFixed(3),
        c: color.value.c.toFixed(3),
        h: color.value.h.toFixed(1),
        rgba: `rgba(${chroma(baseHex).rgb().join(", ")}, 1)`,
        overlay: "Original",
        isBase: true,
      };

      // Black overlays (shades)
      const blackShades = opacities.map((opacity) => {
        const hex = chroma
          .mix(baseHex, "#000000", opacity / 100, "oklch")
          .hex();
        const [l, c, h] = chroma(hex).oklch();
        const [r, g, b] = chroma(hex).rgb();
        return {
          label: `B${opacity}`,
          hex,
          l: l.toFixed(3),
          c: c.toFixed(3),
          h: h.toFixed(1),
          rgba: `rgba(${r}, ${g}, ${b}, 1)`,
          overlay: `Black ${opacity}%`,
        };
      });

      return {
        baseHex,
        scale: [...whiteTints, base, ...blackShades],
        originalIndex: index,
      };
    });
  }, [palette]);

  const currentScales =
    mode === "tints-shades"
      ? tintShadeScales
      : mode === "harmony"
        ? harmonyScales
        : overlayScales;

  const handleColorClick = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const exportScales = () => {
    const css = currentScales
      .map((scale, i) => {
        const vars = scale.scale
          .map((c) => {
            const key =
              mode === "tints-shades"
                ? c.weight
                : mode === "harmony"
                  ? c.name.toLowerCase().replace(/[^a-z0-9]/g, "-")
                  : c.label.toLowerCase();
            return `  --color-${i + 1}-${key}: ${c.hex};`;
          })
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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                  Generator Mode
                </span>
                <div className="flex bg-foreground/5 p-0.5 rounded-lg border border-(--navBorder)">
                  {[
                    { id: "tints-shades", label: "Tints & Shades" },
                    { id: "harmony", label: "Harmony" },
                    { id: "overlay", label: "Overlay" },
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
                  Swatches per Color
                </span>
                <span className="text-[10px] font-mono font-bold bg-foreground/5 text-foreground/60 px-2 py-0.5 rounded">
                  {currentScales[0]?.scale.length || 0}
                </span>
              </div>
            </div>

            <button
              onClick={exportScales}
              className="px-4 py-1.5 text-[10px] font-bold border border-(--navBorder) rounded hover:bg-(--brand) hover:text-white transition-all uppercase cursor-pointer"
            >
              Export CSS
            </button>
          </div>
        </div>

        {/* Scales Grid */}
        <div className="flex-1 border border-(--navBorder) rounded-md overflow-hidden bg-gradient-to-br from-foreground/[0.01] to-foreground/[0.03] relative">
          <div className="h-full overflow-y-auto custom-scrollbar p-6">
            <div
              className="inline-grid gap-0.5"
              style={{
                gridTemplateColumns: `repeat(${currentScales[0]?.scale.length || 1}, 1fr)`,
              }}
            >
              {currentScales.map((colorScale) =>
                colorScale.scale.map((color, stepIndex) => {
                  const textColor =
                    chroma.contrast(color.hex, "white") >
                    chroma.contrast(color.hex, "black")
                      ? "#ffffff"
                      : "#000000";

                  const label =
                    mode === "tints-shades"
                      ? color.weight
                      : mode === "harmony"
                        ? color.name.split(" ")[0]
                        : color.label;

                  const tooltipText =
                    mode === "harmony"
                      ? `${color.name}\n${color.hex}\nL: ${color.l} | C: ${color.c} | H: ${color.h}\n${color.rgba}\nClick to copy`
                      : mode === "overlay"
                        ? `${color.overlay}\n${color.hex}\nL: ${color.l} | C: ${color.c} | H: ${color.h}\n${color.rgba}\nClick to copy`
                        : `${color.hex}\nL: ${color.l} | C: ${color.c} | H: ${color.h}\n${color.rgba}\nClick to copy`;

                  return (
                    <div
                      key={`${colorScale.originalIndex}-${stepIndex}`}
                      onClick={() => handleColorClick(color.hex)}
                      className={`
                        ${mode === "tints-shades" ? "w-24 h-8" : mode === "harmony" ? "w-24 h-8" : "w-15 h-8"} cursor-pointer
                        transition-all duration-150
                        hover:scale-110 hover:shadow-lg hover:z-50 hover:rounded-md
                        group relative flex items-center justify-center
                        ${color.isBase ? "ring-2 ring-(--brand) ring-inset z-[1]" : ""}
                      `}
                      style={{ backgroundColor: color.hex, color: textColor }}
                      title={tooltipText}
                    >
                      <span
                        className={`${mode === "tints-shades" ? "text-[11px]" : mode === "harmony" ? "text-[11px]" : "text-[11px]"} font-bold font-mono opacity-60 group-hover:opacity-100 transition-opacity`}
                      >
                        {label}
                      </span>

                      {color.isBase && (
                        <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-(--brand) shadow-md" />
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

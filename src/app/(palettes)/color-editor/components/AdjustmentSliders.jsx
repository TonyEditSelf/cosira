export function AdjustmentSliders({
  adjustments,
  batchAdjustments,
  batchMode,
  adjustedColor,
  onChange,
}) {
  const active = batchMode ? batchAdjustments : adjustments;

  const sliders = [
    {
      key: "l",
      label: "Lightness",
      min: -1,
      max: 1,
      step: 0.01,
      display: `${active.l > 0 ? "+" : ""}${(active.l * 100).toFixed(0)}%`,
      background: "linear-gradient(to right, #000, #999, #fff)",
      hints: ["Darken", "Brighten"],
    },
    {
      key: "c",
      label: "Chroma",
      min: -0.4,
      max: 0.4,
      step: 0.005,
      display: `${active.c > 0 ? "+" : ""}${(active.c * 100).toFixed(0)}%`,
      background:
        adjustedColor && !batchMode
          ? `linear-gradient(to right, ${chroma_oklch_hex(adjustedColor.l, 0.01, adjustedColor.h)}, ${chroma_oklch_hex(adjustedColor.l, 0.3, adjustedColor.h)})`
          : "linear-gradient(to right, #888, #f0f)",
      hints: ["Desaturate", "Saturate"],
    },
    {
      key: "h",
      label: "Hue Shift",
      min: -180,
      max: 180,
      step: 1,
      display: `${active.h > 0 ? "+" : ""}${active.h.toFixed(0)}°`,
      background:
        "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
      hints: ["-180°", "+180°"],
    },
  ];

  return (
    <div className="p-3 border-b border-(--navBorder)">
      <div className="text-[9px] font-bold text-foreground/50 uppercase tracking-widest mb-3">
        Adjustments
      </div>
      <div className="space-y-4">
        {sliders.map(
          ({ key, label, min, max, step, display, background, hints }) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[9px] font-semibold text-foreground/70">
                  {label}
                </label>
                <span className="text-[9px] font-mono font-bold text-(--brand)">
                  {display}
                </span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={active[key]}
                onChange={(e) =>
                  onChange(key, parseFloat(e.target.value), batchMode)
                }
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                style={{ background, accentColor: "var(--brand)" }}
              />
              <div className="flex justify-between text-[7px] text-foreground/30 mt-0.5">
                <span>{hints[0]}</span>
                <span>{hints[1]}</span>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

// tiny inline helper to avoid importing chroma here
function chroma_oklch_hex(l, c, h) {
  try {
    // dynamic import not needed—chroma is a peer dep; caller can pass hex strings instead
    // fall back to a grey so gradient still renders
    return `oklch(${l} ${c} ${h})`;
  } catch {
    return "#888";
  }
}

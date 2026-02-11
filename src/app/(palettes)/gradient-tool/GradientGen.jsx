import { useState, useMemo } from "react";
import chroma from "chroma-js";

export default function GradientGen() {
  const [gradientType, setGradientType] = useState("linear");
  const [angle, setAngle] = useState(90);
  const [radialShape, setRadialShape] = useState("circle");
  const [radialSize, setRadialSize] = useState("farthest-corner");
  const [colorStops, setColorStops] = useState([
    { id: 1, position: 0, color: "#6366f1" },
    { id: 2, position: 100, color: "#ec4899" },
  ]);
  const [nextId, setNextId] = useState(3);
  const [copiedMessage, setCopiedMessage] = useState("");

  // Direction presets for linear
  const linearDirections = [
    { name: "→", angle: 90, label: "Left to Right" },
    { name: "←", angle: 270, label: "Right to Left" },
    { name: "↓", angle: 180, label: "Top to Bottom" },
    { name: "↑", angle: 0, label: "Bottom to Top" },
    { name: "↘", angle: 135, label: "Diagonal TL-BR" },
    { name: "↙", angle: 225, label: "Diagonal TR-BL" },
    { name: "↗", angle: 45, label: "Diagonal BL-TR" },
    { name: "↖", angle: 315, label: "Diagonal BR-TL" },
  ];

  // Radial variations
  const radialVariations = [
    { shape: "circle", size: "closest-side", label: "Circle Close" },
    { shape: "circle", size: "farthest-side", label: "Circle Far" },
    { shape: "circle", size: "closest-corner", label: "Circle Corner" },
    { shape: "circle", size: "farthest-corner", label: "Circle Full" },
    { shape: "ellipse", size: "closest-side", label: "Ellipse Close" },
    { shape: "ellipse", size: "farthest-side", label: "Ellipse Far" },
    { shape: "ellipse", size: "closest-corner", label: "Ellipse Corner" },
    { shape: "ellipse", size: "farthest-corner", label: "Ellipse Full" },
  ];

  // Stunning gradient presets - expanded collection
  const presets = [
    {
      name: "🌅",
      stops: [
        { position: 0, color: "#ff6b6b" },
        { position: 50, color: "#ffd93d" },
        { position: 100, color: "#6bcf7f" },
      ],
    },
    {
      name: "🌊",
      stops: [
        { position: 0, color: "#667eea" },
        { position: 100, color: "#764ba2" },
      ],
    },
    {
      name: "🔥",
      stops: [
        { position: 0, color: "#f12711" },
        { position: 100, color: "#f5af19" },
      ],
    },
    {
      name: "💎",
      stops: [
        { position: 0, color: "#56ab2f" },
        { position: 100, color: "#a8e063" },
      ],
    },
    {
      name: "🌙",
      stops: [
        { position: 0, color: "#360033" },
        { position: 100, color: "#0b8793" },
      ],
    },
    {
      name: "🍭",
      stops: [
        { position: 0, color: "#d53369" },
        { position: 100, color: "#daae51" },
      ],
    },
    {
      name: "🌸",
      stops: [
        { position: 0, color: "#ff9a9e" },
        { position: 50, color: "#fecfef" },
        { position: 100, color: "#fecfef" },
      ],
    },
    {
      name: "🌌",
      stops: [
        { position: 0, color: "#2e1753" },
        { position: 50, color: "#1f1746" },
        { position: 100, color: "#0f0c29" },
      ],
    },
    {
      name: "🍑",
      stops: [
        { position: 0, color: "#ffecd2" },
        { position: 100, color: "#fcb69f" },
      ],
    },
    {
      name: "🌴",
      stops: [
        { position: 0, color: "#134e5e" },
        { position: 100, color: "#71b280" },
      ],
    },
    {
      name: "🔮",
      stops: [
        { position: 0, color: "#7f00ff" },
        { position: 100, color: "#e100ff" },
      ],
    },
    {
      name: "🌇",
      stops: [
        { position: 0, color: "#fa709a" },
        { position: 100, color: "#fee140" },
      ],
    },
    {
      name: "❄️",
      stops: [
        { position: 0, color: "#83a4d4" },
        { position: 100, color: "#b6fbff" },
      ],
    },
    {
      name: "🍊",
      stops: [
        { position: 0, color: "#fc4a1a" },
        { position: 100, color: "#f7b733" },
      ],
    },
    {
      name: "🌺",
      stops: [
        { position: 0, color: "#ee0979" },
        { position: 100, color: "#ff6a00" },
      ],
    },
    {
      name: "🌿",
      stops: [
        { position: 0, color: "#11998e" },
        { position: 100, color: "#38ef7d" },
      ],
    },
  ];

  // Generate CSS gradient
  const cssGradient = useMemo(() => {
    const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
    const stopsString = sortedStops
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(", ");

    if (gradientType === "linear") {
      return `linear-gradient(${angle}deg, ${stopsString})`;
    } else if (gradientType === "radial") {
      return `radial-gradient(${radialShape} ${radialSize}, ${stopsString})`;
    } else {
      return `conic-gradient(from ${angle}deg, ${stopsString})`;
    }
  }, [colorStops, gradientType, angle, radialShape, radialSize]);

  // Add color stop intelligently
  const addColorStop = () => {
    const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
    let newPosition = 50;

    if (sortedStops.length >= 2) {
      let maxGap = 0;
      let gapPosition = 50;
      for (let i = 0; i < sortedStops.length - 1; i++) {
        const gap = sortedStops[i + 1].position - sortedStops[i].position;
        if (gap > maxGap) {
          maxGap = gap;
          gapPosition = sortedStops[i].position + gap / 2;
        }
      }
      newPosition = Math.round(gapPosition);
    }

    const scale = chroma.scale(sortedStops.map((s) => s.color)).mode("oklch");
    const newColor = scale(newPosition / 100).hex();

    setColorStops([
      ...colorStops,
      { id: nextId, position: newPosition, color: newColor },
    ]);
    setNextId(nextId + 1);
  };

  const removeColorStop = (id) => {
    if (colorStops.length <= 2) return;
    setColorStops(colorStops.filter((stop) => stop.id !== id));
  };

  const updateColorStop = (id, field, value) => {
    setColorStops(
      colorStops.map((stop) =>
        stop.id === id ? { ...stop, [field]: value } : stop,
      ),
    );
  };

  const applyPreset = (preset) => {
    const newStops = preset.stops.map((stop, i) => ({
      id: nextId + i,
      ...stop,
    }));
    setColorStops(newStops);
    setNextId(nextId + preset.stops.length);
  };

  const copyToClipboard = (text, message) => {
    navigator.clipboard.writeText(text);
    setCopiedMessage(message);
    setTimeout(() => setCopiedMessage(""), 2000);
  };

  const exportCSS = () =>
    copyToClipboard(`background: ${cssGradient};`, "CSS Copied!");
  const exportTailwind = () => {
    const sorted = [...colorStops].sort((a, b) => a.position - b.position);
    const from = sorted[0].color;
    const to = sorted[sorted.length - 1].color;
    const tw =
      gradientType === "linear"
        ? `bg-gradient-to-r from-[${from}] to-[${to}]`
        : `bg-[radial-gradient(circle,${from},${to})]`;
    copyToClipboard(tw, "Tailwind Copied!");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-3 flex-1 m-2 overflow-hidden">
        {/* Compact Top Toolbar */}
        <div className="p-3 border border-(--navBorder) rounded-md bg-foreground/[0.015] flex items-center justify-between gap-4 flex-wrap">
          {/* Left Controls */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Type */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest">
                Type
              </span>
              <div className="flex bg-foreground/5 p-0.5 rounded border border-(--navBorder)">
                {[
                  { id: "linear", label: "Linear" },
                  { id: "radial", label: "Radial" },
                  { id: "conic", label: "Conic" },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setGradientType(type.id)}
                    className={`px-2 py-0.5 text-[9px] font-bold rounded transition-all uppercase ${
                      gradientType === type.id
                        ? "bg-background text-(--brand) shadow-sm"
                        : "text-foreground/50"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Linear Directions */}
            {gradientType === "linear" && (
              <div className="flex items-center gap-2 pl-3 border-l border-(--navBorder)">
                <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest">
                  Direction
                </span>
                <div className="flex gap-1">
                  {linearDirections.map((dir) => (
                    <button
                      key={dir.angle}
                      onClick={() => setAngle(dir.angle)}
                      className={`w-7 h-7 flex items-center justify-center text-sm border rounded transition-all ${
                        angle === dir.angle
                          ? "bg-(--brand) text-white border-(--brand)"
                          : "border-(--navBorder) hover:border-(--brand) text-foreground/60"
                      }`}
                      title={dir.label}
                    >
                      {dir.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Radial Variations */}
            {gradientType === "radial" && (
              <div className="flex items-center gap-2 pl-3 border-l border-(--navBorder)">
                <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest">
                  Variation
                </span>
                <select
                  value={`${radialShape}-${radialSize}`}
                  onChange={(e) => {
                    const [shape, ...sizeParts] = e.target.value.split("-");
                    setRadialShape(shape);
                    setRadialSize(sizeParts.join("-"));
                  }}
                  className="px-2 py-1 text-[9px] font-bold bg-foreground/5 border border-(--navBorder) rounded focus:outline-none focus:border-(--brand) cursor-pointer"
                >
                  {radialVariations.map((variant) => (
                    <option
                      key={`${variant.shape}-${variant.size}`}
                      value={`${variant.shape}-${variant.size}`}
                    >
                      {variant.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Conic Angle */}
            {gradientType === "conic" && (
              <div className="flex items-center gap-2 pl-3 border-l border-(--navBorder)">
                <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest">
                  Start Angle
                </span>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={angle}
                  onChange={(e) => setAngle(parseInt(e.target.value))}
                  className="w-20 h-1 cursor-pointer accent-(--brand)"
                />
                <span className="text-[9px] font-mono font-bold text-(--brand) w-8">
                  {angle}°
                </span>
              </div>
            )}

            {/* Presets */}
            <div className="flex items-center gap-2 pl-3 border-l border-(--navBorder)">
              <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest">
                Presets
              </span>
              <div className="flex gap-1">
                {presets.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => applyPreset(preset)}
                    className="w-6 h-6 rounded border border-(--navBorder) hover:border-(--brand) transition-all text-xs"
                    style={{
                      background: `linear-gradient(135deg, ${preset.stops.map((s) => s.color).join(", ")})`,
                    }}
                    title={preset.name}
                  >
                    <span className="drop-shadow-lg">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Export */}
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSS}
              className="px-2.5 py-1 text-[9px] font-bold border border-(--navBorder) rounded hover:bg-foreground/5 hover:border-(--brand) transition-colors"
            >
              CSS
            </button>
            <button
              onClick={exportTailwind}
              className="px-2.5 py-1 text-[9px] font-bold border border-(--navBorder) rounded hover:bg-foreground/5 hover:border-(--brand) transition-colors"
            >
              Tailwind
            </button>
          </div>
        </div>

        {/* Main Content Area - Split: Color Stops LEFT + Massive Preview RIGHT */}
        <div className="flex-1 border border-(--navBorder) rounded-md overflow-hidden bg-gradient-to-br from-foreground/[0.01] to-foreground/[0.03] relative flex">
          {/* COMPACT COLOR STOPS SIDEBAR - LEFT - 25% width */}
          <div className="w-80 border-r border-(--navBorder) bg-foreground/[0.02] p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest">
                Color Stops
              </span>
              <button
                onClick={addColorStop}
                className="px-2 py-1 text-[8px] font-bold bg-(--brand) text-white rounded hover:opacity-90 transition-opacity uppercase tracking-wide"
              >
                + Add
              </button>
            </div>

            {/* Scrollable Stop List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
              {[...colorStops]
                .sort((a, b) => a.position - b.position)
                .map((stop) => (
                  <div
                    key={stop.id}
                    className="group bg-background p-4 rounded-lg border border-(--navBorder) hover:border-(--brand)/50 transition-all"
                  >
                    {/* Top Row: Color Picker + Hex + Delete */}
                    <div className="flex items-center gap-3 mb-3">
                      {/* Color Picker */}
                      <input
                        type="color"
                        value={stop.color}
                        onChange={(e) =>
                          updateColorStop(stop.id, "color", e.target.value)
                        }
                        className="w-12 h-12 rounded-lg cursor-pointer border-2 border-(--navBorder) hover:border-(--brand) transition-colors flex-shrink-0"
                        style={{ backgroundColor: stop.color }}
                      />

                      {/* Hex Input */}
                      <input
                        type="text"
                        value={stop.color}
                        onChange={(e) =>
                          updateColorStop(stop.id, "color", e.target.value)
                        }
                        className="flex-1 px-3 py-2 text-[10px] font-mono font-bold bg-foreground/5 border border-(--navBorder) rounded-lg focus:outline-none focus:border-(--brand) transition-colors uppercase"
                        placeholder="#000000"
                      />

                      {/* Delete Button */}
                      {colorStops.length > 2 && (
                        <button
                          onClick={() => removeColorStop(stop.id)}
                          className="w-8 h-8 flex items-center justify-center text-[11px] font-bold text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Bottom Row: Position Label + Percentage + Slider */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-wider">
                          Position
                        </span>
                        <span className="text-[11px] font-mono font-bold text-(--brand) px-2 py-0.5 bg-(--brand)/10 rounded">
                          {stop.position}%
                        </span>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={stop.position}
                        onChange={(e) =>
                          updateColorStop(
                            stop.id,
                            "position",
                            parseInt(e.target.value),
                          )
                        }
                        className="w-full h-1.5 cursor-pointer accent-(--brand)"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* MASSIVE GRADIENT PREVIEW - RIGHT - 75% width */}
          <div className="flex-1 p-6 flex flex-col gap-4">
            {/* Giant Preview - now taking almost all space */}
            <div className="flex-1 relative">
              <div
                className="absolute inset-0 rounded-2xl border-2 border-(--navBorder) shadow-2xl cursor-pointer transition-all hover:border-(--brand)/50"
                style={{ background: cssGradient }}
                onClick={() =>
                  copyToClipboard(cssGradient, "Gradient CSS Copied!")
                }
              />
            </div>

            {/* CSS Code */}
            <div className="p-3 bg-foreground/[0.02] rounded-lg border border-(--navBorder)">
              <code className="text-[9px] font-mono text-foreground/60 block break-all">
                {cssGradient}
              </code>
            </div>
          </div>

          {/* Copy Notification */}
          {copiedMessage && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-foreground text-background px-4 py-2 rounded-full shadow-2xl z-50 text-[9px] font-bold uppercase tracking-widest">
              {copiedMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

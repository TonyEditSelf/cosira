import { useColorPaletteContext } from "../../ColorContext";
import analogousPalGen, { getBaseAngles } from "./analogousPalGen";

// ─────────────────────────────────────────────
// PALETTE TYPE DEFINITIONS
// Grouped by design intent for cleaner UI
// ─────────────────────────────────────────────
const ANALOG_TYPES = [
  {
    group: "Vibrant",
    description: "Max gamut, full saturation",
    types: [
      { id: "vibrantCenteredAnalog", label: "Centered" },
      { id: "vibrantLeftAnalog", label: "Left" },
      { id: "vibrantRightAnalog", label: "Right" },
    ],
  },
  {
    group: "Muted",
    description: "Low chroma, calm and flat",
    types: [
      { id: "mutedCenteredAnalog", label: "Centered" },
      { id: "mutedLeftAnalog", label: "Left" },
      { id: "mutedRightAnalog", label: "Right" },
    ],
  },
  {
    group: "Earthy",
    description: "Warm hue shift, grounded tones",
    types: [
      { id: "earthyCenteredAnalog", label: "Centered" },
      { id: "earthyLeftAnalog", label: "Left" },
      { id: "earthyRightAnalog", label: "Right" },
    ],
  },
  {
    group: "Pastel",
    description: "High lightness, soft and airy",
    types: [
      { id: "pastelCenteredAnalog", label: "Centered" },
      { id: "pastelLeftAnalog", label: "Left" },
      { id: "pastelRightAnalog", label: "Right" },
    ],
  },
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function getCurrentAngles(analogOptions, analogPalType) {
  const defaults = getBaseAngles(analogPalType);
  return {
    angle1: analogOptions.analogousAngle1 ?? defaults.angle1,
    angle2: analogOptions.analogousAngle2 ?? defaults.angle2,
  };
}

function runGenerator(oklch, options, palType) {
  // Returns array of { name, value } directly
  return analogousPalGen(oklch, options, palType);
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
export default function AnalogousOptions() {
  const {
    setPalette,
    setDuplicatePalette,
    oklch,
    analogPalType,
    setAnalogPalType,
    analogOptions,
    setAnalogOptions,
  } = useColorPaletteContext();

  const { angle1, angle2 } = getCurrentAngles(analogOptions, analogPalType);
  const defaults = getBaseAngles(analogPalType);
  const isAsymmetric = angle1 !== -Math.abs(angle2);
  const layoutType = analogPalType.includes("Left")
    ? "left"
    : analogPalType.includes("Right")
      ? "right"
      : "centered";

  // ── Handlers ──────────────────────────────

  const handleTypeChange = (value) => {
    const resetOptions = {
      analogousAngle1: null,
      analogousAngle2: null,
    };
    setAnalogOptions(resetOptions);
    const pal = runGenerator(oklch, resetOptions, value);
    setPalette(pal);
    setDuplicatePalette(pal);
    setAnalogPalType(value);
  };

  const handleAngle1Change = (newAngle1) => {
    const updatedOptions = {
      ...analogOptions,
      analogousAngle1: newAngle1,
    };
    setAnalogOptions(updatedOptions);
    const pal = runGenerator(oklch, updatedOptions, analogPalType);
    setPalette(pal);
    setDuplicatePalette(pal);
  };

  const handleAngle2Change = (newAngle2) => {
    const updatedOptions = {
      ...analogOptions,
      analogousAngle2: newAngle2,
    };
    setAnalogOptions(updatedOptions);
    const pal = runGenerator(oklch, updatedOptions, analogPalType);
    setPalette(pal);
    setDuplicatePalette(pal);
  };

  const handleMirrorAngles = () => {
    // Sync angle2 to mirror angle1
    const mirrored = -angle1;
    const updatedOptions = {
      ...analogOptions,
      analogousAngle2: mirrored,
    };
    setAnalogOptions(updatedOptions);
    const pal = runGenerator(oklch, updatedOptions, analogPalType);
    setPalette(pal);
    setDuplicatePalette(pal);
  };

  const handleReset = () => {
    const resetOptions = {
      analogousAngle1: null,
      analogousAngle2: null,
    };
    setAnalogOptions(resetOptions);
    const pal = runGenerator(oklch, resetOptions, analogPalType);
    setPalette(pal);
    setDuplicatePalette(pal);
  };

  // ── Render ────────────────────────────────

  return (
    <div className="flex flex-col gap-6">
      {/* Palette type selector — grouped by intent */}
      <div>
        <h3 className="font-semibold mb-3">Palette Type</h3>
        <div className="flex flex-col gap-4">
          {ANALOG_TYPES.map(({ group, description, types }) => (
            <div key={group}>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm font-medium">{group}</span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  {description}
                </span>
              </div>
              <div className="flex gap-2">
                {types.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => handleTypeChange(id)}
                    className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                      analogPalType === id
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]"
                        : "bg-background border-[var(--navBorder)] hover:border-[var(--muted-foreground)]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Angle controls — independent sliders */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Hue Spread</h3>
          {isAsymmetric && (
            <span className="text-xs text-[var(--muted-foreground)] italic">
              Asymmetric
            </span>
          )}
        </div>

        {/* Angle 1 — left spread (always negative in centered, used for left layout) */}
        {layoutType === "centered" && (
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-sm">
              <label className="text-[var(--muted-foreground)]">
                Left spread (A1)
              </label>
              <span className="font-mono">{angle1}°</span>
            </div>
            <input
              type="range"
              min="-60"
              max="-5"
              step="1"
              value={angle1}
              onChange={(e) => handleAngle1Change(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        {/* Angle 2 — right spread (always positive in centered) */}
        {layoutType === "centered" && (
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-sm">
              <label className="text-[var(--muted-foreground)]">
                Right spread (A2)
              </label>
              <span className="font-mono">+{angle2}°</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="1"
              value={angle2}
              onChange={(e) => handleAngle2Change(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        {/* For left/right layouts: single spread control */}
        {layoutType !== "centered" && (
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-sm">
              <label className="text-[var(--muted-foreground)]">
                Spread angle
              </label>
              <span className="font-mono">
                {layoutType === "left" ? angle1 : `+${angle2}`}°
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="1"
              value={Math.abs(layoutType === "left" ? angle1 : angle2)}
              onChange={(e) => {
                const v = parseInt(e.target.value);
                if (layoutType === "left") {
                  handleAngle1Change(-v);
                } else {
                  handleAngle2Change(v);
                }
              }}
              className="w-full"
            />
          </div>
        )}

        {/* Mirror / Reset actions */}
        <div className="flex gap-2">
          {layoutType === "centered" && (
            <button
              onClick={handleMirrorAngles}
              className="flex-1 px-3 py-2 text-sm bg-background rounded-md border border-[var(--navBorder)] hover:border-[var(--muted-foreground)]"
              title="Set both angles to the same absolute value"
            >
              Mirror angles
            </button>
          )}
          <button
            onClick={handleReset}
            className="flex-1 px-3 py-2 text-sm bg-background rounded-md border border-[var(--navBorder)] hover:border-[var(--muted-foreground)]"
          >
            Reset (±{Math.abs(defaults.angle1)}°)
          </button>
        </div>

        {/* Spread diagram — visual hint for what the angles mean */}
        <AngleVisualizer angle1={angle1} angle2={angle2} layout={layoutType} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ANGLE VISUALIZER
// Simple SVG diagram showing the three hue positions
// relative to each other on the color wheel arc.
// ─────────────────────────────────────────────
function AngleVisualizer({ angle1, angle2, layout }) {
  // Center sits near bottom so the arc opens upward with full clearance.
  // viewBox is 200×110: arc top at cy-r=95-70=25, labels 15px above → safe.
  const cx = 100;
  const cy = 95;
  const r = 70;

  // 0° = straight up. SVG 0° = 3-o'clock, so subtract 90° to rotate.
  const toPoint = (paletteDeg) => {
    const rad = ((paletteDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const base = toPoint(0); // straight up
  const p1 = toPoint(angle1); // left spread
  const p2 = toPoint(angle2); // right spread
  const arcStart = toPoint(-75); // background arc spans ±75°
  const arcEnd = toPoint(75);

  return (
    <div className="mt-1">
      <p className="text-xs text-[var(--muted-foreground)] mb-1">
        Hue positions on wheel
      </p>
      <svg
        viewBox="0 0 200 110"
        className="w-full max-w-[220px] opacity-75"
        aria-label="Analogous angle diagram"
      >
        {/* Background arc — spans ±75° so even extreme angles stay inside */}
        <path
          d={`M ${arcStart.x} ${arcStart.y} A ${r} ${r} 0 0 1 ${arcEnd.x} ${arcEnd.y}`}
          fill="none"
          stroke="var(--navBorder)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Spoke lines from center to each hue */}
        <line
          x1={cx}
          y1={cy}
          x2={p1.x}
          y2={p1.y}
          stroke="var(--muted-foreground)"
          strokeWidth="1.2"
          strokeDasharray="4 3"
        />
        <line
          x1={cx}
          y1={cy}
          x2={base.x}
          y2={base.y}
          stroke="var(--primary)"
          strokeWidth="1.8"
        />
        <line
          x1={cx}
          y1={cy}
          x2={p2.x}
          y2={p2.y}
          stroke="var(--muted-foreground)"
          strokeWidth="1.2"
          strokeDasharray="4 3"
        />
        {/* Hue dots */}
        <circle
          cx={p1.x}
          cy={p1.y}
          r="5"
          fill="var(--muted-foreground)"
          opacity="0.7"
        />
        <circle cx={base.x} cy={base.y} r="6" fill="var(--primary)" />
        <circle
          cx={p2.x}
          cy={p2.y}
          r="5"
          fill="var(--muted-foreground)"
          opacity="0.7"
        />
        {/* Labels */}
        <text
          x={p1.x - 4}
          y={p1.y - 9}
          fontSize="9"
          textAnchor="middle"
          fill="var(--muted-foreground)"
        >
          A1
        </text>
        <text
          x={base.x}
          y={base.y - 10}
          fontSize="9"
          textAnchor="middle"
          fill="var(--primary)"
        >
          Base
        </text>
        <text
          x={p2.x + 4}
          y={p2.y - 9}
          fontSize="9"
          textAnchor="middle"
          fill="var(--muted-foreground)"
        >
          A2
        </text>
      </svg>
    </div>
  );
}

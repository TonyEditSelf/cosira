import { useColorPaletteContext } from "../../ColorContext";
import splitCompPalGen, { SPLIT_COMP_PALETTE_INFO } from "./splitCompPalGen";

export default function SplitCompOptions() {
  const {
    oklch,
    setPalette,
    setDuplicatePalette,
    splitCompOptions,
    handleSplitCompAngleChange,
    splitCompPalType,
    setSplitCompPalType,
    splitCompMirror,
    setSplitCompMirror,
  } = useColorPaletteContext();

  // ── Angle change — respects mirror lock ────────────────────────────────────
  const handleAngle = (value, id) => {
    if (splitCompMirror) {
      const abs = Math.abs(value);
      // Whichever slider moved, sync both to ±abs
      handleSplitCompAngleChange(-abs, "splitCompAngle1");
      handleSplitCompAngleChange(abs, "splitCompAngle2");
    } else {
      handleSplitCompAngleChange(value, id);
    }
  };

  // ── Mirror toggle — snap angles to symmetric on enable ────────────────────
  const handleMirrorToggle = () => {
    const next = !splitCompMirror;
    setSplitCompMirror(next);
    if (next) {
      // Use angle2's absolute value as the canonical spread
      const abs = Math.abs(splitCompOptions.splitCompAngle2);
      handleSplitCompAngleChange(-abs, "splitCompAngle1");
      handleSplitCompAngleChange(abs, "splitCompAngle2");
    }
  };

  // ── Type change ────────────────────────────────────────────────────────────
  const handleTypeChange = (id) => {
    setSplitCompPalType(id);
    const pal = splitCompPalGen(oklch, splitCompOptions, id);
    setPalette(pal);
    setDuplicatePalette(pal);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* ── Palette Type ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">
          Palette Type
        </p>
        {SPLIT_COMP_PALETTE_INFO.map(({ id, name, description }) => (
          <div key={id} className="flex flex-col gap-0.5">
            <div className="flex gap-3 items-center">
              <input
                type="radio"
                name="splitCompPal"
                id={id}
                value={id}
                checked={splitCompPalType === id}
                onChange={() => handleTypeChange(id)}
              />
              <label htmlFor={id} className="font-medium">
                {name}
              </label>
            </div>
            {splitCompPalType === id && (
              <p className="text-[9px] opacity-60 ml-6 mb-1">{description}</p>
            )}
          </div>
        ))}
      </div>

      {/* ── Angle Controls ────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">
            Split Angles
          </p>

          {/* Mirror toggle */}
          <button
            onClick={handleMirrorToggle}
            className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded transition-opacity ${
              splitCompMirror ? "opacity-100" : "opacity-40 hover:opacity-70"
            }`}
          >
            <span
              className={`w-3 h-3 rounded-sm border-2 flex items-center justify-center transition-colors ${
                splitCompMirror ? "border-current bg-current" : "border-current"
              }`}
            >
              {splitCompMirror && (
                <svg
                  viewBox="0 0 8 8"
                  className="w-2 h-2 fill-none stroke-white stroke-[1.5]"
                >
                  <polyline points="1,4 3,6 7,2" />
                </svg>
              )}
            </span>
            Mirror
          </button>
        </div>

        <div className="flex flex-col gap-4 text-sm font-semibold">
          {/* Angle 1 */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="splitCompAngle1" className="text-xs">
                SC1 Angle
              </label>
              <span className="text-[11px] font-mono opacity-60 tabular-nums">
                {splitCompOptions.splitCompAngle1}°
              </span>
            </div>
            <input
              type="range"
              id="splitCompAngle1"
              min={-90}
              max={-5}
              step={1}
              value={splitCompOptions.splitCompAngle1}
              onChange={(e) =>
                handleAngle(parseFloat(e.target.value), e.target.id)
              }
              className="w-full"
            />
            <div className="flex justify-between text-[9px] opacity-30 font-normal">
              <span>−90°</span>
              <span>−5°</span>
            </div>
          </div>

          {/* Angle 2 */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="splitCompAngle2" className="text-xs">
                SC2 Angle
              </label>
              <span className="text-[11px] font-mono opacity-60 tabular-nums">
                {splitCompOptions.splitCompAngle2}°
              </span>
            </div>
            <input
              type="range"
              id="splitCompAngle2"
              min={5}
              max={90}
              step={1}
              value={splitCompOptions.splitCompAngle2}
              onChange={(e) =>
                handleAngle(parseFloat(e.target.value), e.target.id)
              }
              className="w-full"
            />
            <div className="flex justify-between text-[9px] opacity-30 font-normal">
              <span>5°</span>
              <span>90°</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

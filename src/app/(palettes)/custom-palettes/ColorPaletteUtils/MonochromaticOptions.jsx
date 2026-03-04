import { useState } from "react";
import { useColorPaletteContext } from "../../ColorContext";
import monochromaticPalGen, {
  PURE_PALETTE_INFO,
  TONAL_PALETTE_INFO,
} from "./monochromaticPalGen";

export default function MonochromaticOptions() {
  const ctx = useColorPaletteContext();
  const {
    setPalette,
    setDuplicatePalette,
    oklch,
    monoPalType,
    setMonoPalType,
    monoColorCount   = 8,
    setMonoColorCount,
    monoHueDrift     = null,
    setMonoHueDrift,
  } = ctx;

  // ── helpers ────────────────────────────────────────────────────────────────

  const regen = (type, count, drift) => {
    const pal = monochromaticPalGen(oklch, type, count, drift);
    setPalette(pal);
    setDuplicatePalette(pal);
  };

  const handleTypeChange = (id, naturalDrift) => {
    setMonoPalType(id);
    // Reset drift to strategy's natural default when switching types
    setMonoHueDrift(naturalDrift);
    regen(id, monoColorCount, naturalDrift);
  };

  const handleCountChange = (count) => {
    setMonoColorCount(count);
    regen(monoPalType, count, monoHueDrift);
  };

  const handleDriftChange = (val) => {
    setMonoHueDrift(val);
    regen(monoPalType, monoColorCount, val);
  };

  // Determine current tier for contextual UI
  const allInfo     = [...PURE_PALETTE_INFO, ...TONAL_PALETTE_INFO];
  const currentInfo = allInfo.find((p) => p.id === monoPalType);
  const currentTier = currentInfo?.tier ?? "pure";

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-5">

      {/* ── Color Count ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">
            Color Count
          </p>
          <span className="text-[11px] font-semibold tabular-nums opacity-75">
            {monoColorCount} colors
          </span>
        </div>

        <input
          type="range"
          min={4} max={15} step={1}
          value={monoColorCount}
          onChange={(e) => handleCountChange(Number(e.target.value))}
          style={{ width: "100%", cursor: "pointer", accentColor: "currentColor" }}
        />

        <div className="flex justify-between">
          <span className="text-[9px] opacity-40">4</span>
          <span className="text-[9px] opacity-40">15</span>
        </div>
      </div>

      {/* ── Hue Drift ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">
              Hue Drift
            </p>
            {/* Tier badge */}
            <span
              className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full
                ${currentTier === "pure"
                  ? "bg-current/10 opacity-60"
                  : "bg-current/20 opacity-80"
                }`}
            >
              {currentTier === "pure" ? "Pure" : "Tonal"}
            </span>
          </div>
          <span className="text-[11px] font-semibold tabular-nums opacity-75">
            {(monoHueDrift ?? currentInfo?.naturalDrift ?? 0).toFixed(1)}°
          </span>
        </div>

        <input
          type="range"
          min={0} max={15} step={0.5}
          value={monoHueDrift ?? currentInfo?.naturalDrift ?? 0}
          onChange={(e) => handleDriftChange(Number(e.target.value))}
          style={{ width: "100%", cursor: "pointer", accentColor: "currentColor" }}
        />

        <div className="flex justify-between">
          <span className="text-[9px] opacity-40">Pure (0°)</span>
          <span className="text-[9px] opacity-40">Expressive (15°)</span>
        </div>

        {/* Contextual hint */}
        <p className="text-[9px] opacity-50 leading-relaxed">
          {currentTier === "pure"
            ? "Hue is locked at 0° by default. Increase to add expressive drift across the scale."
            : `This tonal palette naturally drifts ${currentInfo?.naturalDrift ?? 0}°. Reduce to 0° for a pure variant.`
          }
        </p>
      </div>

      {/* ── Palette Type — Pure ────────────────────────────────────────── */}
      <PaletteGroup
        label="Pure"
        badge="Hue locked"
        items={PURE_PALETTE_INFO}
        currentId={monoPalType}
        onSelect={handleTypeChange}
      />

      {/* ── Palette Type — Tonal ──────────────────────────────────────── */}
      <PaletteGroup
        label="Tonal"
        badge="Hue drifts"
        items={TONAL_PALETTE_INFO}
        currentId={monoPalType}
        onSelect={handleTypeChange}
      />

    </div>
  );
}

// ── Sub-component: grouped radio list ──────────────────────────────────────

function PaletteGroup({ label, badge, items, currentId, onSelect }) {
  return (
    <div className="flex flex-col gap-1">
      {/* Group header */}
      <div className="flex items-center gap-2 mb-1">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">
          {label}
        </p>
        <span className="text-[8px] opacity-40 uppercase tracking-widest">
          — {badge}
        </span>
      </div>

      {items.map(({ id, name, description, naturalDrift }) => (
        <div key={id} className="flex flex-col gap-0.5">
          <div className="flex gap-3 items-center">
            <input
              type="radio"
              name="monoPal"
              id={id}
              value={id}
              checked={currentId === id}
              onChange={() => onSelect(id, naturalDrift)}
            />
            <label htmlFor={id} className="font-medium cursor-pointer">
              {name}
            </label>
          </div>
          {currentId === id && (
            <p className="text-[9px] opacity-60 ml-6 mb-1">{description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
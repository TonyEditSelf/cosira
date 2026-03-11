import { useState, useMemo, useRef, useCallback } from "react";
import chroma from "chroma-js";
import { useColorPaletteContext } from "../ColorContext";
import {
  oklchToHex,
  oklchToCss,
} from "../custom-palettes/_components/Pickers/components/colorutil";

// ── Constants ────────────────────────────────────────────────────
const WARM_HUE = 40; // amber anchor
const COOL_HUE = 240; // blue anchor

// ── Correct circular hue delta (handles 0°/360° wrap) ───────────
function circularHueDelta(h1, h2) {
  let diff = Math.abs(h2 - h1);
  if (diff > 180) diff = 360 - diff;
  return diff;
}

// ── Temperature shift in OKLCH ───────────────────────────────────
// Always uses the shortest hue arc — most predictable and perceptually coherent.
// Natural path (longer arc through greens) was tested but removed:
//   - Only affects ~25% of hue space
//   - Produces perceptually wrong intermediates (red→yellow-green→blue is not how
//     cool light works on warm colors; shortest arc through magentas is closer to reality)
//   - Presets that warrant the longer arc encode it internally where it makes sense
function shiftTemperature(color, amount, direction, options = {}) {
  const { lightnessNudge = false } = options;

  const targetHue = direction === "warm" ? WARM_HUE : COOL_HUE;

  // Shortest arc on the hue wheel
  let diff = targetHue - color.h;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;

  const newHue = (((color.h + diff * amount) % 360) + 360) % 360;

  // Chroma: warm boosts saturation slightly, cool desaturates slightly
  // Asymmetric — reflects real light physics (warm candlelight is vivid, cool shade is muted)
  const chromaFactor =
    direction === "warm" ? 1 + amount * 0.15 : 1 - amount * 0.08;
  const newChroma = Math.min(Math.max(color.c * chromaFactor, 0.01), 0.37);

  // Lightness nudge: real temperature shifts affect luminance
  // Warm light → slightly brighter (candle/golden hour lifts midtones)
  // Cool light → slightly darker/flatter (overcast/shade lowers perceived brightness)
  let newL = color.l;
  if (lightnessNudge) {
    const lFactor =
      direction === "warm"
        ? 1 + amount * 0.04 // +4% L at full warm
        : 1 - amount * 0.05; // -5% L at full cool
    newL = Math.min(Math.max(color.l * lFactor, 0.01), 0.99);
  }

  return { ...color, h: newHue, c: newChroma, l: newL };
}

// ── Presets ──────────────────────────────────────────────────────
// Each preset is a COMPLETE state: direction + amount + lightnessNudge
// Ordered by real color temperature (Kelvin), warmest → coolest
const PRESETS = [
  {
    label: "Candlelight",
    emoji: "🕯️",
    description: "1800K · flame orange, lifted brights",
    direction: "warm",
    amount: 0.7,
    lightnessNudge: true,
  },
  {
    label: "Golden Hour",
    emoji: "🌅",
    description: "2800K · amber warmth, richer saturation",
    direction: "warm",
    amount: 0.42,
    lightnessNudge: true,
  },
  {
    label: "Warm Studio",
    emoji: "💡",
    description: "3200K · tungsten light, subtle warmth",
    direction: "warm",
    amount: 0.22,
    lightnessNudge: false,
  },
  {
    label: "Overcast",
    emoji: "☁️",
    description: "6500K · diffused daylight, gentle cool",
    direction: "cool",
    amount: 0.18,
    lightnessNudge: false,
  },
  {
    label: "Open Shade",
    emoji: "🌲",
    description: "8000K · cool shadow, desaturated",
    direction: "cool",
    amount: 0.4,
    lightnessNudge: true,
  },
  {
    label: "Twilight",
    emoji: "🌑",
    description: "10000K+ · deep blue hour, moody",
    direction: "cool",
    amount: 0.65,
    lightnessNudge: true,
  },
];

// ── Step config ──────────────────────────────────────────────────
const STEP_FRACTIONS = [0, 0.2, 0.4, 0.6, 0.8, 1.0]; // 6 steps for finer resolution

// ── Utilities ────────────────────────────────────────────────────
function getContrastColor(hex) {
  try {
    return chroma.contrast(hex, "white") > chroma.contrast(hex, "black")
      ? "white"
      : "black";
  } catch {
    return "black";
  }
}

function wcagBadge(contrastW, contrastB) {
  const best = Math.max(contrastW, contrastB);
  if (best >= 7)
    return {
      label: "AAA",
      color: "text-emerald-600",
      bg: "bg-emerald-500/10 border-emerald-500/30",
    };
  if (best >= 4.5)
    return {
      label: "AA",
      color: "text-sky-600",
      bg: "bg-sky-500/10 border-sky-500/30",
    };
  if (best >= 3)
    return {
      label: "AA+",
      color: "text-amber-600",
      bg: "bg-amber-500/10 border-amber-500/30",
      title: "Passes for large text only",
    };
  return {
    label: "Fail",
    color: "text-red-500",
    bg: "bg-red-500/10 border-red-500/30",
  };
}

export default function TempShifter() {
  const { palette, setPalette } = useColorPaletteContext();

  const [direction, setDirection] = useState("warm");
  const [amount, setAmount] = useState(0.35);
  const [lightnessNudge, setLightnessNudge] = useState(false);
  const [lockedColors, setLockedColors] = useState(new Set());
  const [copiedMsg, setCopiedMsg] = useState("");
  const toastTimerRef = useRef(null);

  // ── Toast helper (clears previous timer — fixes stacked setTimeout) ──
  const showToast = useCallback((msg) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setCopiedMsg(msg);
    toastTimerRef.current = setTimeout(() => setCopiedMsg(""), 2500);
  }, []);

  // ── Copy with fallback ───────────────────────────────────────────
  const copyText = useCallback(
    async (text, msg) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        try {
          const ta = Object.assign(document.createElement("textarea"), {
            value: text,
            style: "position:fixed;opacity:0",
          });
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
        } catch {
          showToast("Copy failed — use Ctrl+C");
          return;
        }
      }
      showToast(msg);
    },
    [showToast],
  );

  // ── Toggle color lock ────────────────────────────────────────────
  const toggleLock = (colorIndex) => {
    setLockedColors((prev) => {
      const next = new Set(prev);
      next.has(colorIndex) ? next.delete(colorIndex) : next.add(colorIndex);
      return next;
    });
  };

  // ── Shifted palette computation ──────────────────────────────────
  const shiftedPalette = useMemo(() => {
    return palette.map((color, colorIndex) => {
      const base = color.value; // { l, c, h }
      const baseHex = oklchToHex(base.l, base.c, base.h);
      const isLocked = lockedColors.has(colorIndex);

      const steps = STEP_FRACTIONS.map((fraction) => {
        // Locked colors: only show original at every step
        const effectiveAmount = isLocked ? 0 : fraction * amount;
        const shifted = shiftTemperature(base, effectiveAmount, direction, {
          lightnessNudge,
        });
        const hex = oklchToHex(shifted.l, shifted.c, shifted.h);
        const cW = chroma.contrast(hex, "white");
        const cB = chroma.contrast(hex, "black");
        const badge = wcagBadge(cW, cB);

        return {
          fraction, // 0–1 of STEP_FRACTIONS
          effectiveAmount, // actual shift applied (fraction × amount)
          shifted,
          hex,
          // Display values
          l: (shifted.l * 100).toFixed(1),
          c: shifted.c.toFixed(3),
          h: shifted.h.toFixed(1),
          contrastWhite: cW.toFixed(1),
          contrastBlack: cB.toFixed(1),
          badge,
          isBase: fraction === 0,
        };
      });

      // Correct circular hue delta
      const finalStep = steps[steps.length - 1];
      const hueDelta = circularHueDelta(base.h, finalStep.shifted.h);

      return { base, baseHex, colorIndex, steps, hueDelta, isLocked };
    });
  }, [palette, direction, amount, lightnessNudge, lockedColors]);

  // ── Exports ──────────────────────────────────────────────────────
  const exportCSS = () => {
    const intensityLabel = `${(amount * 100).toFixed(0)}pct`;
    const css = shiftedPalette
      .map((color, i) => {
        const final = color.steps[color.steps.length - 1];
        // Locked colors export as -base (unshifted) — not -warm-Npct-locked which is misleading
        const varName = color.isLocked
          ? `--color-${i + 1}-base`
          : `--color-${i + 1}-${direction}-${intensityLabel}`;
        return `  ${varName}: ${final.hex}; /* L:${final.l} C:${final.c} H:${final.h}° ${final.badge.label}${color.isLocked ? " · locked" : ""} */`;
      })
      .join("\n");
    copyText(`:root {\n${css}\n}`, "CSS variables copied!");
  };

  const exportAllStepsCSS = () => {
    const css = shiftedPalette
      .map((color, i) => {
        const lines = color.steps.map((step, si) => {
          const stepLabel = step.isBase
            ? "base"
            : `${direction}-${(step.fraction * 100).toFixed(0)}pct`;
          return `  --color-${i + 1}-${stepLabel}: ${step.hex};`;
        });
        return lines.join("\n");
      })
      .join("\n\n");
    copyText(`:root {\n${css}\n}`, "All steps copied as CSS!");
  };

  const exportJSON = () => {
    const json = shiftedPalette.map((color, i) => ({
      name: `Color ${i + 1}`,
      locked: color.isLocked,
      base: {
        hex: color.baseHex,
        l: (color.base.l * 100).toFixed(1),
        c: color.base.c.toFixed(3),
        h: color.base.h.toFixed(1),
      },
      shift: {
        direction,
        intensity: `${(amount * 100).toFixed(0)}%`,
        lightnessNudge,
      },
      result: color.steps[color.steps.length - 1].hex,
      hueDelta: `${color.hueDelta.toFixed(1)}°`,
      steps: color.steps.map((s) => ({
        fraction: `${(s.fraction * 100).toFixed(0)}%`,
        shift: `${(s.effectiveAmount * 100).toFixed(1)}%`,
        hex: s.hex,
        wcag: s.badge.label,
        contrast: { white: s.contrastWhite, black: s.contrastBlack },
      })),
    }));
    copyText(JSON.stringify(json, null, 2), "JSON copied!");
  };

  // ── Slider track gradient ────────────────────────────────────────
  const sliderTrack =
    direction === "warm"
      ? "linear-gradient(to right, hsl(0,0%,55%), hsl(38,88%,54%))"
      : "linear-gradient(to right, hsl(0,0%,55%), hsl(218,78%,54%))";

  const directionEmoji = direction === "warm" ? "🔆" : "❄️";

  return (
    <div className="hidden bg-background lg:flex flex-col pt-3 h-full">
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="mx-4 mb-2 p-3 border border-(--navBorder) rounded-md bg-foreground/[0.015] flex items-center justify-between gap-3 flex-wrap flex-shrink-0">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest">
            Temperature Shifter
          </span>
          <div className="h-3 w-px bg-(--navBorder)" />
          <span className="text-[10px] font-bold text-(--brand)">
            {directionEmoji} {direction === "warm" ? "Warm" : "Cool"} ·{" "}
            {(amount * 100).toFixed(0)}%
          </span>
          <div className="h-3 w-px bg-(--navBorder)" />
          {/* Lightness nudge */}
          <button
            onClick={() => setLightnessNudge((v) => !v)}
            title="Warm light raises lightness slightly; cool light lowers it — more photorealistic"
            className={`flex items-center gap-1.5 px-2 py-0.5 text-[8px] font-bold rounded border transition-all uppercase tracking-wide ${lightnessNudge ? "border-(--brand) text-(--brand) bg-foreground/[0.03]" : "border-(--navBorder) text-foreground/30 hover:text-foreground/50"}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${lightnessNudge ? "bg-(--brand)" : "bg-foreground/20"}`}
            />
            Lightness Nudge
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSS}
            className="px-3 py-1.5 text-[9px] font-bold border border-(--navBorder) rounded hover:bg-foreground/5 hover:border-(--brand) transition-colors uppercase tracking-wide"
          >
            CSS
          </button>
          <button
            onClick={exportAllStepsCSS}
            className="px-3 py-1.5 text-[9px] font-bold border border-(--navBorder) rounded hover:bg-foreground/5 hover:border-(--brand) transition-colors uppercase tracking-wide"
          >
            CSS All Steps
          </button>
          <button
            onClick={exportJSON}
            className="px-3 py-1.5 text-[9px] font-bold border border-(--navBorder) rounded hover:bg-foreground/5 hover:border-(--brand) transition-colors uppercase tracking-wide"
          >
            JSON
          </button>
        </div>
      </div>

      {/* ── Main layout ──────────────────────────────────────────── */}
      <div className="flex flex-1 gap-2 mx-4 mb-3 min-h-0">
        {/* ── Left panel ───────────────────────────────────────── */}
        <div className="w-52 border border-(--navBorder) rounded-md bg-foreground/[0.015] flex flex-col overflow-y-auto flex-shrink-0">
          {/* Direction */}
          <div className="p-3 border-b border-(--navBorder)">
            <span className="text-[8px] font-bold text-foreground/25 uppercase tracking-widest block mb-2">
              Direction
            </span>
            <div className="flex gap-1.5">
              {[
                { id: "warm", label: "🔆 Warm" },
                { id: "cool", label: "❄️ Cool" },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDirection(d.id)}
                  className={`flex-1 py-2 rounded text-[9px] font-bold border transition-all ${direction === d.id ? "border-(--brand) text-(--brand) bg-foreground/[0.03]" : "border-(--navBorder) text-foreground/40 hover:text-foreground/60"}`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Intensity */}
          <div className="p-3 border-b border-(--navBorder)">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[8px] font-bold text-foreground/25 uppercase tracking-widest">
                Intensity
              </span>
              <span className="text-[10px] font-mono font-bold text-(--brand)">
                {(amount * 100).toFixed(0)}%
              </span>
            </div>
            <div className="relative h-5 flex items-center mb-1">
              <div
                className="absolute w-full h-2 rounded-full"
                style={{ background: sliderTrack }}
              />
              <input
                type="range"
                min="0.05"
                max="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                className="relative w-full h-2 rounded-full appearance-none cursor-pointer bg-transparent accent-(--brand)"
                style={{ WebkitAppearance: "none" }}
              />
            </div>
            <div className="flex justify-between">
              <span className="text-[7px] text-foreground/20">Subtle</span>
              <span className="text-[7px] text-foreground/20">Full</span>
            </div>
          </div>

          {/* Presets */}
          <div className="p-3 border-b border-(--navBorder)">
            <span className="text-[8px] font-bold text-foreground/25 uppercase tracking-widest block mb-2">
              Presets
            </span>
            <div className="flex flex-col gap-1">
              {PRESETS.map((preset) => {
                const isActive =
                  direction === preset.direction &&
                  Math.abs(amount - preset.amount) < 0.01 &&
                  lightnessNudge === preset.lightnessNudge;
                return (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setDirection(preset.direction);
                      setAmount(preset.amount);
                      setLightnessNudge(preset.lightnessNudge);
                    }}
                    className={`w-full px-2.5 py-2 rounded text-left border transition-all ${isActive ? "border-(--brand) bg-foreground/[0.03]" : "border-(--navBorder) hover:border-foreground/20"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] font-bold ${isActive ? "text-(--brand)" : "text-foreground/60"}`}
                      >
                        {preset.emoji} {preset.label}
                      </span>
                      <span className="text-[7px] font-mono text-foreground/25">
                        {(preset.amount * 100).toFixed(0)}%
                      </span>
                    </div>
                    <span className="text-[7px] text-foreground/25 leading-tight block mt-0.5">
                      {preset.description}
                    </span>
                    <div className="flex gap-1 mt-1.5">
                      {preset.lightnessNudge && (
                        <span className="text-[6px] px-1 py-0.5 rounded bg-foreground/5 border border-(--navBorder) text-foreground/30 font-bold uppercase tracking-wide">
                          L nudge
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Palette overview */}
          {palette.length > 0 && (
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[8px] font-bold text-foreground/25 uppercase tracking-widest">
                  Your Palette
                </span>
                <span className="text-[7px] text-foreground/20">
                  {lockedColors.size > 0 ? `${lockedColors.size} locked` : ""}
                </span>
              </div>
              <div className="flex gap-1 flex-wrap">
                {palette.map((c, i) => {
                  const hex = oklchToHex(c.value.l, c.value.c, c.value.h);
                  const locked = lockedColors.has(i);
                  return (
                    <button
                      key={i}
                      onClick={() => toggleLock(i)}
                      title={
                        locked
                          ? "Locked — click to unlock"
                          : "Click to lock this color"
                      }
                      className={`relative w-8 h-8 rounded border-2 transition-all ${locked ? "border-(--brand) opacity-50 scale-90" : "border-transparent hover:border-(--navBorder)"}`}
                      style={{ background: hex }}
                    >
                      {locked && (
                        <span className="absolute inset-0 flex items-center justify-center text-[10px]">
                          🔒
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-[7px] text-foreground/20 mt-2 leading-tight">
                Click a swatch to lock / unlock it from shifting
              </p>
            </div>
          )}
        </div>

        {/* ── Right: canvas ────────────────────────────────────── */}
        <div className="flex-1 border border-(--navBorder) rounded-md overflow-hidden relative bg-foreground/[0.01]">
          <div className="h-full overflow-y-auto p-5">
            {palette.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-[11px] text-foreground/30">
                  No colors in palette yet.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {shiftedPalette.map((colorData) => (
                  <ColorRow
                    key={colorData.colorIndex}
                    colorData={colorData}
                    direction={direction}
                    amount={amount}
                    onCopy={(hex) => copyText(hex, `Copied ${hex}`)}
                    onApplyStep={(step, colorIndex) => {
                      const next = palette.map((c, i) =>
                        i === colorIndex
                          ? {
                              ...c,
                              value: {
                                ...c.value,
                                l: step.shifted.l,
                                c: step.shifted.c,
                                h: step.shifted.h,
                              },
                            }
                          : c,
                      );
                      setPalette(next);
                      showToast(
                        `Applied ${step.hex} to Color ${colorData.colorIndex + 1}`,
                      );
                    }}
                    onToggleLock={() => toggleLock(colorData.colorIndex)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Toast */}
          {copiedMsg && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-foreground text-background px-4 py-2 rounded-full shadow-2xl z-50 text-[9px] font-bold uppercase tracking-widest pointer-events-none whitespace-nowrap">
              {copiedMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── ColorRow ─────────────────────────────────────────────────────
function ColorRow({
  colorData,
  direction,
  amount,
  onCopy,
  onApplyStep,
  onToggleLock,
}) {
  const { base, baseHex, colorIndex, steps, hueDelta, isLocked } = colorData;
  const finalStep = steps[steps.length - 1];
  const dirEmoji = direction === "warm" ? "🔆" : "❄️";

  return (
    <div
      className={`pb-8 border-b border-(--navBorder) last:border-0 last:pb-0 ${isLocked ? "opacity-60" : ""}`}
    >
      {/* Row header */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-4 h-4 rounded-full border border-black/10 flex-shrink-0"
          style={{ backgroundColor: baseHex }}
        />
        <span className="text-[10px] font-bold text-foreground/70 uppercase tracking-wider">
          Color {colorIndex + 1}
        </span>
        <span className="text-[8px] font-mono text-foreground/30">
          {baseHex.toUpperCase()}
        </span>
        <span className="text-[8px] text-foreground/20">
          L:{(base.l * 100).toFixed(0)} C:{base.c.toFixed(2)} H:
          {base.h.toFixed(0)}°
        </span>
        {!isLocked && (
          <span className="text-[8px] text-foreground/30 ml-auto flex items-center gap-1.5">
            {dirEmoji} {direction} shift
            <span className="font-mono font-bold text-(--brand)">
              {(amount * 100).toFixed(0)}%
            </span>
            · hue Δ{" "}
            <span className="font-mono font-bold text-(--brand)">
              {hueDelta.toFixed(0)}°
            </span>
          </span>
        )}
        {isLocked && (
          <span className="text-[8px] font-bold text-foreground/30 ml-auto">
            🔒 Locked
          </span>
        )}
        <button
          onClick={onToggleLock}
          className="text-[8px] px-1.5 py-0.5 rounded border border-(--navBorder) text-foreground/30 hover:border-(--brand) hover:text-(--brand) transition-colors"
        >
          {isLocked ? "Unlock" : "Lock"}
        </button>
      </div>

      {/* Gradient strip */}
      <div className="flex h-12 rounded-lg overflow-hidden border border-(--navBorder) shadow-sm mb-4">
        {steps.map((step, si) => {
          // FIXED: show step as % of total intensity, not raw math
          // This is what designers expect — "how far along the slider am I?"
          const stepPctOfTotal = step.isBase
            ? 0
            : Math.round(step.fraction * 100);
          const textC = getContrastColor(step.hex);
          return (
            <div
              key={si}
              onClick={() => onCopy(step.hex)}
              className="flex-1 cursor-pointer group relative transition-all hover:flex-[1.6]"
              style={{ backgroundColor: step.hex }}
            >
              <div
                className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: textC }}
              >
                <span className="text-[8px] font-bold font-mono drop-shadow">
                  {step.isBase ? "BASE" : `${stepPctOfTotal}%`}
                </span>
                <span className="text-[7px] font-mono opacity-70 drop-shadow">
                  {step.hex}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Before / After + Apply */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Before */}
        <div
          onClick={() => onCopy(baseHex)}
          className="group p-3 bg-background border border-(--navBorder) rounded-lg cursor-pointer hover:border-(--brand) transition-all"
        >
          <div
            className="w-full h-14 rounded-md mb-2.5 flex items-end p-2 border border-black/5"
            style={{ backgroundColor: baseHex }}
          >
            <span className="text-[7px] font-bold px-1.5 py-0.5 rounded bg-black/20 text-white uppercase tracking-wide">
              Original
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-foreground/80 block">
            {baseHex.toUpperCase()}
          </span>
          <div className="flex gap-2 text-[7px] font-mono text-foreground/35 mt-0.5">
            <span>L:{(base.l * 100).toFixed(0)}</span>
            <span>C:{base.c.toFixed(2)}</span>
            <span>H:{base.h.toFixed(0)}°</span>
          </div>
        </div>

        {/* After */}
        <div
          onClick={() => onCopy(finalStep.hex)}
          className="group p-3 bg-background border border-(--navBorder) rounded-lg cursor-pointer hover:border-(--brand) transition-all"
        >
          <div
            className="w-full h-14 rounded-md mb-2.5 flex items-end justify-between p-2 border border-black/5"
            style={{ backgroundColor: finalStep.hex }}
          >
            <span
              className="text-[7px] font-bold px-1.5 py-0.5 rounded bg-black/20 uppercase tracking-wide"
              style={{ color: getContrastColor(finalStep.hex) }}
            >
              {dirEmoji} {direction === "warm" ? "Warm" : "Cool"}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApplyStep(finalStep, colorIndex);
              }}
              className="text-[7px] font-bold px-1.5 py-0.5 rounded bg-black/30 text-white hover:bg-black/60 transition-colors uppercase tracking-wide"
            >
              Apply →
            </button>
          </div>
          <span className="text-[10px] font-mono font-bold text-foreground/80 block">
            {finalStep.hex.toUpperCase()}
          </span>
          <div className="flex gap-2 text-[7px] font-mono text-foreground/35 mt-0.5">
            <span>L:{finalStep.l}</span>
            <span>C:{finalStep.c}</span>
            <span>H:{finalStep.h}°</span>
          </div>
          {/* WCAG badges — both white and black contrast shown */}
          <div className="flex items-center gap-1.5 mt-2 pt-1.5 border-t border-(--navBorder)">
            <span
              className={`px-1.5 py-0.5 rounded border text-[7px] font-bold uppercase ${finalStep.badge.bg} ${finalStep.badge.color}`}
              title={finalStep.badge.title}
            >
              {finalStep.badge.label}
            </span>
            <span className="text-[7px] text-foreground/25 font-mono">
              /{finalStep.contrastWhite} on ◻ · /{finalStep.contrastBlack} on ◼
            </span>
          </div>
        </div>
      </div>

      {/* Step cards — 6 steps with fraction labels (FIXED: shows % of total, not raw math) */}
      <div className="grid grid-cols-6 gap-1.5">
        {steps.map((step, si) => {
          const stepPctOfTotal = step.isBase
            ? 0
            : Math.round(step.fraction * 100);
          const textC = getContrastColor(step.hex);
          return (
            <div
              key={si}
              className="group flex flex-col rounded-lg border border-(--navBorder) overflow-hidden cursor-pointer hover:border-(--brand) hover:shadow-md transition-all bg-background"
              onClick={() => onCopy(step.hex)}
            >
              {/* Swatch */}
              <div
                className="h-12 flex items-center justify-center relative transition-all group-hover:h-14"
                style={{ backgroundColor: step.hex, color: textC }}
              >
                <span className="text-[8px] font-bold font-mono opacity-0 group-hover:opacity-100 transition-opacity drop-shadow">
                  Copy
                </span>
                {/* Apply button on hover */}
                {!step.isBase && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onApplyStep(step, colorIndex);
                    }}
                    className="absolute bottom-1 right-1 text-[6px] font-bold px-1 py-0.5 rounded bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 uppercase"
                  >
                    Apply
                  </button>
                )}
              </div>

              {/* Info */}
              <div className="p-1.5 flex flex-col gap-0.5">
                {/* FIXED step label: % of total steps, not raw shift math */}
                <span className="text-[8px] font-mono font-bold text-foreground/60">
                  {step.isBase ? "Base" : `${stepPctOfTotal}%`}
                </span>
                <span className="text-[7px] font-mono text-foreground/30 truncate">
                  {step.hex}
                </span>
                <span className="text-[6px] font-mono text-foreground/20">
                  H:{step.h}°
                </span>
                <div className="mt-0.5 pt-0.5 border-t border-(--navBorder)">
                  <span
                    className={`text-[6px] font-bold uppercase ${step.badge.color}`}
                    title={`White: ${step.contrastWhite}:1  Black: ${step.contrastBlack}:1`}
                  >
                    {step.badge.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

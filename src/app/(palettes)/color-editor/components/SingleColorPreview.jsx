import { Check, AlertTriangle, Info, Lock } from "lucide-react";
import { getContrastText } from "../utils";

export function SingleColorPreview({
  originalColor,
  adjustedColor,
  originalHex,
  adjustedHex,
  deltaE,
  harmonyLock,
  hasChanges,
}) {
  const contrastColor = getContrastText(adjustedColor);

  return (
    <div className="h-full flex flex-col">
      {/* ── Header ── */}
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <h3 className="text-[10px] font-bold text-foreground/60 uppercase tracking-widest">
          Live Preview
        </h3>
        {deltaE > 0 && (
          <span className="text-[8px] font-mono bg-(--brand)/10 text-(--brand) px-1.5 py-0.5 rounded font-bold">
            ΔE: {deltaE.toFixed(1)}
          </span>
        )}
        {harmonyLock && (
          <span className="flex items-center gap-1 text-[8px] font-bold text-(--brand) border border-(--brand)/30 bg-(--brand)/5 px-2 py-0.5 rounded ml-auto">
            <Lock className="w-2.5 h-2.5" /> Harmony Lock — all colors will
            shift
          </span>
        )}
      </div>

      {/* ── Body: left swatches + right preview ── */}
      <div className="flex gap-5 flex-1 min-h-0">
        {/* ── Left: Original + Adjusted stacked ── */}
        <div
          className="flex flex-col gap-4 flex-shrink-0"
          style={{ width: "15rem" }}
        >
          {/* Original */}
          <div className="flex-1 flex flex-col">
            <span className="text-[8px] font-bold text-foreground/40 uppercase tracking-widest mb-1.5">
              Original
            </span>
            <div
              className="flex-1 rounded-2xl border border-(--navBorder) flex flex-col items-center justify-center gap-1 shadow-sm"
              style={{
                backgroundColor: originalHex,
                color: getContrastText(originalColor),
              }}
            >
              <span className="text-lg font-bold font-mono tracking-tight">
                {originalHex.toUpperCase()}
              </span>
              <span className="text-[9px] font-mono opacity-60">
                L:{(originalColor.l * 100).toFixed(0)} · C:
                {originalColor.c.toFixed(2)} · H:{originalColor.h.toFixed(0)}°
              </span>
            </div>
          </div>

          {/* Adjusted */}
          <div className="flex-1 flex flex-col">
            <span className="text-[8px] font-bold text-foreground/40 uppercase tracking-widest mb-1.5">
              Adjusted
            </span>
            <div
              className="flex-1 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 shadow-md transition-all"
              style={{
                backgroundColor: adjustedHex,
                color: getContrastText(adjustedColor),
                borderColor: hasChanges ? "var(--brand)" : "var(--navBorder)",
                boxShadow: hasChanges
                  ? `0 4px 24px ${adjustedHex}55`
                  : undefined,
              }}
            >
              <span className="text-lg font-bold font-mono tracking-tight">
                {adjustedHex.toUpperCase()}
              </span>
              <span className="text-[9px] font-mono opacity-60">
                L:{(adjustedColor.l * 100).toFixed(0)} · C:
                {adjustedColor.c.toFixed(2)} · H:{adjustedColor.h.toFixed(0)}°
              </span>
            </div>
          </div>
        </div>

        {/* ── Right: Preview panel ── */}
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          {/* Sample text box */}
          <div
            className="rounded-2xl border-2 px-6 py-5 flex flex-col items-center justify-center text-center transition-all flex-shrink-0"
            style={{
              backgroundColor: adjustedHex,
              color: contrastColor,
              borderColor: hasChanges ? "var(--brand)" : "var(--navBorder)",
            }}
          >
            <p className="text-2xl font-bold tracking-tight mb-1">
              Sample Text
            </p>
            <p className="text-xs opacity-70 font-medium">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>

          {/* Button · Badges · Icons row */}
          <div className="rounded-2xl border border-(--navBorder) px-5 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex flex-col gap-1.5 items-start">
              <span className="text-[7px] font-bold text-foreground/30 uppercase tracking-widest">
                Button
              </span>
              <button
                className="px-4 py-1.5 rounded-lg text-xs font-semibold hover:opacity-85 transition-all"
                style={{ backgroundColor: adjustedHex, color: contrastColor }}
              >
                Click Me
              </button>
            </div>

            <div className="w-px h-10 bg-foreground/10" />

            <div className="flex flex-col gap-1.5 items-start">
              <span className="text-[7px] font-bold text-foreground/30 uppercase tracking-widest">
                Badges
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{ backgroundColor: adjustedHex, color: contrastColor }}
                >
                  New
                </span>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border"
                  style={{ borderColor: adjustedHex, color: adjustedHex }}
                >
                  Outlined
                </span>
              </div>
            </div>

            <div className="w-px h-10 bg-foreground/10" />

            <div className="flex flex-col gap-1.5 items-start">
              <span className="text-[7px] font-bold text-foreground/30 uppercase tracking-widest">
                Icons
              </span>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4" style={{ color: adjustedHex }} />
                <AlertTriangle
                  className="w-4 h-4"
                  style={{ color: adjustedHex }}
                />
                <Info className="w-4 h-4" style={{ color: adjustedHex }} />
              </div>
            </div>
          </div>

          {/* Card */}
          <div
            className="rounded-2xl border flex-1 p-5 flex flex-col"
            style={{ borderColor: adjustedHex + "55" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-9 h-9 rounded-xl flex-shrink-0"
                style={{ backgroundColor: adjustedHex }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-foreground/80 truncate">
                  Card Title
                </div>
                <div className="text-[10px] text-foreground/40">
                  Subtitle text
                </div>
              </div>
              <span
                className="text-[9px] font-bold px-2.5 py-0.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: adjustedHex + "22",
                  color: adjustedHex,
                }}
              >
                Active
              </span>
            </div>

            <p className="text-[11px] text-foreground/50 leading-relaxed mb-4 flex-1">
              This component uses your adjusted color for accents, borders, and
              interactive states. Great for seeing how the color performs in
              real UI context.
            </p>

            <div className="flex items-center gap-2">
              <button
                className="px-4 py-1.5 rounded-lg text-xs font-semibold hover:opacity-85 transition-all"
                style={{ backgroundColor: adjustedHex, color: contrastColor }}
              >
                Card Action
              </button>
              <button
                className="px-4 py-1.5 rounded-lg text-xs font-semibold border hover:opacity-70 transition-all"
                style={{ borderColor: adjustedHex, color: adjustedHex }}
              >
                Secondary
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

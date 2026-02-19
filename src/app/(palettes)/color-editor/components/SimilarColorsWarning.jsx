import chroma from "chroma-js";
import { AlertTriangle } from "lucide-react";

export function SimilarColorsWarning({ similarColors, palette }) {
  if (similarColors.length === 0) return null;
  return (
    <div className="p-3 border-b border-yellow-500/30 bg-yellow-500/5">
      <div className="flex items-center gap-1.5 mb-2">
        <AlertTriangle className="w-4 h-4 text-yellow-600" />
        <span className="text-[9px] font-bold text-yellow-700 uppercase tracking-widest">
          Similar Colors
        </span>
      </div>
      <p className="text-[9px] text-yellow-700 mb-2">
        Too similar to {similarColors.length} color
        {similarColors.length > 1 ? "s" : ""}:
      </p>
      <div className="flex flex-wrap gap-1.5">
        {similarColors.map(({ idx, delta }) => {
          const hex = chroma
            .oklch(
              palette[idx].value.l,
              palette[idx].value.c,
              palette[idx].value.h,
            )
            .hex();
          return (
            <div
              key={idx}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/50 border border-yellow-500/30"
            >
              <div
                className="w-4 h-4 rounded border border-black/10"
                style={{ backgroundColor: hex }}
              />
              <span className="text-[9px] font-semibold text-yellow-800">
                #{idx + 1}
              </span>
              <span className="text-[9px] text-yellow-600 font-mono">
                {delta.toFixed(1)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useState } from "react";
import chroma from "chroma-js";
import { getContrastText, toHex } from "../utils";
import { ExportPanel } from "./ExportPanel";

export function BatchPreview({
  palette,
  adjustedPalette,
  harmonyLock,
  hasChanges,
}) {
  const [copiedIdx, setCopiedIdx] = useState(null);

  return (
    <>
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider">
            Batch Preview
          </h3>
          {hasChanges && (
            <span className="text-[9px] font-mono bg-(--brand)/10 text-(--brand) px-2 py-0.5 rounded font-bold">
              Live
            </span>
          )}
        </div>
        <p className="text-[10px] text-foreground/40">
          {harmonyLock
            ? "Proportional scaling — each color shifts relative to its own value"
            : "Flat delta — same absolute amount added to every color"}
        </p>
      </div>

      {/* Original row */}
      <div className="mb-3">
        <div className="text-[9px] font-bold text-foreground/40 uppercase tracking-wider mb-2">
          Original
        </div>
        <div className="flex gap-2">
          {palette.map((colorObj, idx) => {
            const hex = toHex(
              colorObj.value.l,
              colorObj.value.c,
              colorObj.value.h,
            );
            const txt = getContrastText(colorObj.value);
            return (
              <div
                key={idx}
                className="flex-1 aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 border border-black/10"
                style={{ backgroundColor: hex }}
              >
                <span
                  className="text-[10px] font-mono font-bold"
                  style={{ color: txt }}
                >
                  {hex.toUpperCase()}
                </span>
                <span className="text-[9px] font-mono" style={{ color: txt }}>
                  L:{(colorObj.value.l * 100).toFixed(0)}
                </span>
                <span className="text-[9px] font-mono" style={{ color: txt }}>
                  C:{colorObj.value.c.toFixed(2)}
                </span>
                <span className="text-[9px] font-mono" style={{ color: txt }}>
                  H:{colorObj.value.h.toFixed(0)}°
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Adjusted row */}
      <div className="mb-8">
        <div className="text-[9px] font-bold text-foreground/40 uppercase tracking-wider mb-2">
          Adjusted{" "}
          <span className="text-foreground/30 normal-case font-normal">
            — click to copy hex
          </span>
          {harmonyLock && (
            <span className="text-(--brand) ml-2 normal-case font-normal">
              ⊙ proportional
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {adjustedPalette.map((adjusted, idx) => {
            const hex = toHex(adjusted.l, adjusted.c, adjusted.h);
            const txt = getContrastText(adjusted);
            return (
              <div
                key={idx}
                className={`flex-1 aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 cursor-pointer border-2 transition-all hover:scale-105 hover:shadow-lg ${hasChanges ? "border-(--brand)" : "border-black/10"}`}
                style={{ backgroundColor: hex }}
                onClick={() => {
                  navigator.clipboard.writeText(hex);
                  setCopiedIdx(idx);
                  setTimeout(() => setCopiedIdx(null), 1500);
                }}
              >
                {copiedIdx === idx ? (
                  <span
                    className="text-[10px] font-bold"
                    style={{ color: txt }}
                  >
                    Copied!
                  </span>
                ) : (
                  <>
                    <span
                      className="text-[10px] font-mono font-bold"
                      style={{ color: txt }}
                    >
                      {hex.toUpperCase()}
                    </span>
                    <span
                      className="text-[9px] font-mono"
                      style={{ color: txt }}
                    >
                      L:{(adjusted.l * 100).toFixed(0)}
                    </span>
                    <span
                      className="text-[9px] font-mono"
                      style={{ color: txt }}
                    >
                      C:{adjusted.c.toFixed(2)}
                    </span>
                    <span
                      className="text-[9px] font-mono"
                      style={{ color: txt }}
                    >
                      H:{adjusted.h.toFixed(0)}°
                    </span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <ExportPanel adjustedPalette={adjustedPalette} />
    </>
  );
}

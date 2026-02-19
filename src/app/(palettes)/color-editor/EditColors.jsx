import { useState } from "react";
import chroma from "chroma-js";
import { RotateCcw, Check, Info, Lock } from "lucide-react";

import { useColorPaletteContext } from "../ColorContext";
import { useUndoRedo } from "./hooks/useUndoRedo";
import { useColorAdjustments } from "./hooks/useColorAdjustments";
import { useVariants } from "./hooks/useVariants";

import { SidebarHeader } from "./components/SidebarHeader";
import { VariantsPanel } from "./components/VariantsPanel";
import { AdjustmentSliders } from "./components/AdjustmentSliders";
import { ContrastBadge } from "./components/ContrastBadge";
import { SimilarColorsWarning } from "./components/SimilarColorsWarning";
import { SuggestionsPanel } from "./components/SuggestionsPanel";
import { BatchPreview } from "./components/BatchPreview";
import { SingleColorPreview } from "./components/SingleColorPreview";
import { toHex } from "./utils";

const ZERO = { l: 0, c: 0, h: 0 };

export default function EditColors() {
  const { palette, setPalette } = useColorPaletteContext();

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [adjustments, setAdjustments] = useState(ZERO);
  const [batchMode, setBatchMode] = useState(false);
  const [batchAdjustments, setBatchAdjustments] = useState(ZERO);
  const [harmonyLock, setHarmonyLock] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { undoStack, redoStack, pushUndo, handleUndo, handleRedo } =
    useUndoRedo(palette, setPalette);

  const {
    savedVariants,
    activeVariant,
    variantNameInput,
    setVariantNameInput,
    showVariantPanel,
    setShowVariantPanel,
    handleSaveVariant,
    handleLoadVariant,
    handleDeleteVariant,
  } = useVariants(palette, setPalette, pushUndo);

  const {
    originalColor,
    adjustedColor,
    adjustedPalette,
    deltaE,
    contrastInfo,
    suggestions,
    similarColors,
  } = useColorAdjustments({
    palette,
    selectedColorIndex,
    adjustments,
    batchAdjustments,
    batchMode,
    harmonyLock,
  });

  const hasChanges = batchMode
    ? Object.values(batchAdjustments).some((v) => v !== 0)
    : Object.values(adjustments).some((v) => v !== 0);

  if (!originalColor || !adjustedColor) return null;

  const originalHex = toHex(originalColor.l, originalColor.c, originalColor.h);
  const adjustedHex = toHex(adjustedColor.l, adjustedColor.c, adjustedColor.h);

  const handleSliderChange = (key, value, isBatch) => {
    if (isBatch) setBatchAdjustments((p) => ({ ...p, [key]: value }));
    else setAdjustments((p) => ({ ...p, [key]: value }));
  };

  const handleReset = () =>
    batchMode ? setBatchAdjustments(ZERO) : setAdjustments(ZERO);

  const handleApply = () => {
    if (!adjustedColor) return;
    pushUndo(palette);

    if (batchMode) {
      const lFactor = 1 + batchAdjustments.l;
      const cFactor = 1 + batchAdjustments.c;
      setPalette(
        palette.map((colorObj) => {
          const base = colorObj.value;
          const rawL = harmonyLock
            ? base.l * lFactor
            : base.l + batchAdjustments.l;
          const rawC = harmonyLock
            ? base.c * cFactor
            : base.c + batchAdjustments.c;
          return {
            ...colorObj,
            value: {
              l: Math.max(0, Math.min(1, rawL)),
              c: Math.max(0, Math.min(0.4, rawC)),
              h: (base.h + batchAdjustments.h + 360) % 360,
              a: base.a || 1,
            },
          };
        }),
      );
      setBatchAdjustments(ZERO);
    } else {
      const deltaL = adjustedColor.l - originalColor.l;
      const deltaC = adjustedColor.c - originalColor.c;
      const deltaH = adjustedColor.h - originalColor.h;
      setPalette(
        palette.map((colorObj, idx) => {
          if (idx === selectedColorIndex)
            return { ...colorObj, value: adjustedColor };
          if (!harmonyLock) return colorObj;
          const base = colorObj.value;
          return {
            ...colorObj,
            value: {
              l: Math.max(0, Math.min(1, base.l + deltaL)),
              c: Math.max(0, Math.min(0.4, base.c + deltaC)),
              h: (base.h + deltaH + 360) % 360,
              a: base.a || 1,
            },
          };
        }),
      );
      setAdjustments(ZERO);
    }

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="hidden bg-background lg:flex h-full gap-2">
      {/* ── Left Sidebar ── */}
      <aside className="w-80 border border-(--navBorder) rounded-md bg-background flex flex-col overflow-hidden ml-2 mb-2 flex-shrink-0">
        <SidebarHeader
          batchMode={batchMode}
          onToggleBatch={() => {
            setBatchMode(!batchMode);
            setAdjustments(ZERO);
            setBatchAdjustments(ZERO);
          }}
          undoStack={undoStack}
          redoStack={redoStack}
          onUndo={handleUndo}
          onRedo={handleRedo}
          harmonyLock={harmonyLock}
          onToggleHarmony={() => setHarmonyLock(!harmonyLock)}
          showVariantPanel={showVariantPanel}
          onToggleVariantPanel={() => setShowVariantPanel(!showVariantPanel)}
          savedVariants={savedVariants}
        />

        {/* Color selection — single mode */}
        {!batchMode && (
          <div className="p-3 border-b border-(--navBorder) flex-shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] font-bold text-foreground/50 uppercase tracking-widest">
                Select Color
              </span>
              <span className="text-[8px] text-foreground/30 font-mono">
                {selectedColorIndex + 1}/{palette.length}
              </span>
              {harmonyLock && (
                <span className="ml-auto text-[8px] text-(--brand) font-bold flex items-center gap-0.5">
                  <Lock className="w-2.5 h-2.5" /> All shift
                </span>
              )}
            </div>
            <div className="grid grid-cols-12 gap-1.5">
              {palette.map((color, idx) => {
                const hex = toHex(color.value.l, color.value.c, color.value.h);
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedColorIndex(idx);
                      setAdjustments(ZERO);
                    }}
                    className={`aspect-square rounded transition-all ${idx === selectedColorIndex ? "ring-2 ring-(--brand) ring-offset-1 ring-offset-background scale-110 shadow-lg" : "hover:scale-105 border border-(--navBorder)"}`}
                    style={{ backgroundColor: hex }}
                    title={`Color ${idx + 1}`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Scrollable area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <AdjustmentSliders
            adjustments={adjustments}
            batchAdjustments={batchAdjustments}
            batchMode={batchMode}
            adjustedColor={adjustedColor}
            onChange={handleSliderChange}
          />

          {/* Contrast — single mode */}
          {!batchMode && contrastInfo && (
            <div className="p-3 border-b border-(--navBorder)">
              <div className="flex items-center gap-1.5 mb-2">
                <Info className="w-3 h-3 text-foreground/40" />
                <span className="text-[9px] font-bold text-foreground/50 uppercase tracking-widest">
                  Contrast
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    bg: "white",
                    textCls: "text-black",
                    label: "vs White",
                    value: contrastInfo.vsWhite,
                    border: "border-gray-200",
                  },
                  {
                    bg: "black",
                    textCls: "text-white",
                    label: "vs Black",
                    value: contrastInfo.vsBlack,
                    border: "border-gray-700",
                  },
                ].map(({ bg, textCls, label, value, border }) => (
                  <div
                    key={label}
                    className={`p-2 rounded border ${border}`}
                    style={{ backgroundColor: bg }}
                  >
                    <div
                      className={`text-[7px] ${bg === "white" ? "text-gray-500" : "text-gray-400"} mb-0.5`}
                    >
                      {label}
                    </div>
                    <div className={`text-sm font-bold font-mono ${textCls}`}>
                      {value}:1
                    </div>
                    <div className="mt-1">
                      <ContrastBadge value={value} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!batchMode && (
            <SimilarColorsWarning
              similarColors={similarColors}
              palette={palette}
            />
          )}

          {!batchMode && (
            <SuggestionsPanel
              suggestions={suggestions}
              onApply={(adj) =>
                setAdjustments((prev) => ({
                  l: prev.l + adj.l,
                  c: prev.c + adj.c,
                  h: prev.h + adj.h,
                }))
              }
            />
          )}
        </div>

        {/* Action buttons */}
        <div className="p-3 border-t border-(--navBorder) flex gap-2 flex-shrink-0">
          <button
            onClick={handleReset}
            disabled={!hasChanges}
            className={`flex-1 px-3 py-2 text-[9px] font-bold border rounded transition-all flex items-center justify-center gap-1 ${hasChanges ? "border-(--navBorder) hover:border-(--brand) hover:bg-foreground/5" : "border-(--navBorder) opacity-40 cursor-not-allowed"}`}
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
          <button
            onClick={handleApply}
            disabled={!hasChanges}
            className={`flex-1 px-3 py-2 text-[9px] font-bold rounded transition-all flex items-center justify-center gap-1 ${hasChanges ? "bg-(--brand) text-white hover:opacity-90" : "bg-foreground/10 text-foreground/40 cursor-not-allowed"}`}
          >
            <Check className="w-3 h-3" />
            {batchMode
              ? harmonyLock
                ? "Apply Proportional"
                : "Apply to All"
              : "Apply"}
          </button>
        </div>
      </aside>

      {/* ── Floating Variants Panel ── renders between sidebar and main */}
      {showVariantPanel && (
        <VariantsPanel
          savedVariants={savedVariants}
          activeVariant={activeVariant}
          variantNameInput={variantNameInput}
          setVariantNameInput={setVariantNameInput}
          onSave={handleSaveVariant}
          onLoad={handleLoadVariant}
          onDelete={handleDeleteVariant}
          onClose={() => setShowVariantPanel(false)}
        />
      )}

      {/* ── Right Panel ── */}
      <main className="flex-1 border border-(--navBorder) rounded-md overflow-hidden mr-2 mb-2">
        <div
          className={`h-full p-5 ${batchMode ? "overflow-auto" : "overflow-hidden"}`}
        >
          {batchMode ? (
            <BatchPreview
              palette={palette}
              adjustedPalette={adjustedPalette}
              harmonyLock={harmonyLock}
              hasChanges={hasChanges}
            />
          ) : (
            <SingleColorPreview
              originalColor={originalColor}
              adjustedColor={adjustedColor}
              originalHex={originalHex}
              adjustedHex={adjustedHex}
              deltaE={deltaE}
              harmonyLock={harmonyLock}
              hasChanges={hasChanges}
              contrastInfo={contrastInfo}
            />
          )}
        </div>
      </main>

      {/* Success toast */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-2 z-50">
          <Check className="w-4 h-4" />
          <span className="text-sm font-semibold">
            {batchMode
              ? "All colors updated!"
              : harmonyLock
                ? "Applied with harmony lock!"
                : "Color updated!"}
          </span>
        </div>
      )}
    </div>
  );
}

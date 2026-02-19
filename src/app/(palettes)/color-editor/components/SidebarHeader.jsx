import { Undo2, Redo2, Lock, Unlock, Layers } from "lucide-react";

export function SidebarHeader({
  batchMode,
  onToggleBatch,
  undoStack,
  redoStack,
  onUndo,
  onRedo,
  harmonyLock,
  onToggleHarmony,
  showVariantPanel,
  onToggleVariantPanel,
  savedVariants,
}) {
  const btnBase =
    "flex items-center gap-1 px-2 py-1 text-[8px] font-bold rounded border transition-all";
  const btnActive = "bg-(--brand) text-white border-(--brand)";
  const btnInactive = "border-(--navBorder) hover:border-(--brand)";
  const btnDisabled = "border-(--navBorder) opacity-30 cursor-not-allowed";

  return (
    <div className="p-3 border-b border-(--navBorder) flex-shrink-0">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xs font-bold text-foreground/80 uppercase tracking-wider mb-1">
            Color Editor
          </h2>
          <p className="text-[9px] text-foreground/40">
            {batchMode
              ? "Adjust all colors at once"
              : "Adjust lightness, chroma, and hue"}
          </p>
        </div>
        <button
          onClick={onToggleBatch}
          className={`px-2 py-1 text-[8px] font-bold rounded transition-all ${batchMode ? "bg-(--brand) text-white" : "border border-(--navBorder) hover:border-(--brand)"}`}
        >
          {batchMode ? "Batch ON" : "Batch Mode"}
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Undo */}
        <button
          onClick={onUndo}
          disabled={undoStack.length === 0}
          title="Undo"
          className={`${btnBase} ${undoStack.length > 0 ? `${btnInactive} hover:text-(--brand)` : btnDisabled}`}
        >
          <Undo2 className="w-3 h-3" />
          {undoStack.length > 0 && (
            <span className="text-foreground/40">{undoStack.length}</span>
          )}
        </button>

        {/* Redo */}
        <button
          onClick={onRedo}
          disabled={redoStack.length === 0}
          title="Redo"
          className={`${btnBase} ${redoStack.length > 0 ? `${btnInactive} hover:text-(--brand)` : btnDisabled}`}
        >
          <Redo2 className="w-3 h-3" />
          {redoStack.length > 0 && (
            <span className="text-foreground/40">{redoStack.length}</span>
          )}
        </button>

        <div className="ml-auto flex items-center gap-1.5">
          {/* Harmony — batch only */}
          {batchMode && (
            <button
              onClick={onToggleHarmony}
              title={
                harmonyLock
                  ? "Harmony Lock ON — proportional shift"
                  : "Harmony Lock OFF — flat shift"
              }
              className={`${btnBase} ${harmonyLock ? btnActive : btnInactive}`}
            >
              {harmonyLock ? (
                <Lock className="w-3 h-3" />
              ) : (
                <Unlock className="w-3 h-3" />
              )}
              Harmony
            </button>
          )}

          {/* Variants */}
          <button
            onClick={onToggleVariantPanel}
            title="Save & compare variants"
            className={`${btnBase} ${showVariantPanel ? btnActive : btnInactive}`}
          >
            <Layers className="w-3 h-3" />
            {savedVariants.length > 0 && <span>{savedVariants.length}</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

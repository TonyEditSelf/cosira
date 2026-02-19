import chroma from "chroma-js";
import { BookmarkPlus, X } from "lucide-react";

export function VariantsPanel({
  savedVariants,
  activeVariant,
  variantNameInput,
  setVariantNameInput,
  onSave,
  onLoad,
  onDelete,
  onClose,
}) {
  return (
    <div className="w-64 flex-shrink-0 border border-(--navBorder) rounded-md bg-background flex flex-col overflow-hidden mb-2 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-(--navBorder) flex-shrink-0">
        <div>
          <div className="text-[9px] font-bold text-foreground/60 uppercase tracking-widest">
            Saved Variants
          </div>
          <div className="text-[8px] text-foreground/30 mt-0.5">
            {savedVariants.length} saved
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-5 h-5 flex items-center justify-center rounded hover:bg-foreground/10 text-foreground/40 hover:text-foreground/70 transition-all"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Save input */}
      <div className="p-3 border-b border-(--navBorder) flex-shrink-0">
        <div className="text-[8px] text-foreground/40 mb-1.5">
          Name this variant
        </div>
        <div className="flex gap-1.5">
          <input
            type="text"
            value={variantNameInput}
            onChange={(e) => setVariantNameInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSave()}
            placeholder={`Variant ${savedVariants.length + 1}`}
            className="flex-1 px-2 py-1.5 text-[9px] border border-(--navBorder) rounded-lg bg-background outline-none focus:border-(--brand) placeholder:text-foreground/20 transition-colors"
          />
          <button
            onClick={onSave}
            className="flex items-center gap-1 px-2.5 py-1.5 text-[8px] font-bold rounded-lg bg-(--brand) text-white hover:opacity-90 transition-all flex-shrink-0"
          >
            <BookmarkPlus className="w-3 h-3" />
            Save
          </button>
        </div>
      </div>

      {/* Variants list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {savedVariants.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8 px-4 text-center">
            <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center mb-2">
              <BookmarkPlus className="w-4 h-4 text-foreground/20" />
            </div>
            <p className="text-[9px] text-foreground/30 leading-relaxed">
              No variants saved yet.
              <br />
              Save the current palette state to compare later.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {savedVariants.map((variant, idx) => (
              <div
                key={idx}
                className={`group rounded-xl border p-2.5 transition-all cursor-pointer ${
                  activeVariant === idx
                    ? "border-(--brand) bg-(--brand)/5"
                    : "border-(--navBorder) hover:border-(--brand)/40 hover:bg-foreground/[0.02]"
                }`}
                onClick={() => onLoad(idx)}
              >
                {/* Color strip */}
                <div className="flex gap-0.5 mb-2 rounded-lg overflow-hidden h-6">
                  {variant.palette.map((c, ci) => (
                    <div
                      key={ci}
                      className="flex-1"
                      style={{
                        backgroundColor: chroma
                          .oklch(c.value.l, c.value.c, c.value.h)
                          .hex(),
                      }}
                    />
                  ))}
                </div>

                {/* Name + actions */}
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-semibold text-foreground/70 flex-1 truncate">
                    {variant.name}
                  </span>
                  <span
                    className={`text-[7px] font-bold px-1.5 py-0.5 rounded-full transition-all ${
                      activeVariant === idx
                        ? "bg-(--brand) text-white"
                        : "text-(--brand) opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {activeVariant === idx ? "Active" : "Load"}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(idx);
                    }}
                    className="w-4 h-4 flex items-center justify-center text-foreground/20 hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

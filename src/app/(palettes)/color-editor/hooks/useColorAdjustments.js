import { useMemo } from "react";
import chroma from "chroma-js";

export function useColorAdjustments({
  palette,
  selectedColorIndex,
  adjustments,
  batchAdjustments,
  batchMode,
  harmonyLock,
}) {
  const originalColor = useMemo(() => {
    if (!palette[selectedColorIndex]) return null;
    return palette[selectedColorIndex].value;
  }, [palette, selectedColorIndex]);

  const adjustedColor = useMemo(() => {
    if (!originalColor) return null;
    const active = batchMode ? batchAdjustments : adjustments;
    return {
      l: Math.max(0, Math.min(1, originalColor.l + active.l)),
      c: Math.max(0, Math.min(0.4, originalColor.c + active.c)),
      h: (originalColor.h + active.h + 360) % 360,
      a: originalColor.a || 1,
    };
  }, [originalColor, adjustments, batchAdjustments, batchMode]);

  const adjustedPalette = useMemo(() => {
    const lFactor = 1 + batchAdjustments.l;
    const cFactor = 1 + batchAdjustments.c;
    return palette.map((colorObj) => {
      const base = colorObj.value;
      const rawL = harmonyLock ? base.l * lFactor : base.l + batchAdjustments.l;
      const rawC = harmonyLock ? base.c * cFactor : base.c + batchAdjustments.c;
      return {
        l: Math.max(0, Math.min(1, rawL)),
        c: Math.max(0, Math.min(0.4, rawC)),
        h: (base.h + batchAdjustments.h + 360) % 360,
        a: base.a || 1,
      };
    });
  }, [palette, batchAdjustments, harmonyLock]);

  const deltaE = useMemo(() => {
    if (!originalColor || !adjustedColor) return 0;
    try {
      return chroma.deltaE(
        chroma.oklch(originalColor.l, originalColor.c, originalColor.h),
        chroma.oklch(adjustedColor.l, adjustedColor.c, adjustedColor.h),
      );
    } catch {
      return 0;
    }
  }, [originalColor, adjustedColor]);

  const contrastInfo = useMemo(() => {
    if (!adjustedColor) return null;
    try {
      const color = chroma.oklch(
        adjustedColor.l,
        adjustedColor.c,
        adjustedColor.h,
      );
      return {
        vsWhite: chroma.contrast(color, "#ffffff").toFixed(2),
        vsBlack: chroma.contrast(color, "#000000").toFixed(2),
      };
    } catch {
      return { vsWhite: 0, vsBlack: 0 };
    }
  }, [adjustedColor]);

  const suggestions = useMemo(() => {
    if (!adjustedColor) return [];
    const list = [];
    const color = chroma.oklch(
      adjustedColor.l,
      adjustedColor.c,
      adjustedColor.h,
    );
    const cW = chroma.contrast(color, "#ffffff");
    const cB = chroma.contrast(color, "#000000");
    if (cW < 4.5 && cB < 4.5) {
      if (adjustedColor.l < 0.5) {
        const tL = Math.max(0.1, adjustedColor.l - 0.15);
        list.push({
          message: `Darken by ${Math.abs(((tL - adjustedColor.l) * 100).toFixed(0))}% for better contrast with white`,
          adjustment: { l: tL - adjustedColor.l, c: 0, h: 0 },
        });
      } else {
        const tL = Math.min(0.95, adjustedColor.l + 0.15);
        list.push({
          message: `Brighten by ${((tL - adjustedColor.l) * 100).toFixed(0)}% for better contrast with black`,
          adjustment: { l: tL - adjustedColor.l, c: 0, h: 0 },
        });
      }
    }
    if (adjustedColor.c < 0.05)
      list.push({
        message: "Increase saturation by 10% for more vibrant color",
        adjustment: { l: 0, c: 0.1, h: 0 },
      });
    if (adjustedColor.c > 0.3)
      list.push({
        message: "Reduce saturation by 10% for better balance",
        adjustment: { l: 0, c: -0.1, h: 0 },
      });
    return list;
  }, [adjustedColor]);

  const similarColors = useMemo(() => {
    if (!adjustedColor) return [];
    return palette
      .map((color, idx) => {
        if (idx === selectedColorIndex) return null;
        try {
          return {
            idx,
            delta: chroma.deltaE(
              chroma.oklch(adjustedColor.l, adjustedColor.c, adjustedColor.h),
              chroma.oklch(color.value.l, color.value.c, color.value.h),
            ),
          };
        } catch {
          return null;
        }
      })
      .filter((i) => i && i.delta < 15)
      .sort((a, b) => a.delta - b.delta);
  }, [adjustedColor, palette, selectedColorIndex]);

  return {
    originalColor,
    adjustedColor,
    adjustedPalette,
    deltaE,
    contrastInfo,
    suggestions,
    similarColors,
  };
}

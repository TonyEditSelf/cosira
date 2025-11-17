export default function doubleSplitCompPalGen(oklch, doubleSplitCompPalType) {
  if (doubleSplitCompPalType === "leftDoubleSplitComp") {
    const LMAX = 0.95;
    const LMIN = 0.25;
    const CMAX = 0.25;
    const CMIN = 0.05;

    const baseColor = oklch;

    // --- Hues for the Double Split Complementary ("X") Scheme ---
    // The four main Hues: H, H-30, H+180, H+150

    // H1: Base (Used directly as baseColor)

    // H2: Adjacent Negative (H - 30)
    const adjacentNeg = {
      l: baseColor.l,
      c: baseColor.c,
      h: (baseColor.h - 30 + 360) % 360, // Ensure positive angle
    };

    // H3: Opposite (H + 180)
    const opposite = {
      l: baseColor.l,
      c: baseColor.c,
      h: (baseColor.h + 180) % 360,
    };

    // H4: Opposite Adjacent (H + 150)
    const oppositeAdjacent = {
      l: baseColor.l,
      c: baseColor.c,
      h: (baseColor.h + 150) % 360,
    };

    // --- Variants (Shades and Tints: L shifted by +/- 0.22, C by 1.1 or 0.9) ---

    // 1. Base Variants
    const baseDark = {
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.22)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.1)),
      h: baseColor.h,
    };

    const baseLight = {
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.22)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.9)),
      h: baseColor.h,
    };

    // 2. Adjacent Negative Variants
    const adjacentNegDark = {
      l: Math.min(LMAX, Math.max(LMIN, adjacentNeg.l - 0.22)),
      c: Math.min(CMAX, Math.max(CMIN, adjacentNeg.c * 1.1)),
      h: adjacentNeg.h,
    };

    // 3. Opposite Variants
    const oppositeDark = {
      l: Math.min(LMAX, Math.max(LMIN, opposite.l - 0.22)),
      c: Math.min(CMAX, Math.max(CMIN, opposite.c * 1.1)),
      h: opposite.h,
    };

    const oppositeLight = {
      l: Math.min(LMAX, Math.max(LMIN, opposite.l + 0.22)),
      c: Math.min(CMAX, Math.max(CMIN, opposite.c * 0.9)),
      h: opposite.h,
    };

    // 4. Opposite Adjacent Variants
    const oppositeAdjacentDark = {
      l: Math.min(LMAX, Math.max(LMIN, oppositeAdjacent.l - 0.22)),
      c: Math.min(CMAX, Math.max(CMIN, oppositeAdjacent.c * 1.1)),
      h: oppositeAdjacent.h,
    };

    // --- Return 10 Colors: 4 Mains + 4 Dark + 2 Light ---

    return [
      // 4 Dark Variants (Shades)
      { name: "Base-D", value: baseDark },
      { name: "AdjacentNeg-D", value: adjacentNegDark },
      { name: "Opposite-D", value: oppositeDark },
      { name: "OppositeAdjacent-D", value: oppositeAdjacentDark },

      // 4 Main Hues (Mid-lightness)
      { name: "Base", value: baseColor },
      { name: "AdjacentNeg", value: adjacentNeg },
      { name: "Opposite", value: opposite },
      { name: "OppositeAdjacent", value: oppositeAdjacent },

      // 2 Light Variants (Tints)
      { name: "Base-L", value: baseLight },
      { name: "Opposite-L", value: oppositeLight },
    ];
  } else if (doubleSplitCompPalType === "rightDoubleSplitComp") {
    const LMAX = 0.95;
    const LMIN = 0.25;
    const CMAX = 0.25;
    const CMIN = 0.05;

    const baseColor = oklch;

    // --- Hues for the Double Split Complementary ("X") Scheme ---
    // The four main Hues: H, H+30, H+180, H+210

    // H1: Base (Used directly as baseColor)

    // H2: Adjacent (H + 30)
    const adjacentBase = {
      l: baseColor.l,
      c: baseColor.c,
      h: (baseColor.h + 30) % 360,
    };

    // H3: Opposite (H + 180)
    const opposite = {
      l: baseColor.l,
      c: baseColor.c,
      h: (baseColor.h + 180) % 360,
    };

    // H4: Opposite Adjacent (H + 210)
    const oppositeAdjacent = {
      l: baseColor.l,
      c: baseColor.c,
      h: (baseColor.h + 210) % 360,
    };

    // --- Variants (Shades and Tints: L shifted by +/- 0.22, C by 1.1 or 0.9) ---

    // 1. Base Variants
    const baseDark = {
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.22)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.1)),
      h: baseColor.h,
    };

    const baseLight = {
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.22)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.9)),
      h: baseColor.h,
    };

    // 2. Adjacent Base Variants
    const adjacentDark = {
      l: Math.min(LMAX, Math.max(LMIN, adjacentBase.l - 0.22)),
      c: Math.min(CMAX, Math.max(CMIN, adjacentBase.c * 1.1)),
      h: adjacentBase.h,
    };

    // 3. Opposite Variants
    const oppositeDark = {
      l: Math.min(LMAX, Math.max(LMIN, opposite.l - 0.22)),
      c: Math.min(CMAX, Math.max(CMIN, opposite.c * 1.1)),
      h: opposite.h,
    };

    const oppositeLight = {
      l: Math.min(LMAX, Math.max(LMIN, opposite.l + 0.22)),
      c: Math.min(CMAX, Math.max(CMIN, opposite.c * 0.9)),
      h: opposite.h,
    };

    // 4. Opposite Adjacent Variants
    const oppositeAdjacentDark = {
      l: Math.min(LMAX, Math.max(LMIN, oppositeAdjacent.l - 0.22)),
      c: Math.min(CMAX, Math.max(CMIN, oppositeAdjacent.c * 1.1)),
      h: oppositeAdjacent.h,
    };

    // --- Return 10 Colors: 4 Mains + 4 Dark + 2 Light ---

    return [
      { name: "Base-L", value: baseLight },
      { name: "Base", value: baseColor },
      { name: "Base-D", value: baseDark },
      { name: "Adjacent", value: adjacentBase },
      { name: "Adjacent-D", value: adjacentDark },

      { name: "Opposite-L", value: oppositeLight },
      { name: "Opposite", value: opposite },
      { name: "Opposite-D", value: oppositeDark },
      { name: "OppositeAdjacent", value: oppositeAdjacent },
      { name: "OppositeAdjacent-D", value: oppositeAdjacentDark },

      // 2 Light Variants (Tints)
    ];
  }
}

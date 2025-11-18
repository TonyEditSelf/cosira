export default function doubleSplitCompPalGen(
  oklch,
  doubleSplitCompPalType = "leftDoubleSplitComp"
) {
  if (doubleSplitCompPalType === "leftDoubleSplitComp") {
    const LMAX = 0.95;
    const LMIN = 0.25;
    const CMAX = 0.25;
    const CMIN = 0.05;

    const S = 30; // split angle
    const base = { ...oklch };

    // ---- HUE POSITIONS (no helpers) ----

    const baseSplitNeg = {
      l: base.l,
      c: base.c,
      h: (base.h - S + 360) % 360,
    };

    const baseSplitPos = {
      l: base.l,
      c: base.c,
      h: (base.h + S) % 360,
    };

    const compHue = (base.h + 180) % 360;

    const compSplitNeg = {
      l: base.l,
      c: base.c,
      h: (compHue - S + 360) % 360, // H + 150
    };

    const compSplitPos = {
      l: base.l,
      c: base.c,
      h: (compHue + S) % 360, // H + 210
    };

    // ---- BASE LIGHT / DARK ----

    const baseLight = {
      l: Math.min(LMAX, Math.max(LMIN, base.l + 0.22)),
      c: Math.min(CMAX, Math.max(CMIN, base.c * 0.9)),
      h: base.h,
    };

    const baseDark = {
      l: Math.min(LMAX, Math.max(LMIN, base.l - 0.22)),
      c: Math.min(CMAX, Math.max(CMIN, base.c * 1.1)),
      h: base.h,
    };

    // ---- DARK variants for split hues (no light variants) ----

    const baseSplitNegDark = {
      l: Math.min(LMAX, Math.max(LMIN, baseSplitNeg.l - 0.22)),
      c: Math.min(CMAX, Math.max(CMIN, baseSplitNeg.c * 1.1)),
      h: baseSplitNeg.h,
    };

    const baseSplitPosDark = {
      l: Math.min(LMAX, Math.max(LMIN, baseSplitPos.l - 0.22)),
      c: Math.min(CMAX, Math.max(CMIN, baseSplitPos.c * 1.1)),
      h: baseSplitPos.h,
    };

    const compSplitNegDark = {
      l: Math.min(LMAX, Math.max(LMIN, compSplitNeg.l - 0.22)),
      c: Math.min(CMAX, Math.max(CMIN, compSplitNeg.c * 1.1)),
      h: compSplitNeg.h,
    };

    const compSplitPosDark = {
      l: Math.min(LMAX, Math.max(LMIN, compSplitPos.l - 0.22)),
      c: Math.min(CMAX, Math.max(CMIN, compSplitPos.c * 1.1)),
      h: compSplitPos.h,
    };

    // ---- RETURN EXACTLY 10 COLORS ----

    return [
      { name: "Base-L", value: baseLight },
      { name: "Base", value: base },
      { name: "Base-D", value: baseDark },

      { name: "BaseSplitNeg", value: baseSplitNeg },
      { name: "BaseSplitNeg-D", value: baseSplitNegDark },

      { name: "BaseSplitPos", value: baseSplitPos },
      { name: "BaseSplitPos-D", value: baseSplitPosDark },

      { name: "CompSplitNeg", value: compSplitNeg },
      { name: "CompSplitNeg-D", value: compSplitNegDark },

      { name: "CompSplitPos", value: compSplitPos },
      { name: "CompSplitPos-D", value: compSplitPosDark },
    ];
  } else if (doubleSplitCompPalType === "rightDoubleSplitComp") {
    const LMAX = 0.95;
    const LMIN = 0.25;
    const CMAX = 0.25;
    const CMIN = 0.05;

    const baseColor = { ...oklch };

    const adjacentBase = {
      l: baseColor.l,
      c: baseColor.c,
      h: (baseColor.h + 30) % 360,
    };

    const opposite = {
      l: baseColor.l,
      c: baseColor.c,
      h: (baseColor.h + 180) % 360,
    };

    const oppositeAdjacent = {
      l: baseColor.l,
      c: baseColor.c,
      h: (baseColor.h + 210) % 360,
    };

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

    const adjacentDark = {
      l: Math.min(LMAX, Math.max(LMIN, adjacentBase.l - 0.22)),
      c: Math.min(CMAX, Math.max(CMIN, adjacentBase.c * 1.1)),
      h: adjacentBase.h,
    };

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

    const oppositeAdjacentDark = {
      l: Math.min(LMAX, Math.max(LMIN, oppositeAdjacent.l - 0.22)),
      c: Math.min(CMAX, Math.max(CMIN, oppositeAdjacent.c * 1.1)),
      h: oppositeAdjacent.h,
    };

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
    ];
  }
}

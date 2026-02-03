export default function triadicPalGen(oklch, triadicPalType) {
  let lightBase,
    baseColor,
    darkBase,
    lightTriad1,
    triadicColor1,
    darkTriad1,
    darkestTriad1,
    lightTriad2,
    triadicColor2,
    darkTriad2,
    darkestTriad2;

  if (triadicPalType === "classicTriad") {
    function createVariant(base, lightnessDelta, chromaFactor) {
      return {
        l: Math.min(0.96, Math.max(0.12, base.l + lightnessDelta)),
        c: Math.min(0.37, Math.max(0.04, base.c * chromaFactor)),
        h: base.h,
      };
    }

    // BASE COLOR - Dominant (60% usage in designs, most saturated)
    baseColor = {
      ...oklch,
      l: Math.min(0.85, Math.max(0.3, oklch.l)),
      c: Math.min(0.35, Math.max(0.08, oklch.c * 1.1)), // Boost for dominance
    };

    lightBase = createVariant(baseColor, 0.24, 0.72);
    darkBase = createVariant(baseColor, -0.28, 1.2);

    // TRIADIC COLOR 1 - Secondary (30% usage, medium saturation)
    triadicColor1 = {
      ...oklch,
      l: Math.min(0.85, Math.max(0.3, oklch.l)),
      c: Math.min(0.3, Math.max(0.06, oklch.c * 0.88)), // Less saturated than base
      h: (oklch.h + 120) % 360,
    };

    lightTriad1 = createVariant(triadicColor1, 0.24, 0.72);
    darkTriad1 = createVariant(triadicColor1, -0.28, 1.2);
    darkestTriad1 = createVariant(triadicColor1, -0.45, 1.25); // For text on light

    // TRIADIC COLOR 2 - Accent (10% usage, more muted for harmony)
    triadicColor2 = {
      ...oklch,
      l: Math.min(0.85, Math.max(0.3, oklch.l)),
      c: Math.min(0.28, Math.max(0.05, oklch.c * 0.78)), // Most muted
      h: (oklch.h + 240) % 360,
    };

    lightTriad2 = createVariant(triadicColor2, 0.24, 0.72);
    darkTriad2 = createVariant(triadicColor2, -0.28, 1.2);
    darkestTriad2 = createVariant(triadicColor2, -0.45, 1.25);
  } else if (triadicPalType === "vintageTriad") {
    const L_MIN = 0.35;
    const L_MAX = 0.88;

    // Helper: Selective hue warming for vintage aesthetic
    function vintageHueShift(h) {
      if (h >= 0 && h < 60) return (h + 18) % 360; // Reds → orange
      if (h >= 60 && h < 120) return (h + 12) % 360; // Oranges/yellows → warmer
      if (h >= 180 && h < 240) return (h - 3) % 360; // Cyans → cooler
      return (h + 6) % 360;
    }

    // Helper: Hue-dependent chroma for vintage
    function vintageChroma(h, originalC) {
      const baseDesaturation = originalC * 0.58;

      // Browns/oranges/mustards can be more saturated (vintage posters)
      if (h >= 20 && h < 80) {
        return Math.min(0.24, Math.max(0.06, baseDesaturation * 1.35));
      }
      // Reds medium saturation
      if (h >= 340 || h < 20) {
        return Math.min(0.2, Math.max(0.05, baseDesaturation * 1.15));
      }
      // Blues/greens more muted
      if (h >= 180 && h < 280) {
        return Math.min(0.15, Math.max(0.04, baseDesaturation * 0.85));
      }
      return Math.min(0.18, Math.max(0.05, baseDesaturation));
    }

    // Helper: Create vintage variant
    function createVintageVariant(base, lightnessDelta, chromaFactor) {
      return {
        l: Math.min(L_MAX, Math.max(L_MIN, base.l + lightnessDelta)),
        c: Math.min(0.24, Math.max(0.03, base.c * chromaFactor)),
        h: base.h,
      };
    }

    // BASE COLOR
    const baseHue = vintageHueShift(oklch.h);
    baseColor = {
      l: Math.min(L_MAX, Math.max(L_MIN, oklch.l)),
      c: vintageChroma(baseHue, oklch.c * 1.05), // Slightly more saturated (dominant)
      h: baseHue,
    };

    lightBase = createVintageVariant(baseColor, 0.22, 0.75);
    darkBase = createVintageVariant(baseColor, -0.25, 1.15);

    // TRIADIC COLOR 1
    const triad1Hue = (baseHue + 120) % 360;
    triadicColor1 = {
      l: Math.min(L_MAX, Math.max(L_MIN, oklch.l)),
      c: vintageChroma(triad1Hue, oklch.c * 0.9),
      h: triad1Hue,
    };

    lightTriad1 = createVintageVariant(triadicColor1, 0.22, 0.75);
    darkTriad1 = createVintageVariant(triadicColor1, -0.25, 1.15);
    darkestTriad1 = createVintageVariant(triadicColor1, -0.4, 1.2);

    // TRIADIC COLOR 2
    const triad2Hue = (baseHue + 240) % 360;
    triadicColor2 = {
      l: Math.min(L_MAX, Math.max(L_MIN, oklch.l)),
      c: vintageChroma(triad2Hue, oklch.c * 0.8), // Most muted
      h: triad2Hue,
    };

    lightTriad2 = createVintageVariant(triadicColor2, 0.22, 0.75);
    darkTriad2 = createVintageVariant(triadicColor2, -0.25, 1.15);
    darkestTriad2 = createVintageVariant(triadicColor2, -0.4, 1.2);
  } else if (triadicPalType === "neutralTriad") {
    const L_MIN = 0.25;
    const L_MAX = 0.92;
    const CHROMA_MAX = 0.09;

    // Helper: Calculate neutral chroma
    function neutralChroma(originalC, boost = 1.0) {
      return Math.min(CHROMA_MAX, Math.max(0.01, originalC * 0.35 * boost));
    }

    // Helper: Create neutral variant
    function createNeutralVariant(base, lightnessDelta, chromaFactor) {
      return {
        l: Math.min(L_MAX, Math.max(L_MIN, base.l + lightnessDelta)),
        c: Math.min(CHROMA_MAX, Math.max(0.01, base.c * chromaFactor)),
        h: base.h,
      };
    }

    // BASE COLOR - Slight warmth/coolness but very subtle
    baseColor = {
      l: Math.min(L_MAX, Math.max(L_MIN, oklch.l)),
      c: neutralChroma(oklch.c, 1.1), // Slightly more than others (still very low)
      h: oklch.h,
    };

    lightBase = createNeutralVariant(baseColor, 0.28, 0.7);
    darkBase = createNeutralVariant(baseColor, -0.3, 1.2);

    // TRIADIC COLOR 1 - Even more neutral
    triadicColor1 = {
      l: Math.min(L_MAX, Math.max(L_MIN, oklch.l)),
      c: neutralChroma(oklch.c, 0.95),
      h: (oklch.h + 120) % 360,
    };

    lightTriad1 = createNeutralVariant(triadicColor1, 0.28, 0.7);
    darkTriad1 = createNeutralVariant(triadicColor1, -0.3, 1.2);
    darkestTriad1 = createNeutralVariant(triadicColor1, -0.48, 1.25);

    // TRIADIC COLOR 2 - Most neutral (nearly gray)
    triadicColor2 = {
      l: Math.min(L_MAX, Math.max(L_MIN, oklch.l)),
      c: neutralChroma(oklch.c, 0.85),
      h: (oklch.h + 240) % 360,
    };

    lightTriad2 = createNeutralVariant(triadicColor2, 0.28, 0.7);
    darkTriad2 = createNeutralVariant(triadicColor2, -0.3, 1.2);
    darkestTriad2 = createNeutralVariant(triadicColor2, -0.48, 1.25);
  } else if (triadicPalType === "kidsTriad") {
    const L_MIN = 0.45; // Brighter minimum (no scary darks)
    const L_MAX = 0.92; // Keep cheerful
    const CHROMA_BOOST = 1.25; // More saturated = more playful

    // Helper: Boost chroma for playful colors
    function kidsChroma(originalC, boost = 1.0) {
      return Math.min(0.35, Math.max(0.12, originalC * CHROMA_BOOST * boost));
    }

    // Helper: Create kids variant (lighter darks, brighter overall)
    function createKidsVariant(base, lightnessDelta, chromaFactor) {
      return {
        l: Math.min(L_MAX, Math.max(L_MIN, base.l + lightnessDelta)),
        c: Math.min(0.35, Math.max(0.08, base.c * chromaFactor)),
        h: base.h,
      };
    }

    // BASE COLOR - Bright and saturated
    baseColor = {
      l: Math.min(0.85, Math.max(0.55, oklch.l + 0.1)), // Boost lightness
      c: kidsChroma(oklch.c, 1.15), // Most saturated
      h: oklch.h,
    };

    lightBase = createKidsVariant(baseColor, 0.18, 0.85); // Less extreme
    darkBase = createKidsVariant(baseColor, -0.2, 1.1); // Softer darks

    // TRIADIC COLOR 1 - Playful secondary
    triadicColor1 = {
      l: Math.min(0.85, Math.max(0.55, oklch.l + 0.1)),
      c: kidsChroma(oklch.c, 1.1),
      h: (oklch.h + 120) % 360,
    };

    lightTriad1 = createKidsVariant(triadicColor1, 0.18, 0.85);
    darkTriad1 = createKidsVariant(triadicColor1, -0.2, 1.1);
    darkestTriad1 = createKidsVariant(triadicColor1, -0.32, 1.15); // Not too dark

    // TRIADIC COLOR 2 - Cheerful accent
    triadicColor2 = {
      l: Math.min(0.85, Math.max(0.55, oklch.l + 0.1)),
      c: kidsChroma(oklch.c, 1.05),
      h: (oklch.h + 240) % 360,
    };

    lightTriad2 = createKidsVariant(triadicColor2, 0.18, 0.85);
    darkTriad2 = createKidsVariant(triadicColor2, -0.2, 1.1);
    darkestTriad2 = createKidsVariant(triadicColor2, -0.32, 1.15);
  } else {
    // FALLBACK - use classicTriad logic as default
    function createVariant(base, lightnessDelta, chromaFactor) {
      return {
        l: Math.min(0.96, Math.max(0.12, base.l + lightnessDelta)),
        c: Math.min(0.37, Math.max(0.04, base.c * chromaFactor)),
        h: base.h,
      };
    }

    baseColor = {
      ...oklch,
      l: Math.min(0.85, Math.max(0.3, oklch.l)),
      c: Math.min(0.35, Math.max(0.08, oklch.c * 1.1)),
    };

    lightBase = createVariant(baseColor, 0.24, 0.72);
    darkBase = createVariant(baseColor, -0.28, 1.2);

    triadicColor1 = {
      ...oklch,
      l: Math.min(0.85, Math.max(0.3, oklch.l)),
      c: Math.min(0.3, Math.max(0.06, oklch.c * 0.88)),
      h: (oklch.h + 120) % 360,
    };

    lightTriad1 = createVariant(triadicColor1, 0.24, 0.72);
    darkTriad1 = createVariant(triadicColor1, -0.28, 1.2);
    darkestTriad1 = createVariant(triadicColor1, -0.45, 1.25);

    triadicColor2 = {
      ...oklch,
      l: Math.min(0.85, Math.max(0.3, oklch.l)),
      c: Math.min(0.28, Math.max(0.05, oklch.c * 0.78)),
      h: (oklch.h + 240) % 360,
    };

    lightTriad2 = createVariant(triadicColor2, 0.24, 0.72);
    darkTriad2 = createVariant(triadicColor2, -0.28, 1.2);
    darkestTriad2 = createVariant(triadicColor2, -0.45, 1.25);
  }

  return [
    { name: "Base-L", value: lightBase },
    { name: "Base", value: baseColor },
    { name: "Base-D", value: darkBase },
    { name: "Triad1-L", value: lightTriad1 },
    { name: "Triad1", value: triadicColor1 },
    { name: "Triad1-D", value: darkTriad1 },
    { name: "Triad1-DD", value: darkestTriad1 },
    { name: "Triad2-L", value: lightTriad2 },
    { name: "Triad2", value: triadicColor2 },
    { name: "Triad2-D", value: darkTriad2 },
    { name: "Triad2-DD", value: darkestTriad2 },
  ];
}

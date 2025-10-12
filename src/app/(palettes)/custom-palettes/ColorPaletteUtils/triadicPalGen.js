export default function triadicPalGen(
  oklch,
  vintagePalType = null,
  neutralPalType = null
) {
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

  if (vintagePalType === null && neutralPalType === null) {
    baseColor = oklch;

    darkBase = {
      ...baseColor,
      l: Math.min(1, Math.max(0, baseColor.l * 0.85)),
    };
    lightBase = {
      ...baseColor,
      l: Math.min(1, Math.max(0, baseColor.l * 1.15)),
    };

    triadicColor1 = { ...baseColor, h: (baseColor.h + 120) % 360 };

    darkTriad1 = {
      ...triadicColor1,
      l: Math.min(1, Math.max(0, triadicColor1.l * 0.85)),
    };

    lightTriad1 = {
      ...triadicColor1,
      l: Math.min(1, Math.max(0, triadicColor1.l * 1.15)),
    };

    darkestTriad1 = {
      ...darkTriad1,
      l: Math.min(1, Math.max(0, darkTriad1.l * 0.85)),
    };

    triadicColor2 = { ...baseColor, h: (baseColor.h + 240) % 360 };

    darkTriad2 = {
      ...triadicColor2,
      l: Math.min(1, Math.max(0, triadicColor2.l * 0.85)),
    };

    lightTriad2 = {
      ...triadicColor2,
      l: Math.min(1, Math.max(0, triadicColor2.l * 1.15)),
    };

    darkestTriad2 = {
      ...darkTriad2,
      l: Math.min(1, Math.max(0, darkTriad2.l * 0.85)),
    };
  } else if (vintagePalType === "vintageTriad") {
    const VINTAGE_HUE_SHIFT = 15; // Shift hues toward yellow/warm
    const VINTAGE_CHROMA_FACTOR = 0.5; // Global desaturation (50%)
    const VINTAGE_CHROMA_MAX = 0.2; // Max chroma limit for soft tones
    const L_MIN = 0.3; // Consistent minimum lightness clamp
    const L_MAX = 0.9; // Consistent maximum lightness clamp

    // --- CRITICAL STEP: Calculate the desaturated chroma based on the input oklch ---
    const vintageChromaBase = Math.min(
      VINTAGE_CHROMA_MAX,
      Math.max(0.02, oklch.c * VINTAGE_CHROMA_FACTOR) // Apply global desaturation here
    );

    // --- 1. Base Color (Vintage-Tuned) ---
    baseColor = {
      ...oklch,
      l: Math.min(L_MAX, Math.max(L_MIN, oklch.l)), // Consistent L clamp
      c: vintageChromaBase, // Corrected, globally desaturated chroma
      h: (oklch.h + VINTAGE_HUE_SHIFT) % 360, // Apply vintage warmth
    };

    darkBase = {
      ...baseColor,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 0.85)), // Consistent L clamp
      // Darker: slightly more saturated than the base (x 1.1)
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, baseColor.c * 1.1)),
    };

    lightBase = {
      ...baseColor,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 1.15)), // Consistent L clamp
      // Lighter: stronger desaturation (x 0.8)
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, baseColor.c * 0.8)),
    };

    // --- 2. Triadic Color 1 (Vintage-Tuned) ---
    triadicColor1 = {
      ...baseColor,
      // H is 120° from baseColor's already warmed hue
      h: (baseColor.h + 120) % 360,
    };

    darkTriad1 = {
      ...triadicColor1,
      l: Math.min(L_MAX, Math.max(L_MIN, triadicColor1.l * 0.85)), // Consistent L clamp
      // Darker: slightly more saturated
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, triadicColor1.c * 1.1)),
    };

    lightTriad1 = {
      ...triadicColor1,
      l: Math.min(L_MAX, Math.max(L_MIN, triadicColor1.l * 1.15)), // Consistent L clamp
      // Lighter: stronger desaturation
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, triadicColor1.c * 0.8)),
    };

    darkestTriad1 = {
      ...darkTriad1,
      l: Math.min(L_MAX, Math.max(L_MIN, darkTriad1.l * 0.85)), // Even darker L
      // Retain high saturation for contrast
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, darkTriad1.c * 1.05)),
    };

    // --- 3. Triadic Color 2 (Vintage-Tuned) ---
    triadicColor2 = {
      ...baseColor,
      // H is 240° from baseColor's already warmed hue
      h: (baseColor.h + 240) % 360,
    };

    darkTriad2 = {
      ...triadicColor2,
      l: Math.min(L_MAX, Math.max(L_MIN, triadicColor2.l * 0.85)), // Consistent L clamp
      // Darker: slightly more saturated
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, triadicColor2.c * 1.1)),
    };

    lightTriad2 = {
      ...triadicColor2,
      l: Math.min(L_MAX, Math.max(L_MIN, triadicColor2.l * 1.15)), // Consistent L clamp
      // Lighter: stronger desaturation
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, triadicColor2.c * 0.8)),
    };

    darkestTriad2 = {
      ...darkTriad2,
      l: Math.min(L_MAX, Math.max(L_MIN, darkTriad2.l * 0.85)), // Even darker L
      // Retain high saturation for contrast
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, darkTriad2.c * 1.05)),
    };
  } else if (neutralPalType === "neutralTriad") {
    const NEUTRAL_CHROMA_MAX = 0.08; // Strict max chroma limit for near-gray/beige tones
    const CHROMA_DEGRADATION = 0.4; // Factor to push input chroma to neutral range (40% of original C)
    const L_MIN = 0.3; // Min Lightness for soft shadow (Atmospheric Neutral range)
    const L_MAX = 0.9; // Max Lightness for soft highlight (Atmospheric Neutral range)

    // --- CRITICAL STEP: Calculate the severely desaturated Chroma for the entire palette ---
    const neutralChromaBase = Math.min(
      NEUTRAL_CHROMA_MAX,
      Math.max(0.01, oklch.c * CHROMA_DEGRADATION) // Apply degradation to original chroma
    );

    // --- 1. Base Color (Neutral-Tuned) ---
    baseColor = {
      ...oklch,
      l: Math.min(L_MAX, Math.max(L_MIN, oklch.l)), // Consistent L clamp
      c: neutralChromaBase, // Severely desaturated chroma
      h: oklch.h, // RETAIN ORIGINAL HUE (provides subtle warm/cool undertone)
    };

    // --- 2. Dark & Light Variants of Base ---
    darkBase = {
      ...baseColor,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 0.85)),
      // Darker: slight Chroma increase (x 1.1) capped at 0.08 max
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, baseColor.c * 1.1)),
    };

    lightBase = {
      ...baseColor,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 1.15)),
      // Lighter: stronger desaturation (x 0.8) capped at 0.08 max
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, baseColor.c * 0.8)),
    };

    // --- 3. Triadic Color 1 (Neutral-Tuned) ---
    triadicColor1 = {
      ...baseColor,
      // H is 120° from baseColor's original hue
      h: (baseColor.h + 120) % 360,
    };

    darkTriad1 = {
      ...triadicColor1,
      l: Math.min(L_MAX, Math.max(L_MIN, triadicColor1.l * 0.85)), // Consistent L clamp
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, triadicColor1.c * 1.1)),
    };

    lightTriad1 = {
      ...triadicColor1,
      l: Math.min(L_MAX, Math.max(L_MIN, triadicColor1.l * 1.15)), // Consistent L clamp
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, triadicColor1.c * 0.8)),
    };

    darkestTriad1 = {
      ...darkTriad1,
      l: Math.min(L_MAX, Math.max(L_MIN, darkTriad1.l * 0.85)), // Even darker L
      // Retain high saturation (relative to the NEUTRAL_CHROMA_MAX)
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, darkTriad1.c * 1.05)),
    };

    // --- 4. Triadic Color 2 (Neutral-Tuned) ---
    triadicColor2 = {
      ...baseColor,
      // H is 240° from baseColor's original hue
      h: (baseColor.h + 240) % 360,
    };

    darkTriad2 = {
      ...triadicColor2,
      l: Math.min(L_MAX, Math.max(L_MIN, triadicColor2.l * 0.85)), // Consistent L clamp
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, triadicColor2.c * 1.1)),
    };

    lightTriad2 = {
      ...triadicColor2,
      l: Math.min(L_MAX, Math.max(L_MIN, triadicColor2.l * 1.15)), // Consistent L clamp
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, triadicColor2.c * 0.8)),
    };

    darkestTriad2 = {
      ...darkTriad2,
      l: Math.min(L_MAX, Math.max(L_MIN, darkTriad2.l * 0.85)), // Even darker L
      // Retain high saturation (relative to the NEUTRAL_CHROMA_MAX)
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, darkTriad2.c * 1.05)),
    };
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

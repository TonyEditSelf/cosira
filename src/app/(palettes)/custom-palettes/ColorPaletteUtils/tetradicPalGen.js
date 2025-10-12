export default function tetradicPalGen(
  oklch,
  tetradicAngle,
  vintagePalType = null,
  neutralPalType = null
) {
  let baseColor1Dark,
    baseColor1,
    baseColor1Light,
    baseColor2,
    baseColor2Light,
    baseColor1CompNeutral,
    baseColor1CompDark,
    baseColor1Comp,
    baseColor1CompLight,
    baseColor2Comp,
    baseColor2CompLight;

  if (vintagePalType === null && neutralPalType === null) {
    baseColor1 = oklch;

    baseColor1Dark = {
      ...baseColor1,
      l: Math.min(1, Math.max(0, baseColor1.l * 0.85)),
    };

    baseColor1Light = {
      ...baseColor1,
      l: Math.min(1, Math.max(0, baseColor1.l * 1.15)),
    };

    baseColor1Comp = {
      ...baseColor1,
      h: (baseColor1.h + 180) % 360,
    };

    baseColor1CompDark = {
      ...baseColor1Comp,
      l: Math.min(1, Math.max(0, baseColor1Comp.l * 0.85)),
    };

    baseColor1CompLight = {
      ...baseColor1Comp,
      l: Math.min(1, Math.max(0, baseColor1Comp.l * 1.15)),
    };

    baseColor1CompNeutral = {
      ...baseColor1Comp,
      c: 0.03,
    };

    baseColor2 = {
      ...baseColor1,
      h: (baseColor1.h + tetradicAngle) % 360,
    };

    baseColor2Light = {
      ...baseColor2,
      l: Math.min(1, Math.max(0, baseColor2.l * 1.15)),
    };

    baseColor2Comp = {
      ...baseColor2,
      h: (baseColor2.h + 180) % 360,
    };

    baseColor2CompLight = {
      ...baseColor2Comp,
      l: Math.min(1, Math.max(0, baseColor2Comp.l * 1.15)),
    };
  } else if (vintagePalType === "vintageTetra") {
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

    // --- 1. Base Color 1 (Vintage-Tuned) ---
    baseColor1 = {
      ...oklch,
      l: Math.min(L_MAX, Math.max(L_MIN, oklch.l)), // Consistent L clamp
      c: vintageChromaBase, // Corrected, globally desaturated chroma
      h: (oklch.h + VINTAGE_HUE_SHIFT) % 360, // Apply vintage warmth
    };

    baseColor1Dark = {
      ...baseColor1,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor1.l * 0.85)), // Consistent L clamp
      // Darker: slightly more saturated than the base (x 1.1)
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, baseColor1.c * 1.1)),
    };

    baseColor1Light = {
      ...baseColor1,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor1.l * 1.15)), // Consistent L clamp
      // Lighter: stronger desaturation (x 0.8)
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, baseColor1.c * 0.8)),
    };

    // --- 2. Complementary Color 1 (Vintage-Tuned) ---
    baseColor1Comp = {
      ...baseColor1,
      // H is 180° from baseColor1's already warmed hue
      h: (baseColor1.h + 180) % 360,
    };

    baseColor1CompDark = {
      ...baseColor1Comp,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor1Comp.l * 0.85)), // Consistent L clamp
      // Darker: slightly more saturated
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, baseColor1Comp.c * 1.1)),
    };

    baseColor1CompLight = {
      ...baseColor1Comp,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor1Comp.l * 1.15)), // Consistent L clamp
      // Lighter: stronger desaturation
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, baseColor1Comp.c * 0.8)),
    };

    baseColor1CompNeutral = {
      ...baseColor1Comp,
      // Highly desaturated for a neutral background/text color
      c: 0.03,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor1Comp.l * 1.1)),
    };

    // --- 3. Base Color 2 (Tetradic - Vintage-Tuned) ---
    baseColor2 = {
      ...baseColor1,
      // Shift H from baseColor1 by the tetradic angle
      h: (baseColor1.h + tetradicAngle) % 360,
    };

    baseColor2Light = {
      ...baseColor2,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor2.l * 1.15)), // Consistent L clamp
      // Lighter: stronger desaturation
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, baseColor2.c * 0.8)),
    };

    // --- 4. Complementary Color 2 (Tetradic Complement - Vintage-Tuned) ---
    baseColor2Comp = {
      ...baseColor2,
      // H is 180° from baseColor2's hue
      h: (baseColor2.h + 180) % 360,
    };

    baseColor2CompLight = {
      ...baseColor2Comp,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor2Comp.l * 1.15)), // Consistent L clamp
      // Lighter: stronger desaturation
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, baseColor2Comp.c * 0.8)),
    };
  } else if (neutralPalType === "neutralTetra") {
    const NEUTRAL_CHROMA_MAX = 0.08; // Strict max chroma limit for near-gray/beige tones
    const CHROMA_DEGRADATION = 0.4; // Factor to push input chroma to neutral range (e.g., 40% of original C)
    const L_MIN = 0.3; // Min Lightness for soft shadow (Atmospheric Neutral range)
    const L_MAX = 0.9; // Max Lightness for soft highlight (Atmospheric Neutral range)

    // --- CRITICAL STEP: Calculate the severely desaturated Chroma for the entire palette ---
    const neutralChromaBase = Math.min(
      NEUTRAL_CHROMA_MAX,
      Math.max(0.01, oklch.c * CHROMA_DEGRADATION) // Apply degradation to original chroma
    );

    // --- 1. Base Color 1 (Neutral-Tuned) ---
    baseColor1 = {
      ...oklch,
      l: Math.min(L_MAX, Math.max(L_MIN, oklch.l)), // Consistent L clamp
      c: neutralChromaBase, // Severely desaturated chroma
      h: oklch.h, // RETAIN ORIGINAL HUE (provides subtle undertone)
    };

    baseColor1Dark = {
      ...baseColor1,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor1.l * 0.85)),
      // Darker: slight Chroma increase (x 1.1) capped at 0.08 max
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, baseColor1.c * 1.1)),
    };

    baseColor1Light = {
      ...baseColor1,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor1.l * 1.15)),
      // Lighter: stronger desaturation (x 0.8) capped at 0.08 max
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, baseColor1.c * 0.8)),
    };

    // --- 2. Complementary Color 1 (Neutral-Tuned) ---
    baseColor1Comp = {
      ...baseColor1,
      // H is 180° from baseColor1's original hue
      h: (baseColor1.h + 180) % 360,
    };

    baseColor1CompDark = {
      ...baseColor1Comp,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor1Comp.l * 0.85)), // Consistent L clamp
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, baseColor1Comp.c * 1.1)),
    };

    baseColor1CompLight = {
      ...baseColor1Comp,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor1Comp.l * 1.15)), // Consistent L clamp
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, baseColor1Comp.c * 0.8)),
    };

    baseColor1CompNeutral = {
      ...baseColor1Comp,
      // Extremely desaturated for a near-perfect neutral background/text color
      c: 0.03,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor1Comp.l * 1.1)),
    };

    // --- 3. Base Color 2 (Tetradic - Neutral-Tuned) ---
    baseColor2 = {
      ...baseColor1,
      // Shift H from baseColor1 by the tetradic angle
      h: (baseColor1.h + tetradicAngle) % 360,
    };

    baseColor2Light = {
      ...baseColor2,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor2.l * 1.15)), // Consistent L clamp
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, baseColor2.c * 0.8)),
    };

    // --- 4. Complementary Color 2 (Tetradic Complement - Neutral-Tuned) ---
    baseColor2Comp = {
      ...baseColor2,
      // H is 180° from baseColor2's hue
      h: (baseColor2.h + 180) % 360,
    };

    baseColor2CompLight = {
      ...baseColor2Comp,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor2Comp.l * 1.15)), // Consistent L clamp
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, baseColor2Comp.c * 0.8)),
    };
  }

  return [
    { name: "Base-D", value: baseColor1Dark },
    { name: "Base", value: baseColor1 },
    { name: "Base-L", value: baseColor1Light },
    { name: "Base2", value: baseColor2 },
    { name: "Base2-L", value: baseColor2Light },
    { name: "Base-C-N", value: baseColor1CompNeutral },
    { name: "Base-C-D", value: baseColor1CompDark },
    { name: "Base-C", value: baseColor1Comp },
    { name: "Base-C-L", value: baseColor1CompLight },
    { name: "Base2-C", value: baseColor2Comp },
    { name: "Base2-C-L", value: baseColor2CompLight },
  ];
}

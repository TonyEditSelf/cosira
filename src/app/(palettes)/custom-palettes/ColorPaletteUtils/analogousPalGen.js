export default function analogousPalGen(
  oklch,
  analogOptions,
  vintagePalType = null,
  neutralPalType = null
) {
  let analogousOneDark,
    analogousOne,
    analogousOneLight,
    darkBase,
    baseColor,
    lightBase,
    analogousTwoDark,
    analogousTwo,
    analogousTwoLight,
    analogousThreeDark,
    analogousThree,
    analogousThreeLight;

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

    analogousOne = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle1 + 360) % 360,
    };

    analogousOneDark = {
      ...analogousOne,
      l: Math.min(1, Math.max(0, analogousOne.l * 0.85)), // 15% darker, clamped between 0–1
    };

    analogousOneLight = {
      ...analogousOne,
      l: Math.min(1, Math.max(0, analogousOne.l * 1.15)), // 15% lighter, clamped between 0–1
    };

    analogousTwo = {
      ...analogousOne,
      h: (baseColor.h + analogOptions.analogousAngle2 + 360) % 360,
    };

    analogousTwoDark = {
      ...analogousTwo,
      l: Math.min(1, Math.max(0, analogousTwo.l * 0.85)), // 15% darker, clamped between 0–1
    };

    analogousTwoLight = {
      ...analogousTwo,
      l: Math.min(1, Math.max(0, analogousTwo.l * 1.15)), // 15% lighter,
    };

    analogousThree = {
      ...analogousTwo,
      h: (baseColor.h + analogOptions.analogousAngle3 + 360) % 360,
    };

    analogousThreeDark = {
      ...analogousThree,
      l: Math.min(1, Math.max(0, analogousThree.l * 0.85)), // 15% darker,
    };

    analogousThreeLight = {
      ...analogousThree,
      l: Math.min(1, Math.max(0, analogousThree.l * 1.15)), // 15% lighter,
    };
  } else if (vintagePalType === "vintageAnalog") {
    const VINTAGE_HUE_SHIFT = 15; // Warm yellow-red bias (Hues shift toward warmer tones)
    const VINTAGE_CHROMA_FACTOR = 0.5; // Overall desaturation factor (50% of original Chroma)
    const VINTAGE_CHROMA_MAX = 0.2; // Max Chroma for the whole palette (keeps colors muted)
    const L_MIN = 0.3; // Conservative minimum lightness for muted contrast
    const L_MAX = 0.9; // Conservative maximum lightness for muted contrast

    // -----------------------------------------------------------
    // --- Vintage Base Color Calculation ---
    // We calculate the *intended* vintage chroma using the factor first,
    // then clamp it, so the original color's saturation contributes.

    const vintageChromaBase = Math.min(
      VINTAGE_CHROMA_MAX,
      Math.max(0.02, oklch.c * VINTAGE_CHROMA_FACTOR)
    );

    baseColor = {
      ...oklch,
      // 1. Lightness is consistently clamped to a muted range
      l: Math.min(L_MAX, Math.max(L_MIN, oklch.l)),
      // 2. Chroma uses the calculated, globally desaturated value
      c: vintageChromaBase,
      // 3. Hue is shifted to a warm tone
      h: (oklch.h + VINTAGE_HUE_SHIFT) % 360,
    };

    darkBase = {
      ...baseColor,

      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 0.85)),

      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, baseColor.c * 1.1)),
    };

    lightBase = {
      ...baseColor,

      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 1.15)),

      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, baseColor.c * 0.8)),
    };

    analogousOne = {
      ...baseColor,

      h: (baseColor.h + analogOptions.analogousAngle1 + 360) % 360,
    };

    analogousOneDark = {
      ...analogousOne,
      // Apply the same proportional L/C changes as darkBase
      l: Math.min(L_MAX, Math.max(L_MIN, analogousOne.l * 0.85)),
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, analogousOne.c * 1.1)),
    };

    analogousOneLight = {
      ...analogousOne,
      // Apply the same proportional L/C changes as lightBase
      l: Math.min(L_MAX, Math.max(L_MIN, analogousOne.l * 1.15)),
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, analogousOne.c * 0.8)),
    };

    analogousTwo = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle2 + 360) % 360,
    };

    analogousTwoDark = {
      ...analogousTwo,
      l: Math.min(L_MAX, Math.max(L_MIN, analogousTwo.l * 0.85)),
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, analogousTwo.c * 1.1)),
    };

    analogousTwoLight = {
      ...analogousTwo,
      l: Math.min(L_MAX, Math.max(L_MIN, analogousTwo.l * 1.15)),
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, analogousTwo.c * 0.8)),
    };

    analogousThree = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle3 + 360) % 360,
    };

    analogousThreeDark = {
      ...analogousThree,
      l: Math.min(L_MAX, Math.max(L_MIN, analogousThree.l * 0.85)),
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, analogousThree.c * 1.1)),
    };

    analogousThreeLight = {
      ...analogousThree,
      l: Math.min(L_MAX, Math.max(L_MIN, analogousThree.l * 1.15)),
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, analogousThree.c * 0.8)),
    };
  } else if (neutralPalType === "neutralAnalog") {
    const NEUTRAL_CHROMA_MAX = 0.08; // Strict max chroma limit for near-gray/beige tones
    const CHROMA_DEGRADATION = 0.4; // Factor to push input chroma to neutral range (e.g., 40% of original C)
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
      h: oklch.h, // RETAIN ORIGINAL HUE (Monochromatic, subtle undertone)
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

    // --- 3. Analogous Color 1 (Shares neutral L & C, subtle H shift) ---
    analogousOne = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle1 + 360) % 360,
    };

    analogousOneDark = {
      ...analogousOne,
      l: Math.min(L_MAX, Math.max(L_MIN, analogousOne.l * 0.85)),
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, analogousOne.c * 1.1)),
    };

    analogousOneLight = {
      ...analogousOne,
      l: Math.min(L_MAX, Math.max(L_MIN, analogousOne.l * 1.15)),
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, analogousOne.c * 0.8)),
    };

    // --- 4. Analogous Color 2 ---
    analogousTwo = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle2 + 360) % 360,
    };

    analogousTwoDark = {
      ...analogousTwo,
      l: Math.min(L_MAX, Math.max(L_MIN, analogousTwo.l * 0.85)),
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, analogousTwo.c * 1.1)),
    };

    analogousTwoLight = {
      ...analogousTwo,
      l: Math.min(L_MAX, Math.max(L_MIN, analogousTwo.l * 1.15)),
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, analogousTwo.c * 0.8)),
    };

    // --- 5. Analogous Color 3 (Note: You may only need two analogous colors for a palette) ---
    analogousThree = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle3 + 360) % 360,
    };

    analogousThreeDark = {
      ...analogousThree,
      l: Math.min(L_MAX, Math.max(L_MIN, analogousThree.l * 0.85)),
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, analogousThree.c * 1.1)),
    };

    analogousThreeLight = {
      ...analogousThree,
      l: Math.min(L_MAX, Math.max(L_MIN, analogousThree.l * 1.15)),
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, analogousThree.c * 0.8)),
    };
  }

  return [
    { name: "A1-D", value: analogousOneDark },
    { name: "A1", value: analogousOne },
    { name: "A1-L", value: analogousOneLight },
    { name: "Base-D", value: darkBase },
    { name: "Base", value: baseColor },
    { name: "Base-L", value: lightBase },
    { name: "A2-D", value: analogousTwoDark },
    { name: "A2", value: analogousTwo },
    { name: "A2-L", value: analogousTwoLight },
    { name: "A3-D", value: analogousThreeDark },
    { name: "A3", value: analogousThree },
    { name: "A3-L", value: analogousThreeLight },
  ];
}

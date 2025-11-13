export default function analogousPalGen(oklch, analogOptions, analogPalType) {
  if (analogPalType === "classicCenteredAnalog") {
    const baseColor = oklch;

    const darkBase = {
      ...baseColor,
      l: Math.min(1, Math.max(0, baseColor.l * 0.85)),
    };
    const lightBase = {
      ...baseColor,
      l: Math.min(1, Math.max(0, baseColor.l * 1.15)),
    };

    const analogousOne = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle1 + 360) % 360,
    };

    const analogousOneDark = {
      ...analogousOne,
      l: Math.min(1, Math.max(0, analogousOne.l * 0.85)), // 15% darker, clamped between 0–1
    };

    const analogousOneLight = {
      ...analogousOne,
      l: Math.min(1, Math.max(0, analogousOne.l * 1.15)), // 15% lighter, clamped between 0–1
    };

    const analogousTwo = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle2 + 360) % 360,
    };

    const analogousTwoDark = {
      ...analogousTwo,
      l: Math.min(1, Math.max(0, analogousTwo.l * 0.85)), // 15% darker, clamped between 0–1
    };

    const analogousTwoLight = {
      ...analogousTwo,
      l: Math.min(1, Math.max(0, analogousTwo.l * 1.15)), // 15% lighter,
    };

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
    ];
  } else if (analogPalType === "classicLeftAnalog") {
    const baseColor = oklch;

    const darkBase = {
      ...baseColor,
      l: Math.min(1, Math.max(0, baseColor.l * 0.85)),
    };
    const lightBase = {
      ...baseColor,
      l: Math.min(1, Math.max(0, baseColor.l * 1.15)),
    };

    const analogousOne = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle1 + 360) % 360,
    };

    const analogousOneDark = {
      ...analogousOne,
      l: Math.min(1, Math.max(0, analogousOne.l * 0.85)), // 15% darker, clamped between 0–1
    };

    const analogousOneLight = {
      ...analogousOne,
      l: Math.min(1, Math.max(0, analogousOne.l * 1.15)), // 15% lighter, clamped between 0–1
    };

    const analogousTwo = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle1 * 2 + 360) % 360,
    };

    const analogousTwoDark = {
      ...analogousTwo,
      l: Math.min(1, Math.max(0, analogousTwo.l * 0.85)), // 15% darker, clamped between 0–1
    };

    const analogousTwoLight = {
      ...analogousTwo,
      l: Math.min(1, Math.max(0, analogousTwo.l * 1.15)), // 15% lighter,
    };

    return [
      { name: "A2-D", value: analogousTwoDark },
      { name: "A2", value: analogousTwo },
      { name: "A2-L", value: analogousTwoLight },
      { name: "A1-D", value: analogousOneDark },
      { name: "A1", value: analogousOne },
      { name: "A1-L", value: analogousOneLight },
      { name: "Base-D", value: darkBase },
      { name: "Base", value: baseColor },
      { name: "Base-L", value: lightBase },
    ];
  } else if (analogPalType === "classicRightAnalog") {
    const baseColor = oklch;

    const darkBase = {
      ...baseColor,
      l: Math.min(1, Math.max(0, baseColor.l * 0.85)),
    };
    const lightBase = {
      ...baseColor,
      l: Math.min(1, Math.max(0, baseColor.l * 1.15)),
    };

    const analogousOne = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle2 + 360) % 360,
    };

    const analogousOneDark = {
      ...analogousOne,
      l: Math.min(1, Math.max(0, analogousOne.l * 0.85)), // 15% darker, clamped between 0–1
    };

    const analogousOneLight = {
      ...analogousOne,
      l: Math.min(1, Math.max(0, analogousOne.l * 1.15)), // 15% lighter, clamped between 0–1
    };

    const analogousTwo = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle2 * 2 + 360) % 360,
    };

    const analogousTwoDark = {
      ...analogousTwo,
      l: Math.min(1, Math.max(0, analogousTwo.l * 0.85)), // 15% darker, clamped between 0–1
    };

    const analogousTwoLight = {
      ...analogousTwo,
      l: Math.min(1, Math.max(0, analogousTwo.l * 1.15)), // 15% lighter,
    };

    return [
      { name: "Base-D", value: darkBase },
      { name: "Base", value: baseColor },
      { name: "Base-L", value: lightBase },
      { name: "A1-D", value: analogousOneDark },
      { name: "A1", value: analogousOne },
      { name: "A1-L", value: analogousOneLight },
      { name: "A2-D", value: analogousTwoDark },
      { name: "A2", value: analogousTwo },
      { name: "A2-L", value: analogousTwoLight },
    ];
  } else if (analogPalType === "vibrantCenteredAnalog") {
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

    const baseColor = {
      ...oklch,
      // 1. Lightness is consistently clamped to a muted range
      l: Math.min(L_MAX, Math.max(L_MIN, oklch.l)),
      // 2. Chroma uses the calculated, globally desaturated value
      c: vintageChromaBase,
      // 3. Hue is shifted to a warm tone
      h: (oklch.h + VINTAGE_HUE_SHIFT) % 360,
    };

    const darkBase = {
      ...baseColor,

      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 0.85)),

      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, baseColor.c * 1.1)),
    };

    const lightBase = {
      ...baseColor,

      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 1.15)),

      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, baseColor.c * 0.8)),
    };

    const analogousOne = {
      ...baseColor,

      h: (baseColor.h + analogOptions.analogousAngle1 + 360) % 360,
    };

    const analogousOneDark = {
      ...analogousOne,
      // Apply the same proportional L/C changes as darkBase
      l: Math.min(L_MAX, Math.max(L_MIN, analogousOne.l * 0.85)),
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, analogousOne.c * 1.1)),
    };

    const analogousOneLight = {
      ...analogousOne,
      // Apply the same proportional L/C changes as lightBase
      l: Math.min(L_MAX, Math.max(L_MIN, analogousOne.l * 1.15)),
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, analogousOne.c * 0.8)),
    };

    const analogousTwo = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle2 + 360) % 360,
    };

    const analogousTwoDark = {
      ...analogousTwo,
      l: Math.min(L_MAX, Math.max(L_MIN, analogousTwo.l * 0.85)),
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, analogousTwo.c * 1.1)),
    };

    const analogousTwoLight = {
      ...analogousTwo,
      l: Math.min(L_MAX, Math.max(L_MIN, analogousTwo.l * 1.15)),
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, analogousTwo.c * 0.8)),
    };
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
    ];
  } else if (analogPalType === "vibrantLeftAnalog") {
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

    const baseColor = {
      ...oklch,
      // 1. Lightness is consistently clamped to a muted range
      l: Math.min(L_MAX, Math.max(L_MIN, oklch.l)),
      // 2. Chroma uses the calculated, globally desaturated value
      c: vintageChromaBase,
      // 3. Hue is shifted to a warm tone
      h: (oklch.h + VINTAGE_HUE_SHIFT) % 360,
    };

    const darkBase = {
      ...baseColor,

      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 0.85)),

      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, baseColor.c * 1.1)),
    };

    const lightBase = {
      ...baseColor,

      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 1.15)),

      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, baseColor.c * 0.8)),
    };

    const analogousOne = {
      ...baseColor,

      h: (baseColor.h + analogOptions.analogousAngle1 + 360) % 360,
    };

    const analogousOneDark = {
      ...analogousOne,
      // Apply the same proportional L/C changes as darkBase
      l: Math.min(L_MAX, Math.max(L_MIN, analogousOne.l * 0.85)),
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, analogousOne.c * 1.1)),
    };

    const analogousOneLight = {
      ...analogousOne,
      // Apply the same proportional L/C changes as lightBase
      l: Math.min(L_MAX, Math.max(L_MIN, analogousOne.l * 1.15)),
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, analogousOne.c * 0.8)),
    };

    const analogousTwo = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle1 * 2 + 360) % 360,
    };

    const analogousTwoDark = {
      ...analogousTwo,
      l: Math.min(L_MAX, Math.max(L_MIN, analogousTwo.l * 0.85)),
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, analogousTwo.c * 1.1)),
    };

    const analogousTwoLight = {
      ...analogousTwo,
      l: Math.min(L_MAX, Math.max(L_MIN, analogousTwo.l * 1.15)),
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, analogousTwo.c * 0.8)),
    };
    return [
      { name: "A2-D", value: analogousTwoDark },
      { name: "A2", value: analogousTwo },
      { name: "A2-L", value: analogousTwoLight },
      { name: "A1-D", value: analogousOneDark },
      { name: "A1", value: analogousOne },
      { name: "A1-L", value: analogousOneLight },
      { name: "Base-D", value: darkBase },
      { name: "Base", value: baseColor },
      { name: "Base-L", value: lightBase },
    ];
  } else if (analogPalType === "vibrantRightAnalog") {
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

    const baseColor = {
      ...oklch,
      // 1. Lightness is consistently clamped to a muted range
      l: Math.min(L_MAX, Math.max(L_MIN, oklch.l)),
      // 2. Chroma uses the calculated, globally desaturated value
      c: vintageChromaBase,
      // 3. Hue is shifted to a warm tone
      h: (oklch.h + VINTAGE_HUE_SHIFT) % 360,
    };

    const darkBase = {
      ...baseColor,

      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 0.85)),

      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, baseColor.c * 1.1)),
    };

    const lightBase = {
      ...baseColor,

      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 1.15)),

      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, baseColor.c * 0.8)),
    };

    const analogousOne = {
      ...baseColor,

      h: (baseColor.h + analogOptions.analogousAngle2 + 360) % 360,
    };

    const analogousOneDark = {
      ...analogousOne,
      // Apply the same proportional L/C changes as darkBase
      l: Math.min(L_MAX, Math.max(L_MIN, analogousOne.l * 0.85)),
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, analogousOne.c * 1.1)),
    };

    const analogousOneLight = {
      ...analogousOne,
      // Apply the same proportional L/C changes as lightBase
      l: Math.min(L_MAX, Math.max(L_MIN, analogousOne.l * 1.15)),
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, analogousOne.c * 0.8)),
    };

    const analogousTwo = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle2 * 2 + 360) % 360,
    };

    const analogousTwoDark = {
      ...analogousTwo,
      l: Math.min(L_MAX, Math.max(L_MIN, analogousTwo.l * 0.85)),
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, analogousTwo.c * 1.1)),
    };

    const analogousTwoLight = {
      ...analogousTwo,
      l: Math.min(L_MAX, Math.max(L_MIN, analogousTwo.l * 1.15)),
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, analogousTwo.c * 0.8)),
    };
    return [
      { name: "Base-D", value: darkBase },
      { name: "Base", value: baseColor },
      { name: "Base-L", value: lightBase },
      { name: "A1-D", value: analogousOneDark },
      { name: "A1", value: analogousOne },
      { name: "A1-L", value: analogousOneLight },
      { name: "A2-D", value: analogousTwoDark },
      { name: "A2", value: analogousTwo },
      { name: "A2-L", value: analogousTwoLight },
    ];
  } else if (analogPalType === "neutralAnalog") {
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
    const baseColor = {
      ...oklch,
      l: Math.min(L_MAX, Math.max(L_MIN, oklch.l)), // Consistent L clamp
      c: neutralChromaBase, // Severely desaturated chroma
      h: oklch.h, // RETAIN ORIGINAL HUE (Monochromatic, subtle undertone)
    };

    // --- 2. Dark & Light Variants of Base ---
    const darkBase = {
      ...baseColor,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 0.85)),
      // Darker: slight Chroma increase (x 1.1) capped at 0.08 max
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, baseColor.c * 1.1)),
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 1.15)),
      // Lighter: stronger desaturation (x 0.8) capped at 0.08 max
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, baseColor.c * 0.8)),
    };

    // --- 3. Analogous Color 1 (Shares neutral L & C, subtle H shift) ---
    const analogousOne = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle1 + 360) % 360,
    };

    const analogousOneDark = {
      ...analogousOne,
      l: Math.min(L_MAX, Math.max(L_MIN, analogousOne.l * 0.85)),
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, analogousOne.c * 1.1)),
    };

    const analogousOneLight = {
      ...analogousOne,
      l: Math.min(L_MAX, Math.max(L_MIN, analogousOne.l * 1.15)),
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, analogousOne.c * 0.8)),
    };

    // --- 4. Analogous Color 2 ---
    const analogousTwo = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle2 + 360) % 360,
    };

    const analogousTwoDark = {
      ...analogousTwo,
      l: Math.min(L_MAX, Math.max(L_MIN, analogousTwo.l * 0.85)),
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, analogousTwo.c * 1.1)),
    };

    const analogousTwoLight = {
      ...analogousTwo,
      l: Math.min(L_MAX, Math.max(L_MIN, analogousTwo.l * 1.15)),
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, analogousTwo.c * 0.8)),
    };
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
    ];
  }
}

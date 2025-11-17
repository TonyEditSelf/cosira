export default function analogousPalGen(
  oklch,
  analogOptions,
  analogPalType,
  sliderLightValue = 0,
  sliderChromaValue = 0
) {
  if (analogPalType === "classicCenteredAnalog") {
    const baseColor = oklch;

    const darkBase = {
      ...baseColor,
      l: Math.min(1, Math.max(0, baseColor.l * 0.67)),
    };
    const lightBase = {
      ...baseColor,
      l: Math.min(1, Math.max(0, baseColor.l * 1.34)),
    };

    const analogousOne = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle1 + 360) % 360,
    };

    const analogousOneDark = {
      ...analogousOne,
      l: Math.min(1, Math.max(0, analogousOne.l * 0.67)), // 15% darker, clamped between 0–1
    };

    const analogousOneLight = {
      ...analogousOne,
      l: Math.min(1, Math.max(0, analogousOne.l * 1.34)), // 15% lighter, clamped between 0–1
    };

    const analogousTwo = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle2 + 360) % 360,
    };

    const analogousTwoDark = {
      ...analogousTwo,
      l: Math.min(1, Math.max(0, analogousTwo.l * 0.67)), // 15% darker, clamped between 0–1
    };

    const analogousTwoLight = {
      ...analogousTwo,
      l: Math.min(1, Math.max(0, analogousTwo.l * 1.34)), // 15% lighter,
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
      l: Math.min(1, Math.max(0, baseColor.l * 0.67)),
    };
    const lightBase = {
      ...baseColor,
      l: Math.min(1, Math.max(0, baseColor.l * 1.34)),
    };

    const analogousOne = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle1 + 360) % 360,
    };

    const analogousOneDark = {
      ...analogousOne,
      l: Math.min(1, Math.max(0, analogousOne.l * 0.67)), // 15% darker, clamped between 0–1
    };

    const analogousOneLight = {
      ...analogousOne,
      l: Math.min(1, Math.max(0, analogousOne.l * 1.34)), // 15% lighter, clamped between 0–1
    };

    const analogousTwo = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle1 * 2 + 360) % 360,
    };

    const analogousTwoDark = {
      ...analogousTwo,
      l: Math.min(1, Math.max(0, analogousTwo.l * 0.67)), // 15% darker, clamped between 0–1
    };

    const analogousTwoLight = {
      ...analogousTwo,
      l: Math.min(1, Math.max(0, analogousTwo.l * 1.34)), // 15% lighter,
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
      l: Math.min(1, Math.max(0, baseColor.l * 0.67)),
    };
    const lightBase = {
      ...baseColor,
      l: Math.min(1, Math.max(0, baseColor.l * 1.34)),
    };

    const analogousOne = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle2 + 360) % 360,
    };

    const analogousOneDark = {
      ...analogousOne,
      l: Math.min(1, Math.max(0, analogousOne.l * 0.67)), // 15% darker, clamped between 0–1
    };

    const analogousOneLight = {
      ...analogousOne,
      l: Math.min(1, Math.max(0, analogousOne.l * 1.34)), // 15% lighter, clamped between 0–1
    };

    const analogousTwo = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle2 * 2 + 360) % 360,
    };

    const analogousTwoDark = {
      ...analogousTwo,
      l: Math.min(1, Math.max(0, analogousTwo.l * 0.67)), // 15% darker, clamped between 0–1
    };

    const analogousTwoLight = {
      ...analogousTwo,
      l: Math.min(1, Math.max(0, analogousTwo.l * 1.34)), // 15% lighter,
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
  } else if (analogPalType === "vintageCenteredAnalog") {
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
  } else if (analogPalType === "vintageLeftAnalog") {
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
  } else if (analogPalType === "vintageRightAnalog") {
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
  } else if (analogPalType === "neutralCenteredAnalog") {
    const LMAX = 0.96; // near-white highlights
    const LMIN = 0.18; // deep shadows
    const CMAX = 0.08; // subtle hue presence (neutral but not gray)
    const CMIN = 0.02; // nearly achromatic

    // --- Base color (already provided structure) ---
    const baseColor = {
      ...oklch,
      l: Math.min(LMAX, Math.max(LMIN, 0.57 + sliderLightValue)),
      c: Math.min(CMAX, Math.max(CMIN, 0.05 + sliderChromaValue)),
    };

    // --- Base tonal steps ---
    const darkBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.65)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.15)),
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, baseColor.l + (LMAX - baseColor.l) * 0.45)
      ),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.85)),
    };

    // ----------------------------------------------
    //  ANALOGOUS HUES (±30° around the base hue)
    // ----------------------------------------------

    const analogousOne = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle1 + 360) % 360,
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.95)), // slightly softened hue
    };

    const analogousTwo = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle2 + 360) % 360,
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.95)),
    };

    // ----------------------------------------------
    //  Tonal steps for the analogous colors
    //  (mirroring Base: dark = 0.65L, light = +45% toward white)
    // ----------------------------------------------

    const analogousOneDark = {
      ...analogousOne,
      l: Math.min(LMAX, Math.max(LMIN, analogousOne.l * 0.65)),
      c: Math.min(CMAX, Math.max(CMIN, analogousOne.c * 1.15)),
    };

    const analogousOneLight = {
      ...analogousOne,
      l: Math.min(
        LMAX,
        Math.max(LMIN, analogousOne.l + (LMAX - analogousOne.l) * 0.45)
      ),
      c: Math.min(CMAX, Math.max(CMIN, analogousOne.c * 0.85)),
    };

    const analogousTwoDark = {
      ...analogousTwo,
      l: Math.min(LMAX, Math.max(LMIN, analogousTwo.l * 0.65)),
      c: Math.min(CMAX, Math.max(CMIN, analogousTwo.c * 1.15)),
    };

    const analogousTwoLight = {
      ...analogousTwo,
      l: Math.min(
        LMAX,
        Math.max(LMIN, analogousTwo.l + (LMAX - analogousTwo.l) * 0.45)
      ),
      c: Math.min(CMAX, Math.max(CMIN, analogousTwo.c * 0.85)),
    };

    // ----------------------------------------------
    // Final palette output
    // ----------------------------------------------
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
  } else if (analogPalType === "neutralLeftAnalog") {
    const LMAX = 0.96; // near-white highlights
    const LMIN = 0.18; // deep shadows
    const CMAX = 0.08; // subtle hue presence (neutral but not gray)
    const CMIN = 0.02; // nearly achromatic

    // --- Base color (already provided structure) ---
    const baseColor = {
      ...oklch,
      l: Math.min(LMAX, Math.max(LMIN, 0.57 + sliderLightValue)),
      c: Math.min(CMAX, Math.max(CMIN, 0.05 + sliderChromaValue)),
    };

    // --- Base tonal steps ---
    const darkBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.65)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.15)),
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, baseColor.l + (LMAX - baseColor.l) * 0.45)
      ),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.85)),
    };

    // ----------------------------------------------
    //  ANALOGOUS HUES (±30° around the base hue)
    // ----------------------------------------------

    const analogousOne = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle1 + 360) % 360,
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.95)), // slightly softened hue
    };

    const analogousTwo = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle1 * 2 + 360) % 360,
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.95)),
    };

    // ----------------------------------------------
    //  Tonal steps for the analogous colors
    //  (mirroring Base: dark = 0.65L, light = +45% toward white)
    // ----------------------------------------------

    const analogousOneDark = {
      ...analogousOne,
      l: Math.min(LMAX, Math.max(LMIN, analogousOne.l * 0.65)),
      c: Math.min(CMAX, Math.max(CMIN, analogousOne.c * 1.15)),
    };

    const analogousOneLight = {
      ...analogousOne,
      l: Math.min(
        LMAX,
        Math.max(LMIN, analogousOne.l + (LMAX - analogousOne.l) * 0.45)
      ),
      c: Math.min(CMAX, Math.max(CMIN, analogousOne.c * 0.85)),
    };

    const analogousTwoDark = {
      ...analogousTwo,
      l: Math.min(LMAX, Math.max(LMIN, analogousTwo.l * 0.65)),
      c: Math.min(CMAX, Math.max(CMIN, analogousTwo.c * 1.15)),
    };

    const analogousTwoLight = {
      ...analogousTwo,
      l: Math.min(
        LMAX,
        Math.max(LMIN, analogousTwo.l + (LMAX - analogousTwo.l) * 0.45)
      ),
      c: Math.min(CMAX, Math.max(CMIN, analogousTwo.c * 0.85)),
    };

    // ----------------------------------------------
    // Final palette output
    // ----------------------------------------------
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
  } else if (analogPalType === "neutralRightAnalog") {
    const LMAX = 0.96; // near-white highlights
    const LMIN = 0.18; // deep shadows
    const CMAX = 0.08; // subtle hue presence (neutral but not gray)
    const CMIN = 0.02; // nearly achromatic

    // --- Base color (already provided structure) ---
    const baseColor = {
      ...oklch,
      l: Math.min(LMAX, Math.max(LMIN, 0.57 + sliderLightValue)),
      c: Math.min(CMAX, Math.max(CMIN, 0.05 + sliderChromaValue)),
    };

    // --- Base tonal steps ---
    const darkBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.65)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.15)),
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, baseColor.l + (LMAX - baseColor.l) * 0.45)
      ),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.85)),
    };

    // ----------------------------------------------
    //  ANALOGOUS HUES (±30° around the base hue)
    // ----------------------------------------------

    const analogousOne = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle2 + 360) % 360,
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.95)), // slightly softened hue
    };

    const analogousTwo = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle2 * 2 + 360) % 360,
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.95)),
    };

    // ----------------------------------------------
    //  Tonal steps for the analogous colors
    //  (mirroring Base: dark = 0.65L, light = +45% toward white)
    // ----------------------------------------------

    const analogousOneDark = {
      ...analogousOne,
      l: Math.min(LMAX, Math.max(LMIN, analogousOne.l * 0.65)),
      c: Math.min(CMAX, Math.max(CMIN, analogousOne.c * 1.15)),
    };

    const analogousOneLight = {
      ...analogousOne,
      l: Math.min(
        LMAX,
        Math.max(LMIN, analogousOne.l + (LMAX - analogousOne.l) * 0.45)
      ),
      c: Math.min(CMAX, Math.max(CMIN, analogousOne.c * 0.85)),
    };

    const analogousTwoDark = {
      ...analogousTwo,
      l: Math.min(LMAX, Math.max(LMIN, analogousTwo.l * 0.65)),
      c: Math.min(CMAX, Math.max(CMIN, analogousTwo.c * 1.15)),
    };

    const analogousTwoLight = {
      ...analogousTwo,
      l: Math.min(
        LMAX,
        Math.max(LMIN, analogousTwo.l + (LMAX - analogousTwo.l) * 0.45)
      ),
      c: Math.min(CMAX, Math.max(CMIN, analogousTwo.c * 0.85)),
    };

    // ----------------------------------------------
    // Final palette output
    // ----------------------------------------------
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
  } else if (analogPalType === "kidsBrightCentered") {
    const LMAX = 0.88; // bright, cheerful highlights
    const LMIN = 0.35; // deeper but still playful shadows
    const CMAX = 0.28; // vibrant saturation
    const CMIN = 0.15; // never dull

    // --- Base color ---
    const baseColor = {
      ...oklch,
      l: Math.min(LMAX, Math.max(LMIN, 0.62 + sliderLightValue)),
      c: Math.min(CMAX, Math.max(CMIN, 0.22 + sliderChromaValue)),
    };

    // --- Base tonal steps ---
    const darkBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.16)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.08)),
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.14)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.95)),
    };

    // ----------------------------------------------
    //  ANALOGOUS HUES (playful ±30° around base hue)
    // ----------------------------------------------

    const analogousOne = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle1 + 360) % 360,
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.03)), // slight extra fun vibrancy
    };

    const analogousTwo = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle2 + 360) % 360,
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.03)),
    };

    // ----------------------------------------------
    //  Tonal Variants (same rules as Base)
    // ----------------------------------------------
    const analogousOneDark = {
      ...analogousOne,
      l: Math.min(LMAX, Math.max(LMIN, analogousOne.l - 0.16)),
      c: Math.min(CMAX, Math.max(CMIN, analogousOne.c * 1.08)),
    };

    const analogousOneLight = {
      ...analogousOne,
      l: Math.min(LMAX, Math.max(LMIN, analogousOne.l + 0.14)),
      c: Math.min(CMAX, Math.max(CMIN, analogousOne.c * 0.95)),
    };

    const analogousTwoDark = {
      ...analogousTwo,
      l: Math.min(LMAX, Math.max(LMIN, analogousTwo.l - 0.16)),
      c: Math.min(CMAX, Math.max(CMIN, analogousTwo.c * 1.08)),
    };

    const analogousTwoLight = {
      ...analogousTwo,
      l: Math.min(LMAX, Math.max(LMIN, analogousTwo.l + 0.14)),
      c: Math.min(CMAX, Math.max(CMIN, analogousTwo.c * 0.95)),
    };

    // ----------------------------------------------
    //  Final kids-friendly analogous palette
    // ----------------------------------------------
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
  } else if (analogPalType === "kidsBrightLeft") {
    const LMAX = 0.88; // bright, cheerful highlights
    const LMIN = 0.35; // deeper but still playful shadows
    const CMAX = 0.28; // vibrant saturation
    const CMIN = 0.15; // never dull

    // --- Base color ---
    const baseColor = {
      ...oklch,
      l: Math.min(LMAX, Math.max(LMIN, 0.62 + sliderLightValue)),
      c: Math.min(CMAX, Math.max(CMIN, 0.22 + sliderChromaValue)),
    };

    // --- Base tonal steps ---
    const darkBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.16)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.08)),
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.14)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.95)),
    };

    // ----------------------------------------------
    //  ANALOGOUS HUES (playful ±30° around base hue)
    // ----------------------------------------------

    const analogousOne = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle1 + 360) % 360,
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.03)), // slight extra fun vibrancy
    };

    const analogousTwo = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle1 * 2 + 360) % 360,
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.03)),
    };

    // ----------------------------------------------
    //  Tonal Variants (same rules as Base)
    // ----------------------------------------------
    const analogousOneDark = {
      ...analogousOne,
      l: Math.min(LMAX, Math.max(LMIN, analogousOne.l - 0.16)),
      c: Math.min(CMAX, Math.max(CMIN, analogousOne.c * 1.08)),
    };

    const analogousOneLight = {
      ...analogousOne,
      l: Math.min(LMAX, Math.max(LMIN, analogousOne.l + 0.14)),
      c: Math.min(CMAX, Math.max(CMIN, analogousOne.c * 0.95)),
    };

    const analogousTwoDark = {
      ...analogousTwo,
      l: Math.min(LMAX, Math.max(LMIN, analogousTwo.l - 0.16)),
      c: Math.min(CMAX, Math.max(CMIN, analogousTwo.c * 1.08)),
    };

    const analogousTwoLight = {
      ...analogousTwo,
      l: Math.min(LMAX, Math.max(LMIN, analogousTwo.l + 0.14)),
      c: Math.min(CMAX, Math.max(CMIN, analogousTwo.c * 0.95)),
    };

    // ----------------------------------------------
    //  Final kids-friendly analogous palette
    // ----------------------------------------------
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
  } else if (analogPalType === "kidsBrightRight") {
    const LMAX = 0.88; // bright, cheerful highlights
    const LMIN = 0.35; // deeper but still playful shadows
    const CMAX = 0.28; // vibrant saturation
    const CMIN = 0.15; // never dull

    // --- Base color ---
    const baseColor = {
      ...oklch,
      l: Math.min(LMAX, Math.max(LMIN, 0.62 + sliderLightValue)),
      c: Math.min(CMAX, Math.max(CMIN, 0.22 + sliderChromaValue)),
    };

    // --- Base tonal steps ---
    const darkBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.16)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.08)),
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.14)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.95)),
    };

    // ----------------------------------------------
    //  ANALOGOUS HUES (playful ±30° around base hue)
    // ----------------------------------------------

    const analogousOne = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle2 + 360) % 360,
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.03)), // slight extra fun vibrancy
    };

    const analogousTwo = {
      ...baseColor,
      h: (baseColor.h + analogOptions.analogousAngle2 * 2 + 360) % 360,
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.03)),
    };

    // ----------------------------------------------
    //  Tonal Variants (same rules as Base)
    // ----------------------------------------------
    const analogousOneDark = {
      ...analogousOne,
      l: Math.min(LMAX, Math.max(LMIN, analogousOne.l - 0.16)),
      c: Math.min(CMAX, Math.max(CMIN, analogousOne.c * 1.08)),
    };

    const analogousOneLight = {
      ...analogousOne,
      l: Math.min(LMAX, Math.max(LMIN, analogousOne.l + 0.14)),
      c: Math.min(CMAX, Math.max(CMIN, analogousOne.c * 0.95)),
    };

    const analogousTwoDark = {
      ...analogousTwo,
      l: Math.min(LMAX, Math.max(LMIN, analogousTwo.l - 0.16)),
      c: Math.min(CMAX, Math.max(CMIN, analogousTwo.c * 1.08)),
    };

    const analogousTwoLight = {
      ...analogousTwo,
      l: Math.min(LMAX, Math.max(LMIN, analogousTwo.l + 0.14)),
      c: Math.min(CMAX, Math.max(CMIN, analogousTwo.c * 0.95)),
    };

    // ----------------------------------------------
    //  Final kids-friendly analogous palette
    // ----------------------------------------------
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
  } else if (analogPalType === "toyLikeCentered") {
    const toyLMIN = 0.55;
    const toyLMAX = 0.8;
    const toyCMIN = 0.28;
    const toyCMAX = 0.38;

    const baseToy = {
      ...oklch,
      l: Math.min(toyLMAX, Math.max(toyLMIN, 0.65 + sliderLightValue)),
      c: Math.min(toyCMAX, Math.max(toyCMIN, 0.32 + sliderChromaValue)),
    };

    const darkToy = { ...baseToy, l: baseToy.l - 0.12, c: baseToy.c * 1.05 };
    const lightToy = { ...baseToy, l: baseToy.l + 0.1, c: baseToy.c * 0.92 };

    const a1Toy = {
      ...baseToy,
      h: (baseToy.h + analogOptions.analogousAngle1 + 360) % 360,
    };
    const a2Toy = {
      ...baseToy,
      h: (baseToy.h + analogOptions.analogousAngle2 + 360) % 360,
    };

    const a1ToyDark = { ...a1Toy, l: darkToy.l, c: darkToy.c };
    const a1ToyLight = { ...a1Toy, l: lightToy.l, c: lightToy.c };

    const a2ToyDark = { ...a2Toy, l: darkToy.l, c: darkToy.c };
    const a2ToyLight = { ...a2Toy, l: lightToy.l, c: lightToy.c };

    return [
      { name: "Toy-A1-D", value: a1ToyDark },
      { name: "Toy-A1", value: a1Toy },
      { name: "Toy-A1-L", value: a1ToyLight },

      { name: "Toy-Base-D", value: darkToy },
      { name: "Toy-Base", value: baseToy },
      { name: "Toy-Base-L", value: lightToy },

      { name: "Toy-A2-D", value: a2ToyDark },
      { name: "Toy-A2", value: a2Toy },
      { name: "Toy-A2-L", value: a2ToyLight },
    ];
  } else if (analogPalType === "toyLikeLeft") {
    const toyLMIN = 0.55;
    const toyLMAX = 0.8;
    const toyCMIN = 0.28;
    const toyCMAX = 0.38;

    const baseToy = {
      ...oklch,
      l: Math.min(toyLMAX, Math.max(toyLMIN, 0.65 + sliderLightValue)),
      c: Math.min(toyCMAX, Math.max(toyCMIN, 0.32 + sliderChromaValue)),
    };

    const darkToy = { ...baseToy, l: baseToy.l - 0.12, c: baseToy.c * 1.05 };
    const lightToy = { ...baseToy, l: baseToy.l + 0.1, c: baseToy.c * 0.92 };

    const a1Toy = {
      ...baseToy,
      h: (baseToy.h + analogOptions.analogousAngle1 + 360) % 360,
    };
    const a2Toy = {
      ...baseToy,
      h: (baseToy.h + analogOptions.analogousAngle1 * 2 + 360) % 360,
    };

    const a1ToyDark = { ...a1Toy, l: darkToy.l, c: darkToy.c };
    const a1ToyLight = { ...a1Toy, l: lightToy.l, c: lightToy.c };

    const a2ToyDark = { ...a2Toy, l: darkToy.l, c: darkToy.c };
    const a2ToyLight = { ...a2Toy, l: lightToy.l, c: lightToy.c };

    return [
      { name: "Toy-A2-D", value: a2ToyDark },
      { name: "Toy-A2", value: a2Toy },
      { name: "Toy-A2-L", value: a2ToyLight },

      { name: "Toy-A1-D", value: a1ToyDark },
      { name: "Toy-A1", value: a1Toy },
      { name: "Toy-A1-L", value: a1ToyLight },

      { name: "Toy-Base-D", value: darkToy },
      { name: "Toy-Base", value: baseToy },
      { name: "Toy-Base-L", value: lightToy },
    ];
  } else if (analogPalType === "toyLikeRight") {
    const toyLMIN = 0.55;
    const toyLMAX = 0.8;
    const toyCMIN = 0.28;
    const toyCMAX = 0.38;

    const baseToy = {
      ...oklch,
      l: Math.min(toyLMAX, Math.max(toyLMIN, 0.65 + sliderLightValue)),
      c: Math.min(toyCMAX, Math.max(toyCMIN, 0.32 + sliderChromaValue)),
    };

    const darkToy = { ...baseToy, l: baseToy.l - 0.12, c: baseToy.c * 1.05 };
    const lightToy = { ...baseToy, l: baseToy.l + 0.1, c: baseToy.c * 0.92 };

    const a1Toy = {
      ...baseToy,
      h: (baseToy.h + analogOptions.analogousAngle2 + 360) % 360,
    };
    const a2Toy = {
      ...baseToy,
      h: (baseToy.h + analogOptions.analogousAngle2 * 2 + 360) % 360,
    };

    const a1ToyDark = { ...a1Toy, l: darkToy.l, c: darkToy.c };
    const a1ToyLight = { ...a1Toy, l: lightToy.l, c: lightToy.c };

    const a2ToyDark = { ...a2Toy, l: darkToy.l, c: darkToy.c };
    const a2ToyLight = { ...a2Toy, l: lightToy.l, c: lightToy.c };

    return [
      { name: "Toy-Base-D", value: darkToy },
      { name: "Toy-Base", value: baseToy },
      { name: "Toy-Base-L", value: lightToy },

      { name: "Toy-A1-D", value: a1ToyDark },
      { name: "Toy-A1", value: a1Toy },
      { name: "Toy-A1-L", value: a1ToyLight },

      { name: "Toy-A2-D", value: a2ToyDark },
      { name: "Toy-A2", value: a2Toy },
      { name: "Toy-A2-L", value: a2ToyLight },
    ];
  } else if (analogPalType === "pastelKidCentered") {
    const pastelLMIN = 0.72;
    const pastelLMAX = 0.92;
    const pastelCMIN = 0.1;
    const pastelCMAX = 0.2;

    const basePastel = {
      ...oklch,
      l: Math.min(pastelLMAX, Math.max(pastelLMIN, 0.78 + sliderLightValue)),
      c: Math.min(pastelCMAX, Math.max(pastelCMIN, 0.15 + sliderChromaValue)),
    };

    const darkPastel = {
      ...basePastel,
      l: basePastel.l - 0.1,
      c: basePastel.c * 1.12,
    };
    const lightPastel = {
      ...basePastel,
      l: basePastel.l + 0.08,
      c: basePastel.c * 0.9,
    };

    const A1Pastel = {
      ...basePastel,
      h: (basePastel.h + analogOptions.analogousAngle1 + 360) % 360,
    };
    const A2Pastel = {
      ...basePastel,
      h: (basePastel.h + analogOptions.analogousAngle2 + 360) % 360,
    };

    const A1PastelDark = { ...A1Pastel, l: darkPastel.l, c: darkPastel.c };
    const A1PastelLight = { ...A1Pastel, l: lightPastel.l, c: lightPastel.c };

    const A2PastelDark = { ...A2Pastel, l: darkPastel.l, c: darkPastel.c };
    const A2PastelLight = { ...A2Pastel, l: lightPastel.l, c: lightPastel.c };

    return [
      { name: "Pastel-A1-D", value: A1PastelDark },
      { name: "Pastel-A1", value: A1Pastel },
      { name: "Pastel-A1-L", value: A1PastelLight },

      { name: "Pastel-Base-D", value: darkPastel },
      { name: "Pastel-Base", value: basePastel },
      { name: "Pastel-Base-L", value: lightPastel },

      { name: "Pastel-A2-D", value: A2PastelDark },
      { name: "Pastel-A2", value: A2Pastel },
      { name: "Pastel-A2-L", value: A2PastelLight },
    ];
  } else if (analogPalType === "pastelKidLeft") {
    const pastelLMIN = 0.72;
    const pastelLMAX = 0.92;
    const pastelCMIN = 0.1;
    const pastelCMAX = 0.2;

    const basePastel = {
      ...oklch,
      l: Math.min(pastelLMAX, Math.max(pastelLMIN, 0.78 + sliderLightValue)),
      c: Math.min(pastelCMAX, Math.max(pastelCMIN, 0.15 + sliderChromaValue)),
    };

    const darkPastel = {
      ...basePastel,
      l: basePastel.l - 0.1,
      c: basePastel.c * 1.12,
    };
    const lightPastel = {
      ...basePastel,
      l: basePastel.l + 0.08,
      c: basePastel.c * 0.9,
    };

    const A1Pastel = {
      ...basePastel,
      h: (basePastel.h + analogOptions.analogousAngle1 + 360) % 360,
    };
    const A2Pastel = {
      ...basePastel,
      h: (basePastel.h + analogOptions.analogousAngle1 * 2 + 360) % 360,
    };

    const A1PastelDark = { ...A1Pastel, l: darkPastel.l, c: darkPastel.c };
    const A1PastelLight = { ...A1Pastel, l: lightPastel.l, c: lightPastel.c };

    const A2PastelDark = { ...A2Pastel, l: darkPastel.l, c: darkPastel.c };
    const A2PastelLight = { ...A2Pastel, l: lightPastel.l, c: lightPastel.c };

    return [
      { name: "Pastel-A2-D", value: A2PastelDark },
      { name: "Pastel-A2", value: A2Pastel },
      { name: "Pastel-A2-L", value: A2PastelLight },

      { name: "Pastel-A1-D", value: A1PastelDark },
      { name: "Pastel-A1", value: A1Pastel },
      { name: "Pastel-A1-L", value: A1PastelLight },

      { name: "Pastel-Base-D", value: darkPastel },
      { name: "Pastel-Base", value: basePastel },
      { name: "Pastel-Base-L", value: lightPastel },
    ];
  } else if (analogPalType === "pastelKidRight") {
    const pastelLMIN = 0.72;
    const pastelLMAX = 0.92;
    const pastelCMIN = 0.1;
    const pastelCMAX = 0.2;

    const basePastel = {
      ...oklch,
      l: Math.min(pastelLMAX, Math.max(pastelLMIN, 0.78 + sliderLightValue)),
      c: Math.min(pastelCMAX, Math.max(pastelCMIN, 0.15 + sliderChromaValue)),
    };

    const darkPastel = {
      ...basePastel,
      l: basePastel.l - 0.1,
      c: basePastel.c * 1.12,
    };
    const lightPastel = {
      ...basePastel,
      l: basePastel.l + 0.08,
      c: basePastel.c * 0.9,
    };

    const A1Pastel = {
      ...basePastel,
      h: (basePastel.h + analogOptions.analogousAngle2 + 360) % 360,
    };
    const A2Pastel = {
      ...basePastel,
      h: (basePastel.h + analogOptions.analogousAngle2 * 2 + 360) % 360,
    };

    const A1PastelDark = { ...A1Pastel, l: darkPastel.l, c: darkPastel.c };
    const A1PastelLight = { ...A1Pastel, l: lightPastel.l, c: lightPastel.c };

    const A2PastelDark = { ...A2Pastel, l: darkPastel.l, c: darkPastel.c };
    const A2PastelLight = { ...A2Pastel, l: lightPastel.l, c: lightPastel.c };

    return [
      { name: "Pastel-Base-D", value: darkPastel },
      { name: "Pastel-Base", value: basePastel },
      { name: "Pastel-Base-L", value: lightPastel },

      { name: "Pastel-A1-D", value: A1PastelDark },
      { name: "Pastel-A1", value: A1Pastel },
      { name: "Pastel-A1-L", value: A1PastelLight },

      { name: "Pastel-A2-D", value: A2PastelDark },
      { name: "Pastel-A2", value: A2Pastel },
      { name: "Pastel-A2-L", value: A2PastelLight },
    ];
  } else if (analogPalType === "neoKidCentered") {
    const neoLMIN = 0.6;
    const neoLMAX = 0.85;
    const neoCMIN = 0.18;
    const neoCMAX = 0.26;

    const baseNeo = {
      ...oklch,
      l: Math.min(neoLMAX, Math.max(neoLMIN, 0.7 + sliderLightValue)),
      c: Math.min(neoCMAX, Math.max(neoCMIN, 0.22 + sliderChromaValue)),
    };

    const darkNeo = { ...baseNeo, l: baseNeo.l - 0.1, c: baseNeo.c * 1.06 };
    const lightNeo = { ...baseNeo, l: baseNeo.l + 0.12, c: baseNeo.c * 0.9 };

    const a1Neo = {
      ...baseNeo,
      h: (baseNeo.h + analogOptions.analogousAngle1 + 360) % 360,
    };
    const a2Neo = {
      ...baseNeo,
      h: (baseNeo.h + analogOptions.analogousAngle2 + 360) % 360,
    };

    const a1NeoDark = { ...a1Neo, l: darkNeo.l, c: darkNeo.c };
    const a1NeoLight = { ...a1Neo, l: lightNeo.l, c: lightNeo.c };

    const a2NeoDark = { ...a2Neo, l: darkNeo.l, c: darkNeo.c };
    const a2NeoLight = { ...a2Neo, l: lightNeo.l, c: lightNeo.c };

    return [
      { name: "Neo-A1-D", value: a1NeoDark },
      { name: "Neo-A1", value: a1Neo },
      { name: "Neo-A1-L", value: a1NeoLight },

      { name: "Neo-Base-D", value: darkNeo },
      { name: "Neo-Base", value: baseNeo },
      { name: "Neo-Base-L", value: lightNeo },

      { name: "Neo-A2-D", value: a2NeoDark },
      { name: "Neo-A2", value: a2Neo },
      { name: "Neo-A2-L", value: a2NeoLight },
    ];
  } else if (analogPalType === "neoKidLeft") {
    const neoLMIN = 0.6;
    const neoLMAX = 0.85;
    const neoCMIN = 0.18;
    const neoCMAX = 0.26;

    const baseNeo = {
      ...oklch,
      l: Math.min(neoLMAX, Math.max(neoLMIN, 0.7 + sliderLightValue)),
      c: Math.min(neoCMAX, Math.max(neoCMIN, 0.22 + sliderChromaValue)),
    };

    const darkNeo = { ...baseNeo, l: baseNeo.l - 0.1, c: baseNeo.c * 1.06 };
    const lightNeo = { ...baseNeo, l: baseNeo.l + 0.12, c: baseNeo.c * 0.9 };

    const a1Neo = {
      ...baseNeo,
      h: (baseNeo.h + analogOptions.analogousAngle1 + 360) % 360,
    };
    const a2Neo = {
      ...baseNeo,
      h: (baseNeo.h + analogOptions.analogousAngle1 * 2 + 360) % 360,
    };

    const a1NeoDark = { ...a1Neo, l: darkNeo.l, c: darkNeo.c };
    const a1NeoLight = { ...a1Neo, l: lightNeo.l, c: lightNeo.c };

    const a2NeoDark = { ...a2Neo, l: darkNeo.l, c: darkNeo.c };
    const a2NeoLight = { ...a2Neo, l: lightNeo.l, c: lightNeo.c };

    return [
      { name: "Neo-A2-D", value: a2NeoDark },
      { name: "Neo-A2", value: a2Neo },
      { name: "Neo-A2-L", value: a2NeoLight },

      { name: "Neo-A1-D", value: a1NeoDark },
      { name: "Neo-A1", value: a1Neo },
      { name: "Neo-A1-L", value: a1NeoLight },

      { name: "Neo-Base-D", value: darkNeo },
      { name: "Neo-Base", value: baseNeo },
      { name: "Neo-Base-L", value: lightNeo },
    ];
  } else if (analogPalType === "neoKidRight") {
    const neoLMIN = 0.6;
    const neoLMAX = 0.85;
    const neoCMIN = 0.18;
    const neoCMAX = 0.26;

    const baseNeo = {
      ...oklch,
      l: Math.min(neoLMAX, Math.max(neoLMIN, 0.7 + sliderLightValue)),
      c: Math.min(neoCMAX, Math.max(neoCMIN, 0.22 + sliderChromaValue)),
    };

    const darkNeo = { ...baseNeo, l: baseNeo.l - 0.1, c: baseNeo.c * 1.06 };
    const lightNeo = { ...baseNeo, l: baseNeo.l + 0.12, c: baseNeo.c * 0.9 };

    const a1Neo = {
      ...baseNeo,
      h: (baseNeo.h + analogOptions.analogousAngle2 + 360) % 360,
    };
    const a2Neo = {
      ...baseNeo,
      h: (baseNeo.h + analogOptions.analogousAngle2 * 2 + 360) % 360,
    };

    const a1NeoDark = { ...a1Neo, l: darkNeo.l, c: darkNeo.c };
    const a1NeoLight = { ...a1Neo, l: lightNeo.l, c: lightNeo.c };

    const a2NeoDark = { ...a2Neo, l: darkNeo.l, c: darkNeo.c };
    const a2NeoLight = { ...a2Neo, l: lightNeo.l, c: lightNeo.c };

    return [
      { name: "Neo-Base-D", value: darkNeo },
      { name: "Neo-Base", value: baseNeo },
      { name: "Neo-Base-L", value: lightNeo },

      { name: "Neo-A1-D", value: a1NeoDark },
      { name: "Neo-A1", value: a1Neo },
      { name: "Neo-A1-L", value: a1NeoLight },

      { name: "Neo-A2-D", value: a2NeoDark },
      { name: "Neo-A2", value: a2Neo },
      { name: "Neo-A2-L", value: a2NeoLight },
    ];
  }
}

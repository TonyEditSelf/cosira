const getChromaCompensation = (hue) => {
  // Normalize hue to 0-360
  const h = ((hue % 360) + 360) % 360;

  // Yellow (45-75): tends to be more saturated, reduce chroma slightly
  if (h >= 45 && h < 75) {
    return 0.85;
  }

  // Green (75-165): naturally vibrant, reduce chroma moderately
  if (h >= 75 && h < 165) {
    return 0.9;
  }

  // Cyan (165-195): very saturated, reduce more
  if (h >= 165 && h < 195) {
    return 0.8;
  }

  // Blue (195-270): less saturated, boost slightly
  if (h >= 195 && h < 270) {
    return 1.1;
  }

  // Magenta (270-330): less saturated, boost
  if (h >= 270 && h < 330) {
    return 1.15;
  }

  // Red (330-45): varies, slight boost
  return 1.05;
};

export default function analogousPalGen(
  oklch,
  analogOptions,
  analogPalType,
  sliderLightValue = 0,
  sliderChromaValue = 0
) {
  if (analogPalType === "classicCenteredAnalog") {
    const L_DARK_SHIFT = 0.25;
    const L_LIGHT_SHIFT = 0.25;
    const C_DARK_BOOST = 1.15;
    const C_LIGHT_REDUCE = 0.85;

    const baseColor = oklch;

    // Apply chroma compensation to base color
    const baseChromaCompensated =
      baseColor.c * getChromaCompensation(baseColor.h);

    const darkBase = {
      ...baseColor,
      l: Math.max(0, Math.min(1, baseColor.l - L_DARK_SHIFT)),
      c: Math.min(0.4, baseChromaCompensated * C_DARK_BOOST),
    };

    const lightBase = {
      ...baseColor,
      l: Math.max(0, Math.min(1, baseColor.l + L_LIGHT_SHIFT)),
      c: Math.max(0, baseChromaCompensated * C_LIGHT_REDUCE),
    };

    const createColorVariant = (hue, baseLightness, baseChroma) => {
      const adjustedHue = (baseColor.h + hue + 360) % 360;
      const chromaCompensation = getChromaCompensation(adjustedHue);
      const compensatedChroma = baseChroma * chromaCompensation;

      return {
        base: {
          ...baseColor,
          h: adjustedHue,
          l: baseLightness,
          c: compensatedChroma,
        },
        dark: {
          ...baseColor,
          h: adjustedHue,
          l: Math.max(0, Math.min(1, baseLightness - L_DARK_SHIFT)),
          c: Math.min(0.4, compensatedChroma * C_DARK_BOOST),
        },
        light: {
          ...baseColor,
          h: adjustedHue,
          l: Math.max(0, Math.min(1, baseLightness + L_LIGHT_SHIFT)),
          c: Math.max(0, compensatedChroma * C_LIGHT_REDUCE),
        },
      };
    };

    const a1 = createColorVariant(-30, baseColor.l, baseChromaCompensated);
    const a2 = createColorVariant(50, baseColor.l, baseChromaCompensated);

    return [
      { name: "A1-D", value: a1.dark },
      { name: "A1", value: a1.base },
      { name: "A1-L", value: a1.light },
      { name: "Base-D", value: darkBase },
      { name: "Base", value: baseColor },
      { name: "Base-L", value: lightBase },
      { name: "A2-D", value: a2.dark },
      { name: "A2", value: a2.base },
      { name: "A2-L", value: a2.light },
    ];
  } else if (analogPalType === "classicLeftAnalog") {
    const L_DARK_SHIFT = 0.25;
    const L_LIGHT_SHIFT = 0.25;
    const C_DARK_BOOST = 1.15;
    const C_LIGHT_REDUCE = 0.85;

    const baseColor = oklch;
    const baseChromaCompensated =
      baseColor.c * getChromaCompensation(baseColor.h);

    const darkBase = {
      ...baseColor,
      l: Math.max(0, Math.min(1, baseColor.l - L_DARK_SHIFT)),
      c: Math.min(0.4, baseChromaCompensated * C_DARK_BOOST),
    };

    const lightBase = {
      ...baseColor,
      l: Math.max(0, Math.min(1, baseColor.l + L_LIGHT_SHIFT)),
      c: Math.max(0, baseChromaCompensated * C_LIGHT_REDUCE),
    };

    const createColorVariant = (hue, baseLightness, baseChroma) => {
      const adjustedHue = (baseColor.h + hue + 360) % 360;
      const chromaCompensation = getChromaCompensation(adjustedHue);
      const compensatedChroma = baseChroma * chromaCompensation;

      return {
        base: {
          ...baseColor,
          h: adjustedHue,
          l: baseLightness,
          c: compensatedChroma,
        },
        dark: {
          ...baseColor,
          h: adjustedHue,
          l: Math.max(0, Math.min(1, baseLightness - L_DARK_SHIFT)),
          c: Math.min(0.4, compensatedChroma * C_DARK_BOOST),
        },
        light: {
          ...baseColor,
          h: adjustedHue,
          l: Math.max(0, Math.min(1, baseLightness + L_LIGHT_SHIFT)),
          c: Math.max(0, compensatedChroma * C_LIGHT_REDUCE),
        },
      };
    };

    const a1 = createColorVariant(
      analogOptions.analogousAngle1,
      baseColor.l,
      baseChromaCompensated
    );
    const a2 = createColorVariant(
      analogOptions.analogousAngle2,
      baseColor.l,
      baseChromaCompensated
    );

    return [
      { name: "A2-D", value: a2.dark },
      { name: "A2", value: a2.base },
      { name: "A2-L", value: a2.light },
      { name: "A1-D", value: a1.dark },
      { name: "A1", value: a1.base },
      { name: "A1-L", value: a1.light },
      { name: "Base-D", value: darkBase },
      { name: "Base", value: baseColor },
      { name: "Base-L", value: lightBase },
    ];
  } else if (analogPalType === "classicRightAnalog") {
    const L_DARK_SHIFT = 0.25;
    const L_LIGHT_SHIFT = 0.25;
    const C_DARK_BOOST = 1.15;
    const C_LIGHT_REDUCE = 0.85;

    const baseColor = oklch;
    const baseChromaCompensated =
      baseColor.c * getChromaCompensation(baseColor.h);

    const darkBase = {
      ...baseColor,
      l: Math.max(0, Math.min(1, baseColor.l - L_DARK_SHIFT)),
      c: Math.min(0.4, baseChromaCompensated * C_DARK_BOOST),
    };

    const lightBase = {
      ...baseColor,
      l: Math.max(0, Math.min(1, baseColor.l + L_LIGHT_SHIFT)),
      c: Math.max(0, baseChromaCompensated * C_LIGHT_REDUCE),
    };

    const createColorVariant = (hue, baseLightness, baseChroma) => {
      const adjustedHue = (baseColor.h + hue + 360) % 360;
      const chromaCompensation = getChromaCompensation(adjustedHue);
      const compensatedChroma = baseChroma * chromaCompensation;

      return {
        base: {
          ...baseColor,
          h: adjustedHue,
          l: baseLightness,
          c: compensatedChroma,
        },
        dark: {
          ...baseColor,
          h: adjustedHue,
          l: Math.max(0, Math.min(1, baseLightness - L_DARK_SHIFT)),
          c: Math.min(0.4, compensatedChroma * C_DARK_BOOST),
        },
        light: {
          ...baseColor,
          h: adjustedHue,
          l: Math.max(0, Math.min(1, baseLightness + L_LIGHT_SHIFT)),
          c: Math.max(0, compensatedChroma * C_LIGHT_REDUCE),
        },
      };
    };

    const a1 = createColorVariant(
      analogOptions.analogousAngle1,
      baseColor.l,
      baseChromaCompensated
    );
    const a2 = createColorVariant(
      analogOptions.analogousAngle2,
      baseColor.l,
      baseChromaCompensated
    );

    return [
      { name: "Base-D", value: darkBase },
      { name: "Base", value: baseColor },
      { name: "Base-L", value: lightBase },
      { name: "A1-D", value: a1.dark },
      { name: "A1", value: a1.base },
      { name: "A1-L", value: a1.light },
      { name: "A2-D", value: a2.dark },
      { name: "A2", value: a2.base },
      { name: "A2-L", value: a2.light },
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
    const LMAX = 0.96;
    const LMIN = 0.18;
    const CMAX = 0.08;
    const CMIN = 0.02;
    const L_DARK_SHIFT = 0.22;
    const L_LIGHT_SHIFT = 0.35;
    const C_DARK_BOOST = 1.15;
    const C_LIGHT_REDUCE = 0.85;

    const baseColor = {
      ...oklch,
      l: Math.min(LMAX, Math.max(LMIN, 0.57 + sliderLightValue)),
      c: Math.min(CMAX, Math.max(CMIN, 0.05 + sliderChromaValue)),
    };

    const darkBase = {
      ...baseColor,
      l: Math.max(LMIN, Math.min(LMAX, baseColor.l - L_DARK_SHIFT)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * C_DARK_BOOST)),
    };

    const lightBase = {
      ...baseColor,
      l: Math.max(LMIN, Math.min(LMAX, baseColor.l + L_LIGHT_SHIFT)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * C_LIGHT_REDUCE)),
    };

    const createNeutralVariant = (hue, baseLightness, baseChroma) => ({
      base: {
        ...baseColor,
        h: (baseColor.h + hue + 360) % 360,
        l: baseLightness,
        c: Math.min(CMAX, Math.max(CMIN, baseChroma * 0.95)),
      },
      dark: {
        ...baseColor,
        h: (baseColor.h + hue + 360) % 360,
        l: Math.max(LMIN, Math.min(LMAX, baseLightness - L_DARK_SHIFT)),
        c: Math.min(CMAX, Math.max(CMIN, baseChroma * 0.95 * C_DARK_BOOST)),
      },
      light: {
        ...baseColor,
        h: (baseColor.h + hue + 360) % 360,
        l: Math.max(LMIN, Math.min(LMAX, baseLightness + L_LIGHT_SHIFT)),
        c: Math.min(CMAX, Math.max(CMIN, baseChroma * 0.95 * C_LIGHT_REDUCE)),
      },
    });

    const a1 = createNeutralVariant(
      analogOptions.analogousAngle1,
      baseColor.l,
      baseColor.c
    );
    const a2 = createNeutralVariant(
      analogOptions.analogousAngle2,
      baseColor.l,
      baseColor.c
    );

    return [
      { name: "A1-D", value: a1.dark },
      { name: "A1", value: a1.base },
      { name: "A1-L", value: a1.light },
      { name: "Base-D", value: darkBase },
      { name: "Base", value: baseColor },
      { name: "Base-L", value: lightBase },
      { name: "A2-D", value: a2.dark },
      { name: "A2", value: a2.base },
      { name: "A2-L", value: a2.light },
    ];
  } else if (analogPalType === "neutralLeftAnalog") {
    const LMAX = 0.96;
    const LMIN = 0.18;
    const CMAX = 0.08;
    const CMIN = 0.02;
    const L_DARK_SHIFT = 0.22;
    const L_LIGHT_SHIFT = 0.35;
    const C_DARK_BOOST = 1.15;
    const C_LIGHT_REDUCE = 0.85;

    const baseColor = {
      ...oklch,
      l: Math.min(LMAX, Math.max(LMIN, 0.57 + sliderLightValue)),
      c: Math.min(CMAX, Math.max(CMIN, 0.05 + sliderChromaValue)),
    };

    const darkBase = {
      ...baseColor,
      l: Math.max(LMIN, Math.min(LMAX, baseColor.l - L_DARK_SHIFT)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * C_DARK_BOOST)),
    };

    const lightBase = {
      ...baseColor,
      l: Math.max(LMIN, Math.min(LMAX, baseColor.l + L_LIGHT_SHIFT)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * C_LIGHT_REDUCE)),
    };

    const createNeutralVariant = (hue, baseLightness, baseChroma) => ({
      base: {
        ...baseColor,
        h: (baseColor.h + hue + 360) % 360,
        l: baseLightness,
        c: Math.min(CMAX, Math.max(CMIN, baseChroma * 0.95)),
      },
      dark: {
        ...baseColor,
        h: (baseColor.h + hue + 360) % 360,
        l: Math.max(LMIN, Math.min(LMAX, baseLightness - L_DARK_SHIFT)),
        c: Math.min(CMAX, Math.max(CMIN, baseChroma * 0.95 * C_DARK_BOOST)),
      },
      light: {
        ...baseColor,
        h: (baseColor.h + hue + 360) % 360,
        l: Math.max(LMIN, Math.min(LMAX, baseLightness + L_LIGHT_SHIFT)),
        c: Math.min(CMAX, Math.max(CMIN, baseChroma * 0.95 * C_LIGHT_REDUCE)),
      },
    });

    const a1 = createNeutralVariant(
      analogOptions.analogousAngle1,
      baseColor.l,
      baseColor.c
    );
    const a2 = createNeutralVariant(
      analogOptions.analogousAngle1 * 2,
      baseColor.l,
      baseColor.c
    );

    return [
      { name: "A2-D", value: a2.dark },
      { name: "A2", value: a2.base },
      { name: "A2-L", value: a2.light },
      { name: "A1-D", value: a1.dark },
      { name: "A1", value: a1.base },
      { name: "A1-L", value: a1.light },
      { name: "Base-D", value: darkBase },
      { name: "Base", value: baseColor },
      { name: "Base-L", value: lightBase },
    ];
  } else if (analogPalType === "neutralRightAnalog") {
    const LMAX = 0.96;
    const LMIN = 0.18;
    const CMAX = 0.08;
    const CMIN = 0.02;
    const L_DARK_SHIFT = 0.22;
    const L_LIGHT_SHIFT = 0.35;
    const C_DARK_BOOST = 1.15;
    const C_LIGHT_REDUCE = 0.85;

    const baseColor = {
      ...oklch,
      l: Math.min(LMAX, Math.max(LMIN, 0.57 + sliderLightValue)),
      c: Math.min(CMAX, Math.max(CMIN, 0.05 + sliderChromaValue)),
    };

    const darkBase = {
      ...baseColor,
      l: Math.max(LMIN, Math.min(LMAX, baseColor.l - L_DARK_SHIFT)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * C_DARK_BOOST)),
    };

    const lightBase = {
      ...baseColor,
      l: Math.max(LMIN, Math.min(LMAX, baseColor.l + L_LIGHT_SHIFT)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * C_LIGHT_REDUCE)),
    };

    const createNeutralVariant = (hue, baseLightness, baseChroma) => ({
      base: {
        ...baseColor,
        h: (baseColor.h + hue + 360) % 360,
        l: baseLightness,
        c: Math.min(CMAX, Math.max(CMIN, baseChroma * 0.95)),
      },
      dark: {
        ...baseColor,
        h: (baseColor.h + hue + 360) % 360,
        l: Math.max(LMIN, Math.min(LMAX, baseLightness - L_DARK_SHIFT)),
        c: Math.min(CMAX, Math.max(CMIN, baseChroma * 0.95 * C_DARK_BOOST)),
      },
      light: {
        ...baseColor,
        h: (baseColor.h + hue + 360) % 360,
        l: Math.max(LMIN, Math.min(LMAX, baseLightness + L_LIGHT_SHIFT)),
        c: Math.min(CMAX, Math.max(CMIN, baseChroma * 0.95 * C_LIGHT_REDUCE)),
      },
    });

    const a1 = createNeutralVariant(
      analogOptions.analogousAngle2,
      baseColor.l,
      baseColor.c
    );
    const a2 = createNeutralVariant(
      analogOptions.analogousAngle2 * 2,
      baseColor.l,
      baseColor.c
    );

    return [
      { name: "Base-D", value: darkBase },
      { name: "Base", value: baseColor },
      { name: "Base-L", value: lightBase },
      { name: "A1-D", value: a1.dark },
      { name: "A1", value: a1.base },
      { name: "A1-L", value: a1.light },
      { name: "A2-D", value: a2.dark },
      { name: "A2", value: a2.base },
      { name: "A2-L", value: a2.light },
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
  }
}

export default function monochromaticPalGen(
  oklch,
  vintagePalType = null,
  neutralPalType = null,
  kidsPalType = null
) {
  let darkerNeutralBase,
    mutedDarkerBase,
    darkestBase,
    darkerBase,
    darkBase,
    baseColor,
    lightBase,
    lighterBase,
    lightestBase,
    lighterNeutralBase,
    mutedLighterBase;

  if (
    vintagePalType === null &&
    neutralPalType === null &&
    kidsPalType === null
  ) {
    baseColor = oklch;

    darkBase = {
      ...baseColor,
      l: Math.min(1, Math.max(0, baseColor.l * 0.85)), // 15% darker
    };

    darkerBase = {
      ...baseColor,
      l: Math.min(1, Math.max(0, baseColor.l * 0.8)), // 20% darker
    };

    darkestBase = {
      ...baseColor,
      l: Math.min(1, Math.max(0, baseColor.l * 0.75)), // 25% darker
    };

    darkerNeutralBase = {
      ...darkestBase,
      c: Math.min(0.08, Math.max(0, darkestBase.c * 0.5)),
    };

    mutedDarkerBase = {
      ...darkestBase,
      l: Math.min(1, Math.max(0, darkestBase.l * 0.8)), // 20% darker, clamped
      c: Math.min(0.08, Math.max(0, darkestBase.c * 0.5)), // chroma clamped
    };

    lightBase = {
      ...baseColor,
      l: Math.min(1, Math.max(0, baseColor.l * 1.15)), // 15% lighter
    };

    lighterBase = {
      ...baseColor,
      l: Math.min(1, Math.max(0, baseColor.l * 1.2)), // 20% lighter
    };

    lightestBase = {
      ...baseColor,
      l: Math.min(1, Math.max(0, baseColor.l * 1.25)), // 25% lighter
    };

    lighterNeutralBase = {
      ...lightestBase,
      l: Math.min(1, Math.max(0, lightestBase.l * 1.1)), // 10% lighter (scaled), clamped
      c: Math.min(0.08, Math.max(0, lightestBase.c * 0.5)), // chroma clamped
    };

    mutedLighterBase = {
      ...lightBase,
      l: Math.min(1, Math.max(0, lightBase.l * 1.1)), // 10% lighter, clamped
      c: Math.min(0.12, Math.max(0, lightBase.c * 0.6)), // chroma clamped
    };
  } else if (vintagePalType === "vintageMono") {
    const VINTAGE_HUE_SHIFT = 15; // Warm yellow-red bias
    const VINTAGE_CHROMA_FACTOR = 0.5; // Global desaturation factor
    const VINTAGE_CHROMA_MAX = 0.2; // Maximum allowed chroma for vintage tone
    const L_MIN = 0.3; // Conservative minimum lightness
    const L_MAX = 0.9; // Conservative maximum lightness

    // --- 1. Base Color (Vintage-Tuned) ---
    // *CORRECTION: Calculate base chroma using the VINTAGE_CHROMA_FACTOR*
    const vintageChromaBase = Math.min(
      VINTAGE_CHROMA_MAX,
      Math.max(0.02, oklch.c * VINTAGE_CHROMA_FACTOR) // Apply global desaturation here
    );

    baseColor = {
      ...oklch,
      l: Math.min(L_MAX, Math.max(L_MIN, oklch.l)), // Consistent L clamp
      c: vintageChromaBase, // Corrected base chroma
      h: (oklch.h + VINTAGE_HUE_SHIFT) % 360, // Warm hue shift
    };

    // --- 2. Darker Variants (Use baseColor.c as a reference) ---
    darkBase = {
      ...baseColor,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 0.85)), // Consistent L clamp
      // Darker: slightly more saturated than the base (x 1.1)
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, baseColor.c * 1.1)),
    };

    darkerBase = {
      ...baseColor,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 0.8)), // Consistent L clamp
      // Darker: slight increase in saturation (x 1.2)
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, baseColor.c * 1.2)),
    };

    darkestBase = {
      ...baseColor,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 0.75)), // Consistent L clamp
      // Darkest: Highest saturation in the dark tones (x 1.3)
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, baseColor.c * 1.3)),
    };

    // Slightly neutralized darker tone (aged, less vibrant)
    darkerNeutralBase = {
      ...darkestBase,
      // Deeper saturation reduction for a highly faded/near-neutral look
      c: Math.min(VINTAGE_CHROMA_MAX * 0.4, Math.max(0, darkestBase.c * 0.3)),
    };

    // Muted deep variant — sepia-like and soft
    mutedDarkerBase = {
      ...darkestBase,
      l: Math.min(L_MAX, Math.max(L_MIN, darkestBase.l * 0.8)), // deeper L
      // Highly desaturated, near-neutral
      c: Math.min(VINTAGE_CHROMA_MAX * 0.4, Math.max(0, darkestBase.c * 0.2)),
    };

    // --- 3. Lighter Variants (Use baseColor.c as a reference) ---
    lightBase = {
      ...baseColor,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 1.15)), // Consistent L clamp
      // Lighter: slight desaturation (x 0.9)
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, baseColor.c * 0.9)),
    };

    lighterBase = {
      ...baseColor,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 1.2)), // Consistent L clamp
      // Lighter: stronger desaturation (x 0.7)
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, baseColor.c * 0.7)),
    };

    lightestBase = {
      ...baseColor,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 1.25)), // Consistent L clamp
      // Lightest: highest desaturation (x 0.5) to simulate fading/washout
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, baseColor.c * 0.5)),
    };

    // Softly neutralized light tone (aged paper tone)
    lighterNeutralBase = {
      ...lightestBase,
      l: Math.min(L_MAX, Math.max(L_MIN, lightestBase.l * 1.1)), // slight boost in L
      // Very highly desaturated (near neutral)
      c: Math.min(VINTAGE_CHROMA_MAX * 0.4, Math.max(0, lightestBase.c * 0.2)),
    };

    // Gentle faded highlight tone (vintage pastel)
    mutedLighterBase = {
      ...lightBase,
      l: Math.min(L_MAX, Math.max(L_MIN, lightBase.l * 1.1)), // gentle lift
      // Moderate desaturation
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, lightBase.c * 0.6)),
    };
  } else if (neutralPalType === "neutralMono") {
    const NEUTRAL_CHROMA_MAX = 0.08; // Strict max chroma limit for near-gray/beige tones
    const CHROMA_DEGRADATION = 0.3; // Aggressive factor to push input chroma toward neutrality
    const L_MIN = 0.3; // Min Lightness for soft shadows (Atmospheric Neutral)
    const L_MAX = 0.9; // Max Lightness for soft highlights (Atmospheric Neutral)

    // --- CRITICAL STEP: Calculate the severely desaturated Chroma for the entire palette ---
    const neutralChromaBase = Math.min(
      NEUTRAL_CHROMA_MAX,
      Math.max(0.01, oklch.c * CHROMA_DEGRADATION) // Apply aggressive degradation
    );

    // --- 1. Base Color (Neutral-Tuned Monochromatic) ---
    baseColor = {
      ...oklch,
      l: Math.min(L_MAX, Math.max(L_MIN, oklch.l)), // Consistent L clamp
      c: neutralChromaBase, // Severely desaturated chroma
      h: oklch.h, // RETAIN ORIGINAL HUE (Monochromatic, subtle undertone)
    };

    // --- 2. Darker Variants (All share the same base HUE) ---
    darkBase = {
      ...baseColor,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 0.85)),
      // Darker: slight Chroma increase (x 1.1) capped at 0.08 max
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, baseColor.c * 1.1)),
    };

    darkerBase = {
      ...baseColor,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 0.8)),
      // Darker: slight Chroma increase (x 1.2) capped at 0.08 max
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, baseColor.c * 1.2)),
    };

    darkestBase = {
      ...baseColor,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 0.75)),
      // Darkest: Highest Chroma in the dark tones (x 1.3) capped at 0.08 max
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, baseColor.c * 1.3)),
    };

    // Strictly Neutralized darker tone (used for near-perfect neutral contrast)
    darkerNeutralBase = {
      ...darkestBase,
      // Extremely low Chroma for a true near-gray
      c: Math.min(NEUTRAL_CHROMA_MAX * 0.4, Math.max(0, darkestBase.c * 0.3)),
    };

    // Muted deep variant — soft shadow tone
    mutedDarkerBase = {
      ...darkestBase,
      l: Math.min(L_MAX, Math.max(L_MIN, darkestBase.l * 0.8)),
      // Very highly desaturated, near-neutral
      c: Math.min(NEUTRAL_CHROMA_MAX * 0.4, Math.max(0, darkestBase.c * 0.2)),
    };

    // --- 3. Lighter Variants (All share the same base HUE) ---
    lightBase = {
      ...baseColor,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 1.15)),
      // Lighter: slight desaturation (x 0.9) capped at 0.08 max
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, baseColor.c * 0.9)),
    };

    lighterBase = {
      ...baseColor,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 1.2)),
      // Lighter: stronger desaturation (x 0.7) capped at 0.08 max
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, baseColor.c * 0.7)),
    };

    lightestBase = {
      ...baseColor,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 1.25)),
      // Lightest: highest desaturation (x 0.5) capped at 0.08 max
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, baseColor.c * 0.5)),
    };

    // Softly neutralized light tone (used for near-white backgrounds)
    lighterNeutralBase = {
      ...lightestBase,
      l: Math.min(L_MAX, Math.max(L_MIN, lightestBase.l * 1.1)),
      // Very highly desaturated (near neutral)
      c: Math.min(NEUTRAL_CHROMA_MAX * 0.4, Math.max(0, lightestBase.c * 0.2)),
    };

    // Gentle faded highlight tone (softest contrast)
    mutedLighterBase = {
      ...lightBase,
      l: Math.min(L_MAX, Math.max(L_MIN, lightBase.l * 1.1)),
      // Moderate desaturation
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, lightBase.c * 0.6)),
    };
  } else if (kidsPalType === "kidsMono") {
    const SLIDER_STEP = 0.01;
    const MAX_DELTA = 0.05;

    // Example slider ticks
    const lightnessTicks = 3; // +0.03
    const chromaTicks = -2; // -0.02

    // Strict kid-friendly constraints
    const CF_MIN_L = 0.75;
    const CF_MAX_L = 0.95;
    const CF_MIN_C = 0.25;
    const CF_MAX_C = 0.32;

    // Base ideal target
    const CF_IDEAL_L = 0.85;
    const CF_IDEAL_C = 0.285;

    // Convert ticks → deltas (clamped)
    const lightnessDelta = Math.min(
      MAX_DELTA,
      Math.max(-MAX_DELTA, lightnessTicks * SLIDER_STEP)
    );
    const chromaDelta = Math.min(
      MAX_DELTA,
      Math.max(-MAX_DELTA, chromaTicks * SLIDER_STEP)
    );

    // --- Define palette steps as *absolute offsets* from center ---
    const stepOffsets = [
      { name: "Base-DDDD", lOffset: -0.12, cOffset: +0.02 },
      { name: "Base-DDD", lOffset: -0.08, cOffset: +0.01 },
      { name: "Base-DD", lOffset: -0.04, cOffset: +0.0 },
      { name: "Base-D", lOffset: -0.02, cOffset: -0.01 },
      { name: "Base", lOffset: 0.0, cOffset: 0.0 },
      { name: "Base-L", lOffset: +0.02, cOffset: -0.01 },
      { name: "Base-LL", lOffset: +0.04, cOffset: -0.02 },
      { name: "Base-LLL", lOffset: +0.08, cOffset: -0.03 },
      { name: "Base-LLLL", lOffset: +0.12, cOffset: -0.04 },
    ];

    // Generate palette
    const palette = stepOffsets.map((step) => {
      const l = Math.min(
        CF_MAX_L,
        Math.max(CF_MIN_L, CF_IDEAL_L + lightnessDelta + step.lOffset)
      );
      const c = Math.min(
        CF_MAX_C,
        Math.max(CF_MIN_C, CF_IDEAL_C + chromaDelta + step.cOffset)
      );
      return { name: step.name, value: { h: oklch.h, l, c } };
    });

    console.log(palette);
    return palette;
  }

  return [
    { name: "Base-DN", value: darkerNeutralBase },
    { name: "Base-MD", value: mutedDarkerBase },
    { name: "Base-DDD", value: darkestBase },
    { name: "Base-DD", value: darkerBase },
    { name: "Base-D", value: darkBase },
    { name: "Base", value: baseColor },
    { name: "Base-L", value: lightBase },
    { name: "Base-LL", value: lighterBase },
    { name: "Base-LLL", value: lightestBase },
    { name: "Base-LN", value: lighterNeutralBase },
    { name: "Base-ML", value: mutedLighterBase },
  ];
}

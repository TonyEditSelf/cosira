export default function splitCompPalGen(
  oklch,
  splitCompOptions,
  vintagePalType = null,
  neutralPalType = null,
  kidsPalType = null
) {
  let darkBase,
    baseColor,
    lightBase,
    compColor,
    darkNeuSplitComp1,
    darkSplitComp1,
    splitComp1,
    lightSplitComp1,
    darkNeuSplitComp2,
    darkSplitComp2,
    splitComp2,
    lightSplitComp2;

  if (
    vintagePalType === null &&
    neutralPalType === null &&
    kidsPalType === null
  ) {
    baseColor = oklch;

    darkBase = {
      ...baseColor,
      l: Math.min(1, Math.max(0, baseColor.l * 0.85)),
    };
    lightBase = {
      ...baseColor,
      l: Math.min(1, Math.max(0, baseColor.l * 1.15)),
    };

    compColor = { ...baseColor, h: (baseColor.h + 180) % 360 };

    splitComp1 = {
      ...compColor,
      h: (compColor.h + splitCompOptions.splitCompAngle1 + 360) % 360,
    };
    darkSplitComp1 = {
      ...splitComp1,
      l: Math.min(1, Math.max(0, splitComp1.l * 0.85)),
    };

    lightSplitComp1 = {
      ...splitComp1,
      l: Math.min(1, Math.max(0, splitComp1.l * 1.15)),
    };

    darkNeuSplitComp1 = {
      ...darkSplitComp1,
      c: Math.min(0.08, Math.max(0, darkSplitComp1.c * 0.5)),
    };

    splitComp2 = {
      ...compColor,
      h: (compColor.h + splitCompOptions.splitCompAngle2) % 360,
    };

    darkSplitComp2 = {
      ...splitComp2,
      l: Math.min(1, Math.max(0, splitComp2.l * 0.85)),
    };

    lightSplitComp2 = {
      ...splitComp2,
      l: Math.min(1, Math.max(0, splitComp2.l * 1.15)),
    };

    darkNeuSplitComp2 = {
      ...darkSplitComp2,
      c: Math.min(0.08, Math.max(0, darkSplitComp2.c * 0.5)),
    };
  } else if (vintagePalType === "vintageSplitComp") {
    const VINTAGE_HUE_SHIFT = 15; // Warm hue bias (yellow/red)
    const VINTAGE_CHROMA_FACTOR = 0.5; // Global desaturation factor
    const VINTAGE_CHROMA_MAX = 0.2; // Maximum allowed chroma for soft tones
    const L_MIN = 0.3; // Conservative minimum lightness
    const L_MAX = 0.9; // Conservative maximum lightness

    // --- 1. Base Color (apply warm hue shift & corrected desaturation) ---
    // *CRITICAL CORRECTION: Calculate base chroma using the VINTAGE_CHROMA_FACTOR*
    const vintageChromaBase = Math.min(
      VINTAGE_CHROMA_MAX,
      Math.max(0.02, oklch.c * VINTAGE_CHROMA_FACTOR) // Apply global desaturation to the original chroma
    );

    baseColor = {
      ...oklch,
      l: Math.min(L_MAX, Math.max(L_MIN, oklch.l)), // Consistent L clamp
      c: vintageChromaBase, // Corrected base chroma
      h: (oklch.h + VINTAGE_HUE_SHIFT) % 360, // Apply vintage warmth
    };

    // --- 2. Dark & Light Variants of Base (Use baseColor.c as a reference) ---
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

    // --- 3. Complementary Color (Vintage Hues: H + 180 degrees) ---
    // Note: Inherits the corrected L and C from baseColor
    compColor = {
      ...baseColor,
      h: (baseColor.h + 180) % 360,
    };

    // --- 4. Split Complementary 1 (angle 1 shift) ---
    splitComp1 = {
      ...compColor,
      // Shift H from the complementary point
      h: (compColor.h + splitCompOptions.splitCompAngle1 + 360) % 360,
    };

    // Dark variant (Apply proportional L/C changes)
    darkSplitComp1 = {
      ...splitComp1,
      l: Math.min(L_MAX, Math.max(L_MIN, splitComp1.l * 0.85)), // Consistent L clamp
      c: Math.min(
        VINTAGE_CHROMA_MAX,
        Math.max(0.02, splitComp1.c * 1.1) // Darker: more saturation
      ),
    };

    // Light variant (Apply proportional L/C changes)
    lightSplitComp1 = {
      ...splitComp1,
      l: Math.min(L_MAX, Math.max(L_MIN, splitComp1.l * 1.15)), // Consistent L clamp
      c: Math.min(
        VINTAGE_CHROMA_MAX,
        Math.max(0.02, splitComp1.c * 0.8) // Lighter: less saturation
      ),
    };

    // Desaturated (“neutralized”) dark variant
    darkNeuSplitComp1 = {
      ...darkSplitComp1,
      // Strong desaturation for near-neutral background/text color
      c: Math.min(
        VINTAGE_CHROMA_MAX * 0.4,
        Math.max(0.0, darkSplitComp1.c * 0.5)
      ),
    };

    // --- 5. Split Complementary 2 (angle 2 shift) ---
    splitComp2 = {
      ...compColor,
      // Shift H from the complementary point
      h: (compColor.h + splitCompOptions.splitCompAngle2 + 360) % 360,
    };

    // Dark variant (Apply proportional L/C changes)
    darkSplitComp2 = {
      ...splitComp2,
      l: Math.min(L_MAX, Math.max(L_MIN, splitComp2.l * 0.85)), // Consistent L clamp
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, splitComp2.c * 1.1)),
    };

    // Light variant (Apply proportional L/C changes)
    lightSplitComp2 = {
      ...splitComp2,
      l: Math.min(L_MAX, Math.max(L_MIN, splitComp2.l * 1.15)), // Consistent L clamp
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, splitComp2.c * 0.8)),
    };

    // Desaturated (“neutralized”) dark variant
    darkNeuSplitComp2 = {
      ...darkSplitComp2,
      c: Math.min(
        VINTAGE_CHROMA_MAX * 0.4,
        Math.max(0.0, darkSplitComp2.c * 0.5)
      ),
    };
  } else if (neutralPalType === "neutralSplitComp") {
    console.log("hi this is neutral split comp");
    const NEUTRAL_CHROMA_MAX = 0.08; // Strict max chroma limit for near-gray/beige tones
    const CHROMA_DEGRADATION = 0.4; // Factor to push input chroma to neutral range
    const L_MIN = 0.3; // Consistent minimum lightness clamp (for soft shadow)
    const L_MAX = 0.9; // Consistent maximum lightness clamp (for soft highlight)

    // --- CRITICAL STEP: Calculate the severely desaturated Chroma for the entire palette ---
    const neutralChromaBase = Math.min(
      NEUTRAL_CHROMA_MAX,
      Math.max(0.01, oklch.c * CHROMA_DEGRADATION) // Apply degradation to original chroma
    );

    // --- 1. Base Color (Neutral-Tuned) ---
    baseColor = {
      ...oklch,
      l: Math.min(L_MAX, Math.max(L_MIN, oklch.l)), // Consistent L clamp (soft range)
      c: neutralChromaBase, // Corrected, severely desaturated chroma
      h: oklch.h, // RETAIN ORIGINAL HUE (provides subtle warm/cool undertone)
    };

    // --- 2. Dark & Light Variants of Base (Use baseColor.c as a reference) ---
    darkBase = {
      ...baseColor,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 0.85)),
      // Darker: retains slightly more saturation (x 1.1) for better depth
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, baseColor.c * 1.1)),
    };

    lightBase = {
      ...baseColor,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 1.15)),
      // Lighter: stronger desaturation (x 0.8) for a washed-out, soft look
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, baseColor.c * 0.8)),
    };

    // --- 3. Complementary Base (Inherits Neutral L and C, opposite H) ---
    // This is the theoretical complementary point from which the splits are derived.
    compColor = {
      ...baseColor,
      h: (baseColor.h + 180) % 360,
    };

    // --- 4. Split Complementary 1 (angle 1 shift) ---
    splitComp1 = {
      ...compColor,
      // Shift H from the complementary point
      h: (compColor.h + splitCompOptions.splitCompAngle1 + 360) % 360,
    };

    // Dark variant (Neutral-Tuned)
    darkSplitComp1 = {
      ...splitComp1,
      l: Math.min(L_MAX, Math.max(L_MIN, splitComp1.l * 0.85)),
      c: Math.min(
        NEUTRAL_CHROMA_MAX,
        Math.max(0.01, splitComp1.c * 1.1) // Darker: more saturation
      ),
    };

    // Light variant (Neutral-Tuned)
    lightSplitComp1 = {
      ...splitComp1,
      l: Math.min(L_MAX, Math.max(L_MIN, splitComp1.l * 1.15)),
      c: Math.min(
        NEUTRAL_CHROMA_MAX,
        Math.max(0.01, splitComp1.c * 0.8) // Lighter: less saturation
      ),
    };

    // Desaturated (“neutralized”) dark variant (Even closer to gray)
    darkNeuSplitComp1 = {
      ...darkSplitComp1,
      c: Math.min(
        NEUTRAL_CHROMA_MAX * 0.4,
        Math.max(0.0, darkSplitComp1.c * 0.5) // Crush chroma further
      ),
    };

    // --- 5. Split Complementary 2 (angle 2 shift) ---
    splitComp2 = {
      ...compColor,
      // Shift H from the complementary point
      h: (compColor.h + splitCompOptions.splitCompAngle2 + 360) % 360,
    };

    // Dark variant (Neutral-Tuned)
    darkSplitComp2 = {
      ...splitComp2,
      l: Math.min(L_MAX, Math.max(L_MIN, splitComp2.l * 0.85)),
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, splitComp2.c * 1.1)),
    };

    // Light variant (Neutral-Tuned)
    lightSplitComp2 = {
      ...splitComp2,
      l: Math.min(L_MAX, Math.max(L_MIN, splitComp2.l * 1.15)),
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, splitComp2.c * 0.8)),
    };

    // Desaturated (“neutralized”) dark variant (Even closer to gray)
    darkNeuSplitComp2 = {
      ...darkSplitComp2,
      c: Math.min(
        NEUTRAL_CHROMA_MAX * 0.4,
        Math.max(0.0, darkSplitComp2.c * 0.5)
      ),
    };
  } else if (kidsPalType === "kidsSplitComp") {
    /**
     * Utility function to clamp Oklch values into a generic safe range.
     */
    const clampOklch = (l, c, h) => ({
      l: Math.min(1, Math.max(0.2, l)),
      c: Math.min(0.37, Math.max(0, c)),
      h: ((h % 360) + 360) % 360,
    });

    // --- 1. STRICT SAFETY CONSTANTS (Guarding the kids-friendly range) ---
    const L_MIN_SAFE = 0.75; // All output colors must be lighter than this (no moody darks)
    const L_MAX_SAFE = 0.97; // Prevents washing out to pure white (L=1.0)
    const C_MAX_SAFE = 0.3; // Maximum allowed saturation (no aggressive/electric colors)
    const C_MIN_CHEERFUL = 0.25; // Minimum allowed saturation for cheerfulness

    // Internal steps for distinction
    const L_BASE_MIN = 0.82; // Ensures L separation from Dark (0.75)
    const L_STEP_DARK_SUBTRACT = 0.03; // Fixed subtraction step for Dark (L-D)
    const HUE_ACCENT_SHIFT = 10; // Hue shift for LL variants (Accents)

    // Adaptive Lightness Steps (based on percentage of remaining range to L_MAX_SAFE)
    const L_LIGHT_STEP_RATIO = 0.4; // 40% of the remaining range for 'L' variants (Base -> L)
    const L_LIGHTEST_STEP_RATIO = 0.8; // 80% of the remaining range for 'LL' variants (Base -> LL)

    // Get the input Oklch value from the slider/input
    const inputL = oklch && typeof oklch.l === "number" ? oklch.l : 0.85;
    const inputC = oklch && typeof oklch.c === "number" ? oklch.c : 0.25;
    const inputH =
      oklch && typeof oklch.h === "number" ? ((oklch.h % 360) + 360) % 360 : 0;

    // Retrieve split angle options from the environment (defaulting to 30 degrees)
    const options =
      typeof splitCompOptions !== "undefined" ? splitCompOptions : {};
    const splitCompAngle1 =
      typeof options.splitCompAngle1 === "number"
        ? options.splitCompAngle1
        : 30;
    const splitCompAngle2 =
      typeof options.splitCompAngle2 === "number"
        ? options.splitCompAngle2
        : -30;

    // --- 2. Dynamic Chroma Structure (Relational Steps) ---

    // Define Base Chroma: Dynamically derived from inputC, clamped between C_MIN_CHEERFUL (0.25) and C_MAX_SAFE (0.30).
    const BASE_C = Math.min(C_MAX_SAFE, Math.max(C_MIN_CHEERFUL, inputC));

    // Define Dark Chroma: Set equal to BASE_C for a soft, creamy deep step.
    const DARK_C = BASE_C;

    // Define Light Chroma: Uses a slight step up from BASE_C, clamped to C_MAX_SAFE.
    const LIGHT_C_MID = Math.min(C_MAX_SAFE, BASE_C + 0.02);

    // Define Accent Chroma: Set to the absolute C_MAX_SAFE for maximum vibrancy.
    const LIGHT_C = C_MAX_SAFE;

    // Base color (middle step, uses L_BASE_MIN for L separation)
    const baseColor = {
      l: Math.min(L_MAX_SAFE, Math.max(L_BASE_MIN, inputL)),
      c: BASE_C,
      h: inputH,
    };

    // --- 3. Calculate Complementary and Split Hues ---
    const compColor = { ...baseColor, h: (baseColor.h + 180) % 360 };

    const splitComp1 = {
      ...compColor,
      h: (compColor.h + splitCompOptions.splitCompAngle1) % 360,
      c: BASE_C,
    };

    const splitComp2 = {
      ...compColor,
      h: (compColor.h + splitCompOptions.splitCompAngle2) % 360,
      c: BASE_C,
    };

    // --- 4. Calculate Variants using Adaptive Steps and STRICT Safety Clamps ---

    /**
     * Helper function to calculate adaptive light steps.
     * @param {object} color - The base Oklch color object.
     * @param {number} stepRatio - The ratio (0.0 to 1.0) of the remaining L distance to add.
     * @returns {number} The new adapted Lightness value.
     */
    const getAdaptiveL = (color, stepRatio) => {
      const remainingL = L_MAX_SAFE - color.l;
      const L_STEP_ADD = remainingL * stepRatio;
      // We add the step to the base L, clamped by L_MAX_SAFE (although the ratio protects it)
      return Math.min(L_MAX_SAFE, color.l + L_STEP_ADD);
    };

    // BASE VARIANTS
    const darkBase = {
      ...baseColor,
      // Dark L: Fixed subtraction (0.03), clamped to L_MIN_SAFE (0.75)
      l: Math.min(
        L_MAX_SAFE,
        Math.max(L_MIN_SAFE, baseColor.l - L_STEP_DARK_SUBTRACT)
      ),
      c: DARK_C,
    };

    const lightBase = {
      ...baseColor,
      // Light L: Uses adaptive step based on remaining L range
      l: getAdaptiveL(baseColor, L_LIGHT_STEP_RATIO),
      c: LIGHT_C_MID,
    };

    // SPLIT 1 VARIANTS
    const darkSplitComp1 = {
      ...splitComp1,
      l: Math.min(
        L_MAX_SAFE,
        Math.max(L_MIN_SAFE, splitComp1.l - L_STEP_DARK_SUBTRACT)
      ),
      c: DARK_C,
    };

    const lightSplitComp1 = {
      ...splitComp1,
      // Light L: Uses adaptive step based on remaining L range
      l: getAdaptiveL(splitComp1, L_LIGHT_STEP_RATIO),
      c: LIGHT_C_MID,
    };

    // NEW ACCENT VARIANT (SC1-LL)
    const lightestSplitComp1 = {
      ...splitComp1,
      // Lightest L: Uses aggressive adaptive step to hit L_MAX_SAFE reliably
      l: getAdaptiveL(splitComp1, L_LIGHTEST_STEP_RATIO),
      c: LIGHT_C, // Absolute max chroma (C=0.30)
      h: (splitComp1.h + HUE_ACCENT_SHIFT) % 360,
    };

    // SPLIT 2 VARIANTS
    const darkSplitComp2 = {
      ...splitComp2,
      l: Math.min(
        L_MAX_SAFE,
        Math.max(L_MIN_SAFE, splitComp2.l - L_STEP_DARK_SUBTRACT)
      ),
      c: DARK_C,
    };

    const lightSplitComp2 = {
      ...splitComp2,
      // Light L: Uses adaptive step based on remaining L range
      l: getAdaptiveL(splitComp2, L_LIGHT_STEP_RATIO),
      c: LIGHT_C_MID,
    };

    // NEW ACCENT VARIANT (SC2-LL)
    const lightestSplitComp2 = {
      ...splitComp2,
      // Lightest L: Uses aggressive adaptive step to hit L_MAX_SAFE reliably
      l: getAdaptiveL(splitComp2, L_LIGHTEST_STEP_RATIO),
      c: LIGHT_C, // Absolute max chroma (C=0.30)
      h: (splitComp2.h + HUE_ACCENT_SHIFT) % 360,
    };

    // --- 5. Final Return Structure (11 Colors: 3 Base + 4 SC1 + 4 SC2) ---
    return [
      // BASE HUE (3 colors: D, Base, L)
      { name: "Base-D", value: darkBase },
      { name: "Base", value: baseColor },
      { name: "Base-L", value: lightBase },

      // SPLIT 1 HUE (4 colors: D, Base, L, LL)
      { name: "SC1-D", value: darkSplitComp1 },
      { name: "SC1", value: splitComp1 },
      { name: "SC1-L", value: lightSplitComp1 },
      { name: "SC1-LL", value: lightestSplitComp1 }, // True accent

      // SPLIT 2 HUE (4 colors: D, Base, L, LL)
      { name: "SC2-D", value: darkSplitComp2 },
      { name: "SC2", value: splitComp2 },
      { name: "SC2-L", value: lightSplitComp2 },
      { name: "SC2-LL", value: lightestSplitComp2 }, // True accent
    ];
  }

  return [
    { name: "Base-D", value: darkBase },
    { name: "Base", value: baseColor },
    { name: "Base-L", value: lightBase },
    { name: "SC1-DN", value: darkNeuSplitComp1 },
    { name: "SC1-D", value: darkSplitComp1 },
    { name: "SC1", value: splitComp1 },
    { name: "SC1-L", value: lightSplitComp1 },
    { name: "SC2-DN", value: darkNeuSplitComp2 },
    { name: "SC2-D", value: darkSplitComp2 },
    { name: "SC2", value: splitComp2 },
    { name: "SC2-L", value: lightSplitComp2 },
  ];
}

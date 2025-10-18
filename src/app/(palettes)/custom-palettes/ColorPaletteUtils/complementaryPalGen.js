export default function complementaryPalGen(
  oklch,
  vintagePalType = null,
  neutralPalType = null,
  kidsPalType = null
) {
  if (
    vintagePalType === null &&
    neutralPalType === null &&
    kidsPalType === null
  ) {
    const baseColor = oklch;
    const darkBase = {
      ...baseColor,
      l: Math.min(1, Math.max(0, baseColor.l - 0.15)),
    };

    const darkestBase = {
      ...baseColor,
      l: Math.min(1, Math.max(0, baseColor.l - 0.3)),
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(1, Math.max(0, baseColor.l + 0.1)),
    };

    const lightestBase = {
      ...baseColor,
      l: Math.min(1, Math.max(0, baseColor.l + 0.3)),
    };

    const compColor = { ...oklch, h: (baseColor.h + 180) % 360 };

    const darkComp = {
      ...compColor,
      l: Math.min(1, Math.max(0, compColor.l - 0.15)),
    };

    const darkestComp = {
      ...compColor,
      l: Math.min(1, Math.max(0, compColor.l - 0.3)),
    };

    const lightComp = {
      ...compColor,
      l: Math.min(1, Math.max(0, compColor.l + 0.1)),
    };

    const lightestComp = {
      ...compColor,
      l: Math.min(1, Math.max(0, compColor.l + 0.3)),
    };

    return [
      { name: "Base-DD", value: darkestBase },
      { name: "Base-D", value: darkBase },
      { name: "Base", value: baseColor },
      { name: "Base-L", value: lightBase },
      { name: "Base-LL", value: lightestBase },
      { name: "Comp-LL", value: lightestComp },
      { name: "Comp-L", value: lightComp },
      { name: "Comp", value: compColor },
      { name: "Comp-D", value: darkComp },
      { name: "Comp-DD", value: darkestComp },
    ];
  } else if (vintagePalType === "vintageComp") {
    const VINTAGE_HUE_SHIFT = 15; // Shift hues toward yellow/warm
    const VINTAGE_CHROMA_FACTOR = 0.5; // Overall desaturation (50%)
    const VINTAGE_CHROMA_MAX = 0.2; // Max chroma limit for muted tones
    const L_MIN = 0.3; // Consistent minimum lightness clamp
    const L_MAX = 0.9; // Consistent maximum lightness clamp

    // *CRITICAL STEP: Calculate the desaturated chroma based on the input oklch*
    const vintageChromaBase = Math.min(
      VINTAGE_CHROMA_MAX,
      Math.max(0.02, oklch.c * VINTAGE_CHROMA_FACTOR) // <-- Applies the 0.5 factor to the original chroma
    );

    // --- 1. Base Color (corrected L & C) ---
    const baseColor = {
      ...oklch,
      l: Math.min(L_MAX, Math.max(L_MIN, oklch.l)), // Consistent L clamp
      c: vintageChromaBase, // Corrected, globally desaturated chroma
      h: (oklch.h + VINTAGE_HUE_SHIFT) % 360, // Apply warmth
    };

    // --- 2. Base Color Dark (darker, slightly more saturated) ---
    const baseColorDark = {
      ...baseColor,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 0.8)), // Consistent L clamp
      c: Math.min(
        VINTAGE_CHROMA_MAX,
        Math.max(0.02, baseColor.c * 1.1) // Darker colors are slightly more saturated (1.1 multiplier relative to baseColor.c)
      ),
    };

    // --- 3. Base Color Light (brighter and more faded) ---
    const baseColorLight = {
      ...baseColor,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 1.44)), // Consistent L clamp
      c: Math.min(
        VINTAGE_CHROMA_MAX,
        Math.max(0.02, baseColor.c * 0.5) // Lighter colors are significantly more desaturated (0.5 multiplier relative to baseColor.c)
      ),
    };

    // --- 4. Base Color Muted (balanced lightness, strong desaturation) ---
    const baseColorMuted = {
      ...baseColor,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 1.2)),
      c: Math.min(
        VINTAGE_CHROMA_MAX,
        Math.max(0.02, baseColor.c * 0.3) // Extremely desaturated
      ),
    };

    // --- 5. Base Color Mod Saturated (vintage but with some punch) ---
    const baseColorModSaturated = {
      ...baseColor,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 1.0)),
      c: Math.min(
        VINTAGE_CHROMA_MAX,
        Math.max(0.02, baseColor.c * 1.1) // Same as Dark: uses the max allowed saturation for the vintage feel
      ),
    };

    // --- 6. Complementary Color (shifted 180° from the warmed hue) ---
    const compColor = {
      // *CORRECTION: Use the corrected vintageChromaBase for Complementary too*
      ...oklch,
      l: Math.min(L_MAX, Math.max(L_MIN, oklch.l)),
      c: vintageChromaBase, // Uses the correctly calculated base chroma
      h: (oklch.h + VINTAGE_HUE_SHIFT + 180) % 360, // warm shift + complement
    };

    // --- 7. Complementary Color Dark (deeper and softly desaturated) ---
    const compColorDark = {
      ...compColor,
      l: Math.min(L_MAX, Math.max(L_MIN, compColor.l * 0.78)),
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, compColor.c * 1.1)),
    };

    // --- 8. Complementary Color Light (faded and bright) ---
    const compColorLight = {
      ...compColor,
      l: Math.min(L_MAX, Math.max(L_MIN, compColor.l * 1.44)),
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, compColor.c * 0.5)),
    };

    // --- 9. Complementary Color Muted (soft, sepia-like desaturation) ---
    const compColorMuted = {
      ...compColor,
      l: Math.min(L_MAX, Math.max(L_MIN, compColor.l * 1.2)),
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, compColor.c * 0.3)),
    };

    // --- 10. Complementary Color Mod Saturated (vintage with extra pop) ---
    const compColorModSaturated = {
      ...compColor,
      l: Math.min(L_MAX, Math.max(L_MIN, compColor.l * 1.0)),
      c: Math.min(VINTAGE_CHROMA_MAX, Math.max(0.02, compColor.c * 1.1)),
    };

    return [
      { name: "Base", value: baseColor },
      { name: "Base-D", value: baseColorDark },
      { name: "Base-Mod-S", value: baseColorModSaturated },
      { name: "Base-L", value: baseColorLight },
      { name: "Base-M", value: baseColorMuted },
      { name: "Comp", value: compColor },
      { name: "Comp-D", value: compColorDark },
      { name: "Comp-Mod-S", value: compColorModSaturated },
      { name: "Comp-L", value: compColorLight },
      { name: "Comp-M", value: compColorMuted },
    ];
  } else if (neutralPalType === "neutralComp") {
    const NEUTRAL_CHROMA_MAX = 0.08; // Maximum allowed chroma for neutral tones
    const CHROMA_DEGRADATION = 0.4; // Factor to push input chroma to neutral range
    const L_MIN = 0.3; // Consistent minimum lightness clamp
    const L_MAX = 0.9; // Consistent maximum lightness clamp

    // --- CRITICAL STEP: Calculate the severely desaturated Chroma for the entire palette ---
    const neutralChromaBase = Math.min(
      NEUTRAL_CHROMA_MAX,
      Math.max(0.01, oklch.c * CHROMA_DEGRADATION) // Apply degradation to original chroma
    );

    // --- 1. Base Color (Neutral-Tuned) ---
    const baseColor = {
      ...oklch,
      l: Math.min(L_MAX, Math.max(L_MIN, oklch.l)), // Consistent L clamp
      c: neutralChromaBase, // Corrected, severely desaturated chroma
      h: oklch.h, // Hue provides the subtle warm/cool undertone
    };

    // --- 2. Base Dark/Light Variants ---
    const darkBase = {
      ...baseColor,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 0.85)),
      // Darker colors retain slightly more saturation (x 1.1) for better depth
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, baseColor.c * 1.1)),
    };
    const lightBase = {
      ...baseColor,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 1.15)),
      // Lighter colors are more desaturated (x 0.8) for a washed-out, soft look
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, baseColor.c * 0.8)),
    };
    const lightestBase = {
      ...baseColor,
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 1.25)),
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, baseColor.c * 0.5)),
    };

    // --- 3. Base Accent (Slightly more Chroma, subtle Hue shift) ---
    const baseAccent = {
      ...baseColor,
      h: (baseColor.h + 10) % 360, // Slight hue shift for pop
      l: Math.min(L_MAX, Math.max(L_MIN, baseColor.l * 1.05)),
      // Accent: use max allowable Chroma for the neutral palette (x 1.5)
      c: Math.min(NEUTRAL_CHROMA_MAX * 1.5, Math.max(0.02, baseColor.c * 1.5)),
    };

    // --- 4. Complementary Color (Neutral-Tuned) ---
    const compColor = {
      ...baseColor,
      // Inherits the neutral C and consistent L from baseColor
      h: (baseColor.h + 180) % 360, // Complementary Hue shift
    };

    // --- 5. Complementary Dark/Light Variants ---
    const darkComp = {
      ...compColor,
      l: Math.min(L_MAX, Math.max(L_MIN, compColor.l * 0.85)),
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, compColor.c * 1.1)),
    };
    const lightComp = {
      ...compColor,
      l: Math.min(L_MAX, Math.max(L_MIN, compColor.l * 1.15)),
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, compColor.c * 0.8)),
    };
    const lightestComp = {
      ...compColor,
      l: Math.min(L_MAX, Math.max(L_MIN, compColor.l * 1.25)),
      c: Math.min(NEUTRAL_CHROMA_MAX, Math.max(0.01, compColor.c * 0.5)),
    };

    // --- 6. Complementary Accent ---
    const compAccent = {
      ...compColor,
      h: (compColor.h + 10) % 360, // Slight hue shift from the complement
      l: Math.min(L_MAX, Math.max(L_MIN, compColor.l * 1.05)),
      // Accent: use max allowable Chroma for the neutral palette
      c: Math.min(NEUTRAL_CHROMA_MAX * 1.5, Math.max(0.02, compColor.c * 1.5)),
    };

    return [
      { name: "Base-D", value: darkBase },
      { name: "Base", value: baseColor },
      { name: "Base-L", value: lightBase },
      { name: "Base-LL", value: lightestBase },
      { name: "Base-A", value: baseAccent },
      { name: "Comp-A", value: compAccent },
      { name: "Comp-LL", value: lightestComp },
      { name: "Comp-L", value: lightComp },
      { name: "Comp", value: compColor },
      { name: "Comp-D", value: darkComp },
    ];
  } else if (kidsPalType === "kidsComp") {
    const clampOklch = (l, c, h) => ({
      l: Math.min(1, Math.max(0.2, l)),
      c: Math.min(0.37, Math.max(0, c)),
      h: ((h % 360) + 360) % 360,
    });

    const L_MIN_SAFE = 0.75; // All output colors must be lighter than this (no moody darks)
    const L_MAX_SAFE = 0.95; // Prevents washing out to pure white (L=1.0)
    const C_MAX_SAFE = 0.32; // Maximum allowed saturation (no aggressive/electric colors)
    const C_MIN_VISIBLE = 0.25; // Minimum allowed saturation for light colors (RAISED to guarantee cheerfulness)
    const H_SHIFT_COOL = 10; // Hue shift applied to cool lightest variant for distinction

    // --- NEW CONSTANTS FOR DISTINCTION ---
    const L_STEP_DARK_SUBTRACT = 0.03; // Ensures Dark is always distinct from Base L

    const L_BASE_MIN = L_MIN_SAFE + L_STEP_DARK_SUBTRACT; // Minimum L for the Base color (0.78)

    const inputL = oklch && typeof oklch.l === "number" ? oklch.l : 0.85;
    const inputC = oklch && typeof oklch.c === "number" ? oklch.c : 0.25;
    const inputH =
      oklch && typeof oklch.h === "number" ? ((oklch.h % 360) + 360) % 360 : 0;

    const baseColor = {
      l: Math.min(L_MAX_SAFE, Math.max(L_BASE_MIN, inputL)),
      c: Math.min(C_MAX_SAFE, Math.max(C_MIN_VISIBLE, inputC)),
      h: inputH,
    };

    // Define "Warm" hues as: [0 to 150) and [300 to 360).
    const isWarm = baseColor.h >= 300 || baseColor.h < 150;

    const L_STEP_LIGHT_FACTOR = 1.06; // (REDUCED for better separation) Ensures Base-L is distinct from Base-LL
    const L_STEP_LIGHTEST_FACTOR = 1.3; // Lightest step is 30% lighter than base

    const C_STEP_WARM_ADD = 0.05; // Chroma increases by fixed amount for warm colors (L↑, C↑)
    const C_STEP_COOL_ADD = 0.03; // (INCREASED for required pop) Chroma increase for cool colors to maintain cheerfulness

    // --- 3. Base Variants Calculation (Relative + Final Clamp) ---

    // Base Dark (Darker L, Same C)
    const darkBase = {
      // L is always distinct from baseColor.l by L_STEP_DARK_SUBTRACT, guaranteed to be >= L_MIN_SAFE
      l: baseColor.l - L_STEP_DARK_SUBTRACT,
      c: baseColor.c,
      h: baseColor.h,
    };

    // Base Light (Lighter L, Chroma adjustment)
    let lightC, lightestC;
    let lightH_LL = baseColor.h;

    if (isWarm) {
      // WARM: L↑, C↑ (Chroma increases with L, clamped at C_MAX_SAFE)
      lightC = Math.min(C_MAX_SAFE, baseColor.c + C_STEP_WARM_ADD);
      lightestC = Math.min(C_MAX_SAFE, baseColor.c + C_STEP_WARM_ADD * 2);
    } else {
      // COOL: L↑, C↑ subtly (Subtle Chroma lift + H-Shift)
      lightC = Math.min(C_MAX_SAFE, baseColor.c + C_STEP_COOL_ADD);
      lightestC = Math.min(C_MAX_SAFE, baseColor.c + C_STEP_COOL_ADD * 2);
      lightH_LL = (baseColor.h + H_SHIFT_COOL) % 360; // Apply hue shift for maximum distinction
    }

    const lightBase = {
      l: Math.min(L_MAX_SAFE, baseColor.l * L_STEP_LIGHT_FACTOR),
      c: lightC,
      h: baseColor.h,
    };

    const lightestBase = {
      l: Math.min(L_MAX_SAFE, baseColor.l * L_STEP_LIGHTEST_FACTOR),
      c: lightestC,
      h: lightH_LL,
    };

    // Base Accent (Slightly lighter L, fixed maximum C)
    const baseAccent = {
      l: Math.min(L_MAX_SAFE, baseColor.l * 1.05),
      c: C_MAX_SAFE, // Ensure it hits the absolute max C for the "pop"
      h: (baseColor.h + 10) % 360,
    };

    // --- 4. Complementary Variants Calculation ---

    const compColor = {
      l: baseColor.l,
      c: baseColor.c,
      h: (baseColor.h + 180) % 360,
    };
    const isCompWarm = !isWarm;

    // Comp Dark (Darker L, Same C)
    const darkComp = {
      // L is always distinct from compColor.l by L_STEP_DARK_SUBTRACT
      l: compColor.l - L_STEP_DARK_SUBTRACT,
      c: compColor.c,
      h: compColor.h,
    };

    // Comp Light (Lighter L, Chroma adjustment)
    let compLightC, compLightestC;
    let compLightH_LL = compColor.h;

    if (isCompWarm) {
      // WARM: L↑, C↑
      compLightC = Math.min(C_MAX_SAFE, compColor.c + C_STEP_WARM_ADD);
      compLightestC = Math.min(C_MAX_SAFE, compColor.c + C_STEP_WARM_ADD * 2);
    } else {
      // COOL: L↑, C↑ subtly (Subtle Chroma lift + H-Shift)
      compLightC = Math.min(C_MAX_SAFE, compColor.c + C_STEP_COOL_ADD);
      compLightestC = Math.min(C_MAX_SAFE, compColor.c + C_STEP_COOL_ADD * 2);
      compLightH_LL = (compColor.h + H_SHIFT_COOL) % 360; // Apply hue shift
    }

    const lightComp = {
      l: Math.min(L_MAX_SAFE, compColor.l * L_STEP_LIGHT_FACTOR),
      c: compLightC,
      h: compColor.h,
    };

    const lightestComp = {
      l: Math.min(L_MAX_SAFE, compColor.l * L_STEP_LIGHTEST_FACTOR),
      c: compLightestC,
      h: compLightH_LL,
    };

    // Comp Accent (Slightly lighter L, fixed maximum C)
    const compAccent = {
      l: Math.min(L_MAX_SAFE, compColor.l * 1.05),
      c: C_MAX_SAFE, // Ensure it hits the absolute max C for the "pop"
      h: (compColor.h + 10) % 360,
    };

    // --- 5. Return Structure ---
    return [
      { name: "Base-D", value: clampOklch(darkBase.l, darkBase.c, darkBase.h) },
      { name: "Base", value: baseColor },
      {
        name: "Base-L",
        value: clampOklch(lightBase.l, lightBase.c, lightBase.h),
      },
      {
        name: "Base-LL",
        value: clampOklch(lightestBase.l, lightestBase.c, lightestBase.h),
      },
      {
        name: "Base-A",
        value: clampOklch(baseAccent.l, baseAccent.c, baseAccent.h),
      },
      {
        name: "Comp-A",
        value: clampOklch(compAccent.l, compAccent.c, compAccent.h),
      },
      {
        name: "Comp-LL",
        value: clampOklch(lightestComp.l, lightestComp.c, lightestComp.h),
      },
      {
        name: "Comp-L",
        value: clampOklch(lightComp.l, lightComp.c, lightComp.h),
      },
      { name: "Comp", value: compColor },
      { name: "Comp-D", value: clampOklch(darkComp.l, darkComp.c, darkComp.h) },
    ];

    // --- 3. Return Structure ---
    return [
      { name: "Base-D", value: darkBase },
      { name: "Base", value: baseColor },
      { name: "Base-L", value: lightBase },
      { name: "Base-LL", value: lightestBase },
      { name: "Base-A", value: baseAccent },
      { name: "Comp-A", value: compAccent },
      { name: "Comp-LL", value: lightestComp },
      { name: "Comp-L", value: lightComp },
      { name: "Comp", value: compColor },
      { name: "Comp-D", value: darkComp },
    ];
  }
}

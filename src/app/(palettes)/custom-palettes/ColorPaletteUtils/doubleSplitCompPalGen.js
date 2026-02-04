import { clampColorToGamut } from "./gamutMapping";

export default function doubleSplitCompPalGen(
  oklch,
  doubleSplitCompPalType = "balanced",
) {
  const VARIANTS = {
    balanced: {
      LMAX: 0.9,
      LMIN: 0.25,
      CMAX: 0.25,
      CMIN: 0.05,
      chromaBoost: 1.0,
      lightOffset: 0.25,
      darkOffset: 0.25,
      chromaVariation: 0.15,
    },
    vibrant: {
      LMAX: 0.88,
      LMIN: 0.3,
      CMAX: 0.35,
      CMIN: 0.15,
      chromaBoost: 1.5,
      lightOffset: 0.22,
      darkOffset: 0.28,
      chromaVariation: 0.2,
    },
    neutral: {
      LMAX: 0.85,
      LMIN: 0.3,
      CMAX: 0.12,
      CMIN: 0.02,
      chromaBoost: 0.6,
      lightOffset: 0.28,
      darkOffset: 0.28,
      chromaVariation: 0.08,
    },
    pastel: {
      LMAX: 0.93,
      LMIN: 0.5,
      CMAX: 0.15,
      CMIN: 0.05,
      chromaBoost: 0.8,
      lightOffset: 0.18,
      darkOffset: 0.35,
      chromaVariation: 0.1,
    },
    deep: {
      LMAX: 0.65,
      LMIN: 0.15,
      CMAX: 0.32,
      CMIN: 0.1,
      chromaBoost: 1.4,
      lightOffset: 0.15, // Smaller offset since range is tighter
      darkOffset: 0.3, // Larger offset for dark variants
      chromaVariation: 0.18,
    },
  };

  const config = VARIANTS[doubleSplitCompPalType] || VARIANTS.balanced;
  const {
    LMAX,
    LMIN,
    CMAX,
    CMIN,
    chromaBoost,
    lightOffset,
    darkOffset,
    chromaVariation,
  } = config;

  // Utility functions
  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  // Adaptive split angle based on hue region (color science)
  // Cool colors (blue-green) get tighter splits, warm colors get wider
  function getSplitAngle(hue) {
    const h = hue % 360;
    if (h >= 150 && h <= 210) return 25; // Blue region - tighter
    if (h >= 30 && h <= 90) return 45; // Yellow-orange - wider
    return 35; // Default
  }

  // Perceptual chroma adjustment based on lightness
  // Human perception of chroma varies with lightness
  function getAdaptiveChroma(l, baseC, variation = 1.0) {
    const midPoint = 0.55;
    const distanceFromMid = Math.abs(l - midPoint);

    // Chroma appears stronger near mid-lightness
    const chromaMultiplier = 1 + variation * (1 - distanceFromMid / 0.55);

    return clamp(baseC * chromaMultiplier, CMIN, CMAX);
  }

  // Create light doubleSplitCompPalType with proper perceptual spacing
  function createLightVariant(l, c, hue, chromaMod = 1.0) {
    const newL = clamp(l + lightOffset, LMIN, LMAX);
    const chromaReduction = doubleSplitCompPalType === "pastel" ? 0.75 : 0.8;

    return clampColorToGamut({
      l: newL,
      c: getAdaptiveChroma(newL, c * chromaMod * chromaReduction),
      h: hue,
    });
  }

  // Create dark doubleSplitCompPalType with proper perceptual spacing
  function createDarkVariant(l, c, hue, chromaMod = 1.0) {
    const newL = clamp(l - darkOffset, LMIN, LMAX);
    const chromaReduction = doubleSplitCompPalType === "deep" ? 0.75 : 0.85;

    return clampColorToGamut({
      l: newL,
      c: clamp(c * chromaMod * chromaReduction, CMIN, CMAX),
      h: hue,
    });
  }

  // Initialize base color values
  const baseHue = oklch.h % 360;
  // For deep doubleSplitCompPalType, bias toward darker range
  const targetL =
    doubleSplitCompPalType === "deep" ? Math.min(oklch.l, 0.45) : oklch.l;
  const baseL = clamp(targetL, LMIN, LMAX);
  const baseC = clamp(oklch.c * chromaBoost, CMIN, CMAX);

  // Calculate harmonic angles
  const baseSplitAngle = getSplitAngle(baseHue);
  const compHue = (baseHue + 180) % 360;
  const compSplitAngle = getSplitAngle(compHue);

  // Analogous hues
  const analogWarmHue = (baseHue + baseSplitAngle) % 360;
  const analogCoolHue = (baseHue - baseSplitAngle + 360) % 360;

  // Complementary split hues
  const compSplitWarmHue = (compHue + compSplitAngle) % 360;
  const compSplitCoolHue = (compHue - compSplitAngle + 360) % 360;

  const palette = [];

  // ============================================
  // GROUP 1: BASE COLOR TRIAD
  // ============================================

  // 1. Base Light - Higher lightness, reduced chroma
  palette.push({
    name: "Base Light",
    value: createLightVariant(baseL, baseC, baseHue),
  });

  // 2. Base - Pure base color
  palette.push({
    name: "Base",
    value: clampColorToGamut({
      l: baseL,
      c: baseC,
      h: baseHue,
    }),
  });

  // 3. Base Dark - Lower lightness, slightly reduced chroma
  palette.push({
    name: "Base Dark",
    value: createDarkVariant(baseL, baseC, baseHue),
  });

  // ============================================
  // GROUP 2: ANALOGOUS WARM (Base + Split)
  // ============================================

  // 4. Analogous Warm - Slightly lighter than base
  const analogWarmL = clamp(baseL + 0.1, LMIN, LMAX);
  palette.push({
    name: "Analog Warm",
    value: clampColorToGamut({
      l: analogWarmL,
      c: getAdaptiveChroma(analogWarmL, baseC * 0.92),
      h: analogWarmHue,
    }),
  });

  // 5. Analogous Warm Light - Much lighter, lower chroma
  palette.push({
    name: "Analog Warm Light",
    value: createLightVariant(analogWarmL, baseC * 0.85, analogWarmHue),
  });

  // ============================================
  // GROUP 3: ANALOGOUS COOL (Base - Split)
  // ============================================

  // 6. Analogous Cool - Slightly darker than base
  const analogCoolL = clamp(baseL - 0.08, LMIN, LMAX);
  palette.push({
    name: "Analog Cool",
    value: clampColorToGamut({
      l: analogCoolL,
      c: getAdaptiveChroma(analogCoolL, baseC * 0.95),
      h: analogCoolHue,
    }),
  });

  // 7. Analogous Cool Dark - Much darker, reduced chroma
  palette.push({
    name: "Analog Cool Dark",
    value: createDarkVariant(analogCoolL, baseC * 0.9, analogCoolHue),
  });

  // ============================================
  // GROUP 4: COMPLEMENT TRIAD
  // ============================================

  // 8. Complement Light - Higher lightness, boosted chroma
  palette.push({
    name: "Comp Light",
    value: createLightVariant(baseL, baseC * 1.1, compHue, 1.05),
  });

  // 9. Complement - Pure complement with slight chroma boost
  palette.push({
    name: "Complement",
    value: clampColorToGamut({
      l: baseL,
      c: clamp(baseC * 1.08, CMIN, CMAX),
      h: compHue,
    }),
  });

  // 10. Complement Dark - Lower lightness
  palette.push({
    name: "Comp Dark",
    value: createDarkVariant(baseL, baseC * 1.05, compHue),
  });

  // ============================================
  // GROUP 5: COMPLEMENT SPLITS
  // ============================================

  // 11. Complement Split Warm - Darker than base
  const compSplitL = clamp(baseL - 0.12, LMIN, LMAX);
  palette.push({
    name: "Comp Split Warm",
    value: clampColorToGamut({
      l: compSplitL,
      c: getAdaptiveChroma(compSplitL, baseC * 1.05),
      h: compSplitWarmHue,
    }),
  });

  // 12. Complement Split Cool - Even darker, distinct from warm
  const compSplitCoolL = clamp(baseL - 0.2, LMIN, LMAX);
  palette.push({
    name: "Comp Split Cool",
    value: clampColorToGamut({
      l: compSplitCoolL,
      c: clamp(baseC * 0.95, CMIN, CMAX),
      h: compSplitCoolHue,
    }),
  });

  // Validate distinctness (optional quality check)
  if (process.env.NODE_ENV === "development") {
    validatePaletteDistinctness(palette);
  }

  return palette;
}

/**
 * Validation function to ensure all colors are perceptually distinct
 * Uses rough ΔE approximation in OKLCH space
 */
function validatePaletteDistinctness(palette) {
  const MIN_DELTA_E = 15; // Minimum perceptual difference

  for (let i = 0; i < palette.length; i++) {
    for (let j = i + 1; j < palette.length; j++) {
      const c1 = palette[i].value;
      const c2 = palette[j].value;

      // Rough ΔE in OKLCH (not true CIEDE2000 but good approximation)
      const deltaL = (c1.l - c2.l) * 100;
      const deltaC = (c1.c - c2.c) * 100;
      const deltaH = Math.min(
        Math.abs(c1.h - c2.h),
        360 - Math.abs(c1.h - c2.h),
      );

      const deltaE = Math.sqrt(
        deltaL * deltaL + deltaC * deltaC + (deltaH * deltaH) / 4,
      );

      if (deltaE < MIN_DELTA_E) {
        console.warn(
          `Low contrast between ${palette[i].name} and ${palette[j].name}: ΔE ≈ ${deltaE.toFixed(1)}`,
        );
      }
    }
  }
}

// Export doubleSplitCompPalType configurations
export const PALETTE_TYPES = {
  balanced: {
    id: "balanced",
    name: "Balanced",
    description: "Well-rounded palette with moderate saturation",
  },
  vibrant: {
    id: "vibrant",
    name: "Vibrant",
    description: "High saturation for bold, energetic designs",
  },
  neutral: {
    id: "neutral",
    name: "Neutral",
    description: "Low saturation for subtle, professional designs",
  },
  pastel: {
    id: "pastel",
    name: "Pastel",
    description: "Light, soft colors with gentle contrast",
  },
  deep: {
    id: "deep",
    name: "Deep",
    description: "Rich, dark colors with strong presence",
  },
};

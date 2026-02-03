export default function tetradicPalGen(
  oklch,
  tetradicPalType = "classicTetra",
) {
  // TRUE TETRADIC: Always 90° spacing (0°, 90°, 180°, 270°)
  const TETRADIC_ANGLES = [0, 90, 180, 270];

  let color1Dark, color1Base, color1Light;
  let color2Dark, color2Base, color2Light;
  let color3Dark, color3Base, color3Light;
  let color4Dark, color4Base, color4Light;

  // ========================================================================
  // CLASSIC TETRADIC - Vibrant, balanced, professional
  // ========================================================================
  if (tetradicPalType === "classicTetra") {
    const L_MIN = 0.3;
    const L_MAX = 0.85;
    const C_MIN = 0.08;
    const C_MAX = 0.32;

    // Helper: Create variant with consistent behavior
    function createVariant(base, lightnessDelta, chromaFactor) {
      return {
        l: Math.min(L_MAX, Math.max(L_MIN, base.l + lightnessDelta)),
        c: Math.min(C_MAX, Math.max(C_MIN, base.c * chromaFactor)),
        h: base.h,
      };
    }

    // Normalize base chroma for consistency across all 4 colors
    const normalizedChroma = Math.min(0.28, Math.max(0.12, oklch.c));
    const normalizedLightness = Math.min(0.75, Math.max(0.4, oklch.l));

    // COLOR 1 (0°) - Primary
    color1Base = {
      l: normalizedLightness,
      c: normalizedChroma,
      h: oklch.h,
    };
    color1Dark = createVariant(color1Base, -0.25, 1.15);
    color1Light = createVariant(color1Base, 0.25, 0.75);

    // COLOR 2 (90°) - Secondary
    color2Base = {
      l: normalizedLightness,
      c: normalizedChroma * 0.95, // Very slight reduction for visual harmony
      h: (oklch.h + 90) % 360,
    };
    color2Dark = createVariant(color2Base, -0.25, 1.15);
    color2Light = createVariant(color2Base, 0.25, 0.75);

    // COLOR 3 (180°) - Accent 1 (complement of primary)
    color3Base = {
      l: normalizedLightness,
      c: normalizedChroma * 0.92,
      h: (oklch.h + 180) % 360,
    };
    color3Dark = createVariant(color3Base, -0.25, 1.15);
    color3Light = createVariant(color3Base, 0.25, 0.75);

    // COLOR 4 (270°) - Accent 2 (complement of secondary)
    color4Base = {
      l: normalizedLightness,
      c: normalizedChroma * 0.94,
      h: (oklch.h + 270) % 360,
    };
    color4Dark = createVariant(color4Base, -0.25, 1.15);
    color4Light = createVariant(color4Base, 0.25, 0.75);
  }

  // ========================================================================
  // VINTAGE TETRADIC - Muted, aged, nostalgic
  // ========================================================================
  else if (tetradicPalType === "vintageTetra") {
    const L_MIN = 0.35;
    const L_MAX = 0.75;
    const C_MIN = 0.04;
    const C_MAX = 0.2;

    // Helper: Warm/age the hue for vintage aesthetic
    function vintageHueShift(h) {
      // Reds → rust/burnt orange
      if (h >= 0 && h < 45) return (h + 12) % 360;
      // Oranges → mustard/amber
      if (h >= 45 && h < 100) return (h + 18) % 360;
      // Yellows/greens → warmer, earthier
      if (h >= 100 && h < 160) return (h + 10) % 360;
      // Teals → more blue (faded cyan)
      if (h >= 160 && h < 200) return (h - 5) % 360;
      // Blues → deeper, cooler (aged blue)
      if (h >= 200 && h < 280) return (h - 8) % 360;
      // Magentas/purples → slight warm
      return (h + 6) % 360;
    }

    // Helper: Hue-dependent chroma for vintage character
    function vintageChroma(h, baseC) {
      const desaturated = baseC * 0.5; // Global desaturation

      // Earth tones (browns, oranges, mustards) can be more saturated
      if (h >= 20 && h < 80) {
        return Math.min(C_MAX, Math.max(C_MIN, desaturated * 1.4));
      }
      // Reds - medium saturation (vintage posters)
      if (h >= 340 || h < 20) {
        return Math.min(0.18, Math.max(C_MIN, desaturated * 1.2));
      }
      // Blues/greens - more muted (faded)
      if (h >= 180 && h < 280) {
        return Math.min(0.14, Math.max(C_MIN, desaturated * 0.9));
      }
      // Default vintage
      return Math.min(0.16, Math.max(C_MIN, desaturated * 1.1));
    }

    // Helper: Create vintage variant
    function createVintageVariant(base, lightnessDelta, chromaFactor) {
      return {
        l: Math.min(L_MAX, Math.max(L_MIN, base.l + lightnessDelta)),
        c: Math.min(C_MAX, Math.max(C_MIN, base.c * chromaFactor)),
        h: base.h,
      };
    }

    // Normalize base values
    const baseLightness = Math.min(0.58, Math.max(0.42, oklch.l));
    const baseChroma = Math.min(0.25, Math.max(0.1, oklch.c));

    // COLOR 1 (0°) - Primary
    const hue1 = vintageHueShift(oklch.h);
    color1Base = {
      l: baseLightness,
      c: vintageChroma(hue1, baseChroma),
      h: hue1,
    };
    color1Dark = createVintageVariant(color1Base, -0.2, 1.15);
    color1Light = createVintageVariant(color1Base, 0.22, 0.75);

    // COLOR 2 (90°) - Secondary
    const hue2 = vintageHueShift((oklch.h + 90) % 360);
    color2Base = {
      l: baseLightness,
      c: vintageChroma(hue2, baseChroma * 0.95),
      h: hue2,
    };
    color2Dark = createVintageVariant(color2Base, -0.2, 1.15);
    color2Light = createVintageVariant(color2Base, 0.22, 0.75);

    // COLOR 3 (180°) - Accent 1
    const hue3 = vintageHueShift((oklch.h + 180) % 360);
    color3Base = {
      l: baseLightness,
      c: vintageChroma(hue3, baseChroma * 0.92),
      h: hue3,
    };
    color3Dark = createVintageVariant(color3Base, -0.2, 1.15);
    color3Light = createVintageVariant(color3Base, 0.22, 0.75);

    // COLOR 4 (270°) - Accent 2
    const hue4 = vintageHueShift((oklch.h + 270) % 360);
    color4Base = {
      l: baseLightness,
      c: vintageChroma(hue4, baseChroma * 0.94),
      h: hue4,
    };
    color4Dark = createVintageVariant(color4Base, -0.2, 1.15);
    color4Light = createVintageVariant(color4Base, 0.22, 0.75);
  }

  // ========================================================================
  // NEUTRAL TETRADIC - Sophisticated, subtle, corporate
  // ========================================================================
  else if (tetradicPalType === "neutralTetra") {
    const L_MIN = 0.25;
    const L_MAX = 0.9;
    const C_MIN = 0.02;
    const C_MAX = 0.12; // Increased from 0.08 - visible but muted undertones

    // Helper: Calculate neutral chroma (subtle color presence)
    function neutralChroma(originalC, boost = 1.0) {
      return Math.min(C_MAX, Math.max(C_MIN, originalC * 0.4 * boost));
    }

    // Helper: Create neutral variant
    function createNeutralVariant(base, lightnessDelta, chromaFactor) {
      return {
        l: Math.min(L_MAX, Math.max(L_MIN, base.l + lightnessDelta)),
        c: Math.min(C_MAX, Math.max(C_MIN, base.c * chromaFactor)),
        h: base.h,
      };
    }

    // Normalize base lightness for neutral range
    const baseLightness = Math.min(0.65, Math.max(0.45, oklch.l));

    // COLOR 1 (0°) - Primary
    color1Base = {
      l: baseLightness,
      c: neutralChroma(oklch.c, 1.1), // Slightly more chroma (still subtle)
      h: oklch.h,
    };
    color1Dark = createNeutralVariant(color1Base, -0.28, 1.2);
    color1Light = createNeutralVariant(color1Base, 0.28, 0.7);

    // COLOR 2 (90°) - Secondary
    color2Base = {
      l: baseLightness,
      c: neutralChroma(oklch.c, 1.05),
      h: (oklch.h + 90) % 360,
    };
    color2Dark = createNeutralVariant(color2Base, -0.28, 1.2);
    color2Light = createNeutralVariant(color2Base, 0.28, 0.7);

    // COLOR 3 (180°) - Accent 1
    color3Base = {
      l: baseLightness,
      c: neutralChroma(oklch.c, 1.0),
      h: (oklch.h + 180) % 360,
    };
    color3Dark = createNeutralVariant(color3Base, -0.28, 1.2);
    color3Light = createNeutralVariant(color3Base, 0.28, 0.7);

    // COLOR 4 (270°) - Accent 2
    color4Base = {
      l: baseLightness,
      c: neutralChroma(oklch.c, 1.02),
      h: (oklch.h + 270) % 360,
    };
    color4Dark = createNeutralVariant(color4Base, -0.28, 1.2);
    color4Light = createNeutralVariant(color4Base, 0.28, 0.7);
  }

  // ========================================================================
  // PASTEL TETRADIC - Soft, gentle, friendly
  // ========================================================================
  else if (tetradicPalType === "pastelTetra") {
    const L_MIN = 0.65; // High minimum lightness for pastel feel
    const L_MAX = 0.92;
    const C_MIN = 0.08;
    const C_MAX = 0.2; // Medium-low chroma for softness

    // Helper: Calculate pastel chroma (soft but visible)
    function pastelChroma(originalC, boost = 1.0) {
      return Math.min(C_MAX, Math.max(C_MIN, originalC * 0.65 * boost));
    }

    // Helper: Create pastel variant (limited dark range)
    function createPastelVariant(base, lightnessDelta, chromaFactor) {
      return {
        l: Math.min(L_MAX, Math.max(L_MIN, base.l + lightnessDelta)),
        c: Math.min(C_MAX, Math.max(C_MIN, base.c * chromaFactor)),
        h: base.h,
      };
    }

    // Base is already quite light for pastel aesthetic
    const baseLightness = Math.min(0.82, Math.max(0.72, oklch.l + 0.15));

    // COLOR 1 (0°) - Primary
    color1Base = {
      l: baseLightness,
      c: pastelChroma(oklch.c, 1.1),
      h: oklch.h,
    };
    color1Dark = createPastelVariant(color1Base, -0.15, 1.1); // Softer darks
    color1Light = createPastelVariant(color1Base, 0.12, 0.8);

    // COLOR 2 (90°) - Secondary
    color2Base = {
      l: baseLightness,
      c: pastelChroma(oklch.c, 1.05),
      h: (oklch.h + 90) % 360,
    };
    color2Dark = createPastelVariant(color2Base, -0.15, 1.1);
    color2Light = createPastelVariant(color2Base, 0.12, 0.8);

    // COLOR 3 (180°) - Accent 1
    color3Base = {
      l: baseLightness,
      c: pastelChroma(oklch.c, 1.0),
      h: (oklch.h + 180) % 360,
    };
    color3Dark = createPastelVariant(color3Base, -0.15, 1.1);
    color3Light = createPastelVariant(color3Base, 0.12, 0.8);

    // COLOR 4 (270°) - Accent 2
    color4Base = {
      l: baseLightness,
      c: pastelChroma(oklch.c, 1.02),
      h: (oklch.h + 270) % 360,
    };
    color4Dark = createPastelVariant(color4Base, -0.15, 1.1);
    color4Light = createPastelVariant(color4Base, 0.12, 0.8);
  }

  // ========================================================================
  // DEFAULT CASE - Use classic as fallback
  // ========================================================================
  else {
    const L_MIN = 0.3;
    const L_MAX = 0.85;
    const C_MIN = 0.08;
    const C_MAX = 0.32;

    function createVariant(base, lightnessDelta, chromaFactor) {
      return {
        l: Math.min(L_MAX, Math.max(L_MIN, base.l + lightnessDelta)),
        c: Math.min(C_MAX, Math.max(C_MIN, base.c * chromaFactor)),
        h: base.h,
      };
    }

    const normalizedChroma = Math.min(0.28, Math.max(0.12, oklch.c));
    const normalizedLightness = Math.min(0.75, Math.max(0.4, oklch.l));

    color1Base = {
      l: normalizedLightness,
      c: normalizedChroma,
      h: oklch.h,
    };
    color1Dark = createVariant(color1Base, -0.25, 1.15);
    color1Light = createVariant(color1Base, 0.25, 0.75);

    color2Base = {
      l: normalizedLightness,
      c: normalizedChroma * 0.95,
      h: (oklch.h + 90) % 360,
    };
    color2Dark = createVariant(color2Base, -0.25, 1.15);
    color2Light = createVariant(color2Base, 0.25, 0.75);

    color3Base = {
      l: normalizedLightness,
      c: normalizedChroma * 0.92,
      h: (oklch.h + 180) % 360,
    };
    color3Dark = createVariant(color3Base, -0.25, 1.15);
    color3Light = createVariant(color3Base, 0.25, 0.75);

    color4Base = {
      l: normalizedLightness,
      c: normalizedChroma * 0.94,
      h: (oklch.h + 270) % 360,
    };
    color4Dark = createVariant(color4Base, -0.25, 1.15);
    color4Light = createVariant(color4Base, 0.25, 0.75);
  }

  // ========================================================================
  // RETURN: 12 colors total (4 base × 3 variants each)
  // Semantic naming for clear hierarchy
  // ========================================================================
  return [
    { name: "Primary-D", value: color1Dark },
    { name: "Base", value: color1Base },
    { name: "Primary-L", value: color1Light },

    { name: "Secondary-D", value: color2Dark },
    { name: "Secondary", value: color2Base },
    { name: "Secondary-L", value: color2Light },

    { name: "Accent1-D", value: color3Dark },
    { name: "Accent1", value: color3Base },
    { name: "Accent1-L", value: color3Light },

    { name: "Accent2-D", value: color4Dark },
    { name: "Accent2", value: color4Base },
    { name: "Accent2-L", value: color4Light },
  ];
}

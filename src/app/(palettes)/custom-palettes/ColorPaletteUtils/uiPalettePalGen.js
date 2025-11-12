export default function uiPalettePalGen(baseOklch) {
  const LMAX = 0.95;
  const LMIN = 0.25;
  const CMAX = 0.25;
  const CMIN = 0.05;

  // Function to restrict values within the min/max bounds
  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  // Helper to calculate WCAG contrast ratio
  function contrastRatio(l1, l2) {
    // Note: L here must be the actual relative luminance,
    // but in OKLCH, 'l' is a good proxy for perceptual lightness.
    // Assuming the input 'l' values are treated as L for contrast calculation here.
    const L1 = Math.max(l1, l2);
    const L2 = Math.min(l1, l2);
    return (L1 + 0.05) / (L2 + 0.05);
  }

  // Helper for hue adjustment based on color temperature (strength retained)
  function temperatureBias(h, shift) {
    if (h < 60 || h > 300) return (h + shift * 0.8) % 360; // Warm (Red/Yellow)
    if (h >= 180 && h <= 300) return (h + shift * 1.1) % 360; // Cool (Blue/Purple)
    return (h + shift) % 360;
  }

  // Dynamic delta for darkening (strength retained)
  const delta = baseOklch.l > 0.6 ? 0.2 : 0.12;

  // Helper to create the base color (Primary, Secondary, etc.)
  function makeColor(hShift = 0, cMult = 1) {
    return {
      ...baseOklch,
      h: temperatureBias(baseOklch.h, hShift),
      c: clamp(baseOklch.c * cMult, CMIN, CMAX),
      l: clamp(baseOklch.l, LMIN, LMAX),
    };
  }

  // Helper to create a color pair (Base + Dark variant with contrast check)
  function makeColorPair(hShift, cMultBase, cMultDark, name) {
    const baseColor = makeColor(hShift, cMultBase);

    // Initial dark variant
    let darkColor = {
      ...baseColor,
      c: clamp(baseColor.c * cMultDark, CMIN, CMAX),
      l: clamp(baseColor.l - delta, LMIN, LMAX),
    };

    // Contrast check and adjustment (strength retained)
    if (contrastRatio(baseColor.l, darkColor.l) < 3) {
      darkColor = {
        ...darkColor,
        l: Math.max(LMIN, darkColor.l - 0.05),
      };
    }

    return [
      { name: name, value: baseColor },
      { name: `${name}-Dark`, value: darkColor },
    ];
  }

  // --- Generate Palette ---

  // 1. Primary & Primary-Dark
  const primaryPair = makeColorPair(0, 1.0, 1.12, "Primary");

  // 2. Secondary & Secondary-Dark (Triadic - 120°)
  const secondaryPair = makeColorPair(120, 0.95, 1.12, "Secondary");

  // 3. Tertiary & Tertiary-Dark (Triadic - 240°)
  const tertiaryPair = makeColorPair(240, 0.9, 1.12, "Tertiary");

  // 4. Accent & Accent-Dark (Complementary - 180°)
  const accentPair = makeColorPair(180, 1.05, 1.12, "Accent");

  // 5. Neutral & Neutral-Dark (Desaturated)
  // Note: Using a fixed minimal chroma (e.g., 0.02) might be better
  // than multiplying by 0.15 if the base chroma is extremely low.
  const neutralBase = makeColor(0, 0.15);
  const neutralDark = {
    ...neutralBase,
    c: clamp(neutralBase.c * 1.1, CMIN, CMAX),
    l: clamp(neutralBase.l - delta, LMIN, LMAX),
  };
  // Contrast check for neutral pair
  if (contrastRatio(neutralBase.l, neutralDark.l) < 3) {
    neutralDark.l = Math.max(LMIN, neutralDark.l - 0.05);
  }
  const neutralPair = [
    { name: "Neutral", value: neutralBase },
    { name: "Neutral-Dark", value: neutralDark },
  ];

  // Combine all pairs into a single array
  return [
    ...primaryPair,
    ...secondaryPair,
    ...tertiaryPair,
    ...accentPair,
    ...neutralPair,
  ];
}

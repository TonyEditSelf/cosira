export default function monochromaticPalGen(
  oklch,
  monoPalType,
  sliderLightValue = 0,
  sliderChromaValue = 0
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

  if (monoPalType === "classicMono") {
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
      c: Math.min(0.08, Math.max(0, darkestBase.c * 0.15)),
    };

    mutedDarkerBase = {
      ...darkestBase,
      l: Math.min(1, Math.max(0, darkestBase.l * 0.8)), // 20% darker, clamped
      c: Math.min(0.08, Math.max(0, darkestBase.c * 0.7)),
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
      c: Math.min(0.08, Math.max(0, lightestBase.c * 0.15)),
    };

    mutedLighterBase = {
      ...lightBase,
      l: Math.min(1, Math.max(0, lightBase.l * 1.1)), // 10% lighter, clamped
      c: Math.min(0.08, Math.max(0, lightBase.c * 0.7)),
    };
  } else if (monoPalType === "vintageMono") {
    // --- Vintage tone & chroma parameters ---
    const LMAX = 0.68; // softer highlights (vintage = faded)
    const LMIN = 0.38; // deeper but not crushed shadows
    const CMAX = 0.2; // MODERATED Saturation Ceiling for balanced vintage vibrancy
    const CMIN = 0.04; // nearly grayscale at minimum

    const VIBRANCY_CEILING = 0.2; // Match CMAX

    function applyVintageChromaBoost(color) {
      const { h, c } = color;
      let newC = c;

      // Slight boost for Reds and Oranges (0 to 65 degrees)
      if (h >= 0 && h <= 65) {
        newC = c * 1.2;
      }
      // Slight boost for Greens (110 to 170 degrees)
      else if (h >= 110 && h <= 170) {
        newC = c * 1.15;
      }
      // Very slight mute on Blues/Cyans (200 to 270 degrees)
      else if (h >= 200 && h <= 270) {
        newC = c * 0.95;
      }

      // Ensure the boosted chroma does not exceed the MODERATED CMAX
      newC = Math.min(newC, VIBRANCY_CEILING);

      return { ...color, c: newC };
    }
    // ----------------------------------------------------------------------

    // --- Base color with tighter vintage tone range ---
    baseColor = {
      ...oklch,
      l: 0.53 + sliderLightValue, // base within midrange (faded)
      c: 0.09 + sliderChromaValue, // muted baseline
    };
    baseColor = applyVintageChromaBoost(baseColor); // Apply boost

    // --- Vintage tonal steps ---

    darkBase = {
      ...baseColor,
      l: baseColor.l * 0.88,
      c: baseColor.c * 1.08,
      h: (baseColor.h - 1.5 + 360) % 360,
    };
    darkBase = applyVintageChromaBoost(darkBase); // Apply boost

    darkerBase = {
      ...baseColor,
      l: baseColor.l * 0.8,
      c: baseColor.c * 1.1,
      h: (baseColor.h - 2 + 360) % 360,
    };
    darkerBase = applyVintageChromaBoost(darkerBase); // Apply boost

    darkestBase = {
      ...baseColor,
      l: baseColor.l * 0.75,
      c: baseColor.c * 1.15,
      h: (baseColor.h - 3 + 360) % 360,
    };
    darkestBase = applyVintageChromaBoost(darkestBase); // Apply boost

    // more muted, neutral dark tones
    darkerNeutralBase = {
      ...darkestBase,
      c: darkestBase.c * 0.5,
    };
    darkerNeutralBase = applyVintageChromaBoost(darkerNeutralBase); // Apply boost

    mutedDarkerBase = {
      ...darkestBase,
      l: darkestBase.l * 0.8,
      c: darkestBase.c * 0.5,
    };
    mutedDarkerBase = applyVintageChromaBoost(mutedDarkerBase); // Apply boost

    // --- Light tones ---

    lightBase = {
      ...baseColor,
      l: baseColor.l + (LMAX - baseColor.l) * 0.35,
      c: baseColor.c * 0.85,
      h: (baseColor.h + 2) % 360,
    };
    lightBase = applyVintageChromaBoost(lightBase); // Apply boost

    lighterBase = {
      ...baseColor,
      l: baseColor.l + (LMAX - baseColor.l) * 0.45,
      c: baseColor.c * 0.8,
      h: (baseColor.h + 3) % 360,
    };
    lighterBase = applyVintageChromaBoost(lighterBase); // Apply boost

    lightestBase = {
      ...baseColor,
      l: baseColor.l + (LMAX - baseColor.l) * 0.6,
      c: baseColor.c * 0.7,
      h: (baseColor.h + 4) % 360,
    };
    lightestBase = applyVintageChromaBoost(lightestBase); // Apply boost

    lighterNeutralBase = {
      ...lightestBase,
      l: lightestBase.l + (LMAX - lightestBase.l) * 0.1,
      c: lightestBase.c * 0.5,
    };
    lighterNeutralBase = applyVintageChromaBoost(lighterNeutralBase); // Apply boost

    mutedLighterBase = {
      ...lightBase,
      l: lightBase.l + (LMAX - lightBase.l) * 0.1,
      c: lightBase.c * 0.6,
    };
    mutedLighterBase = applyVintageChromaBoost(mutedLighterBase); // Apply boost
  } else if (monoPalType === "neutralMono") {
    const LMAX = 0.96; // near-white highlights
    const LMIN = 0.18; // deep shadows
    const CMAX = 0.08; // subtle hue presence
    const CMIN = 0.02; // nearly achromatic

    // --- Base color (neutral with subtle hue) ---
    baseColor = {
      ...oklch,
      l: Math.max(LMIN, Math.min(LMAX, 0.57 + sliderLightValue)), // mid-tone base
      c: Math.max(CMIN, Math.min(CMAX, 0.05 + sliderChromaValue)), // subtle chroma
    };

    // --- Monochromatic tonal range (no hue shift) ---

    // Dark tones
    darkestBase = {
      ...baseColor,
      l: Math.max(LMIN, baseColor.l * 0.3),
      c: Math.min(CMAX, baseColor.c * 1.3),
    };

    darkerBase = {
      ...baseColor,
      l: Math.max(LMIN, baseColor.l * 0.45),
      c: Math.min(CMAX, baseColor.c * 1.2),
    };

    darkBase = {
      ...baseColor,
      l: Math.max(LMIN, baseColor.l * 0.65),
      c: Math.min(CMAX, baseColor.c * 1.1),
    };

    // Darker neutral & muted
    darkerNeutralBase = {
      ...baseColor,
      l: Math.max(LMIN, baseColor.l * 0.55),
      c: Math.max(CMIN, baseColor.c * 0.6), // neutral → lower chroma
    };

    mutedDarkerBase = {
      ...baseColor,
      l: Math.max(LMIN, baseColor.l * 0.5),
      c: Math.max(CMIN, baseColor.c * 0.8), // muted → slightly higher chroma
    };

    // Light tones (additive for stronger lift)
    lightBase = {
      ...baseColor,
      l: Math.min(LMAX, baseColor.l + 0.15),
      c: Math.max(CMIN, baseColor.c * 0.9),
    };

    lighterBase = {
      ...baseColor,
      l: Math.min(LMAX, baseColor.l + 0.25),
      c: Math.max(CMIN, baseColor.c * 0.8),
    };

    lightestBase = {
      ...baseColor,
      l: Math.min(LMAX, baseColor.l + 0.33),
      c: Math.max(CMIN, baseColor.c * 0.7),
    };

    // Light neutral & muted (neutral < muted)
    lighterNeutralBase = {
      ...baseColor,
      l: Math.min(LMAX, baseColor.l + 0.28),
      c: Math.max(CMIN, baseColor.c * 0.6),
    };

    mutedLighterBase = {
      ...baseColor,
      l: Math.min(LMAX, baseColor.l + 0.22),
      c: Math.max(CMIN, baseColor.c * 0.8),
    };
  } else if (monoPalType === "kidsMono") {
    const LMAX = 0.88;
    const LMIN = 0.35;
    const CMAX = 0.28;
    const CMIN = 0.15;

    // Base color (bright, energetic tone) — preserve slider logic
    baseColor = {
      ...oklch,
      l: Math.max(LMIN, Math.min(LMAX, 0.62 + sliderLightValue)),
      c: Math.max(CMIN, Math.min(CMAX, 0.22 + sliderChromaValue)),
    };

    // ---- Dark / neutral variants ----
    // Deepest dark (Base-DDD) — strongest contrast, slightly boosted chroma for richness
    darkestBase = {
      ...baseColor,
      l: Math.max(LMIN, baseColor.l - 0.28), // deepest
      c: Math.min(CMAX, baseColor.c * 1.15),
    };

    // Darker (Base-DD) — strong dark but less extreme than darkestBase
    darkerBase = {
      ...baseColor,
      l: Math.max(LMIN, baseColor.l - 0.18), // medium-deep
      c: Math.min(CMAX, baseColor.c * 1.1),
    };

    // Dark (Base-D) — standard dark for UI elements
    darkBase = {
      ...baseColor,
      l: Math.max(LMIN, baseColor.l - 0.1), // moderately dark
      c: Math.min(CMAX, baseColor.c * 1.05),
    };

    // Darker neutral (Base-DN) — dark value but intentionally more neutral (lower chroma)
    darkerNeutralBase = {
      ...baseColor,
      l: Math.max(LMIN, baseColor.l - 0.2), // dark but not the deepest
      c: Math.max(CMIN, baseColor.c * 0.6), // noticeably desaturated → neutral feeling
    };

    // Muted darker (Base-MD) — dark but muted (useful for less saturated elements)
    mutedDarkerBase = {
      ...baseColor,
      l: Math.max(LMIN, baseColor.l - 0.22), // similar dark range
      c: Math.max(CMIN, baseColor.c * 0.75), // muted but still colorful
    };

    // ---- Light / neutral lighter variants ----
    // Light (Base-L)
    lightBase = {
      ...baseColor,
      l: Math.min(LMAX, baseColor.l + 0.12),
      c: Math.max(CMIN, baseColor.c * 0.95),
    };

    // Lighter (Base-LL)
    lighterBase = {
      ...baseColor,
      l: Math.min(LMAX, baseColor.l + 0.18),
      c: Math.max(CMIN, baseColor.c * 0.9),
    };

    // Lightest (Base-LLL)
    lightestBase = {
      ...baseColor,
      l: Math.min(LMAX, baseColor.l + 0.22),
      c: Math.max(CMIN, baseColor.c * 0.85),
    };

    // Lighter neutral (Base-LN) — very light but slightly neutralized
    lighterNeutralBase = {
      ...baseColor,
      l: Math.min(LMAX, baseColor.l + 0.2),
      c: Math.max(CMIN, baseColor.c * 0.65), // matches dark neutral logic
    };

    // Muted lighter (Base-ML) — light but intentionally desaturated for subtle UI surfaces
    mutedLighterBase = {
      ...baseColor,
      l: Math.min(LMAX, baseColor.l + 0.16),
      c: Math.max(CMIN, baseColor.c * 0.75), // matches muted darker logic
    };
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
    { name: "Base-ML", value: mutedLighterBase },
    { name: "Base-LN", value: lighterNeutralBase },
  ];
}

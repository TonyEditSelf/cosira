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
    const LMAX = 1.0;
    const LMIN = 0.0;
    const CMAX = 0.08;
    const CMIN = 0.0;

    baseColor = oklch;

    darkBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.85)), // -9 pts
    };

    darkerBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.7)), // -18 pts
    };

    darkestBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.55)), // -27 pts
    };

    darkerNeutralBase = {
      ...darkerBase,
      // l: Math.min(LMAX, Math.max(LMIN, darkerBase.l * 1.1)),
      c: Math.min(0.04, Math.max(0.01, darkerBase.c * 0.15)),
    };

    mutedDarkerBase = {
      ...darkerBase,
      l: Math.min(LMAX, Math.max(LMIN, darkerBase.l * 0.8)), // 20% darker, clamped
      c: Math.min(CMAX, Math.max(CMIN, darkerBase.c * 0.7)),
    };

    lightBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 1.15)), // +9 pts
    };

    lighterBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 1.3)), // +18 pts
    };

    lightestBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 1.45)), // +27 pts
    };

    lighterNeutralBase = {
      ...lighterBase,
      // l: Math.min(LMAX, Math.max(LMIN, lighterBase.l * 1.1)), // 10% lighter (scaled), clamped
      c: Math.min(0.04, Math.max(0.01, lighterBase.c * 0.15)),
    };

    mutedLighterBase = {
      ...lighterBase,
      l: Math.min(LMAX, Math.max(LMIN, lighterBase.l * 1.1)), // 10% lighter, clamped
      c: Math.min(CMAX, Math.max(CMIN, lighterBase.c * 0.7)),
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
      c: darkestBase.c * 0.3,
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
      c: lightestBase.c * 0.3,
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
      l: Math.min(LMAX, Math.max(LMIN, 0.57 + sliderLightValue)), // mid-tone base
      c: Math.min(CMAX, Math.max(CMIN, 0.05 + sliderChromaValue)), // subtle chroma
    };

    // --- Monochromatic tonal range (no hue shift) ---

    // Dark tones
    darkestBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.3)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.3)),
    };

    darkerBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.45)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.2)),
    };

    darkBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.65)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.1)),
    };

    // Darker neutral & muted
    darkerNeutralBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.55)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.6)), // neutral → lower chroma
    };

    mutedDarkerBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.5)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.8)), // muted → slightly higher chroma
    };

    // Light tones (additive for stronger lift)
    lightBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.15)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.9)),
    };

    lighterBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.25)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.8)),
    };

    lightestBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.33)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.7)),
    };

    // Light neutral & muted (neutral < muted)
    lighterNeutralBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.28)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.6)),
    };

    mutedLighterBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.22)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.8)),
    };
  } else if (monoPalType === "kidsMono") {
    const LMAX = 0.88;
    const LMIN = 0.35;
    const CMAX = 0.28;
    const CMIN = 0.15;

    // --- Base color (bright, energetic tone) ---
    baseColor = {
      ...oklch,
      l: Math.min(LMAX, Math.max(LMIN, 0.62 + sliderLightValue)),
      c: Math.min(CMAX, Math.max(CMIN, 0.22 + sliderChromaValue)),
    };

    // ---- Dark / neutral variants ----

    // Deepest dark (Base-DDD) — strongest contrast, slightly boosted chroma for richness
    darkestBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.28)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.15)),
    };

    // Darker (Base-DD) — strong dark but less extreme than darkestBase
    darkerBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.18)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.1)),
    };

    // Dark (Base-D) — standard dark for UI elements
    darkBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.1)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.05)),
    };

    // Darker neutral (Base-DN) — dark value but intentionally more neutral (lower chroma)
    darkerNeutralBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.2)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.6)), // neutral → desaturated
    };

    // Muted darker (Base-MD) — dark but muted (useful for less saturated elements)
    mutedDarkerBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.22)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.75)),
    };

    // ---- Light / neutral lighter variants ----

    // Light (Base-L)
    lightBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.12)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.95)),
    };

    // Lighter (Base-LL)
    lighterBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.18)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.9)),
    };

    // Lightest (Base-LLL)
    lightestBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.22)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.85)),
    };

    // Lighter neutral (Base-LN) — very light but slightly neutralized
    lighterNeutralBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.2)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.65)),
    };

    // Muted lighter (Base-ML) — light but intentionally desaturated
    mutedLighterBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.16)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.75)),
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

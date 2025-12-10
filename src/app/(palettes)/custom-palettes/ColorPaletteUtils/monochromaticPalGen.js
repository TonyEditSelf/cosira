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
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.09)),
    };

    darkerBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.18)),
    };

    darkestBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.27)),
    };

    darkerNeutralBase = {
      ...darkerBase,
      c: Math.min(0.04, Math.max(0.01, darkerBase.c * 0.15)),
    };

    mutedDarkerBase = {
      ...darkerBase,
      l: Math.min(LMAX, Math.max(LMIN, darkerBase.l - 0.05)),
      c: Math.min(CMAX, Math.max(CMIN, darkerBase.c * 0.7)),
    };

    lightBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.09)),
    };

    lighterBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.18)),
    };

    lightestBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.27)),
    };

    lighterNeutralBase = {
      ...lighterBase,
      c: Math.min(0.04, Math.max(0.01, lighterBase.c * 0.15)),
    };

    mutedLighterBase = {
      ...lighterBase,
      l: Math.min(LMAX, Math.max(LMIN, lighterBase.l + 0.03)),
      c: Math.min(CMAX, Math.max(CMIN, lighterBase.c * 0.7)),
    };
  } else if (monoPalType === "vintageMono") {
    // --- Vintage tone & chroma parameters ---
    const LMAX = 0.68;
    const LMIN = 0.38;
    const CMAX = 0.2;
    const CMIN = 0.04;

    const VIBRANCY_CEILING = 0.2;

    // Fixed: Apply chroma boost first, then clamp to CMAX
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

      // Clamp to VIBRANCY_CEILING and CMIN
      newC = Math.min(VIBRANCY_CEILING, Math.max(CMIN, newC));

      return { ...color, c: newC };
    }
    // ----------------------------------------------------------------------

    // --- Base color with tighter vintage tone range ---
    let baseColorRaw = {
      ...oklch,
      l: 0.53 + sliderLightValue,
      c: 0.09 + sliderChromaValue,
    };
    baseColor = applyVintageChromaBoost(baseColorRaw);

    // --- Vintage tonal steps ---

    let darkBaseRaw = {
      ...baseColor,
      l: baseColor.l * 0.88,
      c: baseColor.c * 1.08,
      h: (baseColor.h - 1.5 + 360) % 360,
    };
    darkBase = applyVintageChromaBoost(darkBaseRaw);

    let darkerBaseRaw = {
      ...baseColor,
      l: baseColor.l * 0.8,
      c: baseColor.c * 1.1,
      h: (baseColor.h - 2 + 360) % 360,
    };
    darkerBase = applyVintageChromaBoost(darkerBaseRaw);

    let darkestBaseRaw = {
      ...baseColor,
      l: baseColor.l * 0.75,
      c: baseColor.c * 1.15,
      h: (baseColor.h - 3 + 360) % 360,
    };
    darkestBase = applyVintageChromaBoost(darkestBaseRaw);

    // more muted, neutral dark tones
    let darkerNeutralBaseRaw = {
      ...darkestBase,
      c: darkestBase.c * 0.3,
    };
    darkerNeutralBase = applyVintageChromaBoost(darkerNeutralBaseRaw);

    let mutedDarkerBaseRaw = {
      ...darkestBase,
      l: darkestBase.l * 0.8,
      c: darkestBase.c * 0.5,
    };
    mutedDarkerBase = applyVintageChromaBoost(mutedDarkerBaseRaw);

    // --- Light tones ---

    let lightBaseRaw = {
      ...baseColor,
      l: baseColor.l + (LMAX - baseColor.l) * 0.35,
      c: baseColor.c * 0.85,
      h: (baseColor.h + 2) % 360,
    };
    lightBase = applyVintageChromaBoost(lightBaseRaw);

    let lighterBaseRaw = {
      ...baseColor,
      l: baseColor.l + (LMAX - baseColor.l) * 0.45,
      c: baseColor.c * 0.8,
      h: (baseColor.h + 3) % 360,
    };
    lighterBase = applyVintageChromaBoost(lighterBaseRaw);

    let lightestBaseRaw = {
      ...baseColor,
      l: baseColor.l + (LMAX - baseColor.l) * 0.6,
      c: baseColor.c * 0.7,
      h: (baseColor.h + 4) % 360,
    };
    lightestBase = applyVintageChromaBoost(lightestBaseRaw);

    let lighterNeutralBaseRaw = {
      ...lightestBase,
      l: lightestBase.l + (LMAX - lightestBase.l) * 0.1,
      c: lightestBase.c * 0.3,
    };
    lighterNeutralBase = applyVintageChromaBoost(lighterNeutralBaseRaw);

    let mutedLighterBaseRaw = {
      ...lightBase,
      l: lightBase.l + (LMAX - lightBase.l) * 0.1,
      c: lightBase.c * 0.6,
    };
    mutedLighterBase = applyVintageChromaBoost(mutedLighterBaseRaw);
  } else if (monoPalType === "neutralMono") {
    const LMAX = 0.96;
    const LMIN = 0.18;
    const CMAX = 0.08;
    const CMIN = 0.02;

    // --- Base color (neutral with subtle hue) ---
    baseColor = {
      ...oklch,
      l: Math.min(LMAX, Math.max(LMIN, 0.57 + sliderLightValue)),
      c: Math.min(CMAX, Math.max(CMIN, 0.05 + sliderChromaValue)),
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

    // Fixed: neutral should have LOWER chroma than muted
    darkerNeutralBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.55)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.5)), // neutral → lower chroma
    };

    mutedDarkerBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.5)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.7)), // muted → slightly higher chroma than neutral
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

    // Fixed: neutral should have LOWER chroma than muted
    lighterNeutralBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.28)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.5)), // neutral → lower chroma
    };

    mutedLighterBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.22)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.7)), // muted → slightly higher chroma than neutral
    };
  } else if (monoPalType === "neutralMono") {
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

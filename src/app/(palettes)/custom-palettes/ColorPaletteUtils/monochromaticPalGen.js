export default function monochromaticPalGen(
  oklch,
  monoPalType,
  sliderLightValue = 0,
  sliderChromaValue = 0,
) {
  // Helper function to clamp values
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  // Perceptual lightness scale - uses exponential curves for better visual distribution
  const getLightnessScale = (baseL) => {
    return {
      // Darker shades - exponential darkening
      darkest: baseL * 0.35,
      darker: baseL * 0.55,
      dark: baseL * 0.75,

      // Base
      base: baseL,

      // Lighter shades - inverse exponential (more space near white)
      light: baseL + (1 - baseL) * 0.25,
      lighter: baseL + (1 - baseL) * 0.45,
      lightest: baseL + (1 - baseL) * 0.65,
    };
  };

  let palette = {};

  // Use user's input as the TRUE base (with slider adjustments)
  const userBaseColor = {
    l: clamp(oklch.l + sliderLightValue, 0, 1),
    c: clamp(oklch.c + sliderChromaValue, 0, 0.4),
    h: oklch.h,
  };

  const lightnessScale = getLightnessScale(userBaseColor.l);

  if (monoPalType === "classicMono") {
    // Pure monochromatic - only lightness changes
    palette = {
      darkest: {
        l: clamp(lightnessScale.darkest, 0, 1),
        c: userBaseColor.c,
        h: userBaseColor.h,
      },
      darker: {
        l: clamp(lightnessScale.darker, 0, 1),
        c: userBaseColor.c,
        h: userBaseColor.h,
      },
      dark: {
        l: clamp(lightnessScale.dark, 0, 1),
        c: userBaseColor.c,
        h: userBaseColor.h,
      },
      darkerNeutral: {
        l: clamp(lightnessScale.darker, 0, 1),
        c: clamp(userBaseColor.c * 0.3, 0, 0.4),
        h: userBaseColor.h,
      },
      mutedDarker: {
        l: clamp(lightnessScale.darker * 0.95, 0, 1),
        c: clamp(userBaseColor.c * 0.6, 0, 0.4),
        h: userBaseColor.h,
      },
      base: userBaseColor,
      light: {
        l: clamp(lightnessScale.light, 0, 1),
        c: userBaseColor.c,
        h: userBaseColor.h,
      },
      lighter: {
        l: clamp(lightnessScale.lighter, 0, 1),
        c: userBaseColor.c,
        h: userBaseColor.h,
      },
      lightest: {
        l: clamp(lightnessScale.lightest, 0, 1),
        c: userBaseColor.c,
        h: userBaseColor.h,
      },
      lighterNeutral: {
        l: clamp(lightnessScale.lighter, 0, 1),
        c: clamp(userBaseColor.c * 0.3, 0, 0.4),
        h: userBaseColor.h,
      },
      mutedLighter: {
        l: clamp(lightnessScale.light * 1.05, 0, 1),
        c: clamp(userBaseColor.c * 0.6, 0, 0.4),
        h: userBaseColor.h,
      },
    };
  } else if (monoPalType === "vintageMono") {
    // Vintage - slight hue shifts, chroma adjustments, warmer darks/cooler lights
    palette = {
      darkest: {
        l: clamp(lightnessScale.darkest, 0.2, 0.9),
        c: clamp(userBaseColor.c * 1.3, 0.04, 0.25),
        h: (userBaseColor.h + 8 + 360) % 360, // Warmer darks
      },
      darker: {
        l: clamp(lightnessScale.darker, 0.2, 0.9),
        c: clamp(userBaseColor.c * 1.2, 0.04, 0.25),
        h: (userBaseColor.h + 5 + 360) % 360,
      },
      dark: {
        l: clamp(lightnessScale.dark, 0.2, 0.9),
        c: clamp(userBaseColor.c * 1.1, 0.04, 0.25),
        h: (userBaseColor.h + 3 + 360) % 360,
      },
      darkerNeutral: {
        l: clamp(lightnessScale.darker, 0.2, 0.9),
        c: clamp(userBaseColor.c * 0.4, 0.04, 0.25),
        h: userBaseColor.h,
      },
      mutedDarker: {
        l: clamp(lightnessScale.darker * 0.9, 0.2, 0.9),
        c: clamp(userBaseColor.c * 0.7, 0.04, 0.25),
        h: (userBaseColor.h + 2 + 360) % 360,
      },
      base: {
        l: clamp(userBaseColor.l, 0.2, 0.9),
        c: clamp(userBaseColor.c, 0.04, 0.25),
        h: userBaseColor.h,
      },
      light: {
        l: clamp(lightnessScale.light, 0.2, 0.9),
        c: clamp(userBaseColor.c * 0.85, 0.04, 0.25),
        h: (userBaseColor.h - 2 + 360) % 360, // Cooler lights
      },
      lighter: {
        l: clamp(lightnessScale.lighter, 0.2, 0.9),
        c: clamp(userBaseColor.c * 0.7, 0.04, 0.25),
        h: (userBaseColor.h - 4 + 360) % 360,
      },
      lightest: {
        l: clamp(lightnessScale.lightest, 0.2, 0.9),
        c: clamp(userBaseColor.c * 0.55, 0.04, 0.25),
        h: (userBaseColor.h - 6 + 360) % 360,
      },
      lighterNeutral: {
        l: clamp(lightnessScale.lighter, 0.2, 0.9),
        c: clamp(userBaseColor.c * 0.35, 0.04, 0.25),
        h: userBaseColor.h,
      },
      mutedLighter: {
        l: clamp(lightnessScale.light * 1.08, 0.2, 0.9),
        c: clamp(userBaseColor.c * 0.6, 0.04, 0.25),
        h: (userBaseColor.h - 1 + 360) % 360,
      },
    };
  } else if (monoPalType === "neutralMono") {
    // Neutral - very low chroma, subtle variations
    palette = {
      darkest: {
        l: clamp(lightnessScale.darkest, 0.1, 0.98),
        c: clamp(userBaseColor.c * 0.8, 0.01, 0.12),
        h: userBaseColor.h,
      },
      darker: {
        l: clamp(lightnessScale.darker, 0.1, 0.98),
        c: clamp(userBaseColor.c * 0.9, 0.01, 0.12),
        h: userBaseColor.h,
      },
      dark: {
        l: clamp(lightnessScale.dark, 0.1, 0.98),
        c: clamp(userBaseColor.c, 0.01, 0.12),
        h: userBaseColor.h,
      },
      darkerNeutral: {
        l: clamp(lightnessScale.darker, 0.1, 0.98),
        c: clamp(userBaseColor.c * 0.3, 0.01, 0.12),
        h: userBaseColor.h,
      },
      mutedDarker: {
        l: clamp(lightnessScale.darker * 0.95, 0.1, 0.98),
        c: clamp(userBaseColor.c * 0.55, 0.01, 0.12),
        h: userBaseColor.h,
      },
      base: {
        l: clamp(userBaseColor.l, 0.1, 0.98),
        c: clamp(userBaseColor.c, 0.01, 0.12),
        h: userBaseColor.h,
      },
      light: {
        l: clamp(lightnessScale.light, 0.1, 0.98),
        c: clamp(userBaseColor.c * 0.9, 0.01, 0.12),
        h: userBaseColor.h,
      },
      lighter: {
        l: clamp(lightnessScale.lighter, 0.1, 0.98),
        c: clamp(userBaseColor.c * 0.75, 0.01, 0.12),
        h: userBaseColor.h,
      },
      lightest: {
        l: clamp(lightnessScale.lightest, 0.1, 0.98),
        c: clamp(userBaseColor.c * 0.6, 0.01, 0.12),
        h: userBaseColor.h,
      },
      lighterNeutral: {
        l: clamp(lightnessScale.lighter, 0.1, 0.98),
        c: clamp(userBaseColor.c * 0.25, 0.01, 0.12),
        h: userBaseColor.h,
      },
      mutedLighter: {
        l: clamp(lightnessScale.light * 1.05, 0.1, 0.98),
        c: clamp(userBaseColor.c * 0.5, 0.01, 0.12),
        h: userBaseColor.h,
      },
    };
  } else if (monoPalType === "kidsMono") {
    // Kids - vibrant, high chroma maintained
    palette = {
      darkest: {
        l: clamp(lightnessScale.darkest, 0.25, 0.95),
        c: clamp(userBaseColor.c * 1.15, 0.08, 0.35),
        h: userBaseColor.h,
      },
      darker: {
        l: clamp(lightnessScale.darker, 0.25, 0.95),
        c: clamp(userBaseColor.c * 1.1, 0.08, 0.35),
        h: userBaseColor.h,
      },
      dark: {
        l: clamp(lightnessScale.dark, 0.25, 0.95),
        c: clamp(userBaseColor.c * 1.05, 0.08, 0.35),
        h: userBaseColor.h,
      },
      darkerNeutral: {
        l: clamp(lightnessScale.darker, 0.25, 0.95),
        c: clamp(userBaseColor.c * 0.5, 0.08, 0.35),
        h: userBaseColor.h,
      },
      mutedDarker: {
        l: clamp(lightnessScale.darker * 0.95, 0.25, 0.95),
        c: clamp(userBaseColor.c * 0.75, 0.08, 0.35),
        h: userBaseColor.h,
      },
      base: {
        l: clamp(userBaseColor.l, 0.25, 0.95),
        c: clamp(userBaseColor.c, 0.08, 0.35),
        h: userBaseColor.h,
      },
      light: {
        l: clamp(lightnessScale.light, 0.25, 0.95),
        c: clamp(userBaseColor.c * 0.95, 0.08, 0.35),
        h: userBaseColor.h,
      },
      lighter: {
        l: clamp(lightnessScale.lighter, 0.25, 0.95),
        c: clamp(userBaseColor.c * 0.85, 0.08, 0.35),
        h: userBaseColor.h,
      },
      lightest: {
        l: clamp(lightnessScale.lightest, 0.25, 0.95),
        c: clamp(userBaseColor.c * 0.75, 0.08, 0.35),
        h: userBaseColor.h,
      },
      lighterNeutral: {
        l: clamp(lightnessScale.lighter, 0.25, 0.95),
        c: clamp(userBaseColor.c * 0.5, 0.08, 0.35),
        h: userBaseColor.h,
      },
      mutedLighter: {
        l: clamp(lightnessScale.light * 1.05, 0.25, 0.95),
        c: clamp(userBaseColor.c * 0.7, 0.08, 0.35),
        h: userBaseColor.h,
      },
    };
  } else {
    // Default to classicMono
    palette = {
      darkest: {
        l: clamp(lightnessScale.darkest, 0, 1),
        c: userBaseColor.c,
        h: userBaseColor.h,
      },
      darker: {
        l: clamp(lightnessScale.darker, 0, 1),
        c: userBaseColor.c,
        h: userBaseColor.h,
      },
      dark: {
        l: clamp(lightnessScale.dark, 0, 1),
        c: userBaseColor.c,
        h: userBaseColor.h,
      },
      darkerNeutral: {
        l: clamp(lightnessScale.darker, 0, 1),
        c: clamp(userBaseColor.c * 0.3, 0, 0.4),
        h: userBaseColor.h,
      },
      mutedDarker: {
        l: clamp(lightnessScale.darker * 0.95, 0, 1),
        c: clamp(userBaseColor.c * 0.6, 0, 0.4),
        h: userBaseColor.h,
      },
      base: userBaseColor,
      light: {
        l: clamp(lightnessScale.light, 0, 1),
        c: userBaseColor.c,
        h: userBaseColor.h,
      },
      lighter: {
        l: clamp(lightnessScale.lighter, 0, 1),
        c: userBaseColor.c,
        h: userBaseColor.h,
      },
      lightest: {
        l: clamp(lightnessScale.lightest, 0, 1),
        c: userBaseColor.c,
        h: userBaseColor.h,
      },
      lighterNeutral: {
        l: clamp(lightnessScale.lighter, 0, 1),
        c: clamp(userBaseColor.c * 0.3, 0, 0.4),
        h: userBaseColor.h,
      },
      mutedLighter: {
        l: clamp(lightnessScale.light * 1.05, 0, 1),
        c: clamp(userBaseColor.c * 0.6, 0, 0.4),
        h: userBaseColor.h,
      },
    };
  }

  // Return in proper darkest-to-lightest order
  return [
    { name: "Base-DDD", value: palette.darkest },
    { name: "Base-DD", value: palette.darker },
    { name: "Base-DN", value: palette.darkerNeutral },
    { name: "Base-MD", value: palette.mutedDarker },
    { name: "Base-D", value: palette.dark },
    { name: "Base", value: palette.base },
    { name: "Base-L", value: palette.light },
    { name: "Base-ML", value: palette.mutedLighter },
    { name: "Base-LN", value: palette.lighterNeutral },
    { name: "Base-LL", value: palette.lighter },
    { name: "Base-LLL", value: palette.lightest },
  ];
}

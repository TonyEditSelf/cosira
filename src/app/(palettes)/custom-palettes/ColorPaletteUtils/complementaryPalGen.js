export default function complementaryPalGen(
  oklch,
  compPalType,
  sliderLightValue = 0,
  sliderChromaValue = 0
) {
  console.log("sliderLightValue: ", sliderLightValue);
  console.log("sliderChromaValue: ", sliderChromaValue);
  if (compPalType === "classicComp") {
    const baseColor = oklch;

    // Base variants (balanced classic adjustments)
    const darkestBase = {
      ...baseColor,
      c: Math.min(0.25, Math.max(0.05, baseColor.c * 1.15)), // subtle boost in darks
      l: Math.max(0.25, baseColor.l - 0.28),
    };

    const darkBase = {
      ...baseColor,
      c: Math.min(0.25, Math.max(0.05, baseColor.c * 1.08)),
      l: Math.max(0.25, baseColor.l - 0.15),
    };

    const lightBase = {
      ...baseColor,
      c: Math.min(0.25, Math.max(0.05, baseColor.c * 0.93)), // subtle desaturation
      l: Math.min(0.92, baseColor.l + 0.12),
    };

    const lightestBase = {
      ...baseColor,
      c: Math.min(0.25, Math.max(0.05, baseColor.c * 0.85)),
      l: Math.min(0.95, baseColor.l + 0.28),
    };

    // Complementary color (balanced classic)
    const compColor = {
      ...baseColor,
      h: (baseColor.h + 180) % 360,
      c: baseColor.c, // same saturation for balance
    };

    const darkestComp = {
      ...compColor,
      c: Math.min(0.25, Math.max(0.05, compColor.c * 1.15)),
      l: Math.max(0.25, compColor.l - 0.28),
    };

    const darkComp = {
      ...compColor,
      c: Math.min(0.25, Math.max(0.05, compColor.c * 1.08)),
      l: Math.max(0.25, compColor.l - 0.15),
    };

    const lightComp = {
      ...compColor,
      c: Math.min(0.25, Math.max(0.05, compColor.c * 0.93)),
      l: Math.min(0.92, compColor.l + 0.12),
    };

    const lightestComp = {
      ...compColor,
      c: Math.min(0.25, Math.max(0.05, compColor.c * 0.85)),
      l: Math.min(0.95, compColor.l + 0.28),
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
  } else if (compPalType === "vibrantComp") {
    const baseColor = oklch;

    // Base variants (vibrant with proper lightness)
    const darkestBase = {
      ...baseColor,
      c: Math.min(0.37, Math.max(0.18, baseColor.c * 1.35)), // boost chroma in darks
      l: Math.max(0.25, baseColor.l - 0.25),
    };

    const darkBase = {
      ...baseColor,
      c: Math.min(0.37, Math.max(0.18, baseColor.c * 1.18)),
      l: Math.max(0.25, baseColor.l - 0.15),
    };

    const lightBase = {
      ...baseColor,
      c: Math.min(0.37, Math.max(0.15, baseColor.c * 0.95)), // maintain vibrance
      l: Math.min(0.92, baseColor.l + 0.12),
    };

    const lightestBase = {
      ...baseColor,
      c: Math.min(0.37, Math.max(0.12, baseColor.c * 0.85)), // still vibrant
      l: Math.min(0.95, baseColor.l + 0.22),
    };

    // Complementary color (hue + 180) - boosted for vibrancy
    const compColor = {
      ...baseColor,
      h: (baseColor.h + 180) % 360,
      c: Math.min(0.37, Math.max(0.18, baseColor.c * 1.08)), // complement more saturated
    };

    const darkestComp = {
      ...compColor,
      c: Math.min(0.37, Math.max(0.18, compColor.c * 1.35)),
      l: Math.max(0.25, compColor.l - 0.25),
    };

    const darkComp = {
      ...compColor,
      c: Math.min(0.37, Math.max(0.18, compColor.c * 1.18)),
      l: Math.max(0.25, compColor.l - 0.15),
    };

    const lightComp = {
      ...compColor,
      c: Math.min(0.37, Math.max(0.15, compColor.c * 0.95)),
      l: Math.min(0.92, compColor.l + 0.12),
    };

    const lightestComp = {
      ...compColor,
      c: Math.min(0.37, Math.max(0.12, compColor.c * 0.85)),
      l: Math.min(0.95, compColor.l + 0.22),
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
  } else if (compPalType === "vintageComp") {
    const LMAX = 0.68; // softer highlights (vintage = faded)
    const LMIN = 0.38; // deeper but not crushed shadows
    const CMAX = 0.14; // lower saturation ceiling for authentic vintage
    const CMIN = 0.04; // nearly grayscale at minimum

    const baseColor = {
      ...oklch,
      l: Math.max(LMIN, Math.min(LMAX, 0.53 + sliderLightValue)), // tighter range
      c: Math.max(CMIN, Math.min(CMAX, 0.09 + sliderChromaValue)), // more muted baseline
    };

    // --- Base tonal steps (vintage-specific curves) ---
    const darkestBase = {
      ...baseColor,
      l: Math.max(LMIN, baseColor.l * 0.75), // proportional darkening
      c: Math.min(CMAX, baseColor.c * 1.15), // slight chroma boost in shadows
      h: (baseColor.h - 3 + 360) % 360, // warmer in shadows
    };

    const darkBase = {
      ...baseColor,
      l: Math.max(LMIN, baseColor.l * 0.88),
      c: Math.min(CMAX, baseColor.c * 1.08),
      h: (baseColor.h - 1.5 + 360) % 360,
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(LMAX, baseColor.l + (LMAX - baseColor.l) * 0.35),
      c: Math.max(CMIN, baseColor.c * 0.85), // desaturate highlights (vintage fade)
      h: (baseColor.h + 2) % 360, // slightly yellower in highlights
    };

    const lightestBase = {
      ...baseColor,
      l: Math.min(LMAX, baseColor.l + (LMAX - baseColor.l) * 0.6),
      c: Math.max(CMIN, baseColor.c * 0.7), // strong desaturation (faded film)
      h: (baseColor.h + 4) % 360,
    };

    // --- Complementary (vintage teal/cyan bias) ---
    const compHue = (baseColor.h + 175) % 360; // slightly less than 180° for vintage color theory
    const compColor = {
      ...baseColor,
      h: compHue,
      l: baseColor.l * 0.96, // slightly darker complement (vintage asymmetry)
      c: baseColor.c * 0.78, // more muted than base (vintage balance)
    };

    // --- Complement tonal steps (asymmetric vintage curves) ---
    const darkestComp = {
      ...compColor,
      l: Math.max(LMIN, compColor.l * 0.72),
      c: Math.min(CMAX, compColor.c * 1.2), // cooler shadows can be slightly richer
      h: (compHue - 4 + 360) % 360, // shift toward blue in shadows
    };

    const darkComp = {
      ...compColor,
      l: Math.max(LMIN, compColor.l * 0.86),
      c: Math.min(CMAX, compColor.c * 1.1),
      h: (compHue - 2 + 360) % 360,
    };

    const lightComp = {
      ...compColor,
      l: Math.min(LMAX, compColor.l + (LMAX - compColor.l) * 0.4),
      c: Math.max(CMIN, compColor.c * 0.82),
      h: (compHue + 3) % 360, // shift toward cyan in highlights
    };

    const lightestComp = {
      ...compColor,
      l: Math.min(LMAX, compColor.l + (LMAX - compColor.l) * 0.65),
      c: Math.max(CMIN, compColor.c * 0.65),
      h: (compHue + 5) % 360,
    };

    // --- Return vintage palette (same structure) ---
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
  } else if (compPalType === "neutralComp") {
    // --- Hue-dominant neutral constraints ---
    const LMAX = 0.96; // near-white highlights
    const LMIN = 0.18; // deep shadows
    const CMAX = 0.08; // subtle hue presence (neutral but not gray)
    const CMIN = 0.02; // nearly achromatic

    // --- Base color (neutral with hue bias) ---
    const baseColor = {
      ...oklch,
      l: Math.max(LMIN, Math.min(LMAX, 0.57 + sliderLightValue)), // mid-tone base
      c: Math.max(CMIN, Math.min(CMAX, 0.05 + sliderChromaValue)), // subtle chroma
    };

    // --- Base tonal steps (wide neutral range) ---
    const darkestBase = {
      ...baseColor,
      l: Math.max(LMIN, baseColor.l * 0.35), // deep shadow
      c: Math.min(CMAX, baseColor.c * 1.3), // slightly more hue in darks
    };

    const darkBase = {
      ...baseColor,
      l: Math.max(LMIN, baseColor.l * 0.65),
      c: Math.min(CMAX, baseColor.c * 1.15),
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(LMAX, baseColor.l + (LMAX - baseColor.l) * 0.45),
      c: Math.max(CMIN, baseColor.c * 0.85), // less hue in lights
    };

    const lightestBase = {
      ...baseColor,
      l: Math.min(LMAX, baseColor.l + (LMAX - baseColor.l) * 0.75),
      c: Math.max(CMIN, baseColor.c * 0.6), // subtle hint in near-white
    };

    // --- Complementary neutral (opposite hue bias) ---
    const compColor = {
      ...baseColor,
      h: (baseColor.h + 180) % 360, // opposite hue
      c: baseColor.c * 0.9, // slightly less saturated than base
    };

    // --- Complement tonal steps (matching neutrality) ---
    const darkestComp = {
      ...compColor,
      l: Math.max(LMIN, compColor.l * 0.35),
      c: Math.min(CMAX, compColor.c * 1.3),
    };

    const darkComp = {
      ...compColor,
      l: Math.max(LMIN, compColor.l * 0.65),
      c: Math.min(CMAX, compColor.c * 1.15),
    };

    const lightComp = {
      ...compColor,
      l: Math.min(LMAX, compColor.l + (LMAX - compColor.l) * 0.45),
      c: Math.max(CMIN, compColor.c * 0.85),
    };

    const lightestComp = {
      ...compColor,
      l: Math.min(LMAX, compColor.l + (LMAX - compColor.l) * 0.75),
      c: Math.max(CMIN, compColor.c * 0.6),
    };

    // --- Return hue-dominant neutral palette ---
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
  } else if (compPalType === "kidsComp") {
    // --- Kid-friendly vibrant constraints ---
    const LMAX = 0.88; // bright, cheerful highlights
    const LMIN = 0.35; // deeper but still playful shadows
    const CMAX = 0.28; // high saturation for vibrant colors
    const CMIN = 0.15; // minimum is still fairly saturated (no dull colors)

    // --- Base color (bright, energetic tone) ---
    const baseColor = {
      ...oklch,
      l: Math.max(LMIN, Math.min(LMAX, 0.62 + sliderLightValue)), // bright, cheerful base
      c: Math.max(CMIN, Math.min(CMAX, 0.22 + sliderChromaValue)), // vibrant baseline
    };

    // --- Base tonal steps (playful contrast) ---
    const darkestBase = {
      ...baseColor,
      l: Math.max(LMIN, baseColor.l - 0.28), // stronger contrast for fun
      c: Math.min(CMAX, baseColor.c * 1.15), // boost saturation in darks (rich colors)
    };

    const darkBase = {
      ...baseColor,
      l: Math.max(LMIN, baseColor.l - 0.16),
      c: Math.min(CMAX, baseColor.c * 1.08),
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(LMAX, baseColor.l + 0.14),
      c: Math.max(CMIN, baseColor.c * 0.95), // keep saturation in lights (energetic)
    };

    const lightestBase = {
      ...baseColor,
      l: Math.min(LMAX, baseColor.l + 0.2),
      c: Math.max(CMIN, baseColor.c * 0.85), // slight desaturation at brightest (pastel touch)
    };

    // --- Complementary color (playful contrast) ---
    const compColor = {
      ...baseColor,
      h: (baseColor.h + 180) % 360, // true complementary for bold contrast
      c: baseColor.c * 1.05, // complement can be slightly MORE saturated
    };

    // --- Complement tonal steps (symmetric for balance) ---
    const darkestComp = {
      ...compColor,
      l: Math.max(LMIN, compColor.l - 0.28),
      c: Math.min(CMAX, compColor.c * 1.15),
    };

    const darkComp = {
      ...compColor,
      l: Math.max(LMIN, compColor.l - 0.16),
      c: Math.min(CMAX, compColor.c * 1.08),
    };

    const lightComp = {
      ...compColor,
      l: Math.min(LMAX, compColor.l + 0.14),
      c: Math.max(CMIN, compColor.c * 0.95),
    };

    const lightestComp = {
      ...compColor,
      l: Math.min(LMAX, compColor.l + 0.2),
      c: Math.max(CMIN, compColor.c * 0.85),
    };

    // --- Return kid-friendly vibrant palette ---
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
  } else if (compPalType === "luxuriousComp") {
    const LMAX = 0.72; // soft, refined highlights (not too bright)
    const LMIN = 0.22; // deep, rich shadows
    const CMAX = 0.18; // controlled saturation for sophistication
    const CMIN = 0.06; // muted baseline (elegant restraint)

    // --- Base color (refined, sophisticated tone) ---
    const baseColor = {
      ...oklch,
      l: Math.max(LMIN, Math.min(LMAX, 0.47 + sliderLightValue)), // mid-dark luxe base
      c: Math.max(CMIN, Math.min(CMAX, 0.12 + sliderChromaValue)), // muted elegance
    };

    // --- Base tonal steps (refined contrast) ---
    const darkestBase = {
      ...baseColor,
      l: Math.max(LMIN, baseColor.l - 0.22), // deep, jewel-like
      c: Math.min(CMAX, baseColor.c * 1.25), // richer in shadows (depth)
    };

    const darkBase = {
      ...baseColor,
      l: Math.max(LMIN, baseColor.l - 0.12),
      c: Math.min(CMAX, baseColor.c * 1.12),
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(LMAX, baseColor.l + 0.16),
      c: Math.max(CMIN, baseColor.c * 0.88), // subtle desaturation (refined)
    };

    const lightestBase = {
      ...baseColor,
      l: Math.min(LMAX, baseColor.l + 0.24),
      c: Math.max(CMIN, baseColor.c * 0.72), // champagne-like softness
    };

    // --- Complementary color (sophisticated contrast) ---
    const compColor = {
      ...baseColor,
      h: (baseColor.h + 175) % 360, // slightly asymmetric (more refined)
      l: baseColor.l * 0.94, // complement slightly darker (balance)
      c: baseColor.c * 0.92, // slightly more muted (elegant restraint)
    };

    // --- Complement tonal steps (refined balance) ---
    const darkestComp = {
      ...compColor,
      l: Math.max(LMIN, compColor.l - 0.22),
      c: Math.min(CMAX, compColor.c * 1.28), // rich jewel tones
    };

    const darkComp = {
      ...compColor,
      l: Math.max(LMIN, compColor.l - 0.12),
      c: Math.min(CMAX, compColor.c * 1.12),
    };

    const lightComp = {
      ...compColor,
      l: Math.min(LMAX, compColor.l + 0.16),
      c: Math.max(CMIN, compColor.c * 0.88),
    };

    const lightestComp = {
      ...compColor,
      l: Math.min(LMAX, compColor.l + 0.24),
      c: Math.max(CMIN, compColor.c * 0.72),
    };

    // --- Return luxurious complementary palette ---
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
  } else if (compPalType === "moodyComp") {
    const LMAX = 0.58; // subdued highlights (moody = dark atmosphere)
    const LMIN = 0.18; // deep, dramatic shadows
    const CMAX = 0.19; // controlled saturation for mood
    const CMIN = 0.03; // can go quite desaturated

    const baseColor = {
      ...oklch,
      l: Math.max(LMIN, Math.min(LMAX, 0.38 + sliderLightValue)), // darker base for mood
      c: Math.max(CMIN, Math.min(CMAX, 0.11 + sliderChromaValue)), // medium-muted baseline
    };

    // --- Base tonal steps (dramatic moody curves) ---
    const darkestBase = {
      ...baseColor,
      l: Math.max(LMIN, baseColor.l * 0.55), // deep, atmospheric shadows
      c: Math.min(CMAX, baseColor.c * 1.3), // richer in darks (depth)
      h: (baseColor.h - 5 + 360) % 360, // subtle shift toward cooler
    };

    const darkBase = {
      ...baseColor,
      l: Math.max(LMIN, baseColor.l * 0.78),
      c: Math.min(CMAX, baseColor.c * 1.15),
      h: (baseColor.h - 2 + 360) % 360,
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(LMAX, baseColor.l + (LMAX - baseColor.l) * 0.5),
      c: Math.max(CMIN, baseColor.c * 0.88), // maintain some saturation
      h: (baseColor.h + 1) % 360, // minimal shift in highlights
    };

    const lightestBase = {
      ...baseColor,
      l: Math.min(LMAX, baseColor.l + (LMAX - baseColor.l) * 0.8),
      c: Math.max(CMIN, baseColor.c * 0.75), // desaturated but not washed out
      h: (baseColor.h + 2) % 360,
    };

    // --- Complementary (moody atmospheric contrast) ---
    const compHue = (baseColor.h + 180) % 360; // true complementary for drama
    const compColor = {
      ...baseColor,
      h: compHue,
      l: baseColor.l * 0.88, // notably darker complement (moody asymmetry)
      c: baseColor.c * 0.92, // slightly more muted
    };

    // --- Complement tonal steps (dramatic moody curves) ---
    const darkestComp = {
      ...compColor,
      l: Math.max(LMIN, compColor.l * 0.5), // very deep shadows
      c: Math.min(CMAX, compColor.c * 1.35), // rich, saturated darks
      h: (compHue - 6 + 360) % 360, // dramatic hue shift in shadows
    };

    const darkComp = {
      ...compColor,
      l: Math.max(LMIN, compColor.l * 0.75),
      c: Math.min(CMAX, compColor.c * 1.18),
      h: (compHue - 3 + 360) % 360,
    };

    const lightComp = {
      ...compColor,
      l: Math.min(LMAX, compColor.l + (LMAX - compColor.l) * 0.55),
      c: Math.max(CMIN, compColor.c * 0.85),
      h: (compHue + 2) % 360,
    };

    const lightestComp = {
      ...compColor,
      l: Math.min(LMAX, compColor.l + (LMAX - compColor.l) * 0.85),
      c: Math.max(CMIN, compColor.c * 0.7),
      h: (compHue + 3) % 360,
    };

    // --- Return moody complementary palette ---
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
  } else if (compPalType === "pastelComp") {
    const LMAX = 0.94; // bright, airy highlights (pastel = light)
    const LMIN = 0.68; // soft shadows (pastels don't go dark)
    const CMAX = 0.16; // gentle saturation for softness
    const CMIN = 0.06; // can be quite muted but still colorful

    const baseColor = {
      ...oklch,
      l: Math.max(LMIN, Math.min(LMAX, 0.81 + sliderLightValue)), // light, dreamy base
      c: Math.max(CMIN, Math.min(CMAX, 0.11 + sliderChromaValue)), // soft chroma baseline
    };

    // --- Base tonal steps (gentle pastel curves) ---
    const darkestBase = {
      ...baseColor,
      l: Math.max(LMIN, baseColor.l * 0.88), // gentle darkening only
      c: Math.min(CMAX, baseColor.c * 1.12), // subtle chroma boost
      h: (baseColor.h - 1 + 360) % 360, // minimal hue shift
    };

    const darkBase = {
      ...baseColor,
      l: Math.max(LMIN, baseColor.l * 0.94),
      c: Math.min(CMAX, baseColor.c * 1.06),
      h: (baseColor.h - 0.5 + 360) % 360,
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(LMAX, baseColor.l + (LMAX - baseColor.l) * 0.45),
      c: Math.max(CMIN, baseColor.c * 0.92), // gentle desaturation
      h: (baseColor.h + 0.5) % 360, // very subtle shift
    };

    const lightestBase = {
      ...baseColor,
      l: Math.min(LMAX, baseColor.l + (LMAX - baseColor.l) * 0.75),
      c: Math.max(CMIN, baseColor.c * 0.8), // softer at lightest
      h: (baseColor.h + 1) % 360,
    };

    // --- Complementary (soft, balanced contrast) ---
    const compHue = (baseColor.h + 180) % 360; // true complementary
    const compColor = {
      ...baseColor,
      h: compHue,
      l: baseColor.l * 0.98, // similar lightness (pastel balance)
      c: baseColor.c * 0.96, // just slightly more muted
    };

    // --- Complement tonal steps (gentle, symmetric curves) ---
    const darkestComp = {
      ...compColor,
      l: Math.max(LMIN, compColor.l * 0.88),
      c: Math.min(CMAX, compColor.c * 1.12),
      h: (compHue - 1 + 360) % 360,
    };

    const darkComp = {
      ...compColor,
      l: Math.max(LMIN, compColor.l * 0.94),
      c: Math.min(CMAX, compColor.c * 1.06),
      h: (compHue - 0.5 + 360) % 360,
    };

    const lightComp = {
      ...compColor,
      l: Math.min(LMAX, compColor.l + (LMAX - compColor.l) * 0.45),
      c: Math.max(CMIN, compColor.c * 0.92),
      h: (compHue + 0.5) % 360,
    };

    const lightestComp = {
      ...compColor,
      l: Math.min(LMAX, compColor.l + (LMAX - compColor.l) * 0.75),
      c: Math.max(CMIN, compColor.c * 0.8),
      h: (compHue + 1) % 360,
    };

    // --- Return pastel complementary palette ---
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
  } else if (compPalType === "neonComp") {
    const LMAX = 0.85; // bright but not washed out (neon glow)
    const LMIN = 0.28; // can go dark but stay electric
    const CMAX = 0.37; // maximum saturation for neon intensity
    const CMIN = 0.2; // even darks are highly saturated

    const baseColor = {
      ...oklch,
      l: Math.max(LMIN, Math.min(LMAX, 0.72 + sliderLightValue)), // neon sweet spot
      c: Math.max(CMIN, Math.min(CMAX, 0.3 + sliderChromaValue)), // intensely saturated baseline
    };

    // --- Base tonal steps (electric neon curves) ---
    const darkestBase = {
      ...baseColor,
      l: Math.max(LMIN, baseColor.l * 0.5), // deep but electric
      c: Math.min(CMAX, baseColor.c * 1.15), // boost saturation in darks
      h: baseColor.h, // pure hue for neon clarity
    };

    const darkBase = {
      ...baseColor,
      l: Math.max(LMIN, baseColor.l * 0.75),
      c: Math.min(CMAX, baseColor.c * 1.08),
      h: baseColor.h,
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(LMAX, baseColor.l + (LMAX - baseColor.l) * 0.5),
      c: Math.min(CMAX, baseColor.c * 0.98), // maintain intensity
      h: baseColor.h,
    };

    const lightestBase = {
      ...baseColor,
      l: Math.min(LMAX, baseColor.l + (LMAX - baseColor.l) * 0.8),
      c: Math.max(CMIN, baseColor.c * 0.92), // slight reduction but still vibrant
      h: baseColor.h,
    };

    // --- Complementary (electric contrast) ---
    const compHue = (baseColor.h + 180) % 360; // true complementary for maximum impact
    const compColor = {
      ...baseColor,
      h: compHue,
      l: baseColor.l, // same lightness for balanced glow
      c: Math.min(CMAX, baseColor.c * 1.05), // complement can be MORE saturated
    };

    // --- Complement tonal steps (symmetric electric curves) ---
    const darkestComp = {
      ...compColor,
      l: Math.max(LMIN, compColor.l * 0.5),
      c: Math.min(CMAX, compColor.c * 1.15),
      h: compHue,
    };

    const darkComp = {
      ...compColor,
      l: Math.max(LMIN, compColor.l * 0.75),
      c: Math.min(CMAX, compColor.c * 1.08),
      h: compHue,
    };

    const lightComp = {
      ...compColor,
      l: Math.min(LMAX, compColor.l + (LMAX - compColor.l) * 0.5),
      c: Math.min(CMAX, compColor.c * 0.98),
      h: compHue,
    };

    const lightestComp = {
      ...compColor,
      l: Math.min(LMAX, compColor.l + (LMAX - compColor.l) * 0.8),
      c: Math.max(CMIN, compColor.c * 0.92),
      h: compHue,
    };

    // --- Return neon complementary palette ---
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
  } else if (compPalType === "retroComp") {
    const LMAX = 0.78; // warm, saturated highlights (retro glow)
    const LMIN = 0.42; // rich midtones (70s vibe)
    const CMAX = 0.24; // bold saturation for retro pop
    const CMIN = 0.12; // still colorful at minimum

    const baseColor = {
      ...oklch,
      l: Math.max(LMIN, Math.min(LMAX, 0.6 + sliderLightValue)), // warm retro base
      c: Math.max(CMIN, Math.min(CMAX, 0.18 + sliderChromaValue)), // punchy baseline
    };

    // --- Base tonal steps (retro curves with hue shifts) ---
    const darkestBase = {
      ...baseColor,
      l: Math.max(LMIN, baseColor.l * 0.75),
      c: Math.min(CMAX, baseColor.c * 1.18), // richer in darks
      h: (baseColor.h - 8 + 360) % 360, // warm shift (toward orange/red)
    };

    const darkBase = {
      ...baseColor,
      l: Math.max(LMIN, baseColor.l * 0.88),
      c: Math.min(CMAX, baseColor.c * 1.1),
      h: (baseColor.h - 4 + 360) % 360,
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(LMAX, baseColor.l + (LMAX - baseColor.l) * 0.55),
      c: Math.max(CMIN, baseColor.c * 0.94), // maintain boldness
      h: (baseColor.h + 3) % 360, // slight yellow shift in lights
    };

    const lightestBase = {
      ...baseColor,
      l: Math.min(LMAX, baseColor.l + (LMAX - baseColor.l) * 0.85),
      c: Math.max(CMIN, baseColor.c * 0.85), // still punchy
      h: (baseColor.h + 6) % 360,
    };

    // --- Complementary (funky retro contrast) ---
    const compHue = (baseColor.h + 185) % 360; // slightly off for retro feel
    const compColor = {
      ...baseColor,
      h: compHue,
      l: baseColor.l * 0.96, // slightly asymmetric
      c: baseColor.c * 1.02, // complement can be punchier
    };

    // --- Complement tonal steps (retro asymmetry) ---
    const darkestComp = {
      ...compColor,
      l: Math.max(LMIN, compColor.l * 0.72),
      c: Math.min(CMAX, compColor.c * 1.2),
      h: (compHue - 10 + 360) % 360, // cool shift (toward blue/teal)
    };

    const darkComp = {
      ...compColor,
      l: Math.max(LMIN, compColor.l * 0.86),
      c: Math.min(CMAX, compColor.c * 1.12),
      h: (compHue - 5 + 360) % 360,
    };

    const lightComp = {
      ...compColor,
      l: Math.min(LMAX, compColor.l + (LMAX - compColor.l) * 0.6),
      c: Math.max(CMIN, compColor.c * 0.92),
      h: (compHue + 4) % 360,
    };

    const lightestComp = {
      ...compColor,
      l: Math.min(LMAX, compColor.l + (LMAX - compColor.l) * 0.9),
      c: Math.max(CMIN, compColor.c * 0.82),
      h: (compHue + 7) % 360,
    };

    // --- Return retro complementary palette ---
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
  } else if (compPalType === "earthyComp") {
    const LMAX = 0.7; // natural, subdued highlights
    const LMIN = 0.32; // warm, organic shadows
    const CMAX = 0.15; // muted, natural saturation
    const CMIN = 0.04; // can be quite desaturated (clay/stone)

    const baseColor = {
      ...oklch,
      l: Math.max(LMIN, Math.min(LMAX, 0.52 + sliderLightValue)), // earthy mid-tone
      c: Math.max(CMIN, Math.min(CMAX, 0.09 + sliderChromaValue)), // natural muted baseline
    };

    // --- Base tonal steps (organic earthy curves) ---
    const darkestBase = {
      ...baseColor,
      l: Math.max(LMIN, baseColor.l * 0.7), // rich soil darkness
      c: Math.min(CMAX, baseColor.c * 1.25), // deeper tones more saturated
      h: (baseColor.h - 4 + 360) % 360, // warmer in shadows (clay/bark)
    };

    const darkBase = {
      ...baseColor,
      l: Math.max(LMIN, baseColor.l * 0.85),
      c: Math.min(CMAX, baseColor.c * 1.12),
      h: (baseColor.h - 2 + 360) % 360,
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(LMAX, baseColor.l + (LMAX - baseColor.l) * 0.5),
      c: Math.max(CMIN, baseColor.c * 0.88), // desaturate in lights (sandy)
      h: (baseColor.h + 1.5) % 360, // subtle warm shift
    };

    const lightestBase = {
      ...baseColor,
      l: Math.min(LMAX, baseColor.l + (LMAX - baseColor.l) * 0.8),
      c: Math.max(CMIN, baseColor.c * 0.72), // very muted (stone/cream)
      h: (baseColor.h + 3) % 360,
    };

    // --- Complementary (natural balance) ---
    const compHue = (baseColor.h + 170) % 360; // slightly off for organic feel
    const compColor = {
      ...baseColor,
      h: compHue,
      l: baseColor.l * 0.94, // slightly darker (natural asymmetry)
      c: baseColor.c * 0.85, // more muted (forest/sage)
    };

    // --- Complement tonal steps (organic asymmetry) ---
    const darkestComp = {
      ...compColor,
      l: Math.max(LMIN, compColor.l * 0.68),
      c: Math.min(CMAX, compColor.c * 1.28), // rich forest darks
      h: (compHue - 5 + 360) % 360, // cooler in shadows (moss/pine)
    };

    const darkComp = {
      ...compColor,
      l: Math.max(LMIN, compColor.l * 0.83),
      c: Math.min(CMAX, compColor.c * 1.14),
      h: (compHue - 2.5 + 360) % 360,
    };

    const lightComp = {
      ...compColor,
      l: Math.min(LMAX, compColor.l + (LMAX - compColor.l) * 0.52),
      c: Math.max(CMIN, compColor.c * 0.86),
      h: (compHue + 2) % 360,
    };

    const lightestComp = {
      ...compColor,
      l: Math.min(LMAX, compColor.l + (LMAX - compColor.l) * 0.82),
      c: Math.max(CMIN, compColor.c * 0.7),
      h: (compHue + 3.5) % 360,
    };

    // --- Return earthy complementary palette ---
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
  }
}

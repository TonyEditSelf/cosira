export default function complementaryPalGen(
  oklch,
  compPalType,
  sliderLightValue = 0,
  sliderChromaValue = 0
) {
  if (compPalType === "classicComp") {
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
  } else if (compPalType === "vibrantComp") {
    const baseColor = oklch;

    // Base variants (vibrant with proper lightness)
    const darkestBase = {
      ...baseColor,
      c: Math.min(0.37, baseColor.c * 1.35), // boost chroma in darks (vibrant)
      l: Math.max(0.25, baseColor.l - 0.25), // darker
    };

    const darkBase = {
      ...baseColor,
      c: Math.min(0.37, baseColor.c * 1.18),
      l: Math.max(0.25, baseColor.l - 0.15),
    };

    const lightBase = {
      ...baseColor,
      c: Math.max(0.12, baseColor.c * 0.92), // maintain saturation in lights
      l: Math.min(0.92, baseColor.l + 0.12),
    };

    const lightestBase = {
      ...baseColor,
      c: Math.max(0.1, baseColor.c * 0.8), // still vibrant at lightest
      l: Math.min(0.95, baseColor.l + 0.22),
    };

    // Complementary color (hue + 180) - boosted for vibrancy
    const compColor = {
      ...baseColor,
      h: (baseColor.h + 180) % 360,
      c: Math.min(0.37, baseColor.c * 1.1), // complement slightly more saturated
    };

    const darkestComp = {
      ...compColor,
      c: Math.min(0.37, compColor.c * 1.35),
      l: Math.max(0.25, compColor.l - 0.25),
    };

    const darkComp = {
      ...compColor,
      c: Math.min(0.37, compColor.c * 1.18),
      l: Math.max(0.25, compColor.l - 0.15),
    };

    const lightComp = {
      ...compColor,
      c: Math.max(0.12, compColor.c * 0.92),
      l: Math.min(0.92, compColor.l + 0.12),
    };

    const lightestComp = {
      ...compColor,
      c: Math.max(0.1, compColor.c * 0.8),
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

    // --- Base color with vintage warmth ---
    const baseColor = {
      ...oklch,
      l: Math.max(LMIN, Math.min(LMAX, 0.54 + sliderLightValue * 0.12)), // tighter range
      c: Math.max(CMIN, Math.min(CMAX, 0.08 + sliderChromaValue * 0.06)), // more muted baseline
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
      l: Math.max(LMIN, Math.min(LMAX, 0.62 + sliderLightValue)), // mid-tone base
      c: Math.max(CMIN, Math.min(CMAX, 0.04 + sliderChromaValue)), // subtle chroma
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
      l: Math.max(LMIN, Math.min(LMAX, 0.68 + sliderLightValue)), // bright, cheerful base
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
      l: Math.max(LMIN, Math.min(LMAX, 0.48 + sliderLightValue)), // mid-dark luxe base
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
  }
}

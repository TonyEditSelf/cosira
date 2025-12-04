export default function complementaryPalGen(
  oklch,
  compPalType,
  sliderLightValue = 0,
  sliderChromaValue = 0
) {
  if (compPalType === "classicComp") {
    const LMAX = 0.95;
    const LMIN = 0.25;
    const CMAX = 0.25;
    const CMIN = 0.05;

    const baseColor = oklch;

    // Base variants (balanced classic adjustments)
    const darkestBase = {
      ...baseColor,
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.15)), // subtle boost in darks
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.28)),
    };
    0;

    const darkBase = {
      ...baseColor,
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.08)),
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.15)),
    };

    const lightBase = {
      ...baseColor,
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.93)), // subtle desaturation
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.12)), // previously matched 0.92
    };

    const lightestBase = {
      ...baseColor,
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.85)),
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.28)),
    };

    // Complementary color (balanced classic)
    const compColor = {
      ...baseColor,
      h: (baseColor.h + 180) % 360,
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c)), // same saturation for balance, but clamped
    };

    const darkestComp = {
      ...compColor,
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.15)),
      l: Math.min(LMAX, Math.max(LMIN, compColor.l - 0.28)),
    };

    const darkComp = {
      ...compColor,
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.08)),
      l: Math.min(LMAX, Math.max(LMIN, compColor.l - 0.15)),
    };

    const lightComp = {
      ...compColor,
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 0.93)),
      l: Math.min(LMAX, Math.max(LMIN, compColor.l + 0.12)),
    };

    const lightestComp = {
      ...compColor,
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 0.85)),
      l: Math.min(LMAX, Math.max(LMIN, compColor.l + 0.28)),
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
      l: Math.min(LMAX, Math.max(LMIN, 0.53 + sliderLightValue)), // tighter range
      c: Math.min(CMAX, Math.max(CMIN, 0.09 + sliderChromaValue)), // more muted baseline
    };

    // --- Base tonal steps (vintage-specific curves) ---
    const darkestBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.75)), // proportional darkening
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.15)), // slight chroma boost in shadows
      h: (baseColor.h - 3 + 360) % 360, // warmer in shadows
    };

    const darkBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.88)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.08)),
      h: (baseColor.h - 1.5 + 360) % 360,
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, baseColor.l + (LMAX - baseColor.l) * 0.35)
      ),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.85)), // desaturate highlights (vintage fade)
      h: (baseColor.h + 2) % 360, // slightly yellower in highlights
    };

    const lightestBase = {
      ...baseColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, baseColor.l + (LMAX - baseColor.l) * 0.6)
      ),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.7)), // strong desaturation (faded film)
      h: (baseColor.h + 4) % 360,
    };

    // --- Complementary (vintage teal/cyan bias) ---
    const compHue = (baseColor.h + 175) % 360; // slightly less than 180° for vintage color theory
    const compColor = {
      ...baseColor,
      h: compHue,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.96)), // slightly darker complement
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.78)), // more muted than base (vintage balance)
    };

    // --- Complement tonal steps (asymmetric vintage curves) ---
    const darkestComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l * 0.72)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.2)), // cooler shadows can be slightly richer
      h: (compHue - 4 + 360) % 360, // shift toward blue in shadows
    };

    const darkComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l * 0.86)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.1)),
      h: (compHue - 2 + 360) % 360,
    };

    const lightComp = {
      ...compColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, compColor.l + (LMAX - compColor.l) * 0.4)
      ),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 0.82)),
      h: (compHue + 3) % 360, // shift toward cyan in highlights
    };

    const lightestComp = {
      ...compColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, compColor.l + (LMAX - compColor.l) * 0.65)
      ),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 0.65)),
      h: (compHue + 5) % 360,
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
  } else if (compPalType === "80sNeonComp") {
    const LMAX = 0.85; // Blinding, electric highlights
    const LMIN = 0.3; // Crushed, deep shadows
    const CMAX = 0.4; // Extreme, artificial saturation
    const CMIN = 0.18; // Vibrant even in dark tones

    // --- Base Color (Neon glow foundation) ---
    const baseColor = {
      ...oklch,
      l: Math.min(LMAX, Math.max(LMIN, 0.6 + sliderLightValue)), // slightly higher midtone for neon glow
      c: Math.min(CMAX, Math.max(CMIN, 0.32 + sliderChromaValue)), // bold baseline chroma
    };

    // --- Base Tonal Steps (Neon-specific curves) ---
    const darkestBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.7)), // aggressive darkening for deep contrast
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.25)), // vibrant shadows
      h: (baseColor.h - 4 + 360) % 360, // warm shift (magenta/red bias in shadows)
    };

    const darkBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.82)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.12)),
      h: (baseColor.h - 2 + 360) % 360,
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, baseColor.l + (LMAX - baseColor.l) * 0.4)
      ),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.95)), // retain color vibrancy
      h: (baseColor.h + 2) % 360, // slightly cooler highlights (glow tint)
    };

    const lightestBase = {
      ...baseColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, baseColor.l + (LMAX - baseColor.l) * 0.7)
      ),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.85)), // slight desat in glow for realism
      h: (baseColor.h + 5) % 360,
    };

    // --- Complementary (Neon teal/aqua bias) ---
    const compHue = (baseColor.h + 180) % 360; // true complementary for neon vibrance
    const compColor = {
      ...baseColor,
      h: compHue,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.95)), // balanced midtone
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.9)), // slightly less saturated for contrast harmony
    };

    // --- Complement Tonal Steps (Neon asymmetric glow curve) ---
    const darkestComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l * 0.68)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.22)), // strong saturation in deep tones
      h: (compHue - 3 + 360) % 360, // shift toward blue-cyan in shadows
    };

    const darkComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l * 0.84)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.08)),
      h: (compHue - 1.5 + 360) % 360,
    };

    const lightComp = {
      ...compColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, compColor.l + (LMAX - compColor.l) * 0.45)
      ),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 0.88)), // keep glow intensity but not oversaturated
      h: (compHue + 3) % 360, // cooler cyan highlight bias
    };

    const lightestComp = {
      ...compColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, compColor.l + (LMAX - compColor.l) * 0.7)
      ),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 0.75)), // faded highlight glow
      h: (compHue + 5) % 360,
    };

    // --- Return Full 80s Neon Palette ---
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
  } else if (compPalType === "MCMComp") {
    const LMAX = 0.7; // Soft, earthen highlights
    const LMIN = 0.35; // Deep, strong shadows
    const CMAX = 0.28; // Moderate to high saturation for accents
    const CMIN = 0.06; // Slightly desaturated foundation

    // --- Base Color (MCM balanced tone foundation) ---
    const baseColor = {
      ...oklch,
      l: Math.min(LMAX, Math.max(LMIN, 0.55 + sliderLightValue)), // grounded midtone
      c: Math.min(CMAX, Math.max(CMIN, 0.18 + sliderChromaValue)), // moderate saturation baseline
    };

    // --- Base Tonal Steps (MCM-specific tonal curve) ---
    const darkestBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.78)), // natural deepening (not crushed)
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.1)), // subtle richness in shadows
      h: (baseColor.h - 2 + 360) % 360, // warm shadow bias (wood-like warmth)
    };

    const darkBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.88)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.05)),
      h: (baseColor.h - 1 + 360) % 360,
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, baseColor.l + (LMAX - baseColor.l) * 0.35)
      ),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.92)), // gently desaturated highlights
      h: (baseColor.h + 1.5) % 360, // slightly cooler for linen/light wood glow
    };

    const lightestBase = {
      ...baseColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, baseColor.l + (LMAX - baseColor.l) * 0.6)
      ),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.8)), // soft, muted highlight
      h: (baseColor.h + 3) % 360,
    };

    // --- Complementary (MCM teal/avocado balance) ---
    const compHue = (baseColor.h + 175) % 360; // slightly off-true complement for organic harmony
    const compColor = {
      ...baseColor,
      h: compHue,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.95)), // slightly darker complement
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.85)), // more muted for visual balance
    };

    // --- Complement Tonal Steps (MCM asymmetric warmth/cool balance) ---
    const darkestComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l * 0.75)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.08)), // richer cool shadows
      h: (compHue - 2 + 360) % 360, // slight blue shift for shadow coolness
    };

    const darkComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l * 0.86)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.02)),
      h: (compHue - 1 + 360) % 360,
    };

    const lightComp = {
      ...compColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, compColor.l + (LMAX - compColor.l) * 0.4)
      ),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 0.88)), // smoother highlight desat
      h: (compHue + 2) % 360, // warm neutral lift
    };

    const lightestComp = {
      ...compColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, compColor.l + (LMAX - compColor.l) * 0.65)
      ),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 0.75)),
      h: (compHue + 3.5) % 360,
    };

    // --- Return Full MCM Palette ---
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
      l: Math.min(LMAX, Math.max(LMIN, 0.57 + sliderLightValue)), // mid-tone base
      c: Math.min(CMAX, Math.max(CMIN, 0.05 + sliderChromaValue)), // subtle chroma
    };

    // --- Base tonal steps (wide neutral range) ---
    const darkestBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.35)), // deep shadow
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.3)), // slightly more hue in darks
    };

    const darkBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.65)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.15)),
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, baseColor.l + (LMAX - baseColor.l) * 0.45)
      ),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.85)), // less hue in lights
    };

    const lightestBase = {
      ...baseColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, baseColor.l + (LMAX - baseColor.l) * 0.75)
      ),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.6)), // subtle hint in near-white
    };

    // --- Complementary neutral (opposite hue bias) ---
    const compColor = {
      ...baseColor,
      h: (baseColor.h + 180) % 360, // opposite hue
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.9)), // slightly less saturated than base
    };

    // --- Complement tonal steps (matching neutrality) ---
    const darkestComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l * 0.35)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.3)),
    };

    const darkComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l * 0.65)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.15)),
    };

    const lightComp = {
      ...compColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, compColor.l + (LMAX - compColor.l) * 0.45)
      ),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 0.85)),
    };

    const lightestComp = {
      ...compColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, compColor.l + (LMAX - compColor.l) * 0.75)
      ),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 0.6)),
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
      l: Math.min(LMAX, Math.max(LMIN, 0.62 + sliderLightValue)), // bright, cheerful base
      c: Math.min(CMAX, Math.max(CMIN, 0.22 + sliderChromaValue)), // vibrant baseline
    };

    // --- Base tonal steps (playful contrast) ---
    const darkestBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.28)), // stronger contrast for fun
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.15)), // boost saturation in darks (rich colors)
    };

    const darkBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.16)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.08)),
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.14)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.95)), // keep saturation in lights (energetic)
    };

    const lightestBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.2)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.85)), // slight desaturation at brightest (pastel touch)
    };

    // --- Complementary color (playful contrast) ---
    const compColor = {
      ...baseColor,
      h: (baseColor.h + 180) % 360, // true complementary for bold contrast
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.05)), // complement can be slightly MORE saturated
    };

    // --- Complement tonal steps (symmetric for balance) ---
    const darkestComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l - 0.28)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.15)),
    };

    const darkComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l - 0.16)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.08)),
    };

    const lightComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l + 0.14)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 0.95)),
    };

    const lightestComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l + 0.2)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 0.85)),
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
      l: Math.min(LMAX, Math.max(LMIN, 0.47 + sliderLightValue)), // mid-dark luxe base
      c: Math.min(CMAX, Math.max(CMIN, 0.12 + sliderChromaValue)), // muted elegance
    };

    // --- Base tonal steps (refined contrast) ---
    const darkestBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.22)), // deep, jewel-like
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.25)), // richer in shadows (depth)
    };

    const darkBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.12)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.12)),
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.16)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.88)), // subtle desaturation (refined)
    };

    const lightestBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.24)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.72)), // champagne-like softness
    };

    // --- Complementary color (sophisticated contrast) ---
    const compColor = {
      ...baseColor,
      h: (baseColor.h + 175) % 360, // slightly asymmetric (more refined)
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.94)), // complement slightly darker (balance)
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.92)), // slightly more muted (elegant restraint)
    };

    // --- Complement tonal steps (refined balance) ---
    const darkestComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l - 0.22)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.28)), // rich jewel tones
    };

    const darkComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l - 0.12)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.12)),
    };

    const lightComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l + 0.16)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 0.88)),
    };

    const lightestComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l + 0.24)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 0.72)),
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
      l: Math.min(LMAX, Math.max(LMIN, 0.38 + sliderLightValue)), // darker base for mood
      c: Math.min(CMAX, Math.max(CMIN, 0.11 + sliderChromaValue)), // medium-muted baseline
    };

    // --- Base tonal steps (dramatic moody curves) ---
    const darkestBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.55)), // deep, atmospheric shadows
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.3)), // richer in darks (depth)
      h: (baseColor.h - 5 + 360) % 360, // subtle shift toward cooler
    };

    const darkBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.78)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.15)),
      h: (baseColor.h - 2 + 360) % 360,
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, baseColor.l + (LMAX - baseColor.l) * 0.5)
      ),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.88)), // maintain some saturation
      h: (baseColor.h + 1) % 360, // minimal shift in highlights
    };

    const lightestBase = {
      ...baseColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, baseColor.l + (LMAX - baseColor.l) * 0.8)
      ),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.75)), // desaturated but not washed out
      h: (baseColor.h + 2) % 360,
    };

    // --- Complementary (moody atmospheric contrast) ---
    const compHue = (baseColor.h + 180) % 360; // true complementary for drama
    const compColor = {
      ...baseColor,
      h: compHue,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.88)), // notably darker complement (moody asymmetry)
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.92)), // slightly more muted
    };

    // --- Complement tonal steps (dramatic moody curves) ---
    const darkestComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l * 0.5)), // very deep shadows
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.35)), // rich, saturated darks
      h: (compHue - 6 + 360) % 360, // dramatic hue shift in shadows
    };

    const darkComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l * 0.75)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.18)),
      h: (compHue - 3 + 360) % 360,
    };

    const lightComp = {
      ...compColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, compColor.l + (LMAX - compColor.l) * 0.55)
      ),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 0.85)),
      h: (compHue + 2) % 360,
    };

    const lightestComp = {
      ...compColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, compColor.l + (LMAX - compColor.l) * 0.85)
      ),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 0.7)),
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
      l: Math.min(LMAX, Math.max(LMIN, 0.81 + sliderLightValue)), // light, dreamy base
      c: Math.min(CMAX, Math.max(CMIN, 0.11 + sliderChromaValue)), // soft chroma baseline
    };

    // --- Base tonal steps (gentle pastel curves) ---
    const darkestBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.88)), // gentle darkening only
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.12)), // subtle chroma boost
      h: (baseColor.h - 1 + 360) % 360, // minimal hue shift
    };

    const darkBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.94)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.06)),
      h: (baseColor.h - 0.5 + 360) % 360,
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, baseColor.l + (LMAX - baseColor.l) * 0.45)
      ),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.92)), // gentle desaturation
      h: (baseColor.h + 0.5) % 360, // very subtle shift
    };

    const lightestBase = {
      ...baseColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, baseColor.l + (LMAX - baseColor.l) * 0.75)
      ),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.8)), // softer at lightest
      h: (baseColor.h + 1) % 360,
    };

    // --- Complementary (soft, balanced contrast) ---
    const compHue = (baseColor.h + 180) % 360; // true complementary
    const compColor = {
      ...baseColor,
      h: compHue,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.98)), // similar lightness (pastel balance)
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.96)), // just slightly more muted
    };

    // --- Complement tonal steps (gentle, symmetric curves) ---
    const darkestComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l * 0.88)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.12)),
      h: (compHue - 1 + 360) % 360,
    };

    const darkComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l * 0.94)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.06)),
      h: (compHue - 0.5 + 360) % 360,
    };

    const lightComp = {
      ...compColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, compColor.l + (LMAX - compColor.l) * 0.45)
      ),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 0.92)),
      h: (compHue + 0.5) % 360,
    };

    const lightestComp = {
      ...compColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, compColor.l + (LMAX - compColor.l) * 0.75)
      ),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 0.8)),
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
      l: Math.min(LMAX, Math.max(LMIN, 0.72 + sliderLightValue)), // neon sweet spot
      c: Math.min(CMAX, Math.max(CMIN, 0.3 + sliderChromaValue)), // intensely saturated baseline
    };

    // --- Base tonal steps (electric neon curves) ---
    const darkestBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.5)), // deep but electric
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.15)), // boost saturation in darks
      h: baseColor.h, // pure hue for neon clarity
    };

    const darkBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.75)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.08)),
      h: baseColor.h,
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, baseColor.l + (LMAX - baseColor.l) * 0.5)
      ),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.98)), // maintain intensity
      h: baseColor.h,
    };

    const lightestBase = {
      ...baseColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, baseColor.l + (LMAX - baseColor.l) * 0.8)
      ),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.92)), // slight reduction but still vibrant
      h: baseColor.h,
    };

    // --- Complementary (electric contrast) ---
    const compHue = (baseColor.h + 180) % 360; // true complementary for maximum impact
    const compColor = {
      ...baseColor,
      h: compHue,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l)), // same lightness for balanced glow
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.05)), // complement can be MORE saturated
    };

    // --- Complement tonal steps (symmetric electric curves) ---
    const darkestComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l * 0.5)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.15)),
      h: compHue,
    };

    const darkComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l * 0.75)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.08)),
      h: compHue,
    };

    const lightComp = {
      ...compColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, compColor.l + (LMAX - compColor.l) * 0.5)
      ),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 0.98)),
      h: compHue,
    };

    const lightestComp = {
      ...compColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, compColor.l + (LMAX - compColor.l) * 0.8)
      ),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 0.92)),
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
      l: Math.min(LMAX, Math.max(LMIN, 0.6 + sliderLightValue)), // warm retro base
      c: Math.min(CMAX, Math.max(CMIN, 0.18 + sliderChromaValue)), // punchy baseline
    };

    // --- Base tonal steps (retro curves with hue shifts) ---
    const darkestBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.75)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.18)), // richer in darks
      h: (baseColor.h - 8 + 360) % 360, // warm shift (toward orange/red)
    };

    const darkBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.88)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.1)),
      h: (baseColor.h - 4 + 360) % 360,
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, baseColor.l + (LMAX - baseColor.l) * 0.55)
      ),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.94)), // maintain boldness
      h: (baseColor.h + 3) % 360, // slight yellow shift in lights
    };

    const lightestBase = {
      ...baseColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, baseColor.l + (LMAX - baseColor.l) * 0.85)
      ),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.85)), // still punchy
      h: (baseColor.h + 6) % 360,
    };

    // --- Complementary (funky retro contrast) ---
    const compHue = (baseColor.h + 185) % 360; // slightly off for retro feel
    const compColor = {
      ...baseColor,
      h: compHue,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.96)), // slightly asymmetric
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.02)), // complement can be punchier
    };

    // --- Complement tonal steps (retro asymmetry) ---
    const darkestComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l * 0.72)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.2)),
      h: (compHue - 10 + 360) % 360, // cool shift (toward blue/teal)
    };

    const darkComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l * 0.86)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.12)),
      h: (compHue - 5 + 360) % 360,
    };

    const lightComp = {
      ...compColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, compColor.l + (LMAX - compColor.l) * 0.6)
      ),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 0.92)),
      h: (compHue + 4) % 360,
    };

    const lightestComp = {
      ...compColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, compColor.l + (LMAX - compColor.l) * 0.9)
      ),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 0.82)),
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
      l: Math.min(LMAX, Math.max(LMIN, 0.52 + sliderLightValue)), // earthy mid-tone
      c: Math.min(CMAX, Math.max(CMIN, 0.09 + sliderChromaValue)), // natural muted baseline
    };

    // --- Base tonal steps (organic earthy curves) ---
    const darkestBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.7)), // rich soil darkness
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.25)), // deeper tones more saturated
      h: (baseColor.h - 4 + 360) % 360, // warmer in shadows (clay/bark)
    };

    const darkBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.85)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.12)),
      h: (baseColor.h - 2 + 360) % 360,
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, baseColor.l + (LMAX - baseColor.l) * 0.5)
      ),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.88)), // desaturate in lights (sandy)
      h: (baseColor.h + 1.5) % 360, // subtle warm shift
    };

    const lightestBase = {
      ...baseColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, baseColor.l + (LMAX - baseColor.l) * 0.8)
      ),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.72)), // very muted (stone/cream)
      h: (baseColor.h + 3) % 360,
    };

    // --- Complementary (natural balance) ---
    const compHue = (baseColor.h + 170) % 360; // slightly off for organic feel
    const compColor = {
      ...baseColor,
      h: compHue,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.94)), // slightly darker (natural asymmetry)
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.85)), // more muted (forest/sage)
    };

    // --- Complement tonal steps (organic asymmetry) ---
    const darkestComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l * 0.68)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.28)), // rich forest darks
      h: (compHue - 5 + 360) % 360, // cooler in shadows (moss/pine)
    };

    const darkComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l * 0.83)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.14)),
      h: (compHue - 2.5 + 360) % 360,
    };

    const lightComp = {
      ...compColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, compColor.l + (LMAX - compColor.l) * 0.52)
      ),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 0.86)),
      h: (compHue + 2) % 360,
    };

    const lightestComp = {
      ...compColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, compColor.l + (LMAX - compColor.l) * 0.82)
      ),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 0.7)),
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
  } else if (compPalType === "OpalComp") {
    // --- Strong Opalescent Complement Palette (Clamped OKLCH) ---
    // Luminous, holographic, and balanced with safety clamps

    const LMAX = 0.8; // Glossy but not pure white
    const LMIN = 0.3; // Deep shadow base
    const CMAX = 0.35; // Bold iridescence
    const CMIN = 0.08; // Gentle muted base

    const baseColor = oklch;

    // --- Base Tonal Family (iridescent foundations) ---
    const darkestBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.25)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.25)),
      h: (baseColor.h - 6 + 360) % 360,
    };

    const darkBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.12)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.1)),
      h: (baseColor.h - 3 + 360) % 360,
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.12)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.9)),
      h: (baseColor.h + 4) % 360,
    };

    const lightestBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.25)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.8)),
      h: (baseColor.h + 8) % 360,
    };

    // --- Complement (dynamic iridescent hue progression) ---
    const compColor = {
      ...baseColor,
      h: (baseColor.h + 170) % 360, // central complement pivot
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.95)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.95)),
    };

    // --- Complement Tonal Family (cool-violet to aqua shimmer) ---
    const darkestComp = {
      ...compColor,
      h: (baseColor.h + 120) % 360, // magenta-blue reflection
      l: Math.min(LMAX, Math.max(LMIN, compColor.l - 0.22)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.25)),
    };

    const darkComp = {
      ...compColor,
      h: (baseColor.h + 150) % 360,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l - 0.1)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.1)),
    };

    const lightComp = {
      ...compColor,
      h: (baseColor.h + 200) % 360, // turquoise midrange
      l: Math.min(LMAX, Math.max(LMIN, compColor.l + 0.12)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 0.88)),
    };

    const lightestComp = {
      ...compColor,
      h: (baseColor.h + 240) % 360, // cyan-violet highlight shimmer
      l: Math.min(LMAX, Math.max(LMIN, compColor.l + 0.25)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 0.75)),
    };

    // --- Return Full Strong Opalescent Complement Palette ---
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
  } else if (compPalType === "BioLumComp") {
    // --- Bioluminescent Complement Palette (Glow-in-the-Dark Theory) ---
    // Electric hues with deep-sea contrast — eerie luminous balance

    const LMAX = 0.88; // glows but not white
    const LMIN = 0.2; // dark abyss base
    const CMAX = 0.38; // intense phosphorescent saturation
    const CMIN = 0.08; // faint background glow

    const baseColor = oklch;

    // --- BASE FAMILY (primary glow origin) ---
    const darkestBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.3)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.2)),
      h: (baseColor.h - 10 + 360) % 360, // drifts slightly cooler, deep glow
    };

    const darkBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.15)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.1)),
      h: (baseColor.h - 5 + 360) % 360,
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.12)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.05)),
      h: (baseColor.h + 8) % 360, // bioluminescent shift toward cyan-green
    };

    const lightestBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.26)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.15)),
      h: (baseColor.h + 16) % 360, // glowing edges
    };

    // --- COMPLEMENT FAMILY (opposing spectral luminescence) ---
    const compColor = {
      ...baseColor,
      h: (baseColor.h + 180) % 360, // core complement
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 1.02)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.0)),
    };

    // glowing, violet-tinged complement variants
    const darkestComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l - 0.28)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.25)),
      h: (compColor.h + 12) % 360, // blue-violet deep flash
    };

    const darkComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l - 0.14)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.12)),
      h: (compColor.h + 8) % 360,
    };

    const lightComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l + 0.13)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.1)),
      h: (compColor.h + 20) % 360, // turquoise glow
    };

    const lightestComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l + 0.27)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.2)),
      h: (compColor.h + 30) % 360, // radiant cyan edge
    };

    // --- Return Full Bioluminescent Complement Palette ---
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
  } else if (compPalType === "TemporalComp") {
    // --- Temporal Complement (Dynamic Time-of-Day Color Theory) ---
    // Concept: complement hue oscillates through the day.
    // Morning → warm complements; Evening → cool complements.
    // Chroma and lightness “breathe” cyclically with time.

    const LMAX = 0.93;
    const LMIN = 0.28;
    const CMAX = 0.28;
    const CMIN = 0.06;

    // Base color — reference hue
    const baseColor = oklch;

    // Simulated time parameter (0–1 range, or continuous time signal)
    // For dynamic systems: timeFactor = (Date.now() / 60000) % 1, etc.
    const timeFactor = 0.5; // static example (noon-like midpoint)

    // --- Temporal Oscillation Functions ---
    function timeWave(t) {
      return Math.sin(t * Math.PI * 2); // full day sinusoid
    }

    // dynamic hue complement
    const compHue = (baseColor.h + 160 + 20 * timeWave(timeFactor)) % 360;

    // chroma modulation (breathing effect)
    function modulatedChroma(c, t) {
      const wave = 1 + 0.12 * Math.sin(t * Math.PI * 2 + Math.PI / 3);
      return c * wave;
    }

    // lightness modulation (soft day–night cycle)
    function modulatedLightness(l, t) {
      const wave = 1 + 0.1 * Math.sin(t * Math.PI * 2 - Math.PI / 4);
      return l * wave;
    }

    // --- Base Family (time-responsive lighting) ---
    const darkestBase = {
      ...baseColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, modulatedLightness(baseColor.l - 0.25, timeFactor))
      ),
      c: Math.min(
        CMAX,
        Math.max(CMIN, modulatedChroma(baseColor.c * 1.1, timeFactor))
      ),
      h: (baseColor.h - 3 + 360) % 360,
    };

    const darkBase = {
      ...baseColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, modulatedLightness(baseColor.l - 0.13, timeFactor))
      ),
      c: Math.min(
        CMAX,
        Math.max(CMIN, modulatedChroma(baseColor.c * 1.05, timeFactor))
      ),
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, modulatedLightness(baseColor.l + 0.12, timeFactor))
      ),
      c: Math.min(
        CMAX,
        Math.max(CMIN, modulatedChroma(baseColor.c * 0.9, timeFactor))
      ),
    };

    const lightestBase = {
      ...baseColor,
      l: Math.min(
        LMAX,
        Math.max(LMIN, modulatedLightness(baseColor.l + 0.27, timeFactor))
      ),
      c: Math.min(
        CMAX,
        Math.max(CMIN, modulatedChroma(baseColor.c * 0.8, timeFactor))
      ),
    };

    // --- Complement Family (temporal hue oscillation) ---
    const compColor = {
      ...baseColor,
      h: compHue,
      l: Math.min(
        LMAX,
        Math.max(LMIN, modulatedLightness(baseColor.l, timeFactor))
      ),
      c: Math.min(
        CMAX,
        Math.max(CMIN, modulatedChroma(baseColor.c, timeFactor))
      ),
    };

    const darkestComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l - 0.25)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.1)),
      h: (compColor.h - 4 + 360) % 360,
    };

    const darkComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l - 0.13)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.05)),
    };

    const lightComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l + 0.13)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 0.88)),
    };

    const lightestComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l + 0.27)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 0.78)),
    };

    // --- Return Full Temporal Complement Palette ---
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
  } else if (compPalType === "AtmosphericComp") {
    // --- Atmospheric Complement (Scattering Logic) ---
    // Simulates Rayleigh/Mie scattering principles:
    // Shadows = warm opposites (180° shift), Highlights = sky-biased cool reflections (~60° shift)
    // Chroma decreases exponentially with brightness for dusty realism.

    const LMAX = 0.92; // near-sky brightness limit
    const LMIN = 0.25; // deep shadow base
    const CMAX = 0.28; // fairly vivid, enough for atmospheric contrast
    const CMIN = 0.05; // dusty, low-saturation baseline

    const baseColor = oklch;

    // --- BASE FAMILY (Light-Medium Atmospheric Layer) ---
    const darkestBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.26)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.12)), // rich warm depth
      h: (baseColor.h - 5 + 360) % 360, // warmer low-end scattering
    };

    const darkBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.14)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.05)),
      h: (baseColor.h - 2 + 360) % 360,
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.14)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.88)), // desaturate with altitude
      h: (baseColor.h + 3) % 360, // slightly cooler in high luminance
    };

    const lightestBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.28)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.7)), // thin-air fade
      h: (baseColor.h + 6) % 360,
    };

    // --- COMPLEMENT FAMILY (Scattering Complement Curve) ---
    // Hue offset scales with brightness: darks ≈180°, lights ≈60°.
    const hueOffsetDark = 180;
    const hueOffsetLight = 60;

    // base hue offset as function of lightness (simulate scattering compression)
    function scatteringHueShift(lightness) {
      // linear interpolation between dark (180°) → light (60°)
      const t = (lightness - LMIN) / (LMAX - LMIN);
      return hueOffsetDark - t * (hueOffsetDark - hueOffsetLight);
    }

    // exponential chroma decay function
    function scatteringChroma(chroma, lightness) {
      const decay = Math.exp(-2.5 * (lightness - LMIN)); // faster fade as light rises
      return chroma * (0.6 + 0.4 * decay); // preserves some color structure
    }

    // define complement hue and chroma
    const compColor = {
      ...baseColor,
      h: (baseColor.h + scatteringHueShift(baseColor.l)) % 360,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l * 0.98)),
      c: Math.min(
        CMAX,
        Math.max(CMIN, scatteringChroma(baseColor.c, baseColor.l))
      ),
    };

    // Complement tonal family (reflective atmospheric band)
    const darkestComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l - 0.25)),
      c: Math.min(
        CMAX,
        Math.max(CMIN, scatteringChroma(compColor.c * 1.1, compColor.l))
      ),
      h: (compColor.h - 6 + 360) % 360,
    };

    const darkComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l - 0.13)),
      c: Math.min(
        CMAX,
        Math.max(CMIN, scatteringChroma(compColor.c * 1.05, compColor.l))
      ),
      h: (compColor.h - 3 + 360) % 360,
    };

    const lightComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l + 0.13)),
      c: Math.min(
        CMAX,
        Math.max(CMIN, scatteringChroma(compColor.c * 0.85, compColor.l))
      ),
      h: (compColor.h + 3) % 360,
    };

    const lightestComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l + 0.27)),
      c: Math.min(
        CMAX,
        Math.max(CMIN, scatteringChroma(compColor.c * 0.7, compColor.l))
      ),
      h: (compColor.h + 7) % 360,
    };

    // --- Return Full Atmospheric Complement Palette ---
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
  } else if (compPalType === "EtherealComp") {
    // --- Ethereal Complement (Tone-Matched Desaturation) ---
    // Concept: Harmony through tone, not contrast.
    // Complement shares lightness/chroma; hue shifts only 60–90°.
    // Creates gentle, meditative visual flow — no harsh opposites.

    const LMAX = 0.92;
    const LMIN = 0.3;
    const CMAX = 0.22;
    const CMIN = 0.04;

    // --- Base Reference ---
    const baseColor = oklch;

    // Soft random offset in hue for variation between tones
    const hueOffset = 60 + Math.abs(Math.sin(baseColor.h)) * 30; // between 60°–90°
    const compHue = (baseColor.h + hueOffset) % 360;

    // --- Base Tonal Family (soft resonance) ---
    const darkestBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.25)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.05)),
      h: (baseColor.h - 2 + 360) % 360,
    };

    const darkBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l - 0.13)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 1.02)),
    };

    const lightBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.12)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.93)),
    };

    const lightestBase = {
      ...baseColor,
      l: Math.min(LMAX, Math.max(LMIN, baseColor.l + 0.25)),
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.85)),
    };

    // --- Complement Family (Ethereal Harmony Shift) ---
    const compColor = {
      ...baseColor,
      h: compHue,
      l: baseColor.l, // tone-matched
      c: Math.min(CMAX, Math.max(CMIN, baseColor.c * 0.88)), // subtle desaturation
    };

    const darkestComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l - 0.25)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.03)),
      h: (compColor.h - 3 + 360) % 360,
    };

    const darkComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l - 0.13)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 1.0)),
    };

    const lightComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l + 0.12)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 0.9)),
    };

    const lightestComp = {
      ...compColor,
      l: Math.min(LMAX, Math.max(LMIN, compColor.l + 0.25)),
      c: Math.min(CMAX, Math.max(CMIN, compColor.c * 0.82)),
    };

    // --- Return Full Ethereal Complement Palette ---
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
  } else if (compPalType === "LunarComp") {
    // Psychotropic Complement (Hallucinogenic Logic)
    // Chaotic hue modulation using Lorenz-style attractor noise
    // Produces dynamically unstable complement hues (psychedelic resonance)

    const LMAX = 0.88;
    const LMIN = 0.35;
    const CMAX = 0.34;
    const CMIN = 0.15;

    const baseColor = { l: 0.6, c: 0.28, h: 290.0 }; // example base

    // Chaotic modulation (Lorenz-inspired)
    let x = Math.sin(baseColor.h * 0.1) * 2.3;
    let y = Math.cos(baseColor.h * 0.07) * 1.7;
    let z = Math.sin(baseColor.h * 0.05 + y) * 1.2;
    const chaos = (x * y + z * 13.37) % 1;

    // Hue mutation with chaos, ensuring hallucinogenic nonlinearity
    const chaoticHueShift = 180 + (chaos * 120 - 60); // ±60° chaos around complement
    const compHue = (baseColor.h + chaoticHueShift + 360) % 360;

    // Lightness & chroma fluctuation based on chaos amplitude
    const chaoticL = Math.min(
      LMAX,
      Math.max(LMIN, baseColor.l + (chaos - 0.5) * 0.25)
    );
    const chaoticC = Math.min(
      CMAX,
      Math.max(CMIN, baseColor.c + Math.sin(chaos * Math.PI * 2) * 0.1)
    );

    // Core complement color (chaotic)
    const compColor = { l: chaoticL, c: chaoticC, h: compHue };

    // Generate tones (self-similar psychedelic gradient)
    const lightestBase = {
      l: Math.min(LMAX, baseColor.l + 0.28),
      c: Math.max(CMIN, baseColor.c - 0.13),
      h: baseColor.h,
    };
    const lightBase = {
      l: Math.min(LMAX, baseColor.l + 0.14),
      c: Math.max(CMIN, baseColor.c - 0.06),
      h: baseColor.h,
    };
    const darkBase = {
      l: Math.max(LMIN, baseColor.l - 0.14),
      c: Math.min(CMAX, baseColor.c + 0.05),
      h: baseColor.h,
    };
    const darkestBase = {
      l: Math.max(LMIN, baseColor.l - 0.28),
      c: Math.min(CMAX, baseColor.c + 0.08),
      h: baseColor.h,
    };

    // Complement tones (chaotic reflection)
    const lightestComp = {
      l: Math.min(LMAX, compColor.l + 0.28),
      c: Math.max(CMIN, compColor.c - 0.13),
      h: (compColor.h + chaos * 10) % 360,
    };
    const lightComp = {
      l: Math.min(LMAX, compColor.l + 0.14),
      c: Math.max(CMIN, compColor.c - 0.06),
      h: (compColor.h + chaos * 5) % 360,
    };
    const darkComp = {
      l: Math.max(LMIN, compColor.l - 0.14),
      c: Math.min(CMAX, compColor.c + 0.05),
      h: (compColor.h - chaos * 5 + 360) % 360,
    };
    const darkestComp = {
      l: Math.max(LMIN, compColor.l - 0.28),
      c: Math.min(CMAX, compColor.c + 0.08),
      h: (compColor.h - chaos * 10 + 360) % 360,
    };

    // Return structure
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

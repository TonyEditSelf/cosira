export default function flowerPalGen(oklch, flowerType) {
  if (flowerType === "sunflower") {
    const { l, c, h } = oklch;

    const clampL = (x) => Math.max(0, Math.min(1, x));
    // Clamp Chroma remains at 0.4 for typical sunflower saturation
    const clampC = (x) => Math.max(0, Math.min(0.4, x));

    // ----------------------------------------------------
    // 1) Petals (6 Colors) — Increased Depth and Brightness
    // ----------------------------------------------------

    // Petal-Bright: High L, high C highlight
    const petalBright = {
      l: clampL(l * 1.2),
      c: clampC(c * 1.0),
      h,
    };

    // Petal-Light: Primary highlight
    const petalLight = {
      l: clampL(l * 1.1),
      c: clampC(c * 0.95),
      h,
    };

    // Petal-Soft: Muted, less saturated transition color (higher L, lower C)
    const petalSoft = {
      l: clampL(l * 1.05),
      c: clampC(c * 0.55),
      h,
    };

    const petal = oklch; // Base Color

    // Petal-Dark: Primary shadow color
    const petalDark = {
      l: clampL(l * 0.72),
      c: clampC(c * 0.9),
      h,
    };

    // Petal-Deep: Lowest L, highest C for deep, rich shadow at the base
    const petalDeep = {
      l: clampL(l * 0.55),
      c: clampC(c * 1.05),
      h,
    };

    // ----------------------------------------------------
    // 2) Disk (2 Colors) — Core Brown/Black
    // ----------------------------------------------------
    const diskH = 50; // Brown Hue

    const diskOuter = {
      // Darkened L for a rich brown (L: 0.4, C: 0.12)
      l: clampL(l * 0.4),
      c: clampC(0.12),
      h: diskH,
    };

    const diskCore = {
      // Very low L for near black (L: 0.2, C: 0.06)
      l: clampL(l * 0.2),
      c: clampC(0.06),
      h: diskH,
    };

    // ----------------------------------------------------
    // 3) Leaves (2 Colors) — Reduced to Main and Dark
    // ----------------------------------------------------
    const leafH = (h + 40) % 360; // Green Hue

    const greenMain = {
      l: clampL(l * 0.6),
      c: clampC(c * 0.7),
      h: leafH,
    };

    const greenDark = {
      l: clampL(l * 0.45),
      c: clampC(c * 0.65),
      h: leafH,
    };

    // ----------------------------------------------------
    // PERFECTLY 10 DISTINCT COLORS (ARRANGED FOR FLOW)
    // ----------------------------------------------------
    return [
      // GROUP 1: PETALS (Brightest to Darkest)
      { name: "Petal-Bright", value: petalBright },
      { name: "Petal-Light", value: petalLight },
      { name: "Petal-Soft", value: petalSoft }, // Muted transition
      { name: "Petal", value: petal },
      { name: "Petal-Dark", value: petalDark },
      { name: "Petal-Deep", value: petalDeep }, // Deepest shadow

      // GROUP 2: DISK (Outer to Core)
      { name: "Disk-Outer", value: diskOuter },
      { name: "Disk-Core", value: diskCore },

      // GROUP 3: GREENS (Light to Dark)
      { name: "Green-Main", value: greenMain },
      { name: "Green-Dark", value: greenDark },
    ];
  } else if (flowerType === "rose") {
    // ... (Rose logic remains the same)
    const { l, c, h } = oklch;

    const clampL = (x) => Math.max(0, Math.min(1, x));
    const clampC = (x) => Math.max(0, Math.min(0.45, x));

    // ----------------------------------------------------
    // Petals & Core Calculations
    // ----------------------------------------------------
    const petalCoolH = (h - 7) % 360;
    const petalWarmH = (h + 7) % 360;
    const coreWarmH = (h + 12) % 360;

    // Petal Colors
    const petalDeep = { l: clampL(l * 0.6), c: clampC(c * 1.1), h: petalCoolH };
    const petalDark = {
      l: clampL(l * 0.8),
      c: clampC(c * 1.05),
      h: petalCoolH,
    };
    const petal = oklch;
    const petalLight = {
      l: clampL(l * 1.05),
      c: clampC(c * 0.95),
      h: petalWarmH,
    };
    const petalSoft = {
      l: clampL(l * 1.15),
      c: clampC(c * 0.5),
      h: petalWarmH,
    };
    const petalMid = { l: clampL(l * 0.9), c: clampC(c * 1.05), h };

    // Core Colors
    const coreMain = { l: clampL(l * 0.7), c: clampC(c * 1.15), h: coreWarmH };
    const coreDeep = { l: 0.15, c: 0.05, h: coreWarmH };

    // Green Colors
    const leafH = (h + 140) % 360;
    const stemH = (h + 125) % 360;

    const greenMain = { l: clampL(l * 0.62), c: clampC(c * 0.72), h: leafH };
    const greenStem = { l: clampL(l * 0.58), c: clampC(c * 0.32), h: stemH };

    // ----------------------------------------------------
    // PERFECTLY 10 DISTINCT ROSE COLORS (ARRANGED FOR FLOW) & 8 ROSE COLORS
    // ----------------------------------------------------
    return [
      // GROUP 1: PETALS (Light to Dark)
      { name: "Petal-Light", value: petalLight },
      { name: "Petal-Soft", value: petalSoft },
      { name: "Petal", value: petal },
      { name: "Petal-Mid", value: petalMid },
      { name: "Petal-Dark", value: petalDark },
      { name: "Petal-Deep", value: petalDeep },

      // GROUP 2: CORE (Glow to Deepest Shadow)
      { name: "Core-Main", value: coreMain },
      { name: "Core-Deep", value: coreDeep },

      // GROUP 3: GREENS (Auxiliary Colors)
      { name: "Green-Main", value: greenMain },
      { name: "Green-Stem", value: greenStem },
    ];
  } else if (flowerType === "lavender") {
    const { l, c, h } = oklch;

    // Helper functions
    const clampL = (x) => Math.max(0, Math.min(1, x));
    // Keep max chroma low for the "powdery" effect
    const clampC = (x) => Math.max(0, Math.min(0.2, x));

    // ----------------------------------------------------
    // Bloom & Core Calculations
    // ----------------------------------------------------
    // Shifts shadows COOLER (bluer) for deep, velvety shadow
    const bloomCoolH = (h + 5) % 360;
    // Shifts highlights WARMER (pinker) for a soft, illuminated look
    const bloomWarmH = (h - 5) % 360;

    // Base Lavender (L: 0.80, C: 0.16, H: 280)
    const bloom = oklch;

    // Bloom Colors (6 Shades)

    // Bloom-Light: Highest L, slightly lower C, warm shift for highlight
    const bloomLight = {
      l: clampL(l * 1.05),
      c: clampC(c * 0.9),
      h: bloomWarmH,
    };

    // Bloom-Soft: Very high L, low C for the powdery, faded look
    const bloomSoft = {
      l: clampL(l * 1.15),
      c: clampC(0.08),
      h: bloomWarmH,
    };

    // Bloom-Mid: Smooth transition tone
    const bloomMid = {
      l: clampL(l * 0.9),
      c: clampC(c * 1.05),
      h: h,
    };

    // Bloom-Dark: Primary shadow color, cool shift
    const bloomDark = {
      l: clampL(l * 0.75),
      c: clampC(c * 1.1),
      h: bloomCoolH,
    };

    // Bloom-Deep: Deep, cool shadow (lowest L, highest C)
    const bloomDeep = {
      l: clampL(l * 0.65),
      c: clampC(c * 1.2),
      h: bloomCoolH,
    };

    // Bloom-Accent: Desaturated highlight for sparkle (near white)
    const bloomAccent = {
      l: 0.95,
      c: 0.05,
      h: h,
    };

    // Core Colors (2 Shades)

    // Core-Main: Low L, moderate C for the dark seed/calyx base, cool shift
    const coreMain = {
      l: clampL(l * 0.4),
      c: clampC(c * 0.8),
      h: bloomCoolH,
    };

    // Core-Deep: Near-black point
    const coreDeep = {
      l: 0.15,
      c: 0.05,
      h: bloomCoolH,
    };

    // Green Colors (2 Shades)
    // Shift H to a muted, dusty green/sage look (H ~ 120 is pure green)
    const leafH = (h + 160) % 360; // Muted sage/dusty green
    const stemH = (h + 140) % 360; // Woodier, more yellow-green stem

    // Green-Main: Dusty, light sage green for leaves
    const greenMain = {
      l: clampL(l * 0.7),
      c: clampC(c * 0.5),
      h: leafH,
    };

    // Green-Stem: Woodier, darker tone for the stalk
    const greenStem = {
      l: clampL(l * 0.55),
      c: clampC(c * 0.25),
      h: stemH,
    };

    // ----------------------------------------------------
    // PERFECTLY 10 DISTINCT LAVENDER COLORS (ARRANGED FOR FLOW)
    // ----------------------------------------------------
    return [
      // GROUP 1: BLOOM (Lightest Highlight to Base)
      { name: "Bloom-Soft", value: bloomSoft }, // Powdery highlight
      { name: "Bloom-Accent", value: bloomAccent }, // Near-white sparkle
      { name: "Bloom-Light", value: bloomLight },
      { name: "Bloom", value: bloom },

      // GROUP 2: SHADOWS (Mid-tone to Deepest Shadow)
      { name: "Bloom-Mid", value: bloomMid },
      { name: "Bloom-Dark", value: bloomDark },
      { name: "Bloom-Deep", value: bloomDeep },

      // GROUP 3: CORE (Calyx/Seed base)
      { name: "Core-Main", value: coreMain },
      { name: "Core-Deep", value: coreDeep },

      // GROUP 4: GREENS (Auxiliary Colors)
      { name: "Green-Main", value: greenMain },
      { name: "Green-Stem", value: greenStem },
    ];
  } else if (flowerType === "orchid") {
    const { l, c, h } = oklch;

    // Helper functions
    const clampL = (x) => Math.max(0, Math.min(1, x));
    // Allow higher chroma for vivid orchid colors
    const clampC = (x) => Math.max(0, Math.min(0.45, x));

    // ----------------------------------------------------
    // Bloom & Core Calculations
    // ----------------------------------------------------
    // Shifts shadows COOLER (towards blue/magenta, H ~300)
    const bloomCoolH = (h - 10) % 360;
    // Shifts highlights WARMER (towards red/orange, H ~360)
    const bloomWarmH = (h + 10) % 360;

    // Base Orchid Pink (L: 0.75, C: 0.22, H: 330)
    const bloom = oklch;

    // Petal Colors (5 Shades)

    // Bloom-Light: High L, warm shift for illuminated edge
    const bloomLight = {
      l: clampL(l * 1.1),
      c: clampC(c * 0.95),
      h: bloomWarmH,
    };

    // Bloom-Soft: Desaturated, luminous highlight (L: 1.15, C: 0.5)
    const bloomSoft = {
      l: clampL(l * 1.15),
      c: clampC(c * 0.5),
      h: bloomWarmH,
    };

    // Bloom-Mid: Primary transition tone
    const bloomMid = {
      l: clampL(l * 0.9),
      c: clampC(c * 1.1),
      h: h,
    };

    // Bloom-Dark: Primary shadow color, cool shift
    const bloomDark = {
      l: clampL(l * 0.75),
      c: clampC(c * 1.2), // Increased C for depth
      h: bloomCoolH,
    };

    // Bloom-Deep: Deep, cool shadow (lowest L, highest C)
    const bloomDeep = {
      l: clampL(l * 0.6),
      c: clampC(c * 1.3),
      h: bloomCoolH,
    };

    // Core/Lip Colors (3 Shades)

    // Lip-Core: Dark, highly saturated center of the lip/throat
    const lipCore = {
      l: clampL(l * 0.5),
      c: clampC(c * 1.5), // Pushing max chroma for vivid contrast
      h: bloomCoolH,
    };

    // Vein-Accent: Near-white/neutral for veins or tiny highlights (L: 0.98)
    const veinAccent = {
      l: 0.98,
      c: 0.05,
      h: h,
    };

    // Core-Main: Mid-tone for the transition from petal to lip
    const coreMain = {
      l: clampL(l * 0.8),
      c: clampC(c * 1.15),
      h: bloomWarmH,
    };

    // Green Colors (2 Shades)
    // Orchids often have bright, fresh greens.
    const leafH = (h + 140) % 360; // Bright, fresh green (H ~120 for pure green)
    const stemH = (h + 120) % 360; // More muted, darker green

    // Green-Main: Bright, cool green for large leaves
    const greenMain = {
      l: clampL(l * 0.75),
      c: clampC(c * 0.6),
      h: leafH,
    };

    // Green-Stem: Darker, muted tone for spike/woodier parts
    const greenStem = {
      l: clampL(l * 0.5),
      c: clampC(c * 0.3),
      h: stemH,
    };

    // ----------------------------------------------------
    // PERFECTLY 10 DISTINCT ORCHID COLORS (ARRANGED FOR FLOW)
    // ----------------------------------------------------
    return [
      // GROUP 1: BLOOM HIGHLIGHTS (Contrast and Lightest Petal)
      { name: "Vein-Accent", value: veinAccent }, // Near-white for contrast/veins
      { name: "Bloom-Soft", value: bloomSoft }, // Luminous, desaturated highlight
      { name: "Bloom-Light", value: bloomLight },

      // GROUP 2: PETAL TRANSITIONS (Base to Deep Shadow)
      { name: "Bloom", value: bloom },
      { name: "Bloom-Mid", value: bloomMid },
      { name: "Bloom-Dark", value: bloomDark },
      { name: "Bloom-Deep", value: bloomDeep },

      // GROUP 3: CORE/LIP (The center focal point)
      { name: "Core-Main", value: coreMain },
      { name: "Lip-Core", value: lipCore }, // The darkest, most saturated point

      // GROUP 4: GREENS (Auxiliary Colors)
      { name: "Green-Main", value: greenMain },
      { name: "Green-Stem", value: greenStem },
    ];
  } else if (flowerType === "lotus") {
    const { l, c, h } = oklch;

    // Helper functions
    const clampL = (x) => Math.max(0, Math.min(1, x));
    // Clamp Chroma very low for the soft, pastel, calming effect
    const clampC = (x) => Math.max(0, Math.min(0.15, x));

    // ----------------------------------------------------
    // Bloom & Core Calculations
    // ----------------------------------------------------
    // Shifts shadows COOLER (towards magenta/purple) for depth
    const bloomCoolH = (h - 5) % 360;
    // Shifts highlights WARMER (towards orange/red) for gentle glow
    const bloomWarmH = (h + 5) % 360;

    // Base Lotus Pink (L: 0.90, C: 0.12, H: 350)
    const bloom = oklch;

    // Petal Colors (6 Shades)

    // Bloom-Highlight: Very near white, low chroma for purity (L: 0.98)
    const bloomHighlight = {
      l: 0.98,
      c: 0.03,
      h: h,
    };

    // Bloom-Light: High L, gentle warm shift
    const bloomLight = {
      l: clampL(l * 1.05),
      c: clampC(c * 0.9),
      h: bloomWarmH,
    };

    // Bloom-Soft: Luminous, high L, lowest C for the softest look
    const bloomSoft = {
      l: clampL(l * 1.1),
      c: clampC(c * 0.5),
      h: bloomWarmH,
    };

    // Bloom-Mid: Primary transition tone
    const bloomMid = {
      l: clampL(l * 0.95),
      c: clampC(c * 1.05),
      h: h,
    };

    // Bloom-Dark: Primary shadow color, cool shift
    const bloomDark = {
      l: clampL(l * 0.8),
      c: clampC(c * 1.1),
      h: bloomCoolH,
    };

    // Bloom-Deep: Deepest shadow, slightly cool (L: 0.7)
    const bloomDeep = {
      l: clampL(l * 0.7),
      c: clampC(c * 1.2),
      h: bloomCoolH,
    };

    // Core Colors (2 Shades)

    // Core-Main: Low L, moderately saturated, brownish-pink center
    const coreMain = {
      l: clampL(l * 0.55),
      c: clampC(c * 1.5), // Maxing chroma within clamp for contrast
      h: bloomCoolH,
    };

    // Core-Dust: A muted, slightly warm accent for the stamens (L: 0.85, low C)
    const coreDust = {
      l: clampL(l * 0.9),
      c: clampC(0.1),
      h: (h + 30) % 360, // Shifts toward orange/yellow-pink
    };

    // Green Colors (2 Shades)
    // Muted, slightly blue-green for large lily pads and stem.
    const leafH = (h + 180) % 360; // Opposite side, slightly blue-green
    const stemH = (h + 160) % 360; // Muted, dusty green

    // Green-Main: Soft, slightly desaturated green for pads/leaves
    const greenMain = {
      l: clampL(l * 0.75),
      c: clampC(c * 0.7),
      h: leafH,
    };

    // Green-Deep: Darker, muted tone for submerged stem/underside
    const greenDeep = {
      l: clampL(l * 0.55),
      c: clampC(c * 0.5),
      h: stemH,
    };

    // ----------------------------------------------------
    // PERFECTLY 10 DISTINCT LOTUS COLORS (ARRANGED FOR FLOW)
    // ----------------------------------------------------
    return [
      // GROUP 1: BLOOM HIGHLIGHTS (Purity and Softness)
      { name: "Bloom-Highlight", value: bloomHighlight }, // Purity
      { name: "Bloom-Soft", value: bloomSoft }, // Softest, palest petal
      { name: "Bloom-Light", value: bloomLight },

      // GROUP 2: PETAL TRANSITIONS (Base to Shadow)
      { name: "Bloom", value: bloom },
      { name: "Bloom-Mid", value: bloomMid },
      { name: "Bloom-Dark", value: bloomDark },
      { name: "Bloom-Deep", value: bloomDeep },

      // GROUP 3: CORE (Contrast and Stamen)
      { name: "Core-Dust", value: coreDust }, // Stamen/pollen color
      { name: "Core-Main", value: coreMain }, // Dark center contrast

      // GROUP 4: GREENS (Auxiliary Colors)
      { name: "Green-Main", value: greenMain },
      { name: "Green-Deep", value: greenDeep },
    ];
  } else if (flowerType === "bluebell") {
    const { l, c, h } = oklch;

    // Helper functions
    const clampL = (x) => Math.max(0, Math.min(1, x));
    // Allow moderate-to-high chroma for vivid blue
    const clampC = (x) => Math.max(0, Math.min(0.35, x));

    // ----------------------------------------------------
    // Bloom & Core Calculations
    // ----------------------------------------------------
    // Base Bluebell Hue is H: 260

    // Shifts shadows COOLER/DEEPER (towards indigo/purple, H ~275)
    const bloomCoolH = (h + 15) % 360;
    // Shifts highlights WARMER/LIGHTER (towards blue/cyan, H ~240)
    const bloomWarmH = (h - 20) % 360;

    const bloom = oklch;

    // Petal Colors (6 Shades)
    const bloomLight = {
      l: clampL(l * 1.05),
      c: clampC(c * 1.1),
      h: bloomWarmH,
    };
    const bloomSoft = {
      l: clampL(l * 1.15),
      c: clampC(c * 0.5),
      h: bloomWarmH,
    };
    const bloomMid = {
      l: clampL(l * 0.85),
      c: clampC(c * 1.05),
      h: h,
    };
    const bloomDark = {
      l: clampL(l * 0.65),
      c: clampC(c * 1.2),
      h: bloomCoolH,
    };
    const bloomDeep = {
      l: clampL(l * 0.5),
      c: clampC(c * 1.5),
      h: bloomCoolH,
    };
    const bloomAccent = {
      l: 0.95,
      c: 0.05,
      h: h,
    };

    // Core Colors (2 Shades)
    const coreBase = {
      l: clampL(l * 0.45),
      c: clampC(c * 0.8),
      h: bloomCoolH,
    };
    const coreDeep = {
      l: 0.15,
      c: 0.05,
      h: bloomCoolH,
    };

    // ----------------------------------------------------
    // 🚨 CORRECTED GREEN LOGIC 🚨
    // We use a much larger hue shift (+200 and +210) to land
    // in the cool green zone (H: 100-110).
    // ----------------------------------------------------
    const leafH = (h + 200) % 360; // H: (260 + 200) = 460 -> 100 (Cool Green)
    const stemH = (h + 210) % 360; // H: (260 + 210) = 470 -> 110 (Slightly yellower green)

    // Green-Main: Bright, crisp green for foliage
    const greenMain = {
      l: clampL(l * 0.7), // L: 0.7 * 0.72 = 0.504
      c: clampC(c * 0.8), // C: 0.18 * 0.8 = 0.144
      h: leafH,
    };

    // Green-Stem: Darker, muted tone for the stalk
    const greenStem = {
      l: clampL(l * 0.55), // L: 0.55 * 0.72 = 0.396
      c: clampC(c * 0.4), // C: 0.18 * 0.4 = 0.072
      h: stemH,
    };

    // ----------------------------------------------------
    // PERFECTLY 10 DISTINCT BLUEBELL COLORS (ARRANGED FOR FLOW)
    // ----------------------------------------------------
    return [
      // GROUP 1: BLOOM HIGHLIGHTS (Purity and Light)
      { name: "Bloom-Accent", value: bloomAccent },
      { name: "Bloom-Soft", value: bloomSoft },
      { name: "Bloom-Light", value: bloomLight },

      // GROUP 2: PETAL TRANSITIONS (Base to Deep Shadow)
      { name: "Bloom", value: bloom },
      { name: "Bloom-Mid", value: bloomMid },
      { name: "Bloom-Dark", value: bloomDark },
      { name: "Bloom-Deep", value: bloomDeep },

      // GROUP 3: CORE (Throat/Base Contrast)
      { name: "Core-Base", value: coreBase },
      { name: "Core-Deep", value: coreDeep },

      // GROUP 4: GREENS (Auxiliary Colors)
      { name: "Green-Main", value: greenMain },
      { name: "Green-Stem", value: greenStem },
    ];
  } else if (flowerType === "marigold") {
    const { l, c, h } = oklch;

    // Helper functions
    const clampL = (x) => Math.max(0, Math.min(1, x));
    // Allow higher chroma for vivid orange
    const clampC = (x) => Math.max(0, Math.min(0.45, x));

    // ----------------------------------------------------
    // Bloom & Core Calculations
    // ----------------------------------------------------
    // Base Marigold Hue is H: 65

    // Shifts shadows WARMER (towards Red/Orange, H ~60)
    const bloomCoolH = (h - 5) % 360;
    // Shifts highlights YELLOW-WARMER (towards Yellow, H ~75)
    const bloomWarmH = (h + 10) % 360;

    // Base Marigold (L: 0.82, C: 0.26, H: 65)
    const bloom = oklch;

    // Petal Colors (6 Shades)

    // Bloom-Bright: Highest L, high C, shifted yellow for luminescence
    const bloomBright = {
      l: clampL(l * 1.1),
      c: clampC(c * 1.05),
      h: bloomWarmH,
    };

    // Bloom-Light: Primary highlight tone
    const bloomLight = {
      l: clampL(l * 1.0),
      c: clampC(c * 0.95),
      h: bloomWarmH,
    };

    // Bloom-Soft: Muted, luminous highlight (L: 0.95, C: 0.5)
    const bloomSoft = {
      l: clampL(l * 0.95),
      c: clampC(c * 0.5),
      h: bloomWarmH,
    };

    // Bloom-Mid: Primary transition tone, slightly darker than base
    const bloomMid = {
      l: clampL(l * 0.85),
      c: clampC(c * 1.05),
      h: h,
    };

    // Bloom-Dark: Primary shadow color, cool shift (H ~60)
    const bloomDark = {
      l: clampL(l * 0.7),
      c: clampC(c * 1.2), // Increased C for depth
      h: bloomCoolH,
    };

    // Bloom-Deep: Deepest shadow, rich red-orange (lowest L, highest C)
    const bloomDeep = {
      l: clampL(l * 0.55),
      c: clampC(c * 1.4),
      h: bloomCoolH,
    };

    // Core Colors (2 Shades)

    // Core-Main: Low L, moderately saturated, reddish-brown base of the flower
    const coreMain = {
      l: clampL(l * 0.45),
      c: clampC(c * 0.9),
      h: bloomCoolH,
    };

    // Core-Deep: Near-black point
    const coreDeep = {
      l: 0.15,
      c: 0.05,
      h: bloomCoolH,
    };

    // Green Colors (2 Shades)
    // Earthy, warm greens to complement the deep orange.
    const leafH = (h + 140) % 360; // H: 65 + 140 = 205 (Warm, slightly desaturated Cyan/Green)
    const stemH = (h + 160) % 360; // H: 65 + 160 = 225 (Deeper, muted Blue-Green)

    // Green-Main: Earthy, moderately saturated green for foliage
    const greenMain = {
      l: clampL(l * 0.7),
      c: clampC(c * 0.6),
      h: leafH,
    };

    // Green-Stem: Darker, muted tone for the stalk
    const greenStem = {
      l: clampL(l * 0.55),
      c: clampC(c * 0.3),
      h: stemH,
    };

    // ----------------------------------------------------
    // PERFECTLY 10 DISTINCT MARIGOLD COLORS (ARRANGED FOR FLOW)
    // ----------------------------------------------------
    return [
      // GROUP 1: BLOOM HIGHLIGHTS (Purity and Light)
      { name: "Bloom-Bright", value: bloomBright },
      { name: "Bloom-Light", value: bloomLight },
      { name: "Bloom-Soft", value: bloomSoft },

      // GROUP 2: PETAL TRANSITIONS (Base to Deep Shadow)
      { name: "Bloom", value: bloom },
      { name: "Bloom-Mid", value: bloomMid },
      { name: "Bloom-Dark", value: bloomDark },
      { name: "Bloom-Deep", value: bloomDeep },

      // GROUP 3: CORE (Throat/Base Contrast)
      { name: "Core-Main", value: coreMain },
      { name: "Core-Deep", value: coreDeep },

      // GROUP 4: GREENS (Auxiliary Colors)
      { name: "Green-Main", value: greenMain },
      { name: "Green-Stem", value: greenStem },
    ];
  } else if (flowerType === "hibiscus") {
    const { l, c, h } = oklch;

    // Helper functions
    const clampL = (x) => Math.max(0, Math.min(1, x));
    const clampC = (x) => Math.max(0, Math.min(0.45, x));

    // ----------------------------------------------------
    // Bloom & Core Calculations
    // Base Hibiscus L: 0.70, C: 0.30, H: 40
    // ----------------------------------------------------
    const bloomCoolH = (h - 2) % 360;
    const bloomWarmH = (h + 15) % 360;

    // Base Hibiscus - Adjusted L multiplier for distinction
    // L will be slightly higher than 0.70 (was L * 1.0)
    const bloom = { l: clampL(l * 1.05), c, h };

    // Petal Colors (5 Shades)

    // Bloom-Bright: L ~0.82
    const bloomBright = {
      l: clampL(l * 1.17),
      c: clampC(c * 1.05),
      h: bloomWarmH,
    };

    // Bloom-Light: L ~0.75
    const bloomLight = {
      l: clampL(l * 1.07),
      c: clampC(c * 1.0),
      h: bloomWarmH,
    };

    // Bloom-Mid: ADJUSTED L multiplier for a much deeper shadow (L ~0.50)
    const bloomMid = {
      l: clampL(l * 0.72), // Adjusted multiplier from 0.85
      c: clampC(c * 1.05),
      h: h,
    };

    // Bloom-Dark: L ~0.49
    const bloomDark = {
      l: clampL(l * 0.7),
      c: clampC(c * 1.2),
      h: bloomCoolH,
    };

    // Bloom-Vein: L: 0.95 (Accent)
    const bloomVein = {
      l: 0.95,
      c: 0.05,
      h: h,
    };

    // Core Colors (3 Shades)

    const coreMain = {
      l: clampL(l * 0.5),
      c: clampC(c * 1.5),
      h: bloomCoolH,
    };

    const coreDeep = {
      l: 0.15,
      c: 0.05,
      h: bloomCoolH,
    };

    const corePollen = {
      l: 0.8,
      c: 0.15,
      h: 90,
    };

    // Green Colors (2 Shades)
    const leafH = (h + 140) % 360;
    const stemH = (h + 160) % 360;

    const greenMain = {
      l: clampL(l * 0.75),
      c: clampC(c * 0.7),
      h: leafH,
    };

    const greenStem = {
      l: clampL(l * 0.55),
      c: clampC(c * 0.4),
      h: stemH,
    };

    // ----------------------------------------------------
    // PERFECTLY 10 DISTINCT HIBISCUS COLORS (ARRANGED FOR FLOW)
    // ----------------------------------------------------
    return [
      // GROUP 1: PETALS (Lightest to Deepest)
      { name: "Bloom-Vein", value: bloomVein }, // L: 0.95
      { name: "Bloom-Bright", value: bloomBright }, // L: 0.82
      { name: "Bloom-Light", value: bloomLight }, // L: 0.75
      { name: "Bloom", value: bloom }, // L: 0.73
      { name: "Bloom-Mid", value: bloomMid }, // L: 0.50
      { name: "Bloom-Dark", value: bloomDark }, // L: 0.49

      // GROUP 2: CORE (Accents and Deep Contrast)
      { name: "Core-Pollen", value: corePollen }, // L: 0.80
      { name: "Core-Main", value: coreMain }, // L: 0.35
      { name: "Core-Deep", value: coreDeep }, // L: 0.15

      // GROUP 3: GREENS (Auxiliary Colors)
      { name: "Green-Main", value: greenMain }, // L: 0.52
      { name: "Green-Stem", value: greenStem }, // L: 0.39
    ];
  } else if (flowerType === "morning-glory") {
    const { l, c, h } = oklch;

    // Helper functions
    const clampL = (x) => Math.max(0, Math.min(1, x));
    // Allow high chroma for striking, saturated blue
    const clampC = (x) => Math.max(0, Math.min(0.45, x));

    // ----------------------------------------------------
    // Bloom & Core Calculations
    // Base Morning Glory Hue is H: 215
    // ----------------------------------------------------

    // Shifts shadows COOLER (towards Indigo/Violet, H ~240) for depth
    const bloomCoolH = (h + 25) % 360;
    // Shifts highlights WARMER (towards Cyan/Pure Blue, H ~195) for shimmer
    const bloomWarmH = (h - 20) % 360;

    // Base Morning Glory (L: 0.68, C: 0.20, H: 215)
    // Adjusted slightly for better separation from Bloom-Light
    const bloom = { l: clampL(l * 1.05), c, h };

    // Petal Colors (6 Shades)

    // Bloom-Highlight: Very near white, low chroma for purity (L: 0.95)
    const bloomHighlight = {
      l: 0.95,
      c: 0.05,
      h: h,
    };

    // Bloom-Light: High L, high C, shifted cyan for luminosity (L ~0.80)
    const bloomLight = {
      l: clampL(l * 1.15),
      c: clampC(c * 1.2),
      h: bloomWarmH,
    };

    // Bloom-Soft: Muted, luminous edge highlight (L ~0.85)
    const bloomSoft = {
      l: clampL(l * 1.25), // Pushing L for visual distinction
      c: clampC(c * 0.6),
      h: bloomWarmH,
    };

    // Bloom-Mid: Primary transition tone, significantly darker than base (L ~0.50)
    const bloomMid = {
      l: clampL(l * 0.75),
      c: clampC(c * 1.1),
      h: h,
    };

    // Bloom-Dark: Primary shadow color, indigo shift (L ~0.45)
    const bloomDark = {
      l: clampL(l * 0.65),
      c: clampC(c * 1.3),
      h: bloomCoolH,
    };

    // Bloom-Deep: Deepest shadow, intense indigo/violet (lowest L, highest C) (L ~0.35)
    const bloomDeep = {
      l: clampL(l * 0.5),
      c: clampC(c * 1.8), // Pushing max chroma for velvety look
      h: bloomCoolH,
    };

    // Core Colors (2 Shades)

    // Core-Main: Deepest, most saturated purple for the throat
    const coreMain = {
      l: clampL(l * 0.35),
      c: clampC(c * 1.5),
      h: bloomCoolH,
    };

    // Core-Accent: Brilliant white/near-white for the throat center
    const coreAccent = {
      l: 0.98,
      c: 0.05,
      h: bloomWarmH,
    };

    // Green Colors (2 Shades)
    // Fresh, slightly warm greens to contrast the cool blue.
    const leafH = (h - 100) % 360; // H: 215 - 100 = 115 (Fresh Green)
    const stemH = (h - 120) % 360; // H: 215 - 120 = 95 (Slightly warmer/muted green)

    // Green-Main: Fresh, bright green for foliage
    const greenMain = {
      l: clampL(l * 0.8),
      c: clampC(c * 0.6),
      h: leafH,
    };

    // Green-Stem: Darker, muted tone for the vine/stalk
    const greenStem = {
      l: clampL(l * 0.55),
      c: clampC(c * 0.3),
      h: stemH,
    };

    // ----------------------------------------------------
    // PERFECTLY 10 DISTINCT MORNING GLORY COLORS (ARRANGED FOR FLOW)
    // ----------------------------------------------------
    return [
      // GROUP 1: BLOOM HIGHLIGHTS (Purity and Light)
      { name: "Core-Accent", value: coreAccent }, // L: 0.98 (Throat White)
      { name: "Bloom-Highlight", value: bloomHighlight }, // L: 0.95 (Purity)
      { name: "Bloom-Soft", value: bloomSoft }, // L ~0.85 (Muted edge)
      { name: "Bloom-Light", value: bloomLight }, // L ~0.80

      // GROUP 2: PETAL TRANSITIONS (Base to Deep Shadow)
      { name: "Bloom", value: bloom }, // L ~0.71 (Base)
      { name: "Bloom-Mid", value: bloomMid }, // L ~0.51
      { name: "Bloom-Dark", value: bloomDark }, // L ~0.44
      { name: "Bloom-Deep", value: bloomDeep }, // L ~0.34 (Deep Indigo)

      // GROUP 3: CORE (Throat Contrast)
      { name: "Core-Main", value: coreMain }, // L ~0.24 (Saturated Deep Purple)

      // GROUP 4: GREENS (Auxiliary Colors)
      { name: "Green-Main", value: greenMain }, // L ~0.54
      { name: "Green-Stem", value: greenStem }, // L ~0.37
    ];
  } else if (flowerType === "tangerine-gerbera") {
    // Use the passed in base L, C, H from the surrounding scope (oklch)
    const { l, c, h } = oklch;

    // Helper functions
    const clampL = (x) => Math.max(0, Math.min(1, x));
    // Allowing very high chroma for striking, saturated orange
    const clampC = (x) => Math.max(0, Math.min(0.45, x));

    // ----------------------------------------------------
    // Bloom & Core Calculations
    // ----------------------------------------------------

    // Shifts shadows RED-WARMER (towards Red/Magenta, H ~35)
    const bloomCoolH = (h - 15 + 360) % 360;
    // Shifts highlights YELLOW-WARMER (towards Yellow, H ~70)
    const bloomWarmH = (h + 20) % 360;

    // Base Tangerine Gerbera
    const bloom = { l: l, c: c, h: h };

    // Petal Colors (5 Shades)

    const bloomBright = {
      l: clampL(l * 1.2),
      c: clampC(c * 1.1),
      h: bloomWarmH,
    };

    const bloomLight = {
      l: clampL(l * 1.1),
      c: clampC(c * 1.05),
      h: bloomWarmH,
    };

    // Bloom-Mid: ADJUSTED L multiplier for clear step down (L ~0.50)
    const bloomMid = {
      l: clampL(l * 0.67), // Adjusted from 0.77 to 0.67 for a major drop
      c: clampC(c * 1.05),
      h: h,
    };

    // Bloom-Dark: L multiplier remains at 0.54 (L ~0.40)
    const bloomDark = {
      l: clampL(l * 0.54),
      c: clampC(c * 1.2),
      h: bloomCoolH,
    };

    const bloomVein = {
      l: 0.95,
      c: 0.05,
      h: h,
    };

    // Core Colors (3 Shades)

    const coreBase = {
      l: clampL(l * 0.8),
      c: clampC(c * 0.4),
      h: 95,
    };

    const coreDeep = {
      l: 0.25,
      c: 0.05,
      h: 80,
    };

    const coreStamen = {
      l: 0.88,
      c: 0.2,
      h: bloomWarmH,
    };

    // Green Colors (2 Shades)
    const leafH = (h + 150) % 360;
    const stemH = (h + 130) % 360;

    const greenMain = {
      l: clampL(l * 0.7),
      c: clampC(c * 0.5),
      h: stemH,
    };

    const greenStem = {
      l: clampL(l * 0.5),
      c: clampC(c * 0.3),
      h: leafH,
    };

    // ----------------------------------------------------
    // FINAL 10 DISTINCT GERBERA COLORS (ARRANGED FOR FLOW)
    // New Luminosity Steps (Approx.): 0.75 -> 0.50 -> 0.40
    // ----------------------------------------------------
    return [
      // GROUP 1: PETAL HIGHLIGHTS & BASE
      { name: "Bloom-Vein", value: bloomVein },
      { name: "Core-Stamen", value: coreStamen },
      { name: "Bloom-Bright", value: bloomBright },
      { name: "Bloom-Light", value: bloomLight },
      { name: "Bloom", value: bloom }, // L: ~0.75

      // GROUP 2: SHADOWS & CORE CONTRAST
      { name: "Bloom-Mid", value: bloomMid }, // L: ~0.50 (Clear 0.25 step down)
      { name: "Bloom-Dark", value: bloomDark }, // L: ~0.40
      { name: "Core-Base", value: coreBase },

      // GROUP 3: AUXILIARY
      { name: "Green-Main", value: greenMain },
      { name: "Green-Stem", value: greenStem },
      { name: "Core-Deep", value: coreDeep },
    ];
  } else if (flowerType === "cymbidium-orchid") {
    // Use the passed in base L, C, H from the surrounding scope (oklch)
    const { l, c, h } = oklch;

    // Helper functions
    const clampL = (x) => Math.max(0, Math.min(1, x));
    // Allowing high chroma for the vivid lime tone
    const clampC = (x) => Math.max(0, Math.min(0.4, x));

    // ----------------------------------------------------
    // Bloom & Lip Calculations (6 Shades)
    // ----------------------------------------------------

    // Shifts shadows COOLER (towards Blue-Green, H ~130) for depth
    const bloomCoolH = (h + 25) % 360;
    // Shifts highlights WARMER (towards Yellow-Green/Lime, H ~95) for intensity
    const bloomWarmH = (h - 10 + 360) % 360;

    // Base Cymbidium Bloom
    const bloom = { l: l, c: c, h: h };

    // Bloom Colors (4 Shades)

    // Bloom-Bright: Highest L, shifted yellow for brilliant luster (L ~0.90)
    const bloomBright = {
      l: clampL(l * 1.12),
      c: clampC(c * 1.1),
      h: bloomWarmH,
    };

    // Bloom-Light: Primary highlight tone, L ~0.84
    const bloomLight = {
      l: clampL(l * 1.05),
      c: clampC(c * 1.05),
      h: bloomWarmH,
    };

    // Bloom-Mid: Clear step down from base (L ~0.68)
    const bloomMid = {
      l: clampL(l * 0.85),
      c: clampC(c * 1.0),
      h: h,
    };

    // Bloom-Shadow: Primary shadow color, cool blue-green shift (L ~0.55)
    const bloomShadow = {
      l: clampL(l * 0.68),
      c: clampC(c * 1.15),
      h: bloomCoolH,
    };

    // Lip/Throat Colors (2 Shades)

    // Lip-Main: Brilliant white/near-white for the throat/lip base
    const lipMain = {
      l: 0.98,
      c: 0.05,
      h: h,
    };

    // Lip-Accent: Deep magenta/red spot for high contrast on the lip
    const lipAccent = {
      l: 0.45,
      c: 0.35,
      h: 340, // Deep Magenta/Red hue
    };

    // ----------------------------------------------------
    // Green & Auxiliary Colors (4 Shades)
    // ----------------------------------------------------

    // Since the BLOOM is green, the auxiliary colors must be dramatically cooler/darker.
    const leafH = (h + 100) % 360; // H: 205 (Deep, cool blue-green)
    const stemH = (h + 120) % 360; // H: 225 (Deep, muted blue/teal)

    // Green-Main: Very dark, saturated blue-green for leaves
    const greenMain = {
      l: clampL(l * 0.55),
      c: clampC(c * 1.5), // Pushing chroma for a rich, jewel tone contrast
      h: leafH,
    };

    // Green-Stem: Darkest, most muted blue for pseudobulb/shadows
    const greenStem = {
      l: clampL(l * 0.35),
      c: clampC(c * 0.8),
      h: stemH,
    };

    // ----------------------------------------------------
    // FINAL 10 DISTINCT CYMBIDIUM ORCHID COLORS (ARRANGED FOR FLOW)
    // ----------------------------------------------------
    return [
      // GROUP 1: BLOOM HIGHLIGHTS & ACCENTS
      { name: "Lip-Main", value: lipMain },
      { name: "Bloom-Bright", value: bloomBright },
      { name: "Lip-Accent", value: lipAccent }, // High contrast dot
      { name: "Bloom-Light", value: bloomLight },
      { name: "Bloom", value: bloom },

      // GROUP 2: BLOOM SHADOWS & GREENS
      { name: "Bloom-Mid", value: bloomMid },
      { name: "Bloom-Shadow", value: bloomShadow },
      { name: "Green-Main", value: greenMain }, // Deep Saturated Blue-Green
      { name: "Green-Stem", value: greenStem }, // Deepest Blue/Teal

      // GROUP 3: CORE
      { name: "Core-Deep", value: lipAccent }, // Re-using lip accent for core dark spot
    ];
  } else if (flowerType === "chocolateCosmos") {
    // Base OKLCH set to: L: 0.35, C: 0.25, H: 15 (Deep Oxblood Red)
    // This is the input that will be read from the surrounding scope { l, c, h }
    const { l, c, h } = oklch;

    // Helper functions
    const clampL = (x) => Math.max(0.1, Math.min(0.8, x)); // Restricted L range for dark palette
    const clampC = (x) => Math.max(0.05, Math.min(0.3, x)); // Restricted C range

    // --- Hue Relationships (Fixed offsets for botanical accuracy) ---
    // Petal Hues: Stay tightly clustered around 15 degrees for oxblood look
    const bloomCoolH = (h - 10 + 360) % 360; // H: ~5 (Burgundy)
    const bloomWarmH = (h + 10) % 360; // H: ~25 (Brownish-Red)

    // Core/Brown Hue: Needs to be near H=40 for warmth, but must scale from the base H
    const coreH = (h + 25) % 360; // e.g., 15 + 25 = 40 (Warm Brown)

    // Leaf Hues: Must be in the Muted Olive range (H 110-130).
    // Use a static value, but allow L/C to scale from base.
    const leafH = 120; // Muted olive
    const stemH = 130; // Slightly deeper olive

    // Base Chocolate Cosmos Petal
    const bloom = { l: l, c: c, h: h };

    // ----------------------------------------------------
    // Petal Colors (5 Shades)
    // ----------------------------------------------------

    // Bloom-Highlight: The lightest point (L multiplier must be high)
    const bloomHighlight = {
      l: clampL(l * 1.4),
      c: clampC(c * 0.75), // Significantly lower C to prevent too much saturation
      h: 355, // Fixed H near 355 for wine-red highlight (per final requirements)
    };

    // Bloom-Light: Primary light tone
    const bloomLight = {
      l: clampL(l * 1.15),
      c: clampC(c * 0.9),
      h: h,
    };

    // Bloom-Deep: Primary shadow color
    const bloomDeep = {
      l: clampL(l * 0.7),
      c: clampC(c * 1.2), // Increased C for velvet texture
      h: bloomCoolH,
    };

    // Bloom-Muted: Near-black tone
    const bloomMuted = {
      l: clampL(l * 0.45), // Always dark, but scales
      c: clampC(c * 0.3),
      h: bloomCoolH,
    };

    // ----------------------------------------------------
    // Core/Center Colors (2 Shades)
    // ----------------------------------------------------

    // Core-Brown: The essential low-chroma "Chocolate" neutral brown.
    // L scales from base L; C is kept very low. H is warm brown.
    const coreBrown = {
      l: clampL(l * 1.15), // Slightly lighter L than bloom base
      c: clampC(c * 0.2), // Very low C multiplier (e.g. 0.25 * 0.2 = 0.05)
      h: coreH,
    };

    // Core-Stamen: Darkest point in the core (not a bright accent)
    const coreStamen = {
      l: clampL(l * 0.6),
      c: clampC(c * 0.4),
      h: bloomCoolH,
    };

    // ----------------------------------------------------
    // Green & Auxiliary Colors (3 Shades)
    // ----------------------------------------------------

    // Green-Main: Muted olive leaf green. L/C scale from bloom base.
    const greenMain = {
      l: clampL(l * 1.5),
      c: clampC(c * 0.3), // Low Chroma for "Muted" look
      h: leafH,
    };

    // Green-Shadow: Dark stem shadow.
    const greenShadow = {
      l: clampL(l * 1.1),
      c: clampC(c * 0.2),
      h: stemH,
    };

    // Earth-Dust: Muted, cool grey-brown for soil/dust
    const earthDust = {
      l: clampL(l * 1.3),
      c: clampC(c * 0.15),
      h: 100, // Near-neutral
    };

    // ----------------------------------------------------
    // FINAL 10 DISTINCT CHOCOLATE COSMOS COLORS (ARRANGED FOR FLOW)
    // ----------------------------------------------------
    return [
      // GROUP 1: BLOOM HIGHLIGHTS & BASE (Oxblood/Maroon)
      { name: "Bloom-Highlight", value: bloomHighlight },
      { name: "Bloom-Light", value: bloomLight },
      { name: "Bloom", value: bloom },
      { name: "Bloom-Deep", value: bloomDeep },
      { name: "Bloom-Muted", value: bloomMuted },

      // GROUP 2: CORE & NEUTRALS
      { name: "Core-Brown", value: coreBrown }, // The distinct Chocolate Brown
      { name: "Core-Stamen", value: coreStamen }, // Darkest Core Point

      // GROUP 3: LEAVES & AUXILIARY (Muted Olive Greens)
      { name: "Green-Main", value: greenMain },
      { name: "Green-Shadow", value: greenShadow },
      { name: "Earth-Dust", value: earthDust },
    ];
  } else if (flowerType === "birdOfParadise") {
    const { l, c, h } = oklch;

    // Helper functions
    const clampL = (x) => Math.max(0.1, Math.min(0.9, x));
    const clampC = (x) => Math.max(0.05, Math.min(0.4, x));

    // --- Hue Relationships ---
    // Shifts shadows RED-WARMER (towards Red, H ~40)
    const bloomCoolH = (h - 15 + 360) % 360;
    // Shifts highlights YELLOW-WARMER (towards Yellow-Orange, H ~70)
    const bloomWarmH = (h + 15) % 360;

    const contrastH = 260; // Bluebell Blue hue

    // Base Orange Sepal
    const bloom = { l: l, c: c, h: h };

    // ----------------------------------------------------
    // Orange Sepal Colors (4 Shades)
    // ----------------------------------------------------

    const bloomHighlight = {
      l: clampL(l * 1.15),
      c: clampC(c * 1.05),
      h: bloomWarmH,
    };

    const bloomLight = {
      l: clampL(l * 1.08),
      c: clampC(c * 1.0),
      h: h,
    };

    // Bloom-Shadow: ADJUSTED L multiplier to 0.65 for clear contrast (L ~0.45)
    const bloomShadow = {
      l: clampL(l * 0.65), // Adjusted from 0.78
      c: clampC(c * 1.15),
      h: bloomCoolH,
    };

    const spatheBase = {
      l: clampL(l * 1.2), // L ~0.84
      c: clampC(c * 0.4),
      h: 80, // Yellow-Green
    };

    // ----------------------------------------------------
    // Blue/Purple Contrast & Core (3 Shades)
    // ----------------------------------------------------

    const contrastMain = {
      l: clampL(l * 0.72), // Scales down L
      c: clampC(c * 0.9), // Scales down C slightly
      h: contrastH,
    };

    const contrastDeep = {
      l: 0.2,
      c: 0.15,
      h: contrastH,
    };

    const coreAccent = {
      l: 0.95,
      c: 0.05,
      h: 90, // Yellow-Neutral
    };

    // ----------------------------------------------------
    // Green Foliage (3 Shades)
    // ----------------------------------------------------

    const leafH = 150; // Standard Leafy Green
    const stemH = 180; // Dark Cyan-Green

    const greenMain = {
      l: clampL(l * 0.8),
      c: clampC(c * 0.4),
      h: leafH,
    };

    const greenStem = {
      l: clampL(l * 0.5),
      c: clampC(c * 0.25),
      h: stemH,
    };

    // ----------------------------------------------------
    // FINAL 10 DISTINCT BIRD OF PARADISE COLORS
    // L Progression (Orange): 0.70 -> 0.45 (Clear contrast now)
    // ----------------------------------------------------
    return [
      // GROUP 1: ORANGE BLOOM
      { name: "Bloom-Highlight", value: bloomHighlight },
      { name: "Bloom-Light", value: bloomLight },
      { name: "Bloom", value: bloom },
      { name: "Bloom-Shadow", value: bloomShadow },

      // GROUP 2: SPATHE & CONTRAST (BLUE/PURPLE)
      { name: "Contrast-Main", value: contrastMain },
      { name: "Contrast-Deep", value: contrastDeep },
      { name: "Spathe-Base", value: spatheBase },

      // GROUP 3: GREENS & ACCENTS
      { name: "Green-Main", value: greenMain },
      { name: "Green-Stem", value: greenStem },
      { name: "Core-Accent", value: coreAccent },
    ];
  } else if (flowerType === "passionFlower") {
    // Base OKLCH set to: L: 0.90, C: 0.08, H: 280 (Pale Lavender)
    const { l, c, h } = oklch;

    // Helper functions
    const clampL = (x) => Math.max(0.1, Math.min(0.98, x));
    const clampC = (x) => Math.max(0.02, Math.min(0.35, x));

    // --- Hue Relationships ---
    // Shifts petals slightly WARMER (towards Pink/Magenta, H ~300) for soft glow
    const bloomWarmH = (h + 20) % 360;

    // The essential contrast color: Deep, saturated Violet/Blue for filaments
    const filamentH = 250; // Deep Blue-Violet
    // Secondary filament hue: Magenta for contrast banding
    const filamentAccentH = 320; // Vivid Magenta

    // Base Pale Petal
    const bloom = { l: l, c: c, h: h };

    // ----------------------------------------------------
    // Petal Colors (4 Shades)
    // ----------------------------------------------------

    // Bloom-Purity: Near-white for the purest parts (L ~0.95)
    const bloomPurity = {
      l: 0.95,
      c: 0.03,
      h: h,
    };

    // Bloom-Light: Primary luminous tone, slightly warmer (L ~0.92)
    const bloomLight = {
      l: clampL(l * 1.02),
      c: clampC(c * 1.1),
      h: bloomWarmH,
    };

    // Bloom-Shadow: Subtle shade on the white petals (L ~0.80)
    const bloomShadow = {
      l: clampL(l * 0.9),
      c: clampC(c * 1.2), // Slight Chroma increase for shadow visibility
      h: h,
    };

    // Petal-Vein: Darker, muted accent for the petal base/sepal
    const petalVein = {
      l: clampL(l * 0.75),
      c: clampC(c * 0.8),
      h: h,
    };

    // ----------------------------------------------------
    // Corona/Filament & Core (4 Shades)
    // ----------------------------------------------------

    // Filament-Main: Deepest, most saturated violet (L ~0.40)
    const filamentMain = {
      l: 0.4,
      c: 0.3,
      h: filamentH,
    };

    // Filament-Accent: The vivid magenta band (L ~0.65)
    const filamentAccent = {
      l: 0.65,
      c: 0.35,
      h: filamentAccentH,
    };

    // Core-Anther: Bright yellow/gold for the pollen-bearing anthers
    const coreAnther = {
      l: 0.85,
      c: 0.2,
      h: 90, // Pure Yellow
    };

    // Core-Stigma: Deep green spot/tip for the stigma
    const coreStigma = {
      l: 0.55,
      c: 0.15,
      h: 150, // Standard Green
    };

    // ----------------------------------------------------
    // Green Foliage (2 Shades)
    // ----------------------------------------------------

    // Cool-leaning greens to harmonize with the violet bloom.
    const leafH = 160; // Blue-Green for coolness

    // Green-Main: Primary foliage green (L ~0.60)
    const greenMain = {
      l: clampL(l * 0.65),
      c: clampC(c * 1.2),
      h: leafH,
    };

    // Green-Vine: Darker shade for the woody vine/shadow (L ~0.40)
    const greenVine = {
      l: clampL(l * 0.45),
      c: clampC(c * 0.5),
      h: leafH,
    };

    // ----------------------------------------------------
    // FINAL 10 DISTINCT PASSION FLOWER COLORS
    // ----------------------------------------------------
    return [
      // GROUP 1: PETALS & LUMINESCENCE
      { name: "Bloom-Purity", value: bloomPurity },
      { name: "Core-Anther", value: coreAnther },
      { name: "Bloom-Light", value: bloomLight },
      { name: "Bloom", value: bloom },
      { name: "Bloom-Shadow", value: bloomShadow },

      // GROUP 2: FILAMENTS & CORE
      { name: "Filament-Accent", value: filamentAccent }, // Vivid Magenta band
      { name: "Filament-Main", value: filamentMain }, // Deepest Violet/Blue
      { name: "Core-Stigma", value: coreStigma },

      // GROUP 3: GREENS
      { name: "Green-Main", value: greenMain },
      { name: "Green-Vine", value: greenVine },
    ];
  } else if (flowerType === "kingProtea") {
    // Base OKLCH set to: L: 0.65, C: 0.15, H: 350 (Muted Rose/Crimson)
    const { l, c, h } = oklch;

    // Helper functions
    const clampL = (x) => Math.max(0.15, Math.min(0.95, x));
    const clampC = (x) => Math.max(0.05, Math.min(0.3, x));

    // --- Hue Relationships ---
    // Shifts shadows COOLER (towards Burgundy, H ~340) for depth
    const bloomCoolH = (h - 10 + 360) % 360;
    // Shifts highlights WARMER (towards Peach/Light Red, H ~10) for subtle warmth
    const bloomWarmH = (h + 20) % 360;

    // Base Rose Bract
    const bloom = { l: l, c: c, h: h };

    // ----------------------------------------------------
    // Bract & Petal Colors (5 Shades)
    // ----------------------------------------------------

    // Bloom-Highlight: Soft, pale blush tip (L ~0.80)
    const bloomHighlight = {
      l: clampL(l * 1.25),
      c: clampC(c * 0.7), // Lowered C for a pale, dusty look
      h: bloomWarmH,
    };

    // Bloom-Light: Primary light tone (L ~0.75)
    const bloomLight = {
      l: clampL(l * 1.15),
      c: clampC(c * 0.9),
      h: h,
    };

    // Bloom-Mid: A clear step down from the base (L ~0.55)
    const bloomMid = {
      l: clampL(l * 0.85),
      c: clampC(c * 1.05),
      h: h,
    };

    // Bloom-Deep: Primary shadow and deep crimson base (L ~0.40)
    const bloomDeep = {
      l: clampL(l * 0.62),
      c: clampC(c * 1.3), // Increased C for perceived richness/velvet
      h: bloomCoolH,
    };

    // Bloom-Velvet: Darkest shadow/vein accent (L ~0.25)
    const bloomVelvet = {
      l: clampL(l * 0.4),
      c: clampC(c * 0.8),
      h: bloomCoolH,
    };

    // ----------------------------------------------------
    // Core/Fuzz & Stem Colors (5 Shades)
    // ----------------------------------------------------

    // Core-Fuzz: The soft, dense white/cream fuzz at the center (L fixed high)
    const coreFuzz = {
      l: 0.95,
      c: 0.05,
      h: bloomWarmH,
    };

    // Core-Stigma: The tiny, often dark, core center spot
    const coreStigma = {
      l: 0.2,
      c: 0.1,
      h: bloomCoolH,
    };

    // Green Foliage: Often a dry, blue-green (H 180-200)
    const leafH = 180; // Muted Cyan-Green
    const stemH = 150; // Standard Green

    // Green-Main: Primary foliage/stem green (L ~0.50)
    const greenMain = {
      l: clampL(l * 0.75),
      c: clampC(c * 0.4),
      h: stemH,
    };

    // Green-Base: The tough, woody base/stalk (L ~0.40)
    const greenBase = {
      l: clampL(l * 0.6),
      c: clampC(c * 0.25),
      h: leafH,
    };

    // ----------------------------------------------------
    // FINAL 10 DISTINCT KING PROTEA COLORS
    // ----------------------------------------------------
    return [
      // GROUP 1: HIGHLIGHTS & CORE
      { name: "Core-Fuzz", value: coreFuzz },
      { name: "Bloom-Highlight", value: bloomHighlight },
      { name: "Bloom-Light", value: bloomLight },

      // GROUP 2: BRACTS (Rose/Crimson)
      { name: "Bloom", value: bloom },
      { name: "Bloom-Mid", value: bloomMid },
      { name: "Bloom-Deep", value: bloomDeep },
      { name: "Bloom-Velvet", value: bloomVelvet },

      // GROUP 3: AUXILIARY & DARK CORE
      { name: "Green-Main", value: greenMain },
      { name: "Green-Base", value: greenBase },
      { name: "Core-Stigma", value: coreStigma },
    ];
  } else if (flowerType === "gardenCosmos") {
    // Base OKLCH set to: L: 0.78, C: 0.28, H: 320 (Vivid Magenta)
    const { l, c, h } = oklch;

    // Helper functions
    const clampL = (x) => Math.max(0.2, Math.min(0.95, x));
    const clampC = (x) => Math.max(0.05, Math.min(0.4, x));

    // --- Hue Relationships ---
    // Shifts shadows COOLER (towards Violet, H ~290) for depth
    const bloomCoolH = (h - 30 + 360) % 360;
    // Shifts highlights WARMER (towards Red, H ~340) for luminescence
    const bloomWarmH = (h + 20) % 360;

    // Base Garden Cosmos Petal
    const bloom = { l: l, c: c, h: h };

    // ----------------------------------------------------
    // Petal Colors (5 Shades)
    // ----------------------------------------------------

    // Bloom-Highlight: Very high L, lower C for a soft, luminous edge (L ~0.90)
    const bloomHighlight = {
      l: clampL(l * 1.15),
      c: clampC(c * 0.7),
      h: bloomWarmH,
    };

    // Bloom-Light: Primary light tone, pushing L and C for vividness (L ~0.85)
    const bloomLight = {
      l: clampL(l * 1.1),
      c: clampC(c * 1.05),
      h: h,
    };

    // Bloom-Mid: Primary shadow step, distinct drop in L (L ~0.65)
    const bloomMid = {
      l: clampL(l * 0.83),
      c: clampC(c * 1.1),
      h: bloomCoolH,
    };

    // Bloom-Deep: Deep shadow/vein color (L ~0.50)
    const bloomDeep = {
      l: clampL(l * 0.65),
      c: clampC(c * 1.2),
      h: bloomCoolH,
    };

    // Bloom-Vein: Near-white accent for delicate vein lines
    const bloomVein = {
      l: 0.95,
      c: 0.05,
      h: h,
    };

    // ----------------------------------------------------
    // Core/Center Colors (3 Shades)
    // ----------------------------------------------------

    // Core-Disc: Muted yellow-orange for the dry center disc.
    const coreDisc = {
      l: clampL(l * 0.9),
      c: clampC(c * 0.4),
      h: 70, // Yellow-Orange for contrast
    };

    // Core-Deep: Dark, near-black center spot
    const coreDeep = {
      l: 0.25,
      c: 0.1,
      h: 70,
    };

    // Core-Accent: Brilliant white center where the petals meet
    const coreAccent = {
      l: 0.98,
      c: 0.03,
      h: h,
    };

    // ----------------------------------------------------
    // Green & Auxiliary Colors (2 Shades)
    // ----------------------------------------------------

    // Muted, mid-range greens for the delicate foliage
    const leafH = (h + 160) % 360; // H: 120 (Warm Olive Green)

    // Green-Main: Muted, delicate leaf green
    const greenMain = {
      l: clampL(l * 0.7),
      c: clampC(c * 0.5),
      h: leafH,
    };

    // Green-Stem: Darker tone for the slender stem
    const greenStem = {
      l: clampL(l * 0.5),
      c: clampC(c * 0.3),
      h: leafH,
    };

    // ----------------------------------------------------
    // FINAL 10 DISTINCT GARDEN COSMOS COLORS
    // ----------------------------------------------------
    return [
      // GROUP 1: HIGHLIGHTS & ACCENTS
      { name: "Core-Accent", value: coreAccent },
      { name: "Bloom-Vein", value: bloomVein },
      { name: "Bloom-Highlight", value: bloomHighlight },

      // GROUP 2: PETALS
      { name: "Bloom-Light", value: bloomLight },
      { name: "Bloom", value: bloom },
      { name: "Bloom-Mid", value: bloomMid },
      { name: "Bloom-Deep", value: bloomDeep },

      // GROUP 3: CORE & GREENS
      { name: "Core-Disc", value: coreDisc },
      { name: "Green-Main", value: greenMain },
      { name: "Green-Stem", value: greenStem },
      { name: "Core-Deep", value: coreDeep },
    ];
  } else if (flowerType === "plumeria") {
    // Base OKLCH set to: L: 0.95, C: 0.05, H: 90 (Luminous Warm White)
    const { l, c, h } = oklch;

    // Helper functions
    const clampL = (x) => Math.max(0.2, Math.min(0.98, x));
    const clampC = (x) => Math.max(0.02, Math.min(0.4, x));

    // --- Hue Relationships ---
    // Shifts shadows COOLER (towards Blue-White, H ~120) for subtle shadow
    const bloomCoolH = (h + 30) % 360;

    // The essential contrasting color: Vivid Yellow for the center
    const coreH = 75; // Pure Yellow-Orange for intensity

    // Base Petal White
    const bloom = { l: l, c: c, h: h };

    // ----------------------------------------------------
    // Petal Colors (4 Shades)
    // ----------------------------------------------------

    // Bloom-Purity: The absolute whitest point (L fixed high)
    const bloomPurity = {
      l: 0.98,
      c: 0.02,
      h: h,
    };

    // Bloom-Light: ADJUSTED for distinction (L ~0.98, C ~0.07)
    // This is now visibly brighter and slightly more saturated than Bloom (L: 0.95, C: 0.05)
    const bloomLight = {
      l: clampL(l * 1.03), // Adjusted from 1.01
      c: clampC(c * 1.4), // Adjusted from 1.0
      h: h,
    };

    // Bloom-Shadow: Subtle shadow on the white petals (L ~0.85)
    const bloomShadow = {
      l: clampL(l * 0.9),
      c: clampC(c * 1.5),
      h: bloomCoolH,
    };

    // Petal-Vein: Base shadow where petals meet (L ~0.70)
    const petalVein = {
      l: clampL(l * 0.75),
      c: clampC(c * 2.0),
      h: bloomCoolH,
    };

    // ----------------------------------------------------
    // Core/Center & Accent (3 Shades)
    // ----------------------------------------------------

    // Core-Vivid: The highly saturated, bright yellow center
    const coreVivid = {
      l: 0.85,
      c: 0.35,
      h: coreH,
    };

    // Core-Mid: The transition point between yellow and white (L ~0.90)
    const coreMid = {
      l: clampL(l * 0.95),
      c: clampC(c * 3.0),
      h: coreH,
    };

    // Core-Deep: The shadow/base of the core (L ~0.65)
    const coreDeep = {
      l: clampL(l * 0.7),
      c: clampC(c * 2.5),
      h: coreH,
    };

    // ----------------------------------------------------
    // Green Foliage (3 Shades)
    // ----------------------------------------------------

    // Rich, dark greens typical of tropical foliage.
    const leafH = 150; // Standard Green
    const stemH = 180; // Dark Blue-Green

    // Green-Main: Primary rich foliage green (L ~0.55)
    const greenMain = {
      l: clampL(l * 0.6),
      c: clampC(c * 4.0),
      h: leafH,
    };

    // Green-Stem: Darkest shade for the woody branch (L ~0.35)
    const greenStem = {
      l: clampL(l * 0.4),
      c: clampC(c * 3.0),
      h: stemH,
    };

    // ----------------------------------------------------
    // FINAL 10 DISTINCT PLUMERIA COLORS
    // ----------------------------------------------------
    return [
      // GROUP 1: WHITE PETALS & HIGHLIGHTS
      { name: "Bloom-Purity", value: bloomPurity }, // L: 0.98, C: 0.02
      { name: "Bloom-Light", value: bloomLight }, // L: ~0.98, C: ~0.07 (Now Distinct)
      { name: "Bloom", value: bloom }, // L: 0.95, C: 0.05
      { name: "Bloom-Shadow", value: bloomShadow }, // L: ~0.85

      // GROUP 2: YELLOW CORE
      { name: "Core-Vivid", value: coreVivid },
      { name: "Core-Mid", value: coreMid },
      { name: "Core-Deep", value: coreDeep },

      // GROUP 3: GREENS & BASE
      { name: "Petal-Vein", value: petalVein },
      { name: "Green-Main", value: greenMain },
      { name: "Green-Stem", value: greenStem },
    ];
  } else if (flowerType === "blackPansy") {
    // Base OKLCH set to: L: 0.25, C: 0.05, H: 280 (Near-Black Violet)
    const { l, c, h } = oklch;

    // Helper functions
    const clampL = (x) => Math.max(0.1, Math.min(0.6, x)); // Restricted L for darkness
    const clampC = (x) => Math.max(0.02, Math.min(0.3, x));

    // --- Hue Relationships ---
    // Shifts shadows COOLER (towards Blue, H ~250) for maximum depth
    const bloomCoolH = (h - 30 + 360) % 360;
    // Shifts highlights WARMER (towards Magenta, H ~310) for subtle sheen
    const bloomWarmH = (h + 30) % 360;

    // The essential contrasting color: Bright Yellow/Gold for the center
    const coreH = 90; // Pure Yellow

    // Base Near-Black Petal
    const bloom = { l: l, c: c, h: h };

    // ----------------------------------------------------
    // Petal Colors (5 Shades)
    // ----------------------------------------------------

    // Bloom-Highlight: The subtle, low-light sheen on the velvet petals (L ~0.35)
    const bloomHighlight = {
      l: clampL(l * 1.4),
      c: clampC(c * 1.5),
      h: bloomWarmH,
    };

    // Bloom-Light: The primary illuminated part (L ~0.30)
    const bloomLight = {
      l: clampL(l * 1.2),
      c: clampC(c * 1.2),
      h: h,
    };

    // Bloom-Deep: The primary shadow area/most saturated look (L ~0.20)
    const bloomDeep = {
      l: clampL(l * 0.8),
      c: clampC(c * 1.8), // Increased C for perceived depth/velvet texture
      h: h,
    };

    // Bloom-Muted: The deepest, near-black fold (L ~0.15)
    const bloomMuted = {
      l: clampL(l * 0.6),
      c: clampC(c * 0.5),
      h: bloomCoolH,
    };

    // Bloom-Edge: High-contrast, sharp dark edge color (L ~0.10)
    const bloomEdge = {
      l: 0.1,
      c: 0.05,
      h: bloomCoolH,
    };

    // ----------------------------------------------------
    // Core/Center & Green (5 Shades)
    // ----------------------------------------------------

    // Core-Vivid: The highly saturated, bright yellow eye (L ~0.65)
    const coreVivid = {
      l: 0.65,
      c: 0.35,
      h: coreH,
    };

    // Core-Transition: Dark violet ring surrounding the yellow
    const coreTransition = {
      l: 0.35,
      c: 0.15,
      h: bloomCoolH,
    };

    // Green Foliage: Dark, simple greens for contrast.
    const leafH = 150; // Standard Green
    const stemH = 180; // Dark Blue-Green

    // Green-Main: Primary foliage green (L ~0.50)
    const greenMain = {
      l: clampL(l * 2.0),
      c: clampC(c * 3.0),
      h: leafH,
    };

    // Green-Stem: Darkest stem/soil shadow (L ~0.30)
    const greenStem = {
      l: clampL(l * 1.2),
      c: clampC(c * 2.0),
      h: stemH,
    };

    // ----------------------------------------------------
    // FINAL 10 DISTINCT BLACK PANSY COLORS
    // ----------------------------------------------------
    return [
      // GROUP 1: CORE & CONTRAST
      { name: "Core-Vivid", value: coreVivid }, // Bright Yellow Eye
      { name: "Bloom-Highlight", value: bloomHighlight }, // Subtle Sheen

      // GROUP 2: PETALS (Near-Black Violet)
      { name: "Bloom-Light", value: bloomLight },
      { name: "Bloom", value: bloom },
      { name: "Core-Transition", value: coreTransition },
      { name: "Bloom-Deep", value: bloomDeep },

      // GROUP 3: SHADOWS & GREENS
      { name: "Bloom-Muted", value: bloomMuted },
      { name: "Bloom-Edge", value: bloomEdge },
      { name: "Green-Main", value: greenMain },
      { name: "Green-Stem", value: greenStem },
    ];
  } else if (flowerType === "jadeVine") {
    // Base OKLCH set to: L: 0.65, C: 0.25, H: 175 (Luminous Turquoise)
    const { l, c, h } = oklch;

    // Helper functions
    const clampL = (x) => Math.max(0.2, Math.min(0.85, x));
    const clampC = (x) => Math.max(0.05, Math.min(0.4, x));

    // --- Hue Relationships (Optimized per previous discussion) ---
    // Shifts shadows COOLER (towards Blue/Cyan, H + 30) for max depth (towards 205)
    const bloomCoolH = (h + 30) % 360;
    // Shifts highlights WARMER (towards Green, H - 20) for luminescence (towards 155)
    const bloomWarmH = (h - 20 + 360) % 360;

    // Base Jade Petal
    const bloom = { l: l, c: c, h: h };

    // ----------------------------------------------------
    // Bloom Colors (5 Shades)
    // ----------------------------------------------------

    const bloomHighlight = {
      l: clampL(l * 1.25),
      c: clampC(c * 0.9),
      h: bloomWarmH,
    };

    const bloomLight = {
      l: clampL(l * 1.15),
      c: clampC(c * 1.0),
      h: h,
    };

    const bloomShadow = {
      l: clampL(l * 0.77),
      c: clampC(c * 1.15),
      h: bloomCoolH,
    };

    const bloomDeep = {
      l: clampL(l * 0.6),
      c: clampC(c * 1.3),
      h: bloomCoolH,
    };

    // Bloom-Tip: Adjusted to be slightly lighter and more muted (H=110 for olive)
    const tipH = 110; // Optimized Olive Tone
    const bloomTip = {
      l: clampL(l * 0.75), // Slightly lighter L than base logic (0.65 * 1.15)
      c: clampC(c * 0.4), // Lowered Chroma for a faded look
      h: tipH,
    };

    // ----------------------------------------------------
    // Green Foliage (5 Shades)
    // ----------------------------------------------------

    // Foliage must be much deeper and more saturated to contrast the flower.
    const leafH = 150;
    const vineH = 165; // Optimized for a warmer 'greige'

    const greenMain = {
      l: clampL(l * 0.7),
      c: clampC(c * 1.5),
      h: leafH,
    };

    const greenDeep = {
      l: clampL(l * 0.55),
      c: clampC(c * 1.2),
      h: leafH,
    };

    // Vine-Wood: The neutral brown/wood tone of the main vine
    const vineWood = {
      l: 0.45,
      c: 0.1,
      h: vineH,
    };

    // Bloom-Vein: ADJUSTED to be distinctly darker and slightly more saturated
    // It must scale from a different point than the tip, often a shadow of the green.
    const bloomVein = {
      l: clampL(l * 0.65), // Darker than tip (0.65 * 0.65 = 0.42 L if l=0.65)
      c: clampC(c * 0.6), // Slightly higher C than tip (0.25 * 0.6 = 0.15 C)
      h: tipH, // Same olive hue as tip for consistency
    };

    // ----------------------------------------------------
    // FINAL 10 DISTINCT JADE VINE COLORS
    // L: ~0.48 (Tip) vs L: ~0.42 (Vein) - Now distinct!
    // ----------------------------------------------------
    return [
      // GROUP 1: BLOOM LUMINESCENCE (Turquoise)
      { name: "Bloom-Highlight", value: bloomHighlight },
      { name: "Bloom-Light", value: bloomLight },
      { name: "Bloom", value: bloom },
      { name: "Bloom-Shadow", value: bloomShadow },
      { name: "Bloom-Deep", value: bloomDeep },

      // GROUP 2: FOLIAGE & BASE
      { name: "Green-Main", value: greenMain },
      { name: "Green-Deep", value: greenDeep },
      { name: "Vine-Wood", value: vineWood },
      { name: "Bloom-Tip", value: bloomTip }, // Lighter, more muted
      { name: "Bloom-Vein", value: bloomVein }, // Darker, more defined
    ];
  } else if (flowerType === "hydrangea") {
    // Base OKLCH set to: L: 0.60, C: 0.18, H: 260 (Rich Violet-Blue)
    const { l, c, h } = oklch;

    // Helper functions
    const clampL = (x) => Math.max(0.2, Math.min(0.9, x));
    const clampC = (x) => Math.max(0.05, Math.min(0.3, x));

    // --- Hue Relationships ---
    // Shifts shadows COOLER (towards Blue, H ~240) for depth
    const bloomCoolH = (h - 20 + 360) % 360;
    // Shifts highlights WARMER (towards Violet, H ~280) for soft edges
    const bloomWarmH = (h + 20) % 360;

    // Secondary contrast hue: Faded, pale green/yellow for the core
    const coreH = 90; // Yellow for core contrast

    // Base Petal Blue-Violet
    const bloom = { l: l, c: c, h: h };

    // ----------------------------------------------------
    // Petal Colors (5 Shades)
    // ----------------------------------------------------

    // Bloom-Highlight: The slightly faded/dried petal tip (L ~0.75)
    const bloomHighlight = {
      l: clampL(l * 1.25),
      c: clampC(c * 0.7), // Lowered C for a dusty, faded look
      h: bloomWarmH,
    };

    // Bloom-Light: Primary light tone (L ~0.70)
    const bloomLight = {
      l: clampL(l * 1.15),
      c: clampC(c * 0.9),
      h: h,
    };

    // Bloom-Mid: A clear step down from the base (L ~0.50)
    const bloomMid = {
      l: clampL(l * 0.85),
      c: clampC(c * 1.05),
      h: h,
    };

    // Bloom-Deep: Primary shadow color/deepest blue (L ~0.35)
    const bloomDeep = {
      l: clampL(l * 0.6),
      c: clampC(c * 1.2),
      h: bloomCoolH,
    };

    // Bloom-Vein: Darkest detail/vein line (L ~0.25)
    const bloomVein = {
      l: clampL(l * 0.45),
      c: clampC(c * 0.9),
      h: bloomCoolH,
    };

    // ----------------------------------------------------
    // Core & Foliage (5 Shades)
    // ----------------------------------------------------

    // Core-Green: Faded, slightly yellowed center/pistil
    const coreGreen = {
      l: clampL(l * 1.2), // L ~0.72
      c: clampC(c * 0.5),
      h: coreH,
    };

    // Core-Stigma: Tiny dark spot in the center
    const coreStigma = {
      l: 0.25,
      c: 0.1,
      h: bloomCoolH,
    };

    // Green Foliage: Large, structural leaves (dark and rich).
    const leafH = 150; // Standard Green
    const stemH = 180; // Blue-Green (for woody stems)

    // Green-Main: Primary rich foliage green (L ~0.50)
    const greenMain = {
      l: clampL(l * 0.85),
      c: clampC(c * 2.0), // High C multiplier for rich foliage
      h: leafH,
    };

    // Green-Shadow: Darkest shade for the heavy leaves (L ~0.35)
    const greenShadow = {
      l: clampL(l * 0.6),
      c: clampC(c * 1.5),
      h: stemH,
    };

    // ----------------------------------------------------
    // FINAL 10 DISTINCT HYDRANGEA COLORS
    // ----------------------------------------------------
    return [
      // GROUP 1: HIGHLIGHTS & LIGHT TONES
      { name: "Bloom-Highlight", value: bloomHighlight }, // Faded/Dry Petal Tip
      { name: "Bloom-Light", value: bloomLight },

      // GROUP 2: PETALS (Blue-Violet)
      { name: "Bloom", value: bloom },
      { name: "Bloom-Mid", value: bloomMid },
      { name: "Bloom-Deep", value: bloomDeep },
      { name: "Bloom-Vein", value: bloomVein },

      // GROUP 3: CORE & FOLIAGE
      { name: "Core-Green", value: coreGreen },
      { name: "Core-Stigma", value: coreStigma },
      { name: "Green-Main", value: greenMain },
      { name: "Green-Shadow", value: greenShadow },
    ];
  } else if (flowerType === "tigerLily") {
    // Base OKLCH set to: L: 0.70, C: 0.55, H: 35 (Fiery Red-Orange - NEW BASE)
    const { l, c, h } = oklch;

    // Helper functions
    const clampL = (x) => Math.max(0.15, Math.min(0.95, x));
    const clampC = (x) => Math.max(0.05, Math.min(0.6, x)); // Clamp increased for high chroma

    // --- Hue Relationships (Adjusted) ---
    // Shifts shadows towards deeper Red/Brown (H ~20)
    const bloomCoolH = (h - 15 + 360) % 360; // H: ~20
    // Shifts highlights towards Yellow-Orange (H ~50)
    const bloomWarmH = (h + 15) % 360; // H: ~50

    // The essential spot contrast: Deep Reddish-Brown (H 25)
    const spotH = 25; // Adjusted spot hue

    // Base Fiery Orange Petal
    const bloom = { l: l, c: c, h: h };

    // ----------------------------------------------------
    // Petal Colors (5 Shades)
    // ----------------------------------------------------

    // Bloom-Highlight: Yellowish tips (H ~70) with slightly reduced C
    const bloomHighlight = {
      l: clampL(l * 1.2), // L ~0.84
      c: clampC(c * 0.75), // Reduced C for natural look (per suggestion)
      h: 70, // Fixed H for yellowish tips
    };

    // Bloom-Light: Primary luminous tone, shifted yellow-orange (L ~0.77)
    const bloomLight = {
      l: clampL(l * 1.1),
      c: clampC(c * 0.95),
      h: bloomWarmH,
    };

    // Bloom-Shadow: Primary shadow step, shifted red-orange (L ~0.55)
    const bloomShadow = {
      l: clampL(l * 0.78),
      c: clampC(c * 1.05),
      h: bloomCoolH,
    };

    // Bloom-Muted: Deepest recess/darkest orange base (L ~0.40)
    const bloomMuted = {
      l: clampL(l * 0.58),
      c: clampC(c * 0.7),
      h: bloomCoolH,
    };

    // Core-Anther: The bright, burnt orange color of the pollen/anthers
    const coreAnther = {
      l: clampL(l * 1.0),
      c: clampC(c * 0.9),
      h: 40, // True Burnt Orange
    };

    // ----------------------------------------------------
    // Contrast Spots & Greens (5 Shades)
    // ----------------------------------------------------

    // Spot-Deep: Deep Reddish-Brown/Maroon (L ~0.40, H ~25)
    const spotDeep = {
      l: 0.4, // Fixed L for darkness (per suggestion)
      c: 0.25, // Fixed C for richness (per suggestion)
      h: spotH,
    };

    // Spot-Fuzz: The slightly lighter, blurred edge of the spot (L ~0.50)
    const spotFuzz = {
      l: 0.5,
      c: 0.2,
      h: spotH,
    };

    // Green Foliage: Adjusted for warmth and vibrancy (per suggestion).
    const leafH = 130; // Warmer Blue-Green (Optimized)

    // Green-Main: Primary foliage green (L ~0.65, C increased)
    const greenMain = {
      l: 0.65, // Fixed L (Per suggestion)
      c: clampC(c * 0.55), // Increased C multiplier for vibrancy
      h: leafH,
    };

    // Green-Shadow: Darker stem shadow (H ~130)
    const greenShadow = {
      l: clampL(l * 0.55),
      c: clampC(c * 0.4),
      h: leafH,
    };

    // ----------------------------------------------------
    // FINAL 10 DISTINCT TIGER LILY COLORS
    // ----------------------------------------------------
    return [
      // GROUP 1: ORANGE HIGHLIGHTS & CORE
      { name: "Bloom-Highlight", value: bloomHighlight }, // Yellowish Tips
      { name: "Bloom-Light", value: bloomLight },
      { name: "Core-Anther", value: coreAnther },

      // GROUP 2: ORANGE BASE & SPOTS
      { name: "Bloom", value: bloom },
      { name: "Bloom-Shadow", value: bloomShadow },
      { name: "Bloom-Muted", value: bloomMuted },
      { name: "Spot-Fuzz", value: spotFuzz }, // Lighter spot edge
      { name: "Spot-Deep", value: spotDeep }, // Dark Reddish-Brown Spot

      // GROUP 3: GREENS
      { name: "Green-Main", value: greenMain },
      { name: "Green-Shadow", value: greenShadow },
    ];
  } else if (flowerType === "callaLily") {
    // Base OKLCH set to: L: 0.93, C: 0.07, H: 95 (Luminous Cream)
    const { l, c, h } = oklch;

    // Helper functions
    const clampL = (x) => Math.max(0.2, Math.min(0.98, x));
    const clampC = (x) => Math.max(0.02, Math.min(0.4, x));

    // --- Hue Relationships ---
    const bloomCoolH = (h + 25) % 360;

    // Shadow/Throat Hue: Neutral/Blue-Green for deep shadow void (H 180) - NOT PLUM
    const shadowH = 180;
    // Spadix Hue: Soft Gold/Yellow
    const goldH = 80;

    // Base Cream Petal
    const bloom = { l: l, c: c, h: h };

    // ----------------------------------------------------
    // Petal Colors (4 Shades)
    // ----------------------------------------------------

    const bloomPurity = {
      l: 0.97,
      c: 0.03,
      h: h,
    };

    const bloomLight = {
      l: clampL(l * 1.02),
      c: clampC(c * 1.1),
      h: h,
    };

    const bloomShadow = {
      l: clampL(l * 0.9),
      c: clampC(c * 1.5),
      h: bloomCoolH,
    };

    // ----------------------------------------------------
    // Throat, Spadix & Core (4 Shades)
    // ----------------------------------------------------

    // Throat-Deep: The intense, near-black shadow void (Replaces Deep Plum)
    const throatDeep = {
      l: 0.25, // Very low L
      c: 0.05, // Very low C
      h: shadowH,
    };

    // Throat-Mid: The gradient transition from deep shadow to cream (L ~0.55)
    const throatMid = {
      l: 0.55,
      c: 0.1, // Low C
      h: shadowH,
    };

    // Core-Gold: The bright, soft gold color of the spadix
    const coreGold = {
      l: 0.8,
      c: 0.2,
      h: goldH,
    };

    // ----------------------------------------------------
    // Green Foliage (2 Shades)
    // ----------------------------------------------------

    const leafH = 150;
    const stemH = 140;

    // Green-Main: Primary rich foliage/stem green
    const greenMain = {
      l: clampL(l * 0.6),
      c: clampC(c * 4.0),
      h: stemH,
    };

    // Green-Deep: Darkest shade for the woody base/veins
    const greenDeep = {
      l: clampL(l * 0.45),
      c: clampC(c * 3.0),
      h: leafH,
    };

    // ----------------------------------------------------
    // FINAL 10 DISTINCT CALLA LILY COLORS
    // ----------------------------------------------------
    return [
      // GROUP 1: WHITE/CREAM PETALS
      { name: "Bloom-Purity", value: bloomPurity },
      { name: "Bloom-Light", value: bloomLight },
      { name: "Bloom", value: bloom },
      { name: "Bloom-Shadow", value: bloomShadow },

      // GROUP 2: CORE & THROAT SHADOWS (REPLACING PLUM)
      { name: "Core-Gold", value: coreGold }, // Spadix
      { name: "Throat-Mid", value: throatMid }, // Mid-Shadow
      { name: "Throat-Deep", value: throatDeep }, // Near-Black Void

      // GROUP 3: GREENS
      { name: "Green-Main", value: greenMain },
      { name: "Green-Deep", value: greenDeep },
      { name: "Core-Accent", value: { l: 0.95, c: 0.05, h: goldH } }, // Spadix Highlight
    ];
  } else if (flowerType === "bluePoppy") {
    // Base OKLCH set to: L: 0.65, C: 0.28, H: 240 (Vivid Sky Blue)
    const { l, c, h } = oklch;

    // Helper functions
    const clampL = (x) => Math.max(0.2, Math.min(0.85, x));
    const clampC = (x) => Math.max(0.05, Math.min(0.4, x));

    // --- Hue Relationships ---
    // Shifts shadows COOLER (towards Violet/Indigo, H ~260) for depth
    const bloomCoolH = (h + 20) % 360;
    // Shifts highlights WARMER (towards Cyan/Azure, H ~220) for luminescence
    const bloomWarmH = (h - 20 + 360) % 360;

    // The essential contrasting color: Bright Gold/Yellow for the stamens
    const coreH = 90; // Pure Yellow

    // Base Blue Petal
    const bloom = { l: l, c: c, h: h };

    // ----------------------------------------------------
    // Petal Colors (5 Shades)
    // ----------------------------------------------------

    // Bloom-Highlight: Very high L, shifted cyan for a luminous, sheer edge (L ~0.80)
    const bloomHighlight = {
      l: clampL(l * 1.25),
      c: clampC(c * 0.9), // Slightly lower C for a soft glow
      h: bloomWarmH,
    };

    // Bloom-Light: Primary light tone (L ~0.75)
    const bloomLight = {
      l: clampL(l * 1.15),
      c: clampC(c * 1.0),
      h: h,
    };

    // Bloom-Shadow: Primary shadow step, shifted violet (L ~0.50)
    const bloomShadow = {
      l: clampL(l * 0.77),
      c: clampC(c * 1.15),
      h: bloomCoolH,
    };

    // Bloom-Deep: Deepest crease/shadow color, highly saturated indigo (L ~0.35)
    const bloomDeep = {
      l: clampL(l * 0.55),
      c: clampC(c * 1.3),
      h: bloomCoolH,
    };

    // Petal-Edge: Near-white/neutral accent for the thin petal edge
    const petalEdge = {
      l: 0.9,
      c: 0.05,
      h: h,
    };

    // ----------------------------------------------------
    // Core & Foliage (5 Shades)
    // ----------------------------------------------------

    // Core-Vivid: The highly saturated yellow stamens
    const coreVivid = {
      l: 0.85,
      c: 0.35,
      h: coreH,
    };

    // Core-Shadow: Dark base of the stamens/pistil
    const coreShadow = {
      l: 0.4,
      c: 0.2,
      h: 120, // Dark Green/Olive
    };

    // Green Foliage: Muted, slightly hairy leaves/stems.
    const leafH = 135; // Warmer Blue-Green

    // Green-Main: Primary foliage green (L ~0.55)
    const greenMain = {
      l: clampL(l * 0.85),
      c: clampC(c * 0.6), // Reduced Chroma for a muted look
      h: leafH,
    };

    // Green-Stem: Darker, muted stem color (L ~0.40)
    const greenStem = {
      l: clampL(l * 0.6),
      c: clampC(c * 0.4),
      h: leafH,
    };

    // ----------------------------------------------------
    // FINAL 10 DISTINCT BLUE POPPY COLORS
    // ----------------------------------------------------
    return [
      // GROUP 1: HIGHLIGHTS & CORE
      { name: "Core-Vivid", value: coreVivid }, // Yellow Stamens
      { name: "Bloom-Highlight", value: bloomHighlight }, // Luminous Sheen

      // GROUP 2: BLUE PETALS
      { name: "Bloom-Light", value: bloomLight },
      { name: "Bloom", value: bloom },
      { name: "Bloom-Shadow", value: bloomShadow },
      { name: "Bloom-Deep", value: bloomDeep },

      // GROUP 3: GREENS & SHADOWS
      { name: "Petal-Edge", value: petalEdge }, // White/Neutral Edge
      { name: "Core-Shadow", value: coreShadow }, // Dark Core Base
      { name: "Green-Main", value: greenMain },
      { name: "Green-Stem", value: greenStem },
    ];
  } else if (flowerType === "foliage") {
    const { l, c, h } = oklch;

    // Helper functions
    const clampL = (x) => Math.max(0, Math.min(1, x));
    // Clamp Chroma moderately high for a fresh look
    const clampC = (x) => Math.max(0, Math.min(0.3, x));

    // ----------------------------------------------------
    // Leaf & Foliage Calculations
    // Base Green Hue is H: 150
    // ----------------------------------------------------
    // Shifts shadows COOLER (towards Blue/Cyan, H ~180) for depth
    const leafCoolH = (h + 30) % 360;
    // Shifts highlights WARMER (towards Yellow/Lime, H ~130) for luminescence
    const leafWarmH = (h - 20) % 360;

    // Base Leaf (L: 0.82, C: 0.12, H: 150)
    const leaf = oklch;

    // Leaf Colors (6 Shades)

    // Leaf-Highlight: Highest L, highest C, warm shift for luminous new growth
    const leafHighlight = {
      l: clampL(l * 1.1),
      c: clampC(c * 1.5),
      h: leafWarmH,
    };

    // Leaf-Light: Primary light tone
    const leafLight = {
      l: clampL(l * 1.05),
      c: clampC(c * 1.2),
      h: leafWarmH,
    };

    // Leaf-Soft: Desaturated, powdery/waxy coating highlight (High L, Low C)
    const leafSoft = {
      l: clampL(l * 1.15),
      c: clampC(c * 0.5),
      h: leafCoolH,
    };

    // Leaf-Mid: Primary transition tone, slightly darker than base
    const leafMid = {
      l: clampL(l * 0.9),
      c: clampC(c * 1.0),
      h: h,
    };

    // Leaf-Dark: Primary shadow color, cool shift
    const leafDark = {
      l: clampL(l * 0.7),
      c: clampC(c * 1.3),
      h: leafCoolH,
    };

    // Leaf-Deep: Deepest shadow, rich forest green (lowest L, highest C)
    const leafDeep = {
      l: clampL(l * 0.5),
      c: clampC(c * 1.8), // Pushing max chroma for depth
      h: leafCoolH,
    };

    // Auxiliary Colors (4 Shades)

    // Wood-Stem: Neutral, muted brown for bark/woody stems
    const woodStem = {
      l: clampL(l * 0.45),
      c: clampC(c * 0.5),
      h: 90, // Yellow hue for woody brown
    };

    // Earth-Shadow: Deep, rich earth/soil tone
    const earthShadow = {
      l: 0.3,
      c: 0.05,
      h: 40, // Warm brown/orange tone
    };

    // Green-Accent: Very bright, luminous highlight for dew/shine
    const greenAccent = {
      l: 0.98,
      c: 0.1,
      h: leafWarmH,
    };

    // Green-Muted: Desaturated, darker shade for older, less vibrant leaves
    const greenMuted = {
      l: clampL(l * 0.65),
      c: clampC(c * 0.8),
      h: leafCoolH,
    };

    // ----------------------------------------------------
    // PERFECTLY 10 DISTINCT FOLIAGE COLORS (ARRANGED FOR FLOW)
    // ----------------------------------------------------
    return [
      // GROUP 1: LEAF LUMINOSITY (Lightest to Base)
      { name: "Green-Accent", value: greenAccent }, // L: 0.98 (Dew/Shine)
      { name: "Leaf-Soft", value: leafSoft }, // L: 0.94 (Waxy/Powdery)
      { name: "Leaf-Highlight", value: leafHighlight }, // L: 0.90
      { name: "Leaf-Light", value: leafLight }, // L: 0.86
      { name: "Leaf", value: leaf }, // L: 0.82 (Base)

      // GROUP 2: SHADOWS & MID-TONES
      { name: "Leaf-Mid", value: leafMid }, // L: 0.74
      { name: "Leaf-Dark", value: leafDark }, // L: 0.57
      { name: "Leaf-Deep", value: leafDeep }, // L: 0.41 (Forest Green)

      // GROUP 3: EARTH/WOOD (Auxiliary Colors)
      { name: "Wood-Stem", value: woodStem }, // L: 0.37 (Woody Brown)
      { name: "Earth-Shadow", value: earthShadow }, // L: 0.30 (Soil)
    ];
  }
}

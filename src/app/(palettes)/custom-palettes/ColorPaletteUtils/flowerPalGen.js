export default function flowerPalGen(oklch, flowerType) {
  if (flowerType === "sunflower") {
    const { l, c, h } = oklch;

    // ----------------------------------------------------
    // Enhanced Helper Functions
    // ----------------------------------------------------
    const clampL = (x) => Math.max(0, Math.min(1, x));

    // Context-aware chroma clamping for natural vibrancy
    const clampC = (x, context = "default") => {
      const limits = {
        highlight: 0.5, // Bright pops of color
        shadow: 0.45, // Rich, saturated shadows
        core: 0.4, // Deep brown center
        default: 0.42, // General petals
      };
      return Math.max(0, Math.min(limits[context] || limits.default, x));
    };

    // Perceptual easing for smooth, natural transitions
    const smoothStep = (multiplier) => {
      if (multiplier > 1) {
        // Highlights: ease out (gentle acceleration)
        const t = multiplier - 1;
        return 1 + Math.pow(t, 1.5);
      } else {
        // Shadows: ease in (faster darkening)
        return Math.pow(multiplier, 1.5);
      }
    };

    // Natural shadow hue shift (warm colors shift toward brown/burgundy)
    const getShadowHue = (baseH, depth = "mid") => {
      // Yellow-orange flowers shift toward brown in shadow
      const shifts = {
        mid: -10, // Subtle brown shift
        deep: -20, // Deeper brown/burnt orange
      };
      return (baseH + shifts[depth] + 360) % 360;
    };

    // ----------------------------------------------------
    // Petal Colors (6 Shades) - Enhanced Vibrancy
    // ----------------------------------------------------

    // Petal-Bright: Brilliant, sunlit edge
    const petalBright = {
      l: clampL(l * smoothStep(1.25)), // More luminous
      c: clampC(c * 1.35, "highlight"), // Peak saturation
      h: (h + 5) % 360, // Slight yellow shift
    };

    // Petal-Light: Primary highlight
    const petalLight = {
      l: clampL(l * smoothStep(1.15)),
      c: clampC(c * 1.1),
      h,
    };

    // Petal-Soft: Muted, powdery transition
    const petalSoft = {
      l: clampL(l * 1.08),
      c: clampC(c * 0.5),
      h: (h + 3) % 360, // Very subtle warm shift
    };

    // Petal: Base color (unchanged from input)
    const petal = oklch;

    // Petal-Dark: Primary shadow with natural hue shift
    const petalDark = {
      l: clampL(l * smoothStep(0.72)),
      c: clampC(c * 1.05, "shadow"),
      h: getShadowHue(h, "mid"),
    };

    // Petal-Deep: Deepest shadow at base, rich and saturated
    const petalDeep = {
      l: clampL(l * smoothStep(0.55)),
      c: clampC(c * 1.25, "shadow"), // Increased for depth
      h: getShadowHue(h, "deep"),
    };

    // ----------------------------------------------------
    // Disk/Center (2 Colors) - Enhanced Contrast
    // ----------------------------------------------------
    const diskH = 45; // Warmer brown (was 50)

    // Disk-Outer: Rich brown outer ring
    const diskOuter = {
      l: clampL(l * 0.38),
      c: clampC(0.18, "core"), // More saturated brown
      h: diskH,
    };

    // Disk-Core: Deep, near-black center with warmth
    const diskCore = {
      l: clampL(l * 0.18),
      c: clampC(0.1, "core"), // Slightly warm even in darkness
      h: diskH,
    };

    // ----------------------------------------------------
    // Leaves/Greens (2 Colors) - Enhanced Richness
    // ----------------------------------------------------
    const leafH = (h + 45) % 360; // Slightly adjusted for better green

    // Green-Main: Fresh, vibrant foliage
    const greenMain = {
      l: clampL(l * smoothStep(0.6)),
      c: clampC(c * 0.85), // More saturated
      h: leafH,
    };

    // Green-Dark: Deep shadow green
    const greenDark = {
      l: clampL(l * smoothStep(0.45)),
      c: clampC(c * 0.8), // Rich shadow
      h: (leafH + 5) % 360, // Slight shift for depth
    };

    // ----------------------------------------------------
    // PERFECTLY 10 DISTINCT SUNFLOWER COLORS
    // Natural, vibrant, designer-ready
    // ----------------------------------------------------
    return [
      // GROUP 1: PETALS (Brightest to Darkest)
      { name: "Petal-Bright", value: petalBright }, // L: ~1.10, C: peak
      { name: "Petal-Light", value: petalLight }, // L: ~1.01
      { name: "Petal-Soft", value: petalSoft }, // L: ~0.95, muted
      { name: "Petal", value: petal }, // L: 0.88 (base)
      { name: "Petal-Dark", value: petalDark }, // L: ~0.63
      { name: "Petal-Deep", value: petalDeep }, // L: ~0.48, rich

      // GROUP 2: DISK (Outer to Core)
      { name: "Disk-Outer", value: diskOuter }, // L: ~0.33, brown
      { name: "Disk-Core", value: diskCore }, // L: ~0.16, near-black

      // GROUP 3: GREENS (Light to Dark)
      { name: "Green-Main", value: greenMain }, // L: ~0.53
      { name: "Green-Dark", value: greenDark }, // L: ~0.40
    ];
  } else if (flowerType === "rose") {
    const { l, c, h } = oklch;

    // ----------------------------------------------------
    // Enhanced Helper Functions
    // ----------------------------------------------------
    const clampL = (x) => Math.max(0, Math.min(1, x));

    // Context-aware chroma clamping for velvet richness
    const clampC = (x, context = "default") => {
      const limits = {
        highlight: 0.48, // Soft, luminous edges
        petal: 0.5, // Rich mid-tones
        shadow: 0.52, // Deep velvet shadows (high chroma)
        core: 0.5, // Saturated center
        default: 0.48,
      };
      return Math.max(0, Math.min(limits[context] || limits.default, x));
    };

    // Perceptual easing for smooth, natural transitions
    const smoothStep = (multiplier) => {
      if (multiplier > 1) {
        // Highlights: ease out (gentle, romantic glow)
        const t = multiplier - 1;
        return 1 + Math.pow(t, 1.3);
      } else {
        // Shadows: ease in with velvet curve
        return Math.pow(multiplier, 1.4);
      }
    };

    // Subsurface scattering logic for translucent petals
    const getTranslucentShadow = (baseL, baseC, hueShift) => {
      return {
        // Shadows stay relatively light (light passes through)
        l: clampL(baseL * smoothStep(0.75)),
        // But chroma INCREASES (color intensifies)
        c: clampC(baseC * 1.3, "shadow"),
        h: hueShift,
      };
    };

    // Natural shadow hue shift for roses (toward magenta/purple)
    const getShadowHue = (baseH, depth = "mid") => {
      // Pink/red flowers shift toward cooler magenta/purple in shadow
      const shifts = {
        light: -5, // Slight cool
        mid: -10, // Medium cool (toward magenta)
        deep: -15, // Deep purple shadow
      };
      return (baseH + shifts[depth] + 360) % 360;
    };

    // Highlight shift (toward warmer, peachy tones)
    const getHighlightHue = (baseH, intensity = "mid") => {
      const shifts = {
        soft: +5, // Subtle peach
        mid: +8, // Warm glow
        bright: +12, // Peachy-pink
      };
      return (baseH + shifts[intensity]) % 360;
    };

    // ----------------------------------------------------
    // Petal Colors (6 Shades) - Velvet Rose Gradient
    // ----------------------------------------------------

    // Petal-Soft: Softest, most luminous highlight (almost white-pink)
    const petalSoft = {
      l: clampL(l * smoothStep(1.18)),
      c: clampC(c * 0.45, "highlight"), // Very desaturated for soft glow
      h: getHighlightHue(h, "bright"),
    };

    // Petal-Light: Primary illuminated edge
    const petalLight = {
      l: clampL(l * smoothStep(1.08)),
      c: clampC(c * 0.92),
      h: getHighlightHue(h, "mid"),
    };

    // Petal: Base color (unchanged from input)
    const petal = oklch;

    // Petal-Mid: Primary transition tone with slight saturation boost
    const petalMid = {
      l: clampL(l * smoothStep(0.9)),
      c: clampC(c * 1.1, "petal"),
      h: h,
    };

    // Petal-Dark: Primary shadow with subsurface scattering
    const petalDark = getTranslucentShadow(l, c, getShadowHue(h, "mid"));

    // Petal-Deep: Deepest velvet shadow (highest chroma for depth)
    const petalDeep = {
      l: clampL(l * smoothStep(0.58)),
      c: clampC(c * 1.35, "shadow"), // Peak saturation for velvet
      h: getShadowHue(h, "deep"),
    };

    // ----------------------------------------------------
    // Core Colors (2 Shades) - Warm, Golden Center
    // ----------------------------------------------------
    const coreWarmH = (h + 15) % 360; // Warmer, peachy-gold

    // Core-Main: Warm, glowing center
    const coreMain = {
      l: clampL(l * 0.72),
      c: clampC(c * 1.2, "core"),
      h: coreWarmH,
    };

    // Core-Deep: Deep shadow at base of stamens
    const coreDeep = {
      l: 0.15,
      c: 0.08, // Slight warmth even in darkness
      h: coreWarmH,
    };

    // ----------------------------------------------------
    // Green Foliage (2 Colors) - Rich, Lush Greens
    // ----------------------------------------------------
    const leafH = (h + 145) % 360; // Richer green
    const stemH = (h + 130) % 360; // Warmer stem

    // Green-Main: Primary vibrant foliage
    const greenMain = {
      l: clampL(l * smoothStep(0.62)),
      c: clampC(c * 0.8), // More saturated
      h: leafH,
    };

    // Green-Stem: Muted, darker stem with warmth
    const greenStem = {
      l: clampL(l * smoothStep(0.58)),
      c: clampC(c * 0.4), // More saturated than before
      h: stemH,
    };

    // ----------------------------------------------------
    // PERFECTLY 10 DISTINCT ROSE COLORS
    // Velvet, romantic, subsurface scattering
    // ----------------------------------------------------
    return [
      // GROUP 1: PETALS (Light to Dark) - Velvet Gradient
      { name: "Petal-Soft", value: petalSoft }, // L: ~0.74, soft glow
      { name: "Petal-Light", value: petalLight }, // L: ~0.68
      { name: "Petal", value: petal }, // L: 0.63 (base)
      { name: "Petal-Mid", value: petalMid }, // L: ~0.57
      { name: "Petal-Dark", value: petalDark }, // L: ~0.47, translucent
      { name: "Petal-Deep", value: petalDeep }, // L: ~0.37, velvet

      // GROUP 2: CORE (Glow to Deepest Shadow)
      { name: "Core-Main", value: coreMain }, // L: ~0.45, warm
      { name: "Core-Deep", value: coreDeep }, // L: 0.15, deep

      // GROUP 3: GREENS (Auxiliary Colors)
      { name: "Green-Main", value: greenMain }, // L: ~0.39
      { name: "Green-Stem", value: greenStem }, // L: ~0.37
    ];
  } else if (flowerType === "lavender") {
    const { l, c, h } = oklch;

    // ----------------------------------------------------
    // Enhanced Helper Functions
    // ----------------------------------------------------
    const clampL = (x) => Math.max(0, Math.min(1, x));

    // Context-aware chroma clamping for powdery, muted aesthetic
    const clampC = (x, context = "default") => {
      const limits = {
        highlight: 0.12, // Very low for powdery effect
        soft: 0.1, // Extremely desaturated
        bloom: 0.22, // Base petals (increased from 0.2)
        shadow: 0.25, // Shadows can be slightly richer
        core: 0.18, // Muted core
        default: 0.22,
      };
      return Math.max(0, Math.min(limits[context] || limits.default, x));
    };

    // Perceptual easing for gentle, powdery transitions
    const smoothStep = (multiplier) => {
      if (multiplier > 1) {
        // Highlights: very gentle ease (soft, diffused)
        const t = multiplier - 1;
        return 1 + Math.pow(t, 1.8); // Slower acceleration
      } else {
        // Shadows: gentle darkening (not harsh)
        return Math.pow(multiplier, 1.3);
      }
    };

    // Natural shadow hue shift for lavender (toward deeper violet/blue)
    const getShadowHue = (baseH, depth = "mid") => {
      // Purple flowers shift toward deeper blue-violet in shadow
      const shifts = {
        light: +3, // Slight cool
        mid: +6, // Bluer violet
        deep: +10, // Deep indigo
      };
      return (baseH + shifts[depth]) % 360;
    };

    // Highlight shift (toward warmer, pinker lavender)
    const getHighlightHue = (baseH, intensity = "mid") => {
      const shifts = {
        soft: -3, // Subtle pink
        mid: -5, // Warm lavender-pink
        bright: -8, // Peachy-lavender
      };
      return (baseH + shifts[intensity] + 360) % 360;
    };

    // ----------------------------------------------------
    // Bloom Colors (7 Shades) - Powdery Lavender Gradient
    // ----------------------------------------------------

    // Bloom-Accent: Near-white sparkle for contrast
    const bloomAccent = {
      l: 0.96,
      c: 0.04, // Very low chroma
      h: h,
    };

    // Bloom-Soft: Extremely powdery, faded highlight
    const bloomSoft = {
      l: clampL(l * smoothStep(1.2)), // More luminous
      c: clampC(0.06, "soft"), // Fixed low chroma
      h: getHighlightHue(h, "bright"),
    };

    // Bloom-Light: Primary luminous tone
    const bloomLight = {
      l: clampL(l * smoothStep(1.08)),
      c: clampC(c * 0.85, "highlight"),
      h: getHighlightHue(h, "mid"),
    };

    // Bloom: Base color (unchanged from input)
    const bloom = oklch;

    // Bloom-Mid: Smooth transition with slight saturation
    const bloomMid = {
      l: clampL(l * smoothStep(0.9)),
      c: clampC(c * 1.1, "bloom"),
      h: h,
    };

    // Bloom-Dark: Primary shadow, cooler shift
    const bloomDark = {
      l: clampL(l * smoothStep(0.75)),
      c: clampC(c * 1.15, "shadow"),
      h: getShadowHue(h, "mid"),
    };

    // Bloom-Deep: Deepest shadow, rich violet (highest chroma)
    const bloomDeep = {
      l: clampL(l * smoothStep(0.65)),
      c: clampC(c * 1.25, "shadow"), // Peak saturation for depth
      h: getShadowHue(h, "deep"),
    };

    // ----------------------------------------------------
    // Core Colors (2 Shades) - Dark, Muted Center
    // ----------------------------------------------------

    // Core-Main: Low L, moderate C for the dark seed/calyx base
    const coreMain = {
      l: clampL(l * 0.42), // Slightly lighter for better visibility
      c: clampC(c * 0.9, "core"),
      h: getShadowHue(h, "deep"),
    };

    // Core-Deep: Near-black point with subtle violet
    const coreDeep = {
      l: 0.18, // Slightly lighter than before
      c: 0.06, // Slight warmth
      h: getShadowHue(h, "deep"),
    };

    // ----------------------------------------------------
    // Green Foliage (2 Colors) - Muted, Dusty Greens
    // ----------------------------------------------------
    const leafH = (h + 165) % 360; // Slightly adjusted for better sage
    const stemH = (h + 145) % 360; // Warmer, woodier stem

    // Green-Main: Dusty, light sage green for leaves
    const greenMain = {
      l: clampL(l * smoothStep(0.72)), // Slightly lighter
      c: clampC(c * 0.6), // More saturated
      h: leafH,
    };

    // Green-Stem: Woodier, darker tone for the stalk
    const greenStem = {
      l: clampL(l * smoothStep(0.56)), // Slightly lighter
      c: clampC(c * 0.35), // More saturated
      h: stemH,
    };

    // ----------------------------------------------------
    // PERFECTLY 11 DISTINCT LAVENDER COLORS
    // Powdery, muted, calming aesthetic
    // ----------------------------------------------------
    return [
      // GROUP 1: BLOOM HIGHLIGHTS (Lightest, Powdery)
      { name: "Bloom-Accent", value: bloomAccent }, // L: 0.96, near-white
      { name: "Bloom-Soft", value: bloomSoft }, // L: ~0.96, powdery
      { name: "Bloom-Light", value: bloomLight }, // L: ~0.86

      // GROUP 2: BASE & MID-TONES
      { name: "Bloom", value: bloom }, // L: 0.80 (base)
      { name: "Bloom-Mid", value: bloomMid }, // L: ~0.72

      // GROUP 3: SHADOWS (Deeper Violet)
      { name: "Bloom-Dark", value: bloomDark }, // L: ~0.60
      { name: "Bloom-Deep", value: bloomDeep }, // L: ~0.52

      // GROUP 4: CORE (Calyx/Seed base)
      { name: "Core-Main", value: coreMain }, // L: ~0.34
      { name: "Core-Deep", value: coreDeep }, // L: 0.18

      // GROUP 5: GREENS (Auxiliary Colors)
      { name: "Green-Main", value: greenMain }, // L: ~0.58
      { name: "Green-Stem", value: greenStem }, // L: ~0.45
    ];
  } else if (flowerType === "orchid") {
    const { l, c, h } = oklch;

    // ----------------------------------------------------
    // Enhanced Helper Functions
    // ----------------------------------------------------
    const clampL = (x) => Math.max(0, Math.min(1, x));

    // Context-aware chroma clamping for vivid, exotic orchid
    const clampC = (x, context = "default") => {
      const limits = {
        highlight: 0.42, // Soft, luminous edges
        petal: 0.5, // Rich, saturated petals
        shadow: 0.52, // Deep, vivid shadows
        lip: 0.58, // MAXIMUM saturation for lip/throat
        vein: 0.08, // Very low for veins
        default: 0.48,
      };
      return Math.max(0, Math.min(limits[context] || limits.default, x));
    };

    // Perceptual easing for smooth, exotic transitions
    const smoothStep = (multiplier) => {
      if (multiplier > 1) {
        // Highlights: gentle ease (luminous, glossy)
        const t = multiplier - 1;
        return 1 + Math.pow(t, 1.4);
      } else {
        // Shadows: sharper darkening (dramatic contrast)
        return Math.pow(multiplier, 1.5);
      }
    };

    // Natural shadow hue shift for orchids (toward blue/magenta)
    const getShadowHue = (baseH, depth = "mid") => {
      // Pink/magenta orchids shift toward cooler magenta/violet in shadow
      const shifts = {
        light: -8, // Subtle cool
        mid: -12, // Cooler magenta
        deep: -18, // Deep violet/blue
      };
      return (baseH + shifts[depth] + 360) % 360;
    };

    // Highlight shift (toward warmer, peachy-pink)
    const getHighlightHue = (baseH, intensity = "mid") => {
      const shifts = {
        soft: +8, // Warm glow
        mid: +12, // Peachy-pink
        bright: +15, // Warm coral-pink
      };
      return (baseH + shifts[intensity]) % 360;
    };

    // Glossy specular highlight (for waxy orchid texture)
    const getSpecularHighlight = (baseL, baseC, baseH) => ({
      l: Math.min(0.98, baseL * 1.35),
      c: clampC(baseC * 0.25, "vein"), // Very desaturated
      h: baseH,
    });

    // ----------------------------------------------------
    // Petal Colors (5 Shades) - Exotic Gradient
    // ----------------------------------------------------

    // Vein-Accent: Near-white specular highlight (glossy)
    const veinAccent = getSpecularHighlight(l, c, h);

    // Bloom-Soft: Luminous, desaturated highlight
    const bloomSoft = {
      l: clampL(l * smoothStep(1.18)),
      c: clampC(c * 0.48, "highlight"),
      h: getHighlightHue(h, "bright"),
    };

    // Bloom-Light: High L, warm shift for illuminated edge
    const bloomLight = {
      l: clampL(l * smoothStep(1.12)),
      c: clampC(c * 0.92),
      h: getHighlightHue(h, "mid"),
    };

    // Bloom: Base color (unchanged from input)
    const bloom = oklch;

    // Bloom-Mid: Primary transition tone with saturation boost
    const bloomMid = {
      l: clampL(l * smoothStep(0.9)),
      c: clampC(c * 1.15, "petal"),
      h: h,
    };

    // Bloom-Dark: Primary shadow color, cool shift
    const bloomDark = {
      l: clampL(l * smoothStep(0.75)),
      c: clampC(c * 1.25, "shadow"),
      h: getShadowHue(h, "mid"),
    };

    // Bloom-Deep: Deep, cool shadow (lowest L, high C)
    const bloomDeep = {
      l: clampL(l * smoothStep(0.6)),
      c: clampC(c * 1.38, "shadow"), // Peak petal saturation
      h: getShadowHue(h, "deep"),
    };

    // ----------------------------------------------------
    // Lip/Throat Colors (2 Shades) - Maximum Drama
    // ----------------------------------------------------

    // Core-Main: Mid-tone transition from petal to lip
    const coreMain = {
      l: clampL(l * 0.82),
      c: clampC(c * 1.2, "petal"),
      h: getHighlightHue(h, "soft"),
    };

    // Lip-Core: Dark, HIGHLY saturated center of the lip/throat
    const lipCore = {
      l: clampL(l * 0.52),
      c: clampC(c * 1.8, "lip"), // MAXIMUM chroma for vivid contrast
      h: getShadowHue(h, "deep"),
    };

    // ----------------------------------------------------
    // Green Foliage (2 Colors) - Bright, Fresh Greens
    // ----------------------------------------------------
    const leafH = (h + 145) % 360; // Bright, fresh green
    const stemH = (h + 125) % 360; // Slightly warmer, muted

    // Green-Main: Bright, cool green for large leaves
    const greenMain = {
      l: clampL(l * smoothStep(0.78)), // Lighter
      c: clampC(c * 0.7), // More saturated
      h: leafH,
    };

    // Green-Stem: Darker, muted tone for spike/woodier parts
    const greenStem = {
      l: clampL(l * smoothStep(0.52)),
      c: clampC(c * 0.4), // More saturated
      h: stemH,
    };

    // ----------------------------------------------------
    // PERFECTLY 11 DISTINCT ORCHID COLORS
    // Vivid, exotic, glossy aesthetic
    // ----------------------------------------------------
    return [
      // GROUP 1: BLOOM HIGHLIGHTS (Glossy & Luminous)
      { name: "Vein-Accent", value: veinAccent }, // L: ~1.0, specular
      { name: "Bloom-Soft", value: bloomSoft }, // L: ~0.89
      { name: "Bloom-Light", value: bloomLight }, // L: ~0.84

      // GROUP 2: PETAL TRANSITIONS (Base to Deep Shadow)
      { name: "Bloom", value: bloom }, // L: 0.75 (base)
      { name: "Bloom-Mid", value: bloomMid }, // L: ~0.68
      { name: "Bloom-Dark", value: bloomDark }, // L: ~0.56
      { name: "Bloom-Deep", value: bloomDeep }, // L: ~0.45

      // GROUP 3: CORE/LIP (The focal point)
      { name: "Core-Main", value: coreMain }, // L: ~0.62
      { name: "Lip-Core", value: lipCore }, // L: ~0.39, VIVID

      // GROUP 4: GREENS (Auxiliary Colors)
      { name: "Green-Main", value: greenMain }, // L: ~0.59
      { name: "Green-Stem", value: greenStem }, // L: ~0.39
    ];
  } else if (flowerType === "lotus") {
    const { l, c, h } = oklch;

    // ----------------------------------------------------
    // Enhanced Helper Functions
    // ----------------------------------------------------
    const clampL = (x) => Math.max(0, Math.min(1, x));

    // Context-aware chroma clamping for soft, pastel, calming effect
    const clampC = (x, context = "default") => {
      const limits = {
        highlight: 0.08, // Very low for purity
        petal: 0.18, // Soft pastels (increased from 0.15)
        shadow: 0.2, // Gentle shadows
        core: 0.25, // Slightly richer core for contrast
        default: 0.18,
      };
      return Math.max(0, Math.min(limits[context] || limits.default, x));
    };

    // Perceptual easing for extremely gentle, serene transitions
    const smoothStep = (multiplier) => {
      if (multiplier > 1) {
        // Highlights: very soft, ethereal glow
        const t = multiplier - 1;
        return 1 + Math.pow(t, 2.0); // Very gentle
      } else {
        // Shadows: soft darkening (no harshness)
        return Math.pow(multiplier, 1.2);
      }
    };

    // Natural shadow hue shift for lotus (toward soft magenta/purple)
    const getShadowHue = (baseH, depth = "mid") => {
      // Pink lotus shifts subtly toward cooler tones
      const shifts = {
        light: -3, // Very subtle
        mid: -6, // Gentle cool
        deep: -10, // Soft purple
      };
      return (baseH + shifts[depth] + 360) % 360;
    };

    // Highlight shift (toward warmer, peachy-white)
    const getHighlightHue = (baseH, intensity = "mid") => {
      const shifts = {
        soft: +3, // Gentle warm
        mid: +5, // Peachy glow
        bright: +8, // Warm white-pink
      };
      return (baseH + shifts[intensity]) % 360;
    };

    // Translucent petal effect (light passes through)
    const getTranslucentHighlight = (baseL, baseC, baseH) => ({
      l: Math.min(0.98, baseL * 1.1),
      c: clampC(0.03, "highlight"), // Fixed very low chroma
      h: baseH,
    });

    // ----------------------------------------------------
    // Petal Colors (7 Shades) - Ethereal Gradient
    // ----------------------------------------------------

    // Bloom-Highlight: Absolute purity, near-white
    const bloomHighlight = getTranslucentHighlight(l, c, h);

    // Bloom-Soft: Luminous, high L, lowest C for softest look
    const bloomSoft = {
      l: clampL(l * smoothStep(1.12)),
      c: clampC(0.06, "highlight"), // Fixed low chroma
      h: getHighlightHue(h, "bright"),
    };

    // Bloom-Light: High L, gentle warm shift
    const bloomLight = {
      l: clampL(l * smoothStep(1.06)),
      c: clampC(c * 0.88),
      h: getHighlightHue(h, "mid"),
    };

    // Bloom: Base color (unchanged from input)
    const bloom = oklch;

    // Bloom-Mid: Primary transition tone
    const bloomMid = {
      l: clampL(l * smoothStep(0.95)),
      c: clampC(c * 1.08, "petal"),
      h: h,
    };

    // Bloom-Dark: Primary shadow color, cool shift
    const bloomDark = {
      l: clampL(l * smoothStep(0.82)),
      c: clampC(c * 1.15, "shadow"),
      h: getShadowHue(h, "mid"),
    };

    // Bloom-Deep: Deepest shadow, slightly cool
    const bloomDeep = {
      l: clampL(l * smoothStep(0.72)),
      c: clampC(c * 1.25, "shadow"), // Increased for depth
      h: getShadowHue(h, "deep"),
    };

    // ----------------------------------------------------
    // Core Colors (2 Shades) - Soft Center Contrast
    // ----------------------------------------------------

    // Core-Dust: A muted, slightly warm accent for the stamens
    const coreDust = {
      l: clampL(l * 0.92),
      c: clampC(0.12, "core"), // Increased from 0.1
      h: (h + 35) % 360, // Shifts toward yellow-pink
    };

    // Core-Main: Low L, moderately saturated, brownish-pink center
    const coreMain = {
      l: clampL(l * 0.58), // Slightly lighter for visibility
      c: clampC(c * 1.6, "core"), // Increased for contrast
      h: getShadowHue(h, "mid"),
    };

    // ----------------------------------------------------
    // Green Foliage (2 Colors) - Muted, Blue-Green Pads
    // ----------------------------------------------------
    const leafH = (h + 185) % 360; // Opposite side, blue-green
    const stemH = (h + 165) % 360; // Muted, dusty green

    // Green-Main: Soft, slightly desaturated green for pads/leaves
    const greenMain = {
      l: clampL(l * smoothStep(0.78)), // Lighter
      c: clampC(c * 0.8), // More saturated
      h: leafH,
    };

    // Green-Deep: Darker, muted tone for submerged stem/underside
    const greenDeep = {
      l: clampL(l * smoothStep(0.58)),
      c: clampC(c * 0.6), // More saturated
      h: stemH,
    };

    // ----------------------------------------------------
    // PERFECTLY 11 DISTINCT LOTUS COLORS
    // Serene, translucent, calming aesthetic
    // ----------------------------------------------------
    return [
      // GROUP 1: BLOOM HIGHLIGHTS (Purity and Softness)
      { name: "Bloom-Highlight", value: bloomHighlight }, // L: ~0.99, purity
      { name: "Bloom-Soft", value: bloomSoft }, // L: ~1.01, softest
      { name: "Bloom-Light", value: bloomLight }, // L: ~0.95

      // GROUP 2: PETAL TRANSITIONS (Base to Shadow)
      { name: "Bloom", value: bloom }, // L: 0.90 (base)
      { name: "Bloom-Mid", value: bloomMid }, // L: ~0.86
      { name: "Bloom-Dark", value: bloomDark }, // L: ~0.74
      { name: "Bloom-Deep", value: bloomDeep }, // L: ~0.65

      // GROUP 3: CORE (Contrast and Stamen)
      { name: "Core-Dust", value: coreDust }, // L: ~0.83, stamen
      { name: "Core-Main", value: coreMain }, // L: ~0.52, center

      // GROUP 4: GREENS (Auxiliary Colors)
      { name: "Green-Main", value: greenMain }, // L: ~0.70
      { name: "Green-Deep", value: greenDeep }, // L: ~0.52
    ];
  } else if (flowerType === "bluebell") {
    const { l, c, h } = oklch;

    // ----------------------------------------------------
    // Enhanced Helper Functions
    // ----------------------------------------------------
    const clampL = (x) => Math.max(0, Math.min(1, x));

    // Context-aware chroma clamping for vivid blue
    const clampC = (x, context = "default") => {
      const limits = {
        highlight: 0.38, // Moderate for soft edges
        petal: 0.42, // Rich, saturated petals (increased from 0.35)
        shadow: 0.45, // Deep, vivid shadows
        core: 0.2, // Muted core
        default: 0.4,
      };
      return Math.max(0, Math.min(limits[context] || limits.default, x));
    };

    // Perceptual easing for smooth, vivid transitions
    const smoothStep = (multiplier) => {
      if (multiplier > 1) {
        // Highlights: gentle ease (soft blue glow)
        const t = multiplier - 1;
        return 1 + Math.pow(t, 1.4);
      } else {
        // Shadows: moderate darkening
        return Math.pow(multiplier, 1.4);
      }
    };

    // Natural shadow hue shift for bluebell (toward deep indigo/purple)
    const getShadowHue = (baseH, depth = "mid") => {
      // Blue flowers shift toward deeper violet/indigo
      const shifts = {
        light: +12, // Toward purple
        mid: +18, // Deeper violet
        deep: +25, // Deep indigo
      };
      return (baseH + shifts[depth]) % 360;
    };

    // Highlight shift (toward lighter cyan/blue)
    const getHighlightHue = (baseH, intensity = "mid") => {
      const shifts = {
        soft: -15, // Cyan-blue
        mid: -22, // Bright cyan
        bright: -28, // Light sky blue
      };
      return (baseH + shifts[intensity] + 360) % 360;
    };

    // ----------------------------------------------------
    // Petal Colors (7 Shades) - Vivid Blue Gradient
    // ----------------------------------------------------

    // Bloom-Accent: Near-white accent for contrast
    const bloomAccent = {
      l: 0.96,
      c: 0.06,
      h: h,
    };

    // Bloom-Soft: Desaturated, luminous highlight
    const bloomSoft = {
      l: clampL(l * smoothStep(1.18)),
      c: clampC(c * 0.48, "highlight"),
      h: getHighlightHue(h, "bright"),
    };

    // Bloom-Light: High L, high C, shifted cyan for luminosity
    const bloomLight = {
      l: clampL(l * smoothStep(1.08)),
      c: clampC(c * 1.15, "petal"),
      h: getHighlightHue(h, "mid"),
    };

    // Bloom: Base color (unchanged from input)
    const bloom = oklch;

    // Bloom-Mid: Primary transition, slightly darker
    const bloomMid = {
      l: clampL(l * smoothStep(0.88)),
      c: clampC(c * 1.1, "petal"),
      h: h,
    };

    // Bloom-Dark: Primary shadow, indigo shift
    const bloomDark = {
      l: clampL(l * smoothStep(0.68)),
      c: clampC(c * 1.25, "shadow"),
      h: getShadowHue(h, "mid"),
    };

    // Bloom-Deep: Deepest shadow, intense indigo/violet
    const bloomDeep = {
      l: clampL(l * smoothStep(0.52)),
      c: clampC(c * 1.55, "shadow"), // Peak saturation
      h: getShadowHue(h, "deep"),
    };

    // ----------------------------------------------------
    // Core Colors (2 Shades) - Throat/Base Contrast
    // ----------------------------------------------------

    // Core-Base: Muted throat color
    const coreBase = {
      l: clampL(l * 0.48),
      c: clampC(c * 0.85, "core"),
      h: getShadowHue(h, "deep"),
    };

    // Core-Deep: Near-black point with violet tint
    const coreDeep = {
      l: 0.18,
      c: 0.08, // Slight violet warmth
      h: getShadowHue(h, "deep"),
    };

    // ----------------------------------------------------
    // Green Foliage (2 Colors) - Cool, Fresh Greens
    // ----------------------------------------------------

    // Use large hue shift to land in cool green zone (H: 100-110)
    const leafH = (h + 200) % 360; // H: (260 + 200) = 100 (Cool Green)
    const stemH = (h + 210) % 360; // H: (260 + 210) = 110 (Slightly yellower)

    // Green-Main: Bright, crisp green for foliage
    const greenMain = {
      l: clampL(l * smoothStep(0.73)), // Slightly lighter
      c: clampC(c * 0.9), // More saturated
      h: leafH,
    };

    // Green-Stem: Darker, muted tone for the stalk
    const greenStem = {
      l: clampL(l * smoothStep(0.58)),
      c: clampC(c * 0.5), // More saturated
      h: stemH,
    };

    // ----------------------------------------------------
    // PERFECTLY 11 DISTINCT BLUEBELL COLORS
    // Vivid, woodland, enchanting aesthetic
    // ----------------------------------------------------
    return [
      // GROUP 1: BLOOM HIGHLIGHTS (Purity and Light)
      { name: "Bloom-Accent", value: bloomAccent }, // L: 0.96, white
      { name: "Bloom-Soft", value: bloomSoft }, // L: ~0.85
      { name: "Bloom-Light", value: bloomLight }, // L: ~0.78

      // GROUP 2: PETAL TRANSITIONS (Base to Deep Shadow)
      { name: "Bloom", value: bloom }, // L: 0.72 (base)
      { name: "Bloom-Mid", value: bloomMid }, // L: ~0.63
      { name: "Bloom-Dark", value: bloomDark }, // L: ~0.49
      { name: "Bloom-Deep", value: bloomDeep }, // L: ~0.37

      // GROUP 3: CORE (Throat/Base Contrast)
      { name: "Core-Base", value: coreBase }, // L: ~0.35
      { name: "Core-Deep", value: coreDeep }, // L: 0.18

      // GROUP 4: GREENS (Auxiliary Colors)
      { name: "Green-Main", value: greenMain }, // L: ~0.53
      { name: "Green-Stem", value: greenStem }, // L: ~0.42
    ];
  } else if (flowerType === "marigold") {
    const { l, c, h } = oklch;

    // ----------------------------------------------------
    // Enhanced Helper Functions
    // ----------------------------------------------------
    const clampL = (x) => Math.max(0, Math.min(1, x));

    // Context-aware chroma clamping for vivid, saturated orange
    const clampC = (x, context = "default") => {
      const limits = {
        highlight: 0.5, // Bright, luminous yellow-orange
        petal: 0.48, // Rich, saturated petals
        shadow: 0.52, // Deep, warm shadows
        core: 0.35, // Muted brown core
        default: 0.48,
      };
      return Math.max(0, Math.min(limits[context] || limits.default, x));
    };

    // Perceptual easing for smooth, warm transitions
    const smoothStep = (multiplier) => {
      if (multiplier > 1) {
        // Highlights: gentle ease (golden glow)
        const t = multiplier - 1;
        return 1 + Math.pow(t, 1.4);
      } else {
        // Shadows: moderate darkening (warm depth)
        return Math.pow(multiplier, 1.5);
      }
    };

    // Natural shadow hue shift for marigold (toward red-orange/brown)
    const getShadowHue = (baseH, depth = "mid") => {
      // Orange flowers shift toward warmer red-orange/brown in shadow
      const shifts = {
        light: -4, // Subtle red shift
        mid: -8, // Red-orange
        deep: -15, // Deep burnt orange/brown
      };
      return (baseH + shifts[depth] + 360) % 360;
    };

    // Highlight shift (toward bright yellow)
    const getHighlightHue = (baseH, intensity = "mid") => {
      const shifts = {
        soft: +8, // Yellow-orange
        mid: +12, // Golden yellow
        bright: +18, // Bright lemon-yellow
      };
      return (baseH + shifts[intensity]) % 360;
    };

    // ----------------------------------------------------
    // Petal Colors (7 Shades) - Golden Orange Gradient
    // ----------------------------------------------------

    // Bloom-Bright: Highest L, high C, shifted yellow for luminescence
    const bloomBright = {
      l: clampL(l * smoothStep(1.15)),
      c: clampC(c * 1.1, "highlight"),
      h: getHighlightHue(h, "bright"),
    };

    // Bloom-Light: Primary highlight tone
    const bloomLight = {
      l: clampL(l * smoothStep(1.08)),
      c: clampC(c * 1.0),
      h: getHighlightHue(h, "mid"),
    };

    // Bloom-Soft: Muted, luminous highlight
    const bloomSoft = {
      l: clampL(l * 1.0),
      c: clampC(c * 0.48, "highlight"),
      h: getHighlightHue(h, "soft"),
    };

    // Bloom: Base color (unchanged from input)
    const bloom = oklch;

    // Bloom-Mid: Primary transition tone, slightly darker than base
    const bloomMid = {
      l: clampL(l * smoothStep(0.87)),
      c: clampC(c * 1.1, "petal"),
      h: h,
    };

    // Bloom-Dark: Primary shadow color, red-orange shift
    const bloomDark = {
      l: clampL(l * smoothStep(0.72)),
      c: clampC(c * 1.28, "shadow"), // Increased for depth
      h: getShadowHue(h, "mid"),
    };

    // Bloom-Deep: Deepest shadow, rich red-orange
    const bloomDeep = {
      l: clampL(l * smoothStep(0.57)),
      c: clampC(c * 1.45, "shadow"), // Peak saturation
      h: getShadowHue(h, "deep"),
    };

    // ----------------------------------------------------
    // Core Colors (2 Shades) - Warm Brown Center
    // ----------------------------------------------------

    // Core-Main: Low L, moderately saturated, reddish-brown base
    const coreMain = {
      l: clampL(l * 0.48), // Slightly lighter for visibility
      c: clampC(c * 1.0, "core"),
      h: getShadowHue(h, "deep"),
    };

    // Core-Deep: Near-black point with warmth
    const coreDeep = {
      l: 0.18,
      c: 0.08, // Slight warm brown
      h: getShadowHue(h, "deep"),
    };

    // ----------------------------------------------------
    // Green Foliage (2 Colors) - Earthy, Warm Greens
    // ----------------------------------------------------

    // Earthy, warm greens to complement the deep orange
    const leafH = (h + 145) % 360; // Warm, slightly desaturated green
    const stemH = (h + 165) % 360; // Deeper, muted blue-green

    // Green-Main: Earthy, moderately saturated green for foliage
    const greenMain = {
      l: clampL(l * smoothStep(0.73)), // Slightly lighter
      c: clampC(c * 0.7), // More saturated
      h: leafH,
    };

    // Green-Stem: Darker, muted tone for the stalk
    const greenStem = {
      l: clampL(l * smoothStep(0.58)),
      c: clampC(c * 0.4), // More saturated
      h: stemH,
    };

    // ----------------------------------------------------
    // PERFECTLY 11 DISTINCT MARIGOLD COLORS
    // Vivid, warm, golden aesthetic
    // ----------------------------------------------------
    return [
      // GROUP 1: BLOOM HIGHLIGHTS (Purity and Light)
      { name: "Bloom-Bright", value: bloomBright }, // L: ~0.94, golden
      { name: "Bloom-Light", value: bloomLight }, // L: ~0.89
      { name: "Bloom-Soft", value: bloomSoft }, // L: ~0.82, muted

      // GROUP 2: PETAL TRANSITIONS (Base to Deep Shadow)
      { name: "Bloom", value: bloom }, // L: 0.82 (base)
      { name: "Bloom-Mid", value: bloomMid }, // L: ~0.71
      { name: "Bloom-Dark", value: bloomDark }, // L: ~0.59
      { name: "Bloom-Deep", value: bloomDeep }, // L: ~0.47

      // GROUP 3: CORE (Throat/Base Contrast)
      { name: "Core-Main", value: coreMain }, // L: ~0.39
      { name: "Core-Deep", value: coreDeep }, // L: 0.18

      // GROUP 4: GREENS (Auxiliary Colors)
      { name: "Green-Main", value: greenMain }, // L: ~0.60
      { name: "Green-Stem", value: greenStem }, // L: ~0.48
    ];
  } else if (flowerType === "morning-glory") {
    const { l, c, h } = oklch;

    // ----------------------------------------------------
    // Enhanced Helper Functions
    // ----------------------------------------------------
    const clampL = (x) => Math.max(0, Math.min(1, x));

    // Context-aware chroma clamping for striking, saturated blue
    const clampC = (x, context = "default") => {
      const limits = {
        highlight: 0.35, // Soft cyan highlights
        petal: 0.48, // Rich, saturated petals (increased from 0.45)
        shadow: 0.52, // Deep, vivid shadows
        throat: 0.45, // Saturated throat
        accent: 0.08, // Very low for white center
        default: 0.48,
      };
      return Math.max(0, Math.min(limits[context] || limits.default, x));
    };

    // Perceptual easing for smooth, dramatic transitions
    const smoothStep = (multiplier) => {
      if (multiplier > 1) {
        // Highlights: gentle ease (soft shimmer)
        const t = multiplier - 1;
        return 1 + Math.pow(t, 1.4);
      } else {
        // Shadows: sharper darkening (dramatic velvety depth)
        return Math.pow(multiplier, 1.6);
      }
    };

    // Natural shadow hue shift for morning glory (toward deep indigo/violet)
    const getShadowHue = (baseH, depth = "mid") => {
      // Sky blue flowers shift toward deeper violet/indigo in shadow
      const shifts = {
        light: +20, // Toward violet
        mid: +28, // Deeper violet
        deep: +35, // Deep indigo/purple
      };
      return (baseH + shifts[depth]) % 360;
    };

    // Highlight shift (toward lighter cyan/pure blue)
    const getHighlightHue = (baseH, intensity = "mid") => {
      const shifts = {
        soft: -18, // Cyan-blue
        mid: -22, // Bright cyan
        bright: -28, // Light sky blue
      };
      return (baseH + shifts[intensity] + 360) % 360;
    };

    // Brilliant white center (iconic morning glory feature)
    const getBrilliantWhite = (baseH) => ({
      l: 0.98,
      c: 0.05,
      h: getHighlightHue(baseH, "bright"),
    });

    // ----------------------------------------------------
    // Petal Colors (7 Shades) - Dramatic Blue Gradient
    // ----------------------------------------------------

    // Core-Accent: Brilliant white/near-white for the throat center (star)
    const coreAccent = getBrilliantWhite(h);

    // Bloom-Highlight: Very near white, low chroma for purity
    const bloomHighlight = {
      l: 0.95,
      c: 0.06,
      h: h,
    };

    // Bloom-Soft: Muted, luminous edge highlight
    const bloomSoft = {
      l: clampL(l * smoothStep(1.28)), // More dramatic
      c: clampC(c * 0.58, "highlight"),
      h: getHighlightHue(h, "bright"),
    };

    // Bloom-Light: High L, high C, shifted cyan for luminosity
    const bloomLight = {
      l: clampL(l * smoothStep(1.18)),
      c: clampC(c * 1.25, "petal"),
      h: getHighlightHue(h, "mid"),
    };

    // Bloom: Base color - adjusted slightly for better separation
    const bloom = {
      l: clampL(l * 1.05),
      c: clampC(c * 1.05),
      h,
    };

    // Bloom-Mid: Primary transition tone, significantly darker
    const bloomMid = {
      l: clampL(l * smoothStep(0.78)),
      c: clampC(c * 1.15, "petal"),
      h: h,
    };

    // Bloom-Dark: Primary shadow color, indigo shift
    const bloomDark = {
      l: clampL(l * smoothStep(0.68)),
      c: clampC(c * 1.35, "shadow"),
      h: getShadowHue(h, "mid"),
    };

    // Bloom-Deep: Deepest shadow, intense indigo/violet (velvety)
    const bloomDeep = {
      l: clampL(l * smoothStep(0.52)),
      c: clampC(c * 1.85, "shadow"), // Peak saturation
      h: getShadowHue(h, "deep"),
    };

    // ----------------------------------------------------
    // Throat/Core Colors (1 Shade) - Deep Purple Throat
    // ----------------------------------------------------

    // Core-Main: Deepest, most saturated purple for the throat
    const coreMain = {
      l: clampL(l * 0.38),
      c: clampC(c * 1.6, "throat"),
      h: getShadowHue(h, "deep"),
    };

    // ----------------------------------------------------
    // Green Foliage (2 Colors) - Fresh, Bright Greens
    // ----------------------------------------------------

    // Fresh, slightly warm greens to contrast the cool blue
    const leafH = (h - 95 + 360) % 360; // H: 215 - 95 = 120 (Fresh Green)
    const stemH = (h - 115 + 360) % 360; // H: 215 - 115 = 100 (Slightly warmer/muted)

    // Green-Main: Fresh, bright green for foliage
    const greenMain = {
      l: clampL(l * smoothStep(0.82)), // Lighter
      c: clampC(c * 0.7), // More saturated
      h: leafH,
    };

    // Green-Stem: Darker, muted tone for the vine/stalk
    const greenStem = {
      l: clampL(l * smoothStep(0.58)),
      c: clampC(c * 0.4), // More saturated
      h: stemH,
    };

    // ----------------------------------------------------
    // PERFECTLY 11 DISTINCT MORNING GLORY COLORS
    // Dramatic, velvety, iconic white-star center
    // ----------------------------------------------------
    return [
      // GROUP 1: BLOOM HIGHLIGHTS (Purity and Light)
      { name: "Core-Accent", value: coreAccent }, // L: 0.98, white star
      { name: "Bloom-Highlight", value: bloomHighlight }, // L: 0.95, purity
      { name: "Bloom-Soft", value: bloomSoft }, // L: ~0.87, muted edge
      { name: "Bloom-Light", value: bloomLight }, // L: ~0.80, cyan

      // GROUP 2: PETAL TRANSITIONS (Base to Deep Shadow)
      { name: "Bloom", value: bloom }, // L: ~0.71, base
      { name: "Bloom-Mid", value: bloomMid }, // L: ~0.53
      { name: "Bloom-Dark", value: bloomDark }, // L: ~0.46
      { name: "Bloom-Deep", value: bloomDeep }, // L: ~0.35, velvety

      // GROUP 3: CORE (Throat Contrast)
      { name: "Core-Main", value: coreMain }, // L: ~0.26, deep purple

      // GROUP 4: GREENS (Auxiliary Colors)
      { name: "Green-Main", value: greenMain }, // L: ~0.56
      { name: "Green-Stem", value: greenStem }, // L: ~0.39
    ];
  } else if (flowerType === "tangerine-gerbera") {
    const { l, c, h } = oklch;

    // ----------------------------------------------------
    // Enhanced Helper Functions
    // ----------------------------------------------------
    const clampL = (x) => Math.max(0, Math.min(1, x));

    // Context-aware chroma clamping for vivid, saturated orange
    const clampC = (x, context = "default") => {
      const limits = {
        highlight: 0.5, // Bright, vivid yellow-orange
        petal: 0.52, // Rich, saturated petals (increased from 0.45)
        shadow: 0.55, // Deep, intense shadows
        core: 0.35, // Muted yellow-green core
        vein: 0.08, // Very low for white veins
        default: 0.5,
      };
      return Math.max(0, Math.min(limits[context] || limits.default, x));
    };

    // Perceptual easing for smooth, vibrant transitions
    const smoothStep = (multiplier) => {
      if (multiplier > 1) {
        // Highlights: gentle ease (bright, cheerful glow)
        const t = multiplier - 1;
        return 1 + Math.pow(t, 1.3);
      } else {
        // Shadows: moderate darkening (rich depth)
        return Math.pow(multiplier, 1.5);
      }
    };

    // Natural shadow hue shift for gerbera (toward red-orange/magenta)
    const getShadowHue = (baseH, depth = "mid") => {
      // Tangerine/orange flowers shift toward warmer red/magenta in shadow
      const shifts = {
        light: -12, // Red-orange
        mid: -18, // Deeper red
        deep: -25, // Red-magenta
      };
      return (baseH + shifts[depth] + 360) % 360;
    };

    // Highlight shift (toward bright yellow)
    const getHighlightHue = (baseH, intensity = "mid") => {
      const shifts = {
        soft: +15, // Yellow-orange
        mid: +22, // Golden yellow
        bright: +28, // Bright yellow
      };
      return (baseH + shifts[intensity]) % 360;
    };

    // Bright white vein accent (crisp contrast)
    const getVeinAccent = (baseH) => ({
      l: 0.96,
      c: 0.06,
      h: getHighlightHue(baseH, "bright"),
    });

    // ----------------------------------------------------
    // Petal Colors (6 Shades) - Vivid Orange Gradient
    // ----------------------------------------------------

    // Bloom-Vein: Near-white accent for delicate vein lines
    const bloomVein = getVeinAccent(h);

    // Bloom-Bright: Highest L, high C, shifted yellow for brilliance
    const bloomBright = {
      l: clampL(l * smoothStep(1.22)),
      c: clampC(c * 1.15, "highlight"),
      h: getHighlightHue(h, "bright"),
    };

    // Bloom-Light: Primary highlight tone
    const bloomLight = {
      l: clampL(l * smoothStep(1.12)),
      c: clampC(c * 1.08),
      h: getHighlightHue(h, "mid"),
    };

    // Bloom: Base color (unchanged from input)
    const bloom = { l: l, c: c, h: h };

    // Bloom-Mid: ADJUSTED L multiplier for clear step down
    const bloomMid = {
      l: clampL(l * smoothStep(0.7)), // Adjusted from 0.67 for better flow
      c: clampC(c * 1.1, "petal"),
      h: h,
    };

    // Bloom-Dark: Primary shadow, red-orange shift
    const bloomDark = {
      l: clampL(l * smoothStep(0.57)),
      c: clampC(c * 1.28, "shadow"),
      h: getShadowHue(h, "mid"),
    };

    // ----------------------------------------------------
    // Core & Stamen Colors (4 Shades) - Yellow-Green Center
    // ----------------------------------------------------

    // Core-Stamen: Bright, warm yellow stamen tips
    const coreStamen = {
      l: 0.9,
      c: 0.25,
      h: getHighlightHue(h, "mid"),
    };

    // Core-Base: Muted yellow-green disc center
    const coreBase = {
      l: clampL(l * 0.82),
      c: clampC(c * 0.45, "core"),
      h: 95, // Yellow-green
    };

    // Core-Deep: Dark base of disc
    const coreDeep = {
      l: 0.28,
      c: 0.08, // Slight warmth
      h: 80, // Warmer brown-yellow
    };

    // ----------------------------------------------------
    // Green Foliage (2 Colors) - Fresh Greens
    // ----------------------------------------------------

    const leafH = (h + 155) % 360; // H: 205 (Fresh Green)
    const stemH = (h + 135) % 360; // H: 185 (Blue-green)

    // Green-Main: Primary vibrant foliage
    const greenMain = {
      l: clampL(l * smoothStep(0.73)),
      c: clampC(c * 0.6),
      h: stemH,
    };

    // Green-Stem: Darker stem/shadow
    const greenStem = {
      l: clampL(l * smoothStep(0.55)),
      c: clampC(c * 0.4),
      h: leafH,
    };

    // ----------------------------------------------------
    // PERFECTLY 11 DISTINCT TANGERINE GERBERA COLORS
    // Vivid, cheerful, daisy-like aesthetic
    // ----------------------------------------------------
    return [
      // GROUP 1: PETAL HIGHLIGHTS & BASE
      { name: "Bloom-Vein", value: bloomVein }, // L: 0.96, white veins
      { name: "Core-Stamen", value: coreStamen }, // L: 0.90, yellow
      { name: "Bloom-Bright", value: bloomBright }, // L: ~0.92, brilliant
      { name: "Bloom-Light", value: bloomLight }, // L: ~0.84
      { name: "Bloom", value: bloom }, // L: 0.75 (base)

      // GROUP 2: SHADOWS & CORE CONTRAST
      { name: "Bloom-Mid", value: bloomMid }, // L: ~0.53, clear step
      { name: "Bloom-Dark", value: bloomDark }, // L: ~0.43
      { name: "Core-Base", value: coreBase }, // L: ~0.62

      // GROUP 3: AUXILIARY
      { name: "Green-Main", value: greenMain }, // L: ~0.55
      { name: "Green-Stem", value: greenStem }, // L: ~0.41
      { name: "Core-Deep", value: coreDeep }, // L: 0.28
    ];
  } else if (flowerType === "cymbidium-orchid") {
    const { l, c, h } = oklch;

    // ----------------------------------------------------
    // Enhanced Helper Functions
    // ----------------------------------------------------
    const clampL = (x) => Math.max(0, Math.min(1, x));

    // Context-aware chroma clamping for vivid lime-green orchid
    const clampC = (x, context = "default") => {
      const limits = {
        highlight: 0.45, // Bright lime highlights
        bloom: 0.48, // Rich, saturated bloom (increased from 0.4)
        shadow: 0.5, // Deep, saturated shadows
        lip: 0.42, // Vivid magenta lip accent
        white: 0.08, // Very low for white throat
        foliage: 0.35, // Deep green foliage
        default: 0.45,
      };
      return Math.max(0, Math.min(limits[context] || limits.default, x));
    };

    // Perceptual easing for smooth, exotic transitions
    const smoothStep = (multiplier) => {
      if (multiplier > 1) {
        // Highlights: gentle ease (glossy, waxy glow)
        const t = multiplier - 1;
        return 1 + Math.pow(t, 1.3);
      } else {
        // Shadows: moderate darkening (rich depth)
        return Math.pow(multiplier, 1.5);
      }
    };

    // Natural shadow hue shift for lime orchid (toward deeper green/blue-green)
    const getShadowHue = (baseH, depth = "mid") => {
      // Lime/yellow-green flowers shift toward cooler blue-green in shadow
      const shifts = {
        light: +20, // Toward cooler green
        mid: +28, // Blue-green
        deep: +35, // Deep teal/cyan
      };
      return (baseH + shifts[depth]) % 360;
    };

    // Highlight shift (toward brighter yellow-green/lime)
    const getHighlightHue = (baseH, intensity = "mid") => {
      const shifts = {
        soft: -8, // Yellow-lime
        mid: -12, // Bright lime
        bright: -15, // Yellow
      };
      return (baseH + shifts[intensity] + 360) % 360;
    };

    // Brilliant white throat (iconic orchid feature)
    const getBrilliantWhite = (baseH) => ({
      l: 0.98,
      c: 0.05,
      h: baseH,
    });

    // ----------------------------------------------------
    // Bloom Colors (5 Shades) - Luminous Lime Gradient
    // ----------------------------------------------------

    // Lip-Main: Brilliant white/near-white for the throat/lip base
    const lipMain = getBrilliantWhite(h);

    // Bloom-Bright: Highest L, shifted yellow for brilliant luster
    const bloomBright = {
      l: clampL(l * smoothStep(1.15)),
      c: clampC(c * 1.15, "highlight"),
      h: getHighlightHue(h, "bright"),
    };

    // Bloom-Light: Primary highlight tone
    const bloomLight = {
      l: clampL(l * smoothStep(1.08)),
      c: clampC(c * 1.08),
      h: getHighlightHue(h, "mid"),
    };

    // Bloom: Base color (unchanged from input)
    const bloom = { l: l, c: c, h: h };

    // Bloom-Mid: Clear step down from base
    const bloomMid = {
      l: clampL(l * smoothStep(0.88)),
      c: clampC(c * 1.05, "bloom"),
      h: h,
    };

    // Bloom-Shadow: Primary shadow color, cool blue-green shift
    const bloomShadow = {
      l: clampL(l * smoothStep(0.72)),
      c: clampC(c * 1.2, "shadow"),
      h: getShadowHue(h, "mid"),
    };

    // ----------------------------------------------------
    // Lip/Accent Colors (1 Shade) - Deep Magenta Contrast
    // ----------------------------------------------------

    // Lip-Accent: Deep magenta/red spot for high contrast on the lip
    const lipAccent = {
      l: 0.48,
      c: 0.4, // High saturation for vivid contrast
      h: 340, // Deep Magenta/Red hue
    };

    // ----------------------------------------------------
    // Green Foliage (4 Shades) - Deep, Saturated Greens
    // ----------------------------------------------------

    // Since the BLOOM is green, foliage must be dramatically darker/cooler
    const leafH = (h + 105) % 360; // H: 210 (Deep, cool blue-green)
    const stemH = (h + 125) % 360; // H: 230 (Deep, muted blue/teal)

    // Green-Main: Very dark, saturated blue-green for leaves
    const greenMain = {
      l: clampL(l * smoothStep(0.6)),
      c: clampC(c * 1.8, "foliage"), // Pushing chroma for rich contrast
      h: leafH,
    };

    // Green-Stem: Darkest, most muted blue for pseudobulb/shadows
    const greenStem = {
      l: clampL(l * smoothStep(0.42)),
      c: clampC(c * 1.2, "foliage"),
      h: stemH,
    };

    // Core-Deep: Re-using lip accent for core dark spot
    const coreDeep = lipAccent;

    // ----------------------------------------------------
    // PERFECTLY 11 DISTINCT CYMBIDIUM ORCHID COLORS
    // Exotic, lime-green, high-contrast aesthetic
    // ----------------------------------------------------
    return [
      // GROUP 1: BLOOM HIGHLIGHTS & ACCENTS
      { name: "Lip-Main", value: lipMain }, // L: 0.98, white throat
      { name: "Bloom-Bright", value: bloomBright }, // L: ~0.92, yellow-lime
      { name: "Lip-Accent", value: lipAccent }, // L: 0.48, magenta spot
      { name: "Bloom-Light", value: bloomLight }, // L: ~0.86

      // GROUP 2: BLOOM BASE & SHADOWS
      { name: "Bloom", value: bloom }, // L: 0.80 (base)
      { name: "Bloom-Mid", value: bloomMid }, // L: ~0.70
      { name: "Bloom-Shadow", value: bloomShadow }, // L: ~0.58

      // GROUP 3: DEEP FOLIAGE (High Contrast)
      { name: "Green-Main", value: greenMain }, // L: ~0.48, saturated
      { name: "Green-Stem", value: greenStem }, // L: ~0.34, deepest

      // GROUP 4: CORE
      { name: "Core-Deep", value: coreDeep }, // L: 0.48, magenta
    ];
  } else if (flowerType === "chocolateCosmos") {
    const { l, c, h } = oklch;

    // ----------------------------------------------------
    // Enhanced Helper Functions
    // ----------------------------------------------------
    const clampL = (x) => Math.max(0.1, Math.min(0.8, x)); // Restricted L for dark palette
    const clampC = (x) => Math.max(0.05, Math.min(0.35, x)); // Restricted C for muted aesthetic

    // Perceptual easing for smooth, velvety transitions
    const smoothStep = (multiplier) => {
      if (multiplier > 1) {
        // Highlights: gentle ease (soft, dusty glow)
        const t = multiplier - 1;
        return 1 + Math.pow(t, 1.5);
      } else {
        // Shadows: moderate darkening (rich velvet)
        return Math.pow(multiplier, 1.4);
      }
    };

    // Natural shadow hue shift for oxblood/burgundy (toward cooler burgundy/plum)
    const getShadowHue = (baseH, depth = "mid") => {
      // Deep red flowers shift slightly toward cooler burgundy in shadow
      const shifts = {
        light: -8, // Subtle burgundy
        mid: -12, // Deeper burgundy
        deep: -18, // Cool burgundy/plum
      };
      return (baseH + shifts[depth] + 360) % 360;
    };

    // Highlight shift (toward warmer, wine-red)
    const getHighlightHue = (baseH, intensity = "mid") => {
      const shifts = {
        soft: +8, // Warmer red
        mid: +12, // Wine-red
        bright: +15, // Bright wine (H: ~30, approaching red-orange)
      };
      return (baseH + shifts[intensity]) % 360;
    };

    // Chocolate brown hue (essential neutral)
    const chocolateH = (h + 28) % 360; // H: ~43 (Warm Brown)

    // Muted olive hue (for foliage)
    const oliveH = 120; // Fixed muted olive

    // ----------------------------------------------------
    // Petal Colors (6 Shades) - Oxblood/Maroon Velvet
    // ----------------------------------------------------

    // Bloom-Highlight: The lightest point (wine-red glow)
    const bloomHighlight = {
      l: clampL(l * smoothStep(1.55)), // Increased from 1.4
      c: clampC(c * 0.7), // Lowered C for dusty, muted look
      h: getHighlightHue(h, "bright"), // H: ~30 (Wine-red, approaching red-orange)
    };

    // Bloom-Light: Primary light tone
    const bloomLight = {
      l: clampL(l * smoothStep(1.25)),
      c: clampC(c * 0.85),
      h: getHighlightHue(h, "mid"),
    };

    // Bloom: Base color (unchanged from input)
    const bloom = { l: l, c: c, h: h };

    // Bloom-Mid: Transition tone with slight saturation boost
    const bloomMid = {
      l: clampL(l * smoothStep(0.85)),
      c: clampC(c * 1.1),
      h: h,
    };

    // Bloom-Deep: Primary shadow color (velvet texture)
    const bloomDeep = {
      l: clampL(l * smoothStep(0.68)),
      c: clampC(c * 1.25), // Increased for velvet richness
      h: getShadowHue(h, "mid"),
    };

    // Bloom-Muted: Near-black tone
    const bloomMuted = {
      l: clampL(l * smoothStep(0.48)),
      c: clampC(c * 0.35), // Low C for muted, dark look
      h: getShadowHue(h, "deep"),
    };

    // ----------------------------------------------------
    // Core/Center Colors (2 Shades) - Chocolate Brown
    // ----------------------------------------------------

    // Core-Brown: The essential low-chroma "Chocolate" neutral brown
    const coreBrown = {
      l: clampL(l * 1.25), // Lighter for visibility
      c: clampC(c * 0.25), // Very low C (e.g. 0.18 * 0.25 = 0.045)
      h: chocolateH,
    };

    // Core-Stamen: Darkest point in the core
    const coreStamen = {
      l: clampL(l * 0.65),
      c: clampC(c * 0.45),
      h: getShadowHue(h, "mid"),
    };

    // ----------------------------------------------------
    // Green & Auxiliary Colors (2 Shades) - Muted Olive
    // ----------------------------------------------------

    // Green-Main: Muted olive leaf green
    const greenMain = {
      l: clampL(l * 1.8), // Much lighter
      c: clampC(c * 0.4), // More saturated
      h: oliveH,
    };

    // Green-Shadow: Dark stem shadow
    const greenShadow = {
      l: clampL(l * 1.3),
      c: clampC(c * 0.28), // More saturated
      h: oliveH + 10, // Slightly deeper olive
    };

    // ----------------------------------------------------
    // PERFECTLY 10 DISTINCT CHOCOLATE COSMOS COLORS
    // Dark, velvety, sophisticated aesthetic
    // ----------------------------------------------------
    return [
      // GROUP 1: BLOOM HIGHLIGHTS & BASE (Oxblood/Maroon)
      { name: "Bloom-Highlight", value: bloomHighlight }, // L: ~0.47, wine-red
      { name: "Bloom-Light", value: bloomLight }, // L: ~0.38
      { name: "Bloom", value: bloom }, // L: 0.30 (base)
      { name: "Bloom-Mid", value: bloomMid }, // L: ~0.26
      { name: "Bloom-Deep", value: bloomDeep }, // L: ~0.20

      // GROUP 2: SHADOWS & CORE
      { name: "Bloom-Muted", value: bloomMuted }, // L: ~0.14, near-black
      { name: "Core-Brown", value: coreBrown }, // L: ~0.38, chocolate
      { name: "Core-Stamen", value: coreStamen }, // L: ~0.20

      // GROUP 3: LEAVES & AUXILIARY (Muted Olive Greens)
      { name: "Green-Main", value: greenMain }, // L: ~0.54
      { name: "Green-Shadow", value: greenShadow }, // L: ~0.39
    ];
  } else if (flowerType === "birdOfParadise") {
    const { l, c, h } = oklch;

    // ----------------------------------------------------
    // Enhanced Helper Functions
    // ----------------------------------------------------
    const clampL = (x) => Math.max(0.1, Math.min(0.95, x));
    const clampC = (x) => Math.max(0.05, Math.min(0.55, x)); // Increased for vivid colors

    // Perceptual easing for smooth, dramatic transitions
    const smoothStep = (multiplier) => {
      if (multiplier > 1) {
        // Highlights: gentle ease (bright, tropical glow)
        const t = multiplier - 1;
        return 1 + Math.pow(t, 1.3);
      } else {
        // Shadows: moderate darkening (rich depth)
        return Math.pow(multiplier, 1.5);
      }
    };

    // Natural shadow hue shift for orange (toward red/brown)
    const getShadowHue = (baseH, depth = "mid") => {
      // Orange flowers shift toward warmer red/brown in shadow
      const shifts = {
        light: -12, // Red-orange
        mid: -18, // Deeper red
        deep: -25, // Red-brown
      };
      return (baseH + shifts[depth] + 360) % 360;
    };

    // Highlight shift (toward bright yellow-orange)
    const getHighlightHue = (baseH, intensity = "mid") => {
      const shifts = {
        soft: +12, // Yellow-orange
        mid: +18, // Golden yellow
        bright: +25, // Bright yellow
      };
      return (baseH + shifts[intensity]) % 360;
    };

    // Blue/purple contrast hue (for the exotic "bird" element)
    const contrastH = 260; // Bluebell Blue/Violet

    // ----------------------------------------------------
    // Orange Sepal Colors (5 Shades) - Vivid Orange Flame
    // ----------------------------------------------------

    // Bloom-Highlight: Brightest, shifted yellow for luminescence
    const bloomHighlight = {
      l: clampL(l * smoothStep(1.18)),
      c: clampC(c * 1.1),
      h: getHighlightHue(h, "bright"),
    };

    // Bloom-Light: Primary luminous tone
    const bloomLight = {
      l: clampL(l * smoothStep(1.1)),
      c: clampC(c * 1.05),
      h: getHighlightHue(h, "mid"),
    };

    // Bloom: Base color (unchanged from input)
    const bloom = { l: l, c: c, h: h };

    // Bloom-Mid: Transition tone with slight saturation boost
    const bloomMid = {
      l: clampL(l * smoothStep(0.85)),
      c: clampC(c * 1.1),
      h: h,
    };

    // Bloom-Shadow: ADJUSTED L multiplier for clear contrast
    const bloomShadow = {
      l: clampL(l * smoothStep(0.68)), // Adjusted from 0.65
      c: clampC(c * 1.2),
      h: getShadowHue(h, "mid"),
    };

    // ----------------------------------------------------
    // Blue/Purple Contrast & Spathe (3 Shades) - Exotic Accent
    // ----------------------------------------------------

    // Contrast-Main: Rich, saturated blue/violet for the "bird" petals
    const contrastMain = {
      l: clampL(l * 0.75),
      c: clampC(c * 1.0), // Increased from 0.9
      h: contrastH,
    };

    // Contrast-Deep: Deepest blue/purple shadow
    const contrastDeep = {
      l: 0.25,
      c: 0.2, // Increased from 0.15
      h: contrastH,
    };

    // Spathe-Base: Yellow-green protective bract
    const spatheBase = {
      l: clampL(l * 1.25),
      c: clampC(c * 0.45),
      h: 85, // Yellow-Green (adjusted from 80)
    };

    // ----------------------------------------------------
    // Green Foliage (2 Shades) - Tropical Greens
    // ----------------------------------------------------

    const leafH = 150; // Standard Leafy Green
    const stemH = 180; // Dark Cyan-Green

    // Green-Main: Primary vibrant tropical foliage
    const greenMain = {
      l: clampL(l * smoothStep(0.85)), // Lighter
      c: clampC(c * 0.5), // More saturated
      h: leafH,
    };

    // Green-Stem: Darker stem/shadow
    const greenStem = {
      l: clampL(l * smoothStep(0.58)),
      c: clampC(c * 0.35), // More saturated
      h: stemH,
    };

    // Core-Accent: Near-white highlight accent
    const coreAccent = {
      l: 0.96,
      c: 0.08,
      h: 90, // Yellow-Neutral
    };

    // ----------------------------------------------------
    // PERFECTLY 10 DISTINCT BIRD OF PARADISE COLORS
    // Exotic, tropical, high-contrast aesthetic
    // ----------------------------------------------------
    return [
      // GROUP 1: ORANGE BLOOM (Fire-like gradient)
      { name: "Bloom-Highlight", value: bloomHighlight }, // L: ~0.83, yellow
      { name: "Bloom-Light", value: bloomLight }, // L: ~0.77
      { name: "Bloom", value: bloom }, // L: 0.70 (base)
      { name: "Bloom-Mid", value: bloomMid }, // L: ~0.60
      { name: "Bloom-Shadow", value: bloomShadow }, // L: ~0.48

      // GROUP 2: SPATHE & CONTRAST (BLUE/PURPLE)
      { name: "Contrast-Main", value: contrastMain }, // L: ~0.53, blue
      { name: "Contrast-Deep", value: contrastDeep }, // L: 0.25, deep
      { name: "Spathe-Base", value: spatheBase }, // L: ~0.88, yellow-green

      // GROUP 3: GREENS & ACCENTS
      { name: "Green-Main", value: greenMain }, // L: ~0.60
      { name: "Green-Stem", value: greenStem }, // L: ~0.41
      { name: "Core-Accent", value: coreAccent }, // L: 0.96, white
    ];
  } else if (flowerType === "passionFlower") {
    const { l, c, h } = oklch;

    // ----------------------------------------------------
    // Enhanced Helper Functions
    // ----------------------------------------------------
    const clampL = (x) => Math.max(0.1, Math.min(0.98, x));
    const clampC = (x) => Math.max(0.02, Math.min(0.42, x)); // Increased from 0.35

    // Perceptual easing for smooth, dramatic transitions
    const smoothStep = (multiplier) => {
      if (multiplier > 1) {
        // Highlights: gentle ease (soft, luminous glow)
        const t = multiplier - 1;
        return 1 + Math.pow(t, 1.6); // Gentler for ethereal look
      } else {
        // Shadows: gentle darkening (soft, not harsh)
        return Math.pow(multiplier, 1.3);
      }
    };

    // Highlight shift (toward slightly warmer pink/magenta for soft glow)
    const getHighlightHue = (baseH, intensity = "mid") => {
      const shifts = {
        soft: +15, // Warm lavender-pink
        mid: +20, // Pink-magenta
        bright: +25, // Warm magenta
      };
      return (baseH + shifts[intensity]) % 360;
    };

    // Filament contrast colors (the exotic corona)
    const filamentH = 250; // Deep Blue-Violet (cooler than base)
    const filamentAccentH = 320; // Vivid Magenta (warm contrast)

    // Core colors
    const antherH = 90; // Bright Yellow (pollen)
    const stigmaH = 150; // Green (center structure)

    // ----------------------------------------------------
    // Petal Colors (5 Shades) - Pale Lavender/White
    // ----------------------------------------------------

    // Bloom-Purity: Near-white for the purest parts
    const bloomPurity = {
      l: 0.96,
      c: 0.03,
      h: h,
    };

    // Bloom-Light: Primary luminous tone, slightly warmer
    const bloomLight = {
      l: clampL(l * smoothStep(1.03)),
      c: clampC(c * 1.15),
      h: getHighlightHue(h, "mid"),
    };

    // Bloom: Base color (unchanged from input)
    const bloom = { l: l, c: c, h: h };

    // Bloom-Mid: Transition tone with slight saturation
    const bloomMid = {
      l: clampL(l * smoothStep(0.95)),
      c: clampC(c * 1.1),
      h: h,
    };

    // Bloom-Shadow: Subtle shade on the white petals
    const bloomShadow = {
      l: clampL(l * smoothStep(0.88)),
      c: clampC(c * 1.25), // Increased for visibility
      h: h,
    };

    // ----------------------------------------------------
    // Corona/Filament Colors (3 Shades) - The Exotic Crown
    // ----------------------------------------------------

    // Filament-Main: Deepest, most saturated violet (outer ring)
    const filamentMain = {
      l: 0.45, // Slightly lighter for visibility
      c: 0.35, // Increased from 0.30
      h: filamentH,
    };

    // Filament-Accent: The vivid magenta band (middle ring)
    const filamentAccent = {
      l: 0.68, // Slightly lighter
      c: 0.4, // Increased from 0.35
      h: filamentAccentH,
    };

    // Filament-Tip: Lighter tips of filaments (inner ring)
    const filamentTip = {
      l: 0.82,
      c: 0.25,
      h: filamentH,
    };

    // ----------------------------------------------------
    // Core/Center Colors (2 Shades) - Anther & Stigma
    // ----------------------------------------------------

    // Core-Anther: Bright yellow/gold for the pollen-bearing anthers
    const coreAnther = {
      l: 0.88,
      c: 0.28, // Increased from 0.20
      h: antherH,
    };

    // Core-Stigma: Deep green spot/tip for the stigma
    const coreStigma = {
      l: 0.6, // Lighter for visibility
      c: 0.2, // Increased from 0.15
      h: stigmaH,
    };

    // ----------------------------------------------------
    // Green Foliage (2 Shades) - Cool Blue-Green
    // ----------------------------------------------------

    const leafH = 160; // Blue-Green for coolness

    // Green-Main: Primary foliage green
    const greenMain = {
      l: clampL(l * smoothStep(0.68)),
      c: clampC(c * 1.4), // Increased
      h: leafH,
    };

    // Green-Vine: Darker shade for the woody vine/shadow
    const greenVine = {
      l: clampL(l * smoothStep(0.5)),
      c: clampC(c * 0.8), // Increased
      h: leafH,
    };

    // ----------------------------------------------------
    // PERFECTLY 11 DISTINCT PASSION FLOWER COLORS
    // Exotic, complex, intricate aesthetic
    // ----------------------------------------------------
    return [
      // GROUP 1: PETALS & LUMINESCENCE (Pale lavender/white)
      { name: "Bloom-Purity", value: bloomPurity }, // L: 0.96, near-white
      { name: "Core-Anther", value: coreAnther }, // L: 0.88, yellow
      { name: "Bloom-Light", value: bloomLight }, // L: ~0.93
      { name: "Bloom", value: bloom }, // L: 0.90 (base)
      { name: "Bloom-Mid", value: bloomMid }, // L: ~0.86

      // GROUP 2: SHADOWS
      { name: "Bloom-Shadow", value: bloomShadow }, // L: ~0.79

      // GROUP 3: FILAMENTS & CORE (The exotic crown)
      { name: "Filament-Tip", value: filamentTip }, // L: 0.82, light violet
      { name: "Filament-Accent", value: filamentAccent }, // L: 0.68, magenta
      { name: "Filament-Main", value: filamentMain }, // L: 0.45, deep violet
      { name: "Core-Stigma", value: coreStigma }, // L: 0.60, green

      // GROUP 4: GREENS
      { name: "Green-Main", value: greenMain }, // L: ~0.61
      { name: "Green-Vine", value: greenVine }, // L: ~0.45
    ];
  } else if (flowerType === "kingProtea") {
    const { l, c, h } = oklch;

    // ----------------------------------------------------
    // Enhanced Helper Functions
    // ----------------------------------------------------
    const clampL = (x) => Math.max(0.15, Math.min(0.95, x));
    const clampC = (x) => Math.max(0.05, Math.min(0.38, x)); // Increased from 0.30

    // Perceptual easing for smooth, velvety transitions
    const smoothStep = (multiplier) => {
      if (multiplier > 1) {
        // Highlights: gentle ease (soft, dusty glow)
        const t = multiplier - 1;
        return 1 + Math.pow(t, 1.6); // Very gentle for dusty look
      } else {
        // Shadows: moderate darkening (velvet depth)
        return Math.pow(multiplier, 1.5);
      }
    };

    // Natural shadow hue shift for rose/crimson (toward deeper burgundy)
    const getShadowHue = (baseH, depth = "mid") => {
      // Rose/crimson flowers shift toward cooler burgundy/plum in shadow
      const shifts = {
        light: -8, // Subtle burgundy
        mid: -12, // Deeper burgundy
        deep: -18, // Cool burgundy/plum
      };
      return (baseH + shifts[depth] + 360) % 360;
    };

    // Highlight shift (toward warmer peach/light red)
    const getHighlightHue = (baseH, intensity = "mid") => {
      const shifts = {
        soft: +15, // Peach-pink
        mid: +20, // Light coral-red
        bright: +25, // Warm peachy-coral
      };
      return (baseH + shifts[intensity]) % 360;
    };

    // ----------------------------------------------------
    // Bract & Petal Colors (6 Shades) - Dusty Rose/Crimson
    // ----------------------------------------------------

    // Bloom-Highlight: Soft, pale blush tip (dusty aesthetic)
    const bloomHighlight = {
      l: clampL(l * smoothStep(1.28)), // Increased from 1.25
      c: clampC(c * 0.65), // Lowered for dusty look
      h: getHighlightHue(h, "bright"),
    };

    // Bloom-Light: Primary light tone
    const bloomLight = {
      l: clampL(l * smoothStep(1.18)),
      c: clampC(c * 0.85),
      h: getHighlightHue(h, "mid"),
    };

    // Bloom: Base color (unchanged from input)
    const bloom = { l: l, c: c, h: h };

    // Bloom-Mid: A clear step down from the base
    const bloomMid = {
      l: clampL(l * smoothStep(0.88)),
      c: clampC(c * 1.08),
      h: h,
    };

    // Bloom-Deep: Primary shadow and deep crimson base
    const bloomDeep = {
      l: clampL(l * smoothStep(0.65)),
      c: clampC(c * 1.35), // Increased for richness
      h: getShadowHue(h, "mid"),
    };

    // Bloom-Velvet: Darkest shadow/vein accent (velvety)
    const bloomVelvet = {
      l: clampL(l * smoothStep(0.45)),
      c: clampC(c * 1.0), // Increased from 0.8
      h: getShadowHue(h, "deep"),
    };

    // ----------------------------------------------------
    // Core/Fuzz & Contrast (4 Shades) - White Fuzz Center
    // ----------------------------------------------------

    // Core-Fuzz: The soft, dense white/cream fuzz at the center
    const coreFuzz = {
      l: 0.96, // Slightly lighter
      c: 0.06, // Slight increase
      h: getHighlightHue(h, "soft"),
    };

    // Core-Ring: Transitional ring around the fuzz (muted rose)
    const coreRing = {
      l: clampL(l * 0.95),
      c: clampC(c * 0.5),
      h: h,
    };

    // Core-Stigma: The tiny, dark core center spot
    const coreStigma = {
      l: 0.25, // Slightly lighter
      c: 0.15, // Increased from 0.10
      h: getShadowHue(h, "deep"),
    };

    // ----------------------------------------------------
    // Green Foliage (2 Shades) - Muted Blue-Green
    // ----------------------------------------------------

    const leafH = 180; // Muted Cyan-Green (cooler)
    const stemH = 150; // Standard Green

    // Green-Main: Primary foliage/stem green
    const greenMain = {
      l: clampL(l * smoothStep(0.78)), // Lighter
      c: clampC(c * 0.5), // More saturated
      h: stemH,
    };

    // Green-Base: The tough, woody base/stalk
    const greenBase = {
      l: clampL(l * smoothStep(0.62)),
      c: clampC(c * 0.35), // More saturated
      h: leafH,
    };

    // ----------------------------------------------------
    // PERFECTLY 11 DISTINCT KING PROTEA COLORS
    // Dusty, velvety, architectural aesthetic
    // ----------------------------------------------------
    return [
      // GROUP 1: HIGHLIGHTS & CORE
      { name: "Core-Fuzz", value: coreFuzz }, // L: 0.96, white fuzz
      { name: "Bloom-Highlight", value: bloomHighlight }, // L: ~0.83, dusty blush
      { name: "Bloom-Light", value: bloomLight }, // L: ~0.77

      // GROUP 2: BRACTS (Rose/Crimson)
      { name: "Bloom", value: bloom }, // L: 0.65 (base)
      { name: "Core-Ring", value: coreRing }, // L: ~0.62, muted
      { name: "Bloom-Mid", value: bloomMid }, // L: ~0.57
      { name: "Bloom-Deep", value: bloomDeep }, // L: ~0.42
      { name: "Bloom-Velvet", value: bloomVelvet }, // L: ~0.29

      // GROUP 3: AUXILIARY & DARK CORE
      { name: "Green-Main", value: greenMain }, // L: ~0.51
      { name: "Green-Base", value: greenBase }, // L: ~0.40
      { name: "Core-Stigma", value: coreStigma }, // L: 0.25
    ];
  } else if (flowerType === "plumeria") {
    const { l, c, h } = oklch;

    // ----------------------------------------------------
    // Enhanced Helper Functions
    // ----------------------------------------------------
    const clampL = (x) => Math.max(0.2, Math.min(0.98, x));
    const clampC = (x) => Math.max(0.02, Math.min(0.45, x)); // Increased from 0.40

    // Perceptual easing for smooth, waxy transitions
    const smoothStep = (multiplier) => {
      if (multiplier > 1) {
        // Highlights: gentle ease (soft, creamy glow)
        const t = multiplier - 1;
        return 1 + Math.pow(t, 1.8); // Very gentle for creamy look
      } else {
        // Shadows: gentle darkening (soft, not harsh)
        return Math.pow(multiplier, 1.2);
      }
    };

    // Natural shadow hue shift for warm white (toward cooler blue-white)
    const getShadowHue = (baseH, depth = "mid") => {
      // Warm white flowers shift subtly toward cooler tones in shadow
      const shifts = {
        light: +25, // Cooler
        mid: +35, // Blue-white
        deep: +45, // Cool white-green
      };
      return (baseH + shifts[depth]) % 360;
    };

    // The essential contrasting color: Vivid Yellow for the center
    const coreH = 75; // Pure Yellow-Orange for intensity

    // ----------------------------------------------------
    // Petal Colors (5 Shades) - Warm Creamy White
    // ----------------------------------------------------

    // Bloom-Purity: The absolute whitest point
    const bloomPurity = {
      l: 0.98,
      c: 0.02,
      h: h,
    };

    // Bloom-Light: Primary luminous tone (creamy)
    const bloomLight = {
      l: clampL(l * smoothStep(1.03)),
      c: clampC(c * 1.5), // Increased from 1.4
      h: h,
    };

    // Bloom: Base color (unchanged from input)
    const bloom = { l: l, c: c, h: h };

    // Bloom-Mid: Subtle transition with gentle saturation
    const bloomMid = {
      l: clampL(l * smoothStep(0.97)),
      c: clampC(c * 1.2),
      h: h,
    };

    // Bloom-Shadow: Subtle shadow on the white petals
    const bloomShadow = {
      l: clampL(l * smoothStep(0.92)),
      c: clampC(c * 1.6), // Increased from 1.5
      h: getShadowHue(h, "light"),
    };

    // ----------------------------------------------------
    // Core/Center Colors (4 Shades) - Vivid Yellow Gradient
    // ----------------------------------------------------

    // Core-Vivid: The highly saturated, bright yellow center
    const coreVivid = {
      l: 0.88, // Slightly lighter
      c: 0.4, // Increased from 0.35
      h: coreH,
    };

    // Core-Mid: The transition point between yellow and white
    const coreMid = {
      l: clampL(l * 0.96),
      c: clampC(c * 3.5), // Increased from 3.0
      h: coreH,
    };

    // Core-Deep: The shadow/base of the core
    const coreDeep = {
      l: clampL(l * 0.73),
      c: clampC(c * 3.0), // Increased from 2.5
      h: coreH,
    };

    // Petal-Vein: Base shadow where petals meet (cool-toned)
    const petalVein = {
      l: clampL(l * 0.78),
      c: clampC(c * 2.2), // Increased from 2.0
      h: getShadowHue(h, "mid"),
    };

    // ----------------------------------------------------
    // Green Foliage (2 Shades) - Rich, Dark Tropical Greens
    // ----------------------------------------------------

    const leafH = 150; // Standard Green
    const stemH = 180; // Dark Blue-Green

    // Green-Main: Primary rich foliage green
    const greenMain = {
      l: clampL(l * smoothStep(0.63)), // Slightly lighter
      c: clampC(c * 4.5), // Increased from 4.0
      h: leafH,
    };

    // Green-Stem: Darkest shade for the woody branch
    const greenStem = {
      l: clampL(l * smoothStep(0.45)),
      c: clampC(c * 3.5), // Increased from 3.0
      h: stemH,
    };

    // ----------------------------------------------------
    // PERFECTLY 10 DISTINCT PLUMERIA COLORS
    // Creamy, tropical, waxy aesthetic
    // ----------------------------------------------------
    return [
      // GROUP 1: WHITE PETALS & HIGHLIGHTS
      { name: "Bloom-Purity", value: bloomPurity }, // L: 0.98, pure white
      { name: "Bloom-Light", value: bloomLight }, // L: ~0.98, creamy
      { name: "Bloom", value: bloom }, // L: 0.95 (base)
      { name: "Bloom-Mid", value: bloomMid }, // L: ~0.92

      // GROUP 2: SHADOWS
      { name: "Bloom-Shadow", value: bloomShadow }, // L: ~0.87

      // GROUP 3: YELLOW CORE GRADIENT
      { name: "Core-Vivid", value: coreVivid }, // L: 0.88, bright yellow
      { name: "Core-Mid", value: coreMid }, // L: ~0.91, transition
      { name: "Core-Deep", value: coreDeep }, // L: ~0.69

      // GROUP 4: GREENS & BASE
      { name: "Petal-Vein", value: petalVein }, // L: ~0.74, cool shadow
      { name: "Green-Main", value: greenMain }, // L: ~0.60
      { name: "Green-Stem", value: greenStem }, // L: ~0.43
    ];
  } else if (flowerType === "blackPansy") {
    const { l, c, h } = oklch;

    // ----------------------------------------------------
    // Enhanced Helper Functions
    // ----------------------------------------------------
    const clampL = (x) => Math.max(0.1, Math.min(0.65, x)); // Restricted L for darkness (raised max)
    const clampC = (x) => Math.max(0.02, Math.min(0.38, x)); // Increased from 0.30

    // Perceptual easing for smooth, velvety transitions
    const smoothStep = (multiplier) => {
      if (multiplier > 1) {
        // Highlights: gentle ease (soft, velvety sheen)
        const t = multiplier - 1;
        return 1 + Math.pow(t, 1.5);
      } else {
        // Shadows: moderate darkening (rich velvet)
        return Math.pow(multiplier, 1.3);
      }
    };

    // Natural shadow hue shift for near-black violet (toward deeper blue)
    const getShadowHue = (baseH, depth = "mid") => {
      // Near-black violet shifts toward cooler blue for maximum depth
      const shifts = {
        light: -25, // Toward blue
        mid: -35, // Deeper blue
        deep: -45, // Deep blue-violet
      };
      return (baseH + shifts[depth] + 360) % 360;
    };

    // Highlight shift (toward warmer magenta for subtle sheen)
    const getHighlightHue = (baseH, intensity = "mid") => {
      const shifts = {
        soft: +25, // Warm violet
        mid: +30, // Magenta-violet
        bright: +35, // Warm magenta
      };
      return (baseH + shifts[intensity]) % 360;
    };

    // The essential contrasting color: Bright Yellow/Gold for the center eye
    const coreH = 90; // Pure Yellow

    // ----------------------------------------------------
    // Petal Colors (6 Shades) - Near-Black Violet Velvet
    // ----------------------------------------------------

    // Bloom-Highlight: The subtle, low-light sheen on the velvet petals
    const bloomHighlight = {
      l: clampL(l * smoothStep(1.5)), // Increased from 1.4
      c: clampC(c * 1.8), // Increased from 1.5
      h: getHighlightHue(h, "bright"),
    };

    // Bloom-Light: The primary illuminated part
    const bloomLight = {
      l: clampL(l * smoothStep(1.3)),
      c: clampC(c * 1.4), // Increased from 1.2
      h: getHighlightHue(h, "mid"),
    };

    // Bloom: Base color (unchanged from input)
    const bloom = { l: l, c: c, h: h };

    // Bloom-Mid: Transition tone with saturation boost
    const bloomMid = {
      l: clampL(l * smoothStep(0.9)),
      c: clampC(c * 1.2),
      h: h,
    };

    // Bloom-Deep: The primary shadow area/most saturated look
    const bloomDeep = {
      l: clampL(l * smoothStep(0.75)),
      c: clampC(c * 2.0), // Increased from 1.8 for perceived depth/velvet
      h: h,
    };

    // Bloom-Muted: The deepest, near-black fold
    const bloomMuted = {
      l: clampL(l * smoothStep(0.58)),
      c: clampC(c * 0.6), // Increased from 0.5
      h: getShadowHue(h, "mid"),
    };

    // ----------------------------------------------------
    // Core/Center & Contrast (3 Shades) - Bright Yellow Eye
    // ----------------------------------------------------

    // Core-Vivid: The highly saturated, bright yellow eye
    const coreVivid = {
      l: 0.7, // Increased from 0.65
      c: 0.38, // Increased from 0.35 (maximum contrast)
      h: coreH,
    };

    // Core-Transition: Dark violet ring surrounding the yellow
    const coreTransition = {
      l: 0.38, // Slightly lighter
      c: 0.2, // Increased from 0.15
      h: getShadowHue(h, "light"),
    };

    // Bloom-Edge: High-contrast, sharp dark edge color
    const bloomEdge = {
      l: 0.12, // Slightly lighter
      c: 0.08, // Increased from 0.05
      h: getShadowHue(h, "deep"),
    };

    // ----------------------------------------------------
    // Green Foliage (2 Shades) - Dark, Rich Greens
    // ----------------------------------------------------

    const leafH = 150; // Standard Green
    const stemH = 180; // Dark Blue-Green

    // Green-Main: Primary foliage green
    const greenMain = {
      l: clampL(l * smoothStep(2.2)), // Much lighter
      c: clampC(c * 4.0), // Increased from 3.0
      h: leafH,
    };

    // Green-Stem: Darkest stem/soil shadow
    const greenStem = {
      l: clampL(l * smoothStep(1.5)),
      c: clampC(c * 2.8), // Increased from 2.0
      h: stemH,
    };

    // ----------------------------------------------------
    // PERFECTLY 10 DISTINCT BLACK PANSY COLORS
    // Dark, velvety, dramatic aesthetic
    // ----------------------------------------------------
    return [
      // GROUP 1: CORE & CONTRAST
      { name: "Core-Vivid", value: coreVivid }, // L: 0.70, bright yellow
      { name: "Bloom-Highlight", value: bloomHighlight }, // L: ~0.38, sheen

      // GROUP 2: PETALS (Near-Black Violet)
      { name: "Bloom-Light", value: bloomLight }, // L: ~0.33
      { name: "Bloom", value: bloom }, // L: 0.25 (base)
      { name: "Core-Transition", value: coreTransition }, // L: 0.38, ring
      { name: "Bloom-Mid", value: bloomMid }, // L: ~0.23

      // GROUP 3: DEEP SHADOWS
      { name: "Bloom-Deep", value: bloomDeep }, // L: ~0.19
      { name: "Bloom-Muted", value: bloomMuted }, // L: ~0.15
      { name: "Bloom-Edge", value: bloomEdge }, // L: 0.12

      // GROUP 4: GREENS
      { name: "Green-Main", value: greenMain }, // L: ~0.55
      { name: "Green-Stem", value: greenStem }, // L: ~0.38
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
  } else if (flowerType === "peony") {
    // Base OKLCH set to: L: 0.58, C: 0.35, H: 10 (Deep Crimson Red)
    const { l, c, h } = oklch;

    // Helper functions
    const clampL = (x) => Math.max(0.15, Math.min(0.95, x));
    const clampC = (x) => Math.max(0.05, Math.min(0.45, x));

    // --- Hue Relationships ---
    // Shifts shadows COOLER (towards Magenta/Purple, H ~350) for depth
    const bloomCoolH = (h - 20 + 360) % 360;
    // Shifts highlights WARMER (towards Red-Orange, H ~25) for luminescence
    const bloomWarmH = (h + 15) % 360;

    // The core accent: Bright gold for stamens
    const coreH = 85; // Golden Yellow

    // Base Crimson Petal
    const bloom = { l: l, c: c, h: h };

    // ----------------------------------------------------
    // Petal Colors (6 Shades)
    // ----------------------------------------------------

    // Bloom-Highlight: Soft, luminous edge (L ~0.75)
    const bloomHighlight = {
      l: clampL(l * 1.3),
      c: clampC(c * 0.8), // Lower C for soft glow
      h: bloomWarmH,
    };

    // Bloom-Light: Primary light tone (L ~0.68)
    const bloomLight = {
      l: clampL(l * 1.17),
      c: clampC(c * 0.95),
      h: h,
    };

    // Bloom-Mid: Primary transition (L ~0.48)
    const bloomMid = {
      l: clampL(l * 0.83),
      c: clampC(c * 1.05),
      h: h,
    };

    // Bloom-Shadow: Primary shadow color (L ~0.38)
    const bloomShadow = {
      l: clampL(l * 0.65),
      c: clampC(c * 1.2),
      h: bloomCoolH,
    };

    // Bloom-Deep: Deepest velvet shadow (L ~0.28)
    const bloomDeep = {
      l: clampL(l * 0.48),
      c: clampC(c * 1.35),
      h: bloomCoolH,
    };

    // Bloom-Vein: Near-black vein accent
    const bloomVein = {
      l: 0.2,
      c: 0.15,
      h: bloomCoolH,
    };

    // ----------------------------------------------------
    // Core & Foliage (4 Shades)
    // ----------------------------------------------------

    // Core-Gold: Bright golden stamens
    const coreGold = {
      l: 0.85,
      c: 0.35,
      h: coreH,
    };

    // Core-Shadow: Dark base of stamens
    const coreShadow = {
      l: 0.45,
      c: 0.25,
      h: coreH,
    };

    // Green Foliage: Rich, lush greens
    const leafH = 145; // Rich Green

    // Green-Main: Primary foliage (L ~0.52)
    const greenMain = {
      l: clampL(l * 0.9),
      c: clampC(c * 0.6),
      h: leafH,
    };

    // Green-Stem: Darker stem/shadow (L ~0.38)
    const greenStem = {
      l: clampL(l * 0.65),
      c: clampC(c * 0.4),
      h: leafH,
    };

    // ----------------------------------------------------
    // PERFECTLY 10 DISTINCT PEONY COLORS (ARRANGED FOR FLOW)
    // ----------------------------------------------------
    return [
      // GROUP 1: HIGHLIGHTS & CORE
      { name: "Core-Gold", value: coreGold },
      { name: "Bloom-Highlight", value: bloomHighlight },
      { name: "Bloom-Light", value: bloomLight },

      // GROUP 2: CRIMSON PETALS
      { name: "Bloom", value: bloom },
      { name: "Bloom-Mid", value: bloomMid },
      { name: "Bloom-Shadow", value: bloomShadow },
      { name: "Bloom-Deep", value: bloomDeep },

      // GROUP 3: SHADOWS & GREENS
      { name: "Bloom-Vein", value: bloomVein },
      { name: "Core-Shadow", value: coreShadow },
      { name: "Green-Main", value: greenMain },
      { name: "Green-Stem", value: greenStem },
    ];
  } else if (flowerType === "daffodil") {
    // Base OKLCH set to: L: 0.85, C: 0.25, H: 95 (Pure Lemon Yellow)
    const { l, c, h } = oklch;

    // Helper functions
    const clampL = (x) => Math.max(0.25, Math.min(0.98, x));
    const clampC = (x) => Math.max(0.05, Math.min(0.35, x));

    // --- Hue Relationships ---
    // Shifts shadows WARMER (towards Orange, H ~75) for depth
    const bloomCoolH = (h - 20 + 360) % 360;
    // Shifts highlights COOLER (towards Lime, H ~105) for brightness
    const bloomWarmH = (h + 10) % 360;

    // Corona/trumpet hue: Deeper orange-gold
    const coronaH = 70; // Orange-Gold

    // Base Yellow Petal
    const bloom = { l: l, c: c, h: h };

    // ----------------------------------------------------
    // Petal Colors (5 Shades)
    // ----------------------------------------------------

    // Bloom-Bright: Highest luminosity (L ~0.95)
    const bloomBright = {
      l: 0.95,
      c: clampC(c * 1.1),
      h: bloomWarmH,
    };

    // Bloom-Light: Primary light tone (L ~0.90)
    const bloomLight = {
      l: clampL(l * 1.06),
      c: clampC(c * 1.0),
      h: h,
    };

    // Bloom-Mid: Subtle shadow transition (L ~0.75)
    const bloomMid = {
      l: clampL(l * 0.88),
      c: clampC(c * 1.05),
      h: h,
    };

    // Bloom-Shadow: Primary shadow (L ~0.65)
    const bloomShadow = {
      l: clampL(l * 0.76),
      c: clampC(c * 1.15),
      h: bloomCoolH,
    };

    // Bloom-Base: Deepest petal shadow (L ~0.55)
    const bloomBase = {
      l: clampL(l * 0.65),
      c: clampC(c * 1.2),
      h: bloomCoolH,
    };

    // ----------------------------------------------------
    // Corona/Trumpet & Foliage (5 Shades)
    // ----------------------------------------------------

    // Corona-Bright: Bright orange-gold trumpet edge
    const coronaBright = {
      l: 0.88,
      c: 0.3,
      h: coronaH,
    };

    // Corona-Deep: Deep shadow inside trumpet
    const coronaDeep = {
      l: 0.6,
      c: 0.28,
      h: coronaH,
    };

    // Green Foliage: Blue-green, slightly glaucous
    const leafH = 155; // Cool Blue-Green
    const stemH = 140; // Warmer Green

    // Green-Main: Primary foliage (L ~0.65)
    const greenMain = {
      l: clampL(l * 0.76),
      c: clampC(c * 0.7),
      h: stemH,
    };

    // Green-Stem: Darker stem/base (L ~0.50)
    const greenStem = {
      l: clampL(l * 0.59),
      c: clampC(c * 0.5),
      h: leafH,
    };

    // ----------------------------------------------------
    // PERFECTLY 10 DISTINCT DAFFODIL COLORS (ARRANGED FOR FLOW)
    // ----------------------------------------------------
    return [
      // GROUP 1: BRIGHT YELLOWS
      { name: "Bloom-Bright", value: bloomBright },
      { name: "Bloom-Light", value: bloomLight },
      { name: "Bloom", value: bloom },

      // GROUP 2: PETALS & CORONA
      { name: "Corona-Bright", value: coronaBright },
      { name: "Bloom-Mid", value: bloomMid },
      { name: "Bloom-Shadow", value: bloomShadow },
      { name: "Bloom-Base", value: bloomBase },

      // GROUP 3: CORONA DEPTH & GREENS
      { name: "Corona-Deep", value: coronaDeep },
      { name: "Green-Main", value: greenMain },
      { name: "Green-Stem", value: greenStem },
    ];
  } else if (flowerType === "magnolia") {
    // Base OKLCH set to: L: 0.96, C: 0.04, H: 100 (Cool Bright White)
    const { l, c, h } = oklch;

    // Helper functions
    const clampL = (x) => Math.max(0.25, Math.min(0.98, x));
    const clampC = (x) => Math.max(0.02, Math.min(0.25, x));

    // --- Hue Relationships ---
    // Shifts shadows COOLER (towards Blue-Green, H ~140) for depth
    const bloomCoolH = (h + 40) % 360;
    // Core accent: Soft green-yellow for pistil base
    const coreH = 110; // Yellow-Green

    // Base White Petal
    const bloom = { l: l, c: c, h: h };

    // ----------------------------------------------------
    // Petal Colors (6 Shades)
    // ----------------------------------------------------

    // Bloom-Pure: Absolute whitest point
    const bloomPure = {
      l: 0.98,
      c: 0.02,
      h: h,
    };

    // Bloom-Light: Primary luminous tone (L ~0.97)
    const bloomLight = {
      l: clampL(l * 1.01),
      c: clampC(c * 1.2),
      h: h,
    };

    // Bloom-Mid: Subtle transition (L ~0.88)
    const bloomMid = {
      l: clampL(l * 0.92),
      c: clampC(c * 1.8),
      h: h,
    };

    // Bloom-Shadow: Cool shadow on petals (L ~0.82)
    const bloomShadow = {
      l: clampL(l * 0.85),
      c: clampC(c * 2.5),
      h: bloomCoolH,
    };

    // Bloom-Base: Deep crease/base shadow (L ~0.70)
    const bloomBase = {
      l: clampL(l * 0.73),
      c: clampC(c * 3.0),
      h: bloomCoolH,
    };

    // Petal-Edge: Very subtle pink/brown edge (some varieties)
    const petalEdge = {
      l: clampL(l * 0.8),
      c: clampC(c * 2.0),
      h: 340, // Subtle pink-brown
    };

    // ----------------------------------------------------
    // Core & Foliage (4 Shades)
    // ----------------------------------------------------

    // Core-Pistil: Soft green-yellow center
    const corePistil = {
      l: 0.85,
      c: 0.15,
      h: coreH,
    };

    // Core-Stamen: Pale cream stamen tips
    const coreStamen = {
      l: 0.9,
      c: 0.08,
      h: 90, // Pale yellow
    };

    // Green Foliage: Large, glossy, dark leaves
    const leafH = 150; // Standard Green
    const stemH = 135; // Warmer Green

    // Green-Main: Primary rich foliage (L ~0.50)
    const greenMain = {
      l: clampL(l * 0.52),
      c: clampC(c * 5.0),
      h: leafH,
    };

    // Green-Stem: Dark woody branch (L ~0.35)
    const greenStem = {
      l: clampL(l * 0.36),
      c: clampC(c * 3.5),
      h: stemH,
    };

    // ----------------------------------------------------
    // PERFECTLY 10 DISTINCT MAGNOLIA COLORS (ARRANGED FOR FLOW)
    // ----------------------------------------------------
    return [
      // GROUP 1: WHITE PETALS
      { name: "Bloom-Pure", value: bloomPure },
      { name: "Bloom-Light", value: bloomLight },
      { name: "Bloom", value: bloom },
      { name: "Bloom-Mid", value: bloomMid },

      // GROUP 2: SHADOWS & CORE
      { name: "Core-Stamen", value: coreStamen },
      { name: "Bloom-Shadow", value: bloomShadow },
      { name: "Bloom-Base", value: bloomBase },
      { name: "Core-Pistil", value: corePistil },

      // GROUP 3: EDGE & GREENS
      { name: "Petal-Edge", value: petalEdge },
      { name: "Green-Main", value: greenMain },
      { name: "Green-Stem", value: greenStem },
    ];
  } else if (flowerType === "ranunculus") {
    // Base OKLCH set to: L: 0.75, C: 0.22, H: 25 (Coral/Salmon Pink)
    const { l, c, h } = oklch;

    // Helper functions
    const clampL = (x) => Math.max(0.2, Math.min(0.95, x));
    const clampC = (x) => Math.max(0.05, Math.min(0.35, x));

    // --- Hue Relationships ---
    // Shifts shadows COOLER (towards Pink/Magenta, H ~350) for depth
    const bloomCoolH = (h - 35 + 360) % 360;
    // Shifts highlights WARMER (towards Peach/Orange, H ~40) for glow
    const bloomWarmH = (h + 15) % 360;

    // Core accent: Soft yellow-green center
    const coreH = 100; // Yellow-Green

    // Base Coral Petal
    const bloom = { l: l, c: c, h: h };

    // ----------------------------------------------------
    // Petal Colors (6 Shades)
    // ----------------------------------------------------

    // Bloom-Bright: Softest, peachy highlight (L ~0.88)
    const bloomBright = {
      l: clampL(l * 1.17),
      c: clampC(c * 0.75), // Lower C for soft pastel
      h: bloomWarmH,
    };

    // Bloom-Light: Primary light tone (L ~0.82)
    const bloomLight = {
      l: clampL(l * 1.09),
      c: clampC(c * 0.9),
      h: h,
    };

    // Bloom-Mid: Transition tone (L ~0.65)
    const bloomMid = {
      l: clampL(l * 0.87),
      c: clampC(c * 1.05),
      h: h,
    };

    // Bloom-Shadow: Primary shadow (L ~0.55)
    const bloomShadow = {
      l: clampL(l * 0.73),
      c: clampC(c * 1.2),
      h: bloomCoolH,
    };

    // Bloom-Deep: Deepest petal fold (L ~0.42)
    const bloomDeep = {
      l: clampL(l * 0.56),
      c: clampC(c * 1.35),
      h: bloomCoolH,
    };

    // Bloom-Base: Darkest shadow at base (L ~0.32)
    const bloomBase = {
      l: clampL(l * 0.43),
      c: clampC(c * 1.1),
      h: bloomCoolH,
    };

    // ----------------------------------------------------
    // Core & Foliage (4 Shades)
    // ----------------------------------------------------

    // Core-Center: Soft yellow-green button center
    const coreCenter = {
      l: 0.88,
      c: 0.18,
      h: coreH,
    };

    // Core-Shadow: Dark base of center
    const coreShadow = {
      l: 0.6,
      c: 0.12,
      h: coreH,
    };

    // Green Foliage: Delicate, ferny leaves
    const leafH = 145; // Standard Green
    const stemH = 155; // Blue-Green

    // Green-Main: Primary foliage (L ~0.60)
    const greenMain = {
      l: clampL(l * 0.8),
      c: clampC(c * 0.8),
      h: leafH,
    };

    // Green-Stem: Darker stem (L ~0.45)
    const greenStem = {
      l: clampL(l * 0.6),
      c: clampC(c * 0.55),
      h: stemH,
    };

    // ----------------------------------------------------
    // PERFECTLY 10 DISTINCT RANUNCULUS COLORS (ARRANGED FOR FLOW)
    // ----------------------------------------------------
    return [
      // GROUP 1: SOFT HIGHLIGHTS
      { name: "Bloom-Bright", value: bloomBright },
      { name: "Bloom-Light", value: bloomLight },
      { name: "Core-Center", value: coreCenter },

      // GROUP 2: CORAL PETALS
      { name: "Bloom", value: bloom },
      { name: "Bloom-Mid", value: bloomMid },
      { name: "Bloom-Shadow", value: bloomShadow },
      { name: "Bloom-Deep", value: bloomDeep },

      // GROUP 3: SHADOWS & GREENS
      { name: "Bloom-Base", value: bloomBase },
      { name: "Core-Shadow", value: coreShadow },
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

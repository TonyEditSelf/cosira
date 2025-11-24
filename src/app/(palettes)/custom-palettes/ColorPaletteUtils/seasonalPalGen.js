export default function seasonalPalGen(
  oklch,
  seasonalPalType = "seasonalCombined"
) {
  if (seasonalPalType === "seasonalCombined") {
    const LMAX = 0.95;
    const LMIN = 0.2;
    const CMAX = 0.32;
    const CMIN = 0.04;

    // Warm/cool detection
    const isWarm = oklch.h >= 330 || oklch.h < 90;
    const isBright = oklch.l > 0.65;

    let season = "spring";
    if (isWarm && isBright) season = "spring";
    else if (!isWarm && isBright) season = "summer";
    else if (isWarm && !isBright) season = "autumn";
    else season = "winter";

    // Helper for safe OKLCH
    function variant(offsetH, cMul, lShift) {
      const h = (oklch.h + offsetH + 360) % 360;

      const cRaw = oklch.c * cMul;
      const c = Math.min(CMAX, Math.max(CMIN, cRaw));

      const lRaw = oklch.l + lShift;
      const l = Math.min(LMAX, Math.max(LMIN, lRaw));

      return { l, c, h };
    }

    // Neutral generator — derived from base hue
    function neutral(l, c = 0.01, hueShift = 0) {
      return {
        l,
        c: Math.max(CMIN / 2, c),
        h: (oklch.h + hueShift + 360) % 360,
      };
    }

    let palette = [];

    // ---- SPRING (bright, warm, clear) ----
    if (season === "spring") {
      palette = [
        { name: "Spring-1", value: variant(+8, 1.15, +0.1) },
        { name: "Spring-2", value: variant(+18, 1.25, +0.12) },
        { name: "Spring-3", value: variant(+30, 1.35, +0.16) },
        { name: "Spring-4", value: variant(+45, 1.4, +0.2) },
        { name: "Spring-5", value: variant(+60, 1.28, +0.08) },
        { name: "Spring-6", value: variant(+80, 1.15, +0.05) },
        { name: "Spring-7", value: variant(+100, 1.1, -0.02) },
        { name: "Spring-Neutral-1", value: neutral(0.88, 0.02, +10) },
        { name: "Spring-Neutral-2", value: neutral(0.72, 0.015, +5) },
        { name: "Spring-Neutral-3", value: neutral(0.55, 0.018, +0) },
      ];
    }

    // ---- SUMMER (cool, soft, muted) ----
    if (season === "summer") {
      palette = [
        { name: "Summer-1", value: variant(+160, 0.55, +0.1) },
        { name: "Summer-2", value: variant(+185, 0.6, +0.07) },
        { name: "Summer-3", value: variant(+210, 0.65, +0.05) },
        { name: "Summer-4", value: variant(+240, 0.7, +0.03) },
        { name: "Summer-5", value: variant(+270, 0.5, +0.08) },
        { name: "Summer-6", value: variant(+300, 0.45, +0.02) },
        { name: "Summer-7", value: variant(+330, 0.55, -0.02) },
        { name: "Summer-Neutral-1", value: neutral(0.85, 0.02, +180) },
        { name: "Summer-Neutral-2", value: neutral(0.68, 0.015, +160) },
        { name: "Summer-Neutral-3", value: neutral(0.5, 0.012, +150) },
      ];
    }

    // ---- AUTUMN (warm, rich, earthy) ----
    if (season === "autumn") {
      palette = [
        { name: "Autumn-1", value: variant(+8, 1.1, -0.05) },
        { name: "Autumn-2", value: variant(+25, 1.2, -0.1) },
        { name: "Autumn-3", value: variant(+45, 1.25, -0.12) },
        { name: "Autumn-4", value: variant(+70, 1.05, -0.08) },
        { name: "Autumn-5", value: variant(+95, 0.95, -0.04) },
        { name: "Autumn-6", value: variant(+120, 1.0, -0.15) },
        { name: "Autumn-7", value: variant(+150, 0.9, -0.18) },
        { name: "Autumn-Neutral-1", value: neutral(0.7, 0.02, +30) },
        { name: "Autumn-Neutral-2", value: neutral(0.55, 0.018, +35) },
        { name: "Autumn-Neutral-3", value: neutral(0.42, 0.016, +40) },
      ];
    }

    // ---- WINTER (cool, vivid, high contrast) ----
    if (season === "winter") {
      palette = [
        { name: "Winter-1", value: variant(+200, 1.25, +0.15) },
        { name: "Winter-2", value: variant(+230, 1.35, +0.08) },
        { name: "Winter-3", value: variant(+260, 1.45, -0.05) },
        { name: "Winter-4", value: variant(+290, 1.4, +0.2) },
        { name: "Winter-5", value: variant(+320, 1.3, +0.02) },
        { name: "Winter-6", value: variant(+350, 1.2, -0.12) },
        { name: "Winter-7", value: variant(+30, 1.22, +0.25) },
        { name: "Winter-Neutral-1", value: neutral(0.9, 0.015, +220) },
        { name: "Winter-Neutral-2", value: neutral(0.6, 0.012, +230) },
        { name: "Winter-Neutral-3", value: neutral(0.35, 0.015, +240) },
      ];
    }

    return palette;
  } else if (seasonalPalType === "autumnSmooth") {
    const LMAX = 0.95;
    const LMIN = 0.2;
    const CMAX = 0.32;
    const CMIN = 0.04;

    // --------------------------------------------
    // UTIL: Safe clamp
    // --------------------------------------------
    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    // --------------------------------------------
    // HUE GRAVITY — pulls ANY hue into warm autumn zone (~60°)
    // --------------------------------------------
    function pullWarmHue(h) {
      const target = 60; // golden warm hue
      const blend = 0.35; // strength of pull
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    // --------------------------------------------
    // PRE-NORMALIZE BASE COLOR
    // - Muted slightly (C * 0.95)
    // - Darkened slightly (L - 0.05)
    // - Warmed using Hue Gravity
    // --------------------------------------------
    const baseL = limit(oklch.l - 0.05, LMIN, LMAX);
    const baseC = limit(oklch.c * 0.95, CMIN, CMAX);
    const baseH = pullWarmHue(oklch.h);

    // --------------------------------------------
    // MODE A — PERFECTLY SMOOTH PALETTE
    // L, C, H all follow perceptual curves
    // --------------------------------------------

    const result = [];

    function smoothL(i) {
      // smooth darkening curve
      return limit(baseL - 0.02 - i * 0.05, LMIN, LMAX);
    }

    function smoothC(i) {
      // smooth muting curve
      return limit(baseC - i * 0.02, CMIN, CMAX);
    }

    function smoothH(i) {
      // distribute hues from golden → rust → olive
      const start = baseH;
      const end = (baseH + 100) % 360; // wide warm spread
      const t = i / 9;
      return (start * (1 - t) + end * t + 360) % 360;
    }

    for (let i = 0; i < 10; i++) {
      result.push({
        name: `Autumn-Smooth-${i + 1}`,
        value: {
          l: smoothL(i),
          c: smoothC(i),
          h: smoothH(i),
        },
      });
    }

    return result;
  } else if (seasonalPalType === "autumnTrue") {
    const LMAX = 0.95;
    const LMIN = 0.2;
    const CMAX = 0.32;
    const CMIN = 0.04;

    // --------------------------------------------
    // UTIL: Safe clamp
    // --------------------------------------------
    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    // --------------------------------------------
    // HUE GRAVITY — pulls ANY hue into warm autumn zone (~60°)
    // --------------------------------------------
    function pullWarmHue(h) {
      const target = 60; // golden warm hue
      const blend = 0.35; // strength of pull
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    // --------------------------------------------
    // PRE-NORMALIZE BASE COLOR
    // - Muted slightly (C * 0.95)
    // - Darkened slightly (L - 0.05)
    // - Warmed using Hue Gravity
    // --------------------------------------------
    const baseL = limit(oklch.l - 0.05, LMIN, LMAX);
    const baseC = limit(oklch.c * 0.95, CMIN, CMAX);
    const baseH = pullWarmHue(oklch.h);

    function variant(offsetH, cMul, lShift) {
      const h = (baseH + offsetH + 360) % 360;
      const c = limit(baseC * cMul, CMIN, CMAX);
      const l = limit(baseL + lShift, LMIN, LMAX);
      return { l, c, h };
    }

    function neutral(l, hueShift = 20) {
      return {
        l: limit(l, LMIN, LMAX),
        c: CMIN * 0.5,
        h: (baseH + hueShift + 360) % 360,
      };
    }

    const trueAutumn = [
      { name: "Autumn-1", value: variant(+5, 1.1, -0.05) },
      { name: "Autumn-2", value: variant(+20, 1.2, -0.1) },
      { name: "Autumn-3", value: variant(+40, 1.25, -0.12) },
      { name: "Autumn-4", value: variant(+65, 1.05, -0.08) },
      { name: "Autumn-5", value: variant(+90, 0.95, -0.04) },
      { name: "Autumn-6", value: variant(+110, 1.0, -0.15) },
      { name: "Autumn-7", value: variant(+130, 0.88, -0.18) },

      { name: "Autumn-Neutral-1", value: neutral(0.68, +15) },
      { name: "Autumn-Neutral-2", value: neutral(0.55, +25) },
      { name: "Autumn-Neutral-3", value: neutral(0.42, +30) },
    ];

    return trueAutumn;
  } else if (seasonalPalType === "autumnDeepDarkMuted") {
    const LMAX = 0.95,
      LMIN = 0.15;
    const CMAX = 0.28,
      CMIN = 0.03;

    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    // Pull all hues toward deep-autumn warm center
    function pullWarmHue(h) {
      const target = 55; // golden-warm, deep autumn anchor
      const blend = 0.45; // strong pull
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    // Base transforms
    const baseL = limit(oklch.l - 0.1, LMIN, LMAX); // darken
    const baseC = limit(oklch.c * 0.85, CMIN, CMAX); // mute
    const baseH = pullWarmHue(oklch.h); // warm shift

    // Variant recipe for autumn
    function variant(offsetH, cMul, lShift) {
      return {
        h: (baseH + offsetH + 360) % 360,
        c: limit(baseC * cMul, CMIN, CMAX),
        l: limit(baseL + lShift, LMIN, LMAX),
      };
    }

    // Neutral autumn tones
    function neutral(l, hueShift = 20) {
      return {
        l: limit(l, LMIN, LMAX),
        c: CMIN * 0.5,
        h: (baseH + hueShift + 360) % 360,
      };
    }

    // Final 10 Deep Autumn A colors
    return [
      { name: "Deep-A-1", value: variant(+5, 1.05, -0.05) },
      { name: "Deep-A-2", value: variant(+20, 1.1, -0.1) },
      { name: "Deep-A-3", value: variant(+40, 1.0, -0.12) },
      { name: "Deep-A-4", value: variant(+65, 0.9, -0.15) },
      { name: "Deep-A-5", value: variant(+85, 0.85, -0.08) },
      { name: "Deep-A-6", value: variant(+110, 0.95, -0.18) },
      { name: "Deep-A-7", value: variant(+140, 0.8, -0.2) },

      { name: "Deep-A-Neutral-1", value: neutral(0.55, +15) },
      { name: "Deep-A-Neutral-2", value: neutral(0.42, +25) },
      { name: "Deep-A-Neutral-3", value: neutral(0.3, +30) },
    ];
  } else if (seasonalPalType === "autumnDeepDarkRich") {
    const LMAX = 0.92,
      LMIN = 0.12;
    const CMAX = 0.34,
      CMIN = 0.05;

    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    // Strong warm pull to a deeper Autumn core
    function pullWarmHue(h) {
      const target = 50; // deep golden-russet anchor
      const blend = 0.5; // even stronger pull than A
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    // Base transforms: darker & richer than A
    const baseL = limit(oklch.l - 0.14, LMIN, LMAX); // stronger darkening
    const baseC = limit(oklch.c * 1.15, CMIN, CMAX); // gently increase chroma
    const baseH = pullWarmHue(oklch.h);

    // Rich deep-autumn variants
    function variant(offsetH, cMul, lShift) {
      return {
        h: (baseH + offsetH + 360) % 360,
        c: limit(baseC * cMul, CMIN, CMAX),
        l: limit(baseL + lShift, LMIN, LMAX),
      };
    }

    // Deep rich neutrals (warm, reddish-brown shadow tones)
    function neutral(l, hueShift = 18) {
      return {
        l: limit(l, LMIN, LMAX),
        c: CMIN * 0.65, // deeper neutrals than A
        h: (baseH + hueShift + 360) % 360,
      };
    }

    // Final Deep Autumn B palette (10 colors)
    return [
      { name: "Deep-B-1", value: variant(+4, 1.2, -0.04) },
      { name: "Deep-B-2", value: variant(+18, 1.25, -0.08) },
      { name: "Deep-B-3", value: variant(+35, 1.15, -0.1) },
      { name: "Deep-B-4", value: variant(+55, 1.05, -0.12) },
      { name: "Deep-B-5", value: variant(+80, 0.98, -0.06) },
      { name: "Deep-B-6", value: variant(+105, 1.1, -0.15) },
      { name: "Deep-B-7", value: variant(+135, 0.9, -0.18) },

      { name: "Deep-B-Neutral-1", value: neutral(0.48, +15) },
      { name: "Deep-B-Neutral-2", value: neutral(0.38, +22) },
      { name: "Deep-B-Neutral-3", value: neutral(0.26, +30) },
    ];
  } else if (seasonalPalType === "autumnSoftGentleMuted") {
    const LMAX = 0.92,
      LMIN = 0.28; // lighter minimum
    const CMAX = 0.22,
      CMIN = 0.03; // low saturation ceiling

    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    // Soft warm pull: subtle, not heavy
    function pullWarmHue(h) {
      const target = 65; // soft golden-wheat
      const blend = 0.3; // mild warmth
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    // Base transforms: lighten slightly, mute strongly
    const baseL = limit(oklch.l + 0.06, LMIN, LMAX); // soft lift
    const baseC = limit(oklch.c * 0.7, CMIN, CMAX); // reduce saturation
    const baseH = pullWarmHue(oklch.h);

    // Variants — smaller shifts than any Autumn type
    function variant(offsetH, cMul, lShift) {
      return {
        h: (baseH + offsetH + 360) % 360,
        c: limit(baseC * cMul, CMIN, CMAX),
        l: limit(baseL + lShift, LMIN, LMAX),
      };
    }

    // Neutrals — warm mushroom/taupe tones
    function neutral(l, hueShift = 22) {
      return {
        l: limit(l, LMIN, LMAX),
        c: CMIN * 0.6,
        h: (baseH + hueShift + 360) % 360,
      };
    }

    // Final soft, cohesive palette (10 colors)
    return [
      { name: "Soft-A-1", value: variant(+4, 1.05, +0.02) },
      { name: "Soft-A-2", value: variant(+18, 1.0, -0.02) },
      { name: "Soft-A-3", value: variant(+32, 0.95, -0.04) },
      { name: "Soft-A-4", value: variant(+52, 0.9, +0.0) },
      { name: "Soft-A-5", value: variant(+75, 0.85, -0.03) },
      { name: "Soft-A-6", value: variant(+95, 0.9, -0.06) },
      { name: "Soft-A-7", value: variant(+120, 0.8, -0.01) },

      { name: "Soft-A-Neutral-1", value: neutral(0.7, +16) },
      { name: "Soft-A-Neutral-2", value: neutral(0.6, +22) },
      { name: "Soft-A-Neutral-3", value: neutral(0.48, +30) },
    ];
  } else if (seasonalPalType === "autumnSoftDustyNeutral") {
    const LMAX = 0.9,
      LMIN = 0.3; // balanced soft range
    const CMAX = 0.18,
      CMIN = 0.02; // extremely low chroma ceiling

    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    // Neutral-warm gravity (less warm than Soft A)
    function pullWarmNeutral(h) {
      const target = 55; // wheat–taupe midpoint
      const blend = 0.22; // very gentle
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    // Base transforms — very muted, slightly softened
    const baseL = limit(oklch.l + 0.04, LMIN, LMAX); // gentle lift
    const baseC = limit(oklch.c * 0.55, CMIN, CMAX); // heavy muting
    const baseH = pullWarmNeutral(oklch.h);

    // Variants — tiny soft shifts
    function variant(offsetH, cMul, lShift) {
      return {
        h: (baseH + offsetH + 360) % 360,
        c: limit(baseC * cMul, CMIN, CMAX),
        l: limit(baseL + lShift, LMIN, LMAX),
      };
    }

    // Dusty neutrals — taupe, mushroom, sand
    function neutral(l, hueShift = 18) {
      return {
        l: limit(l, LMIN, LMAX),
        c: CMIN * 0.75, // soft warm-gray chroma
        h: (baseH + hueShift + 360) % 360,
      };
    }

    // Final 10 colors — dusty, desaturated, cohesive
    return [
      { name: "Soft-B-1", value: variant(+3, 1.05, +0.01) },
      { name: "Soft-B-2", value: variant(+15, 0.98, -0.01) },
      { name: "Soft-B-3", value: variant(+28, 0.92, -0.03) },
      { name: "Soft-B-4", value: variant(+45, 0.88, +0.0) },
      { name: "Soft-B-5", value: variant(+60, 0.85, -0.02) },
      { name: "Soft-B-6", value: variant(+82, 0.9, -0.05) },
      { name: "Soft-B-7", value: variant(+105, 0.78, -0.04) },

      { name: "Soft-B-Neutral-1", value: neutral(0.72, +14) },
      { name: "Soft-B-Neutral-2", value: neutral(0.62, +20) },
      { name: "Soft-B-Neutral-3", value: neutral(0.5, +26) },
    ];
  } else if (seasonalPalType === "autumnSoftEarthySmoky") {
    const LMAX = 0.88,
      LMIN = 0.22; // deeper and earthier
    const CMAX = 0.22,
      CMIN = 0.03; // muted but not dusty-flat

    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    // Hue gravity — heavier pull into earthy zone (gold → bark → moss)
    function pullEarthHue(h) {
      const target = 50; // warm earth midpoint (amber–moss axis)
      const blend = 0.3; // moderate pull
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    // Base transforms — deeper + earth-muted
    const baseL = limit(oklch.l - 0.06, LMIN, LMAX); // soft darkening
    const baseC = limit(oklch.c * 0.65, CMIN, CMAX); // muted but earthy
    const baseH = pullEarthHue(oklch.h);

    // Variant builder
    function variant(offsetH, cMul, lShift) {
      return {
        h: (baseH + offsetH + 360) % 360,
        c: limit(baseC * cMul, CMIN, CMAX),
        l: limit(baseL + lShift, LMIN, LMAX),
      };
    }

    // Earth-smoke neutrals (mushroom → bark → peat)
    function neutral(l, hueShift = 10) {
      return {
        l: limit(l, LMIN, LMAX),
        c: CMIN * 0.65, // smoky brownish-gray
        h: (baseH + hueShift + 360) % 360,
      };
    }

    // 10 Colors — earthy, smoky, grounded
    return [
      { name: "Soft-C-1", value: variant(+4, 1.05, -0.02) }, // smoky peach-clay
      { name: "Soft-C-2", value: variant(+18, 1.0, -0.04) }, // soft russet
      { name: "Soft-C-3", value: variant(+32, 0.95, -0.05) }, // muted terracotta
      { name: "Soft-C-4", value: variant(+55, 0.9, -0.06) }, // earthy tan
      { name: "Soft-C-5", value: variant(+78, 0.88, -0.03) }, // dusty golden moss
      { name: "Soft-C-6", value: variant(+98, 0.85, -0.07) }, // muted olive-bark
      { name: "Soft-C-7", value: variant(+120, 0.82, -0.08) }, // deep smoky olive

      { name: "Soft-C-Neutral-1", value: neutral(0.6, +8) }, // mushroom
      { name: "Soft-C-Neutral-2", value: neutral(0.48, +12) }, // taupe-bark
      { name: "Soft-C-Neutral-3", value: neutral(0.35, +18) }, // peat-smoke
    ];
  } else if (seasonalPalType === "autumnTrueWarmBalanced") {
    const LMAX = 0.9,
      LMIN = 0.32; // medium depth range
    const CMAX = 0.34,
      CMIN = 0.1; // saturated warm autumn chroma

    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    // Hue gravity for true autumn: golden → rust → olive
    function pullAutumnHue(h) {
      const target = 55; // core warm autumn pivot
      const blend = 0.22; // gentle pull (not extreme)
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    // Base transforms: slightly warmer, balanced depth
    const baseH = pullAutumnHue(oklch.h);
    const baseC = limit(oklch.c * 1.15, CMIN, CMAX); // gently boost chroma
    const baseL = limit(oklch.l, LMIN, LMAX); // retain natural depth

    // Variant builder
    function variant(offsetH, cMul, lShift) {
      return {
        h: (baseH + offsetH + 360) % 360,
        c: limit(baseC * cMul, CMIN, CMAX),
        l: limit(baseL + lShift, LMIN, LMAX),
      };
    }

    // Autumn neutrals — warm brown → bronze
    function neutral(l, hueShift = +10) {
      return {
        l: limit(l, LMIN, LMAX),
        c: CMIN * 0.9,
        h: (baseH + hueShift + 360) % 360,
      };
    }

    // 10 True Autumn balanced colors
    return [
      { name: "TA-A-1", value: variant(+6, 1.1, +0.02) }, // warm golden peach
      { name: "TA-A-2", value: variant(+18, 1.15, 0.0) }, // pumpkin spice
      { name: "TA-A-3", value: variant(+32, 1.12, -0.01) }, // amber sienna
      { name: "TA-A-4", value: variant(+46, 1.05, -0.02) }, // warm rust
      { name: "TA-A-5", value: variant(+62, 1.0, -0.03) }, // golden ochre
      { name: "TA-A-6", value: variant(+85, 0.95, -0.04) }, // warm olive-gold
      { name: "TA-A-7", value: variant(+105, 0.92, -0.02) }, // autumn olive

      { name: "TA-A-Neutral-1", value: neutral(0.63, +6) }, // warm bronze
      { name: "TA-A-Neutral-2", value: neutral(0.5, +14) }, // earthy brown
      { name: "TA-A-Neutral-3", value: neutral(0.4, +20) }, // chestnut bark
    ];
  } else if (seasonalPalType === "autumnTrueWarmBright") {
    const LMAX = 0.95,
      LMIN = 0.22; // True Autumn is mid-depth, not too dark
    const CMAX = 0.32,
      CMIN = 0.05; // Brighter than Soft, less than Spring

    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    // Pull hue toward warm golden Autumn center, but lightly (brighter requires less drag)
    function pullWarmHue(h) {
      const target = 50; // golden apricot center
      const blend = 0.3; // lighter pull than deep autumn
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    // Base transforms for "Warm + Bright"
    const baseL = limit(oklch.l + 0.05, LMIN, LMAX); // brighten slightly
    const baseC = limit(oklch.c * 1.1, CMIN, CMAX); // increase chroma (brightness)
    const baseH = pullWarmHue(oklch.h); // warm drift

    // Variant generator
    function variant(offsetH, cMul, lShift) {
      return {
        h: (baseH + offsetH + 360) % 360,
        c: limit(baseC * cMul, CMIN, CMAX),
        l: limit(baseL + lShift, LMIN, LMAX),
      };
    }

    // Warm-bright neutrals (gold-leaning)
    function neutral(l, hueShift = 12) {
      return {
        l: limit(l, LMIN, LMAX),
        c: CMIN * 0.65, // slightly clearer than soft autumn neutrals
        h: (baseH + hueShift + 360) % 360,
      };
    }

    return [
      // Warm & Bright spectrum
      { name: "TA-Bright-1", value: variant(+4, 1.15, +0.0) },
      { name: "TA-Bright-2", value: variant(+18, 1.1, -0.02) },
      { name: "TA-Bright-3", value: variant(+32, 1.05, -0.03) },
      { name: "TA-Bright-4", value: variant(+48, 1.0, -0.04) },
      { name: "TA-Bright-5", value: variant(+65, 0.95, -0.01) },
      { name: "TA-Bright-6", value: variant(+80, 0.9, -0.05) },
      { name: "TA-Bright-7", value: variant(+95, 0.85, -0.07) },

      // Warm + bright neutrals
      { name: "TA-Bright-Neutral-1", value: neutral(0.58, +10) },
      { name: "TA-Bright-Neutral-2", value: neutral(0.48, +18) },
      { name: "TA-Bright-Neutral-3", value: neutral(0.38, +25) },
    ];
  } else if (seasonalPalType === "autumnTrueRusticEarthy") {
    const LMAX = 0.95,
      LMIN = 0.22;
    const CMAX = 0.34,
      CMIN = 0.05;

    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    // Pull all hues slightly into warm-rust zone
    function pullWarmHue(h) {
      const target = 58; // rustic autumn center
      const blend = 0.28; // moderate pull (not too strong)
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    // Base transforms (True Autumn: warm, earthy, rich)
    const baseL = limit(oklch.l - 0.04, LMIN, LMAX); // mild darkening
    const baseC = limit(oklch.c * 1.1, CMIN, CMAX); // slightly richer
    const baseH = pullWarmHue(oklch.h);

    // Rustic variant builder
    function variant(offsetH, cMul, lShift) {
      return {
        h: (baseH + offsetH + 360) % 360,
        c: limit(baseC * cMul, CMIN, CMAX),
        l: limit(baseL + lShift, LMIN, LMAX),
      };
    }

    // Rustic neutrals (warm earth, slightly muted)
    function neutral(l, hueShift = 18) {
      return {
        l: limit(l, LMIN, LMAX),
        c: CMIN * 0.7,
        h: (baseH + hueShift + 360) % 360,
      };
    }

    // Final 10 colors
    return [
      // Clay / terracotta / warm bark / rust / spicy ochre / warm olive
      { name: "True-C-1", value: variant(+15, 1.15, -0.03) },
      { name: "True-C-2", value: variant(+35, 1.2, -0.06) },
      { name: "True-C-3", value: variant(+55, 1.1, -0.04) },
      { name: "True-C-4", value: variant(+75, 1.0, -0.08) },
      { name: "True-C-5", value: variant(+100, 0.95, -0.05) },
      { name: "True-C-6", value: variant(+125, 0.88, -0.1) },
      { name: "True-C-7", value: variant(+150, 0.8, -0.12) },

      // Neutral earth tones (rustic-beige → earthy-taupe → warm bark)
      { name: "True-C-Neutral-1", value: neutral(0.7, +15) },
      { name: "True-C-Neutral-2", value: neutral(0.58, +22) },
      { name: "True-C-Neutral-3", value: neutral(0.45, +28) },
    ];
  } else if (seasonalPalType === "summerSoftDustyMuted") {
    const LMAX = 0.92,
      LMIN = 0.25;
    const CMAX = 0.18,
      CMIN = 0.02;

    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    function pullCool(h) {
      const target = 220; // soft summer cool anchor
      const blend = 0.35;
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    const baseL = limit(oklch.l + 0.05, LMIN, LMAX); // lighten slightly
    const baseC = limit(oklch.c * 0.7, CMIN, CMAX); // strong muting
    const baseH = pullCool(oklch.h);

    function variant(offsetH, cMul, lShift) {
      return {
        h: (baseH + offsetH + 360) % 360,
        c: limit(baseC * cMul, CMIN, CMAX),
        l: limit(baseL + lShift, LMIN, LMAX),
      };
    }

    function neutral(l) {
      return { l: limit(l, LMIN, LMAX), c: CMIN * 0.6, h: baseH };
    }

    return [
      { name: "Soft-A-1", value: variant(-10, 1.0, +0.02) },
      { name: "Soft-A-2", value: variant(+5, 0.95, 0) },
      { name: "Soft-A-3", value: variant(+20, 0.9, -0.02) },
      { name: "Soft-A-4", value: variant(+35, 0.85, -0.04) },
      { name: "Soft-A-5", value: variant(+50, 0.8, -0.06) },
      { name: "Soft-A-6", value: variant(+70, 0.75, -0.08) },
      { name: "Soft-A-7", value: variant(+90, 0.7, -0.1) },

      { name: "Soft-A-Neutral-1", value: neutral(0.65) },
      { name: "Soft-A-Neutral-2", value: neutral(0.55) },
      { name: "Soft-A-Neutral-3", value: neutral(0.42) },
    ];
  } else if (seasonalPalType === "summerSoftSmokyNeutral") {
    const LMAX = 0.9,
      LMIN = 0.22;
    const CMAX = 0.15,
      CMIN = 0.02;

    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    function pullCool(h) {
      return (h * 0.7 + 220 * 0.3 + 360) % 360;
    }

    const baseL = limit(oklch.l + 0.02, LMIN, LMAX);
    const baseC = limit(oklch.c * 0.6, CMIN, CMAX);
    const baseH = pullCool(oklch.h);

    function v(offsetH, cMul, lShift) {
      return {
        h: (baseH + offsetH + 360) % 360,
        c: limit(baseC * cMul, CMIN, CMAX),
        l: limit(baseL + lShift, LMIN, LMAX),
      };
    }

    function n(l) {
      return { l: limit(l, LMIN, LMAX), c: CMIN * 0.5, h: baseH };
    }

    return [
      { name: "Soft-B-1", value: v(-15, 1.0, +0.04) },
      { name: "Soft-B-2", value: v(+5, 0.95, +0.02) },
      { name: "Soft-B-3", value: v(+25, 0.9, 0) },
      { name: "Soft-B-4", value: v(+45, 0.85, -0.03) },
      { name: "Soft-B-5", value: v(+65, 0.8, -0.05) },
      { name: "Soft-B-6", value: v(+85, 0.75, -0.08) },
      { name: "Soft-B-7", value: v(+105, 0.7, -0.1) },

      { name: "Soft-B-Neutral-1", value: n(0.62) },
      { name: "Soft-B-Neutral-2", value: n(0.5) },
      { name: "Soft-B-Neutral-3", value: n(0.38) },
    ];
  } else if (seasonalPalType === "summerSoftCoolEarthySmoky") {
    const LMAX = 0.88,
      LMIN = 0.22;
    const CMAX = 0.14,
      CMIN = 0.02;

    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    function pullCool(h) {
      return (h * 0.65 + 225 * 0.35 + 360) % 360;
    }

    const baseL = limit(oklch.l - 0.02, LMIN, LMAX);
    const baseC = limit(oklch.c * 0.55, CMIN, CMAX);
    const baseH = pullCool(oklch.h);

    function v(offsetH, cMul, lShift) {
      return {
        h: (baseH + offsetH + 360) % 360,
        c: limit(baseC * cMul, CMIN, CMAX),
        l: limit(baseL + lShift, LMIN, LMAX),
      };
    }

    function n(l) {
      return { l: limit(l, LMIN, LMAX), c: CMIN * 0.4, h: baseH };
    }

    return [
      { name: "Soft-C-1", value: v(-10, 1.0, +0.03) },
      { name: "Soft-C-2", value: v(+8, 0.95, +0.01) },
      { name: "Soft-C-3", value: v(+25, 0.9, -0.01) },
      { name: "Soft-C-4", value: v(+42, 0.85, -0.03) },
      { name: "Soft-C-5", value: v(+60, 0.8, -0.05) },
      { name: "Soft-C-6", value: v(+80, 0.75, -0.07) },
      { name: "Soft-C-7", value: v(+100, 0.72, -0.09) },

      { name: "Soft-C-Neutral-1", value: n(0.6) },
      { name: "Soft-C-Neutral-2", value: n(0.48) },
      { name: "Soft-C-Neutral-3", value: n(0.36) },
    ];
  } else if (seasonalPalType === "summerTrueCoolBalanced") {
    const LMAX = 0.92,
      LMIN = 0.3;
    const CMAX = 0.22,
      CMIN = 0.03;

    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    function pullCool(h) {
      const target = 220;
      const blend = 0.4;
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    const baseL = limit(oklch.l + 0.04, LMIN, LMAX);
    const baseC = limit(oklch.c * 0.8, CMIN, CMAX);
    const baseH = pullCool(oklch.h);

    function v(o, c, l) {
      return {
        h: (baseH + o + 360) % 360,
        c: limit(baseC * c, CMIN, CMAX),
        l: limit(baseL + l, LMIN, LMAX),
      };
    }

    function n(l) {
      return { l: limit(l, LMIN, LMAX), c: CMIN * 0.6, h: baseH };
    }

    return [
      { name: "TS-A-1", value: v(-5, 1.05, +0.02) },
      { name: "TS-A-2", value: v(+10, 1.0, 0) },
      { name: "TS-A-3", value: v(+25, 0.95, -0.02) },
      { name: "TS-A-4", value: v(+45, 0.9, -0.04) },
      { name: "TS-A-5", value: v(+65, 0.88, -0.06) },
      { name: "TS-A-6", value: v(+85, 0.86, -0.08) },
      { name: "TS-A-7", value: v(+105, 0.84, -0.1) },

      { name: "TS-A-N1", value: n(0.7) },
      { name: "TS-A-N2", value: n(0.56) },
      { name: "TS-A-N3", value: n(0.44) },
    ];
  } else if (seasonalPalType === "summerTrueCoolBright") {
    const LMAX = 0.94,
      LMIN = 0.33;
    const CMAX = 0.26,
      CMIN = 0.04;

    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    function pullCool(h) {
      return (h * 0.55 + 220 * 0.45 + 360) % 360;
    }

    const baseL = limit(oklch.l + 0.06, LMIN, LMAX);
    const baseC = limit(oklch.c * 0.95, CMIN, CMAX);
    const baseH = pullCool(oklch.h);

    function v(o, c, l) {
      return {
        h: (baseH + o + 360) % 360,
        c: limit(baseC * c, CMIN, CMAX),
        l: limit(baseL + l, LMIN, LMAX),
      };
    }

    function n(l) {
      return { l: limit(l, LMIN, LMAX), c: CMIN * 0.6, h: baseH };
    }

    return [
      { name: "TS-B-1", value: v(-5, 1.1, +0.03) },
      { name: "TS-B-2", value: v(+12, 1.05, +0.01) },
      { name: "TS-B-3", value: v(+28, 1.0, -0.01) },
      { name: "TS-B-4", value: v(+48, 0.98, -0.03) },
      { name: "TS-B-5", value: v(+68, 0.95, -0.05) },
      { name: "TS-B-6", value: v(+88, 0.93, -0.07) },
      { name: "TS-B-7", value: v(+110, 0.9, -0.1) },

      { name: "TS-B-N1", value: n(0.74) },
      { name: "TS-B-N2", value: n(0.6) },
      { name: "TS-B-N3", value: n(0.46) },
    ];
  } else if (seasonalPalType === "summerTrueCoolRosy") {
    const LMAX = 0.93,
      LMIN = 0.32;
    const CMAX = 0.2,
      CMIN = 0.03;

    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    function pullRosy(h) {
      const target = 240; // violet-rose direction
      const blend = 0.4;
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    const baseL = limit(oklch.l + 0.05, LMIN, LMAX);
    const baseC = limit(oklch.c * 0.75, CMIN, CMAX);
    const baseH = pullRosy(oklch.h);

    function v(o, c, l) {
      return {
        h: (baseH + o + 360) % 360,
        c: limit(baseC * c, CMIN, CMAX),
        l: limit(baseL + l, LMIN, LMAX),
      };
    }

    function n(l) {
      return { l: limit(l, LMIN, LMAX), c: CMIN * 0.7, h: baseH };
    }

    return [
      { name: "TS-C-1", value: v(-10, 1.05, +0.03) },
      { name: "TS-C-2", value: v(+5, 1.0, +0.01) },
      { name: "TS-C-3", value: v(+20, 0.95, -0.01) },
      { name: "TS-C-4", value: v(+38, 0.9, -0.03) },
      { name: "TS-C-5", value: v(+58, 0.88, -0.04) },
      { name: "TS-C-6", value: v(+78, 0.85, -0.06) },
      { name: "TS-C-7", value: v(+100, 0.83, -0.08) },

      { name: "TS-C-N1", value: n(0.72) },
      { name: "TS-C-N2", value: n(0.6) },
      { name: "TS-C-N3", value: n(0.48) },
    ];
  } else if (seasonalPalType === "summerTrueDeepRainforest") {
    const LMAX = 0.88,
      LMIN = 0.2;
    const CMAX = 0.24,
      CMIN = 0.03;

    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    function pullDeepCool(h) {
      const target = 210;
      const blend = 0.45;
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    const baseL = limit(oklch.l - 0.08, LMIN, LMAX); // darken deep
    const baseC = limit(oklch.c * 0.85, CMIN, CMAX);
    const baseH = pullDeepCool(oklch.h);

    function v(o, c, l) {
      return {
        h: (baseH + o + 360) % 360,
        c: limit(baseC * c, CMIN, CMAX),
        l: limit(baseL + l, LMIN, LMAX),
      };
    }

    function n(l) {
      return { l: limit(l, LMIN, LMAX), c: CMIN * 0.6, h: baseH };
    }

    return [
      { name: "TS-D-1", value: v(-5, 1.05, +0.02) },
      { name: "TS-D-2", value: v(+12, 1.0, -0.01) },
      { name: "TS-D-3", value: v(+30, 0.95, -0.03) },
      { name: "TS-D-4", value: v(+50, 0.92, -0.05) },
      { name: "TS-D-5", value: v(+70, 0.9, -0.07) },
      { name: "TS-D-6", value: v(+92, 0.88, -0.1) },
      { name: "TS-D-7", value: v(+115, 0.85, -0.13) },

      { name: "TS-D-N1", value: n(0.52) },
      { name: "TS-D-N2", value: n(0.4) },
      { name: "TS-D-N3", value: n(0.3) },
    ];
  } else if (seasonalPalType === "summerSmooth") {
    const LMAX = 0.94;
    const LMIN = 0.28;
    const CMAX = 0.24;
    const CMIN = 0.03;

    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    // --------------------------------------------
    // SUMMER HUE GRAVITY — pulls toward 220° cool
    // --------------------------------------------
    function pullCoolHue(h) {
      const target = 220; // blue-violet summer center
      const blend = 0.4; // strong pull for smoothness
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    // --------------------------------------------
    // BASE SUMMER TRANSFORM
    // Pre-soften, slightly lighten, cool-shift
    // --------------------------------------------
    const baseL = limit(oklch.l + 0.03, LMIN, LMAX); // soft lift
    const baseC = limit(oklch.c * 0.85, CMIN, CMAX); // soft-muted
    const baseH = pullCoolHue(oklch.h); // hue cooled

    // --------------------------------------------
    // SMOOTH FUNCTIONS
    // --------------------------------------------
    function smoothL(i) {
      // Soft descending L curve (misty → deep cool)
      // Slight S-curve ensures no banding
      const t = i / 9;
      const ease = t * t * (3 - 2 * t); // smoothstep
      return limit(baseL - ease * 0.2, LMIN, LMAX);
    }

    function smoothC(i) {
      // Gentle muting: almost flat but enough depth
      const t = i / 9;
      return limit(baseC - t * 0.1, CMIN, CMAX);
    }

    function smoothH(i) {
      // Hue drift: cool blue-violet → soft blueberry → dusty slate
      const start = baseH;
      const end = (baseH + 70) % 360;
      const t = i / 9;
      return (start * (1 - t) + end * t + 360) % 360;
    }

    // --------------------------------------------
    // FINAL PALETTE (10 smooth summer steps)
    // --------------------------------------------
    const out = [];
    for (let i = 0; i < 10; i++) {
      out.push({
        name: `Summer-Smooth-${i + 1}`,
        value: {
          l: smoothL(i),
          c: smoothC(i),
          h: smoothH(i),
        },
      });
    }

    return out;
  } else if (seasonalPalType === "winterIcyCrystal") {
    const LMAX = 0.95,
      LMIN = 0.12,
      CMAX = 0.32,
      CMIN = 0.04;

    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }
    function pullCoolHue(h) {
      const target = 260;
      const blend = 0.4;
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    // Pre-normalize
    const baseL = limit(oklch.l + 0.02, LMIN, LMAX); // slight lift
    const baseC = limit(oklch.c * 1.1, CMIN, CMAX); // boost clarity
    const baseH = pullCoolHue(oklch.h);

    function variant(offsetH, cMul, lShift) {
      const h = (baseH + offsetH + 360) % 360;
      const c = limit(baseC * cMul, CMIN, CMAX);
      const l = limit(baseL + lShift, LMIN, LMAX);
      return { l, c, h };
    }
    function neutral(l, hueShift = 10) {
      return {
        l: limit(l, LMIN, LMAX),
        c: CMIN * 0.6,
        h: (baseH + hueShift + 360) % 360,
      };
    }

    return [
      { name: "TW-A-1", value: variant(+0, 1.15, +0.04) },
      { name: "TW-A-2", value: variant(+12, 1.12, +0.02) },
      { name: "TW-A-3", value: variant(+28, 1.08, +0.0) },
      { name: "TW-A-4", value: variant(+44, 1.02, -0.02) },
      { name: "TW-A-5", value: variant(+64, 0.98, -0.04) },
      { name: "TW-A-6", value: variant(+86, 0.94, -0.06) },
      { name: "TW-A-7", value: variant(+110, 0.9, -0.08) },

      { name: "TW-A-Neutral-1", value: neutral(0.78, +8) },
      { name: "TW-A-Neutral-2", value: neutral(0.62, +18) },
      { name: "TW-A-Neutral-3", value: neutral(0.44, +28) },
    ];
  } else if (seasonalPalType === "winterStarkMonochrome") {
    const LMAX = 0.95,
      LMIN = 0.12,
      CMAX = 0.32,
      CMIN = 0.04;

    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }
    function pullCoolHue(h) {
      const target = 260;
      const blend = 0.4;
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    const baseL = limit(oklch.l - 0.1, LMIN, LMAX); // darker base for contrast
    const baseC = limit(oklch.c * 0.65, CMIN, CMAX); // more muted chroma for graphic blacks/blues
    const baseH = pullCoolHue(oklch.h);

    function variant(offsetH, lShift) {
      const h = (baseH + offsetH + 360) % 360;
      const c = baseC; // keep chroma stable for monochrome feel
      const l = limit(baseL + lShift, LMIN, LMAX);
      return { l, c, h };
    }
    function neutral(l, hueShift = 0) {
      return {
        l: limit(l, LMIN, LMAX),
        c: CMIN * 0.3,
        h: (baseH + hueShift + 360) % 360,
      };
    }

    return [
      { name: "TW-C-1", value: variant(+0, +0.22) },
      { name: "TW-C-2", value: variant(+12, +0.18) },
      { name: "TW-C-3", value: variant(+28, +0.14) },
      { name: "TW-C-4", value: variant(+44, +0.08) },
      { name: "TW-C-5", value: variant(+64, +0.02) },
      { name: "TW-C-6", value: variant(+86, -0.04) },
      { name: "TW-C-7", value: variant(+110, -0.09) },

      { name: "TW-C-Neutral-1", value: neutral(0.92, +0) },
      { name: "TW-C-Neutral-2", value: neutral(0.6, +0) },
      { name: "TW-C-Neutral-3", value: neutral(0.3, +0) },
    ];
  } else if (seasonalPalType === "winterFrostedBerry") {
    const LMAX = 0.95,
      LMIN = 0.12,
      CMAX = 0.32,
      CMIN = 0.04;

    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }
    function pullCoolHue(h) {
      const target = 260;
      const blend = 0.4;
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    const baseL = limit(oklch.l + 0.0, LMIN, LMAX);
    const baseC = limit(oklch.c * 1.2, CMIN, CMAX);
    const baseH = pullCoolHue(oklch.h);

    function variant(offsetH, cMul, lShift) {
      const h = (baseH + offsetH + 360) % 360;
      const c = limit(baseC * cMul, CMIN, CMAX);
      const l = limit(baseL + lShift, LMIN, LMAX);
      return { l, c, h };
    }
    function neutral(l, hueShift = 12) {
      return {
        l: limit(l, LMIN, LMAX),
        c: CMIN * 0.7,
        h: (baseH + hueShift + 360) % 360,
      };
    }

    return [
      { name: "TW-D-1", value: variant(-18, 1.1, +0.04) },
      { name: "TW-D-2", value: variant(+0, 1.15, +0.02) },
      { name: "TW-D-3", value: variant(+22, 1.2, +0.0) },
      { name: "TW-D-4", value: variant(+44, 1.1, -0.02) },
      { name: "TW-D-5", value: variant(+66, 1.05, -0.04) },
      { name: "TW-D-6", value: variant(+88, 1.0, -0.06) },
      { name: "TW-D-7", value: variant(+110, 0.95, -0.08) },

      { name: "TW-D-Neutral-1", value: neutral(0.72, +10) },
      { name: "TW-D-Neutral-2", value: neutral(0.56, +18) },
      { name: "TW-D-Neutral-3", value: neutral(0.4, +26) },
    ];
  } else if (seasonalPalType === "winterVividCandy") {
    const LMAX = 0.95,
      LMIN = 0.12,
      CMAX = 0.32,
      CMIN = 0.04;

    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }
    function pullCoolHue(h) {
      const target = 260;
      const blend = 0.4;
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    const baseL = limit(oklch.l + 0.06, LMIN, LMAX); // brighten
    const baseC = limit(oklch.c * 1.25, CMIN, CMAX); // brighter but bounded
    const baseH = pullCoolHue(oklch.h);

    function variant(offsetH, cMul, lShift) {
      const h = (baseH + offsetH + 360) % 360;
      const c = limit(baseC * cMul, CMIN, CMAX);
      const l = limit(baseL + lShift, LMIN, LMAX);
      return { l, c, h };
    }
    function neutral(l, hueShift = 8) {
      return {
        l: limit(l, LMIN, LMAX),
        c: CMIN * 0.6,
        h: (baseH + hueShift + 360) % 360,
      };
    }

    return [
      { name: "BW-A-1", value: variant(+0, 1.2, +0.04) },
      { name: "BW-A-2", value: variant(+20, 1.15, +0.02) },
      { name: "BW-A-3", value: variant(+40, 1.1, +0.0) },
      { name: "BW-A-4", value: variant(+60, 1.05, -0.02) },
      { name: "BW-A-5", value: variant(+80, 1.0, -0.04) },
      { name: "BW-A-6", value: variant(+100, 0.95, -0.06) },
      { name: "BW-A-7", value: variant(+120, 0.9, -0.08) },

      { name: "BW-A-Neutral-1", value: neutral(0.76, +10) },
      { name: "BW-A-Neutral-2", value: neutral(0.6, +18) },
      { name: "BW-A-Neutral-3", value: neutral(0.44, +26) },
    ];
  } else if (seasonalPalType === "winterCrispTechnicolor") {
    const LMAX = 0.95,
      LMIN = 0.12,
      CMAX = 0.32,
      CMIN = 0.04;

    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }
    function pullCoolHue(h) {
      const target = 260;
      const blend = 0.4;
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    const baseL = limit(oklch.l + 0.02, LMIN, LMAX);
    const baseC = limit(oklch.c * 1.35, CMIN, CMAX);
    const baseH = pullCoolHue(oklch.h);

    function variant(offsetH, cMul, lShift) {
      const h = (baseH + offsetH + 360) % 360;
      const c = limit(baseC * cMul, CMIN, CMAX);
      const l = limit(baseL + lShift, LMIN, LMAX);
      return { l, c, h };
    }
    function neutral(l, hueShift = 12) {
      return {
        l: limit(l, LMIN, LMAX),
        c: CMIN * 0.7,
        h: (baseH + hueShift + 360) % 360,
      };
    }

    return [
      { name: "BW-B-1", value: variant(+0, 1.3, +0.02) },
      { name: "BW-B-2", value: variant(+25, 1.25, +0.01) },
      { name: "BW-B-3", value: variant(+50, 1.2, -0.01) },
      { name: "BW-B-4", value: variant(+75, 1.1, -0.03) },
      { name: "BW-B-5", value: variant(+100, 1.0, -0.05) },
      { name: "BW-B-6", value: variant(+125, 0.95, -0.07) },
      { name: "BW-B-7", value: variant(+150, 0.9, -0.09) },

      { name: "BW-B-Neutral-1", value: neutral(0.7, +12) },
      { name: "BW-B-Neutral-2", value: neutral(0.56, +20) },
      { name: "BW-B-Neutral-3", value: neutral(0.42, +28) },
    ];
  } else if (seasonalPalType === "winterSnowlightPastels") {
    const LMAX = 0.95,
      LMIN = 0.12,
      CMAX = 0.32,
      CMIN = 0.04;

    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }
    function pullCoolHue(h) {
      const target = 260;
      const blend = 0.4;
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    const baseL = limit(oklch.l + 0.08, LMIN, LMAX); // very light base
    const baseC = limit(oklch.c * 0.9, CMIN, CMAX); // moderate chroma to keep pastels cool
    const baseH = pullCoolHue(oklch.h);

    function variant(offsetH, lShift) {
      const h = (baseH + offsetH + 360) % 360;
      const c = baseC;
      const l = limit(baseL + lShift, LMIN, LMAX);
      return { l, c, h };
    }
    function neutral(l, hueShift = 6) {
      return {
        l: limit(l, LMIN, LMAX),
        c: CMIN * 0.5,
        h: (baseH + hueShift + 360) % 360,
      };
    }

    return [
      { name: "BW-C-1", value: variant(+0, +0.06) },
      { name: "BW-C-2", value: variant(+15, +0.04) },
      { name: "BW-C-3", value: variant(+35, +0.02) },
      { name: "BW-C-4", value: variant(+50, +0.0) },
      { name: "BW-C-5", value: variant(+70, -0.02) },
      { name: "BW-C-6", value: variant(+90, -0.04) },
      { name: "BW-C-7", value: variant(+110, -0.06) },

      { name: "BW-C-Neutral-1", value: neutral(0.88, +8) },
      { name: "BW-C-Neutral-2", value: neutral(0.7, +16) },
      { name: "BW-C-Neutral-3", value: neutral(0.52, +24) },
    ];
  } else if (seasonalPalType === "winterNightJewel") {
    const LMAX = 0.95,
      LMIN = 0.12,
      CMAX = 0.32,
      CMIN = 0.04;

    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }
    function pullCoolHue(h) {
      const target = 260;
      const blend = 0.4;
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    const baseL = limit(oklch.l - 0.1, LMIN, LMAX); // deepen
    const baseC = limit(oklch.c * 1.2, CMIN, CMAX); // richer without exceeding CMAX
    const baseH = pullCoolHue(oklch.h);

    function variant(offsetH, cMul, lShift) {
      const h = (baseH + offsetH + 360) % 360;
      const c = limit(baseC * cMul, CMIN, CMAX);
      const l = limit(baseL + lShift, LMIN, LMAX);
      return { l, c, h };
    }
    function neutral(l, hueShift = 16) {
      return {
        l: limit(l, LMIN, LMAX),
        c: CMIN * 0.7,
        h: (baseH + hueShift + 360) % 360,
      };
    }

    return [
      { name: "DW-A-1", value: variant(+0, 1.2, -0.02) },
      { name: "DW-A-2", value: variant(+18, 1.15, -0.06) },
      { name: "DW-A-3", value: variant(+36, 1.1, -0.08) },
      { name: "DW-A-4", value: variant(+58, 1.05, -0.1) },
      { name: "DW-A-5", value: variant(+82, 1.0, -0.12) },
      { name: "DW-A-6", value: variant(+108, 0.95, -0.14) },
      { name: "DW-A-7", value: variant(+136, 0.9, -0.16) },

      { name: "DW-A-Neutral-1", value: neutral(0.5, +12) },
      { name: "DW-A-Neutral-2", value: neutral(0.38, +20) },
      { name: "DW-A-Neutral-3", value: neutral(0.26, +28) },
    ];
  } else if (seasonalPalType === "winterUrbanNoir") {
    const LMAX = 0.95,
      LMIN = 0.12,
      CMAX = 0.32,
      CMIN = 0.04;

    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }
    function pullCoolHue(h) {
      const target = 260;
      const blend = 0.4;
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    const baseL = limit(oklch.l - 0.14, LMIN, LMAX); // strong deepen
    const baseC = limit(oklch.c * 0.8, CMIN, CMAX); // more muted chroma for noir
    const baseH = pullCoolHue(oklch.h);

    function variant(offsetH, lShift) {
      const h = (baseH + offsetH + 360) % 360;
      const c = baseC;
      const l = limit(baseL + lShift, LMIN, LMAX);
      return { l, c, h };
    }
    function neutral(l, hueShift = 12) {
      return {
        l: limit(l, LMIN, LMAX),
        c: CMIN * 0.35,
        h: (baseH + hueShift + 360) % 360,
      };
    }

    return [
      { name: "DW-B-1", value: variant(+0, +0.18) },
      { name: "DW-B-2", value: variant(+20, +0.14) },
      { name: "DW-B-3", value: variant(+40, +0.1) },
      { name: "DW-B-4", value: variant(+65, +0.06) },
      { name: "DW-B-5", value: variant(+90, +0.0) },
      { name: "DW-B-6", value: variant(+120, -0.04) },
      { name: "DW-B-7", value: variant(+150, -0.08) },

      { name: "DW-B-Neutral-1", value: neutral(0.56, +10) },
      { name: "DW-B-Neutral-2", value: neutral(0.4, +18) },
      { name: "DW-B-Neutral-3", value: neutral(0.26, +26) },
    ];
  } else if (seasonalPalType === "winterSmooth") {
    const LMAX = 0.97;
    const LMIN = 0.1;
    const CMAX = 0.4;
    const CMIN = 0.08;

    // ----------------------------
    // UTIL: clamp
    // ----------------------------
    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    // ----------------------------
    // HUE GRAVITY — pulls *any* hue toward Winter cool anchor (~260°)
    // ----------------------------
    function pullCoolHue(h) {
      const target = 260; // icy blue-violet
      const blend = 0.4;
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    // ----------------------------
    // PRE-NORMALIZE BASE COLOR
    // Winter needs deeper + clearer
    // ----------------------------
    const baseL = limit(oklch.l - 0.04, LMIN, LMAX); // slight darken
    const baseC = limit(oklch.c * 1.1, CMIN, CMAX); // small increase in clarity
    const baseH = pullCoolHue(oklch.h); // shift to winter coolness

    // ----------------------------
    // SMOOTH CURVES
    // ----------------------------

    // L: smoothly descends (dark → deeper → night shades)
    function smoothL(i) {
      return limit(baseL - i * 0.065, LMIN, LMAX);
    }

    // C: slightly increases then decreases for shimmering clarity
    function smoothC(i) {
      // light bell-shaped clarity pattern
      const up = baseC + 0.02 * Math.sin((i / 9) * Math.PI);
      return limit(up, CMIN, CMAX);
    }

    // H: sweep cool hues — violet → indigo → blue → teal
    function smoothH(i) {
      const start = baseH;
      const end = (baseH + 140) % 360; // wide cool arc
      const t = i / 9;
      return (start * (1 - t) + end * t + 360) % 360;
    }

    // ----------------------------
    // BUILD 10 COLORS
    // ----------------------------
    const out = [];

    for (let i = 0; i < 10; i++) {
      out.push({
        name: `Winter-Smooth-${i + 1}`,
        value: {
          l: smoothL(i),
          c: smoothC(i),
          h: smoothH(i),
        },
      });
    }

    return out;
  } else if (seasonalPalType === "springWarmGentle") {
    const LMAX = 0.95,
      LMIN = 0.3;
    const CMAX = 0.26,
      CMIN = 0.04;

    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    function pullWarmHue(h) {
      const target = 85; // Soft Spring warm yellow
      const blend = 0.3;
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    const baseL = limit(oklch.l + 0.08, LMIN, LMAX);
    const baseC = limit(oklch.c * 0.9, CMIN, CMAX);
    const baseH = pullWarmHue(oklch.h);

    function variant(offsetH, cMul, lShift) {
      return {
        h: (baseH + offsetH + 360) % 360,
        c: limit(baseC * cMul, CMIN, CMAX),
        l: limit(baseL + lShift, LMIN, LMAX),
      };
    }

    function neutral(l, hueShift = 15) {
      return {
        l: limit(l, LMIN, LMAX),
        c: CMIN * 0.4,
        h: (baseH + hueShift + 360) % 360,
      };
    }

    return [
      { name: "Soft-Spring-A-1", value: variant(+5, 1.05, +0.02) },
      { name: "Soft-Spring-A-2", value: variant(+15, 1.1, +0.01) },
      { name: "Soft-Spring-A-3", value: variant(+30, 1.0, +0.0) },
      { name: "Soft-Spring-A-4", value: variant(+50, 0.95, -0.02) },
      { name: "Soft-Spring-A-5", value: variant(+70, 0.9, -0.03) },
      { name: "Soft-Spring-A-6", value: variant(+90, 0.85, -0.05) },
      { name: "Soft-Spring-A-7", value: variant(+110, 0.8, -0.07) },

      { name: "Soft-Spring-A-Neutral-1", value: neutral(0.72) },
      { name: "Soft-Spring-A-Neutral-2", value: neutral(0.6, +20) },
      { name: "Soft-Spring-A-Neutral-3", value: neutral(0.48, +25) },
    ];
  } else if (seasonalPalType === "springWarmMuted") {
    const LMAX = 0.92,
      LMIN = 0.28;
    const CMAX = 0.22,
      CMIN = 0.03;

    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    function pullWarmHue(h) {
      const target = 85;
      const blend = 0.25;
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    const baseL = limit(oklch.l + 0.06, LMIN, LMAX);
    const baseC = limit(oklch.c * 0.8, CMIN, CMAX);
    const baseH = pullWarmHue(oklch.h);

    function variant(oH, cMul, lShift) {
      return {
        h: (baseH + oH + 360) % 360,
        c: limit(baseC * cMul, CMIN, CMAX),
        l: limit(baseL + lShift, LMIN, LMAX),
      };
    }

    function neutral(l, hS = 15) {
      return {
        l: limit(l, LMIN, LMAX),
        c: CMIN * 0.4,
        h: (baseH + hS + 360) % 360,
      };
    }

    return [
      { name: "Soft-Spring-B-1", value: variant(+10, 1.0, +0.02) },
      { name: "Soft-Spring-B-2", value: variant(+25, 0.95, +0.01) },
      { name: "Soft-Spring-B-3", value: variant(+40, 0.9, 0.0) },
      { name: "Soft-Spring-B-4", value: variant(+60, 0.85, -0.02) },
      { name: "Soft-Spring-B-5", value: variant(+80, 0.8, -0.03) },
      { name: "Soft-Spring-B-6", value: variant(+95, 0.75, -0.05) },
      { name: "Soft-Spring-B-7", value: variant(+115, 0.7, -0.06) },

      { name: "Soft-Spring-B-Neutral-1", value: neutral(0.7) },
      { name: "Soft-Spring-B-Neutral-2", value: neutral(0.58, +20) },
      { name: "Soft-Spring-B-Neutral-3", value: neutral(0.46, +25) },
    ];
  } else if (seasonalPalType === "springWarmEarthy") {
    const LMAX = 0.92,
      LMIN = 0.25;
    const CMAX = 0.24,
      CMIN = 0.03;

    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    function pullWarmHue(h) {
      const target = 90; // more botanical spring
      const blend = 0.3;
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    const baseL = limit(oklch.l + 0.04, LMIN, LMAX);
    const baseC = limit(oklch.c * 0.85, CMIN, CMAX);
    const baseH = pullWarmHue(oklch.h);

    function variant(oH, cMul, lShift) {
      return {
        h: (baseH + oH + 360) % 360,
        c: limit(baseC * cMul, CMIN, CMAX),
        l: limit(baseL + lShift, LMIN, LMAX),
      };
    }

    function neutral(l, hS = 20) {
      return {
        l: limit(l, LMIN, LMAX),
        c: CMIN * 0.45,
        h: (baseH + hS + 360) % 360,
      };
    }

    return [
      { name: "Soft-Spring-C-1", value: variant(+8, 1.0, +0.01) },
      { name: "Soft-Spring-C-2", value: variant(+25, 0.95, 0.0) },
      { name: "Soft-Spring-C-3", value: variant(+40, 0.9, -0.01) },
      { name: "Soft-Spring-C-4", value: variant(+60, 0.88, -0.03) },
      { name: "Soft-Spring-C-5", value: variant(+82, 0.85, -0.04) },
      { name: "Soft-Spring-C-6", value: variant(+105, 0.8, -0.06) },
      { name: "Soft-Spring-C-7", value: variant(+125, 0.75, -0.07) },

      { name: "Soft-Spring-C-Neutral-1", value: neutral(0.68) },
      { name: "Soft-Spring-C-Neutral-2", value: neutral(0.55, +25) },
      { name: "Soft-Spring-C-Neutral-3", value: neutral(0.43, +28) },
    ];
  } else if (seasonalPalType === "springWarmFresh") {
    const LMAX = 0.96,
      LMIN = 0.32;
    const CMAX = 0.34,
      CMIN = 0.06;

    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    function pullWarmHue(h) {
      const target = 90;
      const blend = 0.35;
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    const baseL = limit(oklch.l + 0.1, LMIN, LMAX);
    const baseC = limit(oklch.c * 1.05, CMIN, CMAX);
    const baseH = pullWarmHue(oklch.h);

    function variant(oH, cMul, lShift) {
      return {
        h: (baseH + oH + 360) % 360,
        c: limit(baseC * cMul, CMIN, CMAX),
        l: limit(baseL + lShift, LMIN, LMAX),
      };
    }

    function neutral(l, hS = 20) {
      return {
        l: limit(l, LMIN, LMAX),
        c: CMIN * 0.5,
        h: (baseH + hS + 360) % 360,
      };
    }

    return [
      { name: "True-Spring-A-1", value: variant(+5, 1.1, +0.02) },
      { name: "True-Spring-A-2", value: variant(+20, 1.15, +0.01) },
      { name: "True-Spring-A-3", value: variant(+40, 1.2, 0.0) },
      { name: "True-Spring-A-4", value: variant(+65, 1.1, -0.02) },
      { name: "True-Spring-A-5", value: variant(+90, 1.0, -0.03) },
      { name: "True-Spring-A-6", value: variant(+115, 0.95, -0.05) },
      { name: "True-Spring-A-7", value: variant(+135, 0.9, -0.06) },

      { name: "True-Spring-A-Neutral-1", value: neutral(0.75) },
      { name: "True-Spring-A-Neutral-2", value: neutral(0.62, +25) },
      { name: "True-Spring-A-Neutral-3", value: neutral(0.48, +30) },
    ];
  } else if (seasonalPalType === "springMutedEarthy") {
    const LMAX = 0.92;
    const LMIN = 0.35;
    const CMAX = 0.22;
    const CMIN = 0.03;

    // --------------------------------------------
    // UTIL: Clamp
    // --------------------------------------------
    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    // --------------------------------------------
    // Warm hue gravity (~85° = warm golden/leafy spring)
    // --------------------------------------------
    function pullWarmHue(h) {
      const target = 85; // soft warm spring anchor (yellow-green)
      const blend = 0.3; // gentle warm pull
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    // --------------------------------------------
    // PRE-NORMALIZE Spring base
    // --------------------------------------------
    const baseL = limit(oklch.l + 0.05, LMIN, LMAX); // Slight brighten
    const baseC = limit(oklch.c * 0.85, CMIN, CMAX); // More muted than typical spring
    const baseH = pullWarmHue(oklch.h); // Warm shift

    // --------------------------------------------
    // Variant builder
    // --------------------------------------------
    function variant(offsetH, cMul, lShift) {
      const h = (baseH + offsetH + 360) % 360;
      const c = limit(baseC * cMul, CMIN, CMAX);
      const l = limit(baseL + lShift, LMIN, LMAX);
      return { l, c, h };
    }

    // --------------------------------------------
    // Earthy Neutrals
    // --------------------------------------------
    function neutral(l, hueShift = 25) {
      return {
        l: limit(l, LMIN, LMAX),
        c: CMIN * 0.6, // very muted
        h: (baseH + hueShift + 360) % 360,
      };
    }

    // --------------------------------------------
    // FINAL Soft Spring C Palette
    // --------------------------------------------
    return [
      { name: "SoftSpringC-1", value: variant(+5, 1.1, -0.02) },
      { name: "SoftSpringC-2", value: variant(+20, 1.0, -0.05) },
      { name: "SoftSpringC-3", value: variant(+40, 0.95, -0.08) },
      { name: "SoftSpringC-4", value: variant(+65, 0.9, -0.1) },
      { name: "SoftSpringC-5", value: variant(+90, 0.85, -0.04) },
      { name: "SoftSpringC-6", value: variant(+120, 0.88, -0.12) },
      { name: "SoftSpringC-7", value: variant(+150, 0.82, -0.15) },

      { name: "SoftSpringC-Neutral-1", value: neutral(0.7, +20) },
      { name: "SoftSpringC-Neutral-2", value: neutral(0.55, +28) },
      { name: "SoftSpringC-Neutral-3", value: neutral(0.42, +35) },
    ];
  } else if (seasonalPalType === "springWarmBright") {
    const LMAX = 0.96,
      LMIN = 0.32;
    const CMAX = 0.34,
      CMIN = 0.06;

    // safe clamp
    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    // hue gravity: pull toward warm spring (~90°)
    function pullWarmHue(h) {
      const target = 90; // warm yellow/leaf pivot
      const blend = 0.35; // gentle pull
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    // Pre-normalize base color (lighten slightly, small chroma boost, warm shift)
    const baseL = limit(oklch.l + 0.03, LMIN, LMAX);
    const baseC = limit(oklch.c * 1.05, CMIN, CMAX);
    const baseH = pullWarmHue(oklch.h);

    // variant builder: offset hue, multiply chroma, shift lightness
    function variant(offsetH, cMul, lShift) {
      const h = (baseH + offsetH + 360) % 360;
      const c = limit(baseC * cMul, CMIN, CMAX);
      const l = limit(baseL + lShift, LMIN, LMAX);
      return { l, c, h };
    }

    // neutral builder: near-grays with warm bias
    function neutral(l, hueShift = 18) {
      return {
        l: limit(l, LMIN, LMAX),
        c: CMIN * 0.5,
        h: (baseH + hueShift + 360) % 360,
      };
    }

    return [
      { name: "TrueSpringA-1", value: variant(+5, 1.1, +0.02) },
      { name: "TrueSpringA-2", value: variant(+18, 1.15, +0.03) },
      { name: "TrueSpringA-3", value: variant(+35, 1.2, +0.04) },
      { name: "TrueSpringA-4", value: variant(+52, 1.1, +0.02) },
      { name: "TrueSpringA-5", value: variant(+72, 1.0, +0.0) },
      { name: "TrueSpringA-6", value: variant(+92, 0.95, -0.03) },
      { name: "TrueSpringA-7", value: variant(+112, 0.9, -0.06) },

      { name: "TrueSpringA-Neutral-1", value: neutral(0.78, +12) },
      { name: "TrueSpringA-Neutral-2", value: neutral(0.62, +20) },
      { name: "TrueSpringA-Neutral-3", value: neutral(0.48, +28) },
    ];
  } else if (seasonalPalType === "springWarmRich") {
    const LMAX = 0.95,
      LMIN = 0.3;
    const CMAX = 0.38,
      CMIN = 0.06;

    // --------------------------------------------
    // UTIL: clamp
    // --------------------------------------------
    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    // --------------------------------------------
    // HUE GRAVITY: pulls hues to warm Spring center (~95°)
    // --------------------------------------------
    function pullWarmHue(h) {
      const target = 95; // warm yellow-green / golden-light center
      const blend = 0.38; // slightly stronger pull than True Spring A
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    // --------------------------------------------
    // BASE COLOR PRE-NORMALIZATION
    // - slightly lighter (Spring brightness)
    // - chroma boosted (rich tones)
    // - hue warmed
    // --------------------------------------------
    const baseL = limit(oklch.l + 0.05, LMIN, LMAX);
    const baseC = limit(oklch.c * 1.12, CMIN, CMAX);
    const baseH = pullWarmHue(oklch.h);

    // --------------------------------------------
    // Variant generator
    // --------------------------------------------
    function variant(offsetH, cMul, lShift) {
      const h = (baseH + offsetH + 360) % 360;
      const c = limit(baseC * cMul, CMIN, CMAX);
      const l = limit(baseL + lShift, LMIN, LMAX);
      return { l, c, h };
    }

    // --------------------------------------------
    // Warm Neutrals (soft but warm-biased)
    // --------------------------------------------
    function neutral(l, hueShift = 20) {
      return {
        l: limit(l, LMIN, LMAX),
        c: CMIN * 0.55,
        h: (baseH + hueShift + 360) % 360,
      };
    }

    // --------------------------------------------
    // FINAL 10-COLOR PALETTE
    // --------------------------------------------
    return [
      { name: "TrueSpringB-1", value: variant(+5, 1.2, +0.03) },
      { name: "TrueSpringB-2", value: variant(+22, 1.25, +0.04) },
      { name: "TrueSpringB-3", value: variant(+38, 1.18, +0.02) },
      { name: "TrueSpringB-4", value: variant(+58, 1.12, +0.0) },
      { name: "TrueSpringB-5", value: variant(+80, 1.05, -0.02) },
      { name: "TrueSpringB-6", value: variant(+102, 1.0, -0.03) },
      { name: "TrueSpringB-7", value: variant(+128, 0.92, -0.06) },

      { name: "TrueSpringB-Neutral-1", value: neutral(0.76, +10) },
      { name: "TrueSpringB-Neutral-2", value: neutral(0.6, +20) },
      { name: "TrueSpringB-Neutral-3", value: neutral(0.46, +28) },
    ];
  } else if (seasonalPalType === "springWarmRadiant") {
    const LMAX = 0.98,
      LMIN = 0.4;
    const CMAX = 0.4,
      CMIN = 0.06;

    // --------------------------------------------
    // UTIL — clamp
    // --------------------------------------------
    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    // --------------------------------------------
    // HUE GRAVITY — strongest warm upward pull
    // Radiant = more golden
    // --------------------------------------------
    function pullWarmHue(h) {
      const target = 90; // radiant golden hue
      const blend = 0.4; // strong gravity, but not overpowering
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    // --------------------------------------------
    // BASE NORMALIZATION — Radiant Spring = warm + bright + clear
    // --------------------------------------------
    const baseL = limit(oklch.l + 0.12, LMIN, LMAX); // strong brightness
    const baseC = limit(oklch.c * 1.18, CMIN, CMAX); // clear, glowy chroma
    const baseH = pullWarmHue(oklch.h);

    // --------------------------------------------
    // VARIANTS — high clarity + warm radiance
    // --------------------------------------------
    function variant(offsetH, cMul, lShift) {
      return {
        h: (baseH + offsetH + 360) % 360,
        c: limit(baseC * cMul, CMIN, CMAX),
        l: limit(baseL + lShift, LMIN, LMAX),
      };
    }

    // --------------------------------------------
    // Warm, radiant neutrals — golden creams + warm sand
    // --------------------------------------------
    function neutral(l, hueShift = 12) {
      return {
        l: limit(l, LMIN, LMAX),
        c: CMIN * 0.55,
        h: (baseH + hueShift + 360) % 360,
      };
    }

    // --------------------------------------------
    // FINAL 10-COLOR PALETTE
    // --------------------------------------------
    return [
      { name: "TrueSpringD-1", value: variant(+4, 1.22, +0.06) },
      { name: "TrueSpringD-2", value: variant(+18, 1.25, +0.05) },
      { name: "TrueSpringD-3", value: variant(+36, 1.18, +0.04) },
      { name: "TrueSpringD-4", value: variant(+55, 1.12, +0.02) },
      { name: "TrueSpringD-5", value: variant(+78, 1.08, +0.01) },
      { name: "TrueSpringD-6", value: variant(+100, 1.02, -0.02) },
      { name: "TrueSpringD-7", value: variant(+125, 0.95, -0.04) },

      { name: "TrueSpringD-Neutral-1", value: neutral(0.82, +10) },
      { name: "TrueSpringD-Neutral-2", value: neutral(0.7, +16) },
      { name: "TrueSpringD-Neutral-3", value: neutral(0.56, +22) },
    ];
  } else if (seasonalPalType === "springSmooth") {
    const LMAX = 0.94,
      LMIN = 0.38;
    const CMAX = 0.26,
      CMIN = 0.05;

    // --------------------------------------------
    // UTIL — clamp
    // --------------------------------------------
    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    // --------------------------------------------
    // HUE GRAVITY — warm, gentle spring anchor
    // --------------------------------------------
    function pullWarmHue(h) {
      const target = 85; // warm peachy spring anchor
      const blend = 0.32; // soft, gentle, not intense
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    // --------------------------------------------
    // BASE NORMALIZATION — soften, warm, smooth
    // --------------------------------------------
    const baseL = limit(oklch.l + 0.04, LMIN, LMAX); // slight brightness
    const baseC = limit(oklch.c * 0.82, CMIN, CMAX); // softened chroma
    const baseH = pullWarmHue(oklch.h); // warm blending

    // --------------------------------------------
    // VARIANT — smooth hue glide + soft chroma shifts
    // --------------------------------------------
    function variant(offsetH, cMul, lShift) {
      return {
        h: (baseH + offsetH + 360) % 360,
        c: limit(baseC * cMul, CMIN, CMAX),
        l: limit(baseL + lShift, LMIN, LMAX),
      };
    }

    // --------------------------------------------
    // NEUTRALS — buttery creams + soft warm sands
    // --------------------------------------------
    function neutral(l, hueShift = 10) {
      return {
        l: limit(l, LMIN, LMAX),
        c: CMIN * 0.55,
        h: (baseH + hueShift + 360) % 360,
      };
    }

    // --------------------------------------------
    // FINAL 10-COLOR PALETTE
    // --------------------------------------------
    return [
      { name: "SmoothSpring-1", value: variant(+6, 1.05, +0.05) },
      { name: "SmoothSpring-2", value: variant(+20, 1.08, +0.04) },
      { name: "SmoothSpring-3", value: variant(+38, 1.1, +0.03) },
      { name: "SmoothSpring-4", value: variant(+60, 1.04, +0.01) },
      { name: "SmoothSpring-5", value: variant(+82, 0.98, 0.0) },
      { name: "SmoothSpring-6", value: variant(+100, 0.92, -0.02) },
      { name: "SmoothSpring-7", value: variant(+125, 0.88, -0.03) },

      { name: "SmoothSpring-Neutral-1", value: neutral(0.78, +8) },
      { name: "SmoothSpring-Neutral-2", value: neutral(0.66, +12) },
      { name: "SmoothSpring-Neutral-3", value: neutral(0.52, +16) },
    ];
  }
}

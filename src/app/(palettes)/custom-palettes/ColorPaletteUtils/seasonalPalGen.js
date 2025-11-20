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
  } else if (seasonalPalType === "autumnTrueVibrantSpicy") {
    const LMAX = 0.95,
      LMIN = 0.25;
    const CMAX = 0.4,
      CMIN = 0.06; // more chroma allowed

    function limit(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    // Strong warm pull: saffron/orange/gold zone
    function pullWarmHue(h) {
      const target = 52; // spicy golden-orange
      const blend = 0.33; // moderate pull
      return (h * (1 - blend) + target * blend + 360) % 360;
    }

    // Base transform (vibrant = bright, rich, lively)
    const baseL = limit(oklch.l - 0.02, LMIN, LMAX); // slight darken only
    const baseC = limit(oklch.c * 1.25, CMIN, CMAX); // significantly richer
    const baseH = pullWarmHue(oklch.h);

    // Generate spicy variants
    function variant(offsetH, cMul, lShift) {
      return {
        h: (baseH + offsetH + 360) % 360,
        c: limit(baseC * cMul, CMIN, CMAX),
        l: limit(baseL + lShift, LMIN, LMAX),
      };
    }

    // Warm neutrals with spice tint
    function neutral(l, hueShift = 10) {
      return {
        l: limit(l, LMIN, LMAX),
        c: CMIN * 0.65,
        h: (baseH + hueShift + 360) % 360,
      };
    }

    // Final 10-color Vibrant/Spicy palette
    return [
      // FIERY + SPICY RANGE
      { name: "True-D-1", value: variant(+8, 1.25, -0.02) }, // saffron
      { name: "True-D-2", value: variant(+20, 1.3, -0.05) }, // turmeric
      { name: "True-D-3", value: variant(+38, 1.2, -0.03) }, // paprika
      { name: "True-D-4", value: variant(+55, 1.1, -0.06) }, // cinnamon
      { name: "True-D-5", value: variant(+80, 1.0, -0.04) }, // cayenne/rust
      { name: "True-D-6", value: variant(+105, 0.92, -0.08) }, // warm rust-brown
      { name: "True-D-7", value: variant(+130, 0.85, -0.1) }, // spicy olive-brown

      // SPICED NEUTRALS
      { name: "True-D-Neutral-1", value: neutral(0.72, +12) }, // warm almond
      { name: "True-D-Neutral-2", value: neutral(0.6, +18) }, // golden beige
      { name: "True-D-Neutral-3", value: neutral(0.47, +25) }, // warm caramel taupe
    ];
  }
}

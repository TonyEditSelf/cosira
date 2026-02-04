/**
 * Improved Complementary Palette Generator
 * Balances user control (sliders) with palette character constraints
 * Uses "soft constraints" instead of hard overrides
 */

function gamutMap(oklch) {
  const { l, c, h } = oklch;

  function oklchToRgb(l, c, h) {
    const a = c * Math.cos((h * Math.PI) / 180);
    const b = c * Math.sin((h * Math.PI) / 180);

    const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = l - 0.0894841775 * a - 1.291485548 * b;

    const l3 = l_ * l_ * l_;
    const m3 = m_ * m_ * m_;
    const s3 = s_ * s_ * s_;

    const r_lin = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
    const g_lin = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
    const b_lin = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

    return {
      r: r_lin,
      g: g_lin,
      b: b_lin,
      inGamut:
        r_lin >= 0 &&
        r_lin <= 1 &&
        g_lin >= 0 &&
        g_lin <= 1 &&
        b_lin >= 0 &&
        b_lin <= 1,
    };
  }

  let testRgb = oklchToRgb(l, c, h);
  if (testRgb.inGamut) {
    return { l, c, h };
  }

  let cMin = 0;
  let cMax = c;
  let cResult = c;

  for (let i = 0; i < 15; i++) {
    const cTest = (cMin + cMax) / 2;
    testRgb = oklchToRgb(l, cTest, h);

    if (testRgb.inGamut) {
      cMin = cTest;
      cResult = cTest;
    } else {
      cMax = cTest;
    }
  }

  return { l, c: cResult, h };
}

/**
 * Soft constraint helper - nudges value toward target range without hard override
 * @param {number} value - User's input value
 * @param {number} min - Ideal minimum for this palette
 * @param {number} max - Ideal maximum for this palette
 * @param {number} strength - How strongly to enforce (0 = no enforcement, 1 = hard clamp)
 */
function softConstrain(value, min, max, strength = 0.5) {
  if (value < min) {
    const distance = min - value;
    return value + distance * strength;
  }
  if (value > max) {
    const distance = value - max;
    return value - distance * strength;
  }
  return value;
}

export default function complementaryPalGen(oklch, compPalType) {
  // ============================================================================
  // CLASSIC COMPLEMENTARY - Balanced, timeless color harmony
  // ============================================================================
  if (compPalType === "classic") {
    // Classic accepts ANY user input - no constraints
    const baseColor = gamutMap(oklch);

    const base900 = gamutMap({
      ...baseColor,
      l: baseColor.l * 0.35,
      c: baseColor.c * 1.2,
    });
    const base700 = gamutMap({
      ...baseColor,
      l: baseColor.l * 0.65,
      c: baseColor.c * 1.1,
    });
    const base500 = baseColor;
    const base300 = gamutMap({
      ...baseColor,
      l: baseColor.l + (0.95 - baseColor.l) * 0.45,
      c: baseColor.c * 0.9,
    });
    const base100 = gamutMap({
      ...baseColor,
      l: baseColor.l + (0.95 - baseColor.l) * 0.75,
      c: baseColor.c * 0.7,
    });

    const compColor = gamutMap({
      l: baseColor.l,
      c: baseColor.c,
      h: (baseColor.h + 180) % 360,
    });

    const comp900 = gamutMap({
      ...compColor,
      l: compColor.l * 0.35,
      c: compColor.c * 1.2,
    });
    const comp700 = gamutMap({
      ...compColor,
      l: compColor.l * 0.65,
      c: compColor.c * 1.1,
    });
    const comp500 = compColor;
    const comp300 = gamutMap({
      ...compColor,
      l: compColor.l + (0.95 - compColor.l) * 0.45,
      c: compColor.c * 0.9,
    });
    const comp100 = gamutMap({
      ...compColor,
      l: compColor.l + (0.95 - compColor.l) * 0.75,
      c: compColor.c * 0.7,
    });

    const neutral = gamutMap({ l: 0.5, c: 0.02, h: baseColor.h });
    const neutralLight = gamutMap({ l: 0.96, c: 0.01, h: baseColor.h });

    return [
      { name: "Base-900", value: base900 },
      { name: "Base-700", value: base700 },
      { name: "Base-500", value: base500 },
      { name: "Base-300", value: base300 },
      { name: "Base-100", value: base100 },
      { name: "Neutral", value: neutral },
      { name: "Neutral-Light", value: neutralLight },
      { name: "Comp-100", value: comp100 },
      { name: "Comp-300", value: comp300 },
      { name: "Comp-500", value: comp500 },
      { name: "Comp-700", value: comp700 },
      { name: "Comp-900", value: comp900 },
    ];
  }

  // ============================================================================
  // VIBRANT - High energy, maximum saturation, playful contrast
  // ============================================================================
  else if (compPalType === "vibrant") {
    // Vibrant: Softly encourage bright L and high C, but respect user input
    const baseColor = gamutMap({
      l: softConstrain(oklch.l, 0.55, 0.75, 0.4), // gentle nudge toward vibrant range
      c: Math.max(oklch.c * 0.8, 0.15), // boost chroma if too low, but use user's if already high
      h: oklch.h, // always respect hue
    });

    const base900 = gamutMap({
      ...baseColor,
      l: baseColor.l - 0.32,
      c: baseColor.c * 1.15,
    });
    const base700 = gamutMap({
      ...baseColor,
      l: baseColor.l - 0.18,
      c: baseColor.c * 1.08,
    });
    const base500 = baseColor;
    const base300 = gamutMap({
      ...baseColor,
      l: baseColor.l + 0.16,
      c: baseColor.c * 0.95,
    });
    const base100 = gamutMap({
      ...baseColor,
      l: baseColor.l + 0.28,
      c: baseColor.c * 0.8,
    });

    const compColor = gamutMap({
      l: baseColor.l,
      c: baseColor.c * 1.05,
      h: (baseColor.h + 180) % 360,
    });

    const comp900 = gamutMap({
      ...compColor,
      l: compColor.l - 0.32,
      c: compColor.c * 1.15,
    });
    const comp700 = gamutMap({
      ...compColor,
      l: compColor.l - 0.18,
      c: compColor.c * 1.08,
    });
    const comp500 = compColor;
    const comp300 = gamutMap({
      ...compColor,
      l: compColor.l + 0.16,
      c: compColor.c * 0.95,
    });
    const comp100 = gamutMap({
      ...compColor,
      l: compColor.l + 0.28,
      c: compColor.c * 0.8,
    });

    const accent1 = gamutMap({ l: 0.7, c: 0.25, h: (baseColor.h + 30) % 360 });
    const accent2 = gamutMap({
      l: 0.68,
      c: 0.24,
      h: (compColor.h - 30 + 360) % 360,
    });

    return [
      { name: "Base-900", value: base900 },
      { name: "Base-700", value: base700 },
      { name: "Base-500", value: base500 },
      { name: "Base-300", value: base300 },
      { name: "Base-100", value: base100 },
      { name: "Accent-1", value: accent1 },
      { name: "Accent-2", value: accent2 },
      { name: "Comp-100", value: comp100 },
      { name: "Comp-300", value: comp300 },
      { name: "Comp-500", value: comp500 },
      { name: "Comp-700", value: comp700 },
      { name: "Comp-900", value: comp900 },
    ];
  }

  // ============================================================================
  // MUTED - Sophisticated, desaturated, elegant restraint
  // ============================================================================
  else if (compPalType === "muted") {
    // Muted: Encourage lower chroma and mid-range lightness
    const baseColor = gamutMap({
      l: softConstrain(oklch.l, 0.4, 0.65, 0.5),
      c: Math.min(oklch.c, 0.16), // cap maximum chroma but allow full range below
      h: oklch.h,
    });

    const base900 = gamutMap({
      l: baseColor.l * 0.65,
      c: baseColor.c * 1.25,
      h: (baseColor.h - 6 + 360) % 360,
    });
    const base700 = gamutMap({
      l: baseColor.l * 0.82,
      c: baseColor.c * 1.12,
      h: (baseColor.h - 3 + 360) % 360,
    });
    const base500 = baseColor;
    const base300 = gamutMap({
      l: baseColor.l + (0.72 - baseColor.l) * 0.5,
      c: baseColor.c * 0.88,
      h: (baseColor.h + 2) % 360,
    });
    const base100 = gamutMap({
      l: baseColor.l + (0.72 - baseColor.l) * 0.85,
      c: baseColor.c * 0.65,
      h: (baseColor.h + 4) % 360,
    });

    const compColor = gamutMap({
      l: baseColor.l * 0.94,
      c: baseColor.c * 0.9,
      h: (baseColor.h + 170) % 360,
    });

    const comp900 = gamutMap({
      l: compColor.l * 0.62,
      c: compColor.c * 1.28,
      h: (compColor.h - 8 + 360) % 360,
    });
    const comp700 = gamutMap({
      l: compColor.l * 0.8,
      c: compColor.c * 1.14,
      h: (compColor.h - 4 + 360) % 360,
    });
    const comp500 = compColor;
    const comp300 = gamutMap({
      l: compColor.l + (0.72 - compColor.l) * 0.52,
      c: compColor.c * 0.86,
      h: (compColor.h + 3) % 360,
    });
    const comp100 = gamutMap({
      l: compColor.l + (0.72 - compColor.l) * 0.88,
      c: compColor.c * 0.62,
      h: (compColor.h + 5) % 360,
    });

    const warmNeutral = gamutMap({
      l: 0.56,
      c: 0.04,
      h: (baseColor.h - 10 + 360) % 360,
    });
    const coolNeutral = gamutMap({
      l: 0.88,
      c: 0.03,
      h: (compColor.h + 10) % 360,
    });

    return [
      { name: "Base-900", value: base900 },
      { name: "Base-700", value: base700 },
      { name: "Base-500", value: base500 },
      { name: "Base-300", value: base300 },
      { name: "Base-100", value: base100 },
      { name: "Warm-Neutral", value: warmNeutral },
      { name: "Cool-Neutral", value: coolNeutral },
      { name: "Comp-100", value: comp100 },
      { name: "Comp-300", value: comp300 },
      { name: "Comp-500", value: comp500 },
      { name: "Comp-700", value: comp700 },
      { name: "Comp-900", value: comp900 },
    ];
  }

  // ============================================================================
  // PASTEL - Soft, dreamy, high lightness with gentle saturation
  // ============================================================================
  else if (compPalType === "pastel") {
    // Pastel: Strong nudge toward high L, low C (but still allow some movement)
    const baseColor = gamutMap({
      l: softConstrain(oklch.l, 0.75, 0.88, 0.6) + 0.1, // add offset + nudge
      c: Math.min(oklch.c * 0.6, 0.14), // reduce chroma significantly
      h: oklch.h,
    });

    const base900 = gamutMap({
      l: baseColor.l * 0.82,
      c: baseColor.c * 1.15,
      h: (baseColor.h - 2 + 360) % 360,
    });
    const base700 = gamutMap({
      l: baseColor.l * 0.91,
      c: baseColor.c * 1.08,
      h: (baseColor.h - 1 + 360) % 360,
    });
    const base500 = baseColor;
    const base300 = gamutMap({
      l: baseColor.l + (0.94 - baseColor.l) * 0.5,
      c: baseColor.c * 0.92,
      h: (baseColor.h + 1) % 360,
    });
    const base100 = gamutMap({
      l: baseColor.l + (0.94 - baseColor.l) * 0.85,
      c: baseColor.c * 0.75,
      h: (baseColor.h + 2) % 360,
    });

    const compColor = gamutMap({
      l: baseColor.l * 0.98,
      c: baseColor.c * 0.96,
      h: (baseColor.h + 180) % 360,
    });

    const comp900 = gamutMap({
      l: compColor.l * 0.82,
      c: compColor.c * 1.15,
      h: (compColor.h - 2 + 360) % 360,
    });
    const comp700 = gamutMap({
      l: compColor.l * 0.91,
      c: compColor.c * 1.08,
      h: (compColor.h - 1 + 360) % 360,
    });
    const comp500 = compColor;
    const comp300 = gamutMap({
      l: compColor.l + (0.94 - compColor.l) * 0.5,
      c: compColor.c * 0.92,
      h: (compColor.h + 1) % 360,
    });
    const comp100 = gamutMap({
      l: compColor.l + (0.94 - compColor.l) * 0.85,
      c: compColor.c * 0.75,
      h: (compColor.h + 2) % 360,
    });

    const accent1 = gamutMap({ l: 0.84, c: 0.1, h: (baseColor.h + 60) % 360 });
    const accent2 = gamutMap({
      l: 0.82,
      c: 0.09,
      h: (compColor.h - 60 + 360) % 360,
    });

    return [
      { name: "Base-900", value: base900 },
      { name: "Base-700", value: base700 },
      { name: "Base-500", value: base500 },
      { name: "Base-300", value: base300 },
      { name: "Base-100", value: base100 },
      { name: "Accent-1", value: accent1 },
      { name: "Accent-2", value: accent2 },
      { name: "Comp-100", value: comp100 },
      { name: "Comp-300", value: comp300 },
      { name: "Comp-500", value: comp500 },
      { name: "Comp-700", value: comp700 },
      { name: "Comp-900", value: comp900 },
    ];
  }

  // ============================================================================
  // DARK - Dramatic, moody, low-key lighting
  // ============================================================================
  else if (compPalType === "dark") {
    // Dark: Encourage lower lightness but allow chroma variation
    const baseColor = gamutMap({
      l: softConstrain(oklch.l, 0.28, 0.5, 0.5),
      c: Math.min(oklch.c, 0.2), // cap but allow full range below
      h: oklch.h,
    });

    const base900 = gamutMap({
      l: baseColor.l * 0.48,
      c: baseColor.c * 1.35,
      h: (baseColor.h - 8 + 360) % 360,
    });
    const base700 = gamutMap({
      l: baseColor.l * 0.72,
      c: baseColor.c * 1.18,
      h: (baseColor.h - 4 + 360) % 360,
    });
    const base500 = baseColor;
    const base300 = gamutMap({
      l: baseColor.l + (0.62 - baseColor.l) * 0.55,
      c: baseColor.c * 0.88,
      h: (baseColor.h + 2) % 360,
    });
    const base100 = gamutMap({
      l: baseColor.l + (0.62 - baseColor.l) * 0.9,
      c: baseColor.c * 0.68,
      h: (baseColor.h + 4) % 360,
    });

    const compColor = gamutMap({
      l: baseColor.l * 0.85,
      c: baseColor.c * 0.95,
      h: (baseColor.h + 180) % 360,
    });

    const comp900 = gamutMap({
      l: compColor.l * 0.42,
      c: compColor.c * 1.4,
      h: (compColor.h - 10 + 360) % 360,
    });
    const comp700 = gamutMap({
      l: compColor.l * 0.68,
      c: compColor.c * 1.22,
      h: (compColor.h - 5 + 360) % 360,
    });
    const comp500 = compColor;
    const comp300 = gamutMap({
      l: compColor.l + (0.62 - compColor.l) * 0.6,
      c: compColor.c * 0.85,
      h: (compColor.h + 3) % 360,
    });
    const comp100 = gamutMap({
      l: compColor.l + (0.62 - compColor.l) * 0.95,
      c: compColor.c * 0.65,
      h: (compColor.h + 5) % 360,
    });

    const shadow = gamutMap({
      l: 0.18,
      c: 0.04,
      h: (baseColor.h - 15 + 360) % 360,
    });
    const highlight = gamutMap({
      l: 0.72,
      c: 0.08,
      h: (compColor.h + 10) % 360,
    });

    return [
      { name: "Base-900", value: base900 },
      { name: "Base-700", value: base700 },
      { name: "Base-500", value: base500 },
      { name: "Base-300", value: base300 },
      { name: "Base-100", value: base100 },
      { name: "Shadow", value: shadow },
      { name: "Highlight", value: highlight },
      { name: "Comp-100", value: comp100 },
      { name: "Comp-300", value: comp300 },
      { name: "Comp-500", value: comp500 },
      { name: "Comp-700", value: comp700 },
      { name: "Comp-900", value: comp900 },
    ];
  }

  // ============================================================================
  // NEON - Electric, cyberpunk, maximum saturation
  // ============================================================================
  else if (compPalType === "neon") {
    // Neon: Boost both L and C toward "electric" range
    const baseColor = gamutMap({
      l: softConstrain(oklch.l, 0.6, 0.78, 0.4),
      c: Math.max(oklch.c * 1.2, 0.2), // boost chroma
      h: oklch.h,
    });

    const base900 = gamutMap({
      l: baseColor.l * 0.48,
      c: baseColor.c * 1.18,
      h: (baseColor.h - 3 + 360) % 360,
    });
    const base700 = gamutMap({
      l: baseColor.l * 0.72,
      c: baseColor.c * 1.1,
      h: (baseColor.h - 1.5 + 360) % 360,
    });
    const base500 = baseColor;
    const base300 = gamutMap({
      l: baseColor.l + (0.88 - baseColor.l) * 0.5,
      c: baseColor.c * 0.98,
      h: (baseColor.h + 1.5) % 360,
    });
    const base100 = gamutMap({
      l: baseColor.l + (0.88 - baseColor.l) * 0.82,
      c: baseColor.c * 0.88,
      h: (baseColor.h + 3) % 360,
    });

    const compColor = gamutMap({
      l: baseColor.l,
      c: baseColor.c * 1.08,
      h: (baseColor.h + 180) % 360,
    });

    const comp900 = gamutMap({
      l: compColor.l * 0.48,
      c: compColor.c * 1.18,
      h: (compColor.h + 3) % 360,
    });
    const comp700 = gamutMap({
      l: compColor.l * 0.72,
      c: compColor.c * 1.1,
      h: (compColor.h + 1.5) % 360,
    });
    const comp500 = compColor;
    const comp300 = gamutMap({
      l: compColor.l + (0.88 - compColor.l) * 0.5,
      c: compColor.c * 0.98,
      h: (compColor.h - 1.5 + 360) % 360,
    });
    const comp100 = gamutMap({
      l: compColor.l + (0.88 - compColor.l) * 0.82,
      c: compColor.c * 0.88,
      h: (compColor.h - 3 + 360) % 360,
    });

    const accent1 = gamutMap({ l: 0.75, c: 0.3, h: (baseColor.h + 25) % 360 });
    const accent2 = gamutMap({
      l: 0.73,
      c: 0.29,
      h: (compColor.h - 25 + 360) % 360,
    });

    return [
      { name: "Base-900", value: base900 },
      { name: "Base-700", value: base700 },
      { name: "Base-500", value: base500 },
      { name: "Base-300", value: base300 },
      { name: "Base-100", value: base100 },
      { name: "Accent-1", value: accent1 },
      { name: "Accent-2", value: accent2 },
      { name: "Comp-100", value: comp100 },
      { name: "Comp-300", value: comp300 },
      { name: "Comp-500", value: comp500 },
      { name: "Comp-700", value: comp700 },
      { name: "Comp-900", value: comp900 },
    ];
  }

  // ============================================================================
  // NATURAL - Organic lighting simulation
  // ============================================================================
  else if (compPalType === "natural") {
    // Natural: No L/C constraints, just apply organic lighting transforms
    const baseColor = gamutMap(oklch);

    const base900 = gamutMap({
      l: baseColor.l * 0.38,
      c: baseColor.c * 1.22,
      h: (baseColor.h - 12 + 360) % 360,
    });
    const base700 = gamutMap({
      l: baseColor.l * 0.68,
      c: baseColor.c * 1.1,
      h: (baseColor.h - 6 + 360) % 360,
    });
    const base500 = baseColor;
    const base300 = gamutMap({
      l: baseColor.l + (0.92 - baseColor.l) * 0.45,
      c: baseColor.c * 0.88,
      h: (baseColor.h + 4) % 360,
    });
    const base100 = gamutMap({
      l: baseColor.l + (0.92 - baseColor.l) * 0.78,
      c: baseColor.c * 0.68,
      h: (baseColor.h + 8) % 360,
    });

    const compColor = gamutMap({
      l: baseColor.l * 0.96,
      c: baseColor.c * 0.92,
      h: (baseColor.h + 180) % 360,
    });

    const comp900 = gamutMap({
      l: compColor.l * 0.36,
      c: compColor.c * 1.25,
      h: (compColor.h - 14 + 360) % 360,
    });
    const comp700 = gamutMap({
      l: compColor.l * 0.66,
      c: compColor.c * 1.12,
      h: (compColor.h - 7 + 360) % 360,
    });
    const comp500 = compColor;
    const comp300 = gamutMap({
      l: compColor.l + (0.92 - compColor.l) * 0.48,
      c: compColor.c * 0.86,
      h: (compColor.h + 5) % 360,
    });
    const comp100 = gamutMap({
      l: compColor.l + (0.92 - compColor.l) * 0.8,
      c: compColor.c * 0.65,
      h: (compColor.h + 10) % 360,
    });

    const earthWarm = gamutMap({
      l: 0.48,
      c: 0.08,
      h: (baseColor.h - 25 + 360) % 360,
    });
    const earthCool = gamutMap({
      l: 0.82,
      c: 0.06,
      h: (compColor.h + 20) % 360,
    });

    return [
      { name: "Base-900", value: base900 },
      { name: "Base-700", value: base700 },
      { name: "Base-500", value: base500 },
      { name: "Base-300", value: base300 },
      { name: "Base-100", value: base100 },
      { name: "Earth-Warm", value: earthWarm },
      { name: "Earth-Cool", value: earthCool },
      { name: "Comp-100", value: comp100 },
      { name: "Comp-300", value: comp300 },
      { name: "Comp-500", value: comp500 },
      { name: "Comp-700", value: comp700 },
      { name: "Comp-900", value: comp900 },
    ];
  }

  // ============================================================================
  // CINEMATIC - Film-inspired orange/teal
  // ============================================================================
  else if (compPalType === "cinematic") {
    // Cinematic: Gentle nudge toward mid-range, cap chroma
    const baseColor = gamutMap({
      l: softConstrain(oklch.l, 0.45, 0.68, 0.3),
      c: Math.min(oklch.c, 0.22),
      h: oklch.h,
    });

    const base900 = gamutMap({
      l: baseColor.l * 0.58,
      c: baseColor.c * 1.15,
      h: (baseColor.h - 8 + 360) % 360,
    });
    const base700 = gamutMap({
      l: baseColor.l * 0.78,
      c: baseColor.c * 1.08,
      h: (baseColor.h - 4 + 360) % 360,
    });
    const base500 = baseColor;
    const base300 = gamutMap({
      l: baseColor.l + (0.75 - baseColor.l) * 0.5,
      c: baseColor.c * 0.95,
      h: (baseColor.h + 3) % 360,
    });
    const base100 = gamutMap({
      l: baseColor.l + (0.75 - baseColor.l) * 0.85,
      c: baseColor.c * 0.78,
      h: (baseColor.h + 6) % 360,
    });

    const compColor = gamutMap({
      l: baseColor.l * 0.82,
      c: baseColor.c * 0.88,
      h: (baseColor.h + 180) % 360,
    });

    const comp900 = gamutMap({
      l: compColor.l * 0.52,
      c: compColor.c * 1.22,
      h: (compColor.h - 10 + 360) % 360,
    });
    const comp700 = gamutMap({
      l: compColor.l * 0.75,
      c: compColor.c * 1.12,
      h: (compColor.h - 5 + 360) % 360,
    });
    const comp500 = compColor;
    const comp300 = gamutMap({
      l: compColor.l + (0.75 - compColor.l) * 0.55,
      c: compColor.c * 0.92,
      h: (compColor.h + 4) % 360,
    });
    const comp100 = gamutMap({
      l: compColor.l + (0.75 - compColor.l) * 0.88,
      c: compColor.c * 0.75,
      h: (compColor.h + 7) % 360,
    });

    const midtone = gamutMap({ l: 0.5, c: 0.03, h: (baseColor.h + 15) % 360 });
    const highlight = gamutMap({
      l: 0.88,
      c: 0.04,
      h: (baseColor.h + 20) % 360,
    });

    return [
      { name: "Base-900", value: base900 },
      { name: "Base-700", value: base700 },
      { name: "Base-500", value: base500 },
      { name: "Base-300", value: base300 },
      { name: "Base-100", value: base100 },
      { name: "Midtone", value: midtone },
      { name: "Highlight", value: highlight },
      { name: "Comp-100", value: comp100 },
      { name: "Comp-300", value: comp300 },
      { name: "Comp-500", value: comp500 },
      { name: "Comp-700", value: comp700 },
      { name: "Comp-900", value: comp900 },
    ];
  }

  // ============================================================================
  // NEUTRAL - Near-achromatic with subtle hue bias
  // ============================================================================
  else if (compPalType === "neutral") {
    // Neutral: Force very low chroma, but allow L to vary freely
    const baseColor = gamutMap({
      l: oklch.l, // user controls lightness fully
      c: Math.min(oklch.c * 0.3, 0.08), // drastically reduce chroma
      h: oklch.h, // preserve hue bias
    });

    const base900 = gamutMap({
      l: baseColor.l * 0.3,
      c: baseColor.c * 1.4,
      h: (baseColor.h - 4 + 360) % 360,
    });
    const base700 = gamutMap({
      l: baseColor.l * 0.6,
      c: baseColor.c * 1.2,
      h: (baseColor.h - 2 + 360) % 360,
    });
    const base500 = baseColor;
    const base300 = gamutMap({
      l: baseColor.l + (0.96 - baseColor.l) * 0.45,
      c: baseColor.c * 0.85,
      h: (baseColor.h + 1) % 360,
    });
    const base100 = gamutMap({
      l: baseColor.l + (0.96 - baseColor.l) * 0.75,
      c: baseColor.c * 0.6,
      h: (baseColor.h + 2) % 360,
    });

    const compColor = gamutMap({
      l: baseColor.l,
      c: baseColor.c * 0.92,
      h: (baseColor.h + 180) % 360,
    });

    const comp900 = gamutMap({
      l: compColor.l * 0.3,
      c: compColor.c * 1.4,
      h: (compColor.h - 4 + 360) % 360,
    });
    const comp700 = gamutMap({
      l: compColor.l * 0.6,
      c: compColor.c * 1.2,
      h: (compColor.h - 2 + 360) % 360,
    });
    const comp500 = compColor;
    const comp300 = gamutMap({
      l: compColor.l + (0.96 - compColor.l) * 0.45,
      c: compColor.c * 0.85,
      h: (compColor.h + 1) % 360,
    });
    const comp100 = gamutMap({
      l: compColor.l + (0.96 - compColor.l) * 0.75,
      c: compColor.c * 0.6,
      h: (compColor.h + 2) % 360,
    });

    const black = gamutMap({ l: 0.18, c: 0.0, h: 0 });
    const white = gamutMap({ l: 0.98, c: 0.0, h: 0 });

    return [
      { name: "Black", value: black },
      { name: "Base-900", value: base900 },
      { name: "Base-700", value: base700 },
      { name: "Base-500", value: base500 },
      { name: "Base-300", value: base300 },
      { name: "Base-100", value: base100 },
      { name: "Comp-100", value: comp100 },
      { name: "Comp-300", value: comp300 },
      { name: "Comp-500", value: comp500 },
      { name: "Comp-700", value: comp700 },
      { name: "Comp-900", value: comp900 },
      { name: "White", value: white },
    ];
  }

  // Default to classic
  return complementaryPalGen(oklch, "classic");
}

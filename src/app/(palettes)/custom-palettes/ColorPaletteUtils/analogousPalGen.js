import { clampToGamut } from "./gamutMapping";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// ─────────────────────────────────────────────────────────────────
// CHROMA COMPENSATION
// OKLCH chroma is perceptually uneven across hues.
// This corrects for that so equal C values look equally saturated.
// ─────────────────────────────────────────────────────────────────
function getChromaCompensation(hue) {
  const h = ((hue % 360) + 360) % 360;
  if (h >= 30 && h < 90) return 1.15; // Yellow: genuinely needs more
  if (h >= 90 && h < 150) return 1.0; // Green: balanced
  if (h >= 150 && h < 210) return 0.85; // Cyan: naturally very strong
  if (h >= 210 && h < 270) return 0.95; // Blue: naturally saturated
  if (h >= 270 && h < 330) return 1.1; // Magenta: needs boost
  return 1.05; // Red: slight boost
}

// ─────────────────────────────────────────────────────────────────
// PROBLEM HUE DETECTION
// Yellow-green (hue 80–110°) is notoriously muddy in OKLCH.
// Detect it and apply corrective chroma reduction + slight hue push.
// ─────────────────────────────────────────────────────────────────
function getProblemHueCorrection(hue) {
  const h = ((hue % 360) + 360) % 360;
  if (h >= 80 && h < 110) {
    const centerDist = h - 95;
    return {
      hShift: centerDist > 0 ? 8 : -8, // push away from muddy center
      cScale: 0.82, // this range can't hold much chroma
    };
  }
  return { hShift: 0, cScale: 1.0 };
}

// ─────────────────────────────────────────────────────────────────
// PER-TYPE CHROMA CURVES
//
// This replaces flat cScale values. Each palette type has a genuinely
// different chroma curve across its tonal stops — not just a ceiling.
//
//   vibrant — chroma stays rich all the way through; slight peak at dark
//   muted   — stays consistently flat; almost no variation across stops
//   earthy  — peaks at dark (like soil/bark), drops sharply in lights
//             (earth tones are rich in shadow, bleached in highlight)
//   pastel  — inverted: lights hold MORE chroma than darks
//             (pastels are defined by their light chromatic quality)
//
// stop: "darker" | "dark" | "base" | "light"
// baseC: the role-adjusted base chroma for this hue
// ─────────────────────────────────────────────────────────────────
function getChromaForStop(paletteType, stop, baseC) {
  switch (paletteType) {
    case "vibrant":
      // Stays rich; slight peak at dark, gentle fade at light
      return baseC * { darker: 1.05, dark: 1.1, base: 1.0, light: 0.78 }[stop];

    case "muted":
      // Nearly flat — the whole point is consistent calm
      return baseC * { darker: 1.02, dark: 1.04, base: 1.0, light: 0.94 }[stop];

    case "earthy":
      // Chroma peaks at dark stop, then falls sharply toward light.
      // This matches how natural earth tones actually behave —
      // rich and saturated in shadow, pale and dusty in highlight.
      return baseC * { darker: 1.08, dark: 1.22, base: 1.0, light: 0.52 }[stop];

    case "pastel":
      // Inverted curve — lights are the chromatic soul of pastels.
      // Dark stops in pastels are surprisingly desaturated (almost grey).
      return baseC * { darker: 0.72, dark: 0.88, base: 1.0, light: 1.14 }[stop];

    default:
      return baseC;
  }
}

// ─────────────────────────────────────────────────────────────────
// PALETTE TYPE CONFIGS
//
// Each type has a distinct design character:
//   vibrant — maximum gamut, richest chroma, full lightness range
//   muted   — low chroma ceiling, flat and calm, sophisticated
//   earthy  — warm hue bias, compressed lightness, natural feel
//   pastel  — very high lightness, low chroma, soft and airy
//
// stops: absolute lightness offsets (not proportional — guarantees
// full range regardless of where base L sits). Darks go warm,
// lights go cool — matching natural light/shadow behavior.
// cScale is now handled by getChromaForStop() above, not here.
// ─────────────────────────────────────────────────────────────────
const PALETTE_CONFIGS = {
  vibrant: {
    chromaMultiplier: 1.0,
    lightnessMin: 0.05,
    lightnessMax: 0.98,
    chromaMin: 0.0,
    chromaMax: 0.38,
    hueShift: 0,
    stops: {
      darker: { lOffset: -0.4, hShift: 14 },
      dark: { lOffset: -0.22, hShift: 8 },
      base: { lOffset: 0, hShift: 0 },
      light: { lOffset: 0.25, hShift: -10 },
    },
  },
  muted: {
    chromaMultiplier: 0.48,
    lightnessMin: 0.08,
    lightnessMax: 0.97,
    chromaMin: 0.01,
    chromaMax: 0.08,
    hueShift: 0,
    stops: {
      darker: { lOffset: -0.38, hShift: 10 },
      dark: { lOffset: -0.2, hShift: 5 },
      base: { lOffset: 0, hShift: 0 },
      light: { lOffset: 0.28, hShift: -8 },
    },
  },
  earthy: {
    chromaMultiplier: 0.62,
    lightnessMin: 0.06,
    lightnessMax: 0.86,
    chromaMin: 0.02,
    chromaMax: 0.22, // raised ceiling — peak at dark needs headroom
    hueShift: 10,
    stops: {
      darker: { lOffset: -0.34, hShift: 16 },
      dark: { lOffset: -0.18, hShift: 9 },
      base: { lOffset: 0, hShift: 0 },
      light: { lOffset: 0.22, hShift: -7 },
    },
  },
  pastel: {
    chromaMultiplier: 0.42,
    lightnessMin: 0.8,
    lightnessMax: 0.97,
    chromaMin: 0.03,
    chromaMax: 0.15, // raised ceiling — lights can be more chromatic
    hueShift: 0,
    stops: {
      darker: { lOffset: -0.14, hShift: 9 },
      dark: { lOffset: -0.07, hShift: 4 },
      base: { lOffset: 0, hShift: 0 },
      light: { lOffset: 0.05, hShift: -5 },
    },
  },
};

// ─────────────────────────────────────────────────────────────────
// DEFAULT ANGLES
// Wider than before — narrow spreads read as near-monochromatic.
// ─────────────────────────────────────────────────────────────────
export function getBaseAngles(palType) {
  if (palType.includes("earthy")) return { angle1: -30, angle2: 30 };
  if (palType.includes("muted")) return { angle1: -25, angle2: 25 };
  if (palType.includes("pastel")) return { angle1: -35, angle2: 35 };
  return { angle1: -40, angle2: 40 }; // vibrant — wide, clearly analogous
}

// ─────────────────────────────────────────────────────────────────
// HUE ROLE PERSONALITIES
//
// This is what makes it a real analogous generator, not just a
// hue-spread visualizer. The three hues are NOT equal — they have
// intentional roles with different L and C personalities:
//
//   dominant  (Base) — richest chroma, truest to input lightness.
//                      The hue that carries the palette.
//   supporting (A1)  — slightly lighter (+lAdjust), slightly less chroma.
//                      Recedes visually. Used for backgrounds, surfaces.
//   accent     (A2)  — slightly darker (-lAdjust), punchiest chroma.
//                      Used sparingly: CTAs, highlights, emphasis.
//
// Warm hues (reds, oranges, yellows) get a natural chroma boost
// because they carry more perceptual weight. Larger spreads produce
// more pronounced personality differences between the three hues.
// ─────────────────────────────────────────────────────────────────
function getHueRolePersonality(role, hue, spreadAngle) {
  const h = ((hue % 360) + 360) % 360;
  const isWarm = (h >= 0 && h < 70) || h >= 310;
  const warmBoost = isWarm ? 1.06 : 1.0;
  const spreadFactor = Math.min(Math.abs(spreadAngle) / 40, 1.5);

  switch (role) {
    case "dominant":
      return { lAdjust: 0, cAdjust: warmBoost };
    case "supporting":
      return {
        lAdjust: 0.04 + spreadFactor * 0.02,
        cAdjust: (0.88 - spreadFactor * 0.04) * warmBoost,
      };
    case "accent":
      return {
        lAdjust: -(0.03 + spreadFactor * 0.01),
        cAdjust: Math.min((1.08 + spreadFactor * 0.05) * warmBoost, 1.25),
      };
    default:
      return { lAdjust: 0, cAdjust: 1.0 };
  }
}

// ─────────────────────────────────────────────────────────────────
// PERCEPTUAL CONTRAST ENFORCEMENT
//
// Adjacent tonal stops must be visually distinct.
// After nudging lightness, chroma is re-clamped to gamut —
// fixing the bug where lightness changed but chroma was left stale.
// ─────────────────────────────────────────────────────────────────
function oklchLToLuminance(l) {
  return l <= 0.08 ? l / 9.033 : Math.pow((l + 0.16) / 1.16, 3);
}

function contrastRatio(l1, l2) {
  const y1 = oklchLToLuminance(Math.max(l1, l2));
  const y2 = oklchLToLuminance(Math.min(l1, l2));
  return (y1 + 0.05) / (y2 + 0.05);
}

const MIN_CONTRAST = 1.45;

function enforceContrast(stops, config) {
  const result = stops.map((s) => ({ ...s }));

  for (let i = 0; i < result.length - 1; i++) {
    const lower = result[i]; // darker stop
    const upper = result[i + 1]; // lighter stop
    let iter = 0;

    while (contrastRatio(upper.l, lower.l) < MIN_CONTRAST && iter < 25) {
      lower.l = clamp(
        lower.l - 0.012,
        config.lightnessMin,
        config.lightnessMax,
      );
      upper.l = clamp(
        upper.l + 0.012,
        config.lightnessMin,
        config.lightnessMax,
      );
      iter++;
    }

    // Re-clamp chroma after lightness shift — gamut boundary changed
    lower.c = clampToGamut(lower.l, lower.c, lower.h);
    upper.c = clampToGamut(upper.l, upper.c, upper.h);
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────
// SHADOW COHERENCE
//
// The darker stops across all three hues converge toward a shared
// warm dark tone. This makes shadows feel unified — like they all
// exist under the same light source. Strength 0.35 = subtle blend.
// ─────────────────────────────────────────────────────────────────
function applyShadowCoherence(darkerH, baseH, strength = 0.35) {
  const shadowHue = baseH + 15;
  const delta = ((shadowHue - darkerH + 540) % 360) - 180;
  return darkerH + delta * strength;
}

// ─────────────────────────────────────────────────────────────────
// HIGHLIGHT COHERENCE
//
// Light stops converge toward a shared cool highlight tone.
// Mirrors shadow coherence — highlights feel like one light source.
// ─────────────────────────────────────────────────────────────────
function applyHighlightCoherence(lightH, baseH, strength = 0.25) {
  const highlightHue = baseH - 10;
  const delta = ((highlightHue - lightH + 540) % 360) - 180;
  return lightH + delta * strength;
}

// ─────────────────────────────────────────────────────────────────
// COLOR CREATION
// Single point where problem-hue correction, chroma compensation,
// and gamut mapping all happen. Nothing else calls clampToGamut.
// ─────────────────────────────────────────────────────────────────
function createColor(l, c, h, config) {
  const phc = getProblemHueCorrection(h);
  const correctedH = h + phc.hShift;
  const correctedC = c * phc.cScale;
  const compensatedC = correctedC * getChromaCompensation(correctedH);

  const clampedL = clamp(l, config.lightnessMin, config.lightnessMax);
  const clampedC = clamp(compensatedC, config.chromaMin, config.chromaMax);
  const gamutSafeC = clampToGamut(clampedL, clampedC, correctedH);

  return {
    l: clampedL,
    c: gamutSafeC,
    h: ((correctedH % 360) + 360) % 360,
  };
}

// ─────────────────────────────────────────────────────────────────
// TONAL VARIANT GENERATION
//
// Generates the 4 stops (darker/dark/base/light) for one hue,
// incorporating:
//   - Role personality (L and C differ per dominant/supporting/accent)
//   - Shadow coherence on the darker stop
//   - Highlight coherence on the light stop
//   - Contrast enforcement with chroma recalculation
// ─────────────────────────────────────────────────────────────────
function generateVariants(
  baseL,
  baseC,
  baseH,
  config,
  paletteType,
  role,
  spreadAngle,
  globalBaseH,
) {
  const { stops } = config;
  const personality = getHueRolePersonality(role, baseH, spreadAngle);

  const roleL = clamp(
    baseL + personality.lAdjust,
    config.lightnessMin,
    config.lightnessMax,
  );
  const roleC = clamp(
    baseC * personality.cAdjust,
    config.chromaMin,
    config.chromaMax,
  );

  // Apply coherence to the extreme stops
  const coherentDarkerH = applyShadowCoherence(
    baseH + stops.darker.hShift,
    globalBaseH,
  );
  const coherentLightH = applyHighlightCoherence(
    baseH + stops.light.hShift,
    globalBaseH,
  );

  const rawStops = [
    {
      key: "darker",
      l: roleL + stops.darker.lOffset,
      c: getChromaForStop(paletteType, "darker", roleC),
      h: coherentDarkerH,
    },
    {
      key: "dark",
      l: roleL + stops.dark.lOffset,
      c: getChromaForStop(paletteType, "dark", roleC),
      h: baseH + stops.dark.hShift,
    },
    {
      key: "base",
      l: roleL,
      c: getChromaForStop(paletteType, "base", roleC),
      h: baseH,
    },
    {
      key: "light",
      l: roleL + stops.light.lOffset,
      c: getChromaForStop(paletteType, "light", roleC),
      h: coherentLightH,
    },
  ];

  const adjusted = enforceContrast(rawStops, config);

  const result = {};
  for (const stop of adjusted) {
    result[stop.key] = createColor(stop.l, stop.c, stop.h, config);
  }
  return result;
}

// ─────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────
function getPaletteType(analogPalType) {
  if (analogPalType.includes("earthy")) return "earthy";
  if (analogPalType.includes("muted")) return "muted";
  if (analogPalType.includes("pastel")) return "pastel";
  return "vibrant";
}

function getLayoutType(analogPalType) {
  if (analogPalType.includes("Left")) return "left";
  if (analogPalType.includes("Right")) return "right";
  return "centered";
}

function getAnalogousAngles(layout, angle1, angle2) {
  switch (layout) {
    case "left":
      return { a1: -(Math.abs(angle1) * 2), a2: -Math.abs(angle1) };
    case "right":
      return { a1: Math.abs(angle2), a2: Math.abs(angle2) * 2 };
    case "centered":
    default:
      return { a1: angle1, a2: angle2 };
  }
}

// Role assignment depends on layout — the "accent" hue is always the
// one furthest from base, supporting is always adjacent to base.
function getRoles(layout) {
  switch (layout) {
    case "left":
      // Base=rightmost dominant, A2=adjacent supporting, A1=far accent
      return { base: "dominant", a1: "accent", a2: "supporting" };
    case "right":
      // Base=leftmost dominant, A1=adjacent supporting, A2=far accent
      return { base: "dominant", a1: "supporting", a2: "accent" };
    case "centered":
    default:
      // Base=center dominant, A1=left supporting, A2=right accent
      return { base: "dominant", a1: "supporting", a2: "accent" };
  }
}

// ─────────────────────────────────────────────────────────────────
// PALETTE ASSEMBLY
// 12 colors: 4 tonal stops × 3 hues. Order depends on layout.
// Returns array of { name, value } — nothing else.
// ─────────────────────────────────────────────────────────────────
function assemblePalette(
  baseVariants,
  a1Variants,
  a2Variants,
  layout,
  prefix = "",
) {
  const createGroup = (variants, name) => [
    { name: `${prefix}${name}-DD`, value: variants.darker },
    { name: `${prefix}${name}-D`, value: variants.dark },
    { name: `${prefix}${name}`, value: variants.base },
    { name: `${prefix}${name}-L`, value: variants.light },
  ];

  switch (layout) {
    case "left":
      return [
        ...createGroup(a1Variants, "A1"),
        ...createGroup(a2Variants, "A2"),
        ...createGroup(baseVariants, "Base"),
      ];
    case "right":
      return [
        ...createGroup(baseVariants, "Base"),
        ...createGroup(a1Variants, "A1"),
        ...createGroup(a2Variants, "A2"),
      ];
    case "centered":
    default:
      return [
        ...createGroup(a1Variants, "A1"),
        ...createGroup(baseVariants, "Base"),
        ...createGroup(a2Variants, "A2"),
      ];
  }
}

// ─────────────────────────────────────────────────────────────────
// MAIN GENERATOR
// Returns array of { name, value } — 12 colors total.
// ─────────────────────────────────────────────────────────────────
export default function analogousPalGen(
  oklch,
  analogOptions,
  analogPalType,
  sliderLightValue = 0,
  sliderChromaValue = 0,
) {
  const paletteType = getPaletteType(analogPalType);
  const layout = getLayoutType(analogPalType);
  const config = PALETTE_CONFIGS[paletteType];
  const roles = getRoles(layout);

  const defaults = getBaseAngles(analogPalType);
  const angle1 = analogOptions?.analogousAngle1 ?? defaults.angle1;
  const angle2 = analogOptions?.analogousAngle2 ?? defaults.angle2;
  const angles = getAnalogousAngles(layout, angle1, angle2);

  const baseL = clamp(
    oklch.l + sliderLightValue,
    config.lightnessMin,
    config.lightnessMax,
  );
  const baseC = clamp(
    (oklch.c + sliderChromaValue) * config.chromaMultiplier,
    config.chromaMin,
    config.chromaMax,
  );
  const baseH = (((oklch.h + config.hueShift) % 360) + 360) % 360;

  const a1H = (baseH + angles.a1 + 360) % 360;
  const a2H = (baseH + angles.a2 + 360) % 360;

  // globalBaseH is the shared reference for shadow + highlight coherence
  // so all three hues converge toward the same warm dark / cool light
  const baseVariants = generateVariants(
    baseL,
    baseC,
    baseH,
    config,
    paletteType,
    roles.base,
    0,
    baseH,
  );
  const a1Variants = generateVariants(
    baseL,
    baseC,
    a1H,
    config,
    paletteType,
    roles.a1,
    angles.a1,
    baseH,
  );
  const a2Variants = generateVariants(
    baseL,
    baseC,
    a2H,
    config,
    paletteType,
    roles.a2,
    angles.a2,
    baseH,
  );

  const prefix = paletteType === "pastel" ? "Pastel-" : "";
  return assemblePalette(baseVariants, a1Variants, a2Variants, layout, prefix);
}

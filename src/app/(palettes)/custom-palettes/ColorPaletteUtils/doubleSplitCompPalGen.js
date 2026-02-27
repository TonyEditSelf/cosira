// doubleSplitCompPalGen.js
//
// Generates a 15-color double-split-complementary palette from a base OKLCH color.
//
// A double-split-comp uses 5 hues derived from one base:
//   H1 = base
//   H2 = base + splitAngle   (analog warm)
//   H3 = base − splitAngle   (analog cool)
//   H4 = base + 180 + splitAngle  (comp split warm)
//   H5 = base + 180 − splitAngle  (comp split cool)
//
// Each hue gets 3 lightness steps (Light / Mid / Dark) = 15 slots total.
// All 5 groups use the same ±STEP offsets from base L — no arbitrary per-group
// L offsets that create bottom-heavy or unbalanced distributions.
//
// API:
//   doubleSplitCompPalGen(oklch, type?)   type defaults to "balanced"
//
// Output shape (15 items):
//   [ { name: "Base-L", value: {l,c,h} }, ... ]

import { clampColorToGamut } from "./gamutMapping";

// =============================================================================
// HELPERS
// =============================================================================

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const hmod = (h) => ((h % 360) + 360) % 360;

// =============================================================================
// VARIANT CONFIGS
// =============================================================================
//
// Key design decisions per config:
//   splitAngle   — degrees from base/comp to each split. Same value used for
//                  both sides so the hue scheme stays geometrically symmetric.
//   baseZone     — [min, max] that baseL is clamped to before applying ±STEP,
//                  guaranteeing distinct L values even for extreme inputs.
//   STEP         — additive L step. darkL = baseL − STEP, lightL = baseL + STEP.
//   CMAX/CFLOOR  — hard chroma ceiling and perceptual floor.
//   chromaBoost  — scales input chroma. Uses sqrt curve so low inputs get a
//                  proportional lift without destroying their character.
//   chromaVariation — bell-curve intensity: 0 = flat chroma, 0.20 = strong peak
//                     at L=0.55. Passed to adaptC() for every slot.
//   chromaDark   — fraction of base chroma applied to dark slots.
//   chromaLight  — fraction of base chroma applied to light slots.
//   hueWarmShift — (vintage only) global hue rotation applied before all calcs.

const VARIANTS = {
  balanced: {
    splitAngle: 35,
    LMIN: 0.12,
    LMAX: 0.92,
    baseZone: [0.28, 0.68],
    STEP: 0.22,
    CMAX: 0.26,
    CFLOOR: 0.04,
    chromaBoost: 1.0,
    chromaVariation: 0.15,
    chromaDark: 0.78,
    chromaLight: 0.7,
  },

  vibrant: {
    splitAngle: 40,
    LMIN: 0.12,
    LMAX: 0.92,
    baseZone: [0.28, 0.68],
    STEP: 0.22,
    CMAX: 0.38,
    CFLOOR: 0.08, // floor 0.08 not 0.15 — low-chroma inputs preserved
    chromaBoost: 1.35,
    chromaVariation: 0.2,
    chromaDark: 0.82,
    chromaLight: 0.72,
  },

  neutral: {
    splitAngle: 30,
    LMIN: 0.1,
    LMAX: 0.93,
    baseZone: [0.3, 0.65],
    STEP: 0.28,
    CMAX: 0.1,
    CFLOOR: 0.012,
    chromaBoost: 0.55,
    chromaVariation: 0.08,
    chromaDark: 0.75,
    chromaLight: 0.68,
  },

  pastel: {
    splitAngle: 35,
    LMIN: 0.68,
    LMAX: 0.97, // fixed: was 0.5 making dark variants impossible
    baseZone: [0.74, 0.88], // base pinned here so ±STEP=0.10 always fits
    STEP: 0.1,
    CMAX: 0.18,
    CFLOOR: 0.05,
    chromaBoost: 0.75,
    chromaVariation: 0.1,
    chromaDark: 0.9, // pastel darks barely drop chroma
    chromaLight: 0.65,
  },

  deep: {
    splitAngle: 38,
    LMIN: 0.1,
    LMAX: 0.62,
    baseZone: [0.22, 0.48],
    STEP: 0.18,
    CMAX: 0.34,
    CFLOOR: 0.1,
    chromaBoost: 1.35,
    chromaVariation: 0.18,
    chromaDark: 0.78,
    chromaLight: 0.85, // deep lights retain more chroma (jewel-tone)
  },

  earthy: {
    // Natural pigment territory: terracotta, sage, ochre, warm stone.
    // Medium-low chroma, full L range, organic feel.
    splitAngle: 32,
    LMIN: 0.14,
    LMAX: 0.9,
    baseZone: [0.28, 0.65],
    STEP: 0.22,
    CMAX: 0.15,
    CFLOOR: 0.03,
    chromaBoost: 0.55,
    chromaVariation: 0.12,
    chromaDark: 0.8,
    chromaLight: 0.68,
  },

  neon: {
    // True neon: glowing tubes (L 0.78–0.92) against near-black backgrounds
    // (L 0.10–0.20). Huge STEP collapses the mid-range intentionally —
    // the drama IS the contrast between bright tube and dark canvas.
    splitAngle: 42,
    LMIN: 0.1,
    LMAX: 0.94,
    baseZone: [0.78, 0.88],
    STEP: 0.66, // tube (~0.84) to near-black (~0.16) in one jump
    CMAX: 0.4,
    CFLOOR: 0.06,
    chromaBoost: 1.45,
    chromaVariation: 0.04, // flat — neon stays neon at all L
    chromaDark: 0.18, // near-black: whisper of hue only
    chromaLight: 0.88, // tube: full brightness
  },

  vintage: {
    // Warm hue bias (+12°), desaturated, compressed L range.
    // Aged paper, rust, dusty teal, sepia territory.
    splitAngle: 30,
    LMIN: 0.22,
    LMAX: 0.88,
    baseZone: [0.32, 0.62],
    STEP: 0.2,
    CMAX: 0.18,
    CFLOOR: 0.02,
    chromaBoost: 0.52,
    chromaVariation: 0.1,
    chromaDark: 0.85,
    chromaLight: 0.72,
    hueWarmShift: 12, // vintage-only: warms all hues by +12°
  },
};

// =============================================================================
// PALETTE INFO (for UI)
// =============================================================================

export const DOUBLE_SPLIT_COMP_PALETTE_INFO = [
  {
    id: "balanced",
    name: "Balanced",
    description:
      "Even perceptual steps, moderate chroma, full L range (0.12–0.92). The all-purpose double-split-comp. Works for editorial, UI, and brand systems.",
  },
  {
    id: "vibrant",
    name: "Vibrant",
    description:
      "High chroma (≤0.38), wider split angle (40°), strong bell curve. Bold, energetic, high-saturation designs. Low-chroma inputs are lifted proportionally, not crushed.",
  },
  {
    id: "neutral",
    name: "Neutral",
    description:
      "Low chroma (≤0.10), wide L spread (0.10–0.93), sqrt chroma scaling so even near-gray inputs keep their hue identity. Sophisticated editorial and UI surfaces.",
  },
  {
    id: "pastel",
    name: "Pastel",
    description:
      "Constrained to the light zone (L 0.68–0.97). Gentle ±0.10 L steps keep all 15 colors in the soft, airy register. Wellness, stationery, bridal, beauty.",
  },
  {
    id: "deep",
    name: "Deep",
    description:
      "Compressed into the dark zone (L 0.10–0.62). High chroma (≤0.34), strong chromaBoost. Jewel tones: sapphire, emerald, ruby. Luxury and high-end editorial.",
  },
  {
    id: "earthy",
    name: "Earthy",
    description:
      "Medium-low chroma (≤0.15), full L range. Natural pigment territory: terracotta + sage + ochre + warm stone. Organic, grounded, interior-design adjacent.",
  },
  {
    id: "neon",
    name: "Neon",
    description:
      "Bright glowing tubes (L 0.78–0.92) against near-black backgrounds (L ~0.16). Huge L jump is intentional — the drama is the contrast. Max chroma. Dark mode accent systems.",
  },
  {
    id: "vintage",
    name: "Vintage",
    description:
      "All hues shifted +12° warm, globally desaturated, L compressed to 0.22–0.88. Aged paper, rust, dusty teal, sepia. No digital-bright extremes.",
  },
];

// =============================================================================
// CORE GENERATOR
// =============================================================================

export default function doubleSplitCompPalGen(oklch, type = "balanced") {
  // ── Validation ──────────────────────────────────────────────────────────────
  if (!oklch || typeof oklch.l !== "number" || isNaN(oklch.l)) {
    throw new Error(
      `doubleSplitCompPalGen: expected { l, c, h }, got ${JSON.stringify(oklch)}`,
    );
  }
  const cfg = VARIANTS[type];
  if (!cfg) {
    throw new Error(
      `doubleSplitCompPalGen: unknown type "${type}". Valid: ${Object.keys(VARIANTS).join(", ")}`,
    );
  }

  const {
    splitAngle,
    LMIN,
    LMAX,
    baseZone,
    STEP,
    CMAX,
    CFLOOR,
    chromaBoost,
    chromaVariation,
    chromaDark,
    chromaLight,
  } = cfg;
  const hueShift = cfg.hueWarmShift || 0;

  // ── Hue geometry ────────────────────────────────────────────────────────────
  // Same splitAngle used for both base-side and comp-side → true symmetric
  // double-split-comp. The old code used getSplitAngle(compHue) separately
  // which made the comp-side asymmetric relative to the base-side.
  const baseH = hmod(oklch.h + hueShift);
  const analogWH = hmod(baseH + splitAngle);
  const analogCH = hmod(baseH - splitAngle);
  const compSplitWH = hmod(baseH + 180 + splitAngle);
  const compSplitCH = hmod(baseH + 180 - splitAngle);

  // ── Lightness ───────────────────────────────────────────────────────────────
  // baseL is pinned to baseZone so ±STEP always lands inside [LMIN, LMAX].
  const baseL = clamp(oklch.l, baseZone[0], baseZone[1]);
  const darkL = clamp(baseL - STEP, LMIN, LMAX);
  const lightL = clamp(baseL + STEP, LMIN, LMAX);

  // ── Chroma ──────────────────────────────────────────────────────────────────
  // sqrt curve: low inputs get proportional lift, high inputs compressed —
  // no input character is destroyed by a flat CMIN floor.
  const rawC = Math.sqrt(Math.max(0, oklch.c)) * Math.sqrt(CMAX) * chromaBoost;
  const baseC = clamp(rawC, CFLOOR, CMAX);

  // Bell curve: chroma peaks perceptually near L=0.55.
  // chromaVariation controls how steep the bell is.
  function adaptC(l, fraction = 1.0) {
    const dist = Math.abs(l - 0.55);
    const bell = 1 + chromaVariation * (1 - dist / 0.55);
    return clamp(baseC * fraction * Math.max(0.5, bell), CFLOOR, CMAX);
  }

  // Light / dark chroma fractions per slot
  const cL = (frac = 1.0) => clamp(baseC * chromaLight * frac, CFLOOR, CMAX);
  const cD = (frac = 1.0) =>
    clamp(baseC * chromaDark * frac, CFLOOR * 0.5, CMAX);

  // ── Builder ─────────────────────────────────────────────────────────────────
  const mk = (name, h, l, c) => ({
    name,
    value: clampColorToGamut({ l, c: clamp(c, 0, CMAX), h }),
  });

  return [
    // ── Group 1: Base ────────────────────────────────────────────────────────
    mk("Base-L", baseH, lightL, cL(1.0)),
    mk("Base", baseH, baseL, adaptC(baseL, 1.0)),
    mk("Base-D", baseH, darkL, cD(1.0)),

    // ── Group 2: Analog Warm (base + splitAngle) ─────────────────────────────
    mk("Analog Warm-L", analogWH, lightL, cL(0.9)),
    mk("Analog Warm", analogWH, baseL, adaptC(baseL, 0.92)),
    mk("Analog Warm-D", analogWH, darkL, cD(0.88)),

    // ── Group 3: Analog Cool (base − splitAngle) ─────────────────────────────
    mk("Analog Cool-L", analogCH, lightL, cL(0.88)),
    mk("Analog Cool", analogCH, baseL, adaptC(baseL, 0.95)),
    mk("Analog Cool-D", analogCH, darkL, cD(0.92)),

    // ── Group 4: Comp Split Warm (base + 180 + splitAngle) ───────────────────
    mk("CSW-L", compSplitWH, lightL, cL(1.05)),
    mk("CSW", compSplitWH, baseL, adaptC(baseL, 1.05)),
    mk("CSW-D", compSplitWH, darkL, cD(1.05)),

    // ── Group 5: Comp Split Cool (base + 180 − splitAngle) ───────────────────
    mk("CSC-L", compSplitCH, lightL, cL(1.0)),
    mk("CSC", compSplitCH, baseL, adaptC(baseL, 1.0)),
    mk("CSC-D", compSplitCH, darkL, cD(1.0)),
  ];
}

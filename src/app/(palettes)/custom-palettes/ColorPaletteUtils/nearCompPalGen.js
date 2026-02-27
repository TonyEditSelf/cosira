// nearCompPalGen.js
//
// Generates an 11-color near-complementary palette from a base OKLCH color.
//
// A near-comp uses accents that approach but deliberately MISS the true
// complement (180°). This creates a more sophisticated, asymmetric tension
// than split-comp (which mirrors symmetrically around the complement).
//
// Three families of near-comp are possible:
//
//   Asymmetric / Lean — both accents on the SAME side of the complement.
//     Both < 180° (warm lean) or both > 180° (cool lean).
//     Character: directional, opinionated, like a sentence that almost resolves.
//
//   Bracketing — accents sit symmetrically just inside the complement.
//     Feels like "almost-complement" — harmony with a subtle wobble.
//     Different from split-comp: split-comp pushes OUT from complement,
//     near-comp pulls IN toward it.
//
//   Wide Asymmetric — large one-sided lean, approaches near-triadic territory
//     while remaining anchored to the near-comp concept.
//
// OUTPUT — 11 slots, consistent shape:
//   Base:  DD / D / Mid / L / LL   (5 steps — full scale)
//   Near1: D  / Mid / L            (3 steps)
//   Near2: D  / Mid / L            (3 steps)
//
// API:
//   nearCompPalGen(oklch, type?)   type defaults to "warm-lean"

// =============================================================================
// HELPERS
// =============================================================================

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const hmod = (h) => ((h % 360) + 360) % 360;

// =============================================================================
// VARIANT CONFIGS
// =============================================================================
//
// near1Offset / near2Offset — degrees added to base hue for each accent.
//   Both on the same side = lean variant.
//   One each side of 180° = bracketing variant.
//   Gap between the two must be ≥ 20° to be perceptually distinct.
//
// baseZone — [min, max] that baseL is clamped to before applying steps.
//   Must satisfy: baseZone[0] >= LMIN + STEP + 0.02 (room for Base-D above LMIN)
//   Must satisfy: baseZone[1] <= LMAX - STEP - 0.02 (room for Base-L below LMAX)
//
// STEP — additive L step for D and L variants.
//   DD/LL are pinned to LMIN/LMAX so they always reach the extremes.
//
// chromaScale — multiplier applied before sqrt curve. Does NOT set a floor
//   that destroys low-chroma inputs (unlike original CMIN approach).

const VARIANTS = {
  "warm-lean": {
    // Both accents on the warm side of complement (both < 180°).
    // Near1 = +155° (just short of comp), Near2 = +130° (further back).
    // 25° gap between accents — clearly distinct.
    // Example: orange base → accents in blue-violet territory, warm bias.
    near1Offset: 155,
    near2Offset: 130,
    LMIN: 0.12,
    LMAX: 0.92,
    baseZone: [0.34, 0.65],
    STEP: 0.2,
    CMAX: 0.28,
    CFLOOR: 0.04,
    chromaScale: 1.0,
  },

  "cool-lean": {
    // Both accents on the cool side of complement (both > 180°).
    // Near1 = +205°, Near2 = +230°.
    // 25° gap between accents — clearly distinct.
    // Example: warm amber base → accents lean into slate/teal territory.
    near1Offset: 205,
    near2Offset: 230,
    LMIN: 0.12,
    LMAX: 0.92,
    baseZone: [0.34, 0.65],
    STEP: 0.2,
    CMAX: 0.28,
    CFLOOR: 0.04,
    chromaScale: 1.0,
  },

  "tight-bracket": {
    // Accents bracket the complement at ±15°.
    // Near1 = +165°, Near2 = +195°.
    // Feels like "almost complement" — the tiniest wobble from true opposition.
    // Distinct from split-comp (which uses ±30–45°): tension is much more subtle.
    near1Offset: 165,
    near2Offset: 195,
    LMIN: 0.12,
    LMAX: 0.92,
    baseZone: [0.34, 0.65],
    STEP: 0.2,
    CMAX: 0.28,
    CFLOOR: 0.04,
    chromaScale: 1.0,
  },

  "wide-asymmetric": {
    // Large one-sided lean: +160° and +120° (40° gap, warm side).
    // Near2 approaches near-triadic territory but stays anchored near-comp.
    // Bold, unconventional. Fashion and editorial use.
    near1Offset: 160,
    near2Offset: 120,
    LMIN: 0.12,
    LMAX: 0.92,
    baseZone: [0.34, 0.65],
    STEP: 0.2,
    CMAX: 0.28,
    CFLOOR: 0.04,
    chromaScale: 1.0,
  },

  muted: {
    // Warm-lean geometry (155°, 130°) with low chroma throughout.
    // Near-comp tension is felt but not stated loudly.
    // Sophisticated editorial, luxury interiors, desaturated brand palettes.
    near1Offset: 155,
    near2Offset: 130,
    LMIN: 0.12,
    LMAX: 0.92,
    baseZone: [0.34, 0.65],
    STEP: 0.22,
    CMAX: 0.1,
    CFLOOR: 0.012,
    chromaScale: 0.5,
  },
};

// =============================================================================
// PALETTE INFO (for UI)
// =============================================================================

export const NEAR_COMP_PALETTE_INFO = [
  {
    id: "warm-lean",
    name: "Warm Lean",
    description:
      "Both accents sit on the warm side of the complement (+130°, +155°). Directional, opinionated tension — avoids the predictability of true complement. Editorial, fashion, branding.",
  },
  {
    id: "cool-lean",
    name: "Cool Lean",
    description:
      "Both accents lean cool (+205°, +230°). Crisp, slightly melancholic. Warm base + cool slate/teal accents. Interiors, film, luxury.",
  },
  {
    id: "tight-bracket",
    name: "Tight Bracket",
    description:
      "Accents bracket the complement at ±15° (165°, 195°). Feels like almost-complement — harmony with a subtle wobble. Much softer than split-comp's wider angle.",
  },
  {
    id: "wide-asymmetric",
    name: "Wide Asymmetric",
    description:
      "Large one-sided lean: +160° and +120° (40° gap). Approaches near-triadic tension without committing. Bold, unconventional. Fashion and editorial.",
  },
  {
    id: "muted",
    name: "Muted",
    description:
      "Warm-lean geometry (130°, 155°) with low chroma throughout (≤0.10). Near-comp tension is felt but not stated. Sophisticated editorial, luxury interiors.",
  },
];

// =============================================================================
// CORE GENERATOR
// =============================================================================

export default function nearCompPalGen(oklch, type = "warm-lean") {
  // ── Validation ──────────────────────────────────────────────────────────────
  if (!oklch || typeof oklch.l !== "number" || isNaN(oklch.l)) {
    throw new Error(
      `nearCompPalGen: expected { l, c, h }, got ${JSON.stringify(oklch)}`,
    );
  }
  const cfg = VARIANTS[type];
  if (!cfg) {
    throw new Error(
      `nearCompPalGen: unknown type "${type}". Valid: ${Object.keys(VARIANTS).join(", ")}`,
    );
  }

  const {
    near1Offset,
    near2Offset,
    LMIN,
    LMAX,
    baseZone,
    STEP,
    CMAX,
    CFLOOR,
    chromaScale,
  } = cfg;

  // ── Hue geometry ────────────────────────────────────────────────────────────
  const baseH = hmod(oklch.h);
  const near1H = hmod(baseH + near1Offset);
  const near2H = hmod(baseH + near2Offset);

  // ── Lightness ───────────────────────────────────────────────────────────────
  // baseZone guarantees baseL - STEP > LMIN and baseL + STEP < LMAX,
  // so Base-D and Base-L are always distinct from the pinned extremes.
  const baseL = clamp(oklch.l, baseZone[0], baseZone[1]);
  const darkL = clamp(baseL - STEP, LMIN, LMAX);
  const lightL = clamp(baseL + STEP, LMIN, LMAX);
  // DD/LL are pinned to the absolute range extremes — always reach dark and light.
  const darkestL = LMIN;
  const lightestL = LMAX;

  // ── Chroma ──────────────────────────────────────────────────────────────────
  // sqrt curve: proportional scaling with no hard CMIN floor — preserves
  // low-chroma input character instead of forcing it up to a minimum.
  const rawC = Math.sqrt(Math.max(0, oklch.c)) * Math.sqrt(CMAX) * chromaScale;
  const baseC = clamp(rawC, CFLOOR, CMAX);

  // Chroma steps — tapers toward dark and light (perceptual bell)
  const cMid = baseC;
  const cDark = clamp(baseC * 0.8, CFLOOR, CMAX);
  const cLight = clamp(baseC * 0.72, CFLOOR, CMAX);
  // Pinned extremes get reduced chroma (gamut narrows near L=0 and L=1)
  const cDD = clamp(baseC * 0.65, CFLOOR * 0.5, CMAX);
  const cLL = clamp(baseC * 0.58, CFLOOR, CMAX);

  // ── Builder ─────────────────────────────────────────────────────────────────
  const mk = (name, h, l, c) => ({
    name,
    value: { l, c: clamp(c, 0, CMAX), h },
  });

  return [
    // ── Base (5 steps — full scale) ──────────────────────────────────────────
    mk("Base-DD", baseH, darkestL, cDD),
    mk("Base-D", baseH, darkL, cDark),
    mk("Base", baseH, baseL, cMid),
    mk("Base-L", baseH, lightL, cLight),
    mk("Base-LL", baseH, lightestL, cLL),

    // ── Near1 (3 steps) ───────────────────────────────────────────────────────
    // Slight chroma taper: near-comps carry marginally less chroma than base
    // so the base hue reads as primary.
    mk("Near1-D", near1H, darkL, clamp(cDark * 0.95, 0, CMAX)),
    mk("Near1", near1H, baseL, clamp(cMid * 0.98, 0, CMAX)),
    mk("Near1-L", near1H, lightL, clamp(cLight * 0.92, 0, CMAX)),

    // ── Near2 (3 steps) ───────────────────────────────────────────────────────
    // Near2 gets a very slight chroma lift so it reads as distinct from Near1.
    mk("Near2-D", near2H, darkL, clamp(cDark * 1.05, 0, CMAX)),
    mk("Near2", near2H, baseL, clamp(cMid * 1.02, 0, CMAX)),
    mk("Near2-L", near2H, lightL, clamp(cLight * 0.95, 0, CMAX)),
  ];
}

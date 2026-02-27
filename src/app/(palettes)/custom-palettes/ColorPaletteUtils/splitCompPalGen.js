// splitCompPalGen.js
//
// Generates an 11-colour split-complementary palette from a base OKLCH colour.
// All variants return the same shape:
//
//   [
//     { name: "Base-D",  value: { l, c, h } },
//     { name: "Base",    value: { l, c, h } },
//     { name: "Base-L",  value: { l, c, h } },
//     { name: "SC1-DN",  value: { l, c, h } },
//     { name: "SC1-D",   value: { l, c, h } },
//     { name: "SC1",     value: { l, c, h } },
//     { name: "SC1-L",   value: { l, c, h } },
//     { name: "SC2-DN",  value: { l, c, h } },
//     { name: "SC2-D",   value: { l, c, h } },
//     { name: "SC2",     value: { l, c, h } },
//     { name: "SC2-L",   value: { l, c, h } },
//   ]
//
// API:
//   splitCompPalGen(oklch, splitCompOptions, type?)
//   type defaults to "standard"

// =============================================================================
// HELPERS
// =============================================================================

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const hmod = (h) => ((h % 360) + 360) % 360;

/**
 * Additive lightness step — perceptually even regardless of base L.
 * darkStep / lightStep are absolute deltas (e.g. 0.12).
 */
function lVariants(
  baseL,
  darkStep = 0.12,
  lightStep = 0.12,
  lMin = 0.06,
  lMax = 0.97,
) {
  return {
    dark: clamp(baseL - darkStep, lMin, lMax),
    light: clamp(baseL + lightStep, lMin, lMax),
  };
}

/**
 * Build the standard 11-slot output from pre-computed colour objects.
 */
function buildOutput(
  darkBase,
  base,
  lightBase,
  sc1dn,
  sc1d,
  sc1,
  sc1l,
  sc2dn,
  sc2d,
  sc2,
  sc2l,
) {
  return [
    { name: "Base-D", value: darkBase },
    { name: "Base", value: base },
    { name: "Base-L", value: lightBase },
    { name: "SC1-DN", value: sc1dn },
    { name: "SC1-D", value: sc1d },
    { name: "SC1", value: sc1 },
    { name: "SC1-L", value: sc1l },
    { name: "SC2-DN", value: sc2dn },
    { name: "SC2-D", value: sc2d },
    { name: "SC2", value: sc2 },
    { name: "SC2-L", value: sc2l },
  ];
}

// =============================================================================
// VARIANTS
// =============================================================================

// ─── 1. Standard ──────────────────────────────────────────────────────────────
// Full-saturation split-comp. Additive lightness steps for perceptual evenness.
// -DN slots drop chroma to ~40 % for usable text/bg neutrals.
function standardSplitComp(oklch, opts) {
  const base = { l: oklch.l, c: oklch.c, h: oklch.h };
  const { dark: dL, light: lL } = lVariants(base.l);

  const sc1H = hmod(base.h + 180 + opts.splitCompAngle1);
  const sc2H = hmod(base.h + 180 + opts.splitCompAngle2);

  const sc1 = { l: base.l, c: base.c, h: sc1H };
  const sc2 = { l: base.l, c: base.c, h: sc2H };

  return buildOutput(
    { ...base, l: dL },
    base,
    { ...base, l: lL },
    { ...sc1, l: clamp(base.l - 0.12, 0.06, 0.97), c: base.c * 0.4 },
    { ...sc1, l: clamp(base.l - 0.12, 0.06, 0.97) },
    sc1,
    { ...sc1, l: clamp(base.l + 0.12, 0.06, 0.97) },
    { ...sc2, l: clamp(base.l - 0.12, 0.06, 0.97), c: base.c * 0.4 },
    { ...sc2, l: clamp(base.l - 0.12, 0.06, 0.97) },
    sc2,
    { ...sc2, l: clamp(base.l + 0.12, 0.06, 0.97) },
  );
}

// ─── 2. Vintage ───────────────────────────────────────────────────────────────
// Warm hue bias (+15°), global desaturation, compressed L range (0.30–0.90).
// Aged-paper warmth. Think amber + rust + dusty teal.
function vintageSplitComp(oklch, opts) {
  const WARM = 15;
  const C_MAX = 0.2;
  const C_FAC = 0.5;
  const L_MIN = 0.3;
  const L_MAX = 0.9;

  const baseC = clamp(oklch.c * C_FAC, 0.02, C_MAX);
  const baseL = clamp(oklch.l, L_MIN, L_MAX);
  const baseH = hmod(oklch.h + WARM);

  const base = { l: baseL, c: baseC, h: baseH };
  // Step bounds extend slightly beyond display range so extreme inputs still get distinct steps
  const { dark: dL, light: lL } = lVariants(baseL, 0.1, 0.1, 0.2, 0.96);

  const sc1H = hmod(baseH + 180 + opts.splitCompAngle1);
  const sc2H = hmod(baseH + 180 + opts.splitCompAngle2);

  const mk = (h, l, cFac = 1) => ({
    l, // already clamped by lVariants or is baseL — no re-clamp needed
    c: clamp(baseC * cFac, 0.02, C_MAX),
    h,
  });

  return buildOutput(
    mk(baseH, dL, 1.1),
    base,
    mk(baseH, lL, 0.8),
    mk(sc1H, dL, 0.4 * 0.5),
    mk(sc1H, dL, 1.1),
    mk(sc1H, baseL),
    mk(sc1H, lL, 0.8),
    mk(sc2H, dL, 0.4 * 0.5),
    mk(sc2H, dL, 1.1),
    mk(sc2H, baseL),
    mk(sc2H, lL, 0.8),
  );
}

// ─── 3. Neutral ───────────────────────────────────────────────────────────────
// Low-chroma split-comp spanning a full dark-to-light range (L 0.10–0.93).
// Chroma uses a sqrt curve — floor of 0.018 ensures hue shifts stay visible
// even for desaturated inputs. Bell curve tapers chroma toward dark/light
// variants so the scale reads as genuinely neutral, not flat-gray.
// Good for sophisticated editorial, UI surfaces, and interior design palettes.
function neutralSplitComp(oklch, opts) {
  const C_FLOOR = 0.018; // below this hue shifts become imperceptible
  const C_CEIL = 0.1;
  const L_MIN = 0.1;
  const L_MAX = 0.93;
  const STEP = 0.28; // wide step so dark/light reach near the L extremes

  // sqrt curve: low-chroma inputs still carry a readable hue tint;
  // high-chroma inputs are pulled down to neutral range without slamming a flat ceiling
  const baseC = clamp(Math.sqrt(oklch.c) * 0.185, C_FLOOR, C_CEIL);

  // Pin base to 0.30–0.65 so ±STEP always lands within L_MIN/L_MAX
  const baseL = clamp(oklch.l, 0.3, 0.65);

  const dL = clamp(baseL - STEP, L_MIN, L_MAX);
  const lL = clamp(baseL + STEP, L_MIN, L_MAX);

  // Bell curve: dark and light variants taper to ~70% chroma; DN to ~35%
  const cD = clamp(baseC * 0.72, C_FLOOR, C_CEIL);
  const cL = clamp(baseC * 0.68, C_FLOOR, C_CEIL);
  const cDN = clamp(baseC * 0.35, 0.008, C_CEIL); // DN allowed below floor

  const sc1H = hmod(oklch.h + 180 + opts.splitCompAngle1);
  const sc2H = hmod(oklch.h + 180 + opts.splitCompAngle2);

  return buildOutput(
    { l: dL, c: cD, h: oklch.h }, // Base-D
    { l: baseL, c: baseC, h: oklch.h }, // Base
    { l: lL, c: cL, h: oklch.h }, // Base-L
    { l: dL, c: cDN, h: sc1H }, // SC1-DN
    { l: dL, c: cD, h: sc1H }, // SC1-D
    { l: baseL, c: baseC, h: sc1H }, // SC1
    { l: lL, c: cL, h: sc1H }, // SC1-L
    { l: dL, c: cDN, h: sc2H }, // SC2-DN
    { l: dL, c: cD, h: sc2H }, // SC2-D
    { l: baseL, c: baseC, h: sc2H }, // SC2
    { l: lL, c: cL, h: sc2H }, // SC2-L
  );
}

// ─── 4. Kids ──────────────────────────────────────────────────────────────────
// High lightness (0.78–0.97), high chroma (0.25–0.30). No dark moody tones.
// Cheerful, safe, playful. SC1-L / SC2-L push to max chroma as accents.
// DN slots bypass C_MIN so they're visibly desaturated (pastel-wash feel),
// distinguishing them clearly from their fully-saturated -D neighbours.
function kidsSplitComp(oklch, opts) {
  const L_MIN = 0.78;
  const L_MAX = 0.97;
  const C_MIN = 0.25;
  const C_MAX = 0.3;

  const baseC = clamp(oklch.c, C_MIN, C_MAX);
  const baseL = clamp(oklch.l, 0.82, L_MAX);
  const baseH = hmod(oklch.h);

  const base = { l: baseL, c: baseC, h: baseH };
  const dL = clamp(baseL - 0.05, L_MIN, L_MAX);
  const lL = clamp(baseL + (L_MAX - baseL) * 0.6, L_MIN, L_MAX);

  const sc1H = hmod(baseH + 180 + opts.splitCompAngle1);
  const sc2H = hmod(baseH + 180 + opts.splitCompAngle2);

  // Standard slot: chroma stays in cheerful C_MIN–C_MAX band
  const mk = (h, l, c = baseC) => ({
    l: clamp(l, L_MIN, L_MAX),
    c: clamp(c, C_MIN, C_MAX),
    h: hmod(h),
  });

  // DN slot: intentionally drops below C_MIN for a soft pastel-wash contrast
  // (bypasses the cheerful floor — gives a "quiet" background tone)
  const mkDN = (h, l) => ({
    l: clamp(l, L_MIN, L_MAX),
    c: clamp(baseC * 0.35, 0.08, 0.18),
    h: hmod(h),
  });

  return buildOutput(
    mk(baseH, dL),
    base,
    mk(baseH, lL, C_MAX),
    mkDN(sc1H, dL), // SC1-DN: pastel-wash, clearly desaturated
    mk(sc1H, dL),
    mk(sc1H, baseL),
    mk(sc1H, lL, C_MAX), // SC1-L: full-chroma accent
    mkDN(sc2H, dL), // SC2-DN: pastel-wash
    mk(sc2H, dL),
    mk(sc2H, baseL),
    mk(sc2H, lL, C_MAX), // SC2-L: full-chroma accent
  );
}

// ─── 5. Earthy / Muted ────────────────────────────────────────────────────────
// Medium-low chroma (0.04–0.14). Natural pigment territory: terracotta,
// sage, ochre, warm cream. L range 0.25–0.88 for full earthy depth.
function earthyMutedSplitComp(oklch, opts) {
  const C_MAX = 0.14;
  const C_FAC = 0.55;
  const L_MIN = 0.25;
  const L_MAX = 0.88;

  const baseC = clamp(oklch.c * C_FAC, 0.04, C_MAX);
  const baseL = clamp(oklch.l, L_MIN, L_MAX);
  const baseH = oklch.h;

  const base = { l: baseL, c: baseC, h: baseH };
  // Step bounds extend beyond display range so extreme inputs still get distinct steps
  const { dark: dL, light: lL } = lVariants(baseL, 0.13, 0.13, 0.14, 0.94);

  const sc1H = hmod(baseH + 180 + opts.splitCompAngle1);
  const sc2H = hmod(baseH + 180 + opts.splitCompAngle2);

  const mk = (h, l, cFac = 1) => ({
    l, // already clamped by lVariants or is baseL — no re-clamp needed
    c: clamp(baseC * cFac, 0.03, C_MAX),
    h,
  });

  return buildOutput(
    mk(baseH, dL, 1.05),
    base,
    mk(baseH, lL, 0.75),
    mk(sc1H, dL, 0.35),
    mk(sc1H, dL, 1.05),
    mk(sc1H, baseL),
    mk(sc1H, lL, 0.75),
    mk(sc2H, dL, 0.35),
    mk(sc2H, dL, 1.05),
    mk(sc2H, baseL),
    mk(sc2H, lL, 0.75),
  );
}

// ─── 6. Neon / Electric ───────────────────────────────────────────────────────
// True neon: bright glowing tubes (L 0.82–0.94) + near-black backgrounds
// (L 0.10–0.20) for maximum contrast. No muddy mid-gray mush.
// -D slots are dark surfaces (like a nightclub wall) so the neons pop.
// -DN slots are near-black with just a whisper of hue.
function neonElectricSplitComp(oklch, opts) {
  const C_BASE = clamp(oklch.c, 0.3, 0.4); // push to true maximum
  const baseH = oklch.h;

  // Neon tubes are always bright — ignore input L for base and light
  const TUBE_L = 0.84;
  const TUBE_LL = clamp(TUBE_L + 0.07, 0.84, 0.94);
  // Darks are always near-black — the canvas that makes neon glow
  const DARK_L = 0.12;
  const SURF_L = 0.2; // slightly lighter dark surface

  const sc1H = hmod(baseH + 180 + opts.splitCompAngle1);
  const sc2H = hmod(baseH + 180 + opts.splitCompAngle2);

  const mk = (h, l, cFac = 1) => ({
    l,
    c: clamp(C_BASE * cFac, 0.08, 0.4),
    h,
  });

  return buildOutput(
    mk(baseH, DARK_L, 0.15), // Base-D:  near-black bg with faint base hue
    mk(baseH, TUBE_L), // Base:    bright neon tube
    mk(baseH, TUBE_LL, 0.85), // Base-L:  slightly lighter/softer tube
    mk(sc1H, DARK_L, 0.1), // SC1-DN:  near-black bg with faint sc1 hue
    mk(sc1H, SURF_L, 0.45), // SC1-D:   dark tinted surface
    mk(sc1H, TUBE_L), // SC1:     bright sc1 neon tube
    mk(sc1H, TUBE_LL, 0.85), // SC1-L:   softer sc1 tube
    mk(sc2H, DARK_L, 0.1), // SC2-DN:  near-black bg with faint sc2 hue
    mk(sc2H, SURF_L, 0.45), // SC2-D:   dark tinted surface
    mk(sc2H, TUBE_L), // SC2:     bright sc2 neon tube
    mk(sc2H, TUBE_LL, 0.85), // SC2-L:   softer sc2 tube
  );
}

// ─── 7. Pastel ────────────────────────────────────────────────────────────────
// High lightness (0.72–0.96), moderate chroma (0.08–0.18). Dreamy and soft
// without the safety-clamp rigidity of the kids palette. Bridal, wellness,
// stationery, beauty brands.
function pastelSplitComp(oklch, opts) {
  const C_MAX = 0.18;
  const C_FAC = 0.6;
  const L_MIN = 0.72;
  const L_MAX = 0.96;

  const baseC = clamp(oklch.c * C_FAC, 0.08, C_MAX);
  const baseL = clamp(oklch.l, L_MIN, L_MAX);
  const baseH = oklch.h;

  const base = { l: baseL, c: baseC, h: baseH };
  // Step bounds extend below display range so dark step is always distinct from base
  const { dark: dL, light: lL } = lVariants(baseL, 0.08, 0.08, 0.64, 0.96);

  const sc1H = hmod(baseH + 180 + opts.splitCompAngle1);
  const sc2H = hmod(baseH + 180 + opts.splitCompAngle2);

  const mk = (h, l, cFac = 1) => ({
    l, // already clamped by lVariants or is baseL — no re-clamp needed
    c: clamp(baseC * cFac, 0.06, C_MAX),
    h,
  });

  return buildOutput(
    mk(baseH, dL, 1.1),
    base,
    mk(baseH, lL, 0.7),
    mk(sc1H, dL, 0.5),
    mk(sc1H, dL, 1.1),
    mk(sc1H, baseL),
    mk(sc1H, lL, 0.7),
    mk(sc2H, dL, 0.5),
    mk(sc2H, dL, 1.1),
    mk(sc2H, baseL),
    mk(sc2H, lL, 0.7),
  );
}

// ─── 8. Deep / Jewel ──────────────────────────────────────────────────────────
// Low lightness (0.18–0.65), high chroma (0.18–0.32). Jewel-tone depth:
// sapphire, emerald, ruby, amethyst. Luxury, fashion, high-end editorial.
// Base is clamped to 0.30–0.52 so ±step always has room to be distinct.
function deepJewelSplitComp(oklch, opts) {
  const C_MAX = 0.32;
  const C_FAC = 0.92;
  const L_MIN = 0.18;
  const L_MAX = 0.65;

  const baseC = clamp(oklch.c * C_FAC, 0.18, C_MAX);
  // Pin base in a tighter zone so dark (−0.13) and light (+0.15) never clamp
  const baseL = clamp(oklch.l, 0.3, 0.52);
  const baseH = oklch.h;

  const base = { l: baseL, c: baseC, h: baseH };
  const dL = clamp(baseL - 0.13, L_MIN, L_MAX);
  const lL = clamp(baseL + 0.15, L_MIN, L_MAX);

  const sc1H = hmod(baseH + 180 + opts.splitCompAngle1);
  const sc2H = hmod(baseH + 180 + opts.splitCompAngle2);

  const mk = (h, l, cFac = 1) => ({
    l: clamp(l, L_MIN, L_MAX),
    c: clamp(baseC * cFac, 0.1, C_MAX),
    h,
  });

  return buildOutput(
    mk(baseH, dL, 0.8),
    base,
    mk(baseH, lL, 0.9),
    mk(sc1H, dL, 0.35), // SC1-DN: desaturated deep shadow
    mk(sc1H, dL, 0.8),
    mk(sc1H, baseL),
    mk(sc1H, lL, 0.9),
    mk(sc2H, dL, 0.35),
    mk(sc2H, dL, 0.8),
    mk(sc2H, baseL),
    mk(sc2H, lL, 0.9),
  );
}

// =============================================================================
// PALETTE INFO
// =============================================================================

export const SPLIT_COMP_PALETTE_INFO = [
  {
    id: "standard",
    name: "Standard",
    description:
      "Full-saturation split-comp. Additive lightness steps keep dark/light variants perceptually even at any base L. -DN slots drop chroma to ~40% for usable text and background neutrals.",
  },
  {
    id: "vintage",
    name: "Vintage",
    description:
      "Warm hue bias (+15°), global desaturation, lightness clamped to 0.30–0.90. Aged paper, rust, dusty teal. No digital-bright extremes.",
  },
  {
    id: "neutral",
    name: "Neutral",
    description:
      "Low-chroma (≤0.10) with a full dark-to-light span (L 0.10–0.93). Sqrt chroma curve with a 0.018 floor keeps hue shifts perceptible even for desaturated inputs. Bell taper on dark/light variants reads as genuinely neutral, not flat-gray. Editorial, UI surfaces, interiors.",
  },
  {
    id: "kids",
    name: "Kids",
    description:
      "High lightness (0.78–0.97), high chroma (0.25–0.30). No dark moody tones. -DN slots drop to a soft pastel-wash so they're clearly distinct from their saturated -D neighbours. Light variants push to max chroma as cheerful accents.",
  },
  {
    id: "earthy-muted",
    name: "Earthy / Muted",
    description:
      "Medium-low chroma (0.04–0.14), full L range 0.25–0.88. Natural pigment territory: terracotta, sage, ochre, warm cream. Organic and grounded.",
  },
  {
    id: "neon-electric",
    name: "Neon / Electric",
    description:
      "Bright glowing tubes (L 0.82–0.94) on near-black backgrounds (L 0.10–0.20). Maximum chroma (0.30–0.40). -D slots are dark surfaces so the neons pop; -DN slots are near-black with just a whisper of hue. True neon sign energy.",
  },
  {
    id: "pastel",
    name: "Pastel",
    description:
      "High lightness (0.72–0.96), moderate chroma (0.08–0.18). Dreamy and soft without safety rigidity. Bridal, wellness, stationery, beauty brands.",
  },
  {
    id: "deep-jewel",
    name: "Deep / Jewel",
    description:
      "Low lightness (0.18–0.65), high chroma (0.18–0.32). Base is pinned to 0.30–0.52 so dark and light steps always have room to be distinct. Jewel-tone depth: sapphire, emerald, ruby, amethyst.",
  },
];

// =============================================================================
// MAIN EXPORT
// =============================================================================

const VARIANT_MAP = {
  standard: standardSplitComp,
  vintage: vintageSplitComp,
  neutral: neutralSplitComp,
  kids: kidsSplitComp,
  "earthy-muted": earthyMutedSplitComp,
  "neon-electric": neonElectricSplitComp,
  pastel: pastelSplitComp,
  "deep-jewel": deepJewelSplitComp,
};

export default function splitCompPalGen(
  oklch,
  splitCompOptions,
  type = "standard",
) {
  if (!oklch || typeof oklch.l !== "number" || isNaN(oklch.l)) {
    throw new Error(
      `splitCompPalGen: expected { l, c, h }, got ${JSON.stringify(oklch)}`,
    );
  }

  const fn = VARIANT_MAP[type];
  if (!fn) {
    throw new Error(
      `splitCompPalGen: unknown type "${type}". Valid: ${Object.keys(VARIANT_MAP).join(", ")}`,
    );
  }

  return fn(oklch, splitCompOptions);
}

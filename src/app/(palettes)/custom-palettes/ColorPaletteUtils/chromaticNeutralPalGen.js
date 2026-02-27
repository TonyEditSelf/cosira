// chromaticNeutralPalGen.js

const CMIN = 0.0;
const CMAX = 0.04;

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

// Numeric scale names — UI token convention (high = dark, low = light)
const STEP_NAMES = [
  "975", // Deepest dark — dark mode base layer
  "950", // Dark mode backgrounds
  "900", // Very dark text / headings
  "800", // Dark text
  "700", // Body text (peak chroma zone)
  "600", // Muted text (peak chroma zone)
  "500", // Borders, icons
  "400", // Disabled states
  "300", // Subtle borders
  "200", // Hover backgrounds
  "100", // Card backgrounds
  "50", // Lightest backgrounds
];

// Fixed lightness stops — the spine of all variants
const BASE_L = [
  0.06, 0.12, 0.2, 0.3, 0.42, 0.54, 0.65, 0.75, 0.83, 0.89, 0.94, 0.98,
];

// ─── chromaBias ───────────────────────────────────────────────────────────────
// Sqrt curve so low-chroma inputs still get a gentle tint,
// high-chroma inputs don't max out the scale.
function chromaBias(baseC, multiplier = 0.18) {
  return clamp(Math.sqrt(baseC) * multiplier, 0.003, CMAX);
}

// ─── Core builder ─────────────────────────────────────────────────────────────
function buildScale(baseOklch, overrideFn) {
  return BASE_L.map((baseL, i) => {
    const t = i / (BASE_L.length - 1); // 0 → 1  (dark → light)
    const { l, c, h } = overrideFn(t, i, baseL);
    return {
      name: STEP_NAMES[i],
      value: {
        l: clamp(l, 0.04, 0.99),
        c: clamp(c, CMIN, CMAX),
        h,
      },
    };
  });
}

// ─── Input validation ─────────────────────────────────────────────────────────
function validate(oklch) {
  if (!oklch || typeof oklch.l !== "number" || isNaN(oklch.l)) {
    throw new Error(
      `chromaticNeutralPalGen: expected { l, c, h }, got ${JSON.stringify(oklch)}`,
    );
  }
}

// =============================================================================
// VARIANTS
// =============================================================================

// ─── 1. Standard ──────────────────────────────────────────────────────────────
// Preserves input hue. Chroma peaks in mid-tones (700–600), falls off at
// extremes. The all-purpose chromatic neutral for UI token scales.
function standardNeutral(oklch) {
  const bias = chromaBias(oklch.c);

  // Bell peak at t≈0.4 (maps to 700/600 range)
  const chromaCurve = (t) => {
    const mid = (t - 0.4) / 0.5;
    return bias * (1 - mid * mid * 0.6);
  };

  return buildScale(oklch, (t, _i, baseL) => ({
    l: baseL,
    c: clamp(chromaCurve(t), 0.004, CMAX),
    h: oklch.h,
  }));
}

// ─── 2. Complementary Shadows ─────────────────────────────────────────────────
// Darks drift toward complementary hue; lights stay on-hue.
// Adds perceptual depth — shadows read as "cooler" or "warmer" depending on
// the input color. Inspired by how real-world shadows shift in hue.
function complementaryShadowsNeutral(oklch) {
  const bias = chromaBias(oklch.c, 0.2);
  const compH = (oklch.h + 180) % 360;

  return buildScale(oklch, (t, _i, baseL) => {
    // t=0 (darkest) → complementary hue; t=1 (lightest) → base hue
    const hue = oklch.h + (compH - oklch.h) * (1 - t);
    return {
      l: baseL,
      c: clamp(bias * (0.6 + (1 - t) * 0.4), 0.004, CMAX),
      h: hue,
    };
  });
}

// ─── 3. Split Hue ─────────────────────────────────────────────────────────────
// Darks warm up (+30°), lights cool down (−30°). Mimics natural light physics
// where shadows are warm and atmosphere makes lights feel cooler.
// Extremely useful for realistic UI depth without explicit gradients.
function splitHueNeutral(oklch) {
  const bias = chromaBias(oklch.c, 0.19);

  return buildScale(oklch, (t, _i, baseL) => {
    // t=0 → warm shift (+30°); t=1 → cool shift (−30°)
    const hShift = 30 - t * 60;
    return {
      l: baseL,
      c: clamp(bias * (0.7 + Math.sin(t * Math.PI) * 0.4), 0.004, CMAX),
      h: (oklch.h + hShift + 360) % 360,
    };
  });
}

// ─── 4. Hue Drift ─────────────────────────────────────────────────────────────
// Gradual hue rotation across the full scale (±15°). The scale feels alive
// and cohesive without reading as "colorful". Great for sophisticated brand
// neutrals where a pure static hue feels flat.
function hueDriftNeutral(oklch) {
  const bias = chromaBias(oklch.c, 0.18);

  return buildScale(oklch, (t, _i, baseL) => ({
    l: baseL,
    c: clamp(bias * (0.8 + Math.sin(t * Math.PI) * 0.3), 0.004, CMAX),
    // Drifts from h−15 (dark) to h+15 (light)
    h: (oklch.h - 15 + t * 30 + 360) % 360,
  }));
}

// ─── 5. Chromatic Ink ─────────────────────────────────────────────────────────
// Inverted chroma curve — darks carry the most saturation, lights are nearly
// white. Mimics how pigment/ink behaves: deep colors in shadow, clean whites
// in highlights. Ideal for editorial, print-oriented, or luxury UI neutrals.
function chromaticInkNeutral(oklch) {
  const bias = chromaBias(oklch.c, 0.22);

  return buildScale(oklch, (t, _i, baseL) => ({
    l: baseL,
    // Inverted: t=0 (dark) gets full chroma, t=1 (light) gets near zero
    c: clamp(bias * (1.1 - t * 0.9), 0.003, CMAX),
    h: oklch.h,
  }));
}

// ─── 6. Surface / Elevation ───────────────────────────────────────────────────
// Two paired sets of 6 steps each — a dark half (975→500) and a light half
// (400→50) — optimised for elevation token systems. Dark steps serve as
// background/surface layers in dark mode; light steps serve the same in
// light mode. Chroma is kept intentionally even so elevation reads through
// lightness alone, not color shift.
function surfaceElevationNeutral(oklch) {
  const bias = chromaBias(oklch.c, 0.14);

  return buildScale(oklch, (t, _i, baseL) => ({
    l: baseL,
    // Flat chroma — elevation is communicated by L only
    c: clamp(bias * 0.85, 0.004, CMAX),
    h: oklch.h,
  }));
}

// =============================================================================
// PALETTE INFO
// =============================================================================

export const CHROMATIC_NEUTRAL_PALETTE_INFO = [
  {
    id: "standard",
    name: "Standard",
    description:
      "Preserved hue, chroma peaks in the 700–600 mid-tones and falls off at both extremes. The all-purpose chromatic neutral for UI token systems.",
  },
  {
    id: "comp-shadows",
    name: "Complementary Shadows",
    description:
      "Dark steps shift toward the complementary hue; lights stay on-hue. Adds real perceptual depth — shadows feel distant and dimensional.",
  },
  {
    id: "split-hue",
    name: "Split Hue",
    description:
      "Darks warm up (+30°), lights cool down (−30°). Mimics natural light physics. Subtle but powerful for UI depth without explicit gradients.",
  },
  {
    id: "hue-drift",
    name: "Hue Drift",
    description:
      "The hue rotates ±15° across the full scale. Feels alive and cohesive without reading as colorful. For sophisticated brand neutrals that resist flatness.",
  },
  {
    id: "chromatic-ink",
    name: "Chromatic Ink",
    description:
      "Inverted chroma curve — darks carry the most saturation, lights are near-white. Mimics how pigment behaves. Ideal for editorial and luxury UI.",
  },
  {
    id: "surface-elevation",
    name: "Surface / Elevation",
    description:
      "Flat, even chroma throughout — elevation is communicated by lightness alone. Pairs perfectly as dark-mode (975–500) and light-mode (400–50) surface stacks.",
  },
];

// =============================================================================
// MAIN EXPORT
// =============================================================================

const VARIANT_MAP = {
  standard: standardNeutral,
  "comp-shadows": complementaryShadowsNeutral,
  "split-hue": splitHueNeutral,
  "hue-drift": hueDriftNeutral,
  "chromatic-ink": chromaticInkNeutral,
  "surface-elevation": surfaceElevationNeutral,
};

export default function chromaticNeutralPalGen(baseOklch, type = "standard") {
  validate(baseOklch);

  const fn = VARIANT_MAP[type];
  if (!fn) {
    throw new Error(
      `chromaticNeutralPalGen: unknown type "${type}". Valid types: ${Object.keys(VARIANT_MAP).join(", ")}`,
    );
  }

  return fn(baseOklch);
}

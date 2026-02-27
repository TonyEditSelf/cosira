// achromaticPalGen.js

const LMAX = 0.98;
const LMIN = 0.12;
const CMAX = 0.012;
const CMIN = 0.0;

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

// Semantic names that make no false promises about absolute lightness.
// "Ghost" instead of "White" avoids implying pure white at any base.
const STEP_NAMES = [
  "Shadow", // deepest dark
  "Ink", // very dark
  "Deep", // dark
  "Dim", // mid-dark
  "Dusk", // slightly dark
  "Mist", // mid
  "Haze", // slightly light
  "Soft", // light
  "Pale", // very light
  "Ghost", // lightest — intentionally avoids "White"
];

// ─── Chroma bell curve ────────────────────────────────────────────────────────
// Reduces chroma at lightness extremes where the OKLCH gamut narrows.
// t = 0..1 position in the step array (0=darkest, 1=lightest)
function bellChroma(baseC, t, intensity = 0.4) {
  const mid = t * 2 - 1; // -1 to +1
  const scale = 1 - mid * mid * intensity;
  return clamp(baseC * scale, CMIN, CMAX);
}

// ─── Even lightness steps across a spread ────────────────────────────────────
// Clamps the start/end BEFORE distributing so steps are always evenly spread
// within the valid range — no two adjacent steps can collapse to the same value.
function stepL(baseL, t, spread, lMin = LMIN, lMax = LMAX) {
  // Ideal unclamped range centered on baseL
  let start = baseL - spread / 2;
  let end = baseL + spread / 2;

  // If either end exceeds bounds, shift the whole range instead of clamping
  // individual steps — this preserves even spacing.
  if (start < lMin) {
    end += lMin - start;
    start = lMin;
  }
  if (end > lMax) {
    start -= end - lMax;
    end = lMax;
  }

  // Final safety clamp on start (in case spread > total range)
  start = clamp(start, lMin, lMax);
  end = clamp(end, lMin, lMax);

  return start + t * (end - start);
}

// ─── Core builder ─────────────────────────────────────────────────────────────
// Builds a 10-step array. Each variant tweaks spread, chroma, hue, or curve.
function buildPalette(baseOklch, overrideFn) {
  return Array.from({ length: 10 }, (_, i) => {
    const t = i / 9; // 0 → 1
    const { l, c, h } = overrideFn(t, i);
    return {
      name: STEP_NAMES[i],
      value: { ...baseOklch, l, c, h },
    };
  });
}

// ─── Input validation ─────────────────────────────────────────────────────────
function validate(baseOklch) {
  if (!baseOklch || typeof baseOklch.l !== "number" || isNaN(baseOklch.l)) {
    throw new Error(
      `achromaticPalGen: expected { l, c, h }, got ${JSON.stringify(baseOklch)}`,
    );
  }
}

// =============================================================================
// VARIANTS
// =============================================================================

// ─── 1. Classic ───────────────────────────────────────────────────────────────
// Even perceptual steps, gentle chroma bell curve, full spread.
function classicAchromatic(baseOklch) {
  const baseL = clamp(baseOklch.l, LMIN, LMAX);
  const baseC = clamp(baseOklch.c, CMIN, CMAX) * 0.8;

  return buildPalette(baseOklch, (t) => ({
    l: stepL(baseL, t, 0.75),
    c: bellChroma(baseC, t, 0.4),
    h: baseOklch.h,
  }));
}

// ─── 2. Warm Gray ─────────────────────────────────────────────────────────────
// Forces a warm sandy/beige hue (h≈65). Ignores input hue.
// More chroma in the lights for that parchment feel.
function warmGrayAchromatic(baseOklch) {
  const baseL = clamp(baseOklch.l, LMIN, LMAX);
  const baseC = 0.009;
  const warmH = 65;

  return buildPalette(baseOklch, (t) => ({
    l: stepL(baseL, t, 0.78),
    // More chroma in lights — warm ivory, not cold white
    c: clamp(baseC * (0.6 + t * 0.8), CMIN, CMAX),
    h: warmH,
  }));
}

// ─── 3. Cool Gray ─────────────────────────────────────────────────────────────
// Forces a cool blue-slate hue (h≈240). Ignores input hue.
// Slightly more chroma in darks for that ink-on-metal feel.
function coolGrayAchromatic(baseOklch) {
  const baseL = clamp(baseOklch.l, LMIN, LMAX);
  const baseC = 0.008;
  const coolH = 240;

  return buildPalette(baseOklch, (t) => ({
    l: stepL(baseL, t, 0.78),
    // More chroma in darks — cool shadows, clean lights
    c: clamp(baseC * (1.4 - t * 0.8), CMIN, CMAX),
    h: coolH,
  }));
}

// ─── 4. Tinted ────────────────────────────────────────────────────────────────
// Preserves input hue. Chroma ramps UP toward the lights.
// Use when you want your "white" to carry a hint of color (e.g. rose white).
function tintedAchromatic(baseOklch) {
  const baseL = clamp(baseOklch.l, LMIN, LMAX);
  const baseC = clamp(baseOklch.c, CMIN, CMAX);

  return buildPalette(baseOklch, (t) => ({
    l: stepL(baseL, t, 0.74),
    // Darks: minimal chroma. Lights: up to 1.5× base chroma.
    c: clamp(baseC * (0.3 + t * 1.2), CMIN, CMAX),
    h: baseOklch.h,
  }));
}

// ─── 5. Contrast ──────────────────────────────────────────────────────────────
// Uneven distribution — compressed in mid-tones, stretched at extremes.
// Designed for UI systems that need clear text/background contrast ratios.
function contrastAchromatic(baseOklch) {
  const baseL = clamp(baseOklch.l, LMIN, LMAX);
  const baseC = clamp(baseOklch.c, CMIN, CMAX) * 0.7;

  return buildPalette(baseOklch, (t) => {
    // Ease-in-out curve: pushes steps toward the extremes
    const curved = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    return {
      l: stepL(baseL, curved, 0.82),
      c: bellChroma(baseC, t, 0.5),
      h: baseOklch.h,
    };
  });
}

// ─── 6. Muted ─────────────────────────────────────────────────────────────────
// Near-zero chroma throughout. As neutral as it gets without being pure gray.
// Flat, minimal, Scandinavian-design energy.
function mutedAchromatic(baseOklch) {
  const baseL = clamp(baseOklch.l, LMIN, LMAX);

  return buildPalette(baseOklch, (t) => ({
    l: stepL(baseL, t, 0.76),
    c: clamp(0.003 + t * 0.002, CMIN, CMAX), // barely perceptible
    h: baseOklch.h,
  }));
}

// ─── 7. Print ─────────────────────────────────────────────────────────────────
// Compressed range (L 0.18–0.88). Never goes near pure white or black.
// Designed for print/PDF where ink extremes look wrong.
function printAchromatic(baseOklch) {
  const baseL = clamp(baseOklch.l, 0.18, 0.88);
  const baseC = clamp(baseOklch.c, CMIN, CMAX) * 0.7;

  return buildPalette(baseOklch, (t) => ({
    l: clamp(0.18 + t * 0.7, 0.18, 0.88),
    c: bellChroma(baseC, t, 0.35),
    h: baseOklch.h,
  }));
}

// ─── 8. Dark Mode ─────────────────────────────────────────────────────────────
// Base becomes a mid-dark surface. Steps go from near-black up to ~0.6 max.
// Use for dark-mode UI surface hierarchies (background → card → elevated).
function darkModeAchromatic(baseOklch) {
  const baseL = clamp(baseOklch.l, LMIN, 0.65);
  const baseC = clamp(baseOklch.c, CMIN, CMAX) * 0.9;

  return buildPalette(baseOklch, (t) => ({
    l: clamp(LMIN + t * 0.52, LMIN, 0.65),
    c: bellChroma(baseC, t, 0.3),
    h: baseOklch.h,
  }));
}

// ─── 9. Vintage ───────────────────────────────────────────────────────────────
// Warm yellow-brown hue (h≈75), higher chroma in mid-tones,
// compressed lightness range (avoids modern pure-white extremes).
// Think aged paper, sepia photographs.
function vintageAchromatic(baseOklch) {
  const baseL = clamp(baseOklch.l, 0.16, 0.92);
  const vintageH = 75;

  return buildPalette(baseOklch, (t) => ({
    l: clamp(0.16 + t * 0.76, 0.16, 0.92),
    // Peak chroma in the mid-tones — gives that aged, stained quality
    c: clamp(0.005 + Math.sin(t * Math.PI) * 0.007, CMIN, CMAX),
    h: vintageH,
  }));
}

// ─── 10. Soft ─────────────────────────────────────────────────────────────────
// Gentle spread, higher-than-average chroma, preserves hue.
// Pastel-adjacent — airy and approachable. Good for kids' UI or wellness apps.
function softAchromatic(baseOklch) {
  const baseL = clamp(baseOklch.l, 0.3, LMAX);
  const baseC = 0.011;

  return buildPalette(baseOklch, (t) => ({
    // Narrower spread, biased toward lighter values
    l: clamp(0.3 + t * 0.65, 0.3, LMAX),
    c: clamp(baseC * (0.7 + t * 0.5), CMIN, CMAX),
    h: baseOklch.h,
  }));
}

// =============================================================================
// PALETTE INFO — mirrors your MONO_PALETTE_INFO shape
// =============================================================================

export const ACHROMATIC_PALETTE_INFO = [
  {
    id: "classic",
    name: "Classic",
    description:
      "Evenly-spaced perceptual steps (Shadow → Ghost) with a gentle chroma bell curve. The all-purpose achromatic scale.",
  },
  {
    id: "warm-gray",
    name: "Warm Gray",
    description:
      "Forces a sandy, amber-adjacent hue (h≈65). Chroma ramps toward the lights — warm Pale and Ghost, like parchment or linen.",
  },
  {
    id: "cool-gray",
    name: "Cool Gray",
    description:
      "Forces a blue-slate hue (h≈240). More chroma in the darks — cool inky Shadows, crisp airy Ghosts.",
  },
  {
    id: "tinted",
    name: "Tinted",
    description:
      "Preserves your input hue. Chroma ramps strongly toward the lights so Pale and Ghost carry a visible whisper of color.",
  },
  {
    id: "contrast",
    name: "Contrast",
    description:
      "Ease-curve distribution: wider gaps at Shadow/Ghost extremes, compressed in the Mist/Haze mid-tones. Built for text-on-background contrast ratios.",
  },
  {
    id: "muted",
    name: "Muted",
    description:
      "Near-zero chroma throughout. Flat, minimal, Scandinavian. As neutral as OKLCH gets without being pure mathematical gray.",
  },
  {
    id: "print",
    name: "Print",
    description:
      "Compressed range (L 0.18–0.88). Shadow never goes ink-black; Ghost never goes paper-white. Designed for print and PDF.",
  },
  {
    id: "dark-mode",
    name: "Dark Mode",
    description:
      "All 10 steps live in the dark half (L 0.12–0.65). A surface hierarchy for dark UI: Shadow=background, Ghost=elevated card.",
  },
  {
    id: "vintage",
    name: "Vintage",
    description:
      "Warm yellow-brown hue (h≈75), sine-curve chroma peak in mid-tones, compressed range. Aged paper, sepia photographs.",
  },
  {
    id: "soft",
    name: "Soft",
    description:
      "Lighter-biased range (L 0.3–0.98), higher chroma overall. Pastel-adjacent and airy — wellness apps, children's UI.",
  },
];

// =============================================================================
// MAIN EXPORT
// =============================================================================

const VARIANT_MAP = {
  classic: classicAchromatic,
  "warm-gray": warmGrayAchromatic,
  "cool-gray": coolGrayAchromatic,
  tinted: tintedAchromatic,
  contrast: contrastAchromatic,
  muted: mutedAchromatic,
  print: printAchromatic,
  "dark-mode": darkModeAchromatic,
  vintage: vintageAchromatic,
  soft: softAchromatic,
};

export default function achromaticPalGen(baseOklch, type = "classic") {
  validate(baseOklch);

  const fn = VARIANT_MAP[type];
  if (!fn) {
    throw new Error(
      `achromaticPalGen: unknown type "${type}". Valid types: ${Object.keys(VARIANT_MAP).join(", ")}`,
    );
  }

  return fn(baseOklch);
}

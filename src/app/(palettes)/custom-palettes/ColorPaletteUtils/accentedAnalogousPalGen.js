import { clampToGamut } from "./gamutMapping";

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/* ---------------- PERCEPTUAL CHROMA BALANCE ---------------- */
function getChromaCompensation(h) {
  const hue = ((h % 360) + 360) % 360;
  if (hue >= 30 && hue < 90) return 1.15; // Yellow-green needs boost
  if (hue >= 90 && hue < 150) return 1.0; // Green is naturally vibrant
  if (hue >= 150 && hue < 210) return 0.85; // Cyan-blue compresses
  if (hue >= 210 && hue < 270) return 0.95; // Blue needs slight boost
  if (hue >= 270 && hue < 330) return 1.1; // Purple needs more
  return 1.05; // Red-orange
}

/* ---------------- CONTRAST VALIDATION ---------------- */
function oklchToSrgb(l, c, h) {
  // Simplified conversion - you'd use your actual converter
  // This is a placeholder for contrast checking
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  // Return approximate sRGB for contrast calc (you'd use real conversion)
  return { r: l, g: l, b: l }; // Placeholder
}

function getContrastRatio(l1, l2) {
  // Simplified WCAG contrast - assumes OKLCH lightness approximates relative luminance
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/* ---------------- ENHANCED CONFIG ---------------- */
const CONFIG = {
  lightnessMin: 0.25,
  lightnessMax: 0.97,
  chromaMin: 0.05,
  chromaMax: 0.37, // Increased for punchier colors
  chromaMultiplier: 1,
  accentChromaBoost: 1.45, // Stronger accent
  minContrastRatio: 4.5, // WCAG AA
};

/* ---------------- ADAPTIVE LIGHTNESS STEPS ---------------- */
function getAdaptiveLightnessSteps(baseL) {
  // Larger steps in mid-range, smaller at extremes
  const distanceFromMid = Math.abs(baseL - 0.6);
  const stepMultiplier = 1.2 - distanceFromMid;

  return {
    darkStep: 0.25 * stepMultiplier,
    lightStep: 0.22 * stepMultiplier,
  };
}

/* ---------------- COLOR CREATION WITH VALIDATION ---------------- */
function createColor(l, c, h, targetContrast = null, contrastAgainst = null) {
  let clampedL = clamp(l, CONFIG.lightnessMin, CONFIG.lightnessMax);
  const normalizedC = clamp(c, CONFIG.chromaMin, CONFIG.chromaMax);
  const compensatedC = normalizedC * getChromaCompensation(h);
  const gamutSafeC = clampToGamut(clampedL, compensatedC, h);

  // Adjust lightness if contrast requirement exists
  if (targetContrast && contrastAgainst !== null) {
    let attempts = 0;
    while (
      getContrastRatio(clampedL, contrastAgainst) < targetContrast &&
      attempts < 10
    ) {
      clampedL = clampedL < contrastAgainst ? clampedL - 0.05 : clampedL + 0.05;
      clampedL = clamp(clampedL, CONFIG.lightnessMin, CONFIG.lightnessMax);
      attempts++;
    }
  }

  return { l: clampedL, c: gamutSafeC, h: (h + 360) % 360 };
}

/* ---------------- 3-TONE UI SCALE WITH ADAPTIVE STEPS ---------------- */
function makeTones(l, c, h, isAccent = false) {
  const steps = getAdaptiveLightnessSteps(l);
  const chromaBoost = isAccent ? CONFIG.accentChromaBoost : 1.0;

  // Calculate target lightness values
  const darkL = l - steps.darkStep;
  const lightL = l + steps.lightStep;

  return {
    dark: createColor(
      darkL,
      c * chromaBoost * 1.1,
      h + 3,
      CONFIG.minContrastRatio,
      0.95, // Contrast against light backgrounds
    ),
    base: createColor(l, c * chromaBoost, h),
    light: createColor(
      lightL,
      c * chromaBoost * 0.8,
      h - 2,
      CONFIG.minContrastRatio,
      0.15, // Contrast against dark backgrounds
    ),
  };
}

/* ---------------- MAIN GENERATOR (12 COLORS) ---------------- */
export default function accentedAnalogousPalGen(oklch) {
  let baseL = clamp(oklch.l, CONFIG.lightnessMin, CONFIG.lightnessMax);
  let baseC = clamp(
    oklch.c * CONFIG.chromaMultiplier,
    CONFIG.chromaMin,
    CONFIG.chromaMax,
  );
  let baseH = oklch.h;

  /* --- Hue structure (analogous ±30°, accent at 180°) --- */
  const a1H = (baseH - 30 + 360) % 360;
  const a2H = (baseH + 30) % 360;
  const accentH = (baseH + 180) % 360;

  /* --- Generate tone sets --- */
  const baseT = makeTones(baseL, baseC, baseH, false);
  const a1T = makeTones(baseL, baseC * 0.92, a1H, false);
  const a2T = makeTones(baseL, baseC * 0.92, a2H, false);
  const accentT = makeTones(baseL, baseC, accentH, true); // Accent gets boost

  /* --- Return 12 colors --- */
  return [
    { name: "Analog-1 Dark", value: a1T.dark },
    { name: "Analog-1", value: a1T.base },
    { name: "Analog-1 Light", value: a1T.light },

    { name: "Base Dark", value: baseT.dark },
    { name: "Base", value: baseT.base },
    { name: "Base Light", value: baseT.light },

    { name: "Analog-2 Dark", value: a2T.dark },
    { name: "Analog-2", value: a2T.base },
    { name: "Analog-2 Light", value: a2T.light },

    { name: "Accent Dark", value: accentT.dark },
    { name: "Accent", value: accentT.base },
    { name: "Accent Light", value: accentT.light },
  ];
}

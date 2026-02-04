/**
 * Compound Palette Generator
 * Generates 12 colors using compound harmony (complementary + analogous)
 * Rooted in color science using perceptually uniform OKLCH color space
 */

// ============================================================================
// COLOR SPACE CONVERSION & GAMUT UTILITIES
// ============================================================================

function oklchToLinearSRGB(oklch) {
  const { l, c, h } = oklch;

  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  const r = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const b_ = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  return { r, g, b: b_ };
}

function linearToSRGB(linear) {
  const gamma = (c) => {
    const abs = Math.abs(c);
    if (abs <= 0.0031308) return c * 12.92;
    return (Math.sign(c) || 1) * (1.055 * Math.pow(abs, 1 / 2.4) - 0.055);
  };

  return {
    r: gamma(linear.r),
    g: gamma(linear.g),
    b: gamma(linear.b),
  };
}

function isInGamut(oklch, tolerance = 0.00001) {
  const linear = oklchToLinearSRGB(oklch);
  const srgb = linearToSRGB(linear);

  return (
    srgb.r >= -tolerance &&
    srgb.r <= 1 + tolerance &&
    srgb.g >= -tolerance &&
    srgb.g <= 1 + tolerance &&
    srgb.b >= -tolerance &&
    srgb.b <= 1 + tolerance
  );
}

function constrainToGamut(oklch) {
  if (isInGamut(oklch)) return oklch;

  let low = 0;
  let high = oklch.c;
  let bestC = 0;

  for (let i = 0; i < 20; i++) {
    const mid = (low + high) / 2;
    const test = { ...oklch, c: mid };

    if (isInGamut(test)) {
      bestC = mid;
      low = mid;
    } else {
      high = mid;
    }
  }

  return { ...oklch, c: bestC };
}

// ============================================================================
// COLOR MANIPULATION UTILITIES
// ============================================================================

function rotateHue(color, degrees) {
  return constrainToGamut({
    ...color,
    h: (color.h + degrees + 360) % 360,
  });
}

function lighten(color, amount = 0.3) {
  const newL = color.l + (1 - color.l) * amount;
  const newC = color.c * (1 - amount * 0.3);
  return constrainToGamut({ ...color, l: newL, c: newC });
}

function darken(color, amount = 0.3) {
  const newL = color.l * (1 - amount);
  const newC = color.c * (1 + amount * 0.2);
  return constrainToGamut({ ...color, l: newL, c: Math.min(0.37, newC) });
}

// ============================================================================
// COMPOUND PALETTE GENERATOR
// ============================================================================

/**
 * Generate a 12-color compound palette
 * Combines complementary harmony (opposite hues) with analogous harmony (neighboring hues)
 *
 * @param {Object} oklch - Base color in OKLCH format {l, c, h}
 * @returns {Array} 12 colors as array of {name, value} objects
 */
export default function compoundPalGen(oklch) {
  const base = constrainToGamut(oklch);

  // Primary group: Base + analogous neighbors (3 hues around base)
  const analogWarm = rotateHue(base, -30); // 30° warmer
  const analogCool = rotateHue(base, 30); // 30° cooler

  // Secondary group: Complement + its analogous neighbors (3 hues around complement)
  const complement = rotateHue(base, 180);
  const compAnalogA = rotateHue(complement, -30);
  const compAnalogB = rotateHue(complement, 30);

  // Return 12 colors with tonal variations
  return [
    { name: "Analog-Warm-Light", value: lighten(analogWarm, 0.25) },
    { name: "Analog-Warm", value: analogWarm },
    { name: "Base-Light", value: lighten(base, 0.25) },
    { name: "Base", value: base },
    { name: "Base-Dark", value: darken(base, 0.25) },
    { name: "Analog-Cool", value: analogCool },
    { name: "Complement-Analog-A-Light", value: lighten(compAnalogA, 0.25) },
    { name: "Complement-Analog-A", value: compAnalogA },
    { name: "Complement-Light", value: lighten(complement, 0.25) },
    { name: "Complement", value: complement },
    { name: "Complement-Dark", value: darken(complement, 0.25) },
    { name: "Complement-Analog-B", value: compAnalogB },
  ];
}

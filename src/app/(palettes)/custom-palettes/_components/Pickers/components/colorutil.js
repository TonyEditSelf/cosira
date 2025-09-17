// OKLCH to RGB conversion functions
export function oklchToRgb(l, c, h) {
  // Convert OKLCH to linear RGB
  const hRad = (h * Math.PI) / 180;

  // Convert to OKLab
  const a = c * Math.cos(hRad);
  const b_component = c * Math.sin(hRad);

  // OKLab to linear RGB matrix
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b_component;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b_component;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b_component;

  const l2 = l_ * l_ * l_;
  const m2 = m_ * m_ * m_;
  const s2 = s_ * s_ * s_;

  // Linear RGB
  const r_linear = +4.0767416621 * l2 - 3.3077115913 * m2 + 0.2309699292 * s2;
  const g_linear = -1.2684380046 * l2 + 2.6097574011 * m2 - 0.3413193965 * s2;
  const b_linear = -0.0041960863 * l2 - 0.7034186147 * m2 + 1.707614701 * s2;

  // Convert to sRGB
  const r = linearToSrgb(r_linear);
  const g = linearToSrgb(g_linear);
  const b = linearToSrgb(b_linear);

  // Clamp values between 0 and 1
  return [
    Math.max(0, Math.min(1, r)),
    Math.max(0, Math.min(1, g)),
    Math.max(0, Math.min(1, b)),
  ];
}

function linearToSrgb(c) {
  if (c <= 0.0031308) {
    return 12.92 * c;
  } else {
    return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  }
}

export function oklchToCss(l, c, h) {
  return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)}deg)`;
}

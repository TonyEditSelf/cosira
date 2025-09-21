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

function srgbToLinear(c) {
  if (c <= 0.04045) {
    return c / 12.92;
  } else {
    return Math.pow((c + 0.055) / 1.055, 2.4);
  }
}

// RGB to OKLCH conversion
export function rgbToOklch(r, g, b) {
  // Convert sRGB to linear RGB
  const r_linear = srgbToLinear(r);
  const g_linear = srgbToLinear(g);
  const b_linear = srgbToLinear(b);

  // Linear RGB to OKLab matrix
  const l =
    0.4122214708 * r_linear + 0.5363325363 * g_linear + 0.0514459929 * b_linear;
  const m =
    0.2119034982 * r_linear + 0.6806995451 * g_linear + 0.1073969566 * b_linear;
  const s =
    0.0883024619 * r_linear + 0.2817188376 * g_linear + 0.6299787005 * b_linear;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  // Convert to OKLab
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const b_lab = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  // Convert to OKLCH
  const lightness = L;
  const chroma = Math.sqrt(a * a + b_lab * b_lab);
  let hue = (Math.atan2(b_lab, a) * 180) / Math.PI;
  if (hue < 0) hue += 360;

  return {
    l: Math.max(0, Math.min(1, lightness)),
    c: Math.max(0, Math.min(0.4, chroma)),
    h: hue,
  };
}

// Hex to OKLCH conversion
export function hexToOklch(hex) {
  // Remove # if present
  hex = hex.replace("#", "");

  // Parse RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  // Default alpha = 1 (fully opaque)
  let a = 1;
  if (hex.length === 8) {
    a = parseInt(hex.substr(6, 2), 16) / 255;
  }

  const oklch = rgbToOklch(r, g, b);
  return { ...oklch, a };
}

// OKLCH to Hex conversion
export function oklchToHex(l, c, h, a = 1) {
  const [r, g, b] = oklchToRgb(l, c, h);

  const r_hex = Math.round(r * 255)
    .toString(16)
    .padStart(2, "0");
  const g_hex = Math.round(g * 255)
    .toString(16)
    .padStart(2, "0");
  const b_hex = Math.round(b * 255)
    .toString(16)
    .padStart(2, "0");

  const baseHex = `#${r_hex}${g_hex}${b_hex}`;

  // include alpha only if not fully opaque
  if (a < 1) {
    const a_hex = Math.round(a * 255)
      .toString(16)
      .padStart(2, "0");
    return `${baseHex}${a_hex}`;
  }

  return baseHex;
}

export function oklchToCss(l, c, h, a = 1) {
  if (a < 1) {
    return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(
      1
    )}deg / ${a.toFixed(2)})`;
  }
  return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)}deg)`;
}

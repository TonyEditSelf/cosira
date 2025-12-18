export default function doubleSplitCompPalGen(oklch) {
  const LMAX = 0.9;
  const LMIN = 0.3;
  const CMAX = 0.25;
  const CMIN = 0.05;

  const splitAngle = 30; // degrees for split

  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  // Smart lightness adjustment based on input position
  function getLightVariant(l, c) {
    const offset = l < 0.5 ? 0.25 : l < 0.7 ? 0.2 : 0.15;
    return {
      l: clamp(l + offset, LMIN, LMAX),
      c: clamp(c * 0.85, CMIN, CMAX), // Reduce chroma as we lighten
    };
  }

  function getDarkVariant(l, c) {
    const offset = l > 0.7 ? 0.25 : l > 0.5 ? 0.2 : 0.15;
    return {
      l: clamp(l - offset, LMIN, LMAX),
      c: clamp(c * 0.95, CMIN, CMAX), // Slightly reduce chroma for darks (not increase!)
    };
  }

  const baseHue = oklch.h % 360;
  const baseL = clamp(oklch.l, LMIN, LMAX);
  const baseC = clamp(oklch.c, CMIN, CMAX);

  // BASE COLOR GROUP (3 colors)
  const base = { ...oklch, h: baseHue, l: baseL, c: baseC };
  const baseLight = {
    ...oklch,
    h: baseHue,
    ...getLightVariant(baseL, baseC),
  };
  const baseDark = { ...oklch, h: baseHue, ...getDarkVariant(baseL, baseC) };

  // ANALOGOUS SPLITS (2 colors) - ±30° from base
  const analogWarm = {
    ...oklch,
    h: (baseHue + splitAngle) % 360,
    l: clamp(baseL + 0.08, LMIN, LMAX), // Slightly lighter
    c: clamp(baseC * 0.95, CMIN, CMAX), // Slightly less saturated
  };

  const analogCool = {
    ...oklch,
    h: (baseHue - splitAngle + 360) % 360,
    l: clamp(baseL + 0.08, LMIN, LMAX),
    c: clamp(baseC * 0.95, CMIN, CMAX),
  };

  // COMPLEMENT GROUP (3 colors)
  const compHue = (baseHue + 180) % 360;
  const comp = {
    ...oklch,
    h: compHue,
    l: baseL, // Match base lightness for balance
    c: clamp(baseC * 1.05, CMIN, CMAX), // Slightly more saturated for accent
  };

  const compLight = {
    ...oklch,
    h: compHue,
    ...getLightVariant(baseL, baseC * 1.05),
  };
  const compDark = {
    ...oklch,
    h: compHue,
    ...getDarkVariant(baseL, baseC * 1.05),
  };

  // COMPLEMENT SPLITS (2 colors) - ±30° from complement
  const compSplitWarm = {
    ...oklch,
    h: (compHue + splitAngle) % 360,
    l: clamp(baseL - 0.08, LMIN, LMAX), // Slightly darker for contrast
    c: clamp(baseC * 1.0, CMIN, CMAX),
  };

  const compSplitCool = {
    ...oklch,
    h: (compHue - splitAngle + 360) % 360,
    l: clamp(baseL - 0.08, LMIN, LMAX),
    c: clamp(baseC * 1.0, CMIN, CMAX),
  };

  return [
    { name: "Base-Light", value: baseLight },
    { name: "Base", value: base },
    { name: "Base-Dark", value: baseDark },

    { name: "Analog-Warm", value: analogWarm },
    { name: "Analog-Cool", value: analogCool },

    { name: "Accent-Light", value: compLight },
    { name: "Accent", value: comp },
    { name: "Accent-Dark", value: compDark },

    { name: "Accent-Split-Warm", value: compSplitWarm },
    { name: "Accent-Split-Cool", value: compSplitCool },
  ];
}

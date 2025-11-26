export default function designsystemPalGen(oklch) {
  const CMAX = 0.25;
  const CMIN = 0.04;

  // Base hue and complementary hue
  const primaryHue = oklch.h % 360;
  const accentHue = (oklch.h + 180) % 360;

  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  // PRE-Clamped base chroma
  const baseChroma = clamp(oklch.c, CMIN, CMAX);

  // ---- PRIMARY 900 ----
  const P900_c = clamp(baseChroma * 1.1, CMIN, CMAX);
  const P900 = { ...oklch, h: primaryHue, l: 0.25, c: P900_c };

  // ---- PRIMARY 700 ----
  const P700_c = clamp(baseChroma * 1.05, CMIN, CMAX);
  const P700 = { ...oklch, h: primaryHue, l: 0.45, c: P700_c };

  // ---- PRIMARY 500 ----
  const P500_c = clamp(baseChroma * 1.0, CMIN, CMAX);
  const P500 = { ...oklch, h: primaryHue, l: 0.65, c: P500_c };

  // ---- PRIMARY 300 ----
  const P300_c = clamp(baseChroma * 0.8, CMIN, CMAX);
  const P300 = { ...oklch, h: primaryHue, l: 0.85, c: P300_c };

  // ---- PRIMARY 100 ----
  const P100_c = clamp(baseChroma * 0.4, CMIN, CMAX);
  const P100 = { ...oklch, h: primaryHue, l: 0.95, c: P100_c };

  // ---- ACCENT 900 ----
  const A900_c = clamp(baseChroma * 1.1, CMIN, CMAX);
  const A900 = { ...oklch, h: accentHue, l: 0.25, c: A900_c };

  // ---- ACCENT 700 ----
  const A700_c = clamp(baseChroma * 1.05, CMIN, CMAX);
  const A700 = { ...oklch, h: accentHue, l: 0.45, c: A700_c };

  // ---- ACCENT 500 ----
  const A500_c = clamp(baseChroma * 1.0, CMIN, CMAX);
  const A500 = { ...oklch, h: accentHue, l: 0.65, c: A500_c };

  // ---- ACCENT 300 ----
  const A300_c = clamp(baseChroma * 0.8, CMIN, CMAX);
  const A300 = { ...oklch, h: accentHue, l: 0.85, c: A300_c };

  // ---- ACCENT 100 ----
  const A100_c = clamp(baseChroma * 0.4, CMIN, CMAX);
  const A100 = { ...oklch, h: accentHue, l: 0.95, c: A100_c };

  return [
    { name: "Primary-900", value: P900 },
    { name: "Primary-700", value: P700 },
    { name: "Primary-500", value: P500 },
    { name: "Primary-300", value: P300 },
    { name: "Primary-100", value: P100 },

    { name: "Accent-900", value: A900 },
    { name: "Accent-700", value: A700 },
    { name: "Accent-500", value: A500 },
    { name: "Accent-300", value: A300 },
    { name: "Accent-100", value: A100 },
  ];
}

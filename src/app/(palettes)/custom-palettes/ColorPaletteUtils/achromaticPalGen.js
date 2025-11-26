export default function achromaticPalGen(baseOklch) {
  const LMAX = 0.98;
  const LMIN = 0.12;
  const CMAX = 0.01;
  const CMIN = 0.0;

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  // Base values (already clamped in original)
  const baseL = clamp(baseOklch.l, LMIN, LMAX);
  const baseC = clamp(baseOklch.c, CMIN, CMAX);

  // Constant chroma scaling used for ALL variants
  const scaledC = clamp(baseC * 0.8, CMIN, CMAX);

  // --- OFFSETS ---
  const off0 = -0.4;
  const off1 = -0.3;
  const off2 = -0.2;
  const off3 = -0.1;
  const off4 = -0.05;
  const off5 = 0;
  const off6 = 0.08;
  const off7 = 0.16;
  const off8 = 0.26;
  const off9 = 0.35;

  // --- INDIVIDUAL LIGHTNESS VALUES ---
  const L0 = clamp(baseL + off0, LMIN, LMAX);
  const L1 = clamp(baseL + off1, LMIN, LMAX);
  const L2 = clamp(baseL + off2, LMIN, LMAX);
  const L3 = clamp(baseL + off3, LMIN, LMAX);
  const L4 = clamp(baseL + off4, LMIN, LMAX);
  const L5 = clamp(baseL + off5, LMIN, LMAX);
  const L6 = clamp(baseL + off6, LMIN, LMAX);
  const L7 = clamp(baseL + off7, LMIN, LMAX);
  const L8 = clamp(baseL + off8, LMIN, LMAX);
  const L9 = clamp(baseL + off9, LMIN, LMAX);

  // --- COLOR OBJECTS ---
  const Black = {
    ...baseOklch,
    c: scaledC,
    l: L0,
  };

  const Darkest = {
    ...baseOklch,
    c: scaledC,
    l: L1,
  };

  const Darker = {
    ...baseOklch,
    c: scaledC,
    l: L2,
  };

  const Dark = {
    ...baseOklch,
    c: scaledC,
    l: L3,
  };

  const MediumDark = {
    ...baseOklch,
    c: scaledC,
    l: L4,
  };

  const Medium = {
    ...baseOklch,
    c: scaledC,
    l: L5,
  };

  const MediumLight = {
    ...baseOklch,
    c: scaledC,
    l: L6,
  };

  const Light = {
    ...baseOklch,
    c: scaledC,
    l: L7,
  };

  const Lighter = {
    ...baseOklch,
    c: scaledC,
    l: L8,
  };

  const White = {
    ...baseOklch,
    c: scaledC,
    l: L9,
  };

  return [
    { name: "Black", value: Black },
    { name: "Darkest", value: Darkest },
    { name: "Darker", value: Darker },
    { name: "Dark", value: Dark },
    { name: "Medium-Dark", value: MediumDark },
    { name: "Medium", value: Medium },
    { name: "Medium-Light", value: MediumLight },
    { name: "Light", value: Light },
    { name: "Lighter", value: Lighter },
    { name: "White", value: White },
  ];
}

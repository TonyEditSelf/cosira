export default function dataVizPalettePalGen(baseOklch) {
  // 1. Define safe, consistent boundaries (strength retained)
  const LMAX = 0.85;
  const LMIN = 0.4;
  const CMAX = 0.22;
  const CMIN = 0.1;

  // 2. Define safe, moderate target L and C for consistency (strength retained)
  const targetL = Math.min(LMAX, Math.max(LMIN, 0.65)); // Consistent Lightness
  const targetC = Math.min(CMAX, Math.max(CMIN, 0.16)); // Consistent Chroma

  const baseHue = baseOklch.h % 360;

  // 3. Define Perceptually Tuned Offsets (strength retained)
  // These offsets ensure colors are maximally distinct.
  const hueOffsets = [0, 32, 70, 112, 158, 205, 252, 296, 328, 356];

  // Helper function to clamp values
  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  // Helper function to create a single color object (clean structure)
  function makeColor(offset, cMult = 1, lShift = 0) {
    return {
      // Retains other properties from baseOklch (like alpha/opacity if present)
      ...baseOklch,
      // Calculate Hue and wrap it
      h: (baseHue + offset + 360) % 360,
      // Calculate Chroma based on targetC and multiplier, then clamp
      c: clamp(targetC * cMult, CMIN, CMAX),
      // Calculate Lightness based on targetL and shift, then clamp
      l: clamp(targetL + lShift, LMIN, LMAX),
    };
  }

  // 4. Define the 10 colors using the helper and tuning parameters
  return [
    { name: "Color-1", value: makeColor(hueOffsets[0], 1.0, 0.0) }, // Base (H0)
    { name: "Color-2", value: makeColor(hueOffsets[1], 1.05, 0.03) }, // H32
    { name: "Color-3", value: makeColor(hueOffsets[2], 0.92, -0.05) }, // H70
    { name: "Color-4", value: makeColor(hueOffsets[3], 0.9, -0.08) }, // H112
    { name: "Color-5", value: makeColor(hueOffsets[4], 1.0, 0.02) }, // H158
    { name: "Color-6", value: makeColor(hueOffsets[5], 1.03, 0.0) }, // H205 (Approx. Complementary)
    { name: "Color-7", value: makeColor(hueOffsets[6], 0.95, -0.03) }, // H252
    { name: "Color-8", value: makeColor(hueOffsets[7], 1.08, 0.05) }, // H296
    { name: "Color-9", value: makeColor(hueOffsets[8], 1.1, 0.04) }, // H328
    { name: "Color-10", value: makeColor(hueOffsets[9], 0.98, -0.02) }, // H356
  ];
}

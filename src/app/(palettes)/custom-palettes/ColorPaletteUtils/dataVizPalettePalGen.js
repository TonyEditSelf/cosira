export default function dataVizPalettePalGen(oklch, dataVizPalType) {
  if (dataVizPalType === "dataVizPalOne") {
    const LMAX = 0.85;
    const LMIN = 0.4;
    const CMAX = 0.22;
    const CMIN = 0.1;

    // Original fixed targets (for consistent palette)
    const targetL = Math.min(LMAX, Math.max(LMIN, 0.65));
    const targetC = Math.min(CMAX, Math.max(CMIN, 0.16));

    // Only hue is taken from the input color
    const baseHue = oklch.h % 360;

    // Same perceptual offsets
    const hueOffsets = [0, 32, 70, 112, 158, 205, 252, 296, 328, 356];

    // -----------------------------------------------------------
    // Color 1
    const c1Hue = (baseHue + hueOffsets[0] + 360) % 360;
    const c1C = Math.min(CMAX, Math.max(CMIN, targetC * 1.0));
    const c1L = Math.min(LMAX, Math.max(LMIN, targetL + 0.0));
    const color1 = { ...oklch, h: c1Hue, c: c1C, l: c1L };

    // Color 2
    const c2Hue = (baseHue + hueOffsets[1] + 360) % 360;
    const c2C = Math.min(CMAX, Math.max(CMIN, targetC * 1.05));
    const c2L = Math.min(LMAX, Math.max(LMIN, targetL + 0.03));
    const color2 = { ...oklch, h: c2Hue, c: c2C, l: c2L };

    // Color 3
    const c3Hue = (baseHue + hueOffsets[2] + 360) % 360;
    const c3C = Math.min(CMAX, Math.max(CMIN, targetC * 0.92));
    const c3L = Math.min(LMAX, Math.max(LMIN, targetL - 0.05));
    const color3 = { ...oklch, h: c3Hue, c: c3C, l: c3L };

    // Color 4
    const c4Hue = (baseHue + hueOffsets[3] + 360) % 360;
    const c4C = Math.min(CMAX, Math.max(CMIN, targetC * 0.9));
    const c4L = Math.min(LMAX, Math.max(LMIN, targetL - 0.08));
    const color4 = { ...oklch, h: c4Hue, c: c4C, l: c4L };

    // Color 5
    const c5Hue = (baseHue + hueOffsets[4] + 360) % 360;
    const c5C = Math.min(CMAX, Math.max(CMIN, targetC * 1.0));
    const c5L = Math.min(LMAX, Math.max(LMIN, targetL + 0.02));
    const color5 = { ...oklch, h: c5Hue, c: c5C, l: c5L };

    // Color 6
    const c6Hue = (baseHue + hueOffsets[5] + 360) % 360;
    const c6C = Math.min(CMAX, Math.max(CMIN, targetC * 1.03));
    const c6L = Math.min(LMAX, Math.max(LMIN, targetL + 0.0));
    const color6 = { ...oklch, h: c6Hue, c: c6C, l: c6L };

    // Color 7
    const c7Hue = (baseHue + hueOffsets[6] + 360) % 360;
    const c7C = Math.min(CMAX, Math.max(CMIN, targetC * 0.95));
    const c7L = Math.min(LMAX, Math.max(LMIN, targetL - 0.03));
    const color7 = { ...oklch, h: c7Hue, c: c7C, l: c7L };

    // Color 8
    const c8Hue = (baseHue + hueOffsets[7] + 360) % 360;
    const c8C = Math.min(CMAX, Math.max(CMIN, targetC * 1.08));
    const c8L = Math.min(LMAX, Math.max(LMIN, targetL + 0.05));
    const color8 = { ...oklch, h: c8Hue, c: c8C, l: c8L };

    // Color 9
    const c9Hue = (baseHue + hueOffsets[8] + 360) % 360;
    const c9C = Math.min(CMAX, Math.max(CMIN, targetC * 1.1));
    const c9L = Math.min(LMAX, Math.max(LMIN, targetL + 0.04));
    const color9 = { ...oklch, h: c9Hue, c: c9C, l: c9L };

    // Color 10
    const c10Hue = (baseHue + hueOffsets[9] + 360) % 360;
    const c10C = Math.min(CMAX, Math.max(CMIN, targetC * 0.98));
    const c10L = Math.min(LMAX, Math.max(LMIN, targetL - 0.02));
    const color10 = { ...oklch, h: c10Hue, c: c10C, l: c10L };
    // -----------------------------------------------------------

    return [
      { name: "Color-1", value: color1 },
      { name: "Color-2", value: color2 },
      { name: "Color-3", value: color3 },
      { name: "Color-4", value: color4 },
      { name: "Color-5", value: color5 },
      { name: "Color-6", value: color6 },
      { name: "Color-7", value: color7 },
      { name: "Color-8", value: color8 },
      { name: "Color-9", value: color9 },
      { name: "Color-10", value: color10 },
    ];
  } else if (dataVizPalType === "dataVizPalTwo") {
    const baseHue = oklch.h % 360;
    const baseL = oklch.l;
    const baseC = oklch.c;

    function clamp(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    const count = 10;

    // --- COLOR 1 (i = 0) ---
    const t0 = 0 / (count - 1);
    const h0 = (baseHue + (0 - count / 2) * 12) % 360;
    const l0 = clamp(baseL - 0.05 + t0 * 0.15, 0.15, 0.95);
    const c0 = clamp(baseC * 0.7 + Math.sin(t0 * Math.PI) * 0.05, 0.03, 0.2);
    const color1 = { ...oklch, h: h0, l: l0, c: c0 };

    // --- COLOR 2 (i = 1) ---
    const t1 = 1 / (count - 1);
    const h1 = (baseHue + (1 - count / 2) * 12) % 360;
    const l1 = clamp(baseL - 0.05 + t1 * 0.15, 0.15, 0.95);
    const c1 = clamp(baseC * 0.7 + Math.sin(t1 * Math.PI) * 0.05, 0.03, 0.2);
    const color2 = { ...oklch, h: h1, l: l1, c: c1 };

    // --- COLOR 3 (i = 2) ---
    const t2 = 2 / (count - 1);
    const h2 = (baseHue + (2 - count / 2) * 12) % 360;
    const l2 = clamp(baseL - 0.05 + t2 * 0.15, 0.15, 0.95);
    const c2 = clamp(baseC * 0.7 + Math.sin(t2 * Math.PI) * 0.05, 0.03, 0.2);
    const color3 = { ...oklch, h: h2, l: l2, c: c2 };

    // --- COLOR 4 (i = 3) ---
    const t3 = 3 / (count - 1);
    const h3 = (baseHue + (3 - count / 2) * 12) % 360;
    const l3 = clamp(baseL - 0.05 + t3 * 0.15, 0.15, 0.95);
    const c3 = clamp(baseC * 0.7 + Math.sin(t3 * Math.PI) * 0.05, 0.03, 0.2);
    const color4 = { ...oklch, h: h3, l: l3, c: c3 };

    // --- COLOR 5 (i = 4) ---
    const t4 = 4 / (count - 1);
    const h4 = (baseHue + (4 - count / 2) * 12) % 360;
    const l4 = clamp(baseL - 0.05 + t4 * 0.15, 0.15, 0.95);
    const c4 = clamp(baseC * 0.7 + Math.sin(t4 * Math.PI) * 0.05, 0.03, 0.2);
    const color5 = { ...oklch, h: h4, l: l4, c: c4 };

    // --- COLOR 6 (i = 5) ---
    const t5 = 5 / (count - 1);
    const h5 = (baseHue + (5 - count / 2) * 12) % 360;
    const l5 = clamp(baseL - 0.05 + t5 * 0.15, 0.15, 0.95);
    const c5 = clamp(baseC * 0.7 + Math.sin(t5 * Math.PI) * 0.05, 0.03, 0.2);
    const color6 = { ...oklch, h: h5, l: l5, c: c5 };

    // --- COLOR 7 (i = 6) ---
    const t6 = 6 / (count - 1);
    const h6 = (baseHue + (6 - count / 2) * 12) % 360;
    const l6 = clamp(baseL - 0.05 + t6 * 0.15, 0.15, 0.95);
    const c6 = clamp(baseC * 0.7 + Math.sin(t6 * Math.PI) * 0.05, 0.03, 0.2);
    const color7 = { ...oklch, h: h6, l: l6, c: c6 };

    // --- COLOR 8 (i = 7) ---
    const t7 = 7 / (count - 1);
    const h7 = (baseHue + (7 - count / 2) * 12) % 360;
    const l7 = clamp(baseL - 0.05 + t7 * 0.15, 0.15, 0.95);
    const c7 = clamp(baseC * 0.7 + Math.sin(t7 * Math.PI) * 0.05, 0.03, 0.2);
    const color8 = { ...oklch, h: h7, l: l7, c: c7 };

    // --- COLOR 9 (i = 8) ---
    const t8 = 8 / (count - 1);
    const h8 = (baseHue + (8 - count / 2) * 12) % 360;
    const l8 = clamp(baseL - 0.05 + t8 * 0.15, 0.15, 0.95);
    const c8 = clamp(baseC * 0.7 + Math.sin(t8 * Math.PI) * 0.05, 0.03, 0.2);
    const color9 = { ...oklch, h: h8, l: l8, c: c8 };

    // --- COLOR 10 (i = 9) ---
    const t9 = 9 / (count - 1);
    const h9 = (baseHue + (9 - count / 2) * 12) % 360;
    const l9 = clamp(baseL - 0.05 + t9 * 0.15, 0.15, 0.95);
    const c9 = clamp(baseC * 0.7 + Math.sin(t9 * Math.PI) * 0.05, 0.03, 0.2);
    const color10 = { ...oklch, h: h9, l: l9, c: c9 };

    return [
      { name: "SoftEditorial-1", value: color1 },
      { name: "SoftEditorial-2", value: color2 },
      { name: "SoftEditorial-3", value: color3 },
      { name: "SoftEditorial-4", value: color4 },
      { name: "SoftEditorial-5", value: color5 },
      { name: "SoftEditorial-6", value: color6 },
      { name: "SoftEditorial-7", value: color7 },
      { name: "SoftEditorial-8", value: color8 },
      { name: "SoftEditorial-9", value: color9 },
      { name: "SoftEditorial-10", value: color10 },
    ];
  } else if (dataVizPalType === "dataVizPalThree") {
    const baseHue = oklch.h % 360;
    const baseL = oklch.l;
    const baseC = oklch.c;

    // 10 colors
    const maxIndex = 9;

    // --- COLOR 1 (i = 0) ---
    const t0 = 0 / maxIndex;
    const h0 = (baseHue + t0 * 360 * 0.75) % 360;
    const l0 = Math.min(
      0.92,
      Math.max(0.18, baseL + Math.sin(t0 * Math.PI * 1.2) * 0.15)
    );
    const c0 = Math.min(
      0.35,
      Math.max(0.02, baseC + Math.cos(t0 * Math.PI * 0.8) * 0.12)
    );
    const color1 = { ...oklch, h: h0, l: l0, c: c0 };

    // --- COLOR 2 (i = 1) ---
    const t1 = 1 / maxIndex;
    const h1 = (baseHue + t1 * 360 * 0.75) % 360;
    const l1 = Math.min(
      0.92,
      Math.max(0.18, baseL + Math.sin(t1 * Math.PI * 1.2) * 0.15)
    );
    const c1 = Math.min(
      0.35,
      Math.max(0.02, baseC + Math.cos(t1 * Math.PI * 0.8) * 0.12)
    );
    const color2 = { ...oklch, h: h1, l: l1, c: c1 };

    // --- COLOR 3 (i = 2) ---
    const t2 = 2 / maxIndex;
    const h2 = (baseHue + t2 * 360 * 0.75) % 360;
    const l2 = Math.min(
      0.92,
      Math.max(0.18, baseL + Math.sin(t2 * Math.PI * 1.2) * 0.15)
    );
    const c2 = Math.min(
      0.35,
      Math.max(0.02, baseC + Math.cos(t2 * Math.PI * 0.8) * 0.12)
    );
    const color3 = { ...oklch, h: h2, l: l2, c: c2 };

    // --- COLOR 4 (i = 3) ---
    const t3 = 3 / maxIndex;
    const h3 = (baseHue + t3 * 360 * 0.75) % 360;
    const l3 = Math.min(
      0.92,
      Math.max(0.18, baseL + Math.sin(t3 * Math.PI * 1.2) * 0.15)
    );
    const c3 = Math.min(
      0.35,
      Math.max(0.02, baseC + Math.cos(t3 * Math.PI * 0.8) * 0.12)
    );
    const color4 = { ...oklch, h: h3, l: l3, c: c3 };

    // --- COLOR 5 (i = 4) ---
    const t4 = 4 / maxIndex;
    const h4 = (baseHue + t4 * 360 * 0.75) % 360;
    const l4 = Math.min(
      0.92,
      Math.max(0.18, baseL + Math.sin(t4 * Math.PI * 1.2) * 0.15)
    );
    const c4 = Math.min(
      0.35,
      Math.max(0.02, baseC + Math.cos(t4 * Math.PI * 0.8) * 0.12)
    );
    const color5 = { ...oklch, h: h4, l: l4, c: c4 };

    // --- COLOR 6 (i = 5) ---
    const t5 = 5 / maxIndex;
    const h5 = (baseHue + t5 * 360 * 0.75) % 360;
    const l5 = Math.min(
      0.92,
      Math.max(0.18, baseL + Math.sin(t5 * Math.PI * 1.2) * 0.15)
    );
    const c5 = Math.min(
      0.35,
      Math.max(0.02, baseC + Math.cos(t5 * Math.PI * 0.8) * 0.12)
    );
    const color6 = { ...oklch, h: h5, l: l5, c: c5 };

    // --- COLOR 7 (i = 6) ---
    const t6 = 6 / maxIndex;
    const h6 = (baseHue + t6 * 360 * 0.75) % 360;
    const l6 = Math.min(
      0.92,
      Math.max(0.18, baseL + Math.sin(t6 * Math.PI * 1.2) * 0.15)
    );
    const c6 = Math.min(
      0.35,
      Math.max(0.02, baseC + Math.cos(t6 * Math.PI * 0.8) * 0.12)
    );
    const color7 = { ...oklch, h: h6, l: l6, c: c6 };

    // --- COLOR 8 (i = 7) ---
    const t7 = 7 / maxIndex;
    const h7 = (baseHue + t7 * 360 * 0.75) % 360;
    const l7 = Math.min(
      0.92,
      Math.max(0.18, baseL + Math.sin(t7 * Math.PI * 1.2) * 0.15)
    );
    const c7 = Math.min(
      0.35,
      Math.max(0.02, baseC + Math.cos(t7 * Math.PI * 0.8) * 0.12)
    );
    const color8 = { ...oklch, h: h7, l: l7, c: c7 };

    // --- COLOR 9 (i = 8) ---
    const t8 = 8 / maxIndex;
    const h8 = (baseHue + t8 * 360 * 0.75) % 360;
    const l8 = Math.min(
      0.92,
      Math.max(0.18, baseL + Math.sin(t8 * Math.PI * 1.2) * 0.15)
    );
    const c8 = Math.min(
      0.35,
      Math.max(0.02, baseC + Math.cos(t8 * Math.PI * 0.8) * 0.12)
    );
    const color9 = { ...oklch, h: h8, l: l8, c: c8 };

    // --- COLOR 10 (i = 9) ---
    const t9 = 9 / maxIndex;
    const h9 = (baseHue + t9 * 360 * 0.75) % 360;
    const l9 = Math.min(
      0.92,
      Math.max(0.18, baseL + Math.sin(t9 * Math.PI * 1.2) * 0.15)
    );
    const c9 = Math.min(
      0.35,
      Math.max(0.02, baseC + Math.cos(t9 * Math.PI * 0.8) * 0.12)
    );
    const color10 = { ...oklch, h: h9, l: l9, c: c9 };

    return [
      { name: "Color-1", value: color1 },
      { name: "Color-2", value: color2 },
      { name: "Color-3", value: color3 },
      { name: "Color-4", value: color4 },
      { name: "Color-5", value: color5 },
      { name: "Color-6", value: color6 },
      { name: "Color-7", value: color7 },
      { name: "Color-8", value: color8 },
      { name: "Color-9", value: color9 },
      { name: "Color-10", value: color10 },
    ];
  } else if (dataVizPalType === "dataVizPalFour") {
    const baseHue = oklch.h % 360;
    const baseL = oklch.l;
    const baseC = oklch.c;

    const cvdHueOffsets = [0, 32, 72, 112, 158, 205, 248, 288, 328, 355];

    // --- COLOR 1 (i = 0) ---
    const t0 = 0 / 9;
    const h0 = (baseHue + cvdHueOffsets[0]) % 360;
    const l0 = Math.min(0.92, Math.max(0.18, baseL + 0.08 + t0 * 0.05));
    const c0 = Math.min(
      0.3,
      Math.max(0.05, baseC + 0.05 + Math.sin(t0 * Math.PI) * 0.08)
    );
    const color1 = { ...oklch, h: h0, l: l0, c: c0 };

    // --- COLOR 2 (i = 1) ---
    const t1 = 1 / 9;
    const h1 = (baseHue + cvdHueOffsets[1]) % 360;
    const l1 = Math.min(0.92, Math.max(0.18, baseL - 0.08 + t1 * 0.05));
    const c1 = Math.min(
      0.3,
      Math.max(0.05, baseC + 0.05 + Math.sin(t1 * Math.PI) * 0.08)
    );
    const color2 = { ...oklch, h: h1, l: l1, c: c1 };

    // --- COLOR 3 (i = 2) ---
    const t2 = 2 / 9;
    const h2 = (baseHue + cvdHueOffsets[2]) % 360;
    const l2 = Math.min(0.92, Math.max(0.18, baseL + 0.08 + t2 * 0.05));
    const c2 = Math.min(
      0.3,
      Math.max(0.05, baseC + 0.05 + Math.sin(t2 * Math.PI) * 0.08)
    );
    const color3 = { ...oklch, h: h2, l: l2, c: c2 };

    // --- COLOR 4 (i = 3) ---
    const t3 = 3 / 9;
    const h3 = (baseHue + cvdHueOffsets[3]) % 360;
    const l3 = Math.min(0.92, Math.max(0.18, baseL - 0.08 + t3 * 0.05));
    const c3 = Math.min(
      0.3,
      Math.max(0.05, baseC + 0.05 + Math.sin(t3 * Math.PI) * 0.08)
    );
    const color4 = { ...oklch, h: h3, l: l3, c: c3 };

    // --- COLOR 5 (i = 4) ---
    const t4 = 4 / 9;
    const h4 = (baseHue + cvdHueOffsets[4]) % 360;
    const l4 = Math.min(0.92, Math.max(0.18, baseL + 0.08 + t4 * 0.05));
    const c4 = Math.min(
      0.3,
      Math.max(0.05, baseC + 0.05 + Math.sin(t4 * Math.PI) * 0.08)
    );
    const color5 = { ...oklch, h: h4, l: l4, c: c4 };

    // --- COLOR 6 (i = 5) ---
    const t5 = 5 / 9;
    const h5 = (baseHue + cvdHueOffsets[5]) % 360;
    const l5 = Math.min(0.92, Math.max(0.18, baseL - 0.08 + t5 * 0.05));
    const c5 = Math.min(
      0.3,
      Math.max(0.05, baseC + 0.05 + Math.sin(t5 * Math.PI) * 0.08)
    );
    const color6 = { ...oklch, h: h5, l: l5, c: c5 };

    // --- COLOR 7 (i = 6) ---
    const t6 = 6 / 9;
    const h6 = (baseHue + cvdHueOffsets[6]) % 360;
    const l6 = Math.min(0.92, Math.max(0.18, baseL + 0.08 + t6 * 0.05));
    const c6 = Math.min(
      0.3,
      Math.max(0.05, baseC + 0.05 + Math.sin(t6 * Math.PI) * 0.08)
    );
    const color7 = { ...oklch, h: h6, l: l6, c: c6 };

    // --- COLOR 8 (i = 7) ---
    const t7 = 7 / 9;
    const h7 = (baseHue + cvdHueOffsets[7]) % 360;
    const l7 = Math.min(0.92, Math.max(0.18, baseL - 0.08 + t7 * 0.05));
    const c7 = Math.min(
      0.3,
      Math.max(0.05, baseC + 0.05 + Math.sin(t7 * Math.PI) * 0.08)
    );
    const color8 = { ...oklch, h: h7, l: l7, c: c7 };

    // --- COLOR 9 (i = 8) ---
    const t8 = 8 / 9;
    const h8 = (baseHue + cvdHueOffsets[8]) % 360;
    const l8 = Math.min(0.92, Math.max(0.18, baseL + 0.08 + t8 * 0.05));
    const c8 = Math.min(
      0.3,
      Math.max(0.05, baseC + 0.05 + Math.sin(t8 * Math.PI) * 0.08)
    );
    const color9 = { ...oklch, h: h8, l: l8, c: c8 };

    // --- COLOR 10 (i = 9) ---
    const t9 = 9 / 9;
    const h9 = (baseHue + cvdHueOffsets[9]) % 360;
    const l9 = Math.min(0.92, Math.max(0.18, baseL - 0.08 + t9 * 0.05));
    const c9 = Math.min(
      0.3,
      Math.max(0.05, baseC + 0.05 + Math.sin(t9 * Math.PI) * 0.08)
    );
    const color10 = { ...oklch, h: h9, l: l9, c: c9 };

    // Final palette
    return [
      { name: "Color-1", value: color1 },
      { name: "Color-2", value: color2 },
      { name: "Color-3", value: color3 },
      { name: "Color-4", value: color4 },
      { name: "Color-5", value: color5 },
      { name: "Color-6", value: color6 },
      { name: "Color-7", value: color7 },
      { name: "Color-8", value: color8 },
      { name: "Color-9", value: color9 },
      { name: "Color-10", value: color10 },
    ];
  } else if (dataVizPalType === "dataVizPalFive") {
    const baseHue = oklch.h % 360;
    const baseL = oklch.l;
    const baseC = oklch.c;

    function clamp(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    const count = 10;

    // --- COLOR 1 (i = 0) ---
    const t0 = 0 / (count - 1);
    const h0 = (baseHue + (0 - count / 2) * 10) % 360;
    const l0 = clamp(baseL * 0.4 + t0 * 0.35, 0.05, 0.65);
    const c0 = clamp(baseC * 0.6 + Math.sin(t0 * Math.PI) * 0.08, 0.02, 0.25);
    const color1 = { ...oklch, h: h0, l: l0, c: c0 };

    // --- COLOR 2 (i = 1) ---
    const t1 = 1 / (count - 1);
    const h1 = (baseHue + (1 - count / 2) * 10) % 360;
    const l1 = clamp(baseL * 0.4 + t1 * 0.35, 0.05, 0.65);
    const c1 = clamp(baseC * 0.6 + Math.sin(t1 * Math.PI) * 0.08, 0.02, 0.25);
    const color2 = { ...oklch, h: h1, l: l1, c: c1 };

    // --- COLOR 3 (i = 2) ---
    const t2 = 2 / (count - 1);
    const h2 = (baseHue + (2 - count / 2) * 10) % 360;
    const l2 = clamp(baseL * 0.4 + t2 * 0.35, 0.05, 0.65);
    const c2 = clamp(baseC * 0.6 + Math.sin(t2 * Math.PI) * 0.08, 0.02, 0.25);
    const color3 = { ...oklch, h: h2, l: l2, c: c2 };

    // --- COLOR 4 (i = 3) ---
    const t3 = 3 / (count - 1);
    const h3 = (baseHue + (3 - count / 2) * 10) % 360;
    const l3 = clamp(baseL * 0.4 + t3 * 0.35, 0.05, 0.65);
    const c3 = clamp(baseC * 0.6 + Math.sin(t3 * Math.PI) * 0.08, 0.02, 0.25);
    const color4 = { ...oklch, h: h3, l: l3, c: c3 };

    // --- COLOR 5 (i = 4) ---
    const t4 = 4 / (count - 1);
    const h4 = (baseHue + (4 - count / 2) * 10) % 360;
    const l4 = clamp(baseL * 0.4 + t4 * 0.35, 0.05, 0.65);
    const c4 = clamp(baseC * 0.6 + Math.sin(t4 * Math.PI) * 0.08, 0.02, 0.25);
    const color5 = { ...oklch, h: h4, l: l4, c: c4 };

    // --- COLOR 6 (i = 5) ---
    const t5 = 5 / (count - 1);
    const h5 = (baseHue + (5 - count / 2) * 10) % 360;
    const l5 = clamp(baseL * 0.4 + t5 * 0.35, 0.05, 0.65);
    const c5 = clamp(baseC * 0.6 + Math.sin(t5 * Math.PI) * 0.08, 0.02, 0.25);
    const color6 = { ...oklch, h: h5, l: l5, c: c5 };

    // --- COLOR 7 (i = 6) ---
    const t6 = 6 / (count - 1);
    const h6 = (baseHue + (6 - count / 2) * 10) % 360;
    const l6 = clamp(baseL * 0.4 + t6 * 0.35, 0.05, 0.65);
    const c6 = clamp(baseC * 0.6 + Math.sin(t6 * Math.PI) * 0.08, 0.02, 0.25);
    const color7 = { ...oklch, h: h6, l: l6, c: c6 };

    // --- COLOR 8 (i = 7) ---
    const t7 = 7 / (count - 1);
    const h7 = (baseHue + (7 - count / 2) * 10) % 360;
    const l7 = clamp(baseL * 0.4 + t7 * 0.35, 0.05, 0.65);
    const c7 = clamp(baseC * 0.6 + Math.sin(t7 * Math.PI) * 0.08, 0.02, 0.25);
    const color8 = { ...oklch, h: h7, l: l7, c: c7 };

    // --- COLOR 9 (i = 8) ---
    const t8 = 8 / (count - 1);
    const h8 = (baseHue + (8 - count / 2) * 10) % 360;
    const l8 = clamp(baseL * 0.4 + t8 * 0.35, 0.05, 0.65);
    const c8 = clamp(baseC * 0.6 + Math.sin(t8 * Math.PI) * 0.08, 0.02, 0.25);
    const color9 = { ...oklch, h: h8, l: l8, c: c8 };

    // --- COLOR 10 (i = 9) ---
    const t9 = 9 / (count - 1);
    const h9 = (baseHue + (9 - count / 2) * 10) % 360;
    const l9 = clamp(baseL * 0.4 + t9 * 0.35, 0.05, 0.65);
    const c9 = clamp(baseC * 0.6 + Math.sin(t9 * Math.PI) * 0.08, 0.02, 0.25);
    const color10 = { ...oklch, h: h9, l: l9, c: c9 };

    return [
      { name: "DarkMode-1", value: color1 },
      { name: "DarkMode-2", value: color2 },
      { name: "DarkMode-3", value: color3 },
      { name: "DarkMode-4", value: color4 },
      { name: "DarkMode-5", value: color5 },
      { name: "DarkMode-6", value: color6 },
      { name: "DarkMode-7", value: color7 },
      { name: "DarkMode-8", value: color8 },
      { name: "DarkMode-9", value: color9 },
      { name: "DarkMode-10", value: color10 },
    ];
  } else if (dataVizPalType === "dataVizPalSix") {
    const baseHue = oklch.h % 360;
    const baseL = oklch.l;
    const baseC = oklch.c;

    const count = 10;

    function clamp(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }

    const hueOffsets = [0, 36, 72, 108, 144, 180, 216, 252, 288, 324];

    // ----- COLOR 1 (i = 0) -----
    const t0 = 0 / (count - 1);
    const h0 = (baseHue + hueOffsets[0]) % 360;
    const l0 = clamp(baseL * 0.6 + t0 * 0.35, 0.15, 0.85);
    const c0 = clamp(baseC * 0.8 + (1 - Math.abs(t0 - 0.5)) * 0.15, 0.05, 0.28);
    const color1 = { ...oklch, h: h0, l: l0, c: c0 };

    // ----- COLOR 2 (i = 1) -----
    const t1 = 1 / (count - 1);
    const h1 = (baseHue + hueOffsets[1]) % 360;
    const l1 = clamp(baseL * 0.6 + t1 * 0.35, 0.15, 0.85);
    const c1 = clamp(baseC * 0.8 + (1 - Math.abs(t1 - 0.5)) * 0.15, 0.05, 0.28);
    const color2 = { ...oklch, h: h1, l: l1, c: c1 };

    // ----- COLOR 3 (i = 2) -----
    const t2 = 2 / (count - 1);
    const h2 = (baseHue + hueOffsets[2]) % 360;
    const l2 = clamp(baseL * 0.6 + t2 * 0.35, 0.15, 0.85);
    const c2 = clamp(baseC * 0.8 + (1 - Math.abs(t2 - 0.5)) * 0.15, 0.05, 0.28);
    const color3 = { ...oklch, h: h2, l: l2, c: c2 };

    // ----- COLOR 4 (i = 3) -----
    const t3 = 3 / (count - 1);
    const h3 = (baseHue + hueOffsets[3]) % 360;
    const l3 = clamp(baseL * 0.6 + t3 * 0.35, 0.15, 0.85);
    const c3 = clamp(baseC * 0.8 + (1 - Math.abs(t3 - 0.5)) * 0.15, 0.05, 0.28);
    const color4 = { ...oklch, h: h3, l: l3, c: c3 };

    // ----- COLOR 5 (i = 4) -----
    const t4 = 4 / (count - 1);
    const h4 = (baseHue + hueOffsets[4]) % 360;
    const l4 = clamp(baseL * 0.6 + t4 * 0.35, 0.15, 0.85);
    const c4 = clamp(baseC * 0.8 + (1 - Math.abs(t4 - 0.5)) * 0.15, 0.05, 0.28);
    const color5 = { ...oklch, h: h4, l: l4, c: c4 };

    // ----- COLOR 6 (i = 5) -----
    const t5 = 5 / (count - 1);
    const h5 = (baseHue + hueOffsets[5]) % 360;
    const l5 = clamp(baseL * 0.6 + t5 * 0.35, 0.15, 0.85);
    const c5 = clamp(baseC * 0.8 + (1 - Math.abs(t5 - 0.5)) * 0.15, 0.05, 0.28);
    const color6 = { ...oklch, h: h5, l: l5, c: c5 };

    // ----- COLOR 7 (i = 6) -----
    const t6 = 6 / (count - 1);
    const h6 = (baseHue + hueOffsets[6]) % 360;
    const l6 = clamp(baseL * 0.6 + t6 * 0.35, 0.15, 0.85);
    const c6 = clamp(baseC * 0.8 + (1 - Math.abs(t6 - 0.5)) * 0.15, 0.05, 0.28);
    const color7 = { ...oklch, h: h6, l: l6, c: c6 };

    // ----- COLOR 8 (i = 7) -----
    const t7 = 7 / (count - 1);
    const h7 = (baseHue + hueOffsets[7]) % 360;
    const l7 = clamp(baseL * 0.6 + t7 * 0.35, 0.15, 0.85);
    const c7 = clamp(baseC * 0.8 + (1 - Math.abs(t7 - 0.5)) * 0.15, 0.05, 0.28);
    const color8 = { ...oklch, h: h7, l: l7, c: c7 };

    // ----- COLOR 9 (i = 8) -----
    const t8 = 8 / (count - 1);
    const h8 = (baseHue + hueOffsets[8]) % 360;
    const l8 = clamp(baseL * 0.6 + t8 * 0.35, 0.15, 0.85);
    const c8 = clamp(baseC * 0.8 + (1 - Math.abs(t8 - 0.5)) * 0.15, 0.05, 0.28);
    const color9 = { ...oklch, h: h8, l: l8, c: c8 };

    // ----- COLOR 10 (i = 9) -----
    const t9 = 9 / (count - 1);
    const h9 = (baseHue + hueOffsets[9]) % 360;
    const l9 = clamp(baseL * 0.6 + t9 * 0.35, 0.15, 0.85);
    const c9 = clamp(baseC * 0.8 + (1 - Math.abs(t9 - 0.5)) * 0.15, 0.05, 0.28);
    const color10 = { ...oklch, h: h9, l: l9, c: c9 };

    return [
      { name: "HighContrast-1", value: color1 },
      { name: "HighContrast-2", value: color2 },
      { name: "HighContrast-3", value: color3 },
      { name: "HighContrast-4", value: color4 },
      { name: "HighContrast-5", value: color5 },
      { name: "HighContrast-6", value: color6 },
      { name: "HighContrast-7", value: color7 },
      { name: "HighContrast-8", value: color8 },
      { name: "HighContrast-9", value: color9 },
      { name: "HighContrast-10", value: color10 },
    ];
  }
}

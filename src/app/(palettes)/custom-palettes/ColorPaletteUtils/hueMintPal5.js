import React from "react";

export default function hueMintPal5(oklch) {
  const { l: baseL, c: baseC, h: baseH, a = 1 } = oklch;

  // Helper to normalize hue to 0-360
  const normalizeHue = (h) => ((h % 360) + 360) % 360;

  // Helper to clamp values
  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  // Check if two colors are distinct enough
  const isDistinct = (color1, color2, threshold = 15) => {
    const lDiff = Math.abs(color1.l - color2.l);
    const cDiff = Math.abs(color1.c - color2.c);
    const hDiff = Math.min(
      Math.abs(color1.h - color2.h),
      360 - Math.abs(color1.h - color2.h)
    );

    return lDiff > threshold || cDiff > 0.05 || hDiff > 15;
  };

  const palette = [];

  // 1. Base color (slightly adjusted)
  palette.push({
    name: "Primary",
    value: {
      l: clamp(baseL, 0.2, 0.9),
      c: clamp(baseC, 0.05, 0.3),
      h: normalizeHue(baseH),
      a,
    },
  });

  // 2. Lighter variant (background/surface)
  const lightL = clamp(baseL + 0.3, 0.85, 0.98);
  const lightC = clamp(baseC * 0.3, 0.01, 0.08);
  palette.push({
    name: "Surface",
    value: {
      l: lightL,
      c: lightC,
      h: normalizeHue(baseH + 15),
      a,
    },
  });

  // 3. Darker variant (text/contrast)
  const darkL = clamp(baseL - 0.5, 0.15, 0.35);
  const darkC = clamp(baseC * 0.5, 0.02, 0.12);
  palette.push({
    name: "Text",
    value: {
      l: darkL,
      c: darkC,
      h: normalizeHue(baseH - 10),
      a,
    },
  });

  // 4. Accent color (complementary-ish)
  const accentH = normalizeHue(baseH + 150 + (Math.random() * 60 - 30));
  const accentL = clamp(baseL + (Math.random() * 0.2 - 0.1), 0.4, 0.7);
  const accentC = clamp(baseC * 1.2, 0.08, 0.25);
  const accentCandidate = {
    l: accentL,
    c: accentC,
    h: accentH,
    a,
  };

  // Ensure accent is distinct
  let distinctAccent = accentCandidate;
  let attempts = 0;
  while (attempts < 10) {
    const isDistinctFromAll = palette.every((p) =>
      isDistinct(p.value, distinctAccent)
    );
    if (isDistinctFromAll) break;

    distinctAccent = {
      l: clamp(baseL + (Math.random() * 0.4 - 0.2), 0.4, 0.7),
      c: clamp(baseC * (0.8 + Math.random() * 0.6), 0.08, 0.25),
      h: normalizeHue(baseH + 140 + (Math.random() * 80 - 40)),
      a,
    };
    attempts++;
  }

  palette.push({
    name: "Accent",
    value: distinctAccent,
  });

  // 5. Secondary accent (triadic or analogous)
  const secondaryH = normalizeHue(baseH + (Math.random() > 0.5 ? 240 : 60));
  const secondaryL = clamp(baseL + (Math.random() * 0.3 - 0.15), 0.45, 0.75);
  const secondaryC = clamp(baseC * 0.9, 0.06, 0.2);
  const secondaryCandidate = {
    l: secondaryL,
    c: secondaryC,
    h: secondaryH,
    a,
  };

  // Ensure secondary is distinct
  let distinctSecondary = secondaryCandidate;
  attempts = 0;
  while (attempts < 10) {
    const isDistinctFromAll = palette.every((p) =>
      isDistinct(p.value, distinctSecondary)
    );
    if (isDistinctFromAll) break;

    distinctSecondary = {
      l: clamp(baseL + (Math.random() * 0.35 - 0.175), 0.45, 0.75),
      c: clamp(baseC * (0.7 + Math.random() * 0.5), 0.06, 0.2),
      h: normalizeHue(
        baseH + (Math.random() > 0.5 ? 220 : 50) + (Math.random() * 40 - 20)
      ),
      a,
    };
    attempts++;
  }

  palette.push({
    name: "Secondary",
    value: distinctSecondary,
  });

  return palette;
}

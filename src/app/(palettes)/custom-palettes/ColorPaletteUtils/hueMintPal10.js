export default function hueMintPal10(oklch) {
  const { l: baseL, c: baseC, h: baseH, a = 1 } = oklch;

  // Helper to normalize hue to 0-360
  const normalizeHue = (h) => ((h % 360) + 360) % 360;

  // Helper to clamp values
  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  // Check if two colors are distinct enough
  const isDistinct = (color1, color2, threshold = 12) => {
    const lDiff = Math.abs(color1.l - color2.l);
    const cDiff = Math.abs(color1.c - color2.c);
    const hDiff = Math.min(
      Math.abs(color1.h - color2.h),
      360 - Math.abs(color1.h - color2.h)
    );

    return lDiff > threshold / 100 || cDiff > 0.04 || hDiff > 12;
  };

  const palette = [];

  // 1. Primary - main brand color
  palette.push({
    name: "Primary",
    value: {
      l: clamp(baseL, 0.3, 0.8),
      c: clamp(baseC, 0.08, 0.25),
      h: normalizeHue(baseH),
      a,
    },
  });

  // 2. Primary Light - lighter variant of primary
  palette.push({
    name: "Primary-Light",
    value: {
      l: clamp(baseL + 0.25, 0.7, 0.9),
      c: clamp(baseC * 0.8, 0.05, 0.2),
      h: normalizeHue(baseH + 5),
      a,
    },
  });

  // 3. Primary Dark - darker variant of primary
  palette.push({
    name: "Primary-Dark",
    value: {
      l: clamp(baseL - 0.25, 0.2, 0.5),
      c: clamp(baseC * 0.9, 0.06, 0.22),
      h: normalizeHue(baseH - 5),
      a,
    },
  });

  // 4. Background - very light, desaturated
  palette.push({
    name: "Background",
    value: {
      l: clamp(0.96, 0.93, 0.98),
      c: clamp(baseC * 0.15, 0.005, 0.03),
      h: normalizeHue(baseH + 20),
      a,
    },
  });

  // 5. Surface - light surface color
  palette.push({
    name: "Surface",
    value: {
      l: clamp(0.88, 0.85, 0.92),
      c: clamp(baseC * 0.25, 0.01, 0.05),
      h: normalizeHue(baseH + 10),
      a,
    },
  });

  // 6. Text - dark for readability
  palette.push({
    name: "Text",
    value: {
      l: clamp(0.25, 0.15, 0.35),
      c: clamp(baseC * 0.4, 0.015, 0.08),
      h: normalizeHue(baseH - 15),
      a,
    },
  });

  // 7. Text Secondary - lighter text
  palette.push({
    name: "Text-Secondary",
    value: {
      l: clamp(0.5, 0.45, 0.6),
      c: clamp(baseC * 0.35, 0.02, 0.1),
      h: normalizeHue(baseH - 10),
      a,
    },
  });

  // 8. Accent - complementary color
  const accentH = normalizeHue(baseH + 150 + (Math.random() * 60 - 30));
  const accentCandidate = {
    l: clamp(baseL + (Math.random() * 0.15 - 0.075), 0.45, 0.75),
    c: clamp(baseC * 1.3, 0.1, 0.28),
    h: accentH,
    a,
  };

  let distinctAccent = accentCandidate;
  let attempts = 0;
  while (attempts < 10) {
    const isDistinctFromAll = palette.every((p) =>
      isDistinct(p.value, distinctAccent)
    );
    if (isDistinctFromAll) break;

    distinctAccent = {
      l: clamp(baseL + (Math.random() * 0.3 - 0.15), 0.45, 0.75),
      c: clamp(baseC * (1.1 + Math.random() * 0.4), 0.1, 0.28),
      h: normalizeHue(baseH + 140 + (Math.random() * 80 - 40)),
      a,
    };
    attempts++;
  }

  palette.push({
    name: "Accent",
    value: distinctAccent,
  });

  // 9. Secondary - triadic or split-complementary
  const secondaryH = normalizeHue(
    baseH + (Math.random() > 0.5 ? 240 : 60) + (Math.random() * 30 - 15)
  );
  const secondaryCandidate = {
    l: clamp(baseL + (Math.random() * 0.2 - 0.1), 0.5, 0.7),
    c: clamp(baseC * 1.1, 0.08, 0.22),
    h: secondaryH,
    a,
  };

  let distinctSecondary = secondaryCandidate;
  attempts = 0;
  while (attempts < 10) {
    const isDistinctFromAll = palette.every((p) =>
      isDistinct(p.value, distinctSecondary)
    );
    if (isDistinctFromAll) break;

    distinctSecondary = {
      l: clamp(baseL + (Math.random() * 0.25 - 0.125), 0.5, 0.7),
      c: clamp(baseC * (0.9 + Math.random() * 0.4), 0.08, 0.22),
      h: normalizeHue(
        baseH + (Math.random() > 0.5 ? 230 : 50) + (Math.random() * 40 - 20)
      ),
      a,
    };
    attempts++;
  }

  palette.push({
    name: "Secondary",
    value: distinctSecondary,
  });

  // 10. Tertiary - analogous accent
  const tertiaryH = normalizeHue(
    baseH + (Math.random() > 0.5 ? 30 : -30) + (Math.random() * 20 - 10)
  );
  const tertiaryCandidate = {
    l: clamp(baseL + (Math.random() * 0.2 - 0.1), 0.55, 0.75),
    c: clamp(baseC * 0.95, 0.07, 0.2),
    h: tertiaryH,
    a,
  };

  let distinctTertiary = tertiaryCandidate;
  attempts = 0;
  while (attempts < 10) {
    const isDistinctFromAll = palette.every((p) =>
      isDistinct(p.value, distinctTertiary)
    );
    if (isDistinctFromAll) break;

    distinctTertiary = {
      l: clamp(baseL + (Math.random() * 0.25 - 0.125), 0.55, 0.75),
      c: clamp(baseC * (0.8 + Math.random() * 0.35), 0.07, 0.2),
      h: normalizeHue(
        baseH + (Math.random() > 0.5 ? 25 : -25) + (Math.random() * 30 - 15)
      ),
      a,
    };
    attempts++;
  }

  palette.push({
    name: "Tertiary",
    value: distinctTertiary,
  });

  return palette;
}

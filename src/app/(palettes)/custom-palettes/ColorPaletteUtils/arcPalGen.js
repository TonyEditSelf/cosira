// Helper to normalize hue to 0-360
const normalizeHue = (h) => ((h % 360) + 360) % 360;

// Helper to clamp values
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

const ensureDistinctness = (palette, minLDiff = 0.01, minCDiff = 0.005) => {
  for (let i = 1; i < palette.length; i++) {
    const prev = palette[i - 1].value;
    const curr = palette[i].value;

    // Check lightness difference
    if (Math.abs(curr.l - prev.l) < minLDiff) {
      // Add small offset to ensure difference
      curr.l = prev.l + (curr.l >= prev.l ? minLDiff : -minLDiff);
      curr.l = clamp(curr.l, 0.2, 0.95);
    }

    // Check chroma difference
    if (Math.abs(curr.c - prev.c) < minCDiff) {
      // Add small offset to ensure difference
      curr.c = prev.c + (curr.c >= prev.c ? minCDiff : -minCDiff);
      curr.c = clamp(curr.c, 0.02, 0.3);
    }
  }

  return palette;
};

export default function arcPalGen(
  oklch,
  arcPalType,
  numColors = 10,
  curvature = 0.5
) {
  if (arcPalType === "arcBottomUp") {
    const { l: baseL, c: baseC, h: baseH, a = 1 } = oklch;
    const palette = [];

    for (let i = 0; i < numColors; i++) {
      // Calculate position from -1 (left) to 1 (right)
      const t = (i / (numColors - 1)) * 2 - 1;

      // Parabola opening upward: y = t^2, scaled by curvature
      const curve = t * t * curvature;

      palette.push({
        name: `Arc-${i}`,
        value: {
          l: clamp(baseL + curve * 0.3, 0.2, 0.95), // Lighter at edges
          c: clamp(baseC - curve * 0.1, 0.02, 0.3), // Less saturated at edges
          h: normalizeHue(baseH + t * 30 * (1 - curvature * 0.5)), // Hue shifts
          a,
        },
      });
    }

    return ensureDistinctness(palette);
  } else if (arcPalType === "arcTopDown") {
    const { l: baseL, c: baseC, h: baseH, a = 1 } = oklch;
    const palette = [];

    for (let i = 0; i < numColors; i++) {
      const t = (i / (numColors - 1)) * 2 - 1;

      // Inverted parabola opening downward: y = -t^2
      const curve = -(t * t) * curvature;

      palette.push({
        name: `Arc-${i}`,
        value: {
          l: clamp(baseL + curve * 0.3, 0.2, 0.95), // Darker at edges
          c: clamp(baseC + curve * 0.1, 0.02, 0.3), // More saturated at center
          h: normalizeHue(baseH + t * 30 * (1 - curvature * 0.5)),
          a,
        },
      });
    }

    return ensureDistinctness(palette);
  } else if (arcPalType === "arcLeftRight") {
    const { l: baseL, c: baseC, h: baseH, a = 1 } = oklch;
    const palette = [];

    for (let i = 0; i < numColors; i++) {
      const t = (i / (numColors - 1)) * 2 - 1;

      // Parabola for horizontal arc: x = t^2
      const curve = t * t * curvature;

      palette.push({
        name: `Arc-${i}`,
        value: {
          l: clamp(baseL + t * 0.25 * (1 - curvature * 0.3), 0.2, 0.95),
          c: clamp(baseC - curve * 0.08, 0.03, 0.28),
          h: normalizeHue(baseH + curve * 60), // Hue shifts more at edges
          a,
        },
      });
    }

    return ensureDistinctness(palette);
  } else if (arcPalType === "arcRightLeft") {
    const { l: baseL, c: baseC, h: baseH, a = 1 } = oklch;
    const palette = [];

    for (let i = 0; i < numColors; i++) {
      const t = (i / (numColors - 1)) * 2 - 1;

      // Inverted parabola for horizontal arc: x = -t^2
      const curve = -(t * t) * curvature;

      palette.push({
        name: `Arc-${i}`,
        value: {
          l: clamp(baseL + t * 0.25 * (1 - curvature * 0.3), 0.2, 0.95),
          c: clamp(baseC + curve * 0.08, 0.03, 0.28),
          h: normalizeHue(baseH + curve * 60),
          a,
        },
      });
    }

    return ensureDistinctness(palette);
  } else if (arcPalType === "arcDiagonalUpRight") {
    const { l: baseL, c: baseC, h: baseH, a = 1 } = oklch;
    const palette = [];

    for (let i = 0; i < numColors; i++) {
      const t = (i / (numColors - 1)) * 2 - 1;

      // Circular arc calculation with curvature control
      const angle = ((t * Math.PI) / 4) * curvature;
      const linear = t * (1 - curvature); // Linear component when curvature is low
      const x = Math.sin(angle) * curvature + linear;
      const y = (Math.cos(angle) - 1) * curvature;

      palette.push({
        name: `Arc-${i}`,
        value: {
          l: clamp(baseL + x * 0.3, 0.2, 0.95),
          c: clamp(baseC + y * 0.1 + (1 - curvature) * 0.05, 0.03, 0.28),
          h: normalizeHue(baseH + x * 45),
          a,
        },
      });
    }

    return ensureDistinctness(palette);
  } else if (arcPalType === "arcDiagonalUpLeft") {
    const { l: baseL, c: baseC, h: baseH, a = 1 } = oklch;
    const palette = [];

    for (let i = 0; i < numColors; i++) {
      const t = (i / (numColors - 1)) * 2 - 1;

      const angle = ((t * Math.PI) / 4) * curvature;
      const linear = t * (1 - curvature);
      const x = -Math.sin(angle) * curvature - linear;
      const y = (Math.cos(angle) - 1) * curvature;

      palette.push({
        name: `Arc-${i}`,
        value: {
          l: clamp(baseL + x * 0.3, 0.2, 0.95),
          c: clamp(baseC + y * 0.1 + (1 - curvature) * 0.05, 0.03, 0.28),
          h: normalizeHue(baseH + x * 45),
          a,
        },
      });
    }

    return ensureDistinctness(palette);
  } else if (arcPalType === "arcDiagonalDownRight") {
    const { l: baseL, c: baseC, h: baseH, a = 1 } = oklch;
    const palette = [];

    for (let i = 0; i < numColors; i++) {
      const t = (i / (numColors - 1)) * 2 - 1;

      const angle = ((t * Math.PI) / 4) * curvature;
      const linear = t * (1 - curvature);
      const x = Math.sin(angle) * curvature + linear;
      const y = -(Math.cos(angle) - 1) * curvature;

      palette.push({
        name: `Arc-${i}`,
        value: {
          l: clamp(baseL + y * 0.3, 0.2, 0.95),
          c: clamp(baseC - y * 0.1 + (1 - curvature) * 0.05, 0.03, 0.28),
          h: normalizeHue(baseH + x * 45),
          a,
        },
      });
    }

    return ensureDistinctness(palette);
  } else if (arcPalType === "arcDiagonalDownLeft") {
    const { l: baseL, c: baseC, h: baseH, a = 1 } = oklch;
    const palette = [];

    for (let i = 0; i < numColors; i++) {
      const t = (i / (numColors - 1)) * 2 - 1;

      const angle = ((t * Math.PI) / 4) * curvature;
      const linear = t * (1 - curvature);
      const x = -Math.sin(angle) * curvature - linear;
      const y = -(Math.cos(angle) - 1) * curvature;

      palette.push({
        name: `Arc-${i}`,
        value: {
          l: clamp(baseL + y * 0.3, 0.2, 0.95),
          c: clamp(baseC - y * 0.1 + (1 - curvature) * 0.05, 0.03, 0.28),
          h: normalizeHue(baseH + x * 45),
          a,
        },
      });
    }

    return ensureDistinctness(palette);
  } else if (arcPalType === "arcDiagonalTLBR") {
    const { l: baseL, c: baseC, h: baseH, a = 1 } = oklch;
    const palette = [];

    for (let i = 0; i < numColors; i++) {
      const t = (i / (numColors - 1)) * 2 - 1;

      // Diagonal parabola: both x and y change with curve
      const curve = t * t * curvature;
      const linear = t * (1 - curvature);

      palette.push({
        name: `Arc-${i}`,
        value: {
          l: clamp(baseL + (linear + curve * 0.5) * 0.25, 0.2, 0.95),
          c: clamp(baseC - curve * 0.06, 0.03, 0.28),
          h: normalizeHue(baseH + (linear + curve * 0.3) * 35),
          a,
        },
      });
    }

    return ensureDistinctness(palette);
  } else if (arcPalType === "arcDiagonalTRBL") {
    const { l: baseL, c: baseC, h: baseH, a = 1 } = oklch;
    const palette = [];

    for (let i = 0; i < numColors; i++) {
      const t = (i / (numColors - 1)) * 2 - 1;

      const curve = t * t * curvature;
      const linear = t * (1 - curvature);

      palette.push({
        name: `Arc-${i}`,
        value: {
          l: clamp(baseL - (linear + curve * 0.5) * 0.25, 0.2, 0.95),
          c: clamp(baseC - curve * 0.06, 0.03, 0.28),
          h: normalizeHue(baseH - (linear + curve * 0.3) * 35),
          a,
        },
      });
    }

    return ensureDistinctness(palette);
  }
}

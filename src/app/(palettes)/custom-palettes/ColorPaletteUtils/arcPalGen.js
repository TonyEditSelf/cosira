// Helper to normalize hue to 0-360
const normalizeHue = (h) => ((h % 360) + 360) % 360;

// Helper to clamp values
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

// Ensure colors are perceptually distinct
const ensureDistinctness = (palette, minLDiff = 0.015, minCDiff = 0.008) => {
  for (let i = 1; i < palette.length; i++) {
    const prev = palette[i - 1].value;
    const curr = palette[i].value;

    if (Math.abs(curr.l - prev.l) < minLDiff) {
      curr.l = prev.l + (curr.l >= prev.l ? minLDiff : -minLDiff);
      curr.l = clamp(curr.l, 0.2, 0.95);
    }

    if (Math.abs(curr.c - prev.c) < minCDiff) {
      curr.c = prev.c + (curr.c >= prev.c ? minCDiff : -minCDiff);
      curr.c = clamp(curr.c, 0.02, 0.37);
    }
  }

  return palette;
};

/* ============================================================
   COLOR WHEEL ARCS (hue rotation, fixed L/C)
   ============================================================ */

// Sweep through hue angles - creates rainbow-like palettes
function hueArc(oklch, numColors = 10, hueSpan = 180, direction = 1) {
  const { l: baseL, c: baseC, h: baseH, a = 1 } = oklch;
  const palette = [];

  for (let i = 0; i < numColors; i++) {
    const t = i / (numColors - 1);
    const hueOffset = (t - 0.5) * hueSpan * direction;

    palette.push({
      name: `Hue-${i}`,
      value: {
        l: baseL,
        c: baseC,
        h: normalizeHue(baseH + hueOffset),
        a,
      },
    });
  }

  return palette;
}

// Analogous palette - narrow hue range (30-60°)
function analogousArc(oklch, numColors = 10, hueSpan = 45) {
  return hueArc(oklch, numColors, hueSpan, 1);
}

// Complementary spread - wide hue range (default 180°)
function complementaryArc(oklch, numColors = 10, hueSpan = 180) {
  return hueArc(oklch, numColors, hueSpan, 1);
}

/* ============================================================
   COLOR AREA ARCS (L-C plane, fixed hue)
   ============================================================ */

// Circular arc through lightness-chroma space
function circularLCArc(
  oklch,
  numColors = 10,
  radius = 0.12,
  startAngle = -90,
  endAngle = 90,
) {
  const { l: baseL, c: baseC, h: baseH, a = 1 } = oklch;
  const palette = [];

  for (let i = 0; i < numColors; i++) {
    const t = i / (numColors - 1);
    const angle = (startAngle + t * (endAngle - startAngle)) * (Math.PI / 180);

    palette.push({
      name: `LC-Arc-${i}`,
      value: {
        l: clamp(baseL + radius * Math.sin(angle), 0.2, 0.95),
        c: clamp(baseC + radius * Math.cos(angle), 0.02, 0.37),
        h: baseH,
        a,
      },
    });
  }

  return ensureDistinctness(palette);
}

// Lightness ramp (vertical line in LC space)
function lightnessRamp(oklch, numColors = 10, range = 0.5) {
  const { l: baseL, c: baseC, h: baseH, a = 1 } = oklch;
  const palette = [];

  for (let i = 0; i < numColors; i++) {
    const t = i / (numColors - 1);
    const lightness = baseL + (t - 0.5) * range;

    palette.push({
      name: `Light-${i}`,
      value: {
        l: clamp(lightness, 0.2, 0.95),
        c: baseC,
        h: baseH,
        a,
      },
    });
  }

  return ensureDistinctness(palette);
}

// Chroma ramp (horizontal line in LC space)
function chromaRamp(oklch, numColors = 10, range = 0.2) {
  const { l: baseL, c: baseC, h: baseH, a = 1 } = oklch;
  const palette = [];

  for (let i = 0; i < numColors; i++) {
    const t = i / (numColors - 1);
    const chroma = baseC + (t - 0.5) * range;

    palette.push({
      name: `Chroma-${i}`,
      value: {
        l: baseL,
        c: clamp(chroma, 0.02, 0.37),
        h: baseH,
        a,
      },
    });
  }

  return ensureDistinctness(palette);
}

// Diagonal LC arc - both lightness and chroma change
function diagonalLCArc(
  oklch,
  numColors = 10,
  lRange = 0.4,
  cRange = 0.15,
  direction = "upRight",
) {
  const { l: baseL, c: baseC, h: baseH, a = 1 } = oklch;
  const palette = [];

  // Direction multipliers
  const lMult = direction.includes("up") ? 1 : -1;
  const cMult = direction.includes("Right") ? 1 : -1;

  for (let i = 0; i < numColors; i++) {
    const t = i / (numColors - 1);
    const offset = t - 0.5;

    palette.push({
      name: `Diag-${i}`,
      value: {
        l: clamp(baseL + offset * lRange * lMult, 0.2, 0.95),
        c: clamp(baseC + offset * cRange * cMult, 0.02, 0.37),
        h: baseH,
        a,
      },
    });
  }

  return ensureDistinctness(palette);
}

/* ============================================================
   3D ARCS (L-C-H space)
   ============================================================ */

// Spiral - combines hue rotation with LC movement
function spiralArc(
  oklch,
  numColors = 10,
  hueSpan = 120,
  lRange = 0.3,
  cRange = 0.1,
  spiralDirection = "upRight",
) {
  const { l: baseL, c: baseC, h: baseH, a = 1 } = oklch;
  const palette = [];

  // Direction multipliers for spiral
  // up/down controls lightness, left/right controls chroma
  const lMult = spiralDirection.includes("up") ? 1 : -1;
  const cMult = spiralDirection.includes("Right") ? 1 : -1;

  for (let i = 0; i < numColors; i++) {
    const t = i / (numColors - 1);
    const offset = t - 0.5;

    palette.push({
      name: `Spiral-${i}`,
      value: {
        l: clamp(baseL + offset * lRange * lMult, 0.2, 0.95),
        c: clamp(baseC + offset * cRange * cMult, 0.02, 0.37),
        h: normalizeHue(baseH + t * hueSpan),
        a,
      },
    });
  }

  return ensureDistinctness(palette);
}

// Helix - circular motion in LC while rotating hue
function helixArc(
  oklch,
  numColors = 10,
  radius = 0.1,
  hueSpan = 180,
  helixDirection = "upRight",
) {
  const { l: baseL, c: baseC, h: baseH, a = 1 } = oklch;
  const palette = [];

  // Direction determines which axis the circle is drawn on
  // up/down = lightness axis, left/right = chroma axis
  const onLAxis =
    helixDirection.includes("up") || helixDirection.includes("down");
  const lSign = helixDirection.includes("up") ? 1 : -1;
  const cSign = helixDirection.includes("Right") ? 1 : -1;

  for (let i = 0; i < numColors; i++) {
    const t = i / (numColors - 1);
    const angle = t * Math.PI * 2; // Full circle

    let lOffset, cOffset;

    if (onLAxis) {
      // Circle in L-C plane (up/down directions)
      lOffset = radius * Math.sin(angle) * lSign;
      cOffset = radius * Math.cos(angle) * cSign;
    } else {
      // Circle in C-L plane (left/right directions)
      cOffset = radius * Math.sin(angle) * cSign;
      lOffset = radius * Math.cos(angle) * lSign;
    }

    palette.push({
      name: `Helix-${i}`,
      value: {
        l: clamp(baseL + lOffset, 0.2, 0.95),
        c: clamp(baseC + cOffset, 0.02, 0.37),
        h: normalizeHue(baseH + t * hueSpan),
        a,
      },
    });
  }

  return ensureDistinctness(palette);
}

/* ============================================================
   MAIN GENERATOR WITH CLEAR ARC TYPES
   ============================================================ */

export default function arcPalGen(
  oklch,
  arcType,
  numColors = 10,
  options = {},
) {
  console.log("arcPalGen called:", { arcType, numColors, oklch, options });

  const {
    hueSpan = 180,
    radius = 0.12,
    lRange = 0.4,
    cRange = 0.15,
    direction = "upRight",
    spiralDirection = "upRight",
    helixDirection = "upRight",
    startAngle = -90,
    endAngle = 90,
  } = options;

  // Adaptive hueSpan defaults based on arc type
  let effectiveHueSpan = hueSpan;
  if (arcType === "analog" || arcType === "analogous") {
    effectiveHueSpan = hueSpan === 180 ? 45 : hueSpan; // Default to 45° for analogous
  }
  // Note: Complementary now respects user's hueSpan (though 180° is traditional)

  switch (arcType) {
    // COLOR WHEEL ARCS
    case "hue":
    case "hues":
      console.log("-> Calling hueArc");
      return hueArc(oklch, numColors, effectiveHueSpan);
    case "analogous":
    case "analog":
      console.log("-> Calling analogousArc");
      return analogousArc(oklch, numColors, effectiveHueSpan);
    case "complementary":
    case "comp":
      console.log("-> Calling complementaryArc");
      return complementaryArc(oklch, numColors, effectiveHueSpan); // Now uses hueSpan

    // COLOR AREA ARCS (fixed hue)
    case "circularLC":
      return circularLCArc(oklch, numColors, radius, startAngle, endAngle);
    case "lightness":
      return lightnessRamp(oklch, numColors, lRange);
    case "chroma":
      return chromaRamp(oklch, numColors, cRange);
    case "diagonalLC":
      return diagonalLCArc(oklch, numColors, lRange, cRange, direction);

    // 3D ARCS
    case "spiral":
      return spiralArc(
        oklch,
        numColors,
        hueSpan,
        lRange,
        cRange,
        spiralDirection,
      );
    case "helix":
      return helixArc(oklch, numColors, radius, hueSpan, helixDirection);

    default:
      console.warn(`Unknown arc type: ${arcType}, defaulting to 'hue'`);
      return hueArc(oklch, numColors, hueSpan);
  }
}

/* ============================================================
   USAGE EXAMPLES
   ============================================================ */

// Example 1: Rainbow palette (hue rotation)
// arcPalGen({ l: 0.7, c: 0.15, h: 0 }, 'hue', 10, { hueSpan: 360 });

// Example 2: Monochrome lightness scale
// arcPalGen({ l: 0.5, c: 0.1, h: 220 }, 'lightness', 10, { lRange: 0.6 });

// Example 3: Circular arc through LC space
// arcPalGen({ l: 0.6, c: 0.15, h: 120 }, 'circularLC', 10, { radius: 0.15, startAngle: -90, endAngle: 90 });

// Example 4: Analogous warm palette
// arcPalGen({ l: 0.65, c: 0.18, h: 30 }, 'analogous', 8, { hueSpan: 40 });

// Example 5: Spiral through color space
// arcPalGen({ l: 0.6, c: 0.12, h: 180 }, 'spiral', 12, { hueSpan: 120, lRange: 0.3 });

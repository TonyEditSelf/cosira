import {
  oklchToRgb,
  rgbToOklch,
} from "../_components/Pickers/components/colorutil";

/**
 * Check if a color is within sRGB gamut
 */
export function isInGamut(l, c, h) {
  const [r, g, b] = oklchToRgb(l, c, h);
  return r >= 0 && r <= 1 && g >= 0 && g <= 1 && b >= 0 && b <= 1;
}

/**
 * Find maximum displayable chroma for given lightness and hue
 * Uses binary search for precision
 */
export function findMaxChroma(l, h, maxIterations = 15) {
  // Quick check if even low chroma works
  if (!isInGamut(l, 0.01, h)) {
    return 0;
  }

  // Start with reasonable upper bound
  let low = 0;
  let high = 0.5; // OKLCH theoretical max is ~0.5
  let maxC = 0;

  for (let i = 0; i < maxIterations; i++) {
    const mid = (low + high) / 2;

    if (isInGamut(l, mid, h)) {
      maxC = mid;
      low = mid;
    } else {
      high = mid;
    }

    // Convergence check
    if (high - low < 0.0001) break;
  }

  return maxC;
}

/**
 * Clamp chroma to displayable range for given L and H
 * Caches results for performance
 */
const gamutCache = new Map();

function getCacheKey(l, h) {
  // Round to reduce cache size
  const lRounded = Math.round(l * 100) / 100;
  const hRounded = Math.round(h);
  return `${lRounded}-${hRounded}`;
}

export function clampToGamut(l, c, h) {
  // Check if already in gamut (fast path)
  if (isInGamut(l, c, h)) {
    return c;
  }

  // Check cache
  const cacheKey = getCacheKey(l, h);
  let maxC = gamutCache.get(cacheKey);

  if (maxC === undefined) {
    maxC = findMaxChroma(l, h);
    gamutCache.set(cacheKey, maxC);
  }

  return Math.min(c, maxC * 0.98); // 98% to add safety margin
}

/**
 * Clamp a full color object to gamut
 */
export function clampColorToGamut(color) {
  return {
    l: color.l,
    c: clampToGamut(color.l, color.c, color.h),
    h: color.h,
  };
}

/**
 * Get info about how much a color was clipped
 */
export function getGamutClipping(l, c, h) {
  const clampedC = clampToGamut(l, c, h);
  const clippingPercent = ((c - clampedC) / c) * 100;

  return {
    wasClipped: clampedC < c,
    originalChroma: c,
    clampedChroma: clampedC,
    clippingPercent,
    isSignificant: clippingPercent > 20, // >20% loss is significant
  };
}

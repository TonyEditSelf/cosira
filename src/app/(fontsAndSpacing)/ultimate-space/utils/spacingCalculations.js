export const findClosestSpacing = (spacingScale, targetValue) => {
  if (spacingScale.length === 0) return null;

  return spacingScale.reduce((prev, curr) => {
    return Math.abs(curr.value - targetValue) <
      Math.abs(prev.value - targetValue)
      ? curr
      : prev;
  });
};

export const findNeighbors = (spacingScale, value) => {
  const index = spacingScale.findIndex((s) => s.value === value);
  return {
    smaller: index > 0 ? spacingScale[index - 1] : null,
    current: spacingScale[index] || null,
    larger: index < spacingScale.length - 1 ? spacingScale[index + 1] : null,
  };
};

export const generateFluidSpacing = (
  mobileSpacing,
  desktopSpacing,
  minViewport,
  maxViewport,
  spacingScale,
) => {
  const minValue = mobileSpacing;
  const maxValue = desktopSpacing;
  const minVw = minViewport;
  const maxVw = maxViewport;

  if (maxVw <= minVw) {
    return {
      clampValue: `${minValue}px`,
      minToken: findClosestSpacing(spacingScale, minValue),
      maxToken: findClosestSpacing(spacingScale, maxValue),
      error: "Max viewport must be greater than min viewport",
    };
  }

  const slope = (maxValue - minValue) / (maxVw - minVw);
  const yIntercept = minValue - slope * minVw;
  const preferredValue = `${yIntercept.toFixed(2)}px + ${(slope * 100).toFixed(4)}vw`;
  const clampValue = `clamp(${minValue}px, ${preferredValue}, ${maxValue}px)`;

  return {
    clampValue,
    minToken: findClosestSpacing(spacingScale, minValue),
    maxToken: findClosestSpacing(spacingScale, maxValue),
  };
};

export const calculateGridSpacing = (
  spacingScale,
  containerWidth,
  itemCount,
) => {
  const paddingOffset = 16;
  const effectiveWidth = containerWidth - paddingOffset;
  const gapCount = itemCount - 1;

  let bestMatch = null;
  let bestDiff = Infinity;

  spacingScale.forEach((spacing) => {
    const gapValue = spacing.value;
    const totalGapSpace = gapValue * gapCount;
    const availableForItems = effectiveWidth - totalGapSpace;
    const itemWidth = availableForItems / itemCount;

    if (itemWidth > 0) {
      const remainder = itemWidth % 1;
      const diff = Math.min(remainder, 1 - remainder);

      if (diff < bestDiff) {
        bestDiff = diff;
        bestMatch = { spacing, itemWidth, totalGapSpace };
      }
    }
  });

  if (!bestMatch) {
    const fallbackGap = spacingScale[0] || { value: 0, name: "space-0" };
    const totalGapSpace = fallbackGap.value * gapCount;
    const itemWidth = (effectiveWidth - totalGapSpace) / itemCount;
    bestMatch = {
      spacing: fallbackGap,
      itemWidth: Math.max(itemWidth, 0),
      totalGapSpace,
    };
  }

  return {
    closest: bestMatch.spacing,
    itemWidth: bestMatch.itemWidth,
    totalGapSpace: bestMatch.totalGapSpace,
  };
};

export const generateExport = (spacingScale, exportFormat, extendTailwind) => {
  switch (exportFormat) {
    case "tailwind":
      const tailwindSpacing = {};
      spacingScale.forEach((item) => {
        const key = item.name.replace("space-", "");
        tailwindSpacing[key] = item.value === 0 ? "0" : `${item.value}px`;
      });

      if (extendTailwind) {
        return `// tailwind.config.js
  module.exports = {
    theme: {
      extend: {
        spacing: ${JSON.stringify(tailwindSpacing, null, 8).replace(/"([^"]+)":/g, "$1:")}
      }
    }
  }`;
      } else {
        return `// tailwind.config.js
  module.exports = {
    theme: {
      spacing: ${JSON.stringify(tailwindSpacing, null, 6).replace(/"([^"]+)":/g, "$1:")}
    }
  }`;
      }

    case "css":
      let cssVars = ":root {\n";
      spacingScale.forEach((item) => {
        cssVars += `  --${item.name}: ${item.value === 0 ? "0" : item.value + "px"};\n`;
      });
      cssVars += "}";
      return cssVars;

    case "scss":
      let scssVars = "";
      spacingScale.forEach((item) => {
        scssVars += `$${item.name}: ${item.value === 0 ? "0" : item.value + "px"};\n`;
      });
      return scssVars;

    case "js":
      const jsObject = {};
      spacingScale.forEach((item) => {
        jsObject[item.name] = item.value;
      });
      return `export const spacing = ${JSON.stringify(jsObject, null, 2)};`;

    default:
      return "";
  }
};

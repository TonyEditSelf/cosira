import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  Copy,
  Check,
  Settings,
  Layout,
  Code,
  Info,
  Plus,
  Trash2,
} from "lucide-react";

const SpacingSystem = () => {
  // Load from localStorage or use defaults
  const [baseUnit, setBaseUnit] = useState(() => {
    const saved = localStorage.getItem("spacing-baseUnit");
    return saved ? Number(saved) : 8;
  });
  const [scaleType, setScaleType] = useState(() => {
    return localStorage.getItem("spacing-scaleType") || "linear";
  });
  const [customRatio, setCustomRatio] = useState(() => {
    const saved = localStorage.getItem("spacing-customRatio");
    return saved ? Number(saved) : 1.5;
  });
  const [steps, setSteps] = useState(() => {
    const saved = localStorage.getItem("spacing-steps");
    return saved ? Number(saved) : 12;
  });
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("generator");
  const [exportFormat, setExportFormat] = useState(() => {
    return localStorage.getItem("spacing-exportFormat") || "tailwind";
  });
  const [extendTailwind, setExtendTailwind] = useState(() => {
    const saved = localStorage.getItem("spacing-extendTailwind");
    return saved === "true";
  });

  // Calculator state
  const [containerWidth, setContainerWidth] = useState(1200);
  const [containerHeight, setContainerHeight] = useState(600);
  const [itemCount, setItemCount] = useState(4);
  const [currentValue, setCurrentValue] = useState(24);
  const [mobileSpacing, setMobileSpacing] = useState(16);
  const [desktopSpacing, setDesktopSpacing] = useState(32);
  const [minViewport, setMinViewport] = useState(375);
  const [maxViewport, setMaxViewport] = useState(1440);

  // Interactive Editor state
  const [editorContainerWidth, setEditorContainerWidth] = useState(1200);
  const [editorContainerHeight, setEditorContainerHeight] = useState(800);
  const [editorItems, setEditorItems] = useState([
    { id: 1, x: 50, y: 50, width: 200, height: 150 },
    { id: 2, x: 300, y: 50, width: 200, height: 150 },
    { id: 3, x: 50, y: 250, width: 200, height: 150 },
    { id: 4, x: 300, y: 250, width: 200, height: 150 },
  ]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dragState, setDragState] = useState(null);
  const [resizeState, setResizeState] = useState(null);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const containerRef = useRef(null);

  // Calculator validation
  const handleContainerWidthChange = (value) => {
    const num = Number(value);
    if (isNaN(num) || num < 100) {
      setContainerWidth(100);
    } else if (num > 5000) {
      setContainerWidth(5000);
    } else {
      setContainerWidth(num);
    }
  };

  const handleContainerHeightChange = (value) => {
    const num = Number(value);
    if (isNaN(num) || num < 100) {
      setContainerHeight(100);
    } else if (num > 5000) {
      setContainerHeight(5000);
    } else {
      setContainerHeight(num);
    }
  };

  const handleItemCountChange = (value) => {
    const num = Number(value);
    if (isNaN(num) || num < 1) {
      setItemCount(1);
    } else if (num > 20) {
      setItemCount(20);
    } else {
      setItemCount(num);
    }
  };

  // Save to localStorage whenever settings change
  React.useEffect(() => {
    localStorage.setItem("spacing-baseUnit", baseUnit.toString());
    localStorage.setItem("spacing-scaleType", scaleType);
    localStorage.setItem("spacing-customRatio", customRatio.toString());
    localStorage.setItem("spacing-steps", steps.toString());
    localStorage.setItem("spacing-exportFormat", exportFormat);
    localStorage.setItem("spacing-extendTailwind", extendTailwind.toString());
  }, [baseUnit, scaleType, customRatio, steps, exportFormat, extendTailwind]);

  // Validation and safe setters
  const handleBaseUnitChange = (value) => {
    const num = Number(value);
    if (isNaN(num) || num < 1) {
      setBaseUnit(1);
    } else if (num > 32) {
      setBaseUnit(32);
    } else {
      setBaseUnit(num);
    }
  };

  const handleRatioChange = (value) => {
    const num = Number(value);
    if (isNaN(num) || num < 1.1) {
      setCustomRatio(1.1);
    } else if (num > 3) {
      setCustomRatio(3);
    } else {
      setCustomRatio(num);
    }
  };

  const handleStepsChange = (value) => {
    const num = Number(value);
    if (isNaN(num) || num < 5) {
      setSteps(5);
    } else if (num > 20) {
      setSteps(20);
    } else {
      setSteps(num);
    }
  };

  // Generate spacing scale based on settings
  const spacingScale = useMemo(() => {
    const scale = [];
    const MAX_VALUE = 2000; // Cap at 2000px to prevent absurd values

    switch (scaleType) {
      case "linear":
        for (let i = 0; i <= steps; i++) {
          const value = baseUnit * i;
          scale.push({
            name: `space-${i}`,
            value: Math.min(value, MAX_VALUE),
            rem: parseFloat((Math.min(value, MAX_VALUE) / 16).toFixed(3)),
          });
        }
        break;

      case "geometric":
        for (let i = 0; i <= steps; i++) {
          const rawValue =
            i === 0 ? 0 : Math.round(baseUnit * Math.pow(customRatio, i - 1));
          const value = Math.min(rawValue, MAX_VALUE);
          scale.push({
            name: `space-${i}`,
            value: value,
            rem: parseFloat((value / 16).toFixed(3)),
          });
        }
        break;

      case "fibonacci":
        let fib = [0, 1];
        // Generate Fibonacci up to steps, but cap individual values
        for (let i = 2; i <= steps; i++) {
          const nextFib = fib[i - 1] + fib[i - 2];
          // Stop generating if values get too large
          if (nextFib * baseUnit > MAX_VALUE) {
            break;
          }
          fib.push(nextFib);
        }
        fib.forEach((num, i) => {
          const value = Math.min(num * baseUnit, MAX_VALUE);
          scale.push({
            name: `space-${i}`,
            value: value,
            rem: parseFloat((value / 16).toFixed(3)),
          });
        });
        break;

      case "t-shirt":
        const sizes = [
          { name: "space-3xs", multiplier: 0.25 },
          { name: "space-2xs", multiplier: 0.5 },
          { name: "space-xs", multiplier: 0.75 },
          { name: "space-sm", multiplier: 1 },
          { name: "space-md", multiplier: 1.5 },
          { name: "space-lg", multiplier: 2 },
          { name: "space-xl", multiplier: 3 },
          { name: "space-2xl", multiplier: 4 },
          { name: "space-3xl", multiplier: 6 },
          { name: "space-4xl", multiplier: 8 },
          { name: "space-5xl", multiplier: 12 },
          { name: "space-6xl", multiplier: 16 },
        ];
        sizes.forEach((size) => {
          const value = Math.min(baseUnit * size.multiplier, MAX_VALUE);
          scale.push({
            name: size.name,
            value: value,
            rem: parseFloat((value / 16).toFixed(3)),
          });
        });
        break;

      case "custom":
        // Allow custom array input later
        break;
    }

    return scale;
  }, [baseUnit, scaleType, customRatio, steps]);

  // Calculator helper functions
  const findClosestSpacing = (targetValue) => {
    if (spacingScale.length === 0) return null;

    return spacingScale.reduce((prev, curr) => {
      return Math.abs(curr.value - targetValue) <
        Math.abs(prev.value - targetValue)
        ? curr
        : prev;
    });
  };

  const calculateGridSpacing = () => {
    // Calculate spacing for equal-width items in a container
    // Note: Visual preview has 16px padding (8px × 2), so actual available space is containerWidth - 16
    const paddingOffset = 16; // 8px padding on each side in the preview
    const effectiveWidth = containerWidth - paddingOffset;
    const gapCount = itemCount - 1;

    // We need to find the best gap from our scale that fits items evenly
    // For each possible gap, calculate if items fit nicely
    let bestMatch = null;
    let bestDiff = Infinity;

    spacingScale.forEach((spacing) => {
      const gapValue = spacing.value;
      const totalGapSpace = gapValue * gapCount;
      const availableForItems = effectiveWidth - totalGapSpace;
      const itemWidth = availableForItems / itemCount;

      // Prefer gaps that result in positive item widths and whole-number or near-whole-number widths
      if (itemWidth > 0) {
        const remainder = itemWidth % 1;
        const diff = Math.min(remainder, 1 - remainder);

        if (diff < bestDiff) {
          bestDiff = diff;
          bestMatch = {
            spacing,
            itemWidth,
            totalGapSpace,
          };
        }
      }
    });

    // Fallback if no good match found
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

  const findNeighbors = (value) => {
    const index = spacingScale.findIndex((s) => s.value === value);
    return {
      smaller: index > 0 ? spacingScale[index - 1] : null,
      current: spacingScale[index] || null,
      larger: index < spacingScale.length - 1 ? spacingScale[index + 1] : null,
    };
  };

  const generateFluidSpacing = () => {
    const minValue = mobileSpacing;
    const maxValue = desktopSpacing;
    const minVw = minViewport;
    const maxVw = maxViewport;

    // Handle edge case: if viewports are equal, just use minValue
    if (maxVw <= minVw) {
      return {
        clampValue: `${minValue}px`,
        minToken: findClosestSpacing(minValue),
        maxToken: findClosestSpacing(maxValue),
        error: "Max viewport must be greater than min viewport",
      };
    }

    // clamp(minValue, preferredValue, maxValue)
    // preferred = minValue + (maxValue - minValue) * ((100vw - minVw) / (maxVw - minVw))
    const slope = (maxValue - minValue) / (maxVw - minVw);
    const yIntercept = minValue - slope * minVw;

    const preferredValue = `${yIntercept.toFixed(2)}px + ${(slope * 100).toFixed(4)}vw`;
    const clampValue = `clamp(${minValue}px, ${preferredValue}, ${maxValue}px)`;

    return {
      clampValue,
      minToken: findClosestSpacing(minValue),
      maxToken: findClosestSpacing(maxValue),
    };
  };

  // Generate export code
  const generateExport = () => {
    switch (exportFormat) {
      case "tailwind":
        const tailwindSpacing = {};
        spacingScale.forEach((item) => {
          const key = item.name.replace("space-", "");
          // Tailwind prefers "0" not "0px"
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

  // Interactive Editor Functions
  const snapToScale = (value) => {
    if (!snapToGrid) return value;
    return spacingScale.reduce((prev, curr) => {
      return Math.abs(curr.value - value) < Math.abs(prev.value - value)
        ? curr
        : prev;
    }).value;
  };

  const addItem = () => {
    const newId = Math.max(...editorItems.map((i) => i.id), 0) + 1;
    setEditorItems([
      ...editorItems,
      {
        id: newId,
        x: 50,
        y: 50,
        width: 200,
        height: 150,
      },
    ]);
    setSelectedItem(newId);
  };

  const deleteItem = (id) => {
    setEditorItems(editorItems.filter((item) => item.id !== id));
    if (selectedItem === id) setSelectedItem(null);
  };

  const handleMouseDown = (e, itemId, action = "move") => {
    e.preventDefault();
    e.stopPropagation();

    const item = editorItems.find((i) => i.id === itemId);
    if (!item) return;

    setSelectedItem(itemId);

    const rect = containerRef.current.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;

    if (action === "move") {
      setDragState({
        itemId,
        startX,
        startY,
        initialX: item.x,
        initialY: item.y,
      });
      setResizeState(null);
    } else if (action.startsWith("resize")) {
      setResizeState({
        itemId,
        startX,
        startY,
        initialX: item.x,
        initialY: item.y,
        initialWidth: item.width,
        initialHeight: item.height,
        direction: action,
      });
      setDragState(null);
    }
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      if (dragState) {
        const deltaX = currentX - dragState.startX;
        const deltaY = currentY - dragState.startY;

        let newX = dragState.initialX + deltaX;
        let newY = dragState.initialY + deltaY;

        const item = editorItems.find((i) => i.id === dragState.itemId);
        if (item) {
          newX = Math.max(0, Math.min(editorContainerWidth - item.width, newX));
          newY = Math.max(
            0,
            Math.min(editorContainerHeight - item.height, newY),
          );

          setEditorItems(
            editorItems.map((i) =>
              i.id === dragState.itemId ? { ...i, x: newX, y: newY } : i,
            ),
          );
        }
      } else if (resizeState) {
        const deltaX = currentX - resizeState.startX;
        const deltaY = currentY - resizeState.startY;

        let newX = resizeState.initialX;
        let newY = resizeState.initialY;
        let newWidth = resizeState.initialWidth;
        let newHeight = resizeState.initialHeight;

        const direction = resizeState.direction;

        if (direction.includes("e")) {
          newWidth = Math.max(50, resizeState.initialWidth + deltaX);
        }
        if (direction.includes("s")) {
          newHeight = Math.max(50, resizeState.initialHeight + deltaY);
        }
        if (direction.includes("w")) {
          const widthChange = resizeState.initialWidth - deltaX;
          if (widthChange >= 50) {
            newWidth = widthChange;
            newX = resizeState.initialX + deltaX;
          }
        }
        if (direction.includes("n")) {
          const heightChange = resizeState.initialHeight - deltaY;
          if (heightChange >= 50) {
            newHeight = heightChange;
            newY = resizeState.initialY + deltaY;
          }
        }

        if (newX + newWidth > editorContainerWidth) {
          newWidth = editorContainerWidth - newX;
        }
        if (newY + newHeight > editorContainerHeight) {
          newHeight = editorContainerHeight - newY;
        }
        if (newX < 0) {
          newWidth += newX;
          newX = 0;
        }
        if (newY < 0) {
          newHeight += newY;
          newY = 0;
        }

        setEditorItems(
          editorItems.map((i) =>
            i.id === resizeState.itemId
              ? { ...i, x: newX, y: newY, width: newWidth, height: newHeight }
              : i,
          ),
        );
      }
    },
    [
      dragState,
      resizeState,
      editorItems,
      editorContainerWidth,
      editorContainerHeight,
    ],
  );

  const handleMouseUp = useCallback(() => {
    setDragState(null);
    setResizeState(null);
  }, []);

  useEffect(() => {
    if (dragState || resizeState) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragState, resizeState, handleMouseMove, handleMouseUp]);

  const analyzeSpacing = (item) => {
    const analysis = {
      margins: {
        top: item.y,
        right: editorContainerWidth - (item.x + item.width),
        bottom: editorContainerHeight - (item.y + item.height),
        left: item.x,
      },
      gaps: [],
    };

    editorItems.forEach((otherItem) => {
      if (otherItem.id === item.id) return;

      const verticalOverlap = !(
        item.y + item.height <= otherItem.y ||
        otherItem.y + otherItem.height <= item.y
      );
      if (verticalOverlap) {
        if (item.x + item.width <= otherItem.x) {
          const gap = otherItem.x - (item.x + item.width);
          analysis.gaps.push({
            to: otherItem.id,
            direction: "right",
            value: gap,
          });
        } else if (otherItem.x + otherItem.width <= item.x) {
          const gap = item.x - (otherItem.x + otherItem.width);
          analysis.gaps.push({
            to: otherItem.id,
            direction: "left",
            value: gap,
          });
        }
      }

      const horizontalOverlap = !(
        item.x + item.width <= otherItem.x ||
        otherItem.x + otherItem.width <= item.x
      );
      if (horizontalOverlap) {
        if (item.y + item.height <= otherItem.y) {
          const gap = otherItem.y - (item.y + item.height);
          analysis.gaps.push({
            to: otherItem.id,
            direction: "bottom",
            value: gap,
          });
        } else if (otherItem.y + otherItem.height <= item.y) {
          const gap = item.y - (otherItem.y + otherItem.height);
          analysis.gaps.push({
            to: otherItem.id,
            direction: "top",
            value: gap,
          });
        }
      }
    });

    return analysis;
  };

  const findSpacingToken = (value) => {
    const closest = snapToScale(value);
    const match = spacingScale.find((s) => s.value === closest);
    return match ? match.name : `${value}px`;
  };

  const generateItemCSSWithSpacing = (item) => {
    const spacing = analyzeSpacing(item);
    const marginToken = {
      top: findSpacingToken(spacing.margins.top),
      right: findSpacingToken(spacing.margins.right),
      bottom: findSpacingToken(spacing.margins.bottom),
      left: findSpacingToken(spacing.margins.left),
    };

    let css = `.item-${item.id} {
  /* Dimensions */
  width: ${item.width}px;
  height: ${item.height}px;
  
  /* Margins from container edges */
  margin-top: ${spacing.margins.top}px; /* ${marginToken.top} */
  margin-right: ${spacing.margins.right}px; /* ${marginToken.right} */
  margin-bottom: ${spacing.margins.bottom}px; /* ${marginToken.bottom} */
  margin-left: ${spacing.margins.left}px; /* ${marginToken.left} */`;

    if (spacing.gaps.length > 0) {
      css += "\n  \n  /* Gaps to other items */";
      spacing.gaps.forEach((gap) => {
        const token = findSpacingToken(gap.value);
        css += `\n  /* Gap to item-${gap.to} (${gap.direction}): ${gap.value}px - ${token} */`;
      });
    }

    css += "\n}";
    return css;
  };

  const generateAllCSS = () => {
    const containerCSS = `.container {
  position: relative;
  width: ${editorContainerWidth}px;
  height: ${editorContainerHeight}px;
}

`;
    const itemsCSS = editorItems.map(generateItemCSSWithSpacing).join("\n\n");
    return containerCSS + itemsCSS;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateExport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Spacing System Studio
          </h1>
          <p className="text-slate-600">
            World-class spacing system generator with absolute flexibility
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab("generator")}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === "generator"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Settings size={20} />
              Generator
            </button>
            <button
              onClick={() => setActiveTab("calculator")}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === "calculator"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Settings size={20} />
              Calculator
            </button>
            <button
              onClick={() => setActiveTab("playground")}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === "playground"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Layout size={20} />
              Playground
            </button>
            <button
              onClick={() => setActiveTab("interactive")}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === "interactive"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Layout size={20} />
              Interactive
            </button>
            <button
              onClick={() => setActiveTab("patterns")}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === "patterns"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Layout size={20} />
              Patterns
            </button>
            <button
              onClick={() => setActiveTab("export")}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === "export"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Code size={20} />
              Export
            </button>
          </div>
        </div>

        {/* Generator Tab */}
        {activeTab === "generator" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Controls */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  System Settings
                </h2>

                {/* Base Unit */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Base Unit (px)
                  </label>
                  <input
                    type="number"
                    value={baseUnit}
                    onChange={(e) => handleBaseUnitChange(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    max="32"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Common: 4, 8, or 16
                  </p>
                </div>

                {/* Scale Type */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Scale Type
                  </label>
                  <select
                    value={scaleType}
                    onChange={(e) => setScaleType(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="linear">Linear (1x, 2x, 3x...)</option>
                    <option value="geometric">Geometric Ratio</option>
                    <option value="fibonacci">Fibonacci</option>
                    <option value="t-shirt">T-Shirt Sizes</option>
                  </select>
                </div>

                {/* Geometric Ratio */}
                {scaleType === "geometric" && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Ratio (e.g., 1.5 for 1.5x growth)
                    </label>
                    <input
                      type="number"
                      value={customRatio}
                      onChange={(e) => handleRatioChange(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="1.1"
                      max="3"
                      step="0.1"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Golden ratio: 1.618
                    </p>
                  </div>
                )}

                {/* Steps */}
                {scaleType !== "t-shirt" && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Number of Steps
                    </label>
                    <input
                      type="number"
                      value={steps}
                      onChange={(e) => handleStepsChange(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="5"
                      max="20"
                    />
                  </div>
                )}

                {scaleType === "t-shirt" && (
                  <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-sm text-slate-600">
                      T-shirt sizing uses fixed semantic names (3xs through 6xl)
                      and generates 12 sizes total.
                    </p>
                  </div>
                )}

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-2">
                    <Info
                      size={20}
                      className="text-blue-600 flex-shrink-0 mt-0.5"
                    />
                    <div className="text-sm text-blue-900">
                      <p className="font-medium mb-1">Quick Tips:</p>
                      <ul className="text-xs space-y-1 text-blue-800">
                        <li>• Use 8px base for most web projects</li>
                        <li>• Linear scales are easiest to work with</li>
                        <li>• T-shirt sizes are great for design systems</li>
                        <li>• Geometric ratios create visual harmony</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scale Visualization */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Your Spacing Scale
                </h2>
                <div className="space-y-3">
                  {spacingScale.map((space, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="w-24 font-mono text-sm text-slate-700 font-medium">
                        {space.name}
                      </div>
                      <div className="flex-1">
                        <div
                          className="bg-blue-500 rounded h-8 transition-all"
                          style={{ width: `${Math.min(space.value, 400)}px` }}
                        />
                      </div>
                      <div className="w-32 text-right space-y-0.5">
                        <div className="font-mono text-sm text-slate-900 font-medium">
                          {space.value}px
                        </div>
                        <div className="font-mono text-xs text-slate-500">
                          {space.rem.toFixed(3)}rem
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calculator Tab */}
        {activeTab === "calculator" && (
          <div className="space-y-6">
            {/* Grid Layout Calculator */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Grid Layout Calculator
              </h2>
              <p className="text-sm text-slate-600 mb-6">
                Calculate optimal spacing for fitting items in a container
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Container Width (px)
                  </label>
                  <input
                    type="number"
                    value={containerWidth}
                    onChange={(e) => handleContainerWidthChange(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="100"
                    max="5000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Container Height (px)
                  </label>
                  <input
                    type="number"
                    value={containerHeight}
                    onChange={(e) =>
                      handleContainerHeightChange(e.target.value)
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="100"
                    max="5000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Number of Items
                  </label>
                  <input
                    type="number"
                    value={itemCount}
                    onChange={(e) => handleItemCountChange(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    max="20"
                  />
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-4">
                  Recommended Solution:
                </h3>
                {(() => {
                  const result = calculateGridSpacing();
                  const gapCount = itemCount - 1;
                  return (
                    <>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <span className="text-sm text-slate-600">
                            Container width:
                          </span>
                          <span className="font-mono text-slate-700">
                            {containerWidth}px
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <span className="text-sm text-slate-600">
                            Recommended gap:
                          </span>
                          <span className="font-mono font-bold text-blue-600">
                            {result.closest?.name} ({result.closest?.value}px)
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <span className="text-sm text-slate-600">
                            Item width:
                          </span>
                          <span className="font-mono font-bold text-slate-900">
                            {result.itemWidth.toFixed(2)}px
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <span className="text-sm text-slate-600">Math:</span>
                          <span className="font-mono text-xs text-slate-600">
                            {itemCount}×{result.itemWidth.toFixed(1)} +{" "}
                            {gapCount}×{result.closest?.value} ={" "}
                            {(
                              result.itemWidth * itemCount +
                              result.totalGapSpace
                            ).toFixed(1)}
                            px
                          </span>
                        </div>
                      </div>

                      {/* Visual Preview */}
                      <div className="mt-4 p-4 bg-white rounded-lg">
                        <p className="text-xs text-slate-500 mb-2">
                          Visual Preview (container: {containerWidth}px ×{" "}
                          {containerHeight}px):
                        </p>
                        <div className="overflow-auto">
                          <div
                            className="grid border-2 border-dashed border-slate-400 bg-slate-50"
                            style={{
                              gridTemplateColumns: `repeat(${itemCount}, ${result.itemWidth}px)`,
                              gap: `${result.closest?.value || 0}px`,
                              width: `${containerWidth}px`,
                              height: `${containerHeight}px`,
                              boxSizing: "border-box",
                              padding: "8px",
                            }}
                          >
                            {Array.from({ length: itemCount }).map((_, i) => (
                              <div
                                key={i}
                                className="bg-blue-200 border-2 border-blue-400 rounded flex flex-col items-center justify-center text-xs font-medium text-blue-900"
                                style={{
                                  width: `${result.itemWidth}px`,
                                  height: "auto",
                                  minHeight: "60px",
                                  boxSizing: "border-box",
                                  padding: "8px",
                                }}
                              >
                                <div className="text-center">
                                  <div className="font-semibold">
                                    {result.itemWidth.toFixed(1)}px
                                  </div>
                                  <div className="text-[10px] opacity-60 mt-1">
                                    Item {i + 1}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                          Container: {containerWidth}px × {containerHeight}px |
                          Gap: {result.closest?.value}px | Items fit:{" "}
                          {itemCount}
                        </p>
                      </div>

                      <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                        <p className="text-xs text-blue-900 font-medium mb-1">
                          Usage:
                        </p>
                        <code className="text-xs text-blue-800 font-mono">
                          className="grid grid-cols-{itemCount} gap-
                          {result.closest?.name.replace("space-", "")}"
                        </code>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Spacing Navigator */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Spacing Navigator
              </h2>
              <p className="text-sm text-slate-600 mb-6">
                Find the next size up or down from your current spacing
              </p>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Current Spacing Value (px)
                </label>
                <input
                  type="number"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>

              <div className="mt-6">
                {(() => {
                  const closest = findClosestSpacing(currentValue);
                  const neighbors = findNeighbors(closest?.value || 0);

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Smaller */}
                      <div
                        className={`p-4 rounded-lg border-2 ${neighbors.smaller ? "bg-slate-50 border-slate-300" : "bg-slate-100 border-slate-200 opacity-50"}`}
                      >
                        <div className="text-xs text-slate-500 mb-2">
                          ← Smaller
                        </div>
                        {neighbors.smaller ? (
                          <>
                            <div className="font-mono font-bold text-lg text-slate-900">
                              {neighbors.smaller.name}
                            </div>
                            <div className="font-mono text-sm text-slate-600">
                              {neighbors.smaller.value}px
                            </div>
                            <div
                              className="mt-2 bg-slate-300 rounded"
                              style={{
                                height: "8px",
                                width: `${Math.min(neighbors.smaller.value / 2, 100)}px`,
                              }}
                            ></div>
                          </>
                        ) : (
                          <div className="text-sm text-slate-400">
                            No smaller value
                          </div>
                        )}
                      </div>

                      {/* Current/Closest */}
                      <div className="p-4 rounded-lg border-2 bg-blue-50 border-blue-500">
                        <div className="text-xs text-blue-600 mb-2">
                          Current/Closest
                        </div>
                        {closest && (
                          <>
                            <div className="font-mono font-bold text-lg text-blue-900">
                              {closest.name}
                            </div>
                            <div className="font-mono text-sm text-blue-700">
                              {closest.value}px
                            </div>
                            <div
                              className="mt-2 bg-blue-400 rounded"
                              style={{
                                height: "8px",
                                width: `${Math.min(closest.value / 2, 100)}px`,
                              }}
                            ></div>
                            <div className="mt-2 text-xs text-blue-600">
                              {Math.abs(currentValue - closest.value) === 0
                                ? "✓ Exact match"
                                : `${Math.abs(currentValue - closest.value)}px difference`}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Larger */}
                      <div
                        className={`p-4 rounded-lg border-2 ${neighbors.larger ? "bg-slate-50 border-slate-300" : "bg-slate-100 border-slate-200 opacity-50"}`}
                      >
                        <div className="text-xs text-slate-500 mb-2">
                          Larger →
                        </div>
                        {neighbors.larger ? (
                          <>
                            <div className="font-mono font-bold text-lg text-slate-900">
                              {neighbors.larger.name}
                            </div>
                            <div className="font-mono text-sm text-slate-600">
                              {neighbors.larger.value}px
                            </div>
                            <div
                              className="mt-2 bg-slate-300 rounded"
                              style={{
                                height: "8px",
                                width: `${Math.min(neighbors.larger.value / 2, 100)}px`,
                              }}
                            ></div>
                          </>
                        ) : (
                          <div className="text-sm text-slate-400">
                            No larger value
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Fluid/Responsive Spacing */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Fluid Spacing Generator
              </h2>
              <p className="text-sm text-slate-600 mb-6">
                Generate responsive spacing that scales smoothly between
                breakpoints
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Mobile Spacing (px)
                  </label>
                  <input
                    type="number"
                    value={mobileSpacing}
                    onChange={(e) => setMobileSpacing(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Desktop Spacing (px)
                  </label>
                  <input
                    type="number"
                    value={desktopSpacing}
                    onChange={(e) => setDesktopSpacing(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Min Viewport (px)
                  </label>
                  <input
                    type="number"
                    value={minViewport}
                    onChange={(e) => setMinViewport(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="320"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Max Viewport (px)
                  </label>
                  <input
                    type="number"
                    value={maxViewport}
                    onChange={(e) => setMaxViewport(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="768"
                  />
                </div>
              </div>

              {(() => {
                const fluid = generateFluidSpacing();
                return (
                  <>
                    <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-4">
                        Generated CSS:
                      </h3>

                      <div className="bg-slate-900 rounded-lg p-4 mb-4">
                        <code className="text-sm text-green-400 font-mono">
                          padding: {fluid.clampValue};
                        </code>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 bg-white rounded-lg">
                          <div className="text-xs text-slate-500 mb-1">
                            Mobile ({minViewport}px)
                          </div>
                          <div className="font-mono text-sm text-slate-900">
                            {mobileSpacing}px
                          </div>
                          {fluid.minToken && (
                            <div className="text-xs text-blue-600 mt-1">
                              ≈ {fluid.minToken.name}
                            </div>
                          )}
                        </div>

                        <div className="p-3 bg-white rounded-lg">
                          <div className="text-xs text-slate-500 mb-1">
                            Desktop ({maxViewport}px)
                          </div>
                          <div className="font-mono text-sm text-slate-900">
                            {desktopSpacing}px
                          </div>
                          {fluid.maxToken && (
                            <div className="text-xs text-blue-600 mt-1">
                              ≈ {fluid.maxToken.name}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-purple-100 rounded-lg">
                      <p className="text-xs text-purple-900 font-medium mb-2">
                        How to use:
                      </p>
                      <ul className="text-xs text-purple-800 space-y-1 list-disc list-inside">
                        <li>Copy the CSS clamp() value above</li>
                        <li>Use it for padding, margin, or gap properties</li>
                        <li>
                          Spacing will scale smoothly between {minViewport}px
                          and {maxViewport}px viewports
                        </li>
                        <li>No media queries needed!</li>
                      </ul>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* Playground Tab */}
        {activeTab === "playground" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Component Examples */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Button Group
                </h2>
                <div className="space-y-4">
                  {spacingScale.slice(0, 8).map((space, index) => (
                    <div key={index}>
                      <p className="text-xs text-slate-500 mb-2 font-mono">
                        {space.name} ({space.value}px)
                      </p>
                      <div className="flex" style={{ gap: `${space.value}px` }}>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Button 1
                        </button>
                        <button className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">
                          Button 2
                        </button>
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          Button 3
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Card Layout
                </h2>
                <div className="space-y-4">
                  {spacingScale.slice(2, 8).map((space, index) => (
                    <div key={index}>
                      <p className="text-xs text-slate-500 mb-2 font-mono">
                        {space.name} ({space.value}px)
                      </p>
                      <div
                        className="border-2 border-slate-200 rounded-lg"
                        style={{ padding: `${space.value}px` }}
                      >
                        <h3 className="font-semibold text-slate-900 mb-2">
                          Card Title
                        </h3>
                        <p className="text-slate-600 text-sm">
                          This card uses {space.value}px padding to demonstrate
                          spacing.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Grid Examples */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Grid Gap
                </h2>
                <div className="space-y-6">
                  {spacingScale.slice(1, 7).map((space, index) => (
                    <div key={index}>
                      <p className="text-xs text-slate-500 mb-2 font-mono">
                        {space.name} ({space.value}px)
                      </p>
                      <div
                        className="grid grid-cols-3"
                        style={{ gap: `${space.value}px` }}
                      >
                        <div className="bg-purple-100 border-2 border-purple-300 rounded p-4 text-center text-sm font-medium text-purple-900">
                          Item 1
                        </div>
                        <div className="bg-purple-100 border-2 border-purple-300 rounded p-4 text-center text-sm font-medium text-purple-900">
                          Item 2
                        </div>
                        <div className="bg-purple-100 border-2 border-purple-300 rounded p-4 text-center text-sm font-medium text-purple-900">
                          Item 3
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Stack Layout
                </h2>
                <div className="space-y-4">
                  {spacingScale.slice(1, 7).map((space, index) => (
                    <div key={index}>
                      <p className="text-xs text-slate-500 mb-2 font-mono">
                        {space.name} ({space.value}px)
                      </p>
                      <div
                        className="flex flex-col"
                        style={{ gap: `${space.value}px` }}
                      >
                        <div className="bg-emerald-100 border-2 border-emerald-300 rounded p-3 text-sm font-medium text-emerald-900">
                          Stack Item 1
                        </div>
                        <div className="bg-emerald-100 border-2 border-emerald-300 rounded p-3 text-sm font-medium text-emerald-900">
                          Stack Item 2
                        </div>
                        <div className="bg-emerald-100 border-2 border-emerald-300 rounded p-3 text-sm font-medium text-emerald-900">
                          Stack Item 3
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Editor Tab */}
        {activeTab === "interactive" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Controls */}
            <div className="lg:col-span-1 space-y-4">
              {/* Container Settings */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  Container Settings
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      value={editorContainerWidth}
                      onChange={(e) =>
                        setEditorContainerWidth(
                          Math.max(400, Math.min(2000, Number(e.target.value))),
                        )
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="400"
                      max="2000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      value={editorContainerHeight}
                      onChange={(e) =>
                        setEditorContainerHeight(
                          Math.max(300, Math.min(2000, Number(e.target.value))),
                        )
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="300"
                      max="2000"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={snapToGrid}
                        onChange={(e) => setSnapToGrid(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">
                        Show spacing tokens
                      </span>
                    </label>
                    <p className="text-xs text-slate-500 mt-1 ml-6">
                      Display which spacing scale values are closest to current
                      positions
                    </p>
                  </div>
                </div>
              </div>

              {/* Item Controls */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Items ({editorItems.length})
                  </h2>
                  <button
                    onClick={addItem}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                    Add Item
                  </button>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {editorItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item.id)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedItem === item.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm text-slate-900">
                          Item {item.id}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteItem(item.id);
                          }}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                        <div>
                          <span className="font-medium">Position:</span>{" "}
                          {item.x}, {item.y}
                        </div>
                        <div>
                          <span className="font-medium">Size:</span>{" "}
                          {item.width} × {item.height}
                        </div>
                      </div>
                      {snapToGrid && (
                        <div className="mt-2 pt-2 border-t border-slate-200 text-xs text-blue-600">
                          Tokens: x={findSpacingToken(item.x)}, y=
                          {findSpacingToken(item.y)}, w=
                          {findSpacingToken(item.width)}, h=
                          {findSpacingToken(item.height)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2 text-sm">
                  How to use:
                </h3>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Click and drag items to move freely</li>
                  <li>• Drag corners/edges to resize</li>
                  <li>• Items stay exactly where you release</li>
                  <li>• Toggle tokens to see spacing scale values</li>
                  <li>• Copy CSS from the code panel →</li>
                </ul>
              </div>
            </div>

            {/* Middle Panel - Visual Editor */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  Visual Editor
                </h2>

                <div className="overflow-auto border-2 border-slate-300 rounded-lg bg-slate-50">
                  <div
                    ref={containerRef}
                    className="relative bg-white"
                    style={{
                      width: `${editorContainerWidth}px`,
                      height: `${editorContainerHeight}px`,
                      backgroundImage: snapToGrid
                        ? "linear-gradient(rgba(0,0,0,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.05) 1px, transparent 1px)"
                        : "none",
                      backgroundSize: snapToGrid ? "8px 8px" : "auto",
                      cursor: dragState || resizeState ? "grabbing" : "default",
                    }}
                    onClick={() => setSelectedItem(null)}
                  >
                    {editorItems.map((item) => (
                      <div
                        key={item.id}
                        className={`absolute border-2 ${
                          selectedItem === item.id
                            ? "border-blue-500 bg-blue-100"
                            : "border-slate-300 bg-slate-100 hover:border-slate-400"
                        }`}
                        style={{
                          left: `${item.x}px`,
                          top: `${item.y}px`,
                          width: `${item.width}px`,
                          height: `${item.height}px`,
                          zIndex: selectedItem === item.id ? 10 : 1,
                          cursor:
                            dragState?.itemId === item.id ? "grabbing" : "grab",
                          userSelect: "none",
                        }}
                        onMouseDown={(e) => handleMouseDown(e, item.id, "move")}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(item.id);
                        }}
                      >
                        {/* Item Content */}
                        <div className="flex items-center justify-center h-full pointer-events-none select-none">
                          <div className="text-center">
                            <div className="font-semibold text-slate-700">
                              Item {item.id}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              {item.width} × {item.height}
                            </div>
                          </div>
                        </div>

                        {/* Resize Handles */}
                        {selectedItem === item.id && (
                          <>
                            <div
                              className="absolute -top-1.5 -left-1.5 w-4 h-4 bg-blue-600 border-2 border-white cursor-nw-resize rounded-full z-20"
                              onMouseDown={(e) =>
                                handleMouseDown(e, item.id, "resize-nw")
                              }
                              style={{ pointerEvents: "auto" }}
                            />
                            <div
                              className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-600 border-2 border-white cursor-ne-resize rounded-full z-20"
                              onMouseDown={(e) =>
                                handleMouseDown(e, item.id, "resize-ne")
                              }
                              style={{ pointerEvents: "auto" }}
                            />
                            <div
                              className="absolute -bottom-1.5 -left-1.5 w-4 h-4 bg-blue-600 border-2 border-white cursor-sw-resize rounded-full z-20"
                              onMouseDown={(e) =>
                                handleMouseDown(e, item.id, "resize-sw")
                              }
                              style={{ pointerEvents: "auto" }}
                            />
                            <div
                              className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-blue-600 border-2 border-white cursor-se-resize rounded-full z-20"
                              onMouseDown={(e) =>
                                handleMouseDown(e, item.id, "resize-se")
                              }
                              style={{ pointerEvents: "auto" }}
                            />
                            <div
                              className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-600 border-2 border-white cursor-n-resize rounded-full z-20"
                              onMouseDown={(e) =>
                                handleMouseDown(e, item.id, "resize-n")
                              }
                              style={{ pointerEvents: "auto" }}
                            />
                            <div
                              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-600 border-2 border-white cursor-s-resize rounded-full z-20"
                              onMouseDown={(e) =>
                                handleMouseDown(e, item.id, "resize-s")
                              }
                              style={{ pointerEvents: "auto" }}
                            />
                            <div
                              className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 border-2 border-white cursor-w-resize rounded-full z-20"
                              onMouseDown={(e) =>
                                handleMouseDown(e, item.id, "resize-w")
                              }
                              style={{ pointerEvents: "auto" }}
                            />
                            <div
                              className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 border-2 border-white cursor-e-resize rounded-full z-20"
                              onMouseDown={(e) =>
                                handleMouseDown(e, item.id, "resize-e")
                              }
                              style={{ pointerEvents: "auto" }}
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Code Output */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Generated CSS
                  </h2>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generateAllCSS());
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check size={16} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copy All
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-slate-900 rounded-lg p-4 max-h-[600px] overflow-y-auto">
                  <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
                    {generateAllCSS()}
                  </pre>
                </div>
              </div>

              {/* Individual Item CSS */}
              {selectedItem && (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Item {selectedItem} CSS
                    </h2>
                    <button
                      onClick={() => {
                        const item = editorItems.find(
                          (i) => i.id === selectedItem,
                        );
                        if (item) {
                          navigator.clipboard.writeText(
                            generateItemCSSWithSpacing(item),
                          );
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-slate-600 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      <Copy size={16} />
                      Copy
                    </button>
                  </div>

                  <div className="bg-slate-900 rounded-lg p-4">
                    <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
                      {(() => {
                        const item = editorItems.find(
                          (i) => i.id === selectedItem,
                        );
                        return item ? generateItemCSSWithSpacing(item) : "";
                      })()}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pattern Library Tab */}
        {activeTab === "patterns" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Pattern Library
              </h2>
              <p className="text-sm text-slate-600 mb-6">
                Common UI patterns with proper spacing from your scale
              </p>

              {/* Navigation Bar Pattern */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Navigation Bar
                </h3>
                <div className="border-2 border-slate-200 rounded-lg p-6 bg-slate-50">
                  <div
                    className="bg-white rounded-lg shadow-sm"
                    style={{
                      padding: `${spacingScale[2]?.value || 16}px ${spacingScale[4]?.value || 32}px`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="flex items-center"
                        style={{ gap: `${spacingScale[6]?.value || 48}px` }}
                      >
                        <div className="font-bold text-lg">Logo</div>
                        <nav
                          className="flex"
                          style={{ gap: `${spacingScale[4]?.value || 32}px` }}
                        >
                          <a
                            href="#"
                            className="text-slate-700 hover:text-blue-600"
                          >
                            Home
                          </a>
                          <a
                            href="#"
                            className="text-slate-700 hover:text-blue-600"
                          >
                            Products
                          </a>
                          <a
                            href="#"
                            className="text-slate-700 hover:text-blue-600"
                          >
                            About
                          </a>
                        </nav>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                        Sign In
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-slate-700">
                    <code>
                      padding: {spacingScale[2]?.name} {spacingScale[4]?.name} (
                      {spacingScale[2]?.value}px {spacingScale[4]?.value}px) |
                      gap: {spacingScale[6]?.name} & {spacingScale[4]?.name}
                    </code>
                  </div>
                </div>
              </div>

              {/* Card Grid Pattern */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Card Grid
                </h3>
                <div className="border-2 border-slate-200 rounded-lg p-6 bg-slate-50">
                  <div
                    className="grid grid-cols-3"
                    style={{ gap: `${spacingScale[4]?.value || 32}px` }}
                  >
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-white rounded-lg shadow-sm border border-slate-200"
                        style={{ padding: `${spacingScale[4]?.value || 32}px` }}
                      >
                        <div className="w-full h-32 bg-slate-200 rounded mb-4"></div>
                        <h4 className="font-semibold mb-2">Card Title {i}</h4>
                        <p className="text-sm text-slate-600">
                          Card description with proper spacing applied.
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-slate-700">
                    <code>
                      grid gap: {spacingScale[4]?.name} (
                      {spacingScale[4]?.value}px) | card padding:{" "}
                      {spacingScale[4]?.name}
                    </code>
                  </div>
                </div>
              </div>

              {/* Form Pattern */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Form Layout
                </h3>
                <div className="border-2 border-slate-200 rounded-lg p-6 bg-slate-50">
                  <div
                    className="bg-white rounded-lg shadow-sm border border-slate-200 max-w-md"
                    style={{ padding: `${spacingScale[6]?.value || 48}px` }}
                  >
                    <h3 className="text-xl font-semibold mb-1">Sign Up</h3>
                    <p
                      className="text-sm text-slate-600"
                      style={{
                        marginBottom: `${spacingScale[5]?.value || 40}px`,
                      }}
                    >
                      Create your account
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label
                          className="block text-sm font-medium text-slate-700"
                          style={{
                            marginBottom: `${spacingScale[1]?.value || 8}px`,
                          }}
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                          style={{
                            padding: `${spacingScale[2]?.value || 16}px`,
                          }}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium text-slate-700"
                          style={{
                            marginBottom: `${spacingScale[1]?.value || 8}px`,
                          }}
                        >
                          Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                          style={{
                            padding: `${spacingScale[2]?.value || 16}px`,
                          }}
                        />
                      </div>
                      <button
                        className="w-full bg-blue-600 text-white rounded-lg"
                        style={{
                          padding: `${spacingScale[2]?.value || 16}px`,
                          marginTop: `${spacingScale[3]?.value || 24}px`,
                        }}
                      >
                        Create Account
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-slate-700">
                    <code>
                      container padding: {spacingScale[6]?.name} | field
                      spacing: {spacingScale[1]?.name} | button margin-top:{" "}
                      {spacingScale[3]?.name}
                    </code>
                  </div>
                </div>
              </div>

              {/* Hero Section Pattern */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Hero Section
                </h3>
                <div className="border-2 border-slate-200 rounded-lg p-6 bg-slate-50">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-center"
                    style={{
                      padding: `${spacingScale[8]?.value || 64}px ${spacingScale[4]?.value || 32}px`,
                    }}
                  >
                    <h1
                      className="text-4xl font-bold"
                      style={{
                        marginBottom: `${spacingScale[3]?.value || 24}px`,
                      }}
                    >
                      Welcome to Our Product
                    </h1>
                    <p
                      className="text-lg opacity-90"
                      style={{
                        marginBottom: `${spacingScale[5]?.value || 40}px`,
                      }}
                    >
                      Build amazing things with our spacing system
                    </p>
                    <div
                      className="flex justify-center"
                      style={{ gap: `${spacingScale[3]?.value || 24}px` }}
                    >
                      <button
                        className="bg-white text-blue-600 font-semibold rounded-lg"
                        style={{
                          padding: `${spacingScale[2]?.value || 16}px ${spacingScale[4]?.value || 32}px`,
                        }}
                      >
                        Get Started
                      </button>
                      <button
                        className="border-2 border-white text-white font-semibold rounded-lg"
                        style={{
                          padding: `${spacingScale[2]?.value || 16}px ${spacingScale[4]?.value || 32}px`,
                        }}
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-slate-700">
                    <code>
                      padding: {spacingScale[8]?.name} {spacingScale[4]?.name} |
                      heading margin: {spacingScale[3]?.name} | button gap:{" "}
                      {spacingScale[3]?.name}
                    </code>
                  </div>
                </div>
              </div>

              {/* Feature List Pattern */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Feature List
                </h3>
                <div className="border-2 border-slate-200 rounded-lg p-6 bg-slate-50">
                  <div className="bg-white rounded-lg">
                    <div
                      className="grid grid-cols-2"
                      style={{
                        gap: `${spacingScale[5]?.value || 40}px`,
                        padding: `${spacingScale[5]?.value || 40}px`,
                      }}
                    >
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i}>
                          <div
                            className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold"
                            style={{
                              marginBottom: `${spacingScale[3]?.value || 24}px`,
                            }}
                          >
                            {i}
                          </div>
                          <h4 className="font-semibold mb-2">Feature {i}</h4>
                          <p className="text-sm text-slate-600">
                            Description of this amazing feature with proper
                            spacing.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-slate-700">
                    <code>
                      grid gap: {spacingScale[5]?.name} | icon margin-bottom:{" "}
                      {spacingScale[3]?.name}
                    </code>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-2">💡 Pro Tip</h3>
                <p className="text-sm text-green-800">
                  These patterns use spacing tokens from your generated scale.
                  Copy the code snippets and adjust the spacing values to match
                  your design needs. All spacing values are responsive to your
                  scale changes!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Export Tab */}
        {activeTab === "export" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Export Format
                </h2>

                <div className="space-y-3">
                  <button
                    onClick={() => setExportFormat("tailwind")}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                      exportFormat === "tailwind"
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : "border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <div className="font-medium">Tailwind CSS</div>
                    <div className="text-xs opacity-75 mt-1">
                      tailwind.config.js
                    </div>
                  </button>

                  {exportFormat === "tailwind" && (
                    <div className="ml-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={extendTailwind}
                          onChange={(e) => setExtendTailwind(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-700">
                          Use{" "}
                          <code className="bg-slate-200 px-1 rounded text-xs">
                            extend
                          </code>{" "}
                          mode
                        </span>
                      </label>
                      <p className="text-xs text-slate-500 mt-1 ml-6">
                        Merges with default Tailwind spacing instead of
                        replacing it
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => setExportFormat("css")}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                      exportFormat === "css"
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : "border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <div className="font-medium">CSS Variables</div>
                    <div className="text-xs opacity-75 mt-1">
                      :root custom properties
                    </div>
                  </button>

                  <button
                    onClick={() => setExportFormat("scss")}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                      exportFormat === "scss"
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : "border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <div className="font-medium">SCSS Variables</div>
                    <div className="text-xs opacity-75 mt-1">
                      Sass/SCSS format
                    </div>
                  </button>

                  <button
                    onClick={() => setExportFormat("js")}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                      exportFormat === "js"
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : "border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <div className="font-medium">JavaScript/TypeScript</div>
                    <div className="text-xs opacity-75 mt-1">
                      ES6 export object
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-900">
                    Generated Code
                  </h2>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check size={16} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-slate-900 rounded-lg p-6 overflow-x-auto">
                  <pre className="text-sm text-slate-100 font-mono">
                    {generateExport()}
                  </pre>
                </div>

                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h3 className="font-medium text-amber-900 mb-2">
                    Usage Instructions
                  </h3>
                  <div className="text-sm text-amber-800 space-y-2">
                    {exportFormat === "tailwind" && (
                      <>
                        <p>
                          1. Copy the code above into your{" "}
                          <code className="bg-amber-100 px-1 rounded">
                            tailwind.config.js
                          </code>
                        </p>
                        <p>
                          2. Use in your JSX:{" "}
                          <code className="bg-amber-100 px-1 rounded">
                            className="p-4 gap-2"
                          </code>
                        </p>
                        <p>3. The numbers correspond to your scale steps</p>
                        {extendTailwind && (
                          <p className="text-amber-900 font-medium mt-2">
                            ✓ Extend mode: Your spacing merges with Tailwind
                            defaults
                          </p>
                        )}
                      </>
                    )}
                    {exportFormat === "css" && (
                      <>
                        <p>1. Add these variables to your CSS file</p>
                        <p>
                          2. Use:{" "}
                          <code className="bg-amber-100 px-1 rounded">
                            padding: var(--space-4)
                          </code>
                        </p>
                        <p>3. Works in any CSS, SCSS, or styled-components</p>
                      </>
                    )}
                    {exportFormat === "scss" && (
                      <>
                        <p>1. Import into your SCSS files</p>
                        <p>
                          2. Use:{" "}
                          <code className="bg-amber-100 px-1 rounded">
                            padding: $space-4
                          </code>
                        </p>
                        <p>3. Can be used in calculations and mixins</p>
                      </>
                    )}
                    {exportFormat === "js" && (
                      <>
                        <p>
                          1. Import:{" "}
                          <code className="bg-amber-100 px-1 rounded">
                            import &#123; spacing &#125; from './spacing'
                          </code>
                        </p>
                        <p>
                          2. Use:{" "}
                          <code className="bg-amber-100 px-1 rounded">
                            style=&#123;&#123; padding: spacing['space-4']
                            &#125;&#125;
                          </code>
                        </p>
                        <p>3. Perfect for styled-components or CSS-in-JS</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-slate-500">
          <p>
            Complete System: Generator • Calculator • Playground • Interactive •
            Patterns • Export | World-class spacing 🚀
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpacingSystem;

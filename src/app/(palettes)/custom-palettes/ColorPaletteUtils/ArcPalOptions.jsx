import { useState } from "react";
import { useColorPaletteContext } from "../../ColorContext";
import arcPalGen from "./arcPalGen";

export default function ArcPalOptions() {
  const { setPalette, setDuplicatePalette, oklch, arcPalType, setArcPalType } =
    useColorPaletteContext();

  // State for arc-specific options
  const [numColors, setNumColors] = useState(10);
  const [hueSpan, setHueSpan] = useState(180);
  const [radius, setRadius] = useState(0.12);
  const [lRange, setLRange] = useState(0.4);
  const [cRange, setCRange] = useState(0.15);
  const [direction, setDirection] = useState("upRight");
  const [spiralDirection, setSpiralDirection] = useState("upRight");
  const [helixDirection, setHelixDirection] = useState("upRight");
  const [startAngle, setStartAngle] = useState(-90);
  const [endAngle, setEndAngle] = useState(90);

  const arcTypes = [
    // Color Wheel Arcs
    { id: "hues", label: "Hue Sweep", category: "Color Wheel" },
    { id: "analog", label: "Analogous", category: "Color Wheel" },
    { id: "comp", label: "Complementary", category: "Color Wheel" },

    // Color Area Arcs (fixed hue)
    { id: "circularLC", label: "Circular LC Arc", category: "Color Area" },
    { id: "lightness", label: "Lightness Ramp", category: "Color Area" },
    { id: "chroma", label: "Chroma Ramp", category: "Color Area" },
    { id: "diagonalLC", label: "Diagonal LC", category: "Color Area" },

    // 3D Arcs
    { id: "spiral", label: "Spiral", category: "3D Space" },
    { id: "helix", label: "Helix", category: "3D Space" },
  ];

  const handleTypeChange = (value) => {
    setArcPalType(value);
    generatePalette(value);
  };

  const generatePalette = (type = arcPalType) => {
    console.log("Generating palette with type:", type);
    const options = {
      hueSpan,
      radius,
      lRange,
      cRange,
      direction,
      spiralDirection,
      helixDirection,
      startAngle,
      endAngle,
    };
    console.log("Options:", options);

    const pal = arcPalGen(oklch, type, numColors, options);
    console.log("Generated palette:", pal);
    setPalette(pal);
    setDuplicatePalette(pal);
  };

  // Regenerate palette when options change
  const handleOptionChange = (setter, value) => {
    setter(value);
    // Slight delay to ensure state updates
    setTimeout(() => generatePalette(), 0);
  };

  // Group arc types by category
  const groupedTypes = arcTypes.reduce((acc, type) => {
    if (!acc[type.category]) acc[type.category] = [];
    acc[type.category].push(type);
    return acc;
  }, {});

  // Determine which options to show based on selected arc type
  // FIXED: Use the actual IDs from arcTypes array
  const showHueSpan = ["hues", "analog", "comp", "spiral", "helix"].includes(
    arcPalType,
  );
  const showRadius = ["circularLC", "helix"].includes(arcPalType);
  const showLRange = ["lightness", "diagonalLC", "spiral"].includes(arcPalType);
  const showCRange = ["chroma", "diagonalLC", "spiral"].includes(arcPalType);
  const showDirection = arcPalType === "diagonalLC";
  const showSpiralDirection = arcPalType === "spiral";
  const showHelixDirection = arcPalType === "helix";
  const showAngles = arcPalType === "circularLC";

  return (
    <div className="space-y-6">
      {/* Arc Type Selection */}
      <div className="space-y-4">
        {Object.entries(groupedTypes).map(([category, types]) => (
          <div key={category} className="space-y-2">
            <h3 className="font-semibold text-sm opacity-70">{category}</h3>
            {types.map(({ id, label }) => (
              <div key={id} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="arcPal"
                  id={id}
                  value={id}
                  checked={arcPalType === id}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="cursor-pointer"
                />
                <label htmlFor={id} className="cursor-pointer">
                  {label}
                </label>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Global Options */}
      <div className="space-y-3 pt-4 border-t">
        <h3 className="font-semibold text-sm">Options</h3>

        {/* Number of Colors */}
        <div className="space-y-1">
          <label className="text-sm flex justify-between">
            <span>Number of Colors</span>
            <span className="opacity-60">{numColors}</span>
          </label>
          <input
            type="range"
            min="3"
            max="20"
            step="1"
            value={numColors}
            onChange={(e) =>
              handleOptionChange(setNumColors, parseInt(e.target.value))
            }
            className="w-full"
          />
        </div>

        {/* Hue Span */}
        {showHueSpan && (
          <div className="space-y-1">
            <label className="text-sm flex justify-between">
              <span>Hue Span (degrees)</span>
              <span className="opacity-60">{hueSpan}°</span>
            </label>
            <input
              type="range"
              min="15"
              max="360"
              step="15"
              value={hueSpan}
              onChange={(e) =>
                handleOptionChange(setHueSpan, parseInt(e.target.value))
              }
              className="w-full"
            />
          </div>
        )}

        {/* Radius */}
        {showRadius && (
          <div className="space-y-1">
            <label className="text-sm flex justify-between">
              <span>Arc Radius</span>
              <span className="opacity-60">{radius.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="0.05"
              max="0.25"
              step="0.01"
              value={radius}
              onChange={(e) =>
                handleOptionChange(setRadius, parseFloat(e.target.value))
              }
              className="w-full"
            />
          </div>
        )}

        {/* Lightness Range */}
        {showLRange && (
          <div className="space-y-1">
            <label className="text-sm flex justify-between">
              <span>Lightness Range</span>
              <span className="opacity-60">{lRange.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="0.7"
              step="0.05"
              value={lRange}
              onChange={(e) =>
                handleOptionChange(setLRange, parseFloat(e.target.value))
              }
              className="w-full"
            />
          </div>
        )}

        {/* Chroma Range */}
        {showCRange && (
          <div className="space-y-1">
            <label className="text-sm flex justify-between">
              <span>Chroma Range</span>
              <span className="opacity-60">{cRange.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="0.05"
              max="0.3"
              step="0.01"
              value={cRange}
              onChange={(e) =>
                handleOptionChange(setCRange, parseFloat(e.target.value))
              }
              className="w-full"
            />
          </div>
        )}

        {/* Direction (for diagonal LC) */}
        {showDirection && (
          <div className="space-y-1">
            <label className="text-sm">Direction</label>
            <select
              value={direction}
              onChange={(e) => handleOptionChange(setDirection, e.target.value)}
              className="w-full px-2 py-1 border rounded"
            >
              <option value="upRight">Up Right ↗</option>
              <option value="upLeft">Up Left ↖</option>
              <option value="downRight">Down Right ↘</option>
              <option value="downLeft">Down Left ↙</option>
            </select>
          </div>
        )}

        {/* Spiral Direction */}
        {showSpiralDirection && (
          <div className="space-y-1">
            <label className="text-sm">Spiral Direction</label>
            <select
              value={spiralDirection}
              onChange={(e) =>
                handleOptionChange(setSpiralDirection, e.target.value)
              }
              className="w-full px-2 py-1 rounded-md border border-(--navBorder) hover:border-muted-foreground bg-background"
            >
              <option value="upRight">Up Right ↗</option>
              <option value="upLeft">Up Left ↖</option>
              <option value="downRight">Down Right ↘</option>
              <option value="downLeft">Down Left ↙</option>
            </select>
          </div>
        )}

        {/* Helix Direction */}
        {showHelixDirection && (
          <div className="space-y-1">
            <label className="text-sm">Helix Direction</label>
            <select
              value={helixDirection}
              onChange={(e) =>
                handleOptionChange(setHelixDirection, e.target.value)
              }
              className="w-full px-2 py-1 rounded-md border border-(--navBorder) hover:border-muted-foreground bg-background"
            >
              <option value="upRight">Up Right ↗</option>
              <option value="upLeft">Up Left ↖</option>
              <option value="downRight">Down Right ↘</option>
              <option value="downLeft">Down Left ↙</option>
            </select>
          </div>
        )}

        {/* Start/End Angles (for circular LC) */}
        {showAngles && (
          <>
            <div className="space-y-1">
              <label className="text-sm flex justify-between">
                <span>Start Angle</span>
                <span className="opacity-60">{startAngle}°</span>
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                step="15"
                value={startAngle}
                onChange={(e) =>
                  handleOptionChange(setStartAngle, parseInt(e.target.value))
                }
                className="w-full"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm flex justify-between">
                <span>End Angle</span>
                <span className="opacity-60">{endAngle}°</span>
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                step="15"
                value={endAngle}
                onChange={(e) =>
                  handleOptionChange(setEndAngle, parseInt(e.target.value))
                }
                className="w-full"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

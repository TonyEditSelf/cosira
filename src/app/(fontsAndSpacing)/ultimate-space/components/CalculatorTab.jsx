import React, { useState } from "react";
import {
  calculateGridSpacing,
  findClosestSpacing,
  findNeighbors,
  generateFluidSpacing,
} from "../utils/spacingCalculations";

export default function CalculatorTab({ spacingScale }) {
  const [containerWidth, setContainerWidth] = useState(1200);
  const [containerHeight, setContainerHeight] = useState(600);
  const [itemCount, setItemCount] = useState(4);
  const [currentValue, setCurrentValue] = useState(24);
  const [mobileSpacing, setMobileSpacing] = useState(16);
  const [desktopSpacing, setDesktopSpacing] = useState(32);
  const [minViewport, setMinViewport] = useState(375);
  const [maxViewport, setMaxViewport] = useState(1440);

  const handleContainerWidthChange = (value) => {
    const num = Number(value);
    if (isNaN(num) || num < 100) setContainerWidth(100);
    else if (num > 5000) setContainerWidth(5000);
    else setContainerWidth(num);
  };

  const handleContainerHeightChange = (value) => {
    const num = Number(value);
    if (isNaN(num) || num < 100) setContainerHeight(100);
    else if (num > 5000) setContainerHeight(5000);
    else setContainerHeight(num);
  };

  const handleItemCountChange = (value) => {
    const num = Number(value);
    if (isNaN(num) || num < 1) setItemCount(1);
    else if (num > 20) setItemCount(20);
    else setItemCount(num);
  };

  const result = calculateGridSpacing(spacingScale, containerWidth, itemCount);
  const gapCount = itemCount - 1;
  const closest = findClosestSpacing(spacingScale, currentValue);
  const neighbors = findNeighbors(spacingScale, closest?.value || 0);
  const fluid = generateFluidSpacing(
    mobileSpacing,
    desktopSpacing,
    minViewport,
    maxViewport,
    spacingScale,
  );

  return (
    <div className="space-y-6 overflow-visible">
      {/* Grid Layout Calculator */}
      <div className="bg-background rounded-lg shadow-sm border border-[var(--navBorder)] p-6">
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
              className="w-full px-4 py-2 border border-[var(--navBorder)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              onChange={(e) => handleContainerHeightChange(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--navBorder)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-4 py-2 border border-[var(--navBorder)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="1"
              max="20"
            />
          </div>
        </div>

        <div className="mt-6 p-6 bg-background border-2 border-[var(--navBorder)] rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-4">
            Recommended Solution:
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <span className="text-sm text-slate-600">Container width:</span>
              <span className="font-mono text-slate-700">
                {containerWidth}px
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <span className="text-sm text-slate-600">Recommended gap:</span>
              <span className="font-mono font-bold text-blue-600">
                {result.closest?.name} ({result.closest?.value}px)
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <span className="text-sm text-slate-600">Item width:</span>
              <span className="font-mono font-bold text-slate-900">
                {result.itemWidth.toFixed(2)}px
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <span className="text-sm text-slate-600">Math:</span>
              <span className="font-mono text-xs text-slate-600">
                {itemCount}×{result.itemWidth.toFixed(1)} + {gapCount}×
                {result.closest?.value} ={" "}
                {(result.itemWidth * itemCount + result.totalGapSpace).toFixed(
                  1,
                )}
                px
              </span>
            </div>
          </div>

          {/* Visual Preview */}
          <div className="mt-4 p-4 bg-background rounded-lg">
            <p className="text-xs text-slate-500 mb-2">
              Visual Preview (container: {containerWidth}px × {containerHeight}
              px):
            </p>
            <div className="overflow-auto">
              <div
                className="grid border-2 border-dashed border-slate-400 bg-background"
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
              Container: {containerWidth}px × {containerHeight}px | Gap:{" "}
              {result.closest?.value}px | Items fit: {itemCount}
            </p>
          </div>

          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-xs text-blue-900 font-medium mb-1">Usage:</p>
            <code className="text-xs text-blue-800 font-mono">
              className="grid grid-cols-{itemCount} gap-
              {result.closest?.name.replace("space-", "")}"
            </code>
          </div>
        </div>
      </div>

      {/* Spacing Navigator */}
      <div className="bg-background rounded-lg shadow-sm border border-[var(--navBorder)] p-6">
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
            className="w-full px-4 py-2 border border-[var(--navBorder)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
          />
        </div>

        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Smaller */}
            <div
              className={`p-4 rounded-lg border-2 ${neighbors.smaller ? "bg-background border-[var(--navBorder)]" : "bg-background border-[var(--navBorder)] opacity-50"}`}
            >
              <div className="text-xs text-slate-500 mb-2">← Smaller</div>
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
                <div className="text-sm text-slate-400">No smaller value</div>
              )}
            </div>

            {/* Current/Closest */}
            <div className="p-4 rounded-lg border-2 bg-background border-blue-500">
              <div className="text-xs text-blue-600 mb-2">Current/Closest</div>
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
              className={`p-4 rounded-lg border-2 ${neighbors.larger ? "bg-background border-[var(--navBorder)]" : "bg-background border-[var(--navBorder)] opacity-50"}`}
            >
              <div className="text-xs text-slate-500 mb-2">Larger →</div>
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
                <div className="text-sm text-slate-400">No larger value</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fluid/Responsive Spacing */}
      <div className="bg-background rounded-lg shadow-sm border border-[var(--navBorder)] p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Fluid Spacing Generator
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          Generate responsive spacing that scales smoothly between breakpoints
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
              className="w-full px-4 py-2 border border-[var(--navBorder)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-4 py-2 border border-[var(--navBorder)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-4 py-2 border border-[var(--navBorder)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-4 py-2 border border-[var(--navBorder)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="768"
            />
          </div>
        </div>

        <div className="p-6 bg-background border-2 border-purple-200 rounded-lg">
          <h3 className="font-semibold text-purple-900 mb-4">Generated CSS:</h3>

          <div className="bg-slate-900 rounded-lg p-4 mb-4">
            <code className="text-sm text-green-400 font-mono">
              padding: {fluid.clampValue};
            </code>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-background rounded-lg">
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

            <div className="p-3 bg-background rounded-lg">
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
              Spacing will scale smoothly between {minViewport}px and{" "}
              {maxViewport}px viewports
            </li>
            <li>No media queries needed!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

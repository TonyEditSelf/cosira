import React from "react";
import { Info } from "lucide-react";

export default function GeneratorTab({
  baseUnit,
  scaleType,
  customRatio,
  steps,
  spacingScale,
  onBaseUnitChange,
  onScaleTypeChange,
  onRatioChange,
  onStepsChange,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-visible">
      {/* Controls */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-background rounded-lg shadow-sm border border-[var(--navBorder)] p-6">
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
              onChange={(e) => onBaseUnitChange(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--navBorder)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="1"
              max="32"
            />
            <p className="text-xs text-slate-500 mt-1">Common: 4, 8, or 16</p>
          </div>

          {/* Scale Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Scale Type
            </label>
            <select
              value={scaleType}
              onChange={(e) => onScaleTypeChange(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--navBorder)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                onChange={(e) => onRatioChange(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--navBorder)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1.1"
                max="3"
                step="0.1"
              />
              <p className="text-xs text-slate-500 mt-1">Golden ratio: 1.618</p>
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
                onChange={(e) => onStepsChange(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--navBorder)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="5"
                max="20"
              />
            </div>
          )}

          {scaleType === "t-shirt" && (
            <div className="mb-6 p-4 bg-background border border-[var(--navBorder)] rounded-lg">
              <p className="text-sm text-slate-600">
                T-shirt sizing uses fixed semantic names (3xs through 6xl) and
                generates 12 sizes total.
              </p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-background border border-[var(--navBorder)] rounded-lg p-4">
            <div className="flex gap-2">
              <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
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
        <div className="bg-background rounded-lg shadow-sm border border-[var(--navBorder)] p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Your Spacing Scale
          </h2>
          <div className="space-y-3">
            {spacingScale.map((space, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 bg-background rounded-lg hover:bg-background transition-colors"
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
  );
}

"use client";

import React, { useState } from "react";
import { Settings, Layout, Code } from "lucide-react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useSpacingScale } from "./hooks/useSpacingScale";
import GeneratorTab from "./components/GeneratorTab";
import CalculatorTab from "./components/CalculatorTab";
import PlaygroundTab from "./components/PlaygroundTab";
import InteractiveTab from "./components/InteractiveTab";
import PatternsTab from "./components/PatternsTab";
import ExportTab from "./components/ExportTab";

const SpacingSystem = () => {
  // Use custom hooks for localStorage
  const [baseUnit, setBaseUnit] = useLocalStorage("spacing-baseUnit", "8");
  const [scaleType, setScaleType] = useLocalStorage(
    "spacing-scaleType",
    "linear",
  );
  const [customRatio, setCustomRatio] = useLocalStorage(
    "spacing-customRatio",
    "1.5",
  );
  const [steps, setSteps] = useLocalStorage("spacing-steps", "12");
  const [exportFormat, setExportFormat] = useLocalStorage(
    "spacing-exportFormat",
    "tailwind",
  );
  const [extendTailwind, setExtendTailwind] = useLocalStorage(
    "spacing-extendTailwind",
    "false",
  );

  const [activeTab, setActiveTab] = useState("generator");

  // Generate spacing scale
  const spacingScale = useSpacingScale(
    Number(baseUnit),
    scaleType,
    Number(customRatio),
    Number(steps),
  );

  // Validation handlers
  const handleBaseUnitChange = (value) => {
    const num = Number(value);
    if (isNaN(num) || num < 1) setBaseUnit("1");
    else if (num > 32) setBaseUnit("32");
    else setBaseUnit(value);
  };

  const handleRatioChange = (value) => {
    const num = Number(value);
    if (isNaN(num) || num < 1.1) setCustomRatio("1.1");
    else if (num > 3) setCustomRatio("3");
    else setCustomRatio(value);
  };

  const handleStepsChange = (value) => {
    const num = Number(value);
    if (isNaN(num) || num < 5) setSteps("5");
    else if (num > 20) setSteps("20");
    else setSteps(value);
  };

  return (
    <div
      className="min-h-screen bg-background p-4 md:p-8"
      style={{ overflowY: "scroll", height: "100vh" }}
    >
      <div className="max-w-7xl mx-auto" style={{ minHeight: "100%" }}>
        {/* Tab Navigation */}
        <div className="bg-background rounded-lg shadow-sm border border-[var(--navBorder)] mb-6">
          <div className="flex border-b border-[var(--navBorder)] overflow-x-auto">
            <button
              onClick={() => setActiveTab("generator")}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === "generator"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-background"
                  : "text-slate-600 hover:text-slate-900 hover:bg-background"
              }`}
            >
              <Settings size={20} />
              Generator
            </button>
            <button
              onClick={() => setActiveTab("calculator")}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === "calculator"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-background"
                  : "text-slate-600 hover:text-slate-900 hover:bg-background"
              }`}
            >
              <Settings size={20} />
              Calculator
            </button>
            <button
              onClick={() => setActiveTab("playground")}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === "playground"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-background"
                  : "text-slate-600 hover:text-slate-900 hover:bg-background"
              }`}
            >
              <Layout size={20} />
              Playground
            </button>
            <button
              onClick={() => setActiveTab("interactive")}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === "interactive"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-background"
                  : "text-slate-600 hover:text-slate-900 hover:bg-background"
              }`}
            >
              <Layout size={20} />
              Interactive
            </button>
            <button
              onClick={() => setActiveTab("patterns")}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === "patterns"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-background"
                  : "text-slate-600 hover:text-slate-900 hover:bg-background"
              }`}
            >
              <Layout size={20} />
              Patterns
            </button>
            <button
              onClick={() => setActiveTab("export")}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === "export"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-background"
                  : "text-slate-600 hover:text-slate-900 hover:bg-background"
              }`}
            >
              <Code size={20} />
              Export
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "generator" && (
          <GeneratorTab
            baseUnit={Number(baseUnit)}
            scaleType={scaleType}
            customRatio={Number(customRatio)}
            steps={Number(steps)}
            spacingScale={spacingScale}
            onBaseUnitChange={handleBaseUnitChange}
            onScaleTypeChange={setScaleType}
            onRatioChange={handleRatioChange}
            onStepsChange={handleStepsChange}
          />
        )}

        {activeTab === "calculator" && (
          <CalculatorTab spacingScale={spacingScale} />
        )}

        {activeTab === "playground" && (
          <PlaygroundTab spacingScale={spacingScale} />
        )}

        {activeTab === "interactive" && (
          <InteractiveTab spacingScale={spacingScale} />
        )}

        {activeTab === "patterns" && (
          <PatternsTab spacingScale={spacingScale} />
        )}

        {activeTab === "export" && (
          <ExportTab
            spacingScale={spacingScale}
            exportFormat={exportFormat}
            setExportFormat={setExportFormat}
            extendTailwind={extendTailwind === "true"}
            setExtendTailwind={(value) =>
              setExtendTailwind(value ? "true" : "false")
            }
          />
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

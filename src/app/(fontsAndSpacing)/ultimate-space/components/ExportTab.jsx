import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { generateExport } from "../utils/spacingCalculations";

export default function ExportTab({
  spacingScale,
  exportFormat,
  setExportFormat,
  extendTailwind,
  setExtendTailwind,
}) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      generateExport(spacingScale, exportFormat, extendTailwind),
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-visible">
      <div className="lg:col-span-1">
        <div className="bg-background rounded-lg shadow-sm border border-[var(--navBorder)] p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Export Format
          </h2>

          <div className="space-y-3">
            <button
              onClick={() => setExportFormat("tailwind")}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                exportFormat === "tailwind"
                  ? "border-blue-500 bg-background text-blue-900"
                  : "border-[var(--navBorder)] hover:border-[var(--navBorder)] text-slate-700"
              }`}
            >
              <div className="font-medium">Tailwind CSS</div>
              <div className="text-xs opacity-75 mt-1">tailwind.config.js</div>
            </button>

            {exportFormat === "tailwind" && (
              <div className="ml-4 p-3 bg-background rounded-lg border border-[var(--navBorder)]">
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
                  Merges with default Tailwind spacing instead of replacing it
                </p>
              </div>
            )}

            <button
              onClick={() => setExportFormat("css")}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                exportFormat === "css"
                  ? "border-blue-500 bg-background text-blue-900"
                  : "border-[var(--navBorder)] hover:border-[var(--navBorder)] text-slate-700"
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
                  ? "border-blue-500 bg-background text-blue-900"
                  : "border-[var(--navBorder)] hover:border-[var(--navBorder)] text-slate-700"
              }`}
            >
              <div className="font-medium">SCSS Variables</div>
              <div className="text-xs opacity-75 mt-1">Sass/SCSS format</div>
            </button>

            <button
              onClick={() => setExportFormat("js")}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                exportFormat === "js"
                  ? "border-blue-500 bg-background text-blue-900"
                  : "border-[var(--navBorder)] hover:border-[var(--navBorder)] text-slate-700"
              }`}
            >
              <div className="font-medium">JavaScript/TypeScript</div>
              <div className="text-xs opacity-75 mt-1">ES6 export object</div>
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-background rounded-lg shadow-sm border border-[var(--navBorder)] p-6">
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
              {generateExport(spacingScale, exportFormat, extendTailwind)}
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
                      ✓ Extend mode: Your spacing merges with Tailwind defaults
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
  );
}

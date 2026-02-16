import React from "react";

export default function PlaygroundTab({ spacingScale }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-visible">
      {/* Component Examples */}
      <div className="space-y-6">
        <div className="bg-background rounded-lg shadow-sm border border-[var(--navBorder)] p-6">
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

        <div className="bg-background rounded-lg shadow-sm border border-[var(--navBorder)] p-6">
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
                  className="border-2 border-[var(--navBorder)] rounded-lg"
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
        <div className="bg-background rounded-lg shadow-sm border border-[var(--navBorder)] p-6">
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

        <div className="bg-background rounded-lg shadow-sm border border-[var(--navBorder)] p-6">
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
  );
}

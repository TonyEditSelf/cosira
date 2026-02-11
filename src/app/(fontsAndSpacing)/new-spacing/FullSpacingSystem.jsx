import { useMemo, useState } from "react";

const SCALE_TYPES = {
  linear: {
    name: "Linear",
    description: "Even increments",
    generate: (base, steps) => {
      const multipliers = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 8, 12, 16];
      return multipliers.slice(0, steps).map((m, i) => ({
        name:
          i === 0
            ? "xs"
            : i === 1
              ? "sm"
              : i === 2
                ? "md"
                : i === 3
                  ? "base"
                  : i === 4
                    ? "lg"
                    : i === 5
                      ? "xl"
                      : `${i - 3}xl`,
        value: Math.round(base * m),
        multiplier: m,
      }));
    },
  },
  fibonacci: {
    name: "Fibonacci",
    description: "Natural growth pattern",
    generate: (base, steps) => {
      const fib = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233];
      const baseIndex = 3;
      return fib.slice(0, steps).map((f, i) => ({
        name:
          i === 0
            ? "xs"
            : i === 1
              ? "sm"
              : i === 2
                ? "md"
                : i === 3
                  ? "base"
                  : i === 4
                    ? "lg"
                    : i === 5
                      ? "xl"
                      : `${i - 3}xl`,
        value: Math.round((base / fib[baseIndex]) * f),
        multiplier: f / fib[baseIndex],
      }));
    },
  },
  golden: {
    name: "Golden Ratio",
    description: "φ (1.618) multiplier",
    generate: (base, steps) => {
      const phi = 1.618;
      const values = [];
      for (let i = -3; i < steps - 3; i++) {
        values.push(Math.round(base * Math.pow(phi, i)));
      }
      return values.map((v, i) => ({
        name:
          i === 0
            ? "xs"
            : i === 1
              ? "sm"
              : i === 2
                ? "md"
                : i === 3
                  ? "base"
                  : i === 4
                    ? "lg"
                    : i === 5
                      ? "xl"
                      : `${i - 3}xl`,
        value: v,
        multiplier: v / base,
      }));
    },
  },
  majorSecond: {
    name: "Major Second",
    description: "Musical ratio 1.125",
    generate: (base, steps) => {
      const ratio = 1.125;
      const values = [];
      for (let i = -3; i < steps - 3; i++) {
        values.push(Math.round(base * Math.pow(ratio, i)));
      }
      return values.map((v, i) => ({
        name:
          i === 0
            ? "xs"
            : i === 1
              ? "sm"
              : i === 2
                ? "md"
                : i === 3
                  ? "base"
                  : i === 4
                    ? "lg"
                    : i === 5
                      ? "xl"
                      : `${i - 3}xl`,
        value: v,
        multiplier: v / base,
      }));
    },
  },
  perfectFourth: {
    name: "Perfect Fourth",
    description: "Musical ratio 1.333",
    generate: (base, steps) => {
      const ratio = 1.333;
      const values = [];
      for (let i = -3; i < steps - 3; i++) {
        values.push(Math.round(base * Math.pow(ratio, i)));
      }
      return values.map((v, i) => ({
        name:
          i === 0
            ? "xs"
            : i === 1
              ? "sm"
              : i === 2
                ? "md"
                : i === 3
                  ? "base"
                  : i === 4
                    ? "lg"
                    : i === 5
                      ? "xl"
                      : `${i - 3}xl`,
        value: v,
        multiplier: v / base,
      }));
    },
  },
  tailwind: {
    name: "Tailwind",
    description: "Default scale (4px)",
    generate: (base) => {
      const multipliers = [
        0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 14, 16,
      ];
      return multipliers.map((m, i) => ({
        name: String(i),
        value: Math.round(base * m * 0.25),
        multiplier: m * 0.25,
      }));
    },
  },
};

export default function FullSpacingSystem() {
  const [baseUnit, setBaseUnit] = useState(16);
  const [scaleType, setScaleType] = useState("linear");
  const [steps, setSteps] = useState(10);
  const [copiedToken, setCopiedToken] = useState(null);
  const [copiedMessage, setCopiedMessage] = useState("");

  const spacingScale = useMemo(() => {
    return SCALE_TYPES[scaleType].generate(baseUnit, steps);
  }, [baseUnit, scaleType, steps]);

  // Analyze scale consistency
  const analysis = useMemo(() => {
    if (spacingScale.length < 2) return null;

    const deltas = [];
    for (let i = 1; i < spacingScale.length; i++) {
      deltas.push(spacingScale[i].value - spacingScale[i - 1].value);
    }

    const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
    const variance =
      deltas.reduce((sum, val) => sum + Math.pow(val - avgDelta, 2), 0) /
      deltas.length;
    const consistency = Math.max(0, 1 - variance / (avgDelta * avgDelta));

    return {
      consistency,
      avgStep: avgDelta,
      minStep: Math.min(...deltas),
      maxStep: Math.max(...deltas),
    };
  }, [spacingScale]);

  const handleTokenClick = (token) => {
    navigator.clipboard.writeText(`${token.value}px`);
    setCopiedToken(token.name);
    setCopiedMessage(`Copied ${token.value}px`);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const exportAsCSS = () => {
    const css = spacingScale
      .map((token) => `  --space-${token.name}: ${token.value}px;`)
      .join("\n");

    const fullCSS = `:root {\n${css}\n}`;
    navigator.clipboard.writeText(fullCSS);
    setCopiedMessage("Copied spacing scale as CSS variables!");
    setCopiedToken("css");
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const exportAsTailwind = () => {
    const tailwind = spacingScale
      .map((token) => `        '${token.name}': '${token.value}px',`)
      .join("\n");

    const fullTailwind = `// Add to your tailwind.config.js\ntheme: {\n  extend: {\n    spacing: {\n${tailwind}\n    }\n  }\n}`;
    navigator.clipboard.writeText(fullTailwind);
    setCopiedMessage("Copied as Tailwind config!");
    setCopiedToken("tailwind");
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const exportAsJSON = () => {
    const json = spacingScale.map((token) => ({
      name: token.name,
      value: token.value,
      multiplier: token.multiplier,
    }));

    navigator.clipboard.writeText(JSON.stringify(json, null, 2));
    setCopiedMessage("Copied scale as JSON!");
    setCopiedToken("json");
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const exportAsFigma = () => {
    const figma = spacingScale
      .map(
        (token, i) =>
          `    "${token.name}": {\n      "$value": "${token.value}",\n      "$type": "spacing"\n    }${i < spacingScale.length - 1 ? "," : ""}`,
      )
      .join("\n");

    const fullFigma = `{\n  "spacing": {\n${figma}\n  }\n}`;
    navigator.clipboard.writeText(fullFigma);
    setCopiedMessage("Copied as Figma tokens!");
    setCopiedToken("figma");
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="hidden bg-background lg:flex flex-col pt-3 h-full">
      <div className="flex flex-col gap-3 flex-1 ml-2 mr-2 mb-2 bg-background overflow-hidden">
        {/* Header Controls */}
        <div className="p-4 border border-(--navBorder) rounded-md bg-foreground/[0.015]">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6 flex-wrap">
              {/* BASE UNIT */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                  Base Unit
                </span>
                <input
                  type="number"
                  min="4"
                  max="32"
                  value={baseUnit}
                  onChange={(e) =>
                    setBaseUnit(Math.max(4, parseInt(e.target.value) || 4))
                  }
                  className="w-16 px-2 py-1 text-[11px] font-mono font-bold text-(--brand) bg-foreground/5 border border-(--navBorder) rounded focus:outline-none focus:border-(--brand)"
                />
                <span className="text-[9px] font-mono text-foreground/30">
                  px
                </span>
              </div>

              {/* STEPS */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                  Steps
                </span>
                <input
                  type="range"
                  min="5"
                  max={scaleType === "tailwind" ? 18 : 12}
                  value={steps}
                  onChange={(e) => setSteps(parseInt(e.target.value))}
                  className="w-28 h-1.5 cursor-pointer accent-(--brand)"
                />
                <span className="text-[10px] font-mono font-bold text-(--brand)">
                  {steps}
                </span>
              </div>

              {/* SCALE TYPE */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                  Scale
                </span>
                <div className="flex bg-foreground/5 p-0.5 rounded-lg border border-(--navBorder)">
                  {Object.entries(SCALE_TYPES).map(([key, scale]) => (
                    <button
                      key={key}
                      onClick={() => setScaleType(key)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all uppercase ${
                        scaleType === key
                          ? "bg-background text-(--brand) shadow-sm"
                          : "text-foreground/50 hover:text-foreground"
                      }`}
                      title={scale.description}
                    >
                      {scale.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* CONSISTENCY SCORE */}
              {analysis && (
                <div className="flex items-center gap-3 pl-4 border-l border-(--navBorder)">
                  <span className="text-[8px] font-bold text-foreground/30 uppercase tracking-wider">
                    Consistency
                  </span>
                  <div className="px-3 py-1 bg-foreground/5 rounded-md border border-(--navBorder)">
                    <span className="text-[11px] font-mono font-bold text-(--brand)">
                      {(analysis.consistency * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* EXPORT BUTTONS */}
            <div className="flex items-center gap-2">
              <button
                onClick={exportAsCSS}
                className="px-3 py-1.5 text-[10px] font-bold border border-(--navBorder) rounded hover:bg-foreground/5 hover:border-(--brand) transition-colors"
              >
                Export CSS
              </button>
              <button
                onClick={exportAsTailwind}
                className="px-3 py-1.5 text-[10px] font-bold border border-(--navBorder) rounded hover:bg-foreground/5 hover:border-(--brand) transition-colors"
              >
                Tailwind
              </button>
              <button
                onClick={exportAsFigma}
                className="px-3 py-1.5 text-[10px] font-bold border border-(--navBorder) rounded hover:bg-foreground/5 hover:border-(--brand) transition-colors"
              >
                Figma
              </button>
              <button
                onClick={exportAsJSON}
                className="px-3 py-1.5 text-[10px] font-bold border border-(--navBorder) rounded hover:bg-foreground/5 hover:border-(--brand) transition-colors"
              >
                JSON
              </button>
            </div>
          </div>
        </div>

        {/* Main Work Surface */}
        <div className="flex-1 border border-(--navBorder) rounded-md overflow-hidden bg-gradient-to-br from-foreground/[0.01] to-foreground/[0.03] relative">
          <div className="h-full overflow-y-auto custom-scrollbar p-6">
            <div className="space-y-6">
              {/* Spacing Tokens Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {spacingScale.map((token, i) => {
                  const isBase = Math.abs(token.multiplier - 1) < 0.01;

                  return (
                    <div
                      key={i}
                      onClick={() => handleTokenClick(token)}
                      className="group p-4 bg-background border border-(--navBorder) rounded-lg flex flex-col gap-3 transition-all hover:border-(--brand) hover:shadow-lg cursor-pointer"
                    >
                      {/* Visual Representation */}
                      <div className="w-full h-20 rounded-md bg-foreground/5 border border-(--navBorder) flex items-center justify-center overflow-hidden">
                        <div
                          className={`bg-(--brand) rounded transition-all group-hover:scale-110 ${
                            isBase
                              ? "ring-2 ring-(--brand) ring-opacity-30"
                              : ""
                          }`}
                          style={{
                            width: `${Math.min((token.value / baseUnit) * 8, 100)}px`,
                            height: `${Math.min((token.value / baseUnit) * 8, 100)}px`,
                          }}
                        />
                      </div>

                      {/* Token Info */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-foreground/40 uppercase">
                            {token.name}
                          </span>
                          {isBase && (
                            <span className="text-[7px] font-bold text-(--brand) uppercase bg-(--brand)/10 px-1.5 py-0.5 rounded">
                              Base
                            </span>
                          )}
                        </div>
                        <span className="text-[13px] font-mono font-bold text-foreground/80">
                          {token.value}px
                        </span>
                      </div>

                      {/* Multiplier */}
                      <div className="flex gap-2 text-[8px] font-mono text-foreground/40 pt-2 border-t border-(--navBorder)">
                        <span>{token.multiplier.toFixed(2)}x</span>
                        <span className="text-foreground/20">•</span>
                        <span>{(token.value / 16).toFixed(2)}rem</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Live Preview Examples */}
              <div className="bg-foreground/[0.02] p-6 rounded-xl border border-(--navBorder)">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                    Live Preview
                  </span>
                  <span className="text-[8px] font-mono text-foreground/30">
                    Applied spacing
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Stack Example */}
                  <div
                    className="flex flex-col bg-background border border-(--navBorder) rounded-lg overflow-hidden"
                    style={{
                      gap: `${spacingScale[2]?.value || 12}px`,
                      padding: `${spacingScale[4]?.value || 16}px`,
                    }}
                  >
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="flex items-center bg-foreground/5 rounded border border-(--navBorder)"
                        style={{
                          padding: `${spacingScale[2]?.value || 12}px`,
                          gap: `${spacingScale[1]?.value || 8}px`,
                        }}
                      >
                        <div className="w-8 h-8 rounded bg-(--brand)/20" />
                        <div className="flex-1 space-y-1">
                          <div className="h-2 bg-foreground/20 rounded w-24" />
                          <div className="h-2 bg-foreground/10 rounded w-16" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Grid Example */}
                  <div
                    className="grid grid-cols-3 bg-background border border-(--navBorder) rounded-lg"
                    style={{
                      gap: `${spacingScale[3]?.value || 16}px`,
                      padding: `${spacingScale[4]?.value || 24}px`,
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <div
                        key={item}
                        className="aspect-square bg-foreground/5 rounded border border-(--navBorder) flex items-center justify-center"
                      >
                        <div className="w-6 h-6 rounded-full bg-(--brand)/20" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {copiedToken && (
            <div className="absolute bottom-6 right-6 bg-foreground text-background px-4 py-2 rounded-full shadow-2xl z-50 text-[10px] font-bold uppercase tracking-widest animate-in slide-in-from-bottom-2">
              {copiedMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

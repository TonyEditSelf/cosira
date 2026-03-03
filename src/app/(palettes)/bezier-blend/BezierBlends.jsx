import { useMemo, useState, useCallback, useEffect } from "react";
import chroma from "chroma-js";
import { useColorPaletteContext } from "../ColorContext";

// ─── Color math ───────────────────────────────────────────────────────────────
function oklchToLinear(l, c, h) {
  const r = (h * Math.PI) / 180;
  const a = c * Math.cos(r),
    b = c * Math.sin(r);
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;
  const lc = l_ ** 3,
    mc = m_ ** 3,
    sc = s_ ** 3;
  return [
    4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc,
    -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc,
    -0.0041960863 * lc - 0.7034186147 * mc + 1.707614701 * sc,
  ];
}
const toSRGB = (v) =>
  v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
const clamp = (v, mn = 0, mx = 1) => Math.max(mn, Math.min(mx, v));

function oklchToHex(l, c, h) {
  const [lr, lg, lb] = oklchToLinear(l, c, h);
  return `#${[lr, lg, lb]
    .map((v) =>
      Math.round(clamp(toSRGB(v)) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}
function oklchInGamut(l, c, h) {
  const [lr, lg, lb] = oklchToLinear(l, c, h);
  return [lr, lg, lb].map(toSRGB).every((v) => v >= -0.001 && v <= 1.001);
}
function hexToOklch(hex) {
  const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const [rv, gv, bv] = [1, 3, 5].map((i) =>
    lin(parseInt(hex.slice(i, i + 2), 16) / 255),
  );
  const l_ = Math.cbrt(
    0.4122214708 * rv + 0.5363325363 * gv + 0.0514459929 * bv,
  );
  const m_ = Math.cbrt(
    0.2119034982 * rv + 0.6806995451 * gv + 0.1073969566 * bv,
  );
  const s_ = Math.cbrt(
    0.0883024619 * rv + 0.2817188376 * gv + 0.6299787005 * bv,
  );
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const b = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  return [
    L,
    Math.sqrt(a * a + b * b),
    ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360,
  ];
}
function relLum(hex) {
  const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return [1, 3, 5].reduce(
    (sum, i, j) =>
      sum +
      [0.2126, 0.7152, 0.0722][j] *
        lin(parseInt(hex.slice(i, i + 2), 16) / 255),
    0,
  );
}
function contrast(a, b) {
  const [l1, l2] = [relLum(a), relLum(b)];
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
function bezierOklch(colors, t) {
  if (colors.length === 1) return colors[0];
  const lerped = [];
  for (let i = 0; i < colors.length - 1; i++) {
    const [l1, c1, h1] = colors[i],
      [l2, c2, h2] = colors[i + 1];
    let dh = h2 - h1;
    if (dh > 180) dh -= 360;
    if (dh < -180) dh += 360;
    lerped.push([l1 + (l2 - l1) * t, c1 + (c2 - c1) * t, h1 + dh * t]);
  }
  return bezierOklch(lerped, t);
}
function cv(vals) {
  if (vals.length < 2) return 0;
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  if (!mean) return 0;
  return (
    Math.sqrt(vals.reduce((s, v) => s + (v - mean) ** 2, 0) / vals.length) /
    mean
  );
}
function getScaleKeys(count) {
  const p = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  if (count <= p.length) return p.slice(0, count);
  return Array.from(
    { length: count },
    (_, i) => (i + 1) * Math.round(1000 / (count + 1)),
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const EASINGS = {
  linear: (t) => t,
  "ease-in": (t) => t * t * t,
  "ease-out": (t) => 1 - (1 - t) ** 3,
  "ease-in-out": (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2),
};

// ─── Breakpoint hook ──────────────────────────────────────────────────────────
function useBreakpoint() {
  const [w, setW] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return {
    isMobile: w < 480,
    isTablet: w >= 480 && w < 1024,
    isDesktop: w >= 1024,
  };
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function SidebarContent({
  palette,
  selectedIds,
  onToggleSelect,
  steps,
  setSteps,
  easing,
  setEasing,
  scaleName,
  setScaleName,
  exportFormat,
  setExportFormat,
  exportText,
  analysis,
  showToast,
  onClose,
  showDrawer,
  handleAdd,
  handleMove,
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [newHex, setNewHex] = useState("#3b82f6");
  const [newLabel, setNewLabel] = useState("");

  const submitAdd = () => {
    handleAdd(newHex, newLabel);
    setShowAdd(false);
    setNewLabel("");
    setNewHex("#3b82f6");
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-background custom-scrollbar">

      {/* Drawer close header — mobile/tablet only */}
      {showDrawer && (
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-(--navBorder) flex-shrink-0">
          <span className="text-[10px] font-bold tracking-widest text-(--brand) uppercase">
            Settings
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center border border-(--navBorder) rounded text-foreground/40 text-base bg-transparent cursor-pointer hover:border-(--brand) hover:text-foreground transition-colors"
          >
            ×
          </button>
        </div>
      )}

      {/* ── Source Colors ── */}
      <Sec label="Source Colors">
        <p className="text-[8px] text-foreground/25 leading-relaxed mb-2.5">
          Click a color to toggle it as a bezier control point. If none selected, all are used.
        </p>
        <div className="flex flex-col gap-1.5">
          {palette.map((color, idx) => {
            const isSelected = selectedIds.has(color.id);
            return (
              <div
                key={color.id}
                onClick={() => onToggleSelect(color.id)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md border cursor-pointer transition-all ${
                  isSelected
                    ? "border-(--brand) bg-foreground/[0.03]"
                    : "border-(--navBorder) bg-background hover:border-foreground/30"
                }`}
              >
                {/* Color swatch */}
                <div
                  className="rounded-sm flex-shrink-0 border border-black/10"
                  style={{
                    backgroundColor: color.hex,
                    width: 32,
                    height: 32,
                    minWidth: 32,
                    minHeight: 32,
                  }}
                />
                {/* Label + hex */}
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-foreground/60 truncate">
                    {color.label}
                  </div>
                  <div className="text-[9px] font-mono text-foreground/30 truncate">
                    {color.hex.toUpperCase()}
                  </div>
                </div>
                {/* Selected indicator dot */}
                {isSelected && (
                  <div className="w-1.5 h-1.5 rounded-full bg-(--brand) flex-shrink-0" />
                )}
                {/* Move up/down — stopPropagation so it doesn't toggle selection */}
                <div
                  className="flex flex-col gap-0.5 flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <IcoBtn onClick={() => handleMove(idx, -1)} disabled={idx === 0}>↑</IcoBtn>
                  <IcoBtn onClick={() => handleMove(idx, 1)} disabled={idx === palette.length - 1}>↓</IcoBtn>
                </div>
              </div>
            );
          })}

          {/* Add color */}
          {showAdd ? (
            <div className="flex flex-col gap-1.5 p-2 border border-(--navBorder) rounded-md bg-background">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newHex}
                  onChange={(e) => setNewHex(e.target.value)}
                  className="w-8 h-7 border border-(--navBorder) rounded cursor-pointer bg-transparent flex-shrink-0"
                />
                <input
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Label…"
                  className="flex-1 text-[10px] bg-background border border-(--navBorder) rounded px-2 py-1 text-foreground outline-none focus:border-(--brand) placeholder:text-foreground/20 min-w-0"
                />
              </div>
              <div className="flex gap-1.5">
                <PillBtn onClick={submitAdd} accent>Add</PillBtn>
                <PillBtn onClick={() => setShowAdd(false)}>Cancel</PillBtn>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAdd(true)}
              className="text-[10px] font-bold tracking-widest text-(--brand) uppercase bg-transparent border border-dashed border-(--navBorder) rounded-md py-1.5 cursor-pointer hover:border-(--brand) transition-colors w-full"
            >
              + Add Color
            </button>
          )}
        </div>
      </Sec>

      {/* ── Scale Settings ── */}
      <Sec label="Scale Settings">
        <div className="flex flex-col gap-3.5">
          <Fld label="Scale Name">
            <input
              value={scaleName}
              onChange={(e) => setScaleName(e.target.value)}
              className="w-full text-[11px] font-mono bg-background border border-(--navBorder) rounded px-2 py-1.5 text-foreground outline-none focus:border-(--brand)"
            />
          </Fld>
          <Fld label={`Steps: ${steps}`}>
            <input
              type="range"
              min={5}
              max={24}
              value={steps}
              onChange={(e) => setSteps(+e.target.value)}
              className="w-full cursor-pointer accent-(--brand)"
            />
          </Fld>
          <Fld label="Easing">
            <div className="flex flex-col gap-1">
              {Object.keys(EASINGS).map((e) => (
                <button
                  key={e}
                  onClick={() => setEasing(e)}
                  className={`text-left px-2 py-1 text-[10px] font-bold tracking-widest uppercase rounded border transition-colors cursor-pointer ${
                    easing === e
                      ? "border-(--brand) bg-foreground/[0.03] text-(--brand)"
                      : "border-(--navBorder) bg-transparent text-foreground/40 hover:text-foreground/70 hover:border-foreground/30"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </Fld>
        </div>
      </Sec>

      {/* ── Analysis ── */}
      {analysis && (
        <Sec label="Analysis">
          <div className="flex flex-col gap-2.5">
            <MRow
              label="Lightness CV"
              value={`${(analysis.lU * 100).toFixed(0)}%`}
              cls={analysis.lU > 0.8 ? "text-emerald-500" : analysis.lU > 0.5 ? "text-yellow-500" : "text-red-500"}
            />
            <MRow
              label="Chroma CV"
              value={`${(analysis.cU * 100).toFixed(0)}%`}
              cls={analysis.cU > 0.8 ? "text-emerald-500" : analysis.cU > 0.5 ? "text-yellow-500" : "text-red-500"}
            />
            <MRow
              label="Gamut Clips"
              value={analysis.clips}
              cls={analysis.clips > 0 ? "text-red-500" : "text-emerald-500"}
            />
          </div>
        </Sec>
      )}

      {/* ── Export ── */}
      <Sec label="Export">
        <div className="flex flex-col gap-2">
          <div className="flex gap-1 flex-wrap">
            {["css", "tailwind", "json", "scss"].map((f) => (
              <button
                key={f}
                onClick={() => setExportFormat(f)}
                className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest border rounded transition-colors cursor-pointer ${
                  exportFormat === f
                    ? "border-(--brand) bg-foreground/[0.03] text-(--brand)"
                    : "border-(--navBorder) bg-transparent text-foreground/40 hover:text-foreground/70"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <pre className="text-[9px] bg-foreground/[0.02] border border-(--navBorder) rounded p-2 overflow-x-auto text-foreground/40 max-h-24 whitespace-pre m-0 custom-scrollbar">
            {exportText.slice(0, 260)}
            {exportText.length > 260 ? "\n…" : ""}
          </pre>
          <PillBtn
            onClick={() => {
              navigator.clipboard.writeText(exportText);
              showToast(`Copied as ${exportFormat.toUpperCase()}!`);
            }}
            accent
          >
            Copy {exportFormat.toUpperCase()}
          </PillBtn>
        </div>
      </Sec>

      <div className="flex-shrink-0 h-4" />
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function BezierBlends() {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const showDrawer = !isDesktop;

  const { palette: ctxPalette, setPalette: ctxSetPalette } =
    useColorPaletteContext();

  // Local order (indices into ctxPalette) — reorder does NOT mutate context
  const [localOrder, setLocalOrder] = useState(null);

  // Which color ids are selected as bezier control points
  const [selectedIds, setSelectedIds] = useState(new Set());

  const paletteColors = useMemo(
    () =>
      ctxPalette.map((c, i) => ({
        id: i,
        label: c.name ?? `Color ${i + 1}`,
        hex: chroma.oklch(c.value.l, c.value.c, c.value.h).hex(),
      })),
    [ctxPalette],
  );

  // Init localOrder on mount
  useEffect(() => {
    setLocalOrder(paletteColors.map((_, i) => i));
  }, []);

  // Append new color index when palette grows
  useEffect(() => {
    if (!localOrder) return;
    if (paletteColors.length > localOrder.length) {
      setLocalOrder((prev) => [...(prev ?? []), paletteColors.length - 1]);
    }
  }, [paletteColors.length]);

  const orderedPalette = useMemo(() => {
    if (!localOrder) return paletteColors;
    return localOrder
      .filter((i) => i < paletteColors.length)
      .map((i) => paletteColors[i]);
  }, [localOrder, paletteColors]);

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleMove = useCallback((idx, dir) => {
    setLocalOrder((prev) => {
      if (!prev) return prev;
      const arr = [...prev];
      const next = idx + dir;
      if (next < 0 || next >= arr.length) return arr;
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr;
    });
  }, []);

  const handleAdd = useCallback(
    (hex, label) => {
      const [l, c, h] = hexToOklch(hex);
      ctxSetPalette([
        ...ctxPalette,
        { name: label || hex, value: { l, c, h, a: 1 } },
      ]);
    },
    [ctxPalette, ctxSetPalette],
  );

  const [steps, setSteps] = useState(11);
  const [easing, setEasing] = useState("linear");
  const [scaleName, setScaleName] = useState("brand");
  const [exportFormat, setExportFormat] = useState("css");
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("scale");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }, []);

  useEffect(() => {
    if (isDesktop) setDrawerOpen(false);
  }, [isDesktop]);

  // Active colors: selected subset if ≥2, else all
  const activeColors = useMemo(() => {
    const sel = orderedPalette.filter((c) => selectedIds.has(c.id));
    return sel.length >= 2 ? sel : orderedPalette;
  }, [orderedPalette, selectedIds]);

  const palOklch = useMemo(
    () => activeColors.map((c) => hexToOklch(c.hex)),
    [activeColors],
  );

  const scale = useMemo(() => {
    if (palOklch.length < 2) return [];
    const fn = EASINGS[easing];
    return Array.from({ length: steps }, (_, i) => {
      const t = fn(i / (steps - 1));
      const [l, c, h] = bezierOklch(palOklch, t);
      const hex = oklchToHex(l, c, h);
      return {
        l, c, h, hex,
        inGamut: oklchInGamut(l, c, h),
        cW: contrast(hex, "#ffffff"),
        cB: contrast(hex, "#000000"),
        t,
      };
    });
  }, [palOklch, steps, easing]);

  const linearScale = useMemo(() => {
    if (activeColors.length < 2) return [];
    const f = activeColors[0].hex;
    const la = activeColors[activeColors.length - 1].hex;
    const [r1, g1, b1] = [1, 3, 5].map((i) => parseInt(f.slice(i, i + 2), 16));
    const [r2, g2, b2] = [1, 3, 5].map((i) => parseInt(la.slice(i, i + 2), 16));
    return Array.from({ length: steps }, (_, i) => {
      const t = i / (steps - 1);
      return `#${[r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t]
        .map((v) => Math.round(v).toString(16).padStart(2, "0"))
        .join("")}`;
    });
  }, [activeColors, steps]);

  const analysis = useMemo(() => {
    if (scale.length < 2) return null;
    const lD = [], cD = [];
    for (let i = 1; i < scale.length; i++) {
      lD.push(Math.abs(scale[i].l - scale[i - 1].l));
      cD.push(Math.abs(scale[i].c - scale[i - 1].c));
    }
    return {
      lU: Math.max(0, Math.min(1, 1 - cv(lD))),
      cU: Math.max(0, Math.min(1, 1 - cv(cD))),
      clips: scale.filter((s) => !s.inGamut).length,
      cMax: Math.max(...scale.map((s) => s.c)),
    };
  }, [scale]);

  const exportText = useMemo(() => {
    const keys = getScaleKeys(steps);
    if (exportFormat === "css")
      return `:root {\n${scale.map((s, i) => `  --${scaleName}-${keys[i]}: ${s.hex};`).join("\n")}\n}`;
    if (exportFormat === "tailwind")
      return `colors: {\n  ${scaleName}: {\n${scale.map((s, i) => `    ${keys[i]}: '${s.hex}',`).join("\n")}\n  }\n}`;
    if (exportFormat === "json")
      return JSON.stringify(
        scale.map((s, i) => ({
          step: keys[i],
          hex: s.hex,
          oklch: { l: +s.l.toFixed(4), c: +s.c.toFixed(4), h: +s.h.toFixed(2) },
          inGamut: s.inGamut,
        })),
        null, 2,
      );
    return scale.map((s, i) => `$${scaleName}-${keys[i]}: ${s.hex};`).join("\n");
  }, [scale, scaleName, exportFormat, steps]);

  const sp = {
    palette: orderedPalette,
    selectedIds,
    onToggleSelect: toggleSelect,
    steps, setSteps,
    easing, setEasing,
    scaleName, setScaleName,
    exportFormat, setExportFormat,
    exportText,
    analysis,
    showToast,
    onClose: () => setDrawerOpen(false),
    showDrawer,
    handleAdd,
    handleMove,
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">

      {/* ── Header ── */}
      <header className="flex items-center justify-between gap-2 mx-2 mt-2 mb-2 border border-(--navBorder) rounded-md bg-foreground/[0.015] flex-shrink-0 px-3 sm:px-6 py-3">
        <div className="flex items-baseline gap-2.5 min-w-0">
          <span className="text-[13px] font-bold tracking-widest text-(--brand) flex-shrink-0 uppercase">
            Bezier
          </span>
          <span className="hidden sm:block text-[10px] text-foreground/30 tracking-widest truncate uppercase">
            OKLCH Color Scale Generator
          </span>
        </div>

        {/* Active colors pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 border border-(--navBorder) rounded-full">
          <span className="text-[9px] text-foreground/30 uppercase tracking-widest">Active:</span>
          <span className="text-[9px] font-bold text-(--brand)">
            {selectedIds.size >= 2
              ? `${selectedIds.size} selected`
              : `All ${orderedPalette.length}`}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Tabs */}
          <div className="flex gap-1 sm:gap-1.5">
            {["scale", "preview", "compare"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2 sm:px-3.5 py-1 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase border rounded transition-colors cursor-pointer ${
                  activeTab === tab
                    ? "border-(--brand) bg-foreground/[0.03] text-(--brand)"
                    : "border-(--navBorder) bg-transparent text-foreground/40 hover:text-foreground/70"
                }`}
              >
                {isMobile ? tab.slice(0, 3).toUpperCase() : tab}
              </button>
            ))}
          </div>

          {/* Hamburger — mobile/tablet only */}
          {showDrawer && (
            <button
              onClick={() => setDrawerOpen((o) => !o)}
              className={`w-8 h-8 flex flex-col items-center justify-center gap-1 rounded border bg-transparent cursor-pointer transition-colors ${
                drawerOpen ? "border-(--brand)" : "border-(--navBorder)"
              }`}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="block rounded-sm transition-all duration-200"
                  style={{
                    width: 14,
                    height: 1.5,
                    background: drawerOpen ? "var(--brand)" : "currentColor",
                    opacity: drawerOpen ? (i === 1 ? 0 : 1) : 0.4,
                    transform: drawerOpen
                      ? i === 0
                        ? "rotate(45deg) translate(3.5px,3.5px)"
                        : i === 2
                          ? "rotate(-45deg) translate(3.5px,-3.5px)"
                          : "none"
                      : "none",
                  }}
                />
              ))}
            </button>
          )}
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 gap-2 mx-2 mb-2 min-h-0 relative">

        {/* Sidebar — desktop only, scrolls independently */}
        {isDesktop && (
          <aside
            className="flex-shrink-0 flex flex-col rounded-lg border border-(--navBorder) overflow-hidden"
            style={{ width: 248 }}
          >
            <SidebarContent {...sp} />
          </aside>
        )}

        {/* Drawer overlay — mobile/tablet */}
        {showDrawer && (
          <>
            <div
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 z-40 transition-opacity duration-300"
              style={{
                background: "rgba(0,0,0,0.4)",
                opacity: drawerOpen ? 1 : 0,
                pointerEvents: drawerOpen ? "auto" : "none",
              }}
            />
            <div
              className="absolute top-0 left-0 bottom-0 z-50 flex flex-col rounded-r-lg border-r border-(--navBorder) bg-background transition-transform duration-300"
              style={{
                width: isTablet ? 300 : "82%",
                maxWidth: 340,
                transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
                boxShadow: drawerOpen ? "12px 0 40px rgba(0,0,0,0.15)" : "none",
              }}
            >
              <SidebarContent {...sp} />
            </div>
          </>
        )}

        {/* Main content — scrolls independently */}
        <main className="flex-1 min-w-0 overflow-y-auto rounded-lg border border-(--navBorder) bg-background custom-scrollbar">
          <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6 p-3.5 sm:p-[18px] lg:p-6 pb-8">
            {activeTab === "scale" && (
              <ScaleTab
                scale={scale}
                analysis={analysis}
                steps={steps}
                scaleName={scaleName}
                isMobile={isMobile}
                isTablet={isTablet}
                showToast={showToast}
              />
            )}
            {activeTab === "preview" && (
              <UIPreview scale={scale} steps={steps} isMobile={isMobile} />
            )}
            {activeTab === "compare" && (
              <Compare
                scale={scale}
                linearScale={linearScale}
                isMobile={isMobile}
              />
            )}
          </div>
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[1000] px-4 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase text-background bg-foreground shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
}

// ─── Scale Tab ────────────────────────────────────────────────────────────────
function ScaleTab({ scale, analysis, steps, scaleName, isMobile, isTablet, showToast }) {
  const keys = getScaleKeys(steps);
  return (
    <>
      {analysis && (
        <div className={`grid gap-2.5 ${isMobile ? "grid-cols-2" : "grid-cols-3"}`}>
          <ChartBar label="Lightness" sub="L in OKLab" color="var(--brand)"
            data={scale.map((s) => s.l)} max={1} unit="%" mul={100} dec={1} />
          <ChartBar label="Chroma" sub="Saturation" color="#f59e0b"
            data={scale.map((s) => s.c)} max={analysis.cMax * 1.1 || 0.4} unit="" mul={1} dec={3} />
          {!isMobile && (
            <ChartBar label="Hue" sub="Hue travel °" color="#10b981"
              data={scale.map((s) => s.h)} max={360} unit="°" mul={1} dec={0} norm />
          )}
        </div>
      )}

      <div className="flex h-10 sm:h-12 rounded-lg overflow-hidden border border-(--navBorder) flex-shrink-0">
        {scale.map((s, i) => (
          <div key={i} className="flex-1" style={{ background: s.hex }} title={s.hex} />
        ))}
      </div>

      <div
        className="grid gap-2 sm:gap-2.5"
        style={{
          gridTemplateColumns: `repeat(auto-fill,minmax(${isMobile ? 118 : 138}px,1fr))`,
        }}
      >
        {scale.map((s, i) => {
          const passes = s.cW >= 4.5 || s.cB >= 4.5;
          return (
            <div
              key={i}
              onClick={() => {
                navigator.clipboard.writeText(s.hex);
                showToast(`Copied ${s.hex.toUpperCase()}`);
              }}
              className="rounded-lg overflow-hidden cursor-pointer transition-transform duration-100 hover:-translate-y-0.5 border border-(--navBorder) hover:border-(--brand)"
            >
              <div
                className="flex items-start justify-between p-1.5"
                style={{ background: s.hex, height: isMobile ? 44 : 60 }}
              >
                {!s.inGamut && (
                  <span className="text-[8px] font-bold bg-red-500 text-white rounded px-1 py-0.5 tracking-widest">
                    CLIP
                  </span>
                )}
                {passes && (
                  <span className="text-[8px] font-bold bg-emerald-500 text-white rounded px-1 py-0.5 tracking-widest ml-auto">
                    AA
                  </span>
                )}
              </div>
              <div className="bg-background px-2.5 py-2 flex flex-col gap-1">
                <span className="text-[9px] text-foreground/30 font-bold tracking-widest">
                  {scaleName}-{keys[i]}
                </span>
                <span className="text-[10px] font-bold text-foreground/80">
                  {s.hex.toUpperCase()}
                </span>
                <div className="text-[8px] text-foreground/30 flex gap-1.5">
                  <span>L:{(s.l * 100).toFixed(0)}</span>
                  <span>C:{s.c.toFixed(2)}</span>
                  <span>H:{s.h.toFixed(0)}°</span>
                </div>
                <div className="text-[8px] flex gap-1.5">
                  <span className={s.cW >= 4.5 ? "text-emerald-500" : "text-foreground/20"}>
                    W:{s.cW.toFixed(1)}
                  </span>
                  <span className={s.cB >= 4.5 ? "text-emerald-500" : "text-foreground/20"}>
                    B:{s.cB.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ─── UI Preview — unchanged logic ─────────────────────────────────────────────
function UIPreview({ scale, steps, isMobile }) {
  if (scale.length < 2) return null;
  const light = scale[Math.floor(scale.length * 0.1)];
  const accent = scale[Math.floor(scale.length * 0.5)];
  const dark = scale[Math.floor(scale.length * 0.85)];
  const btn = scale[Math.floor(scale.length * 0.7)];
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[10px] text-foreground/30 tracking-widest uppercase">
        UI Context Preview — how your scale behaves in real interfaces
      </p>
      <div className={`grid gap-3.5 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
        <div className="bg-white rounded-xl p-4 border border-black/10">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">Light Surface</p>
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 flex-wrap">
              {scale
                .filter((_, i) => i % Math.max(1, Math.floor(steps / 5)) === 0)
                .map((s, i) => (
                  <button key={i} className="px-3 py-1.5 rounded-md text-[10px] font-bold border-none cursor-default"
                    style={{ background: s.hex, color: s.cW >= s.cB ? "#fff" : "#000" }}>
                    Btn
                  </button>
                ))}
            </div>
            <div className="rounded-lg p-3" style={{ background: light.hex }}>
              <p className="text-[11px] font-bold mb-1" style={{ color: dark.hex }}>Card Title</p>
              <p className="text-[10px]" style={{ color: accent.hex }}>Supporting text in accent shade</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ background: accent.hex }} />
              <div>
                <p className="text-[11px] font-bold" style={{ color: dark.hex }}>User Name</p>
                <p className="text-[9px] text-gray-400">@handle</p>
              </div>
              <div className="ml-auto px-2.5 py-1 rounded-full text-[9px] font-bold text-white"
                style={{ background: btn.hex }}>
                Follow
              </div>
            </div>
          </div>
        </div>
        <div className="bg-foreground/[0.03] rounded-xl p-4 border border-(--navBorder)">
          <p className="text-[10px] text-foreground/30 uppercase tracking-widest mb-3">Dark Surface</p>
          <div className="flex flex-col gap-3">
            <div className="rounded-lg p-3"
              style={{ background: `${accent.hex}18`, border: `1px solid ${accent.hex}40` }}>
              <p className="text-[11px] font-bold mb-1" style={{ color: light.hex }}>Notification</p>
              <p className="text-[10px] text-foreground/40">Palette generated successfully</p>
            </div>
            <div className="flex gap-1">
              {scale.slice(0, Math.min(6, scale.length)).map((s, i) => (
                <div key={i} className="flex-1 h-5 rounded" style={{ background: s.hex }} />
              ))}
            </div>
            <div className="flex gap-2">
              <div className="flex-1 rounded-md py-1.5 text-center text-[10px] font-bold"
                style={{ background: accent.hex, color: accent.cW >= accent.cB ? "#fff" : "#000" }}>
                Primary
              </div>
              <div className="flex-1 rounded-md py-1.5 text-center text-[10px] font-bold"
                style={{ border: `1px solid ${accent.hex}`, color: accent.hex }}>
                Ghost
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-xl overflow-hidden border border-(--navBorder)">
        <div className={`flex ${isMobile ? "h-12" : "h-16"}`}>
          {scale.map((s, i) => (
            <div key={i} className="flex-1 flex items-center justify-center" style={{ background: s.hex }}>
              <span className="text-[7px] font-bold opacity-70"
                style={{ writingMode: "vertical-rl", color: s.cW >= s.cB ? "#fff" : "#000" }}>
                {(s.l * 100).toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Compare — unchanged logic ─────────────────────────────────────────────────
function Compare({ scale, linearScale, isMobile }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[10px] text-foreground/30 tracking-widest uppercase">
        OKLCH Bezier vs Linear RGB — spot the muddy midpoints
      </p>
      {[
        { label: "Bezier OKLCH (your scale)", accent: true, data: scale.map((s) => s.hex) },
        { label: "Linear RGB (naïve)", accent: false, data: linearScale },
      ].map(({ label, accent, data }) => (
        <div key={label}>
          <p className={`text-[10px] font-bold tracking-widest uppercase mb-1.5 ${accent ? "text-(--brand)" : "text-foreground/30"}`}>
            {label}
          </p>
          <div className={`flex ${isMobile ? "h-9" : "h-14"} rounded-lg overflow-hidden border border-(--navBorder)`}>
            {data.map((hex, i) => (
              <div key={i} className="flex-1" style={{ background: hex }} />
            ))}
          </div>
        </div>
      ))}
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(auto-fill,minmax(${isMobile ? 70 : 88}px,1fr))` }}
      >
        {scale.map((s, i) => {
          const lin = linearScale[i] || s.hex;
          return (
            <div key={i} className="rounded-md overflow-hidden border border-(--navBorder)">
              <div className="h-7" style={{ background: s.hex }} title={`OKLCH: ${s.hex}`} />
              <div className="h-7" style={{ background: lin }} title={`Linear: ${lin}`} />
              <div className="bg-background py-0.5 text-center text-[8px] text-foreground/30">{i + 1}</div>
            </div>
          );
        })}
      </div>
      <div className="bg-foreground/[0.02] border border-(--navBorder) rounded-lg p-3.5 text-[10px] text-foreground/40 leading-relaxed">
        <span className="text-(--brand) font-bold">Why this matters: </span>
        Linear RGB travels through perceptually dark or muddy midpoints because RGB channels don't map
        linearly to human perception. OKLCH stays in perceptual space — each step looks like an equal
        visual jump, which is exactly what design systems need.
      </div>
    </div>
  );
}

// ─── Shared atoms ─────────────────────────────────────────────────────────────
function Sec({ label, children }) {
  return (
    <div className="px-4 py-3.5 border-b border-(--navBorder) flex-shrink-0">
      <p className="text-[9px] font-bold tracking-widest text-foreground/25 uppercase mb-2.5">
        {label}
      </p>
      {children}
    </div>
  );
}
function Fld({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[9px] text-foreground/30 tracking-widest uppercase">{label}</p>
      {children}
    </div>
  );
}
function MRow({ label, value, cls }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[9px] text-foreground/30 tracking-widest uppercase">{label}</span>
      <span className={`text-[11px] font-bold ${cls}`}>{value}</span>
    </div>
  );
}
function IcoBtn({ onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center border border-(--navBorder) rounded bg-transparent p-0 leading-none transition-colors ${
        disabled
          ? "text-foreground/15 cursor-default"
          : "text-foreground/40 cursor-pointer hover:text-foreground hover:border-foreground/40"
      }`}
      style={{ width: 18, height: 18, fontSize: 11 }}
    >
      {children}
    </button>
  );
}
function PillBtn({ onClick, children, accent }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-1.5 px-2.5 text-[10px] font-bold tracking-widest uppercase border rounded transition-colors cursor-pointer ${
        accent
          ? "border-(--brand) bg-foreground/[0.03] text-(--brand) hover:bg-foreground/[0.06]"
          : "border-(--navBorder) bg-transparent text-foreground/40 hover:text-foreground/70"
      }`}
    >
      {children}
    </button>
  );
}
function ChartBar({ label, sub, color, data, max, unit, mul = 1, dec = 1, norm }) {
  const vals = norm
    ? data.map((v) => (v % 360) / 360)
    : data.map((v) => Math.min((v * mul) / (max * mul), 1));
  return (
    <div className="bg-background border border-(--navBorder) rounded-lg p-3">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color }}>
          {label}
        </span>
        <span className="text-[8px] text-foreground/25">{sub}</span>
      </div>
      <div className="h-14 flex items-end gap-0.5">
        {vals.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm opacity-50 hover:opacity-100 transition-opacity"
            style={{ background: color, height: `${Math.max(v * 100, 2)}%` }}
            title={`${(data[i] * mul).toFixed(dec)}${unit}`}
          />
        ))}
      </div>
    </div>
  );
}
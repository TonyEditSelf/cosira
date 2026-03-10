// ─── TOOLBAR: Single row with Palette | Mode | Ceiling/Floor | Roles bundle | Reset | Export | Preview ───
// ─── ROLES PANEL: 2-column grid when preview hidden, left panel when preview shown ───

import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { generateExpandedPalette, getContrastRatio } from "./colorexpansion";
import { useColorPaletteContext } from "../ColorContext";
import Preview from "./Preview";

const ROLE_BUNDLES = {
  comprehensive: {
    name: "Full",
    categories: {
      Backgrounds: ["background", "background-subtle", "background-muted"],
      Surfaces: ["surface", "surface-raised", "surface-overlay"],
      Borders: ["border", "border-strong", "border-active", "border-focus"],
      Text: ["text-subtle", "text", "text-strong", "text-inverse"],
      Interactive: [
        "interactive-default",
        "interactive-hover",
        "interactive-active",
        "interactive-disabled",
      ],
      Status: [
        "success",
        "success-subtle",
        "warning",
        "warning-subtle",
        "error",
        "error-subtle",
        "info",
        "info-subtle",
      ],
      Fills: ["fill-subtle", "fill", "fill-strong"],
      Accents: ["accent", "accent-subtle", "accent-strong"],
      Icons: ["icon", "icon-subtle", "icon-strong"],
      Decorative: ["decorative-light", "decorative", "decorative-dark"],
      Neutrals: [
        "neutral-subtle",
        "neutral-muted",
        "neutral-default",
        "neutral-strong",
        "neutral-surface",
      ],
    },
  },
};

const roleTokenMap = {
  Backgrounds: {
    background: 50,
    "background-subtle": 100,
    "background-muted": 200,
  },
  Surfaces: { surface: 100, "surface-raised": 50, "surface-overlay": 50 },
  Borders: {
    border: 500,
    "border-strong": 600,
    "border-active": 700,
    "border-focus": 800,
  },
  Text: {
    "text-subtle": 700,
    text: 800,
    "text-strong": 900,
    "text-inverse": 50,
  },
  Interactive: {
    "interactive-default": 700,
    "interactive-hover": 800,
    "interactive-active": 800,
    "interactive-disabled": 300,
  },
  Status: {
    success: 800,
    "success-subtle": 100,
    warning: 700,
    "warning-subtle": 100,
    error: 800,
    "error-subtle": 100,
    info: 700,
    "info-subtle": 100,
  },
  Fills: { "fill-subtle": 200, fill: 600, "fill-strong": 700 },
  Accents: { accent: 500, "accent-subtle": 200, "accent-strong": 800 },
  Icons: { icon: 700, "icon-subtle": 500, "icon-strong": 900 },
  Decorative: {
    "decorative-light": 300,
    decorative: 600,
    "decorative-dark": 800,
  },
  Neutrals: {
    "neutral-subtle": 50,
    "neutral-muted": 200,
    "neutral-default": 600,
    "neutral-strong": 800,
    "neutral-surface": 100,
  },
};

const statusHueMap = { success: 145, warning: 85, error: 25, info: 250 };

// Maps each foreground role → the background role(s) it sits on.
// Used by contrast enforcement to know which pairs to check.
const CONTRAST_RELATIONSHIPS = {
  text: ["background", "surface"],
  "text-subtle": ["background", "surface"],
  "text-strong": ["background", "surface"],
  "text-inverse": ["interactive-default"],
  border: ["background", "surface"],
  "border-strong": ["background", "surface"],
  "border-active": ["background", "surface"],
  "border-focus": ["background", "surface"],
  "interactive-default": ["background"],
  "interactive-hover": ["background"],
  "interactive-active": ["background"],
  icon: ["background", "surface"],
  "icon-subtle": ["background", "surface"],
  "icon-strong": ["background", "surface"],
  success: ["success-subtle", "background"],
  warning: ["warning-subtle", "background"],
  error: ["error-subtle", "background"],
  info: ["info-subtle", "background"],
  accent: ["background", "surface"],
  "accent-strong": ["background", "surface"],
  fill: ["background"],
  "fill-strong": ["background"],
  "neutral-default": ["neutral-surface", "background"],
  "neutral-strong": ["neutral-surface", "background"],
};

// WCAG minimum ratios per mode
const WCAG_RATIOS = { free: 0, AA: 4.5, AAA: 7.0 };

/**
 * Find the nearest token step (fewest steps from currentToken, either
 * direction) that achieves >= minRatio contrast against bgColor.
 * Returns the new token number, or null if current already passes
 * or no step in the scale can pass.
 */
function findCompliantToken(
  fgRole,
  currentToken,
  scale,
  bgColor,
  minRatio,
  resolveColor,
) {
  const steps = Object.keys(scale)
    .map(Number)
    .sort((a, b) => a - b);
  const currentIdx = steps.indexOf(Number(currentToken));

  // Already passes — no change needed
  const currentColor = resolveColor(fgRole, scale[currentToken]);
  if (getContrastRatio(currentColor, bgColor) >= minRatio) return null;

  // Expand outward from current index, checking both directions each round
  let lo = currentIdx - 1;
  let hi = currentIdx + 1;
  while (lo >= 0 || hi < steps.length) {
    if (hi < steps.length) {
      const c = resolveColor(fgRole, scale[steps[hi]]);
      if (getContrastRatio(c, bgColor) >= minRatio) return steps[hi];
    }
    if (lo >= 0) {
      const c = resolveColor(fgRole, scale[steps[lo]]);
      if (getContrastRatio(c, bgColor) >= minRatio) return steps[lo];
    }
    lo--;
    hi++;
  }
  return null; // No compliant token exists in this scale
}

function buildTokenToRolesMap(customMappings) {
  const allRoles = Object.values(roleTokenMap).reduce(
    (acc, roles) => ({ ...acc, ...roles }),
    {},
  );
  const map = {};
  Object.entries(allRoles).forEach(([role, defaultToken]) => {
    const token = customMappings[role] || defaultToken;
    if (!map[token]) map[token] = [];
    map[token].push(role);
  });
  return map;
}

function getContrastText(background) {
  return background.l < 0.5 ? "white" : "black";
}

function oklchToCss(color) {
  const { l, c, h, a = 1 } = color;
  return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)} / ${a})`;
}

function oklchToHex(color) {
  const { l, c, h } = color;
  const hRad = (h * Math.PI) / 180;
  const a_ = c * Math.cos(hRad);
  const b_ = c * Math.sin(hRad);
  const l_ = l + 0.3963377774 * a_ + 0.2158037573 * b_;
  const m_ = l - 0.1055613458 * a_ - 0.0638541728 * b_;
  const s_ = l - 0.0894841775 * a_ - 1.291485548 * b_;
  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;
  const rLin = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const gLin = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const bLin = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;
  const toSrgb = (val) => {
    val = Math.max(0, Math.min(1, val));
    return val <= 0.0031308
      ? 12.92 * val
      : 1.055 * Math.pow(val, 1 / 2.4) - 0.055;
  };
  const r = toSrgb(rLin);
  const g = toSrgb(gLin);
  const b = toSrgb(bLin);
  const toHex = (x) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function UsageRole({
  name,
  scale,
  currentToken,
  onTokenChange,
  oldToken,
  isHighlighted,
  isClicked,
  onHover,
  globalContrastMode,
  perRoleContrastMode,
  onContrastModeChange,
  pairedBgColor,
}) {
  const [copied, setCopied] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const color = useMemo(() => {
    const baseColor = scale[currentToken];
    const statusKey = Object.keys(statusHueMap).find((key) =>
      name.startsWith(key),
    );
    if (statusKey)
      return {
        ...baseColor,
        h: statusHueMap[statusKey],
        c: Math.max(baseColor.c, 0.12),
      };
    if (name.startsWith("neutral"))
      return { ...baseColor, c: Math.min(baseColor.c * 0.06, 0.025) };
    return baseColor;
  }, [name, scale, currentToken]);

  // Contrast against paired background (contextual) if available,
  // otherwise fall back to best of white/black
  const { bestContrast, contrastAgainstBg } = useMemo(() => {
    const white = { l: 1, c: 0, h: 0 };
    const black = { l: 0, c: 0, h: 0 };
    const ratioWhite = getContrastRatio(color, white);
    const ratioBlack = getContrastRatio(color, black);
    const best = Math.max(ratioWhite, ratioBlack).toFixed(1);
    const againstBg = pairedBgColor
      ? getContrastRatio(color, pairedBgColor).toFixed(1)
      : null;
    return { bestContrast: best, contrastAgainstBg: againstBg };
  }, [color, pairedBgColor]);

  // Effective mode for this chip
  const effectiveMode = perRoleContrastMode || globalContrastMode || "free";
  const minRatio = WCAG_RATIOS[effectiveMode] || 0;

  // Determine pass/fail against paired bg (contextual) or white/black fallback
  const displayRatio =
    contrastAgainstBg !== null ? contrastAgainstBg : bestContrast;
  const ratioNum = parseFloat(displayRatio);
  const passesAAA = ratioNum >= 7.0;
  const passesAA = ratioNum >= 4.5;
  const passesRequired = minRatio === 0 || ratioNum >= minRatio;
  // Enforcement warning: in AA/AAA mode and failing
  const isEnforcementWarning = minRatio > 0 && !passesRequired;

  const hasChanged = oldToken && oldToken !== currentToken;
  const alternatives = Object.keys(scale)
    .map(Number)
    .sort((a, b) => a - b);

  const copy = (type, e) => {
    e.stopPropagation();
    const val = type === "hex" ? oklchToHex(color) : oklchToCss(color);
    navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 800);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => onHover && onHover(name)}
      onMouseLeave={() => onHover && onHover(null)}
    >
      <div
        onClick={() => setIsSelecting(!isSelecting)}
        className={`group relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-background border cursor-pointer transition-all hover:shadow-sm ${
          isEnforcementWarning
            ? "ring-2 ring-orange-400 border-orange-400 bg-orange-50/20"
            : isClicked
              ? "ring-2 ring-amber-400 border-amber-400 bg-amber-50/30 shadow-md"
              : isHighlighted
                ? "ring-2 ring-blue-400 border-blue-400 bg-blue-50/30"
                : isSelecting
                  ? "border-blue-500 ring-1 ring-blue-500 shadow-sm"
                  : hasChanged
                    ? "border-blue-400 bg-blue-50/20"
                    : "border-(--navBorder) hover:border-gray-400"
        }`}
      >
        <div className="flex flex-col items-center gap-0.5 shrink-0">
          <div
            className="w-8 h-8 rounded-md border border-black/10 shadow-sm"
            style={{ backgroundColor: oklchToCss(color) }}
          />
          <span className="text-[7px] font-mono text-gray-400 leading-none">
            {currentToken}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[11px] leading-tight truncate text-foreground">
            {name}
          </div>
          <div className="text-[9px] text-gray-400 font-mono mt-0.5">
            {oklchToHex(color)}
          </div>
        </div>

        {/* Contrast badge — shows contextual ratio if paired bg exists */}
        <div
          className={`flex flex-col items-center shrink-0 px-1.5 py-1 rounded-md ${
            isEnforcementWarning
              ? "bg-orange-500/15"
              : passesAAA
                ? "bg-green-500/10"
                : passesAA
                  ? "bg-yellow-500/10"
                  : "bg-red-500/10"
          }`}
          title={
            contrastAgainstBg
              ? `${displayRatio}:1 against paired background`
              : `${displayRatio}:1 best contrast`
          }
        >
          <span
            className={`text-[10px] font-black leading-tight ${
              isEnforcementWarning
                ? "text-orange-600"
                : passesAAA
                  ? "text-green-700"
                  : passesAA
                    ? "text-yellow-700"
                    : "text-red-600"
            }`}
          >
            {displayRatio}
          </span>
          <span
            className={`text-[7px] font-bold leading-tight ${
              isEnforcementWarning
                ? "text-orange-500"
                : passesAAA
                  ? "text-green-600"
                  : passesAA
                    ? "text-yellow-600"
                    : "text-red-500"
            }`}
          >
            {isEnforcementWarning
              ? "!"
              : passesAAA
                ? "AAA"
                : passesAA
                  ? "AA"
                  : "✗"}
          </span>
        </div>

        {/* Per-chip contrast mode override — shown as a small pill on hover */}
        {CONTRAST_RELATIONSHIPS[name] && (
          <div
            className="opacity-0 group-hover:opacity-100 absolute left-1.5 -top-2.5 flex items-center gap-0.5 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {["free", "AA", "AAA"].map((m) => {
              const isActive =
                perRoleContrastMode === m ||
                (!perRoleContrastMode &&
                  m === "free" &&
                  globalContrastMode === "free") ||
                (!perRoleContrastMode && m === globalContrastMode);
              const isOverride = perRoleContrastMode === m;
              return (
                <button
                  key={m}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Clicking the already-active per-role override clears it (revert to global)
                    onContrastModeChange(
                      name,
                      perRoleContrastMode === m ? null : m,
                    );
                  }}
                  className={`px-1 py-0.5 rounded text-[6.5px] font-black transition-all border ${
                    isOverride
                      ? m === "AA"
                        ? "bg-yellow-500 text-white border-yellow-500"
                        : m === "AAA"
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-gray-600 text-white border-gray-600"
                      : "bg-background text-foreground/40 border-(--navBorder) hover:text-foreground/70"
                  }`}
                  title={
                    isOverride
                      ? `Override: ${m} (click to clear)`
                      : `Set this role to ${m}`
                  }
                >
                  {m}
                </button>
              );
            })}
          </div>
        )}

        {/* Copy buttons */}
        <div className="opacity-0 group-hover:opacity-100 absolute right-1.5 top-1/2 -translate-y-1/2 bg-background border border-(--navBorder) flex items-center gap-0.5 px-1 py-0.5 rounded-md shadow-sm z-10">
          <button
            onClick={(e) => copy("hex", e)}
            className="px-1.5 py-0.5 hover:bg-(--brand) rounded text-[8px] font-bold"
          >
            HEX
          </button>
          <button
            onClick={(e) => copy("oklch", e)}
            className="px-1.5 py-0.5 hover:bg-(--brand) rounded text-[8px] font-bold"
          >
            LCH
          </button>
        </div>
        {copied && (
          <div className="absolute inset-0 bg-green-500/15 flex items-center justify-center rounded-lg text-[9px] font-bold text-green-700 pointer-events-none">
            ✓ Copied
          </div>
        )}
      </div>

      {isSelecting && (
        <div className="mt-1 mb-1 p-2 bg-gray-900 rounded-lg border border-gray-700">
          <div className="text-[8px] text-gray-400 font-bold uppercase mb-1.5 tracking-wider">
            Select token step
          </div>
          <div className="flex gap-1.5">
            {alternatives.map((t) => {
              const basePreview = scale[t];
              const statusKey = Object.keys(statusHueMap).find((key) =>
                name.startsWith(key),
              );
              const previewColor = statusKey
                ? {
                    ...basePreview,
                    h: statusHueMap[statusKey],
                    c: Math.max(basePreview.c, 0.12),
                  }
                : name.startsWith("neutral")
                  ? { ...basePreview, c: Math.min(basePreview.c * 0.06, 0.025) }
                  : basePreview;
              // Show contrast against paired bg if available, else white/black
              const previewContrast = pairedBgColor
                ? getContrastRatio(previewColor, pairedBgColor).toFixed(1)
                : Math.max(
                    getContrastRatio(previewColor, { l: 1, c: 0, h: 0 }),
                    getContrastRatio(previewColor, { l: 0, c: 0, h: 0 }),
                  ).toFixed(1);
              const isCurrent = t === Number(currentToken);
              const previewPasses =
                minRatio === 0 || parseFloat(previewContrast) >= minRatio;
              return (
                <button
                  key={t}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTokenChange(name, t);
                    setIsSelecting(false);
                  }}
                  className={`flex-1 rounded-md flex flex-col items-center justify-center transition-all py-2 gap-1 border-2 ${
                    isCurrent
                      ? "border-white scale-105 shadow-lg"
                      : !previewPasses && minRatio > 0
                        ? "border-orange-400 opacity-60"
                        : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: oklchToCss(previewColor),
                    color: getContrastText(previewColor),
                  }}
                >
                  <span className="text-[9px] font-black">{t}</span>
                  <span className="text-[7px] opacity-90 font-semibold">
                    {previewContrast}
                  </span>
                  {!previewPasses && minRatio > 0 && (
                    <span className="text-[6px] font-black text-orange-300">
                      ✗
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ComponentPreview({
  getActiveColor,
  getTextOnColor,
  highlightedRole,
  onRoleClick,
  onClear,
  clickedRoles,
}) {
  const hl = (role) => {
    if (!highlightedRole) return {};
    const roles = Array.isArray(role) ? role : [role];
    if (roles.includes(highlightedRole)) {
      return {
        outline: "2px solid #3b82f6",
        outlineOffset: "2px",
        borderRadius: "4px",
      };
    }
    return {};
  };

  const rc = (role) => {
    const roles = Array.isArray(role) ? role : [role];
    return {
      onClick: (e) => {
        e.stopPropagation();
        onRoleClick && onRoleClick(roles);
      },
      title: "Click to select: " + roles.join(", "),
    };
  };

  const cl = (role) => {
    if (!clickedRoles || clickedRoles.length === 0) return {};
    const roles = Array.isArray(role) ? role : [role];
    if (roles.some((r) => clickedRoles.includes(r))) {
      return {
        outline: "2px solid #f59e0b",
        outlineOffset: "2px",
        borderRadius: "4px",
      };
    }
    return {};
  };

  return (
    <Preview
      getActiveColor={getActiveColor}
      getTextOnColor={getTextOnColor}
      oklchToCss={oklchToCss}
      onClear={onClear}
      hl={hl}
      cl={cl}
      rc={rc}
    />
  );
}

function ExportDropdown({
  onExport,
  hasChanges,
  onExportDecisions,
  exporting,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-800 text-white text-[10px] font-bold hover:bg-gray-700 transition-colors"
      >
        Export
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 border border-(--navBorder) rounded-lg shadow-xl z-50 overflow-hidden">
          {hasChanges && (
            <>
              <button
                onClick={() => {
                  onExportDecisions();
                  setOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-[10px] font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-700 dark:text-purple-400 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                {exporting === "decisions" ? "✓ Copied!" : "Decisions (MD)"}
              </button>
              <div className="h-px bg-gray-100 dark:bg-gray-700" />
            </>
          )}
          {[
            {
              key: "json",
              label: "JSON",
              color: "text-gray-700 dark:text-gray-300",
            },
            {
              key: "css",
              label: "CSS Variables",
              color: "text-blue-700 dark:text-blue-400",
            },
            {
              key: "tailwind",
              label: "Tailwind Config",
              color: "text-teal-700 dark:text-teal-400",
            },
          ].map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => {
                onExport(key);
                setOpen(false);
              }}
              className={`w-full px-3 py-2 text-left text-[10px] font-semibold hover:bg-gray-50 dark:hover:bg-gray-700/50 ${color}`}
            >
              {exporting === key ? "✓ Copied!" : label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ColorDetail({
  expanded,
  selectedIdx,
  onSelect,
  darkModeFloor,
  onDarkModeFloorChange,
  lightModeCeiling,
  onLightModeCeilingChange,
}) {
  const [colorMode, setColorMode] = useState("light");
  const [customMappingsPerMode, setCustomMappingsPerMode] = useState({
    light: {},
    dark: {},
  });
  const [originalMappingsPerMode, setOriginalMappingsPerMode] = useState({
    light: {},
    dark: {},
  });
  const [exporting, setExporting] = useState(null);
  const roleBundle = "comprehensive";
  const [hoveredRole, setHoveredRole] = useState(null);
  const [highlightedToken, setHighlightedToken] = useState(null);
  const [clickedRoles, setClickedRoles] = useState([]);
  // NEW: preview panel toggle
  const [showPreview, setShowPreview] = useState(false);
  // NEW: global contrast enforcement mode
  const [contrastMode, setContrastMode] = useState("free");
  // NEW: per-role contrast mode overrides (role → "free"|"AA"|"AAA"|null=inherit)
  const [contrastModePerRole, setContrastModePerRole] = useState({});

  const roleChipRefs = useRef({});
  const rolePanelRef = useRef(null);

  const handlePreviewRoleClick = (roles) => {
    const rolesArr = Array.isArray(roles) ? roles : [roles];
    setClickedRoles(rolesArr);
    const firstRef = roleChipRefs.current[rolesArr[0]];
    if (firstRef && rolePanelRef.current) {
      firstRef.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const handlePreviewClear = () => setClickedRoles([]);

  const colorData = expanded[selectedIdx];
  const scale = colorMode === "light" ? colorData.scale : colorData.darkScale;
  const currentRoleMap = ROLE_BUNDLES[roleBundle].categories;

  const activeCustomMappings = customMappingsPerMode[colorMode];
  const activeOriginalMappings = originalMappingsPerMode[colorMode];

  const tokenToRoles = useMemo(
    () => buildTokenToRolesMap(activeCustomMappings),
    [activeCustomMappings],
  );

  // resolveColor: applies statusHue / neutral overrides to a raw scale color
  // (mirrors getActiveColor but works on any arbitrary scale color + role name)
  const resolveRoleColor = (role, baseColor) => {
    const statusKey = Object.keys(statusHueMap).find((k) => role.startsWith(k));
    if (statusKey)
      return {
        ...baseColor,
        h: statusHueMap[statusKey],
        c: Math.max(baseColor.c, 0.12),
      };
    if (role.startsWith("neutral"))
      return { ...baseColor, c: Math.min(baseColor.c * 0.06, 0.025) };
    return baseColor;
  };

  // ── Pure sweep: given a mappings snapshot, enforce contrast for ALL pairs ──
  // Returns a new mappings object with any failing fg roles shifted to pass.
  // changedByUser: optional role name the user just explicitly changed — skip
  // auto-adjusting that specific fg role so we don't override their intent.
  const enforceAllContrast = useCallback(
    (mappings, currentScale, globalMode, perRoleMode, changedByUser = null) => {
      const allRoleDefaults = Object.values(roleTokenMap).reduce(
        (acc, r) => ({ ...acc, ...r }),
        {},
      );

      const getColorForRole = (role, m) => {
        const token = m[role] || allRoleDefaults[role];
        if (!currentScale[token]) return null;
        return resolveRoleColor(role, currentScale[token]);
      };

      const enforced = { ...mappings };

      Object.entries(CONTRAST_RELATIONSHIPS).forEach(([fgRole, bgRoles]) => {
        // Don't auto-adjust a role the user just explicitly chose
        if (fgRole === changedByUser) return;

        const roleMode = perRoleMode[fgRole] || globalMode;
        const minRatio = WCAG_RATIOS[roleMode] || 0;
        if (minRatio === 0) return;

        // Use the best-contrast bg available (first one that resolves)
        const bgColor = bgRoles
          .map((bgRole) => getColorForRole(bgRole, enforced))
          .find(Boolean);
        if (!bgColor) return;

        const currentFgToken = enforced[fgRole] || allRoleDefaults[fgRole];
        const newFgToken = findCompliantToken(
          fgRole,
          currentFgToken,
          currentScale,
          bgColor,
          minRatio,
          resolveRoleColor,
        );

        if (newFgToken !== null) {
          enforced[fgRole] = newFgToken;
        }
      });

      return enforced;
    },
    [],
  );

  const handleTokenChange = (roleName, newToken) => {
    const allRoleDefaults = Object.values(roleTokenMap).reduce(
      (acc, r) => ({ ...acc, ...r }),
      {},
    );

    setCustomMappingsPerMode((prev) => {
      const modeMap = prev[colorMode];
      const origMap = originalMappingsPerMode[colorMode];

      // Save original token before first override
      if (!origMap[roleName]) {
        setOriginalMappingsPerMode((p) => ({
          ...p,
          [colorMode]: {
            ...p[colorMode],
            [roleName]: allRoleDefaults[roleName],
          },
        }));
      }

      // Commit the user's change first
      const withChange = { ...modeMap, [roleName]: newToken };

      // Then sweep all pairs — skip auto-adjusting the role the user just changed
      const enforced = enforceAllContrast(
        withChange,
        scale,
        contrastMode,
        contrastModePerRole,
        roleName, // don't override the user's explicit choice
      );

      // Save originals for any roles that got auto-adjusted
      Object.keys(enforced).forEach((role) => {
        if (
          role !== roleName &&
          enforced[role] !== (modeMap[role] || allRoleDefaults[role])
        ) {
          if (!origMap[role]) {
            setOriginalMappingsPerMode((p) => ({
              ...p,
              [colorMode]: { ...p[colorMode], [role]: allRoleDefaults[role] },
            }));
          }
        }
      });

      return { ...prev, [colorMode]: enforced };
    });
  };

  // ── When contrastMode or contrastModePerRole changes, immediately sweep ──
  // all pairs and fix any that now fail the new requirement.
  useEffect(() => {
    if (contrastMode === "free") return; // free mode — nothing to enforce

    const allRoleDefaults = Object.values(roleTokenMap).reduce(
      (acc, r) => ({ ...acc, ...r }),
      {},
    );

    setCustomMappingsPerMode((prev) => {
      const modeMap = prev[colorMode];
      const enforced = enforceAllContrast(
        modeMap,
        scale,
        contrastMode,
        contrastModePerRole,
        null, // no user-changed role — sweep everything
      );

      // If nothing changed, bail out to avoid infinite loop
      if (JSON.stringify(enforced) === JSON.stringify(modeMap)) return prev;

      // Save originals for any newly auto-adjusted roles
      setOriginalMappingsPerMode((p) => {
        const origMap = p[colorMode];
        const newOrigMap = { ...origMap };
        Object.keys(enforced).forEach((role) => {
          if (
            !newOrigMap[role] &&
            enforced[role] !== (modeMap[role] || allRoleDefaults[role])
          ) {
            newOrigMap[role] = allRoleDefaults[role];
          }
        });
        return { ...p, [colorMode]: newOrigMap };
      });

      return { ...prev, [colorMode]: enforced };
    });
  }, [contrastMode, contrastModePerRole, colorMode, scale]);

  const getActiveColor = (role) => {
    const allRoles = Object.values(roleTokenMap).reduce(
      (acc, roles) => ({ ...acc, ...roles }),
      {},
    );
    const def = allRoles[role];
    const token = activeCustomMappings[role] || def;
    const baseColor = scale[token];
    const statusKey = Object.keys(statusHueMap).find((k) => role.startsWith(k));
    let resolved;
    if (statusKey) {
      resolved = {
        ...baseColor,
        h: statusHueMap[statusKey],
        c: Math.max(baseColor.c, 0.12),
      };
    } else if (role.startsWith("neutral")) {
      resolved = { ...baseColor, c: Math.min(baseColor.c * 0.06, 0.025) };
    } else {
      resolved = baseColor;
    }
    return resolved;
  };

  const getTextOnColor = (bgColor) => {
    const white = { l: 1, c: 0, h: 0 };
    const black = { l: 0, c: 0, h: 0 };
    const rW = getContrastRatio(bgColor, white);
    const rB = getContrastRatio(bgColor, black);
    return rW >= rB ? "white" : "black";
  };

  const exportDecisions = () => {
    const markdown = `# Design System Color Decisions\n\n**Palette**: #${selectedIdx + 1}\n**Mode**: ${colorMode}\n**Bundle**: ${ROLE_BUNDLES[roleBundle].name}\n**Light Mode Ceiling**: ${(lightModeCeiling * 100).toFixed(0)}%\n**Dark Mode Floor**: ${(darkModeFloor * 100).toFixed(0)}%\n\n## Customizations (${Object.keys(activeCustomMappings).length})\n\n${Object.entries(
      activeCustomMappings,
    )
      .map(
        ([role, token]) =>
          `### ${role}\n- **Token**: ${activeOriginalMappings[role]} → **${token}**\n- **Color**: ${oklchToHex(getActiveColor(role))}\n`,
      )
      .join("\n")}`;
    navigator.clipboard.writeText(markdown);
    setExporting("decisions");
    setTimeout(() => setExporting(null), 2000);
  };

  const exportData = (type) => {
    const allRoles = Object.values(roleTokenMap).reduce(
      (acc, roles) => ({ ...acc, ...roles }),
      {},
    );
    const bundleRoles = Object.values(currentRoleMap).flat();
    const buildConfig = (scaleToUse, mappings) => {
      const config = {};
      bundleRoles.forEach((role) => {
        const def = allRoles[role];
        if (!def) return;
        config[role] = oklchToHex(scaleToUse[mappings[role] || def]);
      });
      return config;
    };
    const lightConfig = buildConfig(
      colorData.scale,
      customMappingsPerMode["light"],
    );
    const darkConfig = buildConfig(
      colorData.darkScale,
      customMappingsPerMode["dark"],
    );
    let output = "";
    if (type === "tailwind") {
      output = `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n        light: ${JSON.stringify(lightConfig, null, 10)},\n        dark: ${JSON.stringify(darkConfig, null, 10)}\n      }\n    }\n  }\n}`;
    } else if (type === "css") {
      const vars = Object.entries(
        colorMode === "light" ? lightConfig : darkConfig,
      )
        .map(([k, v]) => `  --color-${k}: ${v};`)
        .join("\n");
      output = `:root {\n${vars}\n}`;
    } else {
      output = JSON.stringify(
        colorMode === "light" ? lightConfig : darkConfig,
        null,
        2,
      );
    }
    navigator.clipboard.writeText(output);
    setExporting(type);
    setTimeout(() => setExporting(null), 2000);
  };

  const hasChanges =
    Object.keys(customMappingsPerMode.light).length > 0 ||
    Object.keys(customMappingsPerMode.dark).length > 0;

  const highlightedRolesFromScale = highlightedToken
    ? tokenToRoles[highlightedToken] || []
    : [];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background border border-(--navBorder) rounded-xl">
      {/* ── TOOLBAR: single unified row ── */}
      <div className="border-b border-(--navBorder) bg-background px-3 py-2 flex items-center gap-3 flex-wrap">
        {/* Palette chips */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-semibold text-foreground/40 uppercase tracking-wider">
            Palette
          </span>
          <div className="flex gap-1.5">
            {expanded.map((c, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(idx)}
                className={`w-6 h-6 rounded-md border-2 transition-all ${
                  selectedIdx === idx
                    ? "border-blue-500 ring-2 ring-blue-500/30 scale-110 shadow-md"
                    : "border-(--navBorder) hover:border-gray-400 hover:scale-105"
                }`}
                style={{ backgroundColor: oklchToCss(c.base) }}
                title={`Palette #${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="w-px h-4 bg-foreground/10 shrink-0" />

        {/* Light / Dark toggle */}
        <div className="flex p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg border border-(--navBorder) shrink-0">
          <button
            onClick={() => setColorMode("light")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
              colorMode === "light"
                ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            ☀️ Light
          </button>
          <button
            onClick={() => setColorMode("dark")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
              colorMode === "dark"
                ? "bg-gray-700 text-white shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            🌙 Dark
          </button>
        </div>

        {/* Ceiling / Floor slider — shows contextually */}
        {colorMode === "light" ? (
          <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg border border-(--navBorder) shrink-0">
            <span className="text-[9px] font-semibold text-foreground/50">
              Ceiling
            </span>
            <input
              type="range"
              min="0.75"
              max="0.99"
              step="0.01"
              value={lightModeCeiling}
              onChange={(e) =>
                onLightModeCeilingChange(parseFloat(e.target.value))
              }
              className="w-14 h-1 cursor-pointer accent-(--brand)"
            />
            <span className="text-[9px] font-mono font-bold text-(--brand) w-6">
              {(lightModeCeiling * 100).toFixed(0)}%
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg border border-(--navBorder) shrink-0">
            <span className="text-[9px] font-semibold text-foreground/50">
              Floor
            </span>
            <input
              type="range"
              min="0.08"
              max="0.25"
              step="0.01"
              value={darkModeFloor}
              onChange={(e) =>
                onDarkModeFloorChange(parseFloat(e.target.value))
              }
              className="w-14 h-1 cursor-pointer accent-(--brand)"
            />
            <span className="text-[9px] font-mono font-bold text-(--brand) w-6">
              {(darkModeFloor * 100).toFixed(0)}%
            </span>
          </div>
        )}

        {/* Spacer pushes remaining controls right */}
        <div className="flex-1" />

        {/* ── Contrast mode toggle ── */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[9px] font-semibold text-foreground/40 uppercase tracking-wider">
            Contrast
          </span>
          <div className="flex p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg border border-(--navBorder)">
            {["free", "AA", "AAA"].map((mode) => (
              <button
                key={mode}
                onClick={() => setContrastMode(mode)}
                className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
                  contrastMode === mode
                    ? mode === "free"
                      ? "bg-background text-foreground shadow-sm"
                      : mode === "AA"
                        ? "bg-yellow-500 text-white shadow-sm"
                        : "bg-green-600 text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="w-px h-4 bg-foreground/10 shrink-0" />

        {/* Override count badge */}
        {hasChanges && (
          <span className="text-[9px] text-blue-500 font-semibold shrink-0">
            {Object.keys(activeCustomMappings).length} override
            {Object.keys(activeCustomMappings).length !== 1 ? "s" : ""}
          </span>
        )}

        {/* Reset */}
        <button
          onClick={() => {
            setCustomMappingsPerMode({ light: {}, dark: {} });
            setOriginalMappingsPerMode({ light: {}, dark: {} });
            setContrastModePerRole({});
          }}
          className="px-2.5 py-1.5 rounded-lg border border-(--navBorder) text-[10px] font-semibold text-foreground/60 hover:text-foreground hover:border-gray-400 transition-all shrink-0"
        >
          Reset
        </button>

        {/* Export dropdown */}
        <ExportDropdown
          onExport={exportData}
          hasChanges={hasChanges}
          onExportDecisions={exportDecisions}
          exporting={exporting}
        />

        {/* Preview toggle */}
        <button
          onClick={() => setShowPreview((v) => !v)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition-all shrink-0 ${
            showPreview
              ? "bg-blue-600 border-blue-600 text-white shadow-sm"
              : "border-(--navBorder) text-foreground/60 hover:text-foreground hover:border-gray-400"
          }`}
        >
          {/* Eye icon */}
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                showPreview
                  ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              }
            />
          </svg>
          Preview
        </button>
      </div>

      {/* ── MAIN BODY ── */}
      <div className="flex flex-1 min-h-0 bg-background overflow-hidden">
        {/* ROLES PANEL — full width (2-col) when no preview, left 42% when preview shown */}
        <div
          className={`flex flex-col min-w-0 transition-all duration-200 ${
            showPreview ? "w-[42%] border-r border-(--navBorder)" : "w-full"
          }`}
        >
          <div
            ref={rolePanelRef}
            className="flex-1 overflow-y-auto custom-scrollbar px-3 py-3"
          >
            <div
              className={`gap-x-4 gap-y-5 ${
                showPreview
                  ? "flex flex-col space-y-5"
                  : "grid grid-cols-2 items-start"
              }`}
            >
              {Object.entries(currentRoleMap).map(([category, roles]) => {
                const allRoles = Object.values(roleTokenMap).reduce(
                  (acc, r) => ({ ...acc, ...r }),
                  {},
                );
                return (
                  <div
                    key={category}
                    className={showPreview ? "" : "col-span-1"}
                  >
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mb-2 pb-1 border-b border-(--navBorder)">
                      {category}
                    </h4>
                    <div className="space-y-1.5">
                      {roles.map((roleName) => {
                        const defaultToken = allRoles[roleName];
                        if (!defaultToken) return null;
                        const isHighlightedByScale =
                          highlightedRolesFromScale.includes(roleName);
                        return (
                          <div
                            key={roleName}
                            ref={(el) => {
                              roleChipRefs.current[roleName] = el;
                            }}
                          >
                            <UsageRole
                              name={roleName}
                              scale={scale}
                              currentToken={
                                activeCustomMappings[roleName] || defaultToken
                              }
                              oldToken={activeOriginalMappings[roleName]}
                              onTokenChange={handleTokenChange}
                              isHighlighted={
                                isHighlightedByScale ||
                                clickedRoles.includes(roleName)
                              }
                              isClicked={clickedRoles.includes(roleName)}
                              onHover={setHoveredRole}
                              globalContrastMode={contrastMode}
                              perRoleContrastMode={
                                contrastModePerRole[roleName] || null
                              }
                              onContrastModeChange={(role, mode) =>
                                setContrastModePerRole((prev) => ({
                                  ...prev,
                                  [role]: mode,
                                }))
                              }
                              pairedBgColor={(() => {
                                const bgRoles =
                                  CONTRAST_RELATIONSHIPS[roleName];
                                if (!bgRoles) return null;
                                for (const bgRole of bgRoles) {
                                  const c = getActiveColor(bgRole);
                                  if (c) return c;
                                }
                                return null;
                              })()}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* PREVIEW PANEL — only rendered when showPreview is true */}
        {showPreview && (
          <div className="flex-1 min-w-0 flex flex-col">
            <ComponentPreview
              getActiveColor={getActiveColor}
              getTextOnColor={getTextOnColor}
              highlightedRole={hoveredRole}
              onRoleClick={handlePreviewRoleClick}
              onClear={handlePreviewClear}
              clickedRoles={clickedRoles}
            />
          </div>
        )}
      </div>

      {/* ── TONAL SCALE (bottom) ── */}
      <div className="px-3 py-2.5 border-t border-(--navBorder) bg-foreground/[0.01]">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[9px] font-black uppercase tracking-widest text-foreground/40">
            Tonal Scale
          </h4>
          <span className="text-[8px] text-foreground/30">
            {highlightedToken
              ? `Step ${highlightedToken} · used by ${(tokenToRoles[highlightedToken] || []).length} role(s)`
              : "Click any step to highlight its roles ↑"}
          </span>
        </div>
        <div className="flex w-full h-12 rounded-lg overflow-hidden border border-(--navBorder)">
          {Object.entries(scale).map(([token, color]) => {
            const isActive = highlightedToken === Number(token);
            const rolesUsingThis = tokenToRoles[Number(token)] || [];
            return (
              <button
                key={token}
                className={`flex-1 h-full flex flex-col items-center justify-center transition-all relative ${
                  isActive
                    ? "ring-2 ring-inset ring-white/60 z-10 brightness-110"
                    : "hover:brightness-90"
                }`}
                style={{ backgroundColor: oklchToCss(color) }}
                onClick={() => {
                  const newToken = isActive ? null : Number(token);
                  setHighlightedToken(newToken);
                  if (newToken !== null) {
                    const roles = tokenToRoles[newToken] || [];
                    const firstRole = roles[0];
                    if (
                      firstRole &&
                      roleChipRefs.current[firstRole] &&
                      rolePanelRef.current
                    ) {
                      roleChipRefs.current[firstRole].scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                      });
                    }
                  }
                }}
                title={`Step ${token} · ${rolesUsingThis.length} role(s)`}
              >
                <span
                  style={{ color: getContrastText(color) }}
                  className="text-[8px] font-black leading-tight"
                >
                  {token}
                </span>
                {rolesUsingThis.length > 0 && (
                  <span
                    style={{ color: getContrastText(color) }}
                    className="text-[6px] opacity-60 font-bold leading-tight"
                  >
                    ×{rolesUsingThis.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Expand() {
  const { palette } = useColorPaletteContext();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [error, setError] = useState(null);
  const [darkModeFloor, setDarkModeFloor] = useState(0.12);
  const [lightModeCeiling, setLightModeCeiling] = useState(0.97);

  const expanded = useMemo(() => {
    try {
      if (!palette || palette.length === 0)
        throw new Error("No colors in palette.");
      return generateExpandedPalette(palette, {
        darkModeFloor,
        lightModeCeiling,
      });
    } catch (err) {
      setError(err.message);
      return [];
    }
  }, [palette, darkModeFloor, lightModeCeiling]);

  if (error)
    return (
      <div className="p-6 text-xs text-red-500 font-mono bg-red-50 rounded-lg m-4 border border-red-100">
        {error}
      </div>
    );

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background pl-2 pr-2 pt-4 pb-2">
      {expanded.length > 0 && (
        <ColorDetail
          expanded={expanded}
          selectedIdx={selectedColorIndex}
          onSelect={setSelectedColorIndex}
          darkModeFloor={darkModeFloor}
          onDarkModeFloorChange={setDarkModeFloor}
          lightModeCeiling={lightModeCeiling}
          onLightModeCeilingChange={setLightModeCeiling}
        />
      )}
    </div>
  );
}

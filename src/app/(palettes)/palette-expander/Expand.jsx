import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  generateExpandedPalette,
  getContrastRatio,
  oklchToRgbValues,
  SEMANTIC_HUES,
} from "./colorexpansion";
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
      // FIX 1: Neutrals now map to the independent neutral scale
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
  // FIX 1: Neutral token map — these will be resolved against neutralScale, not scale
  Neutrals: {
    "neutral-subtle": 50,
    "neutral-muted": 200,
    "neutral-default": 600,
    "neutral-strong": 800,
    "neutral-surface": 100,
  },
};

// Roles that resolve from the neutral scale rather than the brand scale
const NEUTRAL_ROLES = new Set([
  "neutral-subtle",
  "neutral-muted",
  "neutral-default",
  "neutral-strong",
  "neutral-surface",
]);

// Semantic roles resolve from independent per-family scales (success/warning/error/info)
const SEMANTIC_ROLE_PREFIXES = ["success", "warning", "error", "info"];
function getSemanticKey(role) {
  return (
    SEMANTIC_ROLE_PREFIXES.find(
      (p) => role === p || role.startsWith(p + "-"),
    ) || null
  );
}

// Route a role to its correct scale object for a given mode.
// Semantic -> semanticScales[key]; Neutral -> neutralScale; else -> brand scale.
function getScaleForRole(role, colorData, mode) {
  const semanticKey = getSemanticKey(role);
  if (semanticKey) {
    return mode === "light"
      ? colorData.semanticScales[semanticKey]
      : colorData.darkSemanticScales[semanticKey];
  }
  if (NEUTRAL_ROLES.has(role)) {
    return mode === "light"
      ? colorData.neutralScale
      : colorData.darkNeutralScale;
  }
  return mode === "light" ? colorData.scale : colorData.darkScale;
}

// Alpha token source roles — these get semi-transparent variants
// (brand fills, overlays, hover tints, focus rings, shadows)
const ALPHA_ROLES = [
  "background",
  "surface",
  "interactive-default",
  "fill",
  "accent",
  "border-focus",
  "text",
  "neutral-surface",
];
const ALPHA_LEVELS = [5, 10, 15, 20, 30, 40, 50, 60];

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

const WCAG_RATIOS = { free: 0, AA: 4.5, AAA: 7.0 };

// ── APCA (Advanced Perceptual Contrast Algorithm) ─────────────────────────────
// Reference: https://github.com/Myndex/SAPC-APCA (open source, WCAG 3.0 basis)
// Returns Lc value: positive = light bg, negative = dark bg. We use |Lc|.
// Lc 45 = minimum readable, Lc 60 ≈ WCAG AA equivalent, Lc 75 ≈ WCAG AAA.
const APCA_THRESHOLDS = { free: 0, AA: 60, AAA: 75 };

function sRGBtoLinear(v) {
  const s = Math.max(0, Math.min(1, v));
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function apcaLuminance(rgb) {
  // Perceptual luminance with APCA coefficients (slightly different from WCAG)
  return (
    0.2126729 * Math.pow(sRGBtoLinear(rgb.r), 2.2) +
    0.7151522 * Math.pow(sRGBtoLinear(rgb.g), 2.2) +
    0.072175 * Math.pow(sRGBtoLinear(rgb.b), 2.2)
  );
}

function apcaContrast(fg, bg) {
  // Convert oklch -> rgb values
  const fgRgb = oklchToRgbValues(fg);
  const bgRgb = oklchToRgbValues(bg);
  const Ytxt = apcaLuminance(fgRgb);
  const Ybg = apcaLuminance(bgRgb);
  // APCA-W3 power-curve constants
  const normBg = 0.56,
    normTxt = 0.57; // light bg
  const revBg = 0.65,
    revTxt = 0.62; // dark bg
  const blkTxt = 0.0,
    blkClmp = 0.022,
    deltaYmin = 0.0005;
  const scaleBoW = 1.14,
    scaleWoB = 1.14;
  const loClip = 0.1,
    offset = 0.027;

  const Sapc =
    Ybg > Ytxt
      ? (Math.pow(Ybg, normBg) - Math.pow(Math.max(Ytxt, blkClmp), normTxt)) *
        scaleBoW
      : (Math.pow(Ybg, revBg) - Math.pow(Math.max(Ytxt, blkClmp), revTxt)) *
        scaleWoB;

  const Lc =
    Math.abs(Sapc) < loClip
      ? 0
      : (Sapc > 0 ? Sapc - offset : Sapc + offset) * 100;
  return Math.abs(Math.round(Lc * 10) / 10);
}

// Unified: returns the contrast value for the active algorithm
function getContrastValue(fg, bg, algo) {
  if (!fg || !bg) return 0;
  if (algo === "apca") return apcaContrast(fg, bg);
  return getContrastRatio(fg, bg);
}

// Unified: does value meet the threshold for the given mode + algorithm?
function meetsThreshold(value, mode, algo) {
  if (mode === "free") return true;
  const thresholds = algo === "apca" ? APCA_THRESHOLDS : WCAG_RATIOS;
  return value >= (thresholds[mode] || 0);
}

// Format a contrast value for display (e.g. "4.5" or "Lc 62")
function formatContrast(value, algo) {
  if (algo === "apca") return "Lc " + value.toFixed(0);
  return value.toFixed(1);
}

// FIX 5: Search by perceptual proximity to currentToken (nearest steps first,
// alternating both directions) rather than always biasing toward higher tokens.
function findCompliantToken(
  fgRole,
  currentToken,
  scale,
  bgColor,
  minRatio,
  resolveColor,
  algo = "wcag",
) {
  const steps = Object.keys(scale)
    .map(Number)
    .sort((a, b) => a - b);
  const currentIdx = steps.indexOf(Number(currentToken));

  const currentColor = resolveColor(fgRole, scale[currentToken]);
  if (getContrastValue(currentColor, bgColor, algo) >= minRatio) return null;

  const bgIsLight = bgColor.l > 0.5;
  const preferredDir = bgIsLight ? 1 : -1;
  const order = [];
  let lo = currentIdx - 1;
  let hi = currentIdx + 1;
  while (lo >= 0 || hi < steps.length) {
    const first = preferredDir > 0 ? hi : lo;
    const second = preferredDir > 0 ? lo : hi;
    if (first >= 0 && first < steps.length) order.push(steps[first]);
    if (second >= 0 && second < steps.length && second !== first)
      order.push(steps[second]);
    lo--;
    hi++;
  }
  for (const step of order) {
    const c = resolveColor(fgRole, scale[step]);
    if (getContrastValue(c, bgColor, algo) >= minRatio) return step;
  }
  return null;
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

// FIX 4: Generate a CSS value with rgb() fallback for broader tool compatibility
export function oklchWithFallback(color) {
  const oklch = oklchToCss(color);
  const { r, g, b } = oklchToRgbValues(color);
  const toInt = (v) => Math.round(Math.max(0, Math.min(1, v)) * 255);
  const rgb = `rgb(${toInt(r)}, ${toInt(g)}, ${toInt(b)})`;
  return { oklch, rgb };
}

function oklchToHex(color) {
  const { r, g, b } = oklchToRgbValues(color);
  const toHex = (x) =>
    Math.round(Math.max(0, Math.min(1, x)) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function UsageRole({
  name,
  scaleForRole,
  contrastAlgorithm = "wcag",
  currentToken,
  onTokenChange,
  oldToken,
  isHighlighted,
  isClicked,
  onHover,
  globalContrastMode,
  perRoleContrastMode,
  onContrastModeChange,
  pairedBgColors,
  shiftAnnotation,
  compact = false,
}) {
  const [copied, setCopied] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  // Color comes directly from scaleForRole (already the right scale).
  // No runtime hue-shifting or chroma hacks needed anymore.
  const color = useMemo(() => {
    return scaleForRole[currentToken] || scaleForRole[500];
  }, [scaleForRole, currentToken]);

  // Worst-case contrast using active algorithm (WCAG or APCA)
  const { bestContrast, worstCaseBgContrast, worstCaseBgRole } = useMemo(() => {
    const white = { l: 1, c: 0, h: 0 };
    const black = { l: 0, c: 0, h: 0 };
    const best = Math.max(
      getContrastValue(color, white, contrastAlgorithm),
      getContrastValue(color, black, contrastAlgorithm),
    );

    let worst = null;
    let worstRole = null;
    if (pairedBgColors && pairedBgColors.length > 0) {
      pairedBgColors.forEach(({ role, color: bgColor }) => {
        const val = getContrastValue(color, bgColor, contrastAlgorithm);
        if (worst === null || val < worst) {
          worst = val;
          worstRole = role;
        }
      });
    }
    return {
      bestContrast: best,
      worstCaseBgContrast: worst,
      worstCaseBgRole: worstRole,
    };
  }, [color, pairedBgColors, contrastAlgorithm]);

  const effectiveMode = perRoleContrastMode || globalContrastMode || "free";
  const thresholds =
    contrastAlgorithm === "apca" ? APCA_THRESHOLDS : WCAG_RATIOS;
  const minRatio = thresholds[effectiveMode] || 0;

  // Use worst-case value for pass/fail determination
  const displayValue =
    worstCaseBgContrast !== null ? worstCaseBgContrast : bestContrast;
  const displayRatio = formatContrast(displayValue, contrastAlgorithm);
  const passesAAA = displayValue >= thresholds.AAA;
  const passesAA = displayValue >= thresholds.AA;
  const passesRequired = minRatio === 0 || displayValue >= minRatio;
  const isEnforcementWarning = minRatio > 0 && !passesRequired;

  const hasChanged = oldToken && oldToken !== currentToken;
  const alternatives = Object.keys(scaleForRole)
    .map(Number)
    .sort((a, b) => a - b);

  const copy = (type, e) => {
    e.stopPropagation();
    const { oklch, rgb } = oklchWithFallback(color);
    const val =
      type === "hex" ? oklchToHex(color) : type === "rgb" ? rgb : oklch;
    navigator.clipboard.writeText(val);
    setCopied(type);
    setTimeout(() => setCopied(false), 800);
  };

  const contrastTitle = worstCaseBgRole
    ? `${displayRatio} against ${worstCaseBgRole} (worst case)`
    : `${displayRatio} best contrast`;

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
          {/* FIX 3: Shift annotation — shown when a token was auto-adjusted */}
          {shiftAnnotation && (
            <div className="text-[7.5px] font-bold text-orange-500 mt-0.5 leading-tight">
              ↕ shifted {shiftAnnotation.from}→{shiftAnnotation.to} for{" "}
              {shiftAnnotation.mode}
            </div>
          )}
          {NEUTRAL_ROLES.has(name) && (
            <div className="text-[6.5px] font-bold text-purple-400 mt-0.5 uppercase tracking-wider leading-none">
              neutral scale
            </div>
          )}
          {getSemanticKey(name) && (
            <div className="text-[6.5px] font-bold text-emerald-500 mt-0.5 uppercase tracking-wider leading-none">
              {getSemanticKey(name)} scale
            </div>
          )}
        </div>

        {/* Contrast badge — worst-case ratio with tooltip */}
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
          title={contrastTitle}
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
          {/* Show which bg role is worst case */}
          {worstCaseBgRole && (
            <span className="text-[5.5px] text-gray-400 leading-tight font-mono max-w-[36px] truncate text-center">
              vs {worstCaseBgRole.replace("background", "bg")}
            </span>
          )}
          {contrastAlgorithm === "apca" && (
            <span className="text-[5px] font-black text-violet-400 leading-none uppercase tracking-wider">
              apca
            </span>
          )}
        </div>

        {/* Per-chip contrast mode override */}
        {CONTRAST_RELATIONSHIPS[name] && (
          <div
            className="opacity-0 group-hover:opacity-100 absolute left-1.5 -top-2.5 flex items-center gap-0.5 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {["free", "AA", "AAA"].map((m) => {
              const isOverride = perRoleContrastMode === m;
              const isApca = contrastAlgorithm === "apca";
              return (
                <button
                  key={m}
                  onClick={(e) => {
                    e.stopPropagation();
                    onContrastModeChange(
                      name,
                      perRoleContrastMode === m ? null : m,
                    );
                  }}
                  className={`px-1 py-0.5 rounded text-[6.5px] font-black transition-all border ${
                    isOverride
                      ? m === "AA"
                        ? isApca
                          ? "bg-violet-500 text-white border-violet-500"
                          : "bg-yellow-500 text-white border-yellow-500"
                        : m === "AAA"
                          ? isApca
                            ? "bg-violet-700 text-white border-violet-700"
                            : "bg-green-600 text-white border-green-600"
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

        {/* Copy buttons — FIX 4: added RGB option */}
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
          <button
            onClick={(e) => copy("rgb", e)}
            className="px-1.5 py-0.5 hover:bg-(--brand) rounded text-[8px] font-bold"
          >
            RGB
          </button>
        </div>
        {copied && (
          <div className="absolute inset-0 bg-green-500/15 flex items-center justify-center rounded-lg text-[9px] font-bold text-green-700 pointer-events-none">
            ✓ Copied {copied.toUpperCase()}
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
              const previewColor = scaleForRole[t];

              const previewVal =
                pairedBgColors && pairedBgColors.length > 0
                  ? Math.min(
                      ...pairedBgColors.map(({ color: bgC }) =>
                        getContrastValue(previewColor, bgC, contrastAlgorithm),
                      ),
                    )
                  : Math.max(
                      getContrastValue(
                        previewColor,
                        { l: 1, c: 0, h: 0 },
                        contrastAlgorithm,
                      ),
                      getContrastValue(
                        previewColor,
                        { l: 0, c: 0, h: 0 },
                        contrastAlgorithm,
                      ),
                    );
              const previewContrast = formatContrast(
                previewVal,
                contrastAlgorithm,
              );
              const isCurrent = t === Number(currentToken);
              const previewPasses = minRatio === 0 || previewVal >= minRatio;
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
        <div
          className="absolute right-0 top-full mt-1 w-52 rounded-lg shadow-xl z-50 overflow-hidden pb-1.5"
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            color: "#111827",
          }}
        >
          {hasChanges && (
            <>
              <button
                onClick={() => {
                  onExportDecisions();
                  setOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-[10px] font-semibold flex items-center gap-2"
                style={{ color: "#7c3aed", background: "transparent" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f5f3ff")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: "#7c3aed" }}
                />
                {exporting === "decisions" ? "✓ Copied!" : "Decisions (MD)"}
              </button>
              <div style={{ height: 1, background: "#e5e7eb" }} />
            </>
          )}
          {/* Design tools section */}
          <div className="px-3 pt-2 pb-0.5">
            <span
              className="text-[7.5px] font-black uppercase tracking-widest"
              style={{ color: "#9ca3af" }}
            >
              Design Tools
            </span>
          </div>
          {[
            { key: "figma-tokens", label: "Figma / Tokens Studio" },
            { key: "dtcg", label: "W3C DTCG (.tokens.json)" },
            { key: "style-dictionary", label: "Style Dictionary" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => {
                onExport(key);
                setOpen(false);
              }}
              className="w-full px-3 py-1.5 text-left text-[10px] font-semibold"
              style={{ color: "#111827", background: "transparent" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f3f4f6")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {exporting === key ? "✓ Copied!" : label}
            </button>
          ))}
          <div style={{ height: 1, background: "#e5e7eb", margin: "4px 0" }} />
          {/* Code section */}
          <div className="px-3 pt-1 pb-0.5">
            <span
              className="text-[7.5px] font-black uppercase tracking-widest"
              style={{ color: "#9ca3af" }}
            >
              Code
            </span>
          </div>
          {[
            { key: "css", label: "CSS Variables" },
            { key: "css-dark", label: "CSS + Dark Mode" },
            { key: "tailwind", label: "Tailwind Config" },
            { key: "json", label: "JSON (hex)" },
            { key: "json-rgb", label: "JSON (rgb)" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => {
                onExport(key);
                setOpen(false);
              }}
              className="w-full px-3 py-1.5 text-left text-[10px] font-semibold"
              style={{ color: "#111827", background: "transparent" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f3f4f6")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {exporting === key ? "✓ Copied!" : label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Lightweight read-only roles panel for split view
function SplitRolesPanel({
  modeOverride,
  currentRoleMap,
  allRoleDefaults,
  customMappingsPerMode,
  shiftAnnotations,
  colorData,
  getActiveColorForMode,
  getTextOnColor,
  contrastAlgorithm,
  contrastMode,
  contrastModePerRole,
  highlightedRolesFromScale,
  hoveredRole,
  setHoveredRole,
  clickedRoles,
  setClickedRoles,
  getScaleForRole,
  getContrastValue,
  meetsThreshold,
  formatContrast,
}) {
  return (
    <div className="grid grid-cols-1 gap-y-5">
      {Object.entries(currentRoleMap).map(([category, roles]) => (
        <div key={category}>
          <h4 className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mb-2 pb-1 border-b border-(--navBorder)">
            {category}
          </h4>
          <div className="space-y-1">
            {roles.map((roleName) => {
              const mappings = customMappingsPerMode[modeOverride] || {};
              const def = allRoleDefaults[roleName];
              if (!def) return null;
              const token = mappings[roleName] || def;
              const color = getActiveColorForMode(roleName, modeOverride);
              const textColor = getTextOnColor(color);
              const annotation = shiftAnnotations[roleName];
              const isHighlighted =
                highlightedRolesFromScale.includes(roleName) ||
                clickedRoles.includes(roleName);

              // Contrast check — uses module-level CONTRAST_RELATIONSHIPS
              const pairedBgRoles = CONTRAST_RELATIONSHIPS[roleName] || [];
              let worstContrast = null;
              let passes = true;
              pairedBgRoles.forEach((bgRole) => {
                const bgColor = getActiveColorForMode(bgRole, modeOverride);
                if (!bgColor) return;
                const ratio = getContrastValue(
                  color,
                  bgColor,
                  contrastAlgorithm,
                );
                if (worstContrast === null || ratio < worstContrast)
                  worstContrast = ratio;
              });
              if (worstContrast !== null) {
                const effectiveMode =
                  contrastModePerRole[roleName] || contrastMode;
                passes = meetsThreshold(
                  worstContrast,
                  effectiveMode,
                  contrastAlgorithm,
                );
              }

              return (
                <div
                  key={roleName}
                  onMouseEnter={() => setHoveredRole(roleName)}
                  onMouseLeave={() => setHoveredRole(null)}
                  onClick={() =>
                    setClickedRoles((prev) =>
                      prev.includes(roleName)
                        ? prev.filter((r) => r !== roleName)
                        : [...prev, roleName],
                    )
                  }
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all ${
                    isHighlighted
                      ? "ring-2 ring-blue-400 bg-blue-50/30"
                      : "hover:bg-foreground/5"
                  }`}
                >
                  <div
                    className="w-7 h-7 rounded-md shrink-0 shadow-sm border border-black/10"
                    style={{ backgroundColor: oklchToCss(color) }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] font-semibold text-foreground/80 truncate">
                      {roleName}
                    </div>
                    <div className="text-[8px] text-foreground/40 font-mono">
                      {token}
                    </div>
                  </div>
                  {worstContrast !== null && (
                    <span
                      className={`text-[8px] font-mono px-1 py-0.5 rounded ${
                        passes
                          ? "text-green-600 bg-green-50"
                          : "text-red-500 bg-red-50"
                      }`}
                    >
                      {formatContrast(worstContrast, contrastAlgorithm)}
                    </span>
                  )}
                  {annotation && (
                    <span className="text-[7px] text-amber-500 font-semibold">
                      ↕
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
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
  // FIX 3: Track which roles were auto-shifted and what the annotation is
  const [shiftAnnotations, setShiftAnnotations] = useState({});
  const [exporting, setExporting] = useState(null);
  const roleBundle = "comprehensive";
  const [hoveredRole, setHoveredRole] = useState(null);
  const [highlightedToken, setHighlightedToken] = useState(null);
  const [clickedRoles, setClickedRoles] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showScales, setShowScales] = useState(false);
  const [viewMode, setViewMode] = useState("single"); // "single" | "split"
  const previewBeforeSplit = useRef(false);
  const [contrastAlgorithm, setContrastAlgorithm] = useState("wcag");
  const [contrastMode, setContrastMode] = useState("free");
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
  // FIX 1: Use neutral scale
  const neutralScale =
    colorMode === "light" ? colorData.neutralScale : colorData.darkNeutralScale;
  const currentRoleMap = ROLE_BUNDLES[roleBundle].categories;

  const activeCustomMappings = customMappingsPerMode[colorMode];
  const activeOriginalMappings = originalMappingsPerMode[colorMode];

  const tokenToRoles = useMemo(
    () => buildTokenToRolesMap(activeCustomMappings),
    [activeCustomMappings],
  );

  // resolveRoleColor: semantic scales already have correct hues, neutrals
  // already have correct chroma. This is now a simple null-guard identity.
  const resolveRoleColor = (role, baseColor) => {
    if (!baseColor) return null;
    return baseColor;
  };

  const allRoleDefaults = useMemo(
    () =>
      Object.values(roleTokenMap).reduce((acc, r) => ({ ...acc, ...r }), {}),
    [],
  );

  // Get worst-case bg color across all paired backgrounds for a role.
  const getWorstCaseBgColor = useCallback(
    (fgRole, mappings) => {
      const bgRoles = CONTRAST_RELATIONSHIPS[fgRole];
      if (!bgRoles) return null;
      const mode = colorMode;
      let worst = null;
      let worstRatio = Infinity;
      const fgToken = mappings[fgRole] || allRoleDefaults[fgRole];
      const fgScaleRef = getScaleForRole(fgRole, colorData, mode);
      const fgBase = fgScaleRef && fgScaleRef[fgToken];
      if (!fgBase) return null;
      const fgColor = resolveRoleColor(fgRole, fgBase);
      bgRoles.forEach((bgRole) => {
        const bgToken = mappings[bgRole] || allRoleDefaults[bgRole];
        const bgScaleRef = getScaleForRole(bgRole, colorData, mode);
        const bgBase = bgScaleRef && bgScaleRef[bgToken];
        if (!bgBase) return;
        const bgColor = resolveRoleColor(bgRole, bgBase);
        if (!bgColor) return;
        const ratio = getContrastRatio(fgColor, bgColor);
        if (ratio < worstRatio) {
          worstRatio = ratio;
          worst = bgColor;
        }
      });
      return worst;
    },
    [colorMode, colorData, allRoleDefaults],
  );

  const enforceAllContrast = useCallback(
    (mappings, modeOverride, globalMode, perRoleMode, changedByUser = null) => {
      const getColorForRole = (role, m) => {
        const token = m[role] || allRoleDefaults[role];
        const scaleRef = getScaleForRole(role, colorData, modeOverride);
        if (!scaleRef || !scaleRef[token]) return null;
        return resolveRoleColor(role, scaleRef[token]);
      };

      const enforced = { ...mappings };
      const newAnnotations = {};
      const thresholds =
        contrastAlgorithm === "apca" ? APCA_THRESHOLDS : WCAG_RATIOS;

      Object.entries(CONTRAST_RELATIONSHIPS).forEach(([fgRole, bgRoles]) => {
        if (fgRole === changedByUser) return;
        const roleMode = perRoleMode[fgRole] || globalMode;
        const minRatio = thresholds[roleMode] || 0;
        if (minRatio === 0) return;

        let worstBgColor = null;
        let worstVal = Infinity;
        bgRoles.forEach((bgRole) => {
          const c = getColorForRole(bgRole, enforced);
          if (!c) return;
          const fgToken = enforced[fgRole] || allRoleDefaults[fgRole];
          const fgScaleRef = getScaleForRole(fgRole, colorData, modeOverride);
          const fgBase = fgScaleRef && fgScaleRef[fgToken];
          if (!fgBase) return;
          const fgColor = resolveRoleColor(fgRole, fgBase);
          const val = getContrastValue(fgColor, c, contrastAlgorithm);
          if (val < worstVal) {
            worstVal = val;
            worstBgColor = c;
          }
        });
        if (!worstBgColor) return;

        const currentFgToken = enforced[fgRole] || allRoleDefaults[fgRole];
        const fgScaleRef = getScaleForRole(fgRole, colorData, modeOverride);
        if (!fgScaleRef) return;

        const newFgToken = findCompliantToken(
          fgRole,
          currentFgToken,
          fgScaleRef,
          worstBgColor,
          minRatio,
          resolveRoleColor,
          contrastAlgorithm,
        );

        if (newFgToken !== null) {
          newAnnotations[fgRole] = {
            from: currentFgToken,
            to: newFgToken,
            mode: roleMode,
          };
          enforced[fgRole] = newFgToken;
        }
      });

      return { enforced, annotations: newAnnotations };
    },
    [allRoleDefaults, colorData, contrastAlgorithm],
  );

  const handleTokenChange = (roleName, newToken, explicitMode) => {
    const targetMode = explicitMode || colorMode;

    setCustomMappingsPerMode((prev) => {
      const modeMap = prev[targetMode];
      const origMap = originalMappingsPerMode[targetMode];

      if (!origMap[roleName]) {
        setOriginalMappingsPerMode((p) => ({
          ...p,
          [targetMode]: {
            ...p[targetMode],
            [roleName]: allRoleDefaults[roleName],
          },
        }));
      }

      const withChange = { ...modeMap, [roleName]: newToken };

      const { enforced, annotations } = enforceAllContrast(
        withChange,
        targetMode,
        contrastMode,
        contrastModePerRole,
        roleName,
      );

      // Save originals for auto-adjusted roles
      Object.keys(enforced).forEach((role) => {
        if (
          role !== roleName &&
          enforced[role] !== (modeMap[role] || allRoleDefaults[role])
        ) {
          if (!origMap[role]) {
            setOriginalMappingsPerMode((p) => ({
              ...p,
              [targetMode]: { ...p[targetMode], [role]: allRoleDefaults[role] },
            }));
          }
        }
      });

      // FIX 3: Update annotations
      setShiftAnnotations((prev) => {
        const next = { ...prev, ...annotations };
        delete next[roleName];
        return next;
      });

      return { ...prev, [targetMode]: enforced };
    });
  };

  useEffect(() => {
    if (contrastMode === "free") {
      setShiftAnnotations({});
      return;
    }

    setCustomMappingsPerMode((prev) => {
      const modeMap = prev[colorMode];
      const { enforced, annotations } = enforceAllContrast(
        modeMap,
        colorMode,
        contrastMode,
        contrastModePerRole,
        null,
      );

      if (JSON.stringify(enforced) === JSON.stringify(modeMap)) return prev;

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

      setShiftAnnotations(annotations);
      return { ...prev, [colorMode]: enforced };
    });
  }, [
    contrastMode,
    contrastModePerRole,
    colorMode,
    colorData,
    contrastAlgorithm,
  ]);

  const getActiveColor = useCallback(
    (role) => {
      const def = allRoleDefaults[role];
      const token = activeCustomMappings[role] || def;
      const scaleRef = getScaleForRole(role, colorData, colorMode);
      const baseColor = scaleRef && scaleRef[token];
      if (!baseColor) return colorData.scale[500];
      return baseColor;
    },
    [activeCustomMappings, allRoleDefaults, colorData, colorMode],
  );

  // Split-view helper: resolve a role color for a specific mode.
  const getActiveColorForMode = useCallback(
    (role, modeOverride) => {
      const def = allRoleDefaults[role];
      const mappings = customMappingsPerMode[modeOverride] || {};
      const token = mappings[role] || def;
      const scaleRef = getScaleForRole(role, colorData, modeOverride);
      const baseColor = scaleRef && scaleRef[token];
      if (!baseColor) return colorData.scale[500];
      return baseColor;
    },
    [customMappingsPerMode, allRoleDefaults, colorData],
  );

  const getTextOnColor = (bgColor) => {
    const white = { l: 1, c: 0, h: 0 };
    const black = { l: 0, c: 0, h: 0 };
    const rW = getContrastRatio(bgColor, white);
    const rB = getContrastRatio(bgColor, black);
    return rW >= rB ? "white" : "black";
  };

  // Resolve every role to its final color for a given mode.
  const buildColorMap = (modeOverride) => {
    const mappings = customMappingsPerMode[modeOverride] || {};
    const bundleRoles = Object.values(currentRoleMap).flat();
    const result = {};
    bundleRoles.forEach((role) => {
      const def = allRoleDefaults[role];
      if (!def) return;
      const scaleRef = getScaleForRole(role, colorData, modeOverride);
      if (!scaleRef) return;
      const token = mappings[role] || def;
      const baseColor = scaleRef[token];
      if (!baseColor) return;
      result[role] = baseColor;
    });
    return result;
  };

  // Build alpha token map: { "background/10": { l, c, h, a: 0.10 }, ... }
  const buildAlphaTokens = (modeOverride) => {
    const result = {};
    ALPHA_ROLES.forEach((role) => {
      const scaleRef = getScaleForRole(role, colorData, modeOverride);
      const mappings = customMappingsPerMode[modeOverride] || {};
      const def = allRoleDefaults[role];
      if (!def || !scaleRef) return;
      const token = mappings[role] || def;
      const baseColor = scaleRef[token];
      if (!baseColor) return;
      ALPHA_LEVELS.forEach((pct) => {
        result[role + "/" + pct] = { ...baseColor, a: pct / 100 };
      });
    });
    return result;
  };

  const exportDecisions = () => {
    const markdown = `# Design System Color Decisions\n\n**Palette**: #${selectedIdx + 1}\n**Mode**: ${colorMode}\n**Bundle**: ${ROLE_BUNDLES[roleBundle].name}\n**Light Mode Ceiling**: ${(lightModeCeiling * 100).toFixed(0)}%\n**Dark Mode Floor**: ${(darkModeFloor * 100).toFixed(0)}%\n\n## Customizations (${Object.keys(activeCustomMappings).length})\n\n${Object.entries(
      activeCustomMappings,
    )
      .map(([role, token]) => {
        const annotation = shiftAnnotations[role];
        const autoNote = annotation
          ? ` *(auto-shifted ${annotation.from}→${annotation.to} for ${annotation.mode})*`
          : "";
        return `### ${role}${autoNote}\n- **Token**: ${activeOriginalMappings[role]} → **${token}**\n- **Color**: ${oklchToHex(getActiveColor(role))}\n`;
      })
      .join("\n")}`;
    navigator.clipboard.writeText(markdown);
    setExporting("decisions");
    setTimeout(() => setExporting(null), 2000);
  };

  // FIX 4: Export now outputs both oklch and rgb fallbacks in CSS
  const exportData = (type) => {
    const buildConfig = (modeOverride, includeRgb = false) => {
      const colorMap = buildColorMap(modeOverride);
      const config = {};
      Object.entries(colorMap).forEach(([role, color]) => {
        if (includeRgb) {
          const { r, g, b } = oklchToRgbValues(color);
          const toInt = (v) => Math.round(Math.max(0, Math.min(1, v)) * 255);
          config[role] =
            "rgb(" + toInt(r) + ", " + toInt(g) + ", " + toInt(b) + ")";
        } else {
          config[role] = oklchToHex(color);
        }
      });
      return config;
    };

    const lightConfig = buildConfig("light");
    const darkConfig = buildConfig("dark");
    const lightConfigRgb = buildConfig("light", true);
    const darkConfigRgb = buildConfig("dark", true);
    const activeConfig = colorMode === "light" ? lightConfig : darkConfig;

    let output = "";

    if (type === "tailwind") {
      output =
        "module.exports = {\n  theme: {\n    extend: {\n      colors: {\n        light: " +
        JSON.stringify(lightConfig, null, 8) +
        ",\n        dark: " +
        JSON.stringify(darkConfig, null, 8) +
        "\n      }\n    }\n  }\n}";
    } else if (type === "css") {
      const colorMap = buildColorMap(colorMode);
      const vars = Object.entries(colorMap)
        .map(([role, color]) => {
          const { oklch: oklchVal, rgb: rgbVal } = oklchWithFallback(color);
          return (
            "  /* " +
            role +
            " */\n  --color-" +
            role +
            "-fallback: " +
            rgbVal +
            ";\n  --color-" +
            role +
            ": " +
            oklchVal +
            ";"
          );
        })
        .join("\n");
      output = ":root {\n" + vars + "\n}";
    } else if (type === "css-dark") {
      const buildVars = (modeOverride) => {
        const colorMap = buildColorMap(modeOverride);
        const alphaTokens = buildAlphaTokens(modeOverride);
        const base = Object.entries(colorMap)
          .map(([role, color]) => {
            const { oklch: oklchVal, rgb: rgbVal } = oklchWithFallback(color);
            return (
              "  --color-" +
              role +
              "-fallback: " +
              rgbVal +
              ";\n  --color-" +
              role +
              ": " +
              oklchVal +
              ";"
            );
          })
          .join("\n");
        const alpha = Object.entries(alphaTokens)
          .map(([key, color]) => {
            return (
              "  --color-" +
              key.replace("/", "-") +
              ": " +
              oklchToCss(color) +
              ";"
            );
          })
          .join("\n");
        return base + "\n\n  /* Alpha tokens */\n" + alpha;
      };
      const lightVars = buildVars("light");
      const darkVars = buildVars("dark");
      output =
        ":root {\n" +
        lightVars +
        "\n}\n\n@media (prefers-color-scheme: dark) {\n  :root {\n" +
        darkVars +
        "\n  }\n}";
    } else if (type === "figma-tokens") {
      // Figma Tokens Studio format: two token sets (light + dark) + $themes + $metadata
      const buildFigmaSet = (modeOverride) => {
        const colorMap = buildColorMap(modeOverride);
        const alphaMap = buildAlphaTokens(modeOverride);
        const tokens = {};
        // Group by category
        Object.entries(currentRoleMap).forEach(([category, roles]) => {
          tokens[category] = {};
          roles.forEach((role) => {
            if (!colorMap[role]) return;
            tokens[category][role] = {
              value: oklchToHex(colorMap[role]),
              type: "color",
              description: role,
            };
          });
        });
        // Alpha tokens as separate group
        tokens["Alpha"] = {};
        Object.entries(alphaMap).forEach(([key, color]) => {
          const [role, pct] = key.split("/");
          if (!tokens["Alpha"][role]) tokens["Alpha"][role] = {};
          tokens["Alpha"][role][pct] = {
            value: oklchToCss(color),
            type: "color",
            description: role + " at " + pct + "% opacity",
          };
        });
        return tokens;
      };
      const figmaOutput = {
        light: buildFigmaSet("light"),
        dark: buildFigmaSet("dark"),
        $themes: [
          {
            id: "light",
            name: "Light",
            selectedTokenSets: { light: "enabled" },
            $figmaStyleReferences: {},
          },
          {
            id: "dark",
            name: "Dark",
            selectedTokenSets: { dark: "enabled" },
            $figmaStyleReferences: {},
          },
        ],
        $metadata: { tokenSetOrder: ["light", "dark"] },
      };
      output = JSON.stringify(figmaOutput, null, 2);
    } else if (type === "dtcg") {
      // W3C Design Token Community Group format (.tokens.json)
      // https://tr.designtokens.org/format/
      const buildDtcgMode = (modeOverride) => {
        const colorMap = buildColorMap(modeOverride);
        const alphaMap = buildAlphaTokens(modeOverride);
        const tokens = {};
        Object.entries(currentRoleMap).forEach(([category, roles]) => {
          tokens[category] = { $type: "color" };
          roles.forEach((role) => {
            if (!colorMap[role]) return;
            const color = colorMap[role];
            const hex = oklchToHex(color);
            tokens[category][role] = {
              $value: oklchToCss(color),
              $type: "color",
              $description: role,
              $extensions: {
                "com.figma": { hiddenFromPublishing: false },
                fallback: hex,
              },
            };
          });
        });
        // Alpha tokens
        tokens["alpha"] = { $type: "color" };
        Object.entries(alphaMap).forEach(([key, color]) => {
          const tokenKey = key.replace("/", "-");
          tokens["alpha"][tokenKey] = {
            $value: oklchToCss(color),
            $type: "color",
            $description: key,
          };
        });
        return tokens;
      };
      const dtcgOutput = {
        $schema: "https://tr.designtokens.org/format/",
        $metadata: { generator: "palette-expander", version: "1.0" },
        modes: {
          light: buildDtcgMode("light"),
          dark: buildDtcgMode("dark"),
        },
      };
      output = JSON.stringify(dtcgOutput, null, 2);
    } else if (type === "style-dictionary") {
      // Style Dictionary v3 source format.
      // Structure: { color: { primitive: { blue: { 100: {value, type} } }, semantic: { category: { role: {value, type, attributes} } } } }
      // Consumers drop this into sd.source[], define their own platforms config, then run sd.buildAllPlatforms().

      // Primitive layer: raw scale steps for every scale in the palette
      const buildPrimitives = (modeOverride) => {
        const primitives = {};
        // Brand scale
        const brandScale =
          modeOverride === "light" ? colorData.scale : colorData.darkScale;
        primitives["brand"] = {};
        Object.entries(brandScale).forEach(([step, color]) => {
          primitives["brand"][step] = {
            value: oklchToHex(color),
            type: "color",
          };
        });
        // Neutral scale
        const nScale =
          modeOverride === "light"
            ? colorData.neutralScale
            : colorData.darkNeutralScale;
        if (nScale) {
          primitives["neutral"] = {};
          Object.entries(nScale).forEach(([step, color]) => {
            primitives["neutral"][step] = {
              value: oklchToHex(color),
              type: "color",
            };
          });
        }
        // Semantic scales
        if (colorData.semanticScales) {
          Object.entries(colorData.semanticScales).forEach(
            ([key, semScale]) => {
              const activeScale =
                modeOverride === "light"
                  ? semScale
                  : colorData.darkSemanticScales[key];
              primitives[key] = {};
              Object.entries(activeScale).forEach(([step, color]) => {
                primitives[key][step] = {
                  value: oklchToHex(color),
                  type: "color",
                };
              });
            },
          );
        }
        return primitives;
      };

      // Semantic layer: role → resolved token value, with attributes for category + mode
      const buildSemanticLayer = (modeOverride) => {
        const colorMap = buildColorMap(modeOverride);
        const mappings = customMappingsPerMode[modeOverride] || {};
        const semantic = {};
        Object.entries(currentRoleMap).forEach(([category, roles]) => {
          const catKey = category.toLowerCase();
          semantic[catKey] = {};
          roles.forEach((role) => {
            if (!colorMap[role]) return;
            const token = mappings[role] || allRoleDefaults[role];
            semantic[catKey][role] = {
              value: oklchToHex(colorMap[role]),
              type: "color",
              attributes: {
                category: catKey,
                role,
                mode: modeOverride,
                step: token,
              },
            };
          });
        });
        return semantic;
      };

      // Alpha layer: semi-transparent tokens keyed as role-N
      const buildAlphaLayer = (modeOverride) => {
        const alphaMap = buildAlphaTokens(modeOverride);
        const alpha = {};
        Object.entries(alphaMap).forEach(([key, color]) => {
          const [role, pct] = key.split("/");
          if (!alpha[role]) alpha[role] = {};
          alpha[role][pct] = {
            value: oklchToCss(color),
            type: "color",
            attributes: { category: "alpha", role, opacity: Number(pct) / 100 },
          };
        });
        return alpha;
      };

      // Style Dictionary expects a single token tree; we nest light+dark under a "modes" key
      // so consumers can use sd-transforms or style-dictionary-utils to split them.
      const sdOutput = {
        color: {
          primitive: {
            light: buildPrimitives("light"),
            dark: buildPrimitives("dark"),
          },
          semantic: {
            light: buildSemanticLayer("light"),
            dark: buildSemanticLayer("dark"),
          },
          alpha: {
            light: buildAlphaLayer("light"),
            dark: buildAlphaLayer("dark"),
          },
        },
        // Minimal config hint so consumers know what they're looking at
        _meta: {
          generator: "palette-expander",
          sdVersion: "3.x",
          usage:
            "Drop into sd.source[]. Define your own platforms config. Run sd.buildAllPlatforms().",
          primitiveRef:
            "color.primitive.{light|dark}.{brand|neutral|success|...}.{100-900}",
          semanticRef: "color.semantic.{light|dark}.{category}.{role}",
        },
      };
      output = JSON.stringify(sdOutput, null, 2);
    } else if (type === "json-rgb") {
      output = JSON.stringify(
        colorMode === "light" ? lightConfigRgb : darkConfigRgb,
        null,
        2,
      );
    } else {
      output = JSON.stringify(activeConfig, null, 2);
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
    <div className="flex flex-col h-full overflow-hidden bg-background border border-(--navBorder) rounded-xl relative">
      {/* ── TOOLBAR ── */}
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

        {/* Light / Dark / Split toggle */}
        <div className="flex p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg border border-(--navBorder) shrink-0">
          <button
            onClick={() => {
              setViewMode("single");
              setColorMode("light");
              setShowPreview(previewBeforeSplit.current);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
              viewMode === "single" && colorMode === "light"
                ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            ☀️ Light
          </button>
          <button
            onClick={() => {
              setViewMode("single");
              setColorMode("dark");
              setShowPreview(previewBeforeSplit.current);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
              viewMode === "single" && colorMode === "dark"
                ? "bg-gray-700 text-white shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            🌙 Dark
          </button>
          <button
            onClick={() => {
              if (viewMode === "split") {
                setViewMode("single");
                setShowPreview(previewBeforeSplit.current);
              } else {
                previewBeforeSplit.current = showPreview;
                setShowPreview(false);
                setViewMode("split");
              }
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
              viewMode === "split"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
            title="Side-by-side light + dark"
          >
            ☀️🌙
          </button>
        </div>

        {/* Ceiling / Floor slider */}
        {viewMode === "split" ? (
          // In split mode show both sliders
          <>
            <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg border border-(--navBorder) shrink-0">
              <span className="text-[9px] font-semibold text-foreground/50">
                Ceil
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
                className="w-12 h-1 cursor-pointer accent-(--brand)"
              />
              <span className="text-[9px] font-mono font-bold text-(--brand) w-6">
                {(lightModeCeiling * 100).toFixed(0)}%
              </span>
            </div>
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
                className="w-12 h-1 cursor-pointer accent-(--brand)"
              />
              <span className="text-[9px] font-mono font-bold text-(--brand) w-6">
                {(darkModeFloor * 100).toFixed(0)}%
              </span>
            </div>
          </>
        ) : colorMode === "light" ? (
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

        <div className="flex-1" />

        {/* Contrast controls: algorithm toggle + threshold */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[9px] font-semibold text-foreground/40 uppercase tracking-wider">
            Contrast
          </span>
          {/* Algorithm toggle */}
          <div className="flex p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg border border-(--navBorder)">
            {["wcag", "apca"].map((algo) => (
              <button
                key={algo}
                onClick={() => setContrastAlgorithm(algo)}
                title={
                  algo === "wcag"
                    ? "WCAG 2.x (current standard)"
                    : "APCA — Advanced Perceptual Contrast Algorithm (WCAG 3.0 basis)"
                }
                className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all uppercase tracking-wider ${
                  contrastAlgorithm === algo
                    ? algo === "apca"
                      ? "bg-violet-600 text-white shadow-sm"
                      : "bg-background text-foreground shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {algo}
              </button>
            ))}
          </div>
          {/* Threshold toggle */}
          <div className="flex p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg border border-(--navBorder)">
            {["free", "AA", "AAA"].map((mode) => (
              <button
                key={mode}
                onClick={() => setContrastMode(mode)}
                title={
                  contrastAlgorithm === "apca"
                    ? mode === "free"
                      ? "No enforcement"
                      : mode === "AA"
                        ? "APCA Lc 60 (body text)"
                        : "APCA Lc 75 (enhanced)"
                    : mode === "free"
                      ? "No enforcement"
                      : mode === "AA"
                        ? "WCAG 4.5:1"
                        : "WCAG 7:1"
                }
                className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
                  contrastMode === mode
                    ? mode === "free"
                      ? "bg-background text-foreground shadow-sm"
                      : mode === "AA"
                        ? contrastAlgorithm === "apca"
                          ? "bg-violet-500 text-white shadow-sm"
                          : "bg-yellow-500 text-white shadow-sm"
                        : contrastAlgorithm === "apca"
                          ? "bg-violet-700 text-white shadow-sm"
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

        {hasChanges && (
          <span className="text-[9px] text-blue-500 font-semibold shrink-0">
            {Object.keys(activeCustomMappings).length} override
            {Object.keys(activeCustomMappings).length !== 1 ? "s" : ""}
          </span>
        )}

        <button
          onClick={() => {
            setCustomMappingsPerMode({ light: {}, dark: {} });
            setOriginalMappingsPerMode({ light: {}, dark: {} });
            setContrastModePerRole({});
            setShiftAnnotations({});
          }}
          className="px-2.5 py-1.5 rounded-lg border border-(--navBorder) text-[10px] font-semibold text-foreground/60 hover:text-foreground hover:border-gray-400 transition-all shrink-0"
        >
          Reset
        </button>

        <ExportDropdown
          onExport={exportData}
          hasChanges={hasChanges}
          onExportDecisions={exportDecisions}
          exporting={exporting}
        />

        <button
          onClick={() => setShowPreview((v) => !v)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition-all shrink-0 ${
            showPreview
              ? "bg-blue-600 border-blue-600 text-white shadow-sm"
              : "border-(--navBorder) text-foreground/60 hover:text-foreground hover:border-gray-400"
          }`}
        >
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

        <button
          onClick={() => setShowScales((v) => !v)}
          className={
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition-all shrink-0 " +
            (showScales
              ? "bg-gray-800 border-gray-800 text-white shadow-sm"
              : "border-(--navBorder) text-foreground/60 hover:text-foreground hover:border-gray-400")
          }
          title="View tonal scales"
        >
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
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
          </svg>
          Scales
        </button>
      </div>

      {/* ── MAIN BODY ── */}
      <div className="flex flex-1 min-h-0 bg-background overflow-hidden">
        {viewMode === "split" ? (
          // Split view: light on left, dark on right
          <>
            <div className="flex-1 flex flex-col min-w-0 border-r border-(--navBorder)">
              <div className="px-3 py-1.5 border-b border-amber-300 bg-amber-50 dark:bg-amber-950/30 flex items-center gap-1.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-amber-600">
                  ☀️ Light
                </span>
              </div>
              <div
                ref={rolePanelRef}
                className="flex-1 overflow-y-auto custom-scrollbar px-3 py-3"
              >
                <SplitRolesPanel
                  modeOverride="light"
                  currentRoleMap={currentRoleMap}
                  allRoleDefaults={allRoleDefaults}
                  customMappingsPerMode={customMappingsPerMode}
                  shiftAnnotations={shiftAnnotations}
                  colorData={colorData}
                  getActiveColorForMode={getActiveColorForMode}
                  getTextOnColor={getTextOnColor}
                  contrastAlgorithm={contrastAlgorithm}
                  contrastMode={contrastMode}
                  contrastModePerRole={contrastModePerRole}
                  highlightedRolesFromScale={highlightedRolesFromScale}
                  hoveredRole={hoveredRole}
                  setHoveredRole={setHoveredRole}
                  clickedRoles={clickedRoles}
                  setClickedRoles={setClickedRoles}
                  getScaleForRole={getScaleForRole}
                  getContrastValue={getContrastValue}
                  meetsThreshold={meetsThreshold}
                  formatContrast={formatContrast}
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col min-w-0">
              <div className="px-3 py-1.5 border-b border-indigo-300 bg-indigo-50 dark:bg-indigo-950/30 flex items-center gap-1.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600">
                  🌙 Dark
                </span>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-3">
                <SplitRolesPanel
                  modeOverride="dark"
                  currentRoleMap={currentRoleMap}
                  allRoleDefaults={allRoleDefaults}
                  customMappingsPerMode={customMappingsPerMode}
                  shiftAnnotations={shiftAnnotations}
                  colorData={colorData}
                  getActiveColorForMode={getActiveColorForMode}
                  getTextOnColor={getTextOnColor}
                  contrastAlgorithm={contrastAlgorithm}
                  contrastMode={contrastMode}
                  contrastModePerRole={contrastModePerRole}
                  highlightedRolesFromScale={highlightedRolesFromScale}
                  hoveredRole={hoveredRole}
                  setHoveredRole={setHoveredRole}
                  clickedRoles={clickedRoles}
                  setClickedRoles={setClickedRoles}
                  getScaleForRole={getScaleForRole}
                  getContrastValue={getContrastValue}
                  meetsThreshold={meetsThreshold}
                  formatContrast={formatContrast}
                />
              </div>
            </div>
          </>
        ) : (
          <>
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
                  {Object.entries(currentRoleMap).map(([category, roles]) => (
                    <div
                      key={category}
                      className={showPreview ? "" : "col-span-1"}
                    >
                      <h4 className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mb-2 pb-1 border-b border-(--navBorder)">
                        {category}
                        {category === "Neutrals" && (
                          <span className="ml-1.5 text-[6px] font-bold text-purple-400 normal-case tracking-normal border border-purple-300 rounded px-1 py-0.5">
                            independent scale
                          </span>
                        )}
                        {category === "Status" && (
                          <span className="ml-1.5 text-[6px] font-bold text-emerald-500 normal-case tracking-normal border border-emerald-400 rounded px-1 py-0.5">
                            semantic scales
                          </span>
                        )}
                      </h4>
                      <div className="space-y-1.5">
                        {roles.map((roleName) => {
                          const defaultToken = allRoleDefaults[roleName];
                          if (!defaultToken) return null;
                          const isHighlightedByScale =
                            highlightedRolesFromScale.includes(roleName);

                          // FIX 2+6: Build pairedBgColors array with ALL backgrounds for this role
                          const bgRoleNames = CONTRAST_RELATIONSHIPS[roleName];
                          const pairedBgColors = bgRoleNames
                            ? bgRoleNames
                                .map((bgRole) => {
                                  const c = getActiveColor(bgRole);
                                  return c ? { role: bgRole, color: c } : null;
                                })
                                .filter(Boolean)
                            : [];

                          return (
                            <div
                              key={roleName}
                              ref={(el) => {
                                roleChipRefs.current[roleName] = el;
                              }}
                            >
                              <UsageRole
                                name={roleName}
                                scaleForRole={getScaleForRole(
                                  roleName,
                                  colorData,
                                  colorMode,
                                )}
                                contrastAlgorithm={contrastAlgorithm}
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
                                pairedBgColors={pairedBgColors}
                                shiftAnnotation={
                                  shiftAnnotations[roleName] || null
                                }
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

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
          </>
        )}{" "}
        {/* end split/single conditional */}
      </div>

      {/* Floating tonal scale panel */}
      {showScales && (
        <>
          <div
            className="absolute inset-0 z-40"
            onClick={() => setShowScales(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 z-50 bg-background border-t border-(--navBorder) shadow-2xl rounded-b-xl px-3 py-3">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-foreground/50">
                  Tonal Scales
                </h4>
                <span className="text-[8px] text-foreground/30">
                  {highlightedToken
                    ? "Step " +
                      highlightedToken +
                      " · " +
                      (tokenToRoles[highlightedToken] || []).length +
                      " role(s)"
                    : "Click a step to highlight roles"}
                </span>
              </div>
              <button
                onClick={() => setShowScales(false)}
                className="text-foreground/30 hover:text-foreground/70 transition-colors p-0.5 rounded"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[7px] font-bold text-foreground/30 w-14 shrink-0">
                  Brand
                </span>
                <div className="flex flex-1 h-9 rounded-lg overflow-hidden border border-(--navBorder)">
                  {Object.entries(scale).map(([token, color]) => {
                    const isActive = highlightedToken === Number(token);
                    const rolesUsingThis = tokenToRoles[Number(token)] || [];
                    return (
                      <button
                        key={token}
                        className={
                          "flex-1 h-full flex flex-col items-center justify-center transition-all " +
                          (isActive
                            ? "ring-2 ring-inset ring-white/60 z-10 brightness-110"
                            : "hover:brightness-90")
                        }
                        style={{ backgroundColor: oklchToCss(color) }}
                        onClick={() => {
                          const newToken = isActive ? null : Number(token);
                          setHighlightedToken(newToken);
                          setShowScales(false);
                          if (newToken !== null) {
                            const firstRole = (tokenToRoles[newToken] || [])[0];
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
                        title={
                          "Step " +
                          token +
                          " · " +
                          rolesUsingThis.length +
                          " role(s)"
                        }
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
                            {"×"}
                            {rolesUsingThis.length}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              {neutralScale && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[7px] font-bold text-purple-400 w-14 shrink-0">
                    Neutral
                  </span>
                  <div className="flex flex-1 h-5 rounded overflow-hidden border border-dashed border-purple-300">
                    {Object.entries(neutralScale).map(([token, color]) => (
                      <div
                        key={token}
                        className="flex-1 h-full"
                        style={{ backgroundColor: oklchToCss(color) }}
                        title={"Neutral " + token}
                      />
                    ))}
                  </div>
                </div>
              )}
              {colorData.semanticScales &&
                Object.entries(colorData.semanticScales).map(
                  ([key, semScale]) => {
                    const labelCls = {
                      success: "text-emerald-600",
                      warning: "text-amber-600",
                      error: "text-red-500",
                      info: "text-blue-500",
                    };
                    const borderCls = {
                      success: "border-emerald-300",
                      warning: "border-amber-300",
                      error: "border-red-300",
                      info: "border-blue-300",
                    };
                    const activeSemScale =
                      colorMode === "light"
                        ? semScale
                        : colorData.darkSemanticScales[key];
                    return (
                      <div key={key} className="flex items-center gap-1.5">
                        <span
                          className={
                            "text-[7px] font-bold w-14 shrink-0 capitalize " +
                            (labelCls[key] || "text-gray-400")
                          }
                        >
                          {key}
                        </span>
                        <div
                          className={
                            "flex flex-1 h-5 rounded overflow-hidden border border-dashed " +
                            (borderCls[key] || "border-gray-300")
                          }
                        >
                          {Object.entries(activeSemScale).map(
                            ([token, color]) => (
                              <div
                                key={token}
                                className="flex-1 h-full"
                                style={{ backgroundColor: oklchToCss(color) }}
                                title={key + " " + token}
                              />
                            ),
                          )}
                        </div>
                      </div>
                    );
                  },
                )}

              {/* Alpha token grid */}
              <div className="mt-1 pt-2 border-t border-(--navBorder)">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[7px] font-black uppercase tracking-widest text-foreground/40">
                    Alpha tokens
                  </span>
                  <span className="text-[6.5px] text-foreground/25">
                    --color-role-N in CSS exports
                  </span>
                </div>
                <div className="space-y-1">
                  {ALPHA_ROLES.map((role) => {
                    const baseColor = getActiveColor(role);
                    if (!baseColor) return null;
                    return (
                      <div key={role} className="flex items-center gap-1.5">
                        <span
                          className="text-[6.5px] font-bold text-foreground/40 w-14 shrink-0 truncate"
                          title={role}
                        >
                          {role
                            .replace("interactive-default", "interactive")
                            .replace("neutral-surface", "neutral-surf")
                            .replace("border-focus", "focus")}
                        </span>
                        <div className="flex gap-0.5 flex-1">
                          {ALPHA_LEVELS.map((pct) => {
                            const alphaColor = { ...baseColor, a: pct / 100 };
                            return (
                              <div
                                key={pct}
                                className="flex-1 h-6 rounded-sm flex items-center justify-center relative overflow-hidden"
                                style={{
                                  backgroundImage:
                                    "repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%)",
                                  backgroundSize: "6px 6px",
                                }}
                                title={role + "/" + pct}
                              >
                                <div
                                  className="absolute inset-0"
                                  style={{
                                    backgroundColor: oklchToCss(alphaColor),
                                  }}
                                />
                                <span
                                  className="relative text-[5.5px] font-black leading-none"
                                  style={{
                                    color:
                                      baseColor.l > 0.5
                                        ? "rgba(0,0,0,0.7)"
                                        : "rgba(255,255,255,0.8)",
                                  }}
                                >
                                  {pct}
                                </span>
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
          </div>
        </>
      )}
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

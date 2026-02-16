import React, { useMemo, useState } from "react";
import { generateExpandedPalette, getContrastRatio } from "./colorexpansion";
import { useColorPaletteContext } from "../ColorContext";

// Role bundle presets
const ROLE_BUNDLES = {
  minimal: {
    name: "Minimal",
    categories: {
      Text: ["text", "text-subtle"],
      Backgrounds: ["background", "surface"],
      Interactive: ["interactive-default", "interactive-hover"],
      Status: ["success", "warning", "error"],
    },
  },
  standard: {
    name: "Standard",
    categories: {
      Text: ["text", "text-subtle", "text-strong"],
      Backgrounds: ["background", "background-subtle", "surface"],
      Borders: ["border", "border-strong"],
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
    },
  },
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

function getContrastText(background) {
  return background.l < 0.5 ? "white" : "black";
}

function ensureContrast(foreground, background, minRatio = 4.5) {
  const ratio = getContrastRatio(foreground, background);
  if (ratio >= minRatio) return foreground;
  const white = { l: 1, c: 0, h: 0 };
  const black = { l: 0, c: 0, h: 0 };
  const whiteBg = getContrastRatio(white, background);
  const blackBg = getContrastRatio(black, background);
  return whiteBg > blackBg ? white : black;
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
  const l_ = l + 0.3963 * a_ + 0.2158 * b_;
  const m_ = l - 0.1055 * a_ - 0.0638 * b_;
  const s_ = l - 0.0894 * a_ - 1.2914 * b_;
  const r = Math.max(
    0,
    Math.min(
      1,
      4.076 * l_ * l_ * l_ - 3.307 * m_ * m_ * m_ + 0.23 * s_ * s_ * s_,
    ),
  );
  const g = Math.max(
    0,
    Math.min(
      1,
      -1.26 * l_ * l_ * l_ + 2.6 * m_ * m_ * m_ - 0.34 * s_ * s_ * s_,
    ),
  );
  const b = Math.max(
    0,
    Math.min(
      1,
      -0.004 * l_ * l_ * l_ - 0.7 * m_ * m_ * m_ + 1.7 * s_ * s_ * s_,
    ),
  );
  const toHex = (x) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

// Compact UsageRole component with fixed UI
function UsageRole({ name, scale, currentToken, onTokenChange, oldToken }) {
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
      return { ...baseColor, c: Math.min(baseColor.c, 0.012) };
    return baseColor;
  }, [name, scale, currentToken]);

  const contrastRatio = useMemo(() => {
    const white = { l: 1, c: 0, h: 0 };
    const black = { l: 0, c: 0, h: 0 };
    const ratioWhite = getContrastRatio(color, white);
    const ratioBlack = getContrastRatio(color, black);
    return Math.max(ratioWhite, ratioBlack).toFixed(1);
  }, [color]);

  const contrastText = getContrastText(color);
  const isLowContrast = parseFloat(contrastRatio) < 4.5;
  const hasChanged = oldToken && oldToken !== currentToken;

  const tokens = Object.keys(scale)
    .map(Number)
    .sort((a, b) => a - b);
  const currentIndex = tokens.indexOf(Number(currentToken));
  const alternatives = tokens.slice(
    Math.max(0, currentIndex - 1),
    currentIndex + 2,
  );

  const copy = (type, e) => {
    e.stopPropagation();
    const val = type === "hex" ? oklchToHex(color) : oklchToCss(color);
    navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 800);
  };

  return (
    <div className="relative">
      <div
        onClick={() => setIsSelecting(!isSelecting)}
        className={`group relative flex items-center gap-1.5 px-1.5 py-1 rounded text-xs bg-background border cursor-pointer transition-all hover:shadow-sm ${
          isSelecting
            ? "border-blue-500 ring-1 ring-blue-500 shadow-sm z-40"
            : hasChanged
              ? "border-blue-400"
              : "border-(--navBorder) hover:border-muted-foreground"
        }`}
      >
        <div
          className="w-6 h-6 rounded border border-black/10 shrink-0 flex items-center justify-center font-bold text-[7px] shadow-sm"
          style={{ backgroundColor: oklchToCss(color), color: contrastText }}
        >
          {currentToken}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-[8px] leading-tight truncate">
            {name}
          </div>
          <div className="text-[6px] text-gray-400 font-mono truncate">
            {oklchToHex(color)}
          </div>
        </div>
        {isLowContrast && (
          <div className="flex items-center gap-0.5 bg-red-500/15 px-1 py-0.5 rounded shrink-0">
            <span className="text-[6px] font-black text-red-600">
              {contrastRatio}
            </span>
          </div>
        )}
        <div className="opacity-0 group-hover:opacity-100 absolute right-1 top-1/2 -translate-y-1/2 bg-background border border-(--navBorder) flex items-center gap-0.5 px-1 py-0.5 rounded shadow-sm z-10">
          <button
            onClick={(e) => copy("hex", e)}
            className="px-1 py-0.5 hover:bg-(--brand) rounded text-[6px] font-bold"
          >
            HEX
          </button>
          <button
            onClick={(e) => copy("oklch", e)}
            className="px-1 py-0.5 hover:bg-(--brand) rounded text-[6px] font-bold"
          >
            LCH
          </button>
        </div>
        {copied && (
          <div className="absolute inset-0 bg-green-500/15 flex items-center justify-center rounded text-[7px] font-bold text-green-700 pointer-events-none">
            ✓
          </div>
        )}
      </div>
      {isSelecting && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 p-1.5 bg-gray-900 rounded shadow-2xl border border-gray-700">
          <div className="flex gap-1">
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
                : basePreview;
              return (
                <button
                  key={t}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTokenChange(name, t);
                    setIsSelecting(false);
                  }}
                  className={`flex-1 h-7 rounded border flex items-center justify-center text-[7px] font-bold transition-all hover:scale-105 ${
                    t === Number(currentToken)
                      ? "border-white ring-1 ring-white"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: oklchToCss(previewColor),
                    color: getContrastText(previewColor),
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Comprehensive Component Preview
function ComponentPreview({ getActiveColor }) {
  return (
    <div
      className="h-full overflow-y-auto custom-scrollbar p-4 space-y-6"
      style={{ backgroundColor: oklchToCss(getActiveColor("background")) }}
    >
      {/* Navigation */}
      <div
        className="p-3 rounded-lg flex items-center justify-between"
        style={{ backgroundColor: oklchToCss(getActiveColor("surface")) }}
      >
        <div className="flex items-center gap-3">
          <div
            className="font-bold text-[10px]"
            style={{ color: oklchToCss(getActiveColor("text")) }}
          >
            Brand
          </div>
          <nav className="flex gap-2">
            {["Home", "About", "Contact"].map((item, i) => (
              <a
                key={item}
                href="#"
                className="text-[8px] px-2 py-1 rounded"
                style={{
                  color:
                    i === 0
                      ? oklchToCss(getActiveColor("interactive-default"))
                      : oklchToCss(getActiveColor("text-subtle")),
                  backgroundColor:
                    i === 0
                      ? oklchToCss(getActiveColor("background-muted"))
                      : "transparent",
                }}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
        <button
          className="px-2 py-1 rounded text-[8px] font-bold"
          style={{
            backgroundColor: oklchToCss(getActiveColor("interactive-default")),
            color: "white",
          }}
        >
          Sign In
        </button>
      </div>

      {/* Card */}
      <div
        className="p-4 rounded-lg border"
        style={{
          backgroundColor: oklchToCss(getActiveColor("surface")),
          borderColor: oklchToCss(getActiveColor("border")),
        }}
      >
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-8 h-8 rounded flex items-center justify-center"
            style={{ backgroundColor: oklchToCss(getActiveColor("accent")) }}
          >
            <svg
              className="w-4 h-4"
              style={{ color: "white" }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3
              className="text-[11px] font-bold mb-1"
              style={{ color: oklchToCss(getActiveColor("text")) }}
            >
              Card Title
            </h3>
            <p
              className="text-[9px] mb-2"
              style={{ color: oklchToCss(getActiveColor("text-subtle")) }}
            >
              Sample card showing text hierarchy and spacing in your color
              system.
            </p>
          </div>
        </div>
        <div
          className="h-px mb-3"
          style={{ backgroundColor: oklchToCss(getActiveColor("border")) }}
        />
        <div className="flex items-center gap-2">
          <svg
            className="w-3 h-3"
            style={{ color: oklchToCss(getActiveColor("icon-subtle")) }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            />
          </svg>
          <span
            className="text-[8px]"
            style={{ color: oklchToCss(getActiveColor("text-subtle")) }}
          >
            2 hours ago
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-2">
        <button
          className="w-full h-9 rounded font-bold text-[9px] shadow"
          style={{
            backgroundColor: oklchToCss(getActiveColor("interactive-default")),
            color: "white",
          }}
        >
          Primary Action
        </button>
        <button
          className="w-full h-9 rounded font-medium text-[9px] border-2"
          style={{
            backgroundColor: oklchToCss(getActiveColor("background")),
            borderColor: oklchToCss(getActiveColor("border-strong")),
            color: oklchToCss(getActiveColor("text")),
          }}
        >
          Secondary Action
        </button>
      </div>

      {/* Status Messages */}
      <div className="space-y-2">
        {[
          {
            status: "success",
            icon: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
            text: "Success message",
          },
          {
            status: "warning",
            icon: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",
            text: "Warning message",
          },
          {
            status: "error",
            icon: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
            text: "Error message",
          },
        ].map(({ status, icon, text }) => (
          <div
            key={status}
            className="p-2 rounded border text-[8px] font-medium flex items-center gap-2"
            style={{
              backgroundColor: oklchToCss(getActiveColor(`${status}-subtle`)),
              borderColor: oklchToCss(getActiveColor(status)),
              color: oklchToCss(getActiveColor(status)),
            }}
          >
            <svg
              className="w-3 h-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d={icon} />
            </svg>
            <span>{text}</span>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="space-y-2">
        <div>
          <label
            className="block text-[8px] font-bold mb-1"
            style={{ color: oklchToCss(getActiveColor("text-subtle")) }}
          >
            Email
          </label>
          <input
            type="text"
            placeholder="you@example.com"
            className="w-full px-2 py-1.5 text-[9px] rounded border"
            style={{
              backgroundColor: oklchToCss(getActiveColor("background")),
              borderColor: oklchToCss(getActiveColor("border")),
              color: oklchToCss(getActiveColor("text")),
            }}
          />
        </div>
        <div>
          <label
            className="block text-[8px] font-bold mb-1"
            style={{ color: oklchToCss(getActiveColor("text-subtle")) }}
          >
            Select
          </label>
          <select
            className="w-full px-2 py-1.5 text-[9px] rounded border"
            style={{
              backgroundColor: oklchToCss(getActiveColor("background")),
              borderColor: oklchToCss(getActiveColor("border")),
              color: oklchToCss(getActiveColor("text")),
            }}
          >
            <option>Option 1</option>
            <option>Option 2</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="w-3 h-3"
            style={{
              accentColor: oklchToCss(getActiveColor("interactive-default")),
            }}
          />
          <label
            className="text-[8px]"
            style={{ color: oklchToCss(getActiveColor("text")) }}
          >
            I agree to terms
          </label>
        </div>
      </div>

      {/* Data Table */}
      <div
        className="rounded border overflow-hidden"
        style={{ borderColor: oklchToCss(getActiveColor("border")) }}
      >
        <table className="w-full text-[8px]">
          <thead
            style={{ backgroundColor: oklchToCss(getActiveColor("surface")) }}
          >
            <tr>
              <th
                className="p-1.5 text-left font-bold"
                style={{ color: oklchToCss(getActiveColor("text")) }}
              >
                Name
              </th>
              <th
                className="p-1.5 text-left font-bold"
                style={{ color: oklchToCss(getActiveColor("text")) }}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody
            style={{
              backgroundColor: oklchToCss(getActiveColor("background")),
            }}
          >
            <tr
              style={{
                borderTop: `1px solid ${oklchToCss(getActiveColor("border"))}`,
              }}
            >
              <td
                className="p-1.5"
                style={{ color: oklchToCss(getActiveColor("text")) }}
              >
                Project A
              </td>
              <td className="p-1.5">
                <span
                  className="px-1.5 py-0.5 rounded text-[7px] font-bold"
                  style={{
                    backgroundColor: oklchToCss(
                      getActiveColor("success-subtle"),
                    ),
                    color: oklchToCss(getActiveColor("success")),
                  }}
                >
                  Active
                </span>
              </td>
            </tr>
            <tr
              style={{
                borderTop: `1px solid ${oklchToCss(getActiveColor("border"))}`,
              }}
            >
              <td
                className="p-1.5"
                style={{ color: oklchToCss(getActiveColor("text")) }}
              >
                Project B
              </td>
              <td className="p-1.5">
                <span
                  className="px-1.5 py-0.5 rounded text-[7px] font-bold"
                  style={{
                    backgroundColor: oklchToCss(
                      getActiveColor("warning-subtle"),
                    ),
                    color: oklchToCss(getActiveColor("warning")),
                  }}
                >
                  Pending
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <div
        className="p-3 rounded border shadow-lg"
        style={{
          backgroundColor: oklchToCss(getActiveColor("surface")),
          borderColor: oklchToCss(getActiveColor("border")),
        }}
      >
        <h5
          className="text-[10px] font-bold mb-2"
          style={{ color: oklchToCss(getActiveColor("text")) }}
        >
          Confirm Action
        </h5>
        <p
          className="text-[8px] mb-2"
          style={{ color: oklchToCss(getActiveColor("text-subtle")) }}
        >
          Are you sure you want to proceed?
        </p>
        <div className="flex gap-2 justify-end">
          <button
            className="px-2 py-1 rounded text-[8px] font-medium border"
            style={{
              backgroundColor: oklchToCss(getActiveColor("background")),
              borderColor: oklchToCss(getActiveColor("border")),
              color: oklchToCss(getActiveColor("text")),
            }}
          >
            Cancel
          </button>
          <button
            className="px-2 py-1 rounded text-[8px] font-bold"
            style={{
              backgroundColor: oklchToCss(getActiveColor("error")),
              color: "white",
            }}
          >
            Confirm
          </button>
        </div>
      </div>

      {/* Loading States */}
      <div className="flex gap-2">
        <button
          className="flex-1 px-2 py-1.5 rounded text-[8px] font-bold flex items-center justify-center gap-1"
          style={{
            backgroundColor: oklchToCss(getActiveColor("interactive-default")),
            color: "white",
          }}
        >
          <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Loading
        </button>
        <button
          className="flex-1 px-2 py-1.5 rounded text-[8px] font-bold opacity-50 cursor-not-allowed"
          style={{
            backgroundColor: oklchToCss(getActiveColor("interactive-disabled")),
            color: oklchToCss(getActiveColor("text-subtle")),
          }}
        >
          Disabled
        </button>
      </div>
    </div>
  );
}

function ColorDetail({ expanded, selectedIdx, onSelect }) {
  const [colorMode, setColorMode] = useState("light");
  const [customMappings, setCustomMappings] = useState({});
  const [originalMappings, setOriginalMappings] = useState({});
  const [exporting, setExporting] = useState(null);
  const [darkModeFloor, setDarkModeFloor] = useState(0.12);
  const [roleBundle, setRoleBundle] = useState("standard");

  const colorData = expanded[selectedIdx];
  const scale = colorMode === "light" ? colorData.scale : colorData.darkScale;
  const currentRoleMap = ROLE_BUNDLES[roleBundle].categories;

  const handleTokenChange = (roleName, newToken) => {
    if (!originalMappings[roleName]) {
      const originalToken = Object.values(roleTokenMap).reduce(
        (acc, roles) => ({ ...acc, ...roles }),
        {},
      )[roleName];
      setOriginalMappings((prev) => ({ ...prev, [roleName]: originalToken }));
    }
    setCustomMappings((prev) => ({ ...prev, [roleName]: newToken }));
  };

  const getActiveColor = (role) => {
    const allRoles = Object.values(roleTokenMap).reduce(
      (acc, roles) => ({ ...acc, ...roles }),
      {},
    );
    const def = allRoles[role];
    const token = customMappings[role] || def;
    const baseColor = scale[token];

    const statusKey = Object.keys(statusHueMap).find((k) => role.startsWith(k));
    if (statusKey)
      return {
        ...baseColor,
        h: statusHueMap[statusKey],
        c: Math.max(baseColor.c, 0.12),
      };
    if (role.startsWith("neutral"))
      return { ...baseColor, c: Math.min(baseColor.c, 0.012) };
    return baseColor;
  };

  const exportDecisions = () => {
    const decisions = {
      metadata: {
        paletteIndex: selectedIdx + 1,
        colorMode,
        darkModeFloor,
        roleBundle,
        exportDate: new Date().toISOString(),
      },
      customizations: Object.entries(customMappings).map(([role, token]) => ({
        role,
        token,
        originalToken: originalMappings[role],
        color: oklchToHex(getActiveColor(role)),
        reason: "User customization",
      })),
    };

    const markdown = `# Design System Color Decisions\n\n**Palette**: #${selectedIdx + 1}\n**Mode**: ${colorMode}\n**Bundle**: ${ROLE_BUNDLES[roleBundle].name}\n**Dark Mode Floor**: ${(darkModeFloor * 100).toFixed(0)}%\n\n## Customizations (${decisions.customizations.length})\n\n${decisions.customizations.map((c) => `### ${c.role}\n- **Token**: ${c.originalToken} → **${c.token}**\n- **Color**: ${c.color}\n`).join("\n")}`;

    navigator.clipboard.writeText(markdown);
    setExporting("decisions");
    setTimeout(() => setExporting(null), 2000);
  };

  const exportData = (type) => {
    const lightConfig = {};
    const darkConfig = {};
    const allRoles = Object.values(roleTokenMap).reduce(
      (acc, roles) => ({ ...acc, ...roles }),
      {},
    );

    Object.entries(allRoles).forEach(([role, def]) => {
      const token = customMappings[role] || def;
      lightConfig[role] = oklchToHex(colorData.scale[token]);
      darkConfig[role] = oklchToHex(colorData.darkScale[token]);
    });

    let output = "";
    if (type === "tailwind") {
      output = `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n        light: ${JSON.stringify(lightConfig, null, 10)},\n        dark: ${JSON.stringify(darkConfig, null, 10)}\n      }\n    }\n  }\n}`;
    } else if (type === "css") {
      const activeSet = colorMode === "light" ? lightConfig : darkConfig;
      const vars = Object.entries(activeSet)
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

  const hasChanges = Object.keys(customMappings).length > 0;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background border border-(--navBorder) rounded-xl">
      {/* COMPACT HEADER - Everything in one small bar */}
      <div className="p-2 border-b border-(--navBorder) bg-yellow-300 flex items-center justify-between gap-3 flex-wrap">
        {/* Left: Palette chips */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {expanded.map((c, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(idx)}
                className={`w-6 h-6 rounded border-2 transition-all ${
                  selectedIdx === idx
                    ? "border-blue-500 ring-2 ring-blue-500/30 scale-110"
                    : "border-(--navBorder) hover:border-muted-foreground"
                }`}
                style={{ backgroundColor: oklchToCss(c.base) }}
                title={`Palette #${idx + 1}`}
              />
            ))}
          </div>

          {/* Complexity selector */}
          <div className="flex gap-0.5 bg-gray-100 dark:bg-gray-800 p-0.5 rounded ml-2">
            {Object.entries(ROLE_BUNDLES).map(([key, bundle]) => (
              <button
                key={key}
                onClick={() => {
                  setRoleBundle(key);
                  setCustomMappings({});
                  setOriginalMappings({});
                }}
                className={`px-1.5 py-0.5 text-[7px] font-bold uppercase rounded ${
                  roleBundle === key
                    ? "bg-background text-gray-900 dark:text-gray-100 shadow-sm"
                    : "text-gray-500"
                }`}
              >
                {bundle.name}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Palette info + exports */}
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-bold text-foreground/60">
            #{selectedIdx + 1}
          </span>
          <button
            onClick={() => {
              setCustomMappings({});
              setOriginalMappings({});
            }}
            className="text-[7px] px-1.5 py-0.5 rounded border border-(--navBorder) font-bold uppercase"
          >
            Reset
          </button>
          {hasChanges && (
            <button
              onClick={exportDecisions}
              className="text-[7px] px-1.5 py-0.5 rounded bg-purple-500 text-white font-bold uppercase"
            >
              Decisions
            </button>
          )}
          <button
            onClick={() => exportData("json")}
            className="text-[7px] px-1.5 py-0.5 rounded bg-gray-900 text-white font-bold uppercase"
          >
            JSON
          </button>
          <button
            onClick={() => exportData("tailwind")}
            className="text-[7px] px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 font-bold uppercase"
          >
            TW
          </button>
          <button
            onClick={() => exportData("css")}
            className="text-[7px] px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 font-bold uppercase"
          >
            CSS
          </button>
        </div>

        {/* Right: Mode toggle + dark floor */}
        <div className="flex items-center gap-2">
          {colorMode === "dark" && (
            <div className="flex items-center gap-1">
              <span className="text-[7px] font-bold text-foreground/40">
                Floor:
              </span>
              <input
                type="range"
                min="0.08"
                max="0.25"
                step="0.01"
                value={darkModeFloor}
                onChange={(e) => setDarkModeFloor(parseFloat(e.target.value))}
                className="w-12 h-1 cursor-pointer accent-(--brand)"
              />
              <span className="text-[7px] font-mono font-bold text-(--brand) w-6">
                {(darkModeFloor * 100).toFixed(0)}%
              </span>
            </div>
          )}

          <div className="flex gap-0.5 bg-gray-100 dark:bg-gray-800 p-0.5 rounded">
            {["light", "dark"].map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setColorMode(mode);
                  setCustomMappings({});
                  setOriginalMappings({});
                }}
                className={`px-2 py-0.5 text-[8px] font-bold uppercase rounded ${
                  colorMode === mode
                    ? "bg-background text-gray-900 dark:text-gray-100 shadow-sm"
                    : "text-gray-500"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN SPLIT PANEL */}
      <div className="flex flex-1 min-h-0 bg-background overflow-hidden">
        {/* LEFT PANEL: Roles - Narrower at 35% */}
        <div className="w-[35%] border-r border-(--navBorder) flex flex-col min-w-0">
          {/* Role categories - scrollable */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            <div className="space-y-4">
              {Object.entries(currentRoleMap).map(([category, roles]) => {
                const allRoles = Object.values(roleTokenMap).reduce(
                  (acc, r) => ({ ...acc, ...r }),
                  {},
                );
                return (
                  <div key={category}>
                    <h4 className="text-[7px] font-black uppercase tracking-wider text-foreground/40 mb-1.5 pb-0.5 border-b border-(--navBorder)">
                      {category}
                    </h4>
                    <div className="space-y-1">
                      {roles.map((roleName) => {
                        const defaultToken = allRoles[roleName];
                        if (!defaultToken) return null;
                        return (
                          <UsageRole
                            key={roleName}
                            name={roleName}
                            scale={scale}
                            currentToken={
                              customMappings[roleName] || defaultToken
                            }
                            oldToken={originalMappings[roleName]}
                            onTokenChange={handleTokenChange}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Live Component Preview - Wider at 65% */}
        <div className="flex-1 min-w-0 flex flex-col">
          <ComponentPreview getActiveColor={getActiveColor} />
        </div>
      </div>

      {/* BOTTOM: Tonal Scale - Fixed at bottom */}
      <div className="p-3 border-t border-(--navBorder) bg-foreground/[0.01]">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[8px] font-black uppercase tracking-wider text-foreground/40">
            Tonal Scale
          </h4>
          <span className="text-[7px] font-mono text-foreground/30">
            L{(colorData.base.l * 100).toFixed(0)}% C
            {colorData.base.c.toFixed(3)} H{colorData.base.h.toFixed(0)}
          </span>
        </div>
        <div className="flex w-full h-10 rounded overflow-hidden border border-(--navBorder)">
          {Object.entries(scale).map(([token, color]) => (
            <div
              key={token}
              className="flex-1 h-full flex items-center justify-center"
              style={{ backgroundColor: oklchToCss(color) }}
            >
              <span
                style={{ color: getContrastText(color) }}
                className="text-[8px] font-black"
              >
                {token}
              </span>
            </div>
          ))}
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

  const expanded = useMemo(() => {
    try {
      if (!palette || palette.length === 0)
        throw new Error("No colors in palette.");
      return generateExpandedPalette(palette, { darkModeFloor });
    } catch (err) {
      setError(err.message);
      return [];
    }
  }, [palette, darkModeFloor]);

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
        />
      )}
    </div>
  );
}

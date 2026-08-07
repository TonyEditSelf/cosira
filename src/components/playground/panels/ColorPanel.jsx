// /components/playground/panels/ColorPanel.jsx
"use client";

import { useState, useCallback } from "react";
import {
  usePlaygroundStore,
  useSelectedElement,
} from "@/store/playgroundStore";
import { Section, Empty } from "./TypographyPanel";
import { Pipette } from "lucide-react";

// Parse oklch string → { l, c, h, a }
function parseOklch(str = "") {
  const m = str.match(
    /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)/,
  );
  if (!m) return { l: 0.5, c: 0.1, h: 0, a: 1 };
  return { l: +m[1], c: +m[2], h: +m[3], a: m[4] !== undefined ? +m[4] : 1 };
}

function toOklch({ l, c, h, a }) {
  if (a < 1)
    return `oklch(${l.toFixed(3)} ${c.toFixed(4)} ${h.toFixed(2)} / ${a.toFixed(2)})`;
  return `oklch(${l.toFixed(3)} ${c.toFixed(4)} ${h.toFixed(2)})`;
}

// ─── OKLCH Picker ─────────────────────────────────────────────────────────────
function OklchPicker({ value, onChange }) {
  const { l, c, h, a } = parseOklch(value);

  const upd = (key, val) => {
    const next = { l, c, h, a, [key]: val };
    onChange(toOklch(next));
  };

  const sliders = [
    {
      key: "l",
      label: "Lightness",
      min: 0,
      max: 1,
      step: 0.001,
      val: l,
      unit: "",
    },
    {
      key: "c",
      label: "Chroma",
      min: 0,
      max: 0.37,
      step: 0.001,
      val: c,
      unit: "",
    },
    { key: "h", label: "Hue", min: 0, max: 360, step: 0.5, val: h, unit: "°" },
    {
      key: "a",
      label: "Opacity",
      min: 0,
      max: 1,
      step: 0.01,
      val: a,
      unit: "",
    },
  ];

  // Hue gradient
  const hueGrad =
    "linear-gradient(to right," +
    Array.from({ length: 13 }, (_, i) => `oklch(0.6 0.2 ${i * 30})`).join(",") +
    ")";

  const gradients = {
    l: `linear-gradient(to right, oklch(0 ${c.toFixed(3)} ${h}) , oklch(1 ${c.toFixed(3)} ${h}))`,
    c: `linear-gradient(to right, oklch(${l.toFixed(3)} 0 ${h}), oklch(${l.toFixed(3)} 0.37 ${h}))`,
    h: hueGrad,
    a: `linear-gradient(to right, oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h} / 0), oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h}))`,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Preview swatch */}
      <div
        style={{
          height: 36,
          borderRadius: "var(--radius)",
          background: value,
          border: "1px solid var(--border)",
        }}
      />

      {sliders.map(({ key, label, min, max, step, val, unit }) => (
        <div
          key={key}
          style={{ display: "flex", flexDirection: "column", gap: 4 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span
              style={{
                fontSize: 10,
                color: "var(--muted-foreground)",
                letterSpacing: "0.04em",
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontSize: 10,
                color: "var(--foreground)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {val.toFixed(key === "h" ? 0 : 3)}
              {unit}
            </span>
          </div>
          <div
            style={{
              position: "relative",
              height: 12,
              borderRadius: 6,
              background: gradients[key],
              border: "1px solid var(--border)",
            }}
          >
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={val}
              onChange={(e) => upd(key, Number(e.target.value))}
              style={s.rangeInput}
            />
          </div>
        </div>
      ))}

      {/* Raw string */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...s.textInput,
          fontFamily: "ui-monospace, monospace",
          fontSize: 11,
        }}
        spellCheck={false}
      />
    </div>
  );
}

// ─── Color Panel ──────────────────────────────────────────────────────────────
export default function ColorPanel() {
  const el = useSelectedElement();
  const updateElement = usePlaygroundStore((s) => s.updateElement);
  const palette = usePlaygroundStore((s) => s.palette);
  const [target, setTarget] = useState("color"); // 'color' | 'backgroundColor'

  if (!el) return <Empty label="Select an element to edit colors" />;

  const upd = (key, val) => updateElement(el.id, { [key]: val });
  const currentVal = el[target] ?? "oklch(0 0 0)";

  const noText = ["image", "divider"].includes(el.type);
  const noBg = ["divider"].includes(el.type);

  return (
    <div style={s.panel}>
      {/* Target selector */}
      <Section label="EDIT">
        <div style={s.btnGroup}>
          {!noText && (
            <button
              style={{
                ...s.segBtn,
                flex: 1,
                fontSize: 11,
                background:
                  target === "color" ? "var(--background)" : "transparent",
                color:
                  target === "color"
                    ? "var(--foreground)"
                    : "var(--muted-foreground)",
                boxShadow:
                  target === "color" ? "0 1px 3px oklch(0 0 0 / 0.08)" : "none",
              }}
              onClick={() => setTarget("color")}
            >
              Text color
            </button>
          )}
          {!noBg && (
            <button
              style={{
                ...s.segBtn,
                flex: 1,
                fontSize: 11,
                background:
                  target === "backgroundColor"
                    ? "var(--background)"
                    : "transparent",
                color:
                  target === "backgroundColor"
                    ? "var(--foreground)"
                    : "var(--muted-foreground)",
                boxShadow:
                  target === "backgroundColor"
                    ? "0 1px 3px oklch(0 0 0 / 0.08)"
                    : "none",
              }}
              onClick={() => setTarget("backgroundColor")}
            >
              Background
            </button>
          )}
        </div>
      </Section>

      {/* OKLCH Picker */}
      <Section label="OKLCH">
        <OklchPicker value={currentVal} onChange={(v) => upd(target, v)} />
      </Section>

      {/* Palette swatches */}
      {palette.colors.length > 0 && (
        <Section label={`PALETTE · ${palette.name}`}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {palette.colors.map((color, i) => (
              <button
                key={i}
                title={color}
                onClick={() => upd(target, color)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "calc(var(--radius) - 2px)",
                  background: color,
                  border:
                    currentVal === color
                      ? "2px solid var(--foreground)"
                      : "1px solid var(--border)",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Cosira brand color shortcut */}
      <Section label="BRAND">
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 10px",
            width: "100%",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            background: "none",
            cursor: "pointer",
          }}
          onClick={() => upd(target, "oklch(0.597 0.240854 2.4025)")}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--muted)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              background: "oklch(0.597 0.240854 2.4025)",
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 11, color: "var(--foreground)" }}>
            COSIRA brand red
          </span>
        </button>
      </Section>
    </div>
  );
}

const s = {
  panel: { padding: "16px" },
  btnGroup: {
    display: "flex",
    gap: 2,
    background: "var(--muted)",
    borderRadius: "var(--radius)",
    padding: 2,
  },
  segBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 28,
    border: "none",
    borderRadius: "calc(var(--radius) - 2px)",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  rangeInput: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    opacity: 0,
    cursor: "pointer",
    margin: 0,
  },
  textInput: {
    width: "100%",
    fontSize: 12,
    padding: "6px 8px",
    background: "var(--background)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--foreground)",
    outline: "none",
    boxSizing: "border-box",
  },
};

// /components/playground/panels/LayoutPanel.jsx
"use client";

import {
  usePlaygroundStore,
  useSelectedElement,
} from "@/store/playgroundStore";
import { Section, Empty } from "./TypographyPanel";
import {
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  AlignStartHorizontal,
  AlignCenterHorizontal,
  AlignEndHorizontal,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export default function LayoutPanel() {
  const el = useSelectedElement();
  const updateElement = usePlaygroundStore((s) => s.updateElement);
  const moveElement = usePlaygroundStore((s) => s.moveElement);
  const resizeElement = usePlaygroundStore((s) => s.resizeElement);
  const reorderZ = usePlaygroundStore((s) => s.reorderZ);
  const canvasWidth = usePlaygroundStore((s) => s.canvas.width);

  if (!el) return <Empty label="Select an element to edit layout" />;

  const upd = (key, val) => updateElement(el.id, { [key]: val });
  const move = (x, y) => moveElement(el.id, x, y);
  const resize = (w, h) => resizeElement(el.id, w, h);

  // Quick align actions relative to canvas
  const CANVAS_H = 720;
  const aligns = [
    { label: "Left", icon: AlignStartVertical, fn: () => move(0, el.y) },
    {
      label: "H-center",
      icon: AlignCenterVertical,
      fn: () => move(Math.round((canvasWidth - el.width) / 2), el.y),
    },
    {
      label: "Right",
      icon: AlignEndVertical,
      fn: () => move(canvasWidth - el.width, el.y),
    },
    { label: "Top", icon: AlignStartHorizontal, fn: () => move(el.x, 0) },
    {
      label: "V-center",
      icon: AlignCenterHorizontal,
      fn: () => move(el.x, Math.round((CANVAS_H - el.height) / 2)),
    },
    {
      label: "Bottom",
      icon: AlignEndHorizontal,
      fn: () => move(el.x, CANVAS_H - el.height),
    },
  ];

  return (
    <div style={s.panel}>
      {/* Position */}
      <Section label="POSITION">
        <div style={s.row}>
          <NumField
            label="X"
            value={el.x}
            onChange={(v) => move(v, el.y)}
            unit="px"
          />
          <NumField
            label="Y"
            value={el.y}
            onChange={(v) => move(el.x, v)}
            unit="px"
          />
        </div>
      </Section>

      {/* Size */}
      <Section label="SIZE">
        <div style={s.row}>
          <NumField
            label="W"
            value={el.width}
            onChange={(v) => resize(v, el.height)}
            unit="px"
            min={8}
          />
          <NumField
            label="H"
            value={el.height}
            onChange={(v) => resize(el.width, v)}
            unit="px"
            min={2}
          />
        </div>
      </Section>

      {/* Align */}
      <Section label="ALIGN TO CANVAS">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {aligns.map(({ label, icon: Icon, fn }) => (
            <button
              key={label}
              title={label}
              onClick={fn}
              style={s.alignBtn}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--muted)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--background)")
              }
            >
              <Icon size={14} />
            </button>
          ))}
        </div>
      </Section>

      {/* Z-order */}
      <Section label="Z-ORDER">
        <div style={{ display: "flex", gap: 4 }}>
          {[
            { label: "Bring to front", fn: () => reorderZ(el.id, "top") },
            { label: "Bring forward", fn: () => reorderZ(el.id, "up") },
            { label: "Send backward", fn: () => reorderZ(el.id, "down") },
            { label: "Send to back", fn: () => reorderZ(el.id, "bottom") },
          ].map(({ label, fn }) => (
            <button
              key={label}
              onClick={fn}
              title={label}
              style={{
                ...s.alignBtn,
                flex: 1,
                fontSize: 10,
                padding: "5px 4px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--muted)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--background)")
              }
            >
              {label}
            </button>
          ))}
        </div>
      </Section>

      {/* Visibility & Lock */}
      <Section label="VISIBILITY">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <Toggle
            label="Visible"
            value={el.visible}
            onChange={(v) => upd("visible", v)}
          />
          <Toggle
            label="Locked"
            value={el.locked}
            onChange={(v) => upd("locked", v)}
          />
        </div>
      </Section>
    </div>
  );
}

// ─── NumField ─────────────────────────────────────────────────────────────────
function NumField({ label, value, onChange, unit = "", min }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
      <span
        style={{
          fontSize: 10,
          color: "var(--muted-foreground)",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </span>
      <div style={s.inputWithUnit}>
        <input
          type="number"
          value={value}
          min={min}
          onChange={(e) => onChange(Number(e.target.value))}
          style={s.numInput}
        />
        {unit && <span style={s.unitLabel}>{unit}</span>}
      </div>
    </div>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ label, value, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span style={{ fontSize: 12, color: "var(--foreground)" }}>{label}</span>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 36,
          height: 20,
          borderRadius: 10,
          border: "none",
          background: value ? "oklch(0.597 0.240854 2.4025)" : "var(--muted)",
          position: "relative",
          cursor: "pointer",
          transition: "background 0.2s",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 2,
            left: value ? 18 : 2,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#fff",
            transition: "left 0.2s",
            boxShadow: "0 1px 3px oklch(0 0 0 / 0.2)",
          }}
        />
      </button>
    </div>
  );
}

const s = {
  panel: { padding: "16px" },
  row: { display: "flex", gap: 8 },
  inputWithUnit: {
    display: "flex",
    alignItems: "center",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    overflow: "hidden",
    background: "var(--background)",
  },
  numInput: {
    flex: 1,
    width: "100%",
    minWidth: 0,
    border: "none",
    background: "transparent",
    color: "var(--foreground)",
    fontSize: 12,
    padding: "5px 8px",
    outline: "none",
    fontVariantNumeric: "tabular-nums",
  },
  unitLabel: {
    fontSize: 10,
    color: "var(--muted-foreground)",
    padding: "0 6px",
    borderLeft: "1px solid var(--border)",
    background: "var(--muted)",
  },
  alignBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    background: "var(--background)",
    color: "var(--foreground)",
    cursor: "pointer",
    transition: "background 0.12s",
  },
};

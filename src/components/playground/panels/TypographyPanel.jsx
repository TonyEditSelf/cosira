// /components/playground/panels/TypographyPanel.jsx
"use client";

import { usePlaygroundStore } from "@/store/playgroundStore";
import { useSelectedElement } from "@/store/playgroundStore";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";

const FONT_FAMILIES = [
  "Inter",
  "DM Sans",
  "Geist",
  "Manrope",
  "Plus Jakarta Sans",
  "Sora",
  "Space Grotesk",
  "Outfit",
  "Lato",
  "Nunito",
  "Playfair Display",
  "Fraunces",
  "DM Serif Display",
  "Cormorant Garamond",
  "Libre Baskerville",
  "JetBrains Mono",
  "Fira Code",
  "IBM Plex Mono",
];

const FONT_WEIGHTS = [400, 500, 600, 700, 800, 900];

const TEXT_TRANSFORMS = ["none", "uppercase", "capitalize"];

const TEXT_TYPES = [
  "heading1",
  "heading2",
  "heading3",
  "paragraph",
  "link",
  "button",
  "badge",
];

export default function TypographyPanel() {
  const el = useSelectedElement();
  const updateElement = usePlaygroundStore((s) => s.updateElement);

  if (!el || !TEXT_TYPES.includes(el.type)) {
    return <Empty label="Select a text element to edit typography" />;
  }

  const upd = (key, val) => updateElement(el.id, { [key]: val });

  return (
    <div style={s.panel}>
      {/* Font family */}
      <Section label="FONT FAMILY">
        <select
          value={el.fontFamily}
          onChange={(e) => upd("fontFamily", e.target.value)}
          style={s.select}
        >
          {FONT_FAMILIES.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </Section>

      {/* Size + Weight */}
      <Section label="SIZE & WEIGHT">
        <div style={s.row}>
          <div style={s.inputGroup}>
            <label style={s.inputLabel}>Size</label>
            <div style={s.inputWithUnit}>
              <input
                type="number"
                min={8}
                max={200}
                value={el.fontSize}
                onChange={(e) => upd("fontSize", Number(e.target.value))}
                style={s.numInput}
              />
              <span style={s.unit}>px</span>
            </div>
          </div>

          <div style={s.inputGroup}>
            <label style={s.inputLabel}>Weight</label>
            <select
              value={el.fontWeight}
              onChange={(e) => upd("fontWeight", Number(e.target.value))}
              style={{ ...s.select, width: "100%" }}
            >
              {FONT_WEIGHTS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Section>

      {/* Line height + Letter spacing */}
      <Section label="SPACING">
        <div style={s.row}>
          <div style={s.inputGroup}>
            <label style={s.inputLabel}>Line height</label>
            <div style={s.inputWithUnit}>
              <input
                type="number"
                min={0.5}
                max={4}
                step={0.05}
                value={el.lineHeight}
                onChange={(e) => upd("lineHeight", Number(e.target.value))}
                style={s.numInput}
              />
            </div>
          </div>

          <div style={s.inputGroup}>
            <label style={s.inputLabel}>Letter spacing</label>
            <div style={s.inputWithUnit}>
              <input
                type="number"
                min={-0.1}
                max={0.5}
                step={0.005}
                value={el.letterSpacing}
                onChange={(e) => upd("letterSpacing", Number(e.target.value))}
                style={s.numInput}
              />
              <span style={s.unit}>em</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Alignment */}
      <Section label="ALIGNMENT">
        <div style={s.btnGroup}>
          {[
            { val: "left", Icon: AlignLeft },
            { val: "center", Icon: AlignCenter },
            { val: "right", Icon: AlignRight },
          ].map(({ val, Icon }) => (
            <button
              key={val}
              style={{
                ...s.segBtn,
                background:
                  el.textAlign === val ? "var(--background)" : "transparent",
                color:
                  el.textAlign === val
                    ? "var(--foreground)"
                    : "var(--muted-foreground)",
                boxShadow:
                  el.textAlign === val
                    ? "0 1px 3px oklch(0 0 0 / 0.08)"
                    : "none",
              }}
              onClick={() => upd("textAlign", val)}
              title={val}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>
      </Section>

      {/* Transform */}
      <Section label="TRANSFORM">
        <div style={s.btnGroup}>
          {TEXT_TRANSFORMS.map((t) => (
            <button
              key={t}
              style={{
                ...s.segBtn,
                flex: 1,
                fontSize: 10,
                letterSpacing: "0.04em",
                background:
                  el.textTransform === t ? "var(--background)" : "transparent",
                color:
                  el.textTransform === t
                    ? "var(--foreground)"
                    : "var(--muted-foreground)",
                boxShadow:
                  el.textTransform === t
                    ? "0 1px 3px oklch(0 0 0 / 0.08)"
                    : "none",
              }}
              onClick={() => upd("textTransform", t)}
            >
              {t === "none" ? "Aa" : t === "uppercase" ? "AA" : "Aa"}
            </button>
          ))}
        </div>
      </Section>

      {/* Text content */}
      <Section label="CONTENT">
        <textarea
          value={el.text}
          onChange={(e) => upd("text", e.target.value)}
          rows={3}
          style={s.textarea}
          placeholder="Element text…"
        />
      </Section>
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────
export function Section({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <p
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: "var(--muted-foreground)",
          margin: "0 0 8px",
        }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

export function Empty({ label }) {
  return (
    <div
      style={{
        padding: 20,
        fontSize: 12,
        color: "var(--muted-foreground)",
        textAlign: "center",
        lineHeight: 1.6,
      }}
    >
      {label}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  panel: { padding: "16px" },
  row: { display: "flex", gap: 8 },
  inputGroup: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  inputLabel: {
    fontSize: 10,
    color: "var(--muted-foreground)",
    letterSpacing: "0.04em",
  },
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
  unit: {
    fontSize: 10,
    color: "var(--muted-foreground)",
    padding: "0 6px",
    borderLeft: "1px solid var(--border)",
    background: "var(--muted)",
  },
  select: {
    width: "100%",
    fontSize: 12,
    padding: "6px 8px",
    background: "var(--background)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--foreground)",
    outline: "none",
    cursor: "pointer",
  },
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
    transition: "background 0.15s, color 0.15s",
  },
  textarea: {
    width: "100%",
    fontSize: 12,
    lineHeight: 1.5,
    padding: "8px",
    resize: "vertical",
    background: "var(--background)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--foreground)",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
};

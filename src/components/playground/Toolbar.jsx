"use client";

import { useEffect, useRef, useState } from "react";
import {
  Smartphone,
  Tablet,
  Monitor,
  Undo2,
  Redo2,
  Eye,
  EyeOff,
  Plus,
} from "lucide-react";
import { usePlaygroundStore } from "@/store/playgroundStore";
import ThemeToggle from "@/components/ThemeToggle";

const ADD_TYPES = [
  { type: "heading1", label: "H1 Hero" },
  { type: "heading2", label: "H2 Section title" },
  { type: "heading3", label: "H3 Card title" },
  { type: "paragraph", label: "Body text" },
  { type: "paragraph", label: "Caption" },
  { type: "link", label: "Link" },
  { type: "button", label: "CTA Button" },
  { type: "image", label: "Hero image (16:9)" },
  { type: "image", label: "Card image (4:3)" },
  { type: "image", label: "Avatar (1:1)" },
  { type: "divider", label: "Divider" },
  { type: "badge", label: "Badge" },
];

export default function Toolbar() {
  const undo = usePlaygroundStore((s) => s.undo);
  const redo = usePlaygroundStore((s) => s.redo);
  const addElement = usePlaygroundStore((s) => s.addElement);
  const moveElement = usePlaygroundStore((s) => s.moveElement);
  const removeElement = usePlaygroundStore((s) => s.removeElement);
  const duplicateElement = usePlaygroundStore((s) => s.duplicateElement);
  const setSelectedId = usePlaygroundStore((s) => s.setSelectedId);
  const setBreakpoint = usePlaygroundStore((s) => s.setBreakpoint);
  const setPreviewMode = usePlaygroundStore((s) => s.setPreviewMode);
  const updateCanvas = usePlaygroundStore((s) => s.updateCanvas);

  const past = usePlaygroundStore((s) => s._history.past);
  const future = usePlaygroundStore((s) => s._history.future);
  const breakpoint = usePlaygroundStore((s) => s.ui.breakpoint);
  const previewMode = usePlaygroundStore((s) => s.ui.previewMode);
  const canvasWidth = usePlaygroundStore((s) => s.canvas.width);
  const selectedId = usePlaygroundStore((s) => s.ui.selectedId);
  const elements = usePlaygroundStore((s) => s.elements);

  const [addOpen, setAddOpen] = useState(false);
  const [editingW, setEditingW] = useState(false);
  const [widthVal, setWidthVal] = useState(String(canvasWidth));
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setAddOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      const meta = e.metaKey || e.ctrlKey;
      const tag = document.activeElement?.tagName;
      const isInput =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        document.activeElement?.isContentEditable;

      if (isInput) return;

      if (meta && e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        redo();
        return;
      }
      if (meta && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
        return;
      }
      if (meta && e.key.toLowerCase() === "d" && selectedId) {
        e.preventDefault();
        duplicateElement(selectedId);
        return;
      }
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        removeElement(selectedId);
        setSelectedId(null);
        return;
      }
      if (e.key === "Escape") {
        setSelectedId(null);
        return;
      }

      // Arrow nudge
      if (
        selectedId &&
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        e.preventDefault();
        const step = e.shiftKey ? 8 : 1;
        const el = elements.find((x) => x.id === selectedId);
        if (!el) return;
        const dx =
          e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
        const dy =
          e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
        moveElement(selectedId, el.x + dx, el.y + dy);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    selectedId,
    elements,
    undo,
    redo,
    removeElement,
    duplicateElement,
    setSelectedId,
    moveElement,
  ]);

  const commitWidth = () => {
    setEditingW(false);
    const n = parseInt(widthVal, 10);
    if (!isNaN(n) && n >= 320) updateCanvas({ width: n });
    else setWidthVal(String(canvasWidth));
  };

  const BP_ICONS = { mobile: Smartphone, tablet: Tablet, desktop: Monitor };
  const BP_WIDTHS = { mobile: 390, tablet: 768, desktop: 1280 };

  return (
    <div style={s.bar}>
      {/* ── Left ── */}
      <div style={s.group}>
        <button
          style={{ ...s.iconBtn, opacity: past.length === 0 ? 0.35 : 1 }}
          onClick={undo}
          disabled={past.length === 0}
          title="Undo (⌘Z)"
        >
          <Undo2 size={15} />
        </button>

        <button
          style={{ ...s.iconBtn, opacity: future.length === 0 ? 0.35 : 1 }}
          onClick={redo}
          disabled={future.length === 0}
          title="Redo (⌘⇧Z)"
        >
          <Redo2 size={15} />
        </button>

        <div style={s.sep} />

        {/* Add dropdown */}
        <div style={{ position: "relative" }} ref={dropdownRef}>
          <button
            style={s.addBtn}
            onClick={() => setAddOpen((o) => !o)}
            title="Add element"
          >
            <Plus size={14} />
            <span>Add</span>
          </button>
          {addOpen && (
            <div style={s.dropdown}>
              {ADD_TYPES.map((item) => (
                <button
                  key={item.label}
                  style={s.dropItem}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--muted)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                  onClick={() => {
                    addElement(item.type);
                    setAddOpen(false);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Center ── */}
      <div style={s.group}>
        {editingW ? (
          <input
            autoFocus
            value={widthVal}
            onChange={(e) => setWidthVal(e.target.value)}
            onBlur={commitWidth}
            onKeyDown={(e) => e.key === "Enter" && commitWidth()}
            style={{
              width: 64,
              fontSize: 12,
              textAlign: "center",
              background: "var(--input)",
              border: "1px solid var(--border)",
              borderRadius: 4,
              color: "var(--foreground)",
              padding: "2px 6px",
            }}
          />
        ) : (
          <span
            style={{
              fontSize: 12,
              color: "var(--muted-foreground)",
              cursor: "pointer",
              padding: "0 6px",
              letterSpacing: "0.04em",
            }}
            title="Click to edit width"
            onClick={() => {
              setWidthVal(String(canvasWidth));
              setEditingW(true);
            }}
          >
            {canvasWidth}px
          </span>
        )}

        <div style={s.sep} />

        <div style={s.bpGroup}>
          {["mobile", "tablet", "desktop"].map((bp) => {
            const Icon = BP_ICONS[bp];
            const active = breakpoint === bp;
            return (
              <button
                key={bp}
                title={`${bp} (${BP_WIDTHS[bp]}px)`}
                style={{
                  ...s.bpBtn,
                  background: active ? "var(--background)" : "transparent",
                  color: active
                    ? "var(--foreground)"
                    : "var(--muted-foreground)",
                  boxShadow: active ? "0 1px 4px oklch(0 0 0 / 0.08)" : "none",
                }}
                onClick={() => setBreakpoint(bp)}
              >
                <Icon size={14} />
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Right ── */}
      <div style={s.group}>
        <button
          style={{
            ...s.iconBtn,
            background: previewMode ? "var(--muted)" : "transparent",
          }}
          onClick={() => setPreviewMode(!previewMode)}
          title={previewMode ? "Exit preview" : "Preview"}
        >
          {previewMode ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>

        <div style={s.sep} />

        <ThemeToggle />

        <div style={s.sep} />

        <button style={s.exportBtn}>Export ↗</button>
      </div>
    </div>
  );
}

const s = {
  bar: {
    height: 48,
    minHeight: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 12px",
    background: "var(--card)",
    borderBottom: "1px solid var(--border)",
    gap: 8,
    position: "relative",
    zIndex: 10,
  },
  group: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  iconBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: "var(--radius)",
    border: "none",
    background: "transparent",
    color: "var(--muted-foreground)",
    cursor: "pointer",
    transition: "background 0.15s, color 0.15s",
  },
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    height: 32,
    padding: "0 12px",
    borderRadius: "var(--radius)",
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--foreground)",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 6px)",
    left: 0,
    minWidth: 170,
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    boxShadow: "0 8px 24px oklch(0 0 0 / 0.10)",
    zIndex: 200,
    padding: "4px 0",
  },
  dropItem: {
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "7px 14px",
    background: "transparent",
    border: "none",
    color: "var(--foreground)",
    fontSize: 13,
    cursor: "pointer",
  },
  sep: {
    width: 1,
    height: 20,
    background: "var(--border)",
    margin: "0 2px",
  },
  bpGroup: {
    display: "flex",
    gap: 2,
    background: "var(--muted)",
    borderRadius: "var(--radius)",
    padding: 2,
  },
  bpBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 26,
    border: "none",
    borderRadius: "calc(var(--radius) - 2px)",
    cursor: "pointer",
    transition: "background 0.15s, color 0.15s",
  },
  exportBtn: {
    height: 32,
    padding: "0 14px",
    borderRadius: "var(--radius)",
    border: "none",
    background: "oklch(0.597 0.240854 2.4025)",
    color: "oklch(0.98 0 0)",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "0.01em",
  },
};

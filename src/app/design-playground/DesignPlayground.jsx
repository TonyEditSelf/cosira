"use client";

import { useEffect, useRef, useState } from "react";
import { usePlaygroundStore } from "@/store/playgroundStore";
import LayersPanel from "@/components/playground/LayersPanel";
import Toolbar from "@/components/playground/Toolbar";
import PropertiesPanel from "@/components/playground/panels/PropertiesPanel";

// ─── Provider ────────────────────────────────────────────────────────────────

function PlaygroundProvider({ children }) {
  const setTheme = usePlaygroundStore((s) => s.setTheme);

  useEffect(() => {
    // Sync with Cosira's theme system (.dark class on <html>)
    const root = document.documentElement;
    const sync = () =>
      setTheme(root.classList.contains("dark") ? "dark" : "light");

    sync();

    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [setTheme]);

  return <>{children}</>;
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────

// const ADD_TYPES = [
//   "heading1",
//   "heading2",
//   "heading3",
//   "paragraph",
//   "link",
//   "button",
//   "badge",
//   "image",
//   "divider",
// ];

// function Toolbar({ onToggleLeft, onToggleRight }) {
//   const [addOpen, setAddOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   const undo = usePlaygroundStore((s) => s.undo);
//   const redo = usePlaygroundStore((s) => s.redo);
//   const addElement = usePlaygroundStore((s) => s.addElement);
//   const canvasWidth = usePlaygroundStore((s) => s.canvas.width);
//   const breakpoint = usePlaygroundStore((s) => s.ui.breakpoint);
//   const previewMode = usePlaygroundStore((s) => s.ui.previewMode);
//   const setBreakpoint = usePlaygroundStore((s) => s.setBreakpoint);
//   const setPreviewMode = usePlaygroundStore((s) => s.setPreviewMode);
//   const past = usePlaygroundStore((s) => s._history.past);
//   const future = usePlaygroundStore((s) => s._history.future);

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handler = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setAddOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const bpIcons = {
//     mobile: "▱", // narrow
//     tablet: "▭", // medium
//     desktop: "▬", // wide
//   };

//   const labelFor = (type) =>
//     type.replace(/([0-9])/, " $1").replace(/^./, (c) => c.toUpperCase());

//   return (
//     <div style={styles.toolbar}>
//       {/* ── Left group ── */}
//       <div style={styles.toolbarGroup}>
//         {/* Mobile sidebar toggles */}
//         <button
//           style={styles.iconBtn}
//           onClick={onToggleLeft}
//           title="Toggle element panel"
//           className="toolbar-mobile-only"
//         >
//           ☰
//         </button>

//         <button
//           style={{ ...styles.iconBtn, opacity: past.length === 0 ? 0.35 : 1 }}
//           onClick={undo}
//           disabled={past.length === 0}
//           title="Undo (⌘Z)"
//         >
//           ↩
//         </button>

//         <button
//           style={{ ...styles.iconBtn, opacity: future.length === 0 ? 0.35 : 1 }}
//           onClick={redo}
//           disabled={future.length === 0}
//           title="Redo (⌘⇧Z)"
//         >
//           ↪
//         </button>

//         <div style={styles.dividerV} />

//         {/* Add element dropdown */}
//         <div style={{ position: "relative" }} ref={dropdownRef}>
//           <button
//             style={styles.addBtn}
//             onClick={() => setAddOpen((o) => !o)}
//             title="Add element"
//           >
//             <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
//             <span>Add</span>
//           </button>

//           {addOpen && (
//             <div style={styles.dropdown}>
//               {ADD_TYPES.map((type) => (
//                 <button
//                   key={type}
//                   style={styles.dropdownItem}
//                   onMouseEnter={(e) =>
//                     (e.currentTarget.style.background = "var(--muted)")
//                   }
//                   onMouseLeave={(e) =>
//                     (e.currentTarget.style.background = "transparent")
//                   }
//                   onClick={() => {
//                     addElement(type);
//                     setAddOpen(false);
//                   }}
//                 >
//                   {labelFor(type)}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── Center group ── */}
//       <div style={styles.toolbarGroup}>
//         <span style={styles.canvasLabel}>{canvasWidth}px</span>

//         <div style={styles.dividerV} />

//         <div style={styles.bpGroup}>
//           {["mobile", "tablet", "desktop"].map((bp) => (
//             <button
//               key={bp}
//               style={{
//                 ...styles.bpBtn,
//                 background: breakpoint === bp ? "var(--muted)" : "transparent",
//                 color:
//                   breakpoint === bp
//                     ? "var(--foreground)"
//                     : "var(--muted-foreground)",
//               }}
//               onClick={() => setBreakpoint(bp)}
//               title={bp.charAt(0).toUpperCase() + bp.slice(1)}
//             >
//               {bpIcons[bp]}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ── Right group ── */}
//       <div style={styles.toolbarGroup}>
//         <button
//           style={{
//             ...styles.iconBtn,
//             background: previewMode ? "var(--muted)" : "transparent",
//             color: previewMode
//               ? "var(--foreground)"
//               : "var(--muted-foreground)",
//           }}
//           onClick={() => setPreviewMode(!previewMode)}
//           title="Preview mode"
//         >
//           {previewMode ? "◉" : "○"}
//         </button>

//         <div style={styles.dividerV} />

//         <button style={styles.exportBtn} title="Export canvas">
//           Export
//         </button>

//         <button
//           style={styles.iconBtn}
//           onClick={onToggleRight}
//           title="Toggle properties panel"
//           className="toolbar-mobile-only"
//         >
//           ⊞
//         </button>
//       </div>
//     </div>
//   );
// }

// ─── Left Sidebar ─────────────────────────────────────────────────────────────

function LeftSidebar() {
  return (
    <aside style={styles.leftSidebar}>
      <div style={styles.sidebarSection}>
        <p style={styles.sidebarLabel}>ELEMENTS</p>
        <div style={styles.placeholder}>Element picker — Phase 2</div>
      </div>

      <div style={styles.dividerH} />

      <div style={styles.sidebarSection}>
        <p style={styles.sidebarLabel}>LAYERS</p>
        <div style={styles.placeholder}>Layer list — Phase 2</div>
      </div>
    </aside>
  );
}

// ─── Canvas ───────────────────────────────────────────────────────────────────

function Canvas() {
  const gridVisible = usePlaygroundStore((s) => s.canvas.gridVisible);
  const gridSize = usePlaygroundStore((s) => s.canvas.gridSize);
  const canvasWidth = usePlaygroundStore((s) => s.canvas.width);
  const canvasBg = usePlaygroundStore((s) => s.canvas.backgroundColor);
  const previewMode = usePlaygroundStore((s) => s.ui.previewMode);
  const setSelectedId = usePlaygroundStore((s) => s.setSelectedId);

  const dotGrid = gridVisible
    ? {
        backgroundImage:
          "radial-gradient(circle, var(--border) 1px, transparent 1px)",
        backgroundSize: `${gridSize}px ${gridSize}px`,
      }
    : {};

  return (
    <main
      style={{ ...styles.canvasArea, ...dotGrid }}
      onClick={() => setSelectedId(null)}
    >
      <div
        style={{
          ...styles.canvasInner,
          width: canvasWidth,
          background: canvasBg,
          outline: previewMode ? "none" : "1px solid var(--border)",
        }}
      >
        {/* Canvas elements rendered here — Phase 3 */}
        <div style={styles.canvasPlaceholder}>
          Canvas · {canvasWidth}px — Phase 3
        </div>
      </div>
    </main>
  );
}

// ─── Right Sidebar ────────────────────────────────────────────────────────────

function RightSidebar() {
  const panelOpen = usePlaygroundStore((s) => s.ui.panelOpen);
  const setPanelOpen = usePlaygroundStore((s) => s.setPanelOpen);

  const panels = ["typography", "color", "layout", "image"];

  return (
    <aside style={styles.rightSidebar}>
      {/* Panel tabs */}
      <div style={styles.panelTabs}>
        {panels.map((p) => (
          <button
            key={p}
            style={{
              ...styles.panelTab,
              borderBottom:
                panelOpen === p
                  ? "2px solid var(--brand)"
                  : "2px solid transparent",
              color:
                panelOpen === p
                  ? "var(--foreground)"
                  : "var(--muted-foreground)",
            }}
            onClick={() => setPanelOpen(panelOpen === p ? null : p)}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      <div style={styles.dividerH} />

      <div style={styles.sidebarSection}>
        {panelOpen ? (
          <div style={styles.placeholder}>{panelOpen} panel — Phase 4</div>
        ) : (
          <div
            style={{
              ...styles.placeholder,
              color: "var(--muted-foreground)",
              fontSize: 12,
            }}
          >
            Select an element to edit its properties
          </div>
        )}
      </div>
    </aside>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DesignPlaygroundPage() {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  return (
    <>
      <title>Design Playground · COSIRA</title>
      <PlaygroundProvider>
        <div style={styles.page}>
          <div style={styles.workspace}>
            <Toolbar
              onToggleLeft={() => setLeftOpen((o) => !o)}
              onToggleRight={() => setRightOpen((o) => !o)}
            />
            <div style={styles.grid}>
              {/* Left sidebar — collapses to drawer on mobile */}
              <div
                style={{
                  ...styles.drawerWrapper,
                  transform: leftOpen ? "translateX(0)" : undefined,
                }}
                className="sidebar-left"
              >
                <LayersPanel />
              </div>
              <Canvas />
              {/* Right sidebar — collapses to drawer on mobile */}
              <div
                style={{
                  ...styles.drawerWrapper,
                  transform: rightOpen ? "translateX(0)" : undefined,
                }}
                className="sidebar-right"
              >
                <PropertiesPanel />
              </div>
            </div>
          </div>
        </div>
        {/* Responsive helpers */}
        <style>{`
            .toolbar-mobile-only { display: none; }
            @media (max-width: 767px) {
              .toolbar-mobile-only { display: flex !important; }
              .sidebar-left {
                position: fixed !important;
                inset: 0 auto 0 0 !important;
                width: 280px !important;
                z-index: 50 !important;
                transform: translateX(-100%) !important;
                transition: transform 0.25s ease !important;
                box-shadow: 4px 0 24px oklch(0 0 0 / 0.12) !important;
              }
              .sidebar-right {
                position: fixed !important;
                inset: 0 0 0 auto !important;
                width: 320px !important;
                z-index: 50 !important;
                transform: translateX(100%) !important;
                transition: transform 0.25s ease !important;
                box-shadow: -4px 0 24px oklch(0 0 0 / 0.12) !important;
              }
            }
          `}</style>
      </PlaygroundProvider>
    </>
  );
}
// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    background: "var(--background)",
    color: "var(--foreground)",
  },
  workspace: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  // ── Toolbar ──
  toolbar: {
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
  toolbarGroup: {
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
    fontSize: 14,
    transition: "background 0.15s, color 0.15s",
  },
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
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
    minWidth: 160,
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    boxShadow: "0 8px 24px oklch(0 0 0 / 0.10)",
    zIndex: 100,
    overflow: "hidden",
    padding: "4px 0",
  },
  dropdownItem: {
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "7px 14px",
    background: "transparent",
    border: "none",
    color: "var(--foreground)",
    fontSize: 13,
    cursor: "pointer",
    transition: "background 0.1s",
  },
  canvasLabel: {
    fontSize: 12,
    fontVariantNumeric: "tabular-nums",
    color: "var(--muted-foreground)",
    letterSpacing: "0.04em",
    padding: "0 8px",
  },
  bpGroup: {
    display: "flex",
    gap: 2,
    background: "var(--muted)",
    borderRadius: "var(--radius)",
    padding: 2,
  },
  bpBtn: {
    width: 28,
    height: 26,
    border: "none",
    borderRadius: "calc(var(--radius) - 2px)",
    cursor: "pointer",
    fontSize: 13,
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
  dividerV: {
    width: 1,
    height: 20,
    background: "var(--border)",
    margin: "0 4px",
  },
  // ── Grid ──
  grid: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "280px 1fr 320px",
    overflow: "hidden",
  },
  // ── Sidebars ──
  leftSidebar: {
    background: "var(--card)",
    borderRight: "1px solid var(--border)",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },
  rightSidebar: {
    background: "var(--card)",
    borderLeft: "1px solid var(--border)",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },
  drawerWrapper: {
    // On desktop this is a no-op; mobile CSS overrides via className
  },
  sidebarSection: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  sidebarLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "var(--muted-foreground)",
    margin: 0,
  },
  placeholder: {
    fontSize: 12,
    color: "var(--muted-foreground)",
    padding: "12px",
    border: "1px dashed var(--border)",
    borderRadius: "var(--radius)",
    textAlign: "center",
  },
  panelTabs: {
    display: "flex",
  },
  panelTab: {
    flex: 1,
    height: 38,
    border: "none",
    borderBottom: "2px solid transparent",
    background: "transparent",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.04em",
    cursor: "pointer",
    transition: "color 0.15s, border-color 0.15s",
  },
  dividerH: {
    height: 1,
    background: "var(--border)",
    margin: "0",
  },
  // ── Canvas ──
  canvasArea: {
    overflow: "auto",
    display: "flex",
    justifyContent: "center",
    padding: "40px",
    background: "var(--background)",
  },
  canvasInner: {
    position: "relative",
    minHeight: 720,
    borderRadius: "var(--radius)",
    flexShrink: 0,
    transition: "width 0.3s ease",
  },
  canvasPlaceholder: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    color: "var(--muted-foreground)",
    letterSpacing: "0.06em",
  },
};

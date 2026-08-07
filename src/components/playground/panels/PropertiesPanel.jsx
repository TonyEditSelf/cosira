// /components/playground/panels/PropertiesPanel.jsx  ← wire them all together
"use client";

import {
  usePlaygroundStore,
  useSelectedElement,
} from "@/store/playgroundStore";
import TypographyPanel from "./TypographyPanel";
import ColorPanel from "./ColorPanel";
import LayoutPanel from "./LayoutPanel";
import ImagePanel from "./ImagePanel";

const TABS = ["typography", "color", "layout", "image"];

export default function PropertiesPanel() {
  const panelOpen = usePlaygroundStore((s) => s.ui.panelOpen);
  const setPanelOpen = usePlaygroundStore((s) => s.setPanelOpen);
  const el = useSelectedElement();

  // Auto-hide image tab unless image element selected
  const visibleTabs =
    el?.type === "image" ? TABS : TABS.filter((t) => t !== "image");

  const activeTab =
    panelOpen ??
    (el ? (el.type === "image" ? "image" : "typography") : "typography");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        {visibleTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setPanelOpen(tab)}
            style={{
              flex: 1,
              height: 38,
              border: "none",
              borderBottom:
                activeTab === tab
                  ? "2px solid oklch(0.597 0.240854 2.4025)"
                  : "2px solid transparent",
              background: "transparent",
              color:
                activeTab === tab
                  ? "var(--foreground)"
                  : "var(--muted-foreground)",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "color 0.15s, border-color 0.15s",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Panel content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {activeTab === "typography" && <TypographyPanel />}
        {activeTab === "color" && <ColorPanel />}
        {activeTab === "layout" && <LayoutPanel />}
        {activeTab === "image" && <ImagePanel />}
      </div>
    </div>
  );
}

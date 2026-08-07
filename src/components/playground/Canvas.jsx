// /components/playground/Canvas.jsx
import { useRef, useState, useCallback, useEffect } from "react";
import { usePlaygroundStore, useSortedElements } from "@/store/playgroundStore";
import CanvasElement from "./CanvasElement";

// ─── Dot-grid background ──────────────────────────────────────────────────────
function useDotGridStyle(gridVisible, gridSize) {
  if (!gridVisible) return {};
  return {
    backgroundImage:
      "radial-gradient(circle, var(--border) 1px, transparent 1px)",
    backgroundSize: `${gridSize}px ${gridSize}px`,
  };
}

// ─── Selection marquee ────────────────────────────────────────────────────────
function SelectionMarquee({ rect }) {
  if (!rect) return null;
  const { x, y, w, h } = rect;
  return (
    <div
      style={{
        position: "absolute",
        left: Math.min(x, x + w),
        top: Math.min(y, y + h),
        width: Math.abs(w),
        height: Math.abs(h),
        border: "1.5px dashed oklch(0.597 0.240854 2.4025)",
        background: "oklch(0.597 0.240854 2.4025 / 0.06)",
        pointerEvents: "none",
        zIndex: 9997,
      }}
    />
  );
}

// ─── Canvas ───────────────────────────────────────────────────────────────────
export default function Canvas() {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);

  const elements = useSortedElements();
  const canvas = usePlaygroundStore((s) => s.canvas);
  const setSelectedId = usePlaygroundStore((s) => s.setSelectedId);
  const previewMode = usePlaygroundStore((s) => s.ui.previewMode);

  const [marquee, setMarquee] = useState(null); // { startX, startY, x, y, w, h }
  const isMarqueeActive = useRef(false);

  const dotGridStyle = useDotGridStyle(canvas.gridVisible, canvas.gridSize);

  // ── Canvas background ──────────────────────────────────────────────────────
  let canvasBg = canvas.backgroundColor;
  if (canvas.backgroundMode === "transparent") {
    canvasBg = "transparent";
  }

  // ── Marquee drag on empty canvas ───────────────────────────────────────────
  const onCanvasPointerDown = useCallback(
    (e) => {
      if (e.button !== 0) return;
      // Only fire if click lands directly on canvas, not on a child element
      if (e.target !== canvasRef.current) return;

      setSelectedId(null);

      const rect = canvasRef.current.getBoundingClientRect();
      const startX = e.clientX - rect.left;
      const startY = e.clientY - rect.top;

      isMarqueeActive.current = false;

      const onMove = (me) => {
        const curX = me.clientX - rect.left;
        const curY = me.clientY - rect.top;
        const w = curX - startX;
        const h = curY - startY;

        if (!isMarqueeActive.current && (Math.abs(w) > 4 || Math.abs(h) > 4)) {
          isMarqueeActive.current = true;
        }

        if (isMarqueeActive.current) {
          setMarquee({ startX, startY, x: startX, y: startY, w, h });
        }
      };

      const onUp = () => {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
        isMarqueeActive.current = false;
        setMarquee(null);
      };

      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
    },
    [setSelectedId],
  );

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        usePlaygroundStore.getState().undo();
      }
      if (meta && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        usePlaygroundStore.getState().redo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{
        flex: 1,
        overflow: "auto",
        display: "flex",
        justifyContent: "center",
        padding: 40,
        background: "var(--background)",
        ...dotGridStyle,
      }}
    >
      {/* The canvas surface */}
      <div
        ref={canvasRef}
        style={{
          position: "relative",
          width: canvas.width,
          minHeight: 720,
          flexShrink: 0,
          background: canvasBg,
          boxShadow: previewMode
            ? "none"
            : "0 1px 3px oklch(0 0 0 / 0.08), 0 8px 32px oklch(0 0 0 / 0.06)",
          outline: previewMode ? "none" : "1px solid var(--border)",
          borderRadius: "var(--radius)",
          transition: "width 0.3s ease",
          // Prevent text selection during drag
          userSelect: "none",
        }}
        onPointerDown={onCanvasPointerDown}
      >
        {/* Render all elements sorted by zIndex */}
        {elements.map((el) => (
          <CanvasElement
            key={el.id}
            id={el.id}
            canvasRef={canvasRef}
            snapToGrid={canvas.snapToGrid}
            gridSize={canvas.gridSize}
          />
        ))}

        {/* Selection marquee */}
        <SelectionMarquee rect={marquee} />

        {/* Empty state */}
        {elements.length === 0 && !previewMode && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: "var(--muted-foreground)",
                textTransform: "uppercase",
              }}
            >
              Canvas is empty
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--muted-foreground)",
                opacity: 0.6,
              }}
            >
              Add elements from the panel on the left
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

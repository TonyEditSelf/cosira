// /components/playground/ResizeHandle.jsx
import { useRef, useEffect, useState, useCallback } from "react";

const HANDLE_POSITIONS = [
  {
    id: "nw",
    x: "left",
    y: "top",
    cursor: "nwse-resize",
    axes: "both",
    dx: -1,
    dy: -1,
  },
  {
    id: "n",
    x: "center",
    y: "top",
    cursor: "ns-resize",
    axes: "y",
    dx: 0,
    dy: -1,
  },
  {
    id: "ne",
    x: "right",
    y: "top",
    cursor: "nesw-resize",
    axes: "both",
    dx: 1,
    dy: -1,
  },
  {
    id: "e",
    x: "right",
    y: "center",
    cursor: "ew-resize",
    axes: "x",
    dx: 1,
    dy: 0,
  },
  {
    id: "se",
    x: "right",
    y: "bottom",
    cursor: "nwse-resize",
    axes: "both",
    dx: 1,
    dy: 1,
  },
  {
    id: "s",
    x: "center",
    y: "bottom",
    cursor: "ns-resize",
    axes: "y",
    dx: 0,
    dy: 1,
  },
  {
    id: "sw",
    x: "left",
    y: "bottom",
    cursor: "nesw-resize",
    axes: "both",
    dx: -1,
    dy: 1,
  },
  {
    id: "w",
    x: "left",
    y: "center",
    cursor: "ew-resize",
    axes: "x",
    dx: -1,
    dy: 0,
  },
];

const MIN_W = 40;
const MIN_H = 24;

function getHandleStyle(pos) {
  const SIZE = 10;
  const OFFSET = -5; // center the 10px handle on the edge

  const style = {
    position: "absolute",
    width: SIZE,
    height: SIZE,
    background: "#fff",
    border: "1.5px solid oklch(0.597 0.240854 2.4025)",
    borderRadius: 2,
    zIndex: 1000,
    boxSizing: "border-box",
    cursor: pos.cursor,
  };

  // Horizontal
  if (pos.x === "left") {
    style.left = OFFSET;
  }
  if (pos.x === "right") {
    style.right = OFFSET;
  }
  if (pos.x === "center") {
    style.left = "50%";
    style.marginLeft = OFFSET;
  }

  // Vertical
  if (pos.y === "top") {
    style.top = OFFSET;
  }
  if (pos.y === "bottom") {
    style.bottom = OFFSET;
  }
  if (pos.y === "center") {
    style.top = "50%";
    style.marginTop = OFFSET;
  }

  return style;
}

export default function ResizeHandle({
  elementId,
  initialW,
  initialH,
  initialX,
  initialY,
  onResize,
  onResizeEnd,
  snapToGrid,
  gridSize,
}) {
  const [tooltip, setTooltip] = useState(null); // { w, h, clientX, clientY }

  const snap = useCallback(
    (v) => {
      if (!snapToGrid) return v;
      return Math.round(v / gridSize) * gridSize;
    },
    [snapToGrid, gridSize],
  );

  const startResize = useCallback(
    (e, pos) => {
      e.stopPropagation();
      e.preventDefault();

      const startX = e.clientX;
      const startY = e.clientY;
      const startW = initialW;
      const startH = initialH;
      const startElX = initialX;
      const startElY = initialY;

      const onMove = (me) => {
        const dx = me.clientX - startX;
        const dy = me.clientY - startY;

        let newW = startW;
        let newH = startH;
        let newX = startElX;
        let newY = startElY;

        if (pos.axes === "x" || pos.axes === "both") {
          if (pos.dx === 1) {
            newW = Math.max(MIN_W, snap(startW + dx));
          } else if (pos.dx === -1) {
            const rawW = Math.max(MIN_W, snap(startW - dx));
            newX = startElX + (startW - rawW);
            newW = rawW;
          }
        }

        if (pos.axes === "y" || pos.axes === "both") {
          if (pos.dy === 1) {
            newH = Math.max(MIN_H, snap(startH + dy));
          } else if (pos.dy === -1) {
            const rawH = Math.max(MIN_H, snap(startH - dy));
            newY = startElY + (startH - rawH);
            newH = rawH;
          }
        }

        onResize(elementId, newW, newH, newX, newY);
        setTooltip({
          w: newW,
          h: newH,
          clientX: me.clientX,
          clientY: me.clientY,
        });
      };

      const onUp = () => {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
        onResizeEnd(elementId);
        setTooltip(null);
      };

      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
    },
    [
      elementId,
      initialW,
      initialH,
      initialX,
      initialY,
      onResize,
      onResizeEnd,
      snap,
    ],
  );

  return (
    <>
      {HANDLE_POSITIONS.map((pos) => (
        <div
          key={pos.id}
          style={getHandleStyle(pos)}
          onPointerDown={(e) => startResize(e, pos)}
        />
      ))}

      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: tooltip.clientX + 14,
            top: tooltip.clientY + 14,
            background: "oklch(0.12 0 0 / 0.88)",
            color: "#fff",
            fontSize: 11,
            fontFamily: "ui-monospace, monospace",
            letterSpacing: "0.04em",
            padding: "3px 7px",
            borderRadius: 4,
            pointerEvents: "none",
            zIndex: 9999,
            whiteSpace: "nowrap",
          }}
        >
          {tooltip.w} × {tooltip.h}
        </div>
      )}
    </>
  );
}

"use client";

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import {
  Plus,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  Grid3x3,
  Zap,
  Layers,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION & CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const SPACING_SCALE = [0, 4, 8, 16, 24, 32, 48, 64, 80, 96, 128, 160];
const MAGNETIC_THRESHOLD = 10;
const BASE_UNIT = 8;
const FLOW_GROUP_THRESHOLD = 20; // px - elements within this distance form a flow group
const NEAR_MISS_THRESHOLD = 2; // px - within this range of a token is "near-miss"

const UI_PRIMITIVES = {
  button: {
    minWidth: 80,
    minHeight: 40,
    paddingV: BASE_UNIT * 2, // 16px
    paddingH: BASE_UNIT * 4, // 32px
    defaultWidth: 120,
    defaultHeight: 40,
  },
  checkbox: {
    size: 20,
    labelGap: 8,
    defaultWidth: 20,
    defaultHeight: 20,
  },
  input: {
    minWidth: 200,
    height: 48,
    paddingH: BASE_UNIT * 2,
    defaultWidth: 240,
    defaultHeight: 48,
  },
  box: {
    defaultWidth: 200,
    defaultHeight: 150,
  },
};

const INITIAL_LAYOUT = [
  {
    id: "nav-bar",
    type: "box",
    width: 800,
    height: 64,
    x: 40,
    y: 20,
    label: "Header",
    color: "#1e40af",
  },
  {
    id: "card-1",
    type: "box",
    width: 240,
    height: 300,
    x: 40,
    y: 112,
    label: "Card A",
    color: "#7c3aed",
  },
  {
    id: "card-2",
    type: "box",
    width: 240,
    height: 300,
    x: 300,
    y: 112,
    label: "Card B",
    color: "#7c3aed",
  },
  {
    id: "card-3",
    type: "box",
    width: 240,
    height: 300,
    x: 560,
    y: 125,
    label: "⚠️ Misaligned Card C",
    color: "#dc2626",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

const findNearestToken = (value) => {
  return SPACING_SCALE.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev,
  );
};

const getDistanceToToken = (value) => {
  const nearest = findNearestToken(value);
  return { nearest, distance: Math.abs(value - nearest) };
};

const shouldSnap = (value) => {
  const { distance } = getDistanceToToken(value);
  return distance <= MAGNETIC_THRESHOLD;
};

const snapToToken = (value) => {
  if (shouldSnap(value)) {
    return findNearestToken(value);
  }
  return value;
};

const getTokenName = (value) => {
  const index = SPACING_SCALE.indexOf(value);
  return index !== -1 ? `space-${index}` : null;
};

const elementsOverlap = (el1, el2) => {
  return !(
    el1.x + el1.width <= el2.x ||
    el2.x + el2.width <= el1.x ||
    el1.y + el1.height <= el2.y ||
    el2.y + el2.height <= el1.y
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// GAP DETECTION ENGINE
// ═══════════════════════════════════════════════════════════════════════════

const detectGaps = (elements) => {
  const gaps = [];

  for (let i = 0; i < elements.length; i++) {
    for (let j = i + 1; j < elements.length; j++) {
      const el1 = elements[i];
      const el2 = elements[j];

      // Horizontal gap (side by side)
      const horizontalOverlap = !(
        el1.y + el1.height <= el2.y || el2.y + el2.height <= el1.y
      );
      if (horizontalOverlap) {
        let gap = null;
        if (el1.x + el1.width <= el2.x) {
          // el1 is to the left of el2
          gap = {
            id: `gap-h-${el1.id}-${el2.id}`,
            type: "horizontal",
            x: el1.x + el1.width,
            y: Math.max(el1.y, el2.y),
            width: el2.x - (el1.x + el1.width),
            height:
              Math.min(el1.y + el1.height, el2.y + el2.height) -
              Math.max(el1.y, el2.y),
            elements: [el1.id, el2.id],
          };
        } else if (el2.x + el2.width <= el1.x) {
          // el2 is to the left of el1
          gap = {
            id: `gap-h-${el2.id}-${el1.id}`,
            type: "horizontal",
            x: el2.x + el2.width,
            y: Math.max(el1.y, el2.y),
            width: el1.x - (el2.x + el2.width),
            height:
              Math.min(el1.y + el1.height, el2.y + el2.height) -
              Math.max(el1.y, el2.y),
            elements: [el2.id, el1.id],
          };
        }
        if (gap && gap.width > 0 && gap.height > 0) {
          gaps.push(gap);
        }
      }

      // Vertical gap (stacked)
      const verticalOverlap = !(
        el1.x + el1.width <= el2.x || el2.x + el2.width <= el1.x
      );
      if (verticalOverlap) {
        let gap = null;
        if (el1.y + el1.height <= el2.y) {
          // el1 is above el2
          gap = {
            id: `gap-v-${el1.id}-${el2.id}`,
            type: "vertical",
            x: Math.max(el1.x, el2.x),
            y: el1.y + el1.height,
            width:
              Math.min(el1.x + el1.width, el2.x + el2.width) -
              Math.max(el1.x, el2.x),
            height: el2.y - (el1.y + el1.height),
            elements: [el1.id, el2.id],
          };
        } else if (el2.y + el2.height <= el1.y) {
          // el2 is above el1
          gap = {
            id: `gap-v-${el2.id}-${el1.id}`,
            type: "vertical",
            x: Math.max(el1.x, el2.x),
            y: el2.y + el2.height,
            width:
              Math.min(el1.x + el1.width, el2.x + el2.width) -
              Math.max(el1.x, el2.x),
            height: el1.y - (el2.y + el2.height),
            elements: [el2.id, el1.id],
          };
        }
        if (gap && gap.width > 0 && gap.height > 0) {
          gaps.push(gap);
        }
      }
    }
  }

  return gaps;
};

const getGapStatus = (gapSize) => {
  const { nearest, distance } = getDistanceToToken(gapSize);
  const tokenName = getTokenName(nearest);

  if (distance === 0) {
    return {
      status: "exact",
      color: "#10b981",
      label: "Exact",
      nearest,
      tokenName,
    };
  } else if (distance <= NEAR_MISS_THRESHOLD) {
    return {
      status: "near",
      color: "#f59e0b",
      label: "Near-miss",
      nearest,
      tokenName,
      distance,
    };
  } else if (gapSize < 4) {
    return {
      status: "violation",
      color: "#ef4444",
      label: "Too small",
      nearest: null,
      tokenName: null,
    };
  } else {
    return {
      status: "violation",
      color: "#ef4444",
      label: "Off-grid",
      nearest,
      tokenName,
      distance,
    };
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// FLOW GROUP DETECTION
// ═══════════════════════════════════════════════════════════════════════════

const detectFlowGroups = (elements) => {
  const groups = [];
  const visited = new Set();

  elements.forEach((el, idx) => {
    if (visited.has(el.id)) return;

    const group = [el];
    visited.add(el.id);

    // Find all elements aligned vertically or horizontally within threshold
    elements.forEach((other, otherIdx) => {
      if (otherIdx === idx || visited.has(other.id)) return;

      const horizontallyAligned =
        Math.abs(el.x - other.x) <= FLOW_GROUP_THRESHOLD ||
        Math.abs(el.x + el.width - (other.x + other.width)) <=
          FLOW_GROUP_THRESHOLD;

      const verticallyAligned =
        Math.abs(el.y - other.y) <= FLOW_GROUP_THRESHOLD ||
        Math.abs(el.y + el.height - (other.y + other.height)) <=
          FLOW_GROUP_THRESHOLD;

      if (horizontallyAligned || verticallyAligned) {
        const distance = Math.sqrt(
          Math.pow(el.x - other.x, 2) + Math.pow(el.y - other.y, 2),
        );

        if (distance > 0 && distance <= 400) {
          // reasonable proximity
          group.push(other);
          visited.add(other.id);
        }
      }
    });

    if (group.length > 1) {
      groups.push({
        id: `group-${group.map((g) => g.id).join("-")}`,
        elements: group.map((g) => g.id),
      });
    }
  });

  return groups;
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function SpacingStressTester({ spacingScale = SPACING_SCALE }) {
  // ─────────────────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────────────────

  const [canvasWidth, setCanvasWidth] = useState(1200);
  const [canvasHeight, setCanvasHeight] = useState(800);
  const [elements, setElements] = useState(INITIAL_LAYOUT);
  const [selectedId, setSelectedId] = useState(null);
  const [dragState, setDragState] = useState(null);
  const [resizeState, setResizeState] = useState(null);
  const [magneticSnap, setMagneticSnap] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [enablePhysics, setEnablePhysics] = useState(true);
  const [copied, setCopied] = useState(false);
  const [scale, setScale] = useState(1);

  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const animationFrameRef = useRef(null);

  // ─────────────────────────────────────────────────────────────────────────
  // COMPUTED VALUES
  // ─────────────────────────────────────────────────────────────────────────

  const selectedElement = useMemo(
    () => elements.find((el) => el.id === selectedId),
    [elements, selectedId],
  );

  const gaps = useMemo(() => detectGaps(elements), [elements]);
  const flowGroups = useMemo(() => detectFlowGroups(elements), [elements]);

  const violations = useMemo(() => {
    return elements.map((el) => {
      const xInfo = getDistanceToToken(el.x);
      const yInfo = getDistanceToToken(el.y);
      const wInfo = getDistanceToToken(el.width);
      const hInfo = getDistanceToToken(el.height);

      const issues = [];
      if (xInfo.distance > 0) issues.push({ prop: "x", ...xInfo });
      if (yInfo.distance > 0) issues.push({ prop: "y", ...yInfo });
      if (wInfo.distance > 0) issues.push({ prop: "width", ...wInfo });
      if (hInfo.distance > 0) issues.push({ prop: "height", ...hInfo });

      return {
        id: el.id,
        label: el.label,
        hasViolations: issues.length > 0,
        issues,
      };
    });
  }, [elements]);

  // ─────────────────────────────────────────────────────────────────────────
  // AUTO-SCALE CANVAS
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const updateScale = () => {
      if (!wrapperRef.current) return;
      const { clientWidth, clientHeight } = wrapperRef.current;
      const scaleX = (clientWidth - 80) / canvasWidth;
      const scaleY = (clientHeight - 80) / canvasHeight;
      setScale(Math.min(scaleX, scaleY, 1));
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, [canvasWidth, canvasHeight]);

  // ─────────────────────────────────────────────────────────────────────────
  // COLLISION DETECTION
  // ─────────────────────────────────────────────────────────────────────────

  const checkCollision = (
    movingElement,
    newX,
    newY,
    newWidth,
    newHeight,
    shiftKey,
  ) => {
    if (shiftKey) return false; // Override with Shift key

    const testEl = {
      ...movingElement,
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
    };

    for (const el of elements) {
      if (el.id === movingElement.id) continue;
      if (elementsOverlap(testEl, el)) {
        return true;
      }
    }
    return false;
  };

  // ─────────────────────────────────────────────────────────────────────────
  // FLOW GROUP PHYSICS
  // ─────────────────────────────────────────────────────────────────────────

  const applyFlowPhysics = (movingId, deltaX, deltaY) => {
    const group = flowGroups.find((g) => g.elements.includes(movingId));
    if (!group || !enablePhysics) return;

    const movingEl = elements.find((el) => el.id === movingId);
    const otherEls = group.elements
      .filter((id) => id !== movingId)
      .map((id) => elements.find((el) => el.id === id));

    otherEls.forEach((otherEl) => {
      // Check if elements are vertically stacked
      const isBelow =
        otherEl.y > movingEl.y &&
        Math.abs(otherEl.x - movingEl.x) <= FLOW_GROUP_THRESHOLD;
      const isAbove =
        otherEl.y < movingEl.y &&
        Math.abs(otherEl.x - movingEl.x) <= FLOW_GROUP_THRESHOLD;

      // Check if elements are horizontally aligned
      const isRight =
        otherEl.x > movingEl.x &&
        Math.abs(otherEl.y - movingEl.y) <= FLOW_GROUP_THRESHOLD;
      const isLeft =
        otherEl.x < movingEl.x &&
        Math.abs(otherEl.y - movingEl.y) <= FLOW_GROUP_THRESHOLD;

      if (isBelow && deltaY !== 0) {
        setElements((prev) =>
          prev.map((el) =>
            el.id === otherEl.id
              ? { ...el, y: snapToToken(el.y + deltaY) }
              : el,
          ),
        );
      } else if (isAbove && deltaY !== 0) {
        setElements((prev) =>
          prev.map((el) =>
            el.id === otherEl.id
              ? { ...el, y: snapToToken(el.y + deltaY) }
              : el,
          ),
        );
      } else if (isRight && deltaX !== 0) {
        setElements((prev) =>
          prev.map((el) =>
            el.id === otherEl.id
              ? { ...el, x: snapToToken(el.x + deltaX) }
              : el,
          ),
        );
      } else if (isLeft && deltaX !== 0) {
        setElements((prev) =>
          prev.map((el) =>
            el.id === otherEl.id
              ? { ...el, x: snapToToken(el.x + deltaX) }
              : el,
          ),
        );
      }
    });
  };

  // ─────────────────────────────────────────────────────────────────────────
  // DRAG & RESIZE HANDLERS
  // ─────────────────────────────────────────────────────────────────────────

  const handleMouseDown = useCallback(
    (e, elementId, action = "move") => {
      e.preventDefault();
      e.stopPropagation();

      const element = elements.find((el) => el.id === elementId);
      if (!element) return;

      setSelectedId(elementId);

      const rect = canvasRef.current.getBoundingClientRect();
      const startX = (e.clientX - rect.left) / scale;
      const startY = (e.clientY - rect.top) / scale;

      if (action === "move") {
        setDragState({
          elementId,
          startX,
          startY,
          initialX: element.x,
          initialY: element.y,
          shiftKey: e.shiftKey,
        });
        setResizeState(null);
      } else {
        setResizeState({
          elementId,
          startX,
          startY,
          initialX: element.x,
          initialY: element.y,
          initialWidth: element.width,
          initialHeight: element.height,
          direction: action,
          shiftKey: e.shiftKey,
        });
        setDragState(null);
      }
    },
    [elements, scale],
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const currentX = (e.clientX - rect.left) / scale;
      const currentY = (e.clientY - rect.top) / scale;

      if (dragState) {
        const dx = currentX - dragState.startX;
        const dy = currentY - dragState.startY;

        const movingEl = elements.find((el) => el.id === dragState.elementId);
        if (!movingEl) return;

        let newX = dragState.initialX + dx;
        let newY = dragState.initialY + dy;

        // Magnetic snapping
        if (magneticSnap) {
          newX = snapToToken(newX);
          newY = snapToToken(newY);
        }

        // Boundary constraints
        newX = Math.max(0, Math.min(canvasWidth - movingEl.width, newX));
        newY = Math.max(0, Math.min(canvasHeight - movingEl.height, newY));

        // Collision detection
        if (
          !checkCollision(
            movingEl,
            newX,
            newY,
            movingEl.width,
            movingEl.height,
            e.shiftKey,
          )
        ) {
          const actualDx = newX - movingEl.x;
          const actualDy = newY - movingEl.y;

          setElements((prev) =>
            prev.map((el) =>
              el.id === dragState.elementId ? { ...el, x: newX, y: newY } : el,
            ),
          );

          // Apply flow physics
          if (enablePhysics && (actualDx !== 0 || actualDy !== 0)) {
            requestAnimationFrame(() => {
              applyFlowPhysics(dragState.elementId, actualDx, actualDy);
            });
          }
        }
      } else if (resizeState) {
        const dx = currentX - resizeState.startX;
        const dy = currentY - resizeState.startY;

        const resizingEl = elements.find(
          (el) => el.id === resizeState.elementId,
        );
        if (!resizingEl) return;

        let newX = resizeState.initialX;
        let newY = resizeState.initialY;
        let newW = resizeState.initialWidth;
        let newH = resizeState.initialHeight;

        const dir = resizeState.direction;

        // Calculate new dimensions
        if (dir.includes("e"))
          newW = Math.max(50, resizeState.initialWidth + dx);
        if (dir.includes("s"))
          newH = Math.max(50, resizeState.initialHeight + dy);
        if (dir.includes("w")) {
          const wc = resizeState.initialWidth - dx;
          if (wc >= 50) {
            newW = wc;
            newX = resizeState.initialX + dx;
          }
        }
        if (dir.includes("n")) {
          const hc = resizeState.initialHeight - dy;
          if (hc >= 50) {
            newH = hc;
            newY = resizeState.initialY + dy;
          }
        }

        // Apply primitive constraints
        const primitive = UI_PRIMITIVES[resizingEl.type];
        if (primitive) {
          if (resizingEl.type === "button") {
            newW = Math.max(primitive.minWidth, newW);
            newH = Math.max(primitive.minHeight, newH);
          } else if (resizingEl.type === "checkbox") {
            newW = primitive.size;
            newH = primitive.size;
          } else if (resizingEl.type === "input") {
            newW = Math.max(primitive.minWidth, newW);
            newH = primitive.height;
          }
        }

        // Magnetic snapping for dimensions
        if (magneticSnap) {
          newX = snapToToken(newX);
          newY = snapToToken(newY);
          newW = snapToToken(newW);
          newH = snapToToken(newH);
        }

        // Boundary constraints
        if (newX + newW > canvasWidth) newW = canvasWidth - newX;
        if (newY + newH > canvasHeight) newH = canvasHeight - newY;
        if (newX < 0) {
          newW += newX;
          newX = 0;
        }
        if (newY < 0) {
          newH += newY;
          newY = 0;
        }

        // Collision detection
        if (!checkCollision(resizingEl, newX, newY, newW, newH, e.shiftKey)) {
          setElements((prev) =>
            prev.map((el) =>
              el.id === resizeState.elementId
                ? { ...el, x: newX, y: newY, width: newW, height: newH }
                : el,
            ),
          );
        }
      }
    },
    [
      dragState,
      resizeState,
      elements,
      scale,
      canvasWidth,
      canvasHeight,
      magneticSnap,
      enablePhysics,
    ],
  );

  const handleMouseUp = useCallback(() => {
    setDragState(null);
    setResizeState(null);
  }, []);

  useEffect(() => {
    if (dragState || resizeState) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragState, resizeState, handleMouseMove, handleMouseUp]);

  // ─────────────────────────────────────────────────────────────────────────
  // ELEMENT OPERATIONS
  // ─────────────────────────────────────────────────────────────────────────

  const addElement = (type = "box") => {
    const newId = `element-${Date.now()}`;
    const primitive = UI_PRIMITIVES[type];

    const newElement = {
      id: newId,
      type,
      width: primitive?.defaultWidth || 200,
      height: primitive?.defaultHeight || 150,
      x: 50,
      y: 50,
      label:
        type === "button"
          ? "Button"
          : type === "checkbox"
            ? "☑"
            : type === "input"
              ? "Input Field"
              : `Element ${elements.length + 1}`,
      color:
        type === "button"
          ? "#3b82f6"
          : type === "checkbox"
            ? "#22c55e"
            : type === "input"
              ? "#a855f7"
              : "#6366f1",
    };
    setElements((prev) => [...prev, newElement]);
    setSelectedId(newId);
  };

  const deleteElement = (id) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // CSS GENERATION
  // ─────────────────────────────────────────────────────────────────────────

  const generateCSS = () => {
    let css = `.canvas {\n  position: relative;\n  width: ${canvasWidth}px;\n  height: ${canvasHeight}px;\n}\n\n`;

    elements.forEach((el) => {
      const xToken = getTokenName(el.x);
      const yToken = getTokenName(el.y);
      const wToken = getTokenName(el.width);
      const hToken = getTokenName(el.height);

      css += `.${el.id} {\n`;
      css += `  position: absolute;\n`;
      css += `  left: ${el.x}px;${xToken ? ` /* ${xToken} */` : " ⚠️ NOT ON GRID"}\n`;
      css += `  top: ${el.y}px;${yToken ? ` /* ${yToken} */` : " ⚠️ NOT ON GRID"}\n`;
      css += `  width: ${el.width}px;${wToken ? ` /* ${wToken} */` : " ⚠️ NOT ON GRID"}\n`;
      css += `  height: ${el.height}px;${hToken ? ` /* ${hToken} */` : " ⚠️ NOT ON GRID"}\n`;

      // Add primitive-specific CSS
      if (el.type === "button") {
        const prim = UI_PRIMITIVES.button;
        css += `  padding: ${prim.paddingV}px ${prim.paddingH}px; /* Internal padding */\n`;
      } else if (el.type === "checkbox") {
        const prim = UI_PRIMITIVES.checkbox;
        css += `  /* Checkbox size: ${prim.size}px × ${prim.size}px (locked) */\n`;
        css += `  /* Label gap: ${prim.labelGap}px */\n`;
      } else if (el.type === "input") {
        const prim = UI_PRIMITIVES.input;
        css += `  padding: 0 ${prim.paddingH}px;\n`;
      }

      css += `}\n\n`;
    });

    return css;
  };

  const copyCSS = () => {
    navigator.clipboard.writeText(generateCSS());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  const scaledW = canvasWidth * scale;
  const scaledH = canvasHeight * scale;

  const totalViolations = violations.filter((v) => v.hasViolations).length;
  const gapStats = useMemo(() => {
    const stats = { exact: 0, near: 0, violation: 0 };
    gaps.forEach((gap) => {
      const size = gap.type === "horizontal" ? gap.width : gap.height;
      const status = getGapStatus(size);
      stats[status.status]++;
    });
    return stats;
  }, [gaps]);

  return (
    <div
      className="flex flex-col gap-3 w-full min-h-screen p-4"
      style={{
        background: "var(--bg-canvas, #080808)",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <style jsx global>{`
        :root {
          --bg-canvas: #080808;
          --bg-sidebar: #111111;
          --bg-elevated: #1a1a1a;
          --border-subtle: rgba(255, 255, 255, 0.08);
          --border-strong: rgba(255, 255, 255, 0.15);
          --accent-primary: #ffffff;
          --accent-blue: #3b82f6;
          --text-primary: #ffffff;
          --text-secondary: #a1a1aa;
          --text-dim: #71717a;
          --grid-line: rgba(255, 255, 255, 0.03);
          --danger: #ef4444;
          --success: #22c55e;
          --warning: #f59e0b;
        }

        * {
          box-sizing: border-box;
        }

        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap");
      `}</style>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* HEADER BAR */}
      {/* ══════════════════════════════════════════════════════════════════ */}

      <div
        className="flex items-center justify-between px-5 py-3 rounded-lg"
        style={{
          background: "var(--bg-sidebar)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Grid3x3 size={18} style={{ color: "var(--accent-blue)" }} />
            <h1
              className="font-bold text-base tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Spacing System Stress-Tester
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{
                background:
                  totalViolations > 0
                    ? "rgba(239, 68, 68, 0.1)"
                    : "rgba(34, 197, 94, 0.1)",
                color: totalViolations > 0 ? "var(--danger)" : "var(--success)",
                border: `1px solid ${totalViolations > 0 ? "rgba(239, 68, 68, 0.3)" : "rgba(34, 197, 94, 0.3)"}`,
              }}
            >
              {totalViolations > 0
                ? `⚠️ ${totalViolations} Violations`
                : "✓ All Aligned"}
            </div>

            {showHeatmap && (
              <div
                className="text-xs px-2.5 py-1 rounded-full font-medium font-mono"
                style={{
                  background: "rgba(59, 130, 246, 0.1)",
                  color: "var(--accent-blue)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                }}
              >
                Gaps: ✓{gapStats.exact} ~{gapStats.near} ⚠{gapStats.violation}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
              className="w-4 h-4"
              style={{ accentColor: "var(--accent-blue)" }}
            />
            <span
              className="text-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              Grid
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showHeatmap}
              onChange={(e) => setShowHeatmap(e.target.checked)}
              className="w-4 h-4"
              style={{ accentColor: "var(--accent-blue)" }}
            />
            <span
              className="text-xs flex items-center gap-1"
              style={{ color: "var(--text-secondary)" }}
            >
              <Layers size={12} /> Heatmap
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={magneticSnap}
              onChange={(e) => setMagneticSnap(e.target.checked)}
              className="w-4 h-4"
              style={{ accentColor: "var(--accent-blue)" }}
            />
            <span
              className="text-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              Magnetic (10px)
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={enablePhysics}
              onChange={(e) => setEnablePhysics(e.target.checked)}
              className="w-4 h-4"
              style={{ accentColor: "var(--accent-blue)" }}
            />
            <span
              className="text-xs flex items-center gap-1"
              style={{ color: "var(--text-secondary)" }}
            >
              <Zap size={12} /> Flow Physics
            </span>
          </label>

          <div
            className="text-xs font-mono"
            style={{ color: "var(--text-dim)" }}
          >
            {Math.round(scale * 100)}%
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* MAIN LAYOUT */}
      {/* ══════════════════════════════════════════════════════════════════ */}

      <div className="flex gap-3 flex-1" style={{ minHeight: 0 }}>
        {/* ══════════════════════════════════════════════════════════════ */}
        {/* LEFT SIDEBAR */}
        {/* ══════════════════════════════════════════════════════════════ */}

        <div
          className="flex flex-col gap-3 w-72 flex-shrink-0"
          style={{
            background: "var(--bg-sidebar)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "8px",
            padding: "16px",
          }}
        >
          {/* Add Element Buttons */}
          <div>
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: "var(--text-dim)" }}
            >
              Add UI Primitive
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => addElement("button")}
                className="px-2.5 py-1.5 text-xs rounded font-medium transition-all"
                style={{
                  background: "rgba(59, 130, 246, 0.1)",
                  color: "var(--accent-blue)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                }}
              >
                Button
              </button>
              <button
                onClick={() => addElement("input")}
                className="px-2.5 py-1.5 text-xs rounded font-medium transition-all"
                style={{
                  background: "rgba(168, 85, 247, 0.1)",
                  color: "#a855f7",
                  border: "1px solid rgba(168, 85, 247, 0.3)",
                }}
              >
                Input
              </button>
              <button
                onClick={() => addElement("checkbox")}
                className="px-2.5 py-1.5 text-xs rounded font-medium transition-all"
                style={{
                  background: "rgba(34, 197, 94, 0.1)",
                  color: "var(--success)",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                }}
              >
                Checkbox
              </button>
              <button
                onClick={() => addElement("box")}
                className="px-2.5 py-1.5 text-xs rounded font-medium transition-all"
                style={{
                  background: "rgba(99, 102, 241, 0.1)",
                  color: "#6366f1",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                }}
              >
                Box
              </button>
            </div>
          </div>

          {/* Elements List */}
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <h2
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--text-dim)" }}
              >
                Elements ({elements.length})
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {elements.map((el) => {
                const violation = violations.find((v) => v.id === el.id);
                const isSelected = selectedId === el.id;
                const primitive = UI_PRIMITIVES[el.type];

                return (
                  <div
                    key={el.id}
                    onClick={() => setSelectedId(el.id)}
                    className="p-3 rounded cursor-pointer transition-all"
                    style={{
                      background: isSelected
                        ? "var(--bg-elevated)"
                        : "transparent",
                      border: `1px solid ${isSelected ? "var(--accent-blue)" : "var(--border-subtle)"}`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs font-semibold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {el.label}
                        </span>
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded font-mono"
                          style={{
                            background: `${el.color}22`,
                            color: el.color,
                          }}
                        >
                          {el.type}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteElement(el.id);
                        }}
                        className="p-0.5 transition-colors"
                        style={{ color: "var(--text-dim)" }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <div
                      className="text-[10px] font-mono mb-1"
                      style={{ color: "var(--text-dim)" }}
                    >
                      x:{el.x} y:{el.y} • {el.width}×{el.height}
                    </div>

                    {primitive && el.type === "button" && (
                      <div
                        className="text-[9px] mt-1.5 p-1.5 rounded"
                        style={{
                          background: "rgba(59, 130, 246, 0.05)",
                          color: "var(--accent-blue)",
                        }}
                      >
                        Padding: {primitive.paddingV}px × {primitive.paddingH}px
                      </div>
                    )}

                    {primitive && el.type === "checkbox" && (
                      <div
                        className="text-[9px] mt-1.5 p-1.5 rounded"
                        style={{
                          background: "rgba(34, 197, 94, 0.05)",
                          color: "var(--success)",
                        }}
                      >
                        Size: {primitive.size}px (locked)
                      </div>
                    )}

                    {violation?.hasViolations && (
                      <div
                        className="flex items-start gap-1.5 mt-2 p-2 rounded text-[9px]"
                        style={{
                          background: "rgba(239, 68, 68, 0.05)",
                          border: "1px solid rgba(239, 68, 68, 0.2)",
                        }}
                      >
                        <AlertCircle
                          size={10}
                          style={{
                            color: "var(--danger)",
                            marginTop: 1,
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ color: "var(--danger)" }}>
                          {violation.issues.map((issue, i) => (
                            <div key={i}>
                              {issue.prop}: {issue.distance}px from{" "}
                              {issue.nearest}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Spacing Scale Reference */}
          <div
            className="p-3 rounded"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <h3
              className="text-[10px] font-bold uppercase tracking-wider mb-2"
              style={{ color: "var(--text-dim)" }}
            >
              Spacing Scale (8pt)
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {SPACING_SCALE.map((value, i) => (
                <div
                  key={i}
                  className="px-2 py-1 rounded text-[9px] font-mono"
                  style={{
                    background: "rgba(59, 130, 246, 0.1)",
                    color: "var(--accent-blue)",
                    border: "1px solid rgba(59, 130, 246, 0.2)",
                  }}
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* CANVAS */}
        {/* ══════════════════════════════════════════════════════════════ */}

        <div
          ref={wrapperRef}
          className="flex-1 flex items-center justify-center rounded-lg overflow-hidden relative"
          style={{
            background: "var(--bg-sidebar)",
            border: "1px solid var(--border-subtle)",
            minHeight: 0,
          }}
        >
          <div
            style={{
              width: scaledW,
              height: scaledH,
              position: "relative",
              flexShrink: 0,
            }}
          >
            <div
              ref={canvasRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: canvasWidth,
                height: canvasHeight,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                background: "var(--bg-canvas)",
                backgroundImage: showGrid
                  ? `
                    linear-gradient(var(--grid-line) 1px, transparent 1px),
                    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px),
                    linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
                  `
                  : "none",
                backgroundSize: showGrid
                  ? "8px 8px, 8px 8px, 64px 64px, 64px 64px"
                  : "auto",
                border: "2px solid var(--border-strong)",
                overflow: "visible",
                cursor: dragState || resizeState ? "grabbing" : "default",
              }}
              onClick={() => setSelectedId(null)}
            >
              {/* ═══════════════════════════════════════════════════ */}
              {/* HEATMAP LAYER - GAP VISUALIZATION */}
              {/* ═══════════════════════════════════════════════════ */}

              {showHeatmap &&
                gaps.map((gap) => {
                  const size =
                    gap.type === "horizontal" ? gap.width : gap.height;
                  const status = getGapStatus(size);

                  return (
                    <div
                      key={gap.id}
                      style={{
                        position: "absolute",
                        left: gap.x,
                        top: gap.y,
                        width: gap.width,
                        height: gap.height,
                        background: `${status.color}22`,
                        border: `1px dashed ${status.color}88`,
                        pointerEvents: "none",
                        zIndex: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "9px",
                          fontFamily: "JetBrains Mono, monospace",
                          color: status.color,
                          background: "var(--bg-canvas)",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          border: `1px solid ${status.color}`,
                          whiteSpace: "nowrap",
                          fontWeight: 600,
                        }}
                      >
                        {Math.round(size)}px
                        {status.tokenName && ` | ${status.tokenName}`}
                      </div>
                    </div>
                  );
                })}

              {/* ═══════════════════════════════════════════════════ */}
              {/* ELEMENTS */}
              {/* ═══════════════════════════════════════════════════ */}

              {elements.map((el) => {
                const isSelected = selectedId === el.id;
                const violation = violations.find((v) => v.id === el.id);
                const primitive = UI_PRIMITIVES[el.type];

                return (
                  <div
                    key={el.id}
                    style={{
                      position: "absolute",
                      left: el.x,
                      top: el.y,
                      width: el.width,
                      height: el.height,
                      background: `${el.color}33`,
                      border: `2px solid ${isSelected ? "#3b82f6" : violation?.hasViolations ? "#ef4444" : el.color}`,
                      borderRadius: "6px",
                      overflow: "visible",
                      cursor: "grab",
                      zIndex: isSelected ? 100 : 1,
                      transition: "border-color 0.2s",
                    }}
                    onMouseDown={(e) => handleMouseDown(e, el.id, "move")}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(el.id);
                    }}
                  >
                    {/* Label */}
                    <div
                      style={{
                        position: "absolute",
                        inset:
                          primitive && el.type === "button"
                            ? `${primitive.paddingV}px ${primitive.paddingH}px`
                            : 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: "4px",
                        pointerEvents: "none",
                        userSelect: "none",
                        border:
                          primitive && el.type === "button"
                            ? "1px dashed rgba(59, 130, 246, 0.3)"
                            : "none",
                        borderRadius:
                          primitive && el.type === "button" ? "4px" : "0",
                      }}
                    >
                      <div
                        style={{
                          fontSize: el.type === "checkbox" ? "16px" : "11px",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                        }}
                      >
                        {el.label}
                      </div>
                      {el.type !== "checkbox" && (
                        <div
                          style={{
                            fontSize: "9px",
                            fontFamily: "JetBrains Mono, monospace",
                            color: "var(--text-secondary)",
                            textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                          }}
                        >
                          {el.width} × {el.height}
                        </div>
                      )}
                      {primitive && el.type === "button" && (
                        <div
                          style={{
                            fontSize: "8px",
                            fontFamily: "JetBrains Mono, monospace",
                            color: "rgba(59, 130, 246, 0.8)",
                            marginTop: "2px",
                          }}
                        >
                          ↕{primitive.paddingV}px ↔{primitive.paddingH}px
                        </div>
                      )}
                    </div>

                    {/* Violation Warning */}
                    {violation?.hasViolations && (
                      <div
                        style={{
                          position: "absolute",
                          top: "-8px",
                          right: "-8px",
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          background: "var(--danger)",
                          border: "2px solid var(--bg-canvas)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "10px",
                          pointerEvents: "none",
                        }}
                      >
                        ⚠️
                      </div>
                    )}

                    {/* Resize Handles */}
                    {isSelected && el.type !== "checkbox" && (
                      <>
                        {/* Corners */}
                        {["nw", "ne", "sw", "se"].map((dir) => (
                          <div
                            key={dir}
                            style={{
                              position: "absolute",
                              width: "12px",
                              height: "12px",
                              background: "white",
                              border: "2.5px solid #3b82f6",
                              borderRadius: "50%",
                              [dir.includes("n") ? "top" : "bottom"]: "-6px",
                              [dir.includes("w") ? "left" : "right"]: "-6px",
                              cursor: `${dir}-resize`,
                              zIndex: 200,
                              pointerEvents: "auto",
                            }}
                            onMouseDown={(e) =>
                              handleMouseDown(e, el.id, `resize-${dir}`)
                            }
                          />
                        ))}

                        {/* Edges */}
                        {(el.type !== "input"
                          ? ["n", "s", "w", "e"]
                          : ["w", "e"]
                        ).map((dir) => (
                          <div
                            key={dir}
                            style={{
                              position: "absolute",
                              background: "#3b82f6",
                              border: "2px solid white",
                              borderRadius: "2px",
                              zIndex: 200,
                              pointerEvents: "auto",
                              ...(["n", "s"].includes(dir)
                                ? {
                                    width: "20px",
                                    height: "10px",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    [dir === "n" ? "top" : "bottom"]: "-5px",
                                    cursor: `${dir}-resize`,
                                  }
                                : {
                                    width: "10px",
                                    height: "20px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    [dir === "w" ? "left" : "right"]: "-5px",
                                    cursor: `${dir}-resize`,
                                  }),
                            }}
                            onMouseDown={(e) =>
                              handleMouseDown(e, el.id, `resize-${dir}`)
                            }
                          />
                        ))}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* CSS OUTPUT */}
      {/* ══════════════════════════════════════════════════════════════════ */}

      <div
        className="rounded-lg overflow-hidden"
        style={{
          background: "var(--bg-sidebar)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div
          className="flex items-center justify-between px-4 py-2.5"
          style={{
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <h2
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "var(--text-dim)" }}
          >
            Generated CSS
          </h2>
          <button
            onClick={copyCSS}
            className="px-3 py-1.5 text-xs rounded font-medium flex items-center gap-2 transition-all"
            style={{
              background: "var(--accent-blue)",
              color: "white",
            }}
          >
            {copied ? (
              <>
                <Check size={12} /> Copied!
              </>
            ) : (
              <>
                <Copy size={12} /> Copy CSS
              </>
            )}
          </button>
        </div>
        <div
          className="p-4 overflow-x-auto"
          style={{ background: "#0a0a0a", maxHeight: "300px" }}
        >
          <pre
            className="text-[10px] leading-relaxed"
            style={{
              fontFamily: "JetBrains Mono, monospace",
              color: "#22c55e",
            }}
          >
            {generateCSS()}
          </pre>
        </div>
      </div>
    </div>
  );
}

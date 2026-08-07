// /components/playground/CanvasElement.jsx
import { memo, useRef, useState, useCallback, useEffect } from "react";
import { usePlaygroundStore } from "@/store/playgroundStore";
import ResizeHandle from "./ResizeHandle";

// ─── Type badge labels ────────────────────────────────────────────────────────
const TYPE_LABELS = {
  heading1: "H1",
  heading2: "H2",
  heading3: "H3",
  paragraph: "P",
  link: "LNK",
  button: "BTN",
  badge: "BDG",
  image: "IMG",
  divider: "DIV",
};

// ─── Element content renderer ─────────────────────────────────────────────────
function ElementContent({ el, isEditing, onTextChange }) {
  const editRef = useRef(null);

  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.focus();
      // Place cursor at end
      const range = document.createRange();
      range.selectNodeContents(editRef.current);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, [isEditing]);

  const textStyle = {
    fontFamily: el.fontFamily,
    fontWeight: el.fontWeight,
    fontSize: el.fontSize,
    lineHeight: el.lineHeight,
    letterSpacing: `${el.letterSpacing}em`,
    textAlign: el.textAlign,
    textTransform: el.textTransform,
    color: el.color,
    margin: 0,
    padding: 0,
    width: "100%",
    outline: "none",
    background: "transparent",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  };

  if (el.type === "image") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          borderRadius: "inherit",
        }}
      >
        {el.src ? (
          <img
            src={el.src}
            alt={el.altText}
            style={{
              width: "100%",
              height: "100%",
              objectFit: el.objectFit,
              display: "block",
            }}
            draggable={false}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "var(--muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--muted-foreground)",
              fontSize: 12,
            }}
          >
            Click to add image
          </div>
        )}
      </div>
    );
  }

  if (el.type === "divider") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: el.backgroundColor,
          borderRadius: 9999,
        }}
      />
    );
  }

  if (el.type === "button") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: el.backgroundColor,
          borderRadius: "var(--radius)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...textStyle,
          ...(isEditing ? {} : { cursor: "inherit" }),
        }}
        ref={isEditing ? editRef : null}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onInput={
          isEditing
            ? (e) => onTextChange(e.currentTarget.textContent)
            : undefined
        }
      >
        {isEditing ? undefined : el.text}
      </div>
    );
  }

  if (el.type === "badge") {
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: el.backgroundColor,
          borderRadius: 9999,
          padding: "0 10px",
          height: "100%",
          ...textStyle,
        }}
        ref={isEditing ? editRef : null}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onInput={
          isEditing
            ? (e) => onTextChange(e.currentTarget.textContent)
            : undefined
        }
      >
        {isEditing ? undefined : el.text}
      </div>
    );
  }

  // Text elements (heading, paragraph, link)
  return (
    <div
      ref={isEditing ? editRef : null}
      contentEditable={isEditing}
      suppressContentEditableWarning
      style={textStyle}
      onInput={
        isEditing ? (e) => onTextChange(e.currentTarget.textContent) : undefined
      }
    >
      {isEditing ? undefined : el.text}
    </div>
  );
}

// ─── Canvas Element ───────────────────────────────────────────────────────────
const CanvasElement = memo(function CanvasElement({
  id,
  canvasRef,
  snapToGrid,
  gridSize,
}) {
  // Read only this element's data — won't re-render when others change
  const el = usePlaygroundStore((s) => s.elements.find((e) => e.id === id));
  const isSelected = usePlaygroundStore((s) => s.ui.selectedId === id);
  const setSelectedId = usePlaygroundStore((s) => s.setSelectedId);
  const moveElement = usePlaygroundStore((s) => s.moveElement);
  const resizeElement = usePlaygroundStore((s) => s.resizeElement);
  const updateElement = usePlaygroundStore((s) => s.updateElement);
  const _snapshot = usePlaygroundStore((s) => s._snapshot);

  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [livePos, setLivePos] = useState(null); // { x, y, w, h } during drag
  const isDragging = useRef(false);
  const dragStart = useRef(null);

  if (!el) return null;

  const snap = useCallback(
    (v) => {
      if (!snapToGrid) return v;
      return Math.round(v / gridSize) * gridSize;
    },
    [snapToGrid, gridSize],
  );

  // ── Drag ───────────────────────────────────────────────────────────────────
  const onPointerDown = useCallback(
    (e) => {
      if (el.locked) return;
      if (isEditing) return;
      if (e.button !== 0) return;
      e.stopPropagation();

      setSelectedId(id);

      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      dragStart.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        elX: el.x,
        elY: el.y,
      };
      isDragging.current = false;

      const onMove = (me) => {
        const dx = me.clientX - dragStart.current.clientX;
        const dy = me.clientY - dragStart.current.clientY;

        if (!isDragging.current && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
          isDragging.current = true;
          _snapshot();
        }

        if (isDragging.current) {
          const newX = snap(dragStart.current.elX + dx);
          const newY = snap(dragStart.current.elY + dy);
          setLivePos({ x: newX, y: newY, w: el.width, h: el.height });
        }
      };

      const onUp = () => {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);

        if (isDragging.current && livePos) {
          moveElement(id, livePos.x, livePos.y);
        }
        isDragging.current = false;
        dragStart.current = null;
        setLivePos(null);
      };

      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
    },
    [
      el,
      id,
      isEditing,
      snap,
      setSelectedId,
      moveElement,
      _snapshot,
      livePos,
      canvasRef,
    ],
  );

  // ── Double-click: inline edit ──────────────────────────────────────────────
  const onDoubleClick = useCallback(
    (e) => {
      if (el.locked) return;
      const textTypes = [
        "heading1",
        "heading2",
        "heading3",
        "paragraph",
        "link",
        "button",
        "badge",
      ];
      if (!textTypes.includes(el.type)) return;
      e.stopPropagation();
      setIsEditing(true);
    },
    [el],
  );

  // ── Click outside to exit edit ─────────────────────────────────────────────
  useEffect(() => {
    if (!isEditing) return;
    const handler = (e) => {
      setIsEditing(false);
    };
    // Small delay so the dblclick doesn't immediately close it
    const id_ = setTimeout(
      () => document.addEventListener("pointerdown", handler),
      200,
    );
    return () => {
      clearTimeout(id_);
      document.removeEventListener("pointerdown", handler);
    };
  }, [isEditing]);

  // ── Resize callbacks ───────────────────────────────────────────────────────
  const onResize = useCallback((elId, w, h, x, y) => {
    setLivePos({ x, y, w, h });
  }, []);

  const onResizeEnd = useCallback(
    (elId) => {
      if (livePos) {
        resizeElement(elId, livePos.w, livePos.h);
        moveElement(elId, livePos.x, livePos.y);
      }
      setLivePos(null);
    },
    [livePos, resizeElement, moveElement],
  );

  const onTextChange = useCallback(
    (text) => {
      updateElement(id, { text });
    },
    [id, updateElement],
  );

  // ── Computed geometry ──────────────────────────────────────────────────────
  const x = livePos?.x ?? el.x;
  const y = livePos?.y ?? el.y;
  const w = livePos?.w ?? el.width;
  const h = livePos?.h ?? el.height;

  const baseStyle = {
    position: "absolute",
    left: x,
    top: y,
    width: w,
    height: h,
    zIndex: isSelected ? 9998 : el.zIndex,
    opacity: el.visible ? 1 : 0.3,
    cursor: el.locked
      ? "not-allowed"
      : isDragging.current
        ? "grabbing"
        : "grab",
    userSelect: isEditing ? "text" : "none",
    boxSizing: "border-box",
    outline: isSelected ? "2px solid oklch(0.597 0.240854 2.4025)" : "none",
    outlineOffset: 1,
    borderRadius: ["button", "badge"].includes(el.type) ? "var(--radius)" : 0,
    background:
      el.type !== "button" && el.type !== "badge"
        ? el.backgroundColor
        : undefined,
    display: "flex",
    alignItems: el.type === "divider" ? "center" : "flex-start",
    overflow: "visible",
  };

  return (
    <div
      style={baseStyle}
      onPointerDown={onPointerDown}
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedId(id);
      }}
    >
      {/* Invisible overlay for locked elements */}
      {!el.visible && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 4px, oklch(0.5 0 0 / 0.15) 4px, oklch(0.5 0 0 / 0.15) 6px)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Type badge on hover */}
      {isHovered && !isEditing && (
        <div
          style={{
            position: "absolute",
            top: -22,
            left: 0,
            background: "oklch(0.597 0.240854 2.4025)",
            color: "#fff",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.08em",
            padding: "2px 6px",
            borderRadius: "3px 3px 0 0",
            pointerEvents: "none",
            zIndex: 9999,
            whiteSpace: "nowrap",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          {TYPE_LABELS[el.type] ?? el.type.toUpperCase()}
          {el.locked && " 🔒"}
        </div>
      )}

      {/* Lock icon */}
      {el.locked && (
        <div
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            fontSize: 10,
            lineHeight: 1,
            opacity: 0.6,
            pointerEvents: "none",
            zIndex: 3,
          }}
        >
          🔒
        </div>
      )}

      {/* Content */}
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        <ElementContent
          el={el}
          isEditing={isEditing}
          onTextChange={onTextChange}
        />
      </div>

      {/* Resize handles */}
      {isSelected && !el.locked && !isEditing && (
        <ResizeHandle
          elementId={id}
          initialW={w}
          initialH={h}
          initialX={x}
          initialY={y}
          onResize={onResize}
          onResizeEnd={onResizeEnd}
          snapToGrid={snapToGrid}
          gridSize={gridSize}
        />
      )}
    </div>
  );
});

export default CanvasElement;

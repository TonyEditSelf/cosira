"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Type,
  AlignLeft,
  Link2,
  Image,
  Square,
  Tag,
  Minus,
  GripVertical,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Plus,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { usePlaygroundStore } from "@/store/playgroundStore";

// ─── Type icon map ────────────────────────────────────────────────────────────
const TYPE_ICONS = {
  heading1: Type,
  heading2: Type,
  heading3: Type,
  paragraph: AlignLeft,
  link: Link2,
  image: Image,
  button: Square,
  badge: Tag,
  divider: Minus,
};

const TYPE_LABELS = {
  heading1: "H1",
  heading2: "H2",
  heading3: "H3",
  paragraph: "P",
  link: "Link",
  image: "Img",
  button: "Btn",
  badge: "Badge",
  divider: "Div",
};

// ─── Element library presets ──────────────────────────────────────────────────
const LIBRARY_ITEMS = [
  {
    type: "heading1",
    label: "H1 Hero",
    defaults: { text: "Hero Headline", fontSize: 64, fontWeight: 700 },
  },
  {
    type: "heading2",
    label: "H2 Section title",
    defaults: { text: "Section Title", fontSize: 40, fontWeight: 600 },
  },
  {
    type: "heading3",
    label: "H3 Card title",
    defaults: { text: "Card Title", fontSize: 24, fontWeight: 600 },
  },
  {
    type: "paragraph",
    label: "Body text",
    defaults: {
      text: "Body copy goes here. Keep it concise and clear.",
      fontSize: 16,
    },
  },
  {
    type: "paragraph",
    label: "Caption",
    defaults: {
      text: "Caption text",
      fontSize: 12,
      color: "var(--muted-foreground)",
    },
  },
  {
    type: "link",
    label: "Link",
    defaults: { text: "Click here →", fontSize: 16 },
  },
  {
    type: "button",
    label: "CTA Button",
    defaults: { text: "Get Started", fontSize: 16, fontWeight: 600 },
  },
  {
    type: "image",
    label: "Hero image (16:9)",
    defaults: { aspectRatio: "16/9", width: 640, height: 360 },
  },
  {
    type: "image",
    label: "Card image (4:3)",
    defaults: { aspectRatio: "4/3", width: 320, height: 240 },
  },
  {
    type: "image",
    label: "Avatar (1:1)",
    defaults: { aspectRatio: "1/1", width: 80, height: 80 },
  },
  { type: "divider", label: "Divider", defaults: { width: 400, height: 2 } },
  {
    type: "badge",
    label: "Badge",
    defaults: { text: "New", fontSize: 12, fontWeight: 600 },
  },
];

// ─── Sortable row ─────────────────────────────────────────────────────────────
function LayerRow({ element }) {
  const selectedId = usePlaygroundStore((s) => s.ui.selectedId);
  const setSelectedId = usePlaygroundStore((s) => s.setSelectedId);
  const updateElement = usePlaygroundStore((s) => s.updateElement);
  const [editing, setEditing] = useState(false);
  const [labelVal, setLabelVal] = useState(element.label || element.type);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const isSelected = selectedId === element.id;
  const Icon = TYPE_ICONS[element.type] || Square;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 10px",
    cursor: "pointer",
    borderLeft: isSelected ? "3px solid var(--brand)" : "3px solid transparent",
    background: isSelected
      ? "color-mix(in srgb, var(--brand) 10%, transparent)"
      : "transparent",
    borderRadius: "0 6px 6px 0",
    userSelect: "none",
  };

  const commitLabel = () => {
    setEditing(false);
    updateElement(element.id, { label: labelVal });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => setSelectedId(element.id)}
    >
      {/* Drag handle */}
      <span
        {...attributes}
        {...listeners}
        style={{
          color: "var(--muted-foreground)",
          cursor: "grab",
          display: "flex",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical size={14} />
      </span>

      {/* Type icon */}
      <span
        style={{
          color: "var(--muted-foreground)",
          display: "flex",
          minWidth: 14,
        }}
      >
        <Icon size={14} />
      </span>

      {/* Label */}
      {editing ? (
        <input
          autoFocus
          value={labelVal}
          onChange={(e) => setLabelVal(e.target.value)}
          onBlur={commitLabel}
          onKeyDown={(e) => e.key === "Enter" && commitLabel()}
          onClick={(e) => e.stopPropagation()}
          style={{
            flex: 1,
            fontSize: 12,
            background: "var(--input)",
            border: "1px solid var(--border)",
            borderRadius: 4,
            padding: "1px 6px",
            color: "var(--foreground)",
            outline: "none",
          }}
        />
      ) : (
        <span
          style={{
            flex: 1,
            fontSize: 12,
            color: "var(--foreground)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setEditing(true);
          }}
        >
          {element.label || TYPE_LABELS[element.type] || element.type}
        </span>
      )}

      {/* Visibility toggle */}
      <button
        style={{
          display: "flex",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--muted-foreground)",
          padding: 2,
        }}
        onClick={(e) => {
          e.stopPropagation();
          updateElement(element.id, { visible: !element.visible });
        }}
        title={element.visible ? "Hide" : "Show"}
      >
        {element.visible !== false ? <Eye size={13} /> : <EyeOff size={13} />}
      </button>

      {/* Lock toggle */}
      <button
        style={{
          display: "flex",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--muted-foreground)",
          padding: 2,
        }}
        onClick={(e) => {
          e.stopPropagation();
          updateElement(element.id, { locked: !element.locked });
        }}
        title={element.locked ? "Unlock" : "Lock"}
      >
        {element.locked ? <Lock size={13} /> : <Unlock size={13} />}
      </button>
    </div>
  );
}

// ─── Library item preview ─────────────────────────────────────────────────────
function LibraryItem({ item, onAdd }) {
  const Icon = TYPE_ICONS[item.type] || Square;
  return (
    <button
      onClick={() => onAdd(item)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "100%",
        padding: "7px 12px",
        background: "none",
        border: "none",
        cursor: "pointer",
        borderRadius: 6,
        textAlign: "left",
        transition: "background 0.12s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--muted)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
    >
      <span style={{ color: "var(--muted-foreground)", display: "flex" }}>
        <Icon size={14} />
      </span>
      <span style={{ fontSize: 12, color: "var(--foreground)" }}>
        {item.label}
      </span>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function LayersPanel() {
  const elements = usePlaygroundStore((s) => s.elements);
  const addElement = usePlaygroundStore((s) => s.addElement);
  const reorderZ = usePlaygroundStore((s) => s.reorderZ);
  const [libOpen, setLibOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  // Sorted by zIndex descending for display
  const sorted = [...elements].sort(
    (a, b) => (b.zIndex ?? 0) - (a.zIndex ?? 0),
  );

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = sorted.findIndex((e) => e.id === active.id);
    const newIndex = sorted.findIndex((e) => e.id === over.id);
    const reordered = arrayMove(sorted, oldIndex, newIndex);
    // Reassign zIndex based on new order (first in array = highest z)
    reordered.forEach((el, i) => {
      reorderZ(el.id, reordered.length - i);
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* ── Layers section ── */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 12px 6px",
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "var(--muted-foreground)",
            }}
          >
            LAYERS
          </span>
          <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>
            {elements.length} element{elements.length !== 1 ? "s" : ""}
          </span>
        </div>

        {elements.length === 0 ? (
          <p
            style={{
              fontSize: 12,
              color: "var(--muted-foreground)",
              padding: "12px",
              textAlign: "center",
            }}
          >
            No elements yet
          </p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sorted.map((e) => e.id)}
              strategy={verticalListSortingStrategy}
            >
              {sorted.map((el) => (
                <LayerRow key={el.id} element={el} />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* ── Add element button ── */}
      <div
        style={{ padding: "8px 10px", borderTop: "1px solid var(--border)" }}
      >
        <button
          onClick={() => addElement("paragraph")}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            width: "100%",
            padding: "7px",
            borderRadius: 6,
            border: "1px dashed var(--border)",
            background: "none",
            color: "var(--muted-foreground)",
            fontSize: 12,
            cursor: "pointer",
            transition: "border-color 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--brand)";
            e.currentTarget.style.color = "var(--foreground)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--muted-foreground)";
          }}
        >
          <Plus size={13} /> Add element
        </button>
      </div>

      {/* ── Element library ── */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <button
          onClick={() => setLibOpen((o) => !o)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            padding: "10px 12px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--foreground)",
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "var(--muted-foreground)",
            }}
          >
            ELEMENT LIBRARY
          </span>
          {libOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </button>

        {libOpen && (
          <div style={{ paddingBottom: 8 }}>
            {LIBRARY_ITEMS.map((item) => (
              <LibraryItem
                key={item.label}
                item={item}
                onAdd={(item) => addElement(item.type, item.defaults)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

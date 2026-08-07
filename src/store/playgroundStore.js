// /store/playgroundStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { temporal } from "zundo";
import { nanoid } from "nanoid";

// ─── Defaults ─────────────────────────────────────────────────────────────────

const ELEMENT_DEFAULTS = {
  heading1: {
    width: 600,
    height: 80,
    text: "Heading One",
    fontFamily: "Inter",
    fontWeight: 800,
    fontSize: 48,
    lineHeight: 1.1,
    letterSpacing: -0.03,
    textAlign: "left",
    textTransform: "none",
    color: "oklch(0.145 0 0)",
    backgroundColor: "oklch(0 0 0 / 0)",
  },
  heading2: {
    width: 500,
    height: 64,
    text: "Heading Two",
    fontFamily: "Inter",
    fontWeight: 700,
    fontSize: 36,
    lineHeight: 1.2,
    letterSpacing: -0.02,
    textAlign: "left",
    textTransform: "none",
    color: "oklch(0.145 0 0)",
    backgroundColor: "oklch(0 0 0 / 0)",
  },
  heading3: {
    width: 400,
    height: 52,
    text: "Heading Three",
    fontFamily: "Inter",
    fontWeight: 600,
    fontSize: 28,
    lineHeight: 1.3,
    letterSpacing: -0.01,
    textAlign: "left",
    textTransform: "none",
    color: "oklch(0.145 0 0)",
    backgroundColor: "oklch(0 0 0 / 0)",
  },
  paragraph: {
    width: 480,
    height: 96,
    text: "Edit this paragraph text. Use it for body copy, descriptions, or any longer-form content in your design.",
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 1.6,
    letterSpacing: 0,
    textAlign: "left",
    textTransform: "none",
    color: "oklch(0.35 0 0)",
    backgroundColor: "oklch(0 0 0 / 0)",
  },
  link: {
    width: 200,
    height: 28,
    text: "Click here →",
    fontFamily: "Inter",
    fontWeight: 500,
    fontSize: 16,
    lineHeight: 1.5,
    letterSpacing: 0,
    textAlign: "left",
    textTransform: "none",
    color: "oklch(0.597 0.240854 2.4025)",
    backgroundColor: "oklch(0 0 0 / 0)",
  },
  button: {
    width: 160,
    height: 44,
    text: "Get Started",
    fontFamily: "Inter",
    fontWeight: 600,
    fontSize: 14,
    lineHeight: 1,
    letterSpacing: 0.01,
    textAlign: "center",
    textTransform: "none",
    color: "oklch(0.98 0 0)",
    backgroundColor: "oklch(0.597 0.240854 2.4025)",
  },
  badge: {
    width: 80,
    height: 28,
    text: "New",
    fontFamily: "Inter",
    fontWeight: 600,
    fontSize: 11,
    lineHeight: 1,
    letterSpacing: 0.05,
    textAlign: "center",
    textTransform: "uppercase",
    color: "oklch(0.597 0.240854 2.4025)",
    backgroundColor: "oklch(0.95 0.03 2.4025)",
  },
  image: {
    width: 480,
    height: 270,
    text: "",
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 1.5,
    letterSpacing: 0,
    textAlign: "left",
    textTransform: "none",
    color: "oklch(0 0 0 / 0)",
    backgroundColor: "oklch(0.93 0 0)",
    src: "",
    aspectRatio: "16/9",
    objectFit: "cover",
    altText: "Image description",
  },
  divider: {
    width: 480,
    height: 2,
    text: "",
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 1,
    letterSpacing: 0,
    textAlign: "left",
    textTransform: "none",
    color: "oklch(0 0 0 / 0)",
    backgroundColor: "oklch(0.88 0 0)",
  },
};

const DEFAULT_CANVAS = {
  width: 1280,
  backgroundColor: "oklch(1 0 0)",
  backgroundMode: "solid",
  gridVisible: true,
  snapToGrid: true,
  gridSize: 8,
};

const DEFAULT_PALETTE = {
  colors: [
    "oklch(0.597 0.240854 2.4025)",
    "oklch(0.75 0.12 2.4025)",
    "oklch(0.35 0.08 2.4025)",
    "oklch(0.95 0.03 2.4025)",
    "oklch(0.145 0 0)",
  ],
  source: "manual",
  name: "Cosira Brand",
};

const DEFAULT_UI = {
  selectedId: null,
  hoveredId: null,
  panelOpen: null,
  previewMode: false,
  breakpoint: "desktop",
  theme: "light",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MAX_HISTORY = 50;

function computeNextZIndex(elements) {
  if (elements.length === 0) return 1;
  return Math.max(...elements.map((e) => e.zIndex)) + 1;
}

function snapToGrid(value, gridSize, snap) {
  if (!snap) return value;
  return Math.round(value / gridSize) * gridSize;
}

function buildElement(type, elements, overrides = {}) {
  const defaults = ELEMENT_DEFAULTS[type] ?? {};
  const zIndex = computeNextZIndex(elements);

  return {
    // Base defaults
    id: nanoid(),
    type,
    x: 80,
    y: 80,
    width: 200,
    height: 48,
    zIndex,
    locked: false,
    visible: true,
    // Typography defaults
    text: "",
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 1.5,
    letterSpacing: 0,
    textAlign: "left",
    textTransform: "none",
    // Color defaults
    color: "oklch(0.145 0 0)",
    backgroundColor: "oklch(0 0 0 / 0)",
    // Image defaults
    src: "",
    aspectRatio: "16/9",
    objectFit: "cover",
    altText: "",
    // Layer-specific defaults
    ...defaults,
    // Caller overrides (highest priority)
    ...overrides,
  };
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const usePlaygroundStore = create()(
  immer((set, get) => ({
    // ── Initial State ──────────────────────────────────────────────────────
    elements: [],
    palette: DEFAULT_PALETTE,
    canvas: DEFAULT_CANVAS,
    ui: DEFAULT_UI,
    _history: { past: [], future: [] },

    // ── Internal Snapshot ──────────────────────────────────────────────────
    _snapshot() {
      set((state) => {
        const snapshot = state.elements.map((el) => ({ ...el }));
        state._history.past.push(snapshot);
        if (state._history.past.length > MAX_HISTORY) {
          state._history.past.shift();
        }
        state._history.future = [];
      });
    },

    // ── Element Actions ────────────────────────────────────────────────────
    addElement(type, overrides = {}) {
      get()._snapshot();
      let newId = "";
      set((state) => {
        const snappedOverrides = {
          ...overrides,
          x:
            overrides.x !== undefined
              ? snapToGrid(
                  overrides.x,
                  state.canvas.gridSize,
                  state.canvas.snapToGrid,
                )
              : snapToGrid(
                  80 + state.elements.length * 16,
                  state.canvas.gridSize,
                  state.canvas.snapToGrid,
                ),
          y:
            overrides.y !== undefined
              ? snapToGrid(
                  overrides.y,
                  state.canvas.gridSize,
                  state.canvas.snapToGrid,
                )
              : snapToGrid(
                  80 + state.elements.length * 16,
                  state.canvas.gridSize,
                  state.canvas.snapToGrid,
                ),
        };
        const el = buildElement(type, state.elements, snappedOverrides);
        newId = el.id;
        state.elements.push(el);
        state.ui.selectedId = el.id;
      });
      return newId;
    },

    updateElement(id, partial) {
      get()._snapshot();
      set((state) => {
        const idx = state.elements.findIndex((e) => e.id === id);
        if (idx === -1) return;
        Object.assign(state.elements[idx], partial);
      });
    },

    removeElement(id) {
      get()._snapshot();
      set((state) => {
        state.elements = state.elements.filter((e) => e.id !== id);
        if (state.ui.selectedId === id) {
          state.ui.selectedId = null;
        }
      });
    },

    duplicateElement(id) {
      get()._snapshot();
      let newId = null;
      set((state) => {
        const source = state.elements.find((e) => e.id === id);
        if (!source) return;
        const clone = {
          ...source,
          id: nanoid(),
          x: source.x + 24,
          y: source.y + 24,
          zIndex: computeNextZIndex(state.elements),
        };
        newId = clone.id;
        state.elements.push(clone);
        state.ui.selectedId = clone.id;
      });
      return newId;
    },

    moveElement(id, x, y) {
      set((state) => {
        const idx = state.elements.findIndex((e) => e.id === id);
        if (idx === -1) return;
        if (state.elements[idx].locked) return;
        state.elements[idx].x = snapToGrid(
          x,
          state.canvas.gridSize,
          state.canvas.snapToGrid,
        );
        state.elements[idx].y = snapToGrid(
          y,
          state.canvas.gridSize,
          state.canvas.snapToGrid,
        );
      });
    },

    resizeElement(id, width, height) {
      set((state) => {
        const idx = state.elements.findIndex((e) => e.id === id);
        if (idx === -1) return;
        if (state.elements[idx].locked) return;
        state.elements[idx].width = Math.max(
          8,
          snapToGrid(width, state.canvas.gridSize, state.canvas.snapToGrid),
        );
        state.elements[idx].height = Math.max(
          2,
          snapToGrid(height, state.canvas.gridSize, state.canvas.snapToGrid),
        );
      });
    },

    reorderZ(id, direction) {
      get()._snapshot();
      set((state) => {
        const sorted = [...state.elements].sort((a, b) => a.zIndex - b.zIndex);
        const idx = sorted.findIndex((e) => e.id === id);
        if (idx === -1) return;

        const reassign = (arr) => {
          arr.forEach((el, i) => {
            const target = state.elements.find((e) => e.id === el.id);
            if (target) target.zIndex = i + 1;
          });
        };

        if (direction === "top") {
          const el = sorted.splice(idx, 1)[0];
          sorted.push(el);
          reassign(sorted);
        } else if (direction === "bottom") {
          const el = sorted.splice(idx, 1)[0];
          sorted.unshift(el);
          reassign(sorted);
        } else if (direction === "up" && idx < sorted.length - 1) {
          [sorted[idx], sorted[idx + 1]] = [sorted[idx + 1], sorted[idx]];
          reassign(sorted);
        } else if (direction === "down" && idx > 0) {
          [sorted[idx], sorted[idx - 1]] = [sorted[idx - 1], sorted[idx]];
          reassign(sorted);
        }
      });
    },

    // ── UI Actions ─────────────────────────────────────────────────────────
    setSelectedId(id) {
      set((state) => {
        state.ui.selectedId = id;
        if (id !== null) {
          const el = state.elements.find((e) => e.id === id);
          if (el) {
            if (el.type === "image") state.ui.panelOpen = "image";
            else if (
              [
                "heading1",
                "heading2",
                "heading3",
                "paragraph",
                "link",
              ].includes(el.type)
            )
              state.ui.panelOpen = "typography";
            else state.ui.panelOpen = "color";
          }
        }
      });
    },

    setHoveredId(id) {
      set((state) => {
        state.ui.hoveredId = id;
      });
    },

    setPanelOpen(panel) {
      set((state) => {
        state.ui.panelOpen = panel;
      });
    },

    setPreviewMode(value) {
      set((state) => {
        state.ui.previewMode = value;
        if (value) state.ui.selectedId = null;
      });
    },

    setBreakpoint(bp) {
      set((state) => {
        state.ui.breakpoint = bp;
      });
    },

    setTheme(theme) {
      set((state) => {
        state.ui.theme = theme;
      });
    },

    // ── Canvas Actions ─────────────────────────────────────────────────────
    updateCanvas(partial) {
      set((state) => {
        Object.assign(state.canvas, partial);
      });
    },

    // ── Palette Actions ────────────────────────────────────────────────────
    setPalette(palette) {
      set((state) => {
        state.palette = palette;
      });
    },

    // ── History ────────────────────────────────────────────────────────────
    undo() {
      set((state) => {
        if (state._history.past.length === 0) return;
        const previous = state._history.past.pop();
        state._history.future.unshift(state.elements.map((el) => ({ ...el })));
        state.elements = previous;
        state.ui.selectedId = null;
      });
    },

    redo() {
      set((state) => {
        if (state._history.future.length === 0) return;
        const next = state._history.future.shift();
        state._history.past.push(state.elements.map((el) => ({ ...el })));
        state.elements = next;
        state.ui.selectedId = null;
      });
    },

    // ── Template / Reset ───────────────────────────────────────────────────
    resetCanvas() {
      get()._snapshot();
      set((state) => {
        state.elements = [];
        state.canvas = { ...DEFAULT_CANVAS };
        state.ui = { ...DEFAULT_UI };
      });
    },

    loadTemplate(template) {
      get()._snapshot();
      set((state) => {
        state.elements = template.elements.map((el) => ({
          ...el,
          id: nanoid(),
        }));
        if (template.canvas) {
          Object.assign(state.canvas, template.canvas);
        }
        if (template.palette) {
          state.palette = template.palette;
        }
        state.ui.selectedId = null;
      });
    },
  })),
);

// ─── Selectors ────────────────────────────────────────────────────────────────

/** Returns the currently selected element, or null. */
export function useSelectedElement() {
  return usePlaygroundStore((state) => {
    if (!state.ui.selectedId) return null;
    return state.elements.find((e) => e.id === state.ui.selectedId) ?? null;
  });
}

/** Returns elements sorted by zIndex (ascending — for render order). */
export function useSortedElements() {
  return usePlaygroundStore((state) =>
    [...state.elements].sort((a, b) => a.zIndex - b.zIndex),
  );
}

/** Returns true if undo is available. */
export function useCanUndo() {
  return usePlaygroundStore((state) => state._history.past.length > 0);
}

/** Returns true if redo is available. */
export function useCanRedo() {
  return usePlaygroundStore((state) => state._history.future.length > 0);
}

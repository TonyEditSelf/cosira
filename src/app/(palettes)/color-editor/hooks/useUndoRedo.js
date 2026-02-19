import { useState, useCallback } from "react";

export function useUndoRedo(palette, setPalette) {
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const pushUndo = useCallback((snapshot) => {
    setUndoStack((prev) => [...prev, snapshot]);
    setRedoStack([]);
  }, []);

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setRedoStack((r) => [...r, palette]);
    setUndoStack((u) => u.slice(0, -1));
    setPalette(prev);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack((u) => [...u, palette]);
    setRedoStack((r) => r.slice(0, -1));
    setPalette(next);
  };

  return { undoStack, redoStack, pushUndo, handleUndo, handleRedo };
}

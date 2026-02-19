import { useState, useEffect } from "react";

const STORAGE_KEY = "editcolors_variants";

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(variants) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(variants));
  } catch {
    // storage full or blocked — fail silently
  }
}

export function useVariants(palette, setPalette, pushUndo) {
  const [savedVariants, setSavedVariants] = useState(loadFromStorage); // ← load on mount
  const [activeVariant, setActiveVariant] = useState(null);
  const [variantNameInput, setVariantNameInput] = useState("");
  const [showVariantPanel, setShowVariantPanel] = useState(false);

  // ← sync to localStorage whenever variants change
  useEffect(() => {
    saveToStorage(savedVariants);
  }, [savedVariants]);

  const handleSaveVariant = () => {
    const name =
      variantNameInput.trim() || `Variant ${savedVariants.length + 1}`;
    setSavedVariants((prev) => [
      ...prev,
      { name, palette: JSON.parse(JSON.stringify(palette)) },
    ]);
    setVariantNameInput("");
  };

  const handleLoadVariant = (idx) => {
    pushUndo(palette);
    setPalette(savedVariants[idx].palette);
    setActiveVariant(idx);
  };

  const handleDeleteVariant = (idx) => {
    setSavedVariants((prev) => prev.filter((_, i) => i !== idx));
    if (activeVariant === idx) setActiveVariant(null);
  };

  return {
    savedVariants,
    activeVariant,
    variantNameInput,
    setVariantNameInput,
    showVariantPanel,
    setShowVariantPanel,
    handleSaveVariant,
    handleLoadVariant,
    handleDeleteVariant,
  };
}

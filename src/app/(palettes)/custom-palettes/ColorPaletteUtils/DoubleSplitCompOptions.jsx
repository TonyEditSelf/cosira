import { useColorPaletteContext } from "../../ColorContext";
import doubleSplitCompPalGen, { PALETTE_TYPES } from "./doubleSplitCompPalGen";

export default function DoubleSplitCompOptions() {
  const {
    setPalette,
    setDuplicatePalette,
    oklch,
    doubleSplitCompPalType,
    setDoubleSplitCompPalType,
  } = useColorPaletteContext();

  const options = [
    { id: "balanced", label: PALETTE_TYPES.balanced.name },
    { id: "vibrant", label: PALETTE_TYPES.vibrant.name },
    { id: "neutral", label: PALETTE_TYPES.neutral.name },
    { id: "pastel", label: PALETTE_TYPES.pastel.name },
    { id: "deep", label: PALETTE_TYPES.deep.name },
  ];

  const handleChange = (value) => {
    setDoubleSplitCompPalType(value);

    // Generate palette - returns array directly
    const palette = doubleSplitCompPalGen(oklch, value);

    // Set palette
    setPalette(palette);
    setDuplicatePalette(palette);
  };

  return (
    <div>
      {options.map(({ id, label }) => (
        <div key={id} className="flex gap-4">
          <input
            type="radio"
            name="doubleSplitCompPalType"
            id={id}
            value={id}
            checked={doubleSplitCompPalType === id}
            onChange={() => handleChange(id)}
          />
          <label htmlFor={id}>{label}</label>
        </div>
      ))}
    </div>
  );
}

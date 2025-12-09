import { useColorPaletteContext } from "../../ColorContext";
import doubleSplitCompPalGen from "./doubleSplitCompPalGen";

export default function DoubleSplitCompOptions() {
  const {
    setPalette,
    setDuplicatePalette,
    oklch,
    doubleSplitCompPalType,
    setDoubleSplitCompPalType,
  } = useColorPaletteContext();

  const options = [
    { id: "leftDoubleSplitComp", label: "Left Double Split Comp" },
    { id: "rightDoubleSplitComp", label: "Right Double Split Comp" },
  ];

  const handleChange = (value) => {
    setDoubleSplitCompPalType(value);
    const pal = doubleSplitCompPalGen(oklch, value);
    setPalette(pal);
    setDuplicatePalette(pal);
  };

  return (
    <div className="flex flex-col gap-0">
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

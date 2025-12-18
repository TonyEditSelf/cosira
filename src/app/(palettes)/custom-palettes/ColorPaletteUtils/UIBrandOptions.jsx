import { useColorPaletteContext } from "../../ColorContext";
import uIBrandPalGen from "./uIBrandPalGen";

export default function UIBrandOptions() {
  const {
    setPalette,
    setDuplicatePalette,
    oklch,
    uiBrandPalType,
    setUiBrandPalType,
  } = useColorPaletteContext();

  const UIBrandPaltype = [
    { id: "light", label: "Light Mode" },
    { id: "dark", label: "Dark Mode" },
  ];

  const handleTypeChange = (value) => {
    setUiBrandPalType(value);
    const pal = uIBrandPalGen(oklch, value);
    setPalette(pal);
    setDuplicatePalette(pal);
  };

  return (
    <div>
      {UIBrandPaltype.map(({ id, label }) => (
        <div key={id} className="flex gap-4">
          <input
            type="radio"
            name="UIBrand"
            id={id}
            value={id}
            checked={uiBrandPalType === id}
            onChange={(e) => handleTypeChange(e.target.value)}
          />
          <label htmlFor={id}>{label}</label>
        </div>
      ))}
    </div>
  );
}

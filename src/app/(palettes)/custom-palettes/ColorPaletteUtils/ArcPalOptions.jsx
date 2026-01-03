import { useColorPaletteContext } from "../../ColorContext";
import arcPalGen from "./arcPalGen";

export default function ArcPalOptions() {
  const { setPalette, setDuplicatePalette, oklch, arcPalType, setArcPalType } =
    useColorPaletteContext();

  const arcTypes = [
    { id: "arcBottomUp", label: "arcBottomUp" },
    { id: "arcTopDown", label: "arcTopDown" },
    { id: "arcLeftRight", label: "arcLeftRight" },
    { id: "arcRightLeft", label: "arcRightLeft" },
    { id: "arcDiagonalUpRight", label: "arcDiagonalUpRight" },
    { id: "arcDiagonalUpLeft", label: "arcDiagonalUpLeft" },
    { id: "arcDiagonalDownRight", label: "arcDiagonalDownRight" },
    { id: "arcDiagonalDownLeft", label: "arcDiagonalDownLeft" },
    { id: "arcDiagonalTLBR", label: "arcDiagonalTLBR" },
    { id: "arcDiagonalTRBL", label: "arcDiagonalTRBL" },
  ];

  const handleTypeChange = (value) => {
    setArcPalType(value);
    const pal = arcPalGen(oklch, value);
    setPalette(pal);
    setDuplicatePalette(pal);
  };

  return (
    <div>
      {arcTypes.map(({ id, label }) => (
        <div key={id} className="flex gap-4">
          <input
            type="radio"
            name="arcPal"
            id={id}
            value={id}
            checked={arcPalType === id}
            onChange={(e) => handleTypeChange(e.target.value)}
          />
          <label htmlFor={id}>{label}</label>
        </div>
      ))}
    </div>
  );
}

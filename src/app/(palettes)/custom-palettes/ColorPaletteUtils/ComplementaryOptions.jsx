import { useColorPaletteContext } from "../../ColorContext";
import complementaryPalGen from "./complementaryPalGen";

export default function ComplementaryOptions() {
  const {
    setPalette,
    setDuplicatePalette,
    oklch,
    compPalType,
    setCompPalType,
  } = useColorPaletteContext();

  const compTypes = [
    { id: "classic", label: "Classic" },
    { id: "vibrant", label: "Vibrant" },
    { id: "muted", label: "Muted" },
    { id: "pastel", label: "Pastel" },
    { id: "dark", label: "Dark" },
    { id: "neon", label: "Neon" },
    { id: "natural", label: "Natural" },
    { id: "cinematic", label: "Cinematic" },
    { id: "neutral", label: "Neutral" },
  ];

  const handleTypeChange = (value) => {
    setCompPalType(value);
    const pal = complementaryPalGen(oklch, value);
    setPalette(pal);
    setDuplicatePalette(pal);
  };

  return (
    <div>
      {compTypes.map(({ id, label }) => (
        <div key={id} className="flex gap-4">
          <input
            type="radio"
            name="compPal"
            id={id}
            value={id}
            checked={compPalType === id}
            onChange={(e) => handleTypeChange(e.target.value)}
          />
          <label htmlFor={id}>{label}</label>
        </div>
      ))}
    </div>
  );
}

import { useColorPaletteContext } from "../../ColorContext";
import chromaticNeutralPalGen, {
  CHROMATIC_NEUTRAL_PALETTE_INFO,
} from "./chromaticNeutralPalGen";

export default function ChromaticNeutralOptions() {
  const {
    setPalette,
    setDuplicatePalette,
    oklch,
    chromaticNeutralPalType,
    setChromaticNeutralPalType,
  } = useColorPaletteContext();

  const handleChange = (value) => {
    setChromaticNeutralPalType(value);
    const pal = chromaticNeutralPalGen(oklch, value);
    setPalette(pal);
    setDuplicatePalette(pal);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">
          Palette Type
        </p>
        {CHROMATIC_NEUTRAL_PALETTE_INFO.map(({ id, name, description }) => (
          <div key={id} className="flex flex-col gap-0.5">
            <div className="flex gap-3 items-center">
              <input
                type="radio"
                name="chromaticNeutralPal"
                id={id}
                value={id}
                checked={chromaticNeutralPalType === id}
                onChange={() => handleChange(id)}
              />
              <label htmlFor={id} className="font-medium">
                {name}
              </label>
            </div>
            {chromaticNeutralPalType === id && (
              <p className="text-[9px] opacity-60 ml-6 mb-1">{description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

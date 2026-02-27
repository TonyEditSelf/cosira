import { useColorPaletteContext } from "../../ColorContext";
import monochromaticPalGen, { MONO_PALETTE_INFO } from "./monochromaticPalGen";

export default function MonochromaticOptions() {
  const {
    setPalette,
    setDuplicatePalette,
    oklch,
    monoPalType,
    setMonoPalType,
  } = useColorPaletteContext();

  const handleChange = (value) => {
    setMonoPalType(value);
    const pal = monochromaticPalGen(oklch, value);
    setPalette(pal);
    setDuplicatePalette(pal);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">
          Palette Type
        </p>
        {MONO_PALETTE_INFO.map(({ id, name, description }) => (
          <div key={id} className="flex flex-col gap-0.5">
            <div className="flex gap-3 items-center">
              <input
                type="radio"
                name="monoPal"
                id={id}
                value={id}
                checked={monoPalType === id}
                onChange={() => handleChange(id)}
              />
              <label htmlFor={id} className="font-medium">
                {name}
              </label>
            </div>
            {monoPalType === id && (
              <p className="text-[9px] opacity-60 ml-6 mb-1">{description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

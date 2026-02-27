import { useColorPaletteContext } from "../../ColorContext";
import achromaticPalGen, { ACHROMATIC_PALETTE_INFO } from "./achromaticPalGen";

export default function AchromaticOptions() {
  const {
    setPalette,
    setDuplicatePalette,
    oklch,
    achroPalType,
    setAchroPalType,
  } = useColorPaletteContext();

  const handleChange = (value) => {
    setAchroPalType(value);
    const pal = achromaticPalGen(oklch, value);
    setPalette(pal);
    setDuplicatePalette(pal);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">
          Palette Type
        </p>
        {ACHROMATIC_PALETTE_INFO.map(({ id, name, description }) => (
          <div key={id} className="flex flex-col gap-0.5">
            <div className="flex gap-3 items-center">
              <input
                type="radio"
                name="achroPal"
                id={id}
                value={id}
                checked={achroPalType === id}
                onChange={() => handleChange(id)}
              />
              <label htmlFor={id} className="font-medium">
                {name}
              </label>
            </div>
            {achroPalType === id && (
              <p className="text-[9px] opacity-60 ml-6 mb-1">{description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

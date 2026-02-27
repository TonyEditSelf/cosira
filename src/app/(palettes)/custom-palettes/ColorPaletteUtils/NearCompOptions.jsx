import { useColorPaletteContext } from "../../ColorContext";
import nearCompPalGen, { NEAR_COMP_PALETTE_INFO } from "./nearCompPalGen";

export default function NearCompOptions() {
  const {
    setPalette,
    setDuplicatePalette,
    oklch,
    nearCompPalType,
    setNearCompPalType,
  } = useColorPaletteContext();

  const handleChange = (id) => {
    setNearCompPalType(id);
    const pal = nearCompPalGen(oklch, id);
    setPalette(pal);
    setDuplicatePalette(pal);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">
          Palette Type
        </p>
        {NEAR_COMP_PALETTE_INFO.map(({ id, name, description }) => (
          <div key={id} className="flex flex-col gap-0.5">
            <div className="flex gap-3 items-center">
              <input
                type="radio"
                name="nearCompPal"
                id={id}
                value={id}
                checked={nearCompPalType === id}
                onChange={() => handleChange(id)}
              />
              <label htmlFor={id} className="font-medium">
                {name}
              </label>
            </div>
            {nearCompPalType === id && (
              <p className="text-[9px] opacity-60 ml-6 mb-1">{description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

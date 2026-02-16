import { useColorPaletteContext } from "../../ColorContext";
import tetradicPalGen from "./tetradicPalGen";

export default function TetradicOptions() {
  const {
    setPalette,
    setDuplicatePalette,
    oklch,
    tetradicPalType,
    setTetradicPalType,
    tetradicForm,
    setTetradicForm,
  } = useColorPaletteContext();

  const paletteOptions = [
    { id: "classicTetra", label: "Classic Tetradic" },
    { id: "vintageTetra", label: "Vintage Tetradic" },
    { id: "neutralTetra", label: "Neutral Tetradic" },
    { id: "pastelTetra", label: "Pastel Tetradic" },
    { id: "luxuryTetra", label: "Luxury Tetradic" },
    { id: "earthTetra", label: "Earth Tetradic" },
    { id: "neonTetra", label: "Neon Tetradic" },
    { id: "kidsTetrad", label: "Kids Tetradic" },
  ];

  const formOptions = [
    { id: "squareTetra", label: "Square (90°)" },
    { id: "rectTetra", label: "Rectangular (60°/180°/240°)" },
  ];

  const currentForm = tetradicForm ?? "squareTetra";
  const currentType = tetradicPalType ?? "classicTetra";

  const handlePaletteChange = (value) => {
    setTetradicPalType(value);
    const pal = tetradicPalGen(oklch, value, currentForm);
    setPalette(pal);
    setDuplicatePalette(pal);
  };

  const handleFormChange = (value) => {
    setTetradicForm(value);
    const pal = tetradicPalGen(oklch, currentType, value);
    setPalette(pal);
    setDuplicatePalette(pal);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* ── Palette type ── */}
      <div className="flex flex-col gap-0">
        {paletteOptions.map(({ id, label }) => (
          <div key={id} className="flex gap-4">
            <input
              type="radio"
              name="tetradicPal"
              id={id}
              value={id}
              checked={currentType === id}
              onChange={() => handlePaletteChange(id)}
            />
            <label htmlFor={id}>{label}</label>
          </div>
        ))}
      </div>

      {/* ── Tetradic form ── */}
      <div className="flex flex-col gap-0">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-50">
          Form
        </p>
        {formOptions.map(({ id, label }) => (
          <div key={id} className="flex gap-4">
            <input
              type="radio"
              name="tetradicForm"
              id={id}
              value={id}
              checked={currentForm === id}
              onChange={() => handleFormChange(id)}
            />
            <label htmlFor={id}>{label}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

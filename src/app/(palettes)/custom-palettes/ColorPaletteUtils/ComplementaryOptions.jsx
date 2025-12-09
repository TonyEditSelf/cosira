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
    { id: "classicComp", label: "Classic Comp" },
    { id: "OpalComp", label: "Opalescent Comp" },
    { id: "BioLumComp", label: "Bioluminescent Comp" },
    { id: "TemporalComp", label: "Temporal Comp" },
    { id: "AtmosphericComp", label: "Atmospheric Comp" },
    { id: "EtherealComp", label: "Ethereal Comp" },
    { id: "vintageComp", label: "Vintage Comp" },
    { id: "80sNeonComp", label: "80sNeon Comp" },
    { id: "MCMComp", label: "Mid-Century Modern" },
    { id: "retroComp", label: "Retro Comp" },
    { id: "moodyComp", label: "Moody Comp" },
    { id: "earthyComp", label: "Earthy/Muted Comp" },
    { id: "neutralComp", label: "Neutral Comp" },
    { id: "kidsComp", label: "Kids Comp" },
    { id: "pastelComp", label: "Pastel Comp" },
    { id: "neonComp", label: "Neon Comp" },
    { id: "luxuriousComp", label: "Luxurious Comp" },
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

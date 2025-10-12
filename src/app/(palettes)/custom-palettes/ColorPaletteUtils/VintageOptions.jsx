import { useColorPaletteContext } from "../../ColorContext";
import vintagePalGen from "./vintagePalGen";

export default function VintageOptions() {
  const { oklch, vintagePalType, setVintagePalType } = useColorPaletteContext();

  return (
    <div>
      <div className="flex gap-4">
        <input
          type="radio"
          name="vintage"
          id="vintageComp"
          value={"vintageComp"}
          checked={vintagePalType === "vintageComp"}
          onChange={(e) => {
            vintagePalGen(oklch, e.target.value);

            setVintagePalType(e.target.value);
          }}
        />
        <label htmlFor="vintageComp">Vintage Complementary</label>
      </div>
      <div className="flex gap-4">
        <input
          type="radio"
          name="vintage"
          id="vintageSplitComp"
          value={"vintageSplitComp"}
          checked={vintagePalType === "vintageSplitComp"}
          onChange={(e) => {
            vintagePalGen(oklch, e.target.value);
            setVintagePalType(e.target.value);
          }}
        />
        <label htmlFor="vintageSplitComp">Vintage Split-Comp</label>
      </div>
      <div className="flex gap-4">
        <input
          type="radio"
          name="vintage"
          id="vintageMono"
          value={"vintageMono"}
          checked={vintagePalType === "vintageMono"}
          onChange={(e) => {
            setVintagePalType(e.target.value);
          }}
        />
        <label htmlFor="vintageMono">Vintage Monochromatic</label>
      </div>
      <div className="flex gap-4 ">
        <input
          type="radio"
          name="vintage"
          id="vintageAnalog"
          value={"vintageAnalog"}
          checked={vintagePalType === "vintageAnalog"}
          onChange={(e) => setVintagePalType(e.target.value)}
        />
        <label htmlFor="vintageAnalog">Vintage Analogous</label>
      </div>
      <div className="flex gap-4">
        <input
          type="radio"
          name="vintage"
          id="vintageTriad"
          value={"vintageTriad"}
          checked={vintagePalType === "vintageTriad"}
          onChange={(e) => setVintagePalType(e.target.value)}
        />
        <label htmlFor="vintageTriad">Vintage Triadic</label>
      </div>
      <div className="flex gap-4">
        <input
          type="radio"
          name="vintage"
          id="vintageTetra"
          value={"vintageTetra"}
          checked={vintagePalType === "vintageTetra"}
          onChange={(e) => setVintagePalType(e.target.value)}
        />
        <label htmlFor="vintageTetra">Vintage Tetradic</label>
      </div>
    </div>
  );
}

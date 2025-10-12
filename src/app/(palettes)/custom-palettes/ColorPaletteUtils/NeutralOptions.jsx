import neutralPalGen from "./neutralPalGen";
import { useColorPaletteContext } from "../../ColorContext";

export default function NeutralOptions() {
  const { oklch, neutralPalType, setNeutralPalType } = useColorPaletteContext();
  return (
    <div>
      <div className="flex gap-4">
        <input
          type="radio"
          name="neutral"
          id="neutralComp"
          value={"neutralComp"}
          checked={neutralPalType === "neutralComp"}
          onChange={(e) => {
            neutralPalGen(oklch, e.target.value);
            setNeutralPalType(e.target.value);
          }}
        />
        <label htmlFor="neutralComp">Neutral Complementary</label>
      </div>
      <div className="flex gap-4">
        <input
          type="radio"
          name="neutral"
          id="neutralSplitComp"
          value={"neutralSplitComp"}
          checked={neutralPalType === "neutralSplitComp"}
          onChange={(e) => {
            neutralPalGen(oklch, e.target.value);
            setNeutralPalType(e.target.value);
          }}
        />
        <label htmlFor="neutralSplitComp">Neutral Split-Comp</label>
      </div>
      <div className="flex gap-4">
        <input
          type="radio"
          name="neutral"
          id="neutralMono"
          value={"neutralMono"}
          checked={neutralPalType === "neutralMono"}
          onChange={(e) => {
            neutralPalGen(oklch, e.target.value);
            setNeutralPalType(e.target.value);
          }}
        />
        <label htmlFor="neutralMono">Neutral Monochromatic</label>
      </div>
      <div className="flex gap-4 ">
        <input
          type="radio"
          name="neutral"
          id="neutralAnalog"
          value={"neutralAnalog"}
          checked={neutralPalType === "neutralAnalog"}
          onChange={(e) => {
            neutralPalGen(oklch, e.target.value);
            setNeutralPalType(e.target.value);
          }}
        />
        <label htmlFor="neutralAnalog">Neutral Analogous</label>
      </div>
      <div className="flex gap-4">
        <input
          type="radio"
          name="neutral"
          id="neutralTriad"
          value={"neutralTriad"}
          checked={neutralPalType === "neutralTriad"}
          onChange={(e) => {
            neutralPalGen(oklch, e.target.value);
            setNeutralPalType(e.target.value);
          }}
        />
        <label htmlFor="neutralTriad">Neutral Triadic</label>
      </div>
      <div className="flex gap-4">
        <input
          type="radio"
          name="neutral"
          id="neutralTetra"
          value={"neutralTetra"}
          checked={neutralPalType === "neutralTetra"}
          onChange={(e) => {
            neutralPalGen(oklch, e.target.value);
            setNeutralPalType(e.target.value);
          }}
        />
        <label htmlFor="neutralTetra">Neutral Tetradic</label>
      </div>
    </div>
  );
}

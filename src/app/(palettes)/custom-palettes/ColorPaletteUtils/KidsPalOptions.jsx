import { useColorPaletteContext } from "../../ColorContext";
import kidsPalGen from "./kidsPalGen";

export default function KidsPalOptions() {
  const { oklch, kidsPalType, setKidsPalType } = useColorPaletteContext();
  return (
    <div>
      <div className="flex gap-4">
        <input
          type="radio"
          name="kidsPal"
          id="kidsComp"
          value={"kidsComp"}
          checked={kidsPalType === "kidsComp"}
          onChange={(e) => {
            kidsPalGen(oklch, e.target.value);
            setKidsPalType(e.target.value);
          }}
        />
        <label htmlFor="kidsComp">Kids Complementary</label>
      </div>
      <div className="flex gap-4">
        <input
          type="radio"
          name="kidsPal"
          id="kidsSplitComp"
          value={"kidsSplitComp"}
          checked={kidsPalType === "kidsSplitComp"}
          onChange={(e) => {
            kidsPalGen(oklch, e.target.value);
            setKidsPalType(e.target.value);
          }}
        />
        <label htmlFor="kidsSplitComp">Kids Split-Comp</label>
      </div>
      <div className="flex gap-4">
        <input
          type="radio"
          name="kidsPal"
          id="kidsMono"
          value={"kidsMono"}
          checked={kidsPalType === "kidsMono"}
          onChange={(e) => {
            kidsPalGen(oklch, e.target.value);
            setKidsPalType(e.target.value);
          }}
        />
        <label htmlFor="kidsMono">Kids Monochromatic</label>
      </div>
      <div className="flex gap-4 ">
        <input
          type="radio"
          name="kidsPal"
          id="kidsAnalog"
          value={"kidsAnalog"}
          checked={kidsPalType === "kidsAnalog"}
          onChange={(e) => {
            kidsPalGen(oklch, e.target.value);
            setKidsPalType(e.target.value);
          }}
        />
        <label htmlFor="kidsAnalog">Kids Analogous</label>
      </div>
      <div className="flex gap-4">
        <input
          type="radio"
          name="kidsPal"
          id="kidsTriad"
          value={"kidsTriad"}
          checked={kidsPalType === "kidsTriad"}
          onChange={(e) => {
            kidsPalGen(oklch, e.target.value);
            setKidsPalType(e.target.value);
          }}
        />
        <label htmlFor="kidsTriad">Kids Triadic</label>
      </div>
      <div className="flex gap-4">
        <input
          type="radio"
          name="kids"
          id="kidsTetra"
          value={"kidsTetra"}
          checked={kidsPalType === "kidsTetra"}
          onChange={(e) => {
            kidsPalGen(oklch, e.target.value);
            setKidsPalType(e.target.value);
          }}
        />
        <label htmlFor="kidsTetra">Kids Tetradic</label>
      </div>
    </div>
  );
}

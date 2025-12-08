import { useColorPaletteContext } from "../../ColorContext";
import monochromaticPalGen from "./monochromaticPalGen";

export default function MonochromaticOptions() {
  const {
    setPalette,
    setDuplicatePalette,
    oklch,
    monoPalType,
    setMonoPalType,
    setSliderLightValue,
    setSliderChromaValue,
  } = useColorPaletteContext();
  return (
    <div>
      <div className="flex gap-4">
        <input
          type="radio"
          name="monoPal"
          id="classicMono"
          value={"classicMono"}
          checked={monoPalType === "classicMono"}
          onChange={(e) => {
            setMonoPalType(e.target.value);
            const pal = monochromaticPalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="classicMono">Classic Mono</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="monoPal"
          id="vintageMono"
          value={"vintageMono"}
          checked={monoPalType === "vintageMono"}
          onChange={(e) => {
            setMonoPalType(e.target.value);
            const pal = monochromaticPalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="vintageMono">Vintage Mono</label>
      </div>
      <div className="flex gap-4">
        <input
          type="radio"
          name="monoPal"
          id="neutralMono"
          value={"neutralMono"}
          checked={monoPalType === "neutralMono"}
          onChange={(e) => {
            setMonoPalType(e.target.value);
            const pal = monochromaticPalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="neutralMono">Neutral Mono</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="monoPal"
          id="kidsMono"
          value={"kidsMono"}
          checked={monoPalType === "kidsMono"}
          onChange={(e) => {
            setMonoPalType(e.target.value);
            const pal = monochromaticPalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="kidsMono">Kids Mono</label>
      </div>
      {/* <div className="flex gap-4">
        <input
          type="radio"
          name="monoPal"
          id="pastelComp"
          value={"pastelComp"}
          checked={compPalType === "pastelComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
          }}
        />
        <label htmlFor="pastelComp">Pastel Comp</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="monoPal"
          id="retroComp"
          value={"retroComp"}
          checked={compPalType === "retroComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
          }}
        />
        <label htmlFor="retroComp">Retro Comp</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="monoPal"
          id="moodyComp"
          value={"moodyComp"}
          checked={compPalType === "moodyComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
          }}
        />
        <label htmlFor="moodyComp">Moody Comp</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="monoPal"
          id="neonComp"
          value={"neonComp"}
          checked={compPalType === "neonComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
          }}
        />
        <label htmlFor="neonComp">Neon Comp</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="monoPal"
          id="earthyComp"
          value={"earthyComp"}
          checked={compPalType === "earthyComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
          }}
        />
        <label htmlFor="earthyComp">Earthy/Muted Comp</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="monoPal"
          id="luxuriousComp"
          value={"luxuriousComp"}
          checked={compPalType === "luxuriousComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
          }}
        />
        <label htmlFor="luxuriousComp">Luxurious Comp</label>
      </div> */}
    </div>
  );
}

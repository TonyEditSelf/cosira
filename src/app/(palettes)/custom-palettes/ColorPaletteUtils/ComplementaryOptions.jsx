import { useEffect } from "react";
import { useColorPaletteContext } from "../../ColorContext";
import complementaryPalGen from "./complementaryPalGen";

export default function ComplementaryOptions() {
  const {
    setPalette,
    oklch,
    compPalType,
    setCompPalType,
    setSliderLightValue,
    setSliderChromaValue,
  } = useColorPaletteContext();

  return (
    <div>
      <div className="flex gap-4">
        <input
          type="radio"
          name="compPal"
          id="classicComp"
          value={"classicComp"}
          checked={compPalType === "classicComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
            const pal = complementaryPalGen(oklch, e.target.value);
            setPalette(pal);
          }}
        />
        <label htmlFor="classicComp">Classic Comp</label>
      </div>
      <div className="flex gap-4">
        <input
          type="radio"
          name="compPal"
          id="vibrantComp"
          value={"vibrantComp"}
          checked={compPalType === "vibrantComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
            const pal = complementaryPalGen(oklch, e.target.value);
            setPalette(pal);
          }}
        />
        <label htmlFor="vibrantComp">Vibrant Comp</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="compPal"
          id="vintageComp"
          value={"vintageComp"}
          checked={compPalType === "vintageComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
            const pal = complementaryPalGen(oklch, e.target.value, null);
            setPalette(pal);
          }}
        />
        <label htmlFor="vintageComp">Vintage Comp</label>
      </div>
      <div className="flex gap-4">
        <input
          type="radio"
          name="compPal"
          id="neutralComp"
          value={"neutralComp"}
          checked={compPalType === "neutralComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
            const pal = complementaryPalGen(oklch, e.target.value);
            setPalette(pal);
          }}
        />
        <label htmlFor="neutralComp">Neutral Comp</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="compPal"
          id="kidsComp"
          value={"kidsComp"}
          checked={compPalType === "kidsComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
            const pal = complementaryPalGen(oklch, e.target.value);
            setPalette(pal);
          }}
        />
        <label htmlFor="kidsComp">Kids Comp</label>
      </div>
      <div className="flex gap-4">
        <input
          type="radio"
          name="compPal"
          id="pastelComp"
          value={"pastelComp"}
          checked={compPalType === "pastelComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
            const pal = complementaryPalGen(oklch, e.target.value);
            setPalette(pal);
          }}
        />
        <label htmlFor="pastelComp">Pastel Comp</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="compPal"
          id="retroComp"
          value={"retroComp"}
          checked={compPalType === "retroComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
            const pal = complementaryPalGen(oklch, e.target.value);
            setPalette(pal);
          }}
        />
        <label htmlFor="retroComp">Retro Comp</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="compPal"
          id="moodyComp"
          value={"moodyComp"}
          checked={compPalType === "moodyComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
            const pal = complementaryPalGen(oklch, e.target.value);
            setPalette(pal);
          }}
        />
        <label htmlFor="moodyComp">Moody Comp</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="compPal"
          id="neonComp"
          value={"neonComp"}
          checked={compPalType === "neonComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
            const pal = complementaryPalGen(oklch, e.target.value);
            setPalette(pal);
          }}
        />
        <label htmlFor="neonComp">Neon Comp</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="compPal"
          id="earthyComp"
          value={"earthyComp"}
          checked={compPalType === "earthyComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
            const pal = complementaryPalGen(oklch, e.target.value);
            setPalette(pal);
          }}
        />
        <label htmlFor="earthyComp">Earthy/Muted Comp</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="compPal"
          id="luxuriousComp"
          value={"luxuriousComp"}
          checked={compPalType === "luxuriousComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
            const pal = complementaryPalGen(oklch, e.target.value);
            setPalette(pal);
          }}
        />
        <label htmlFor="luxuriousComp">Luxurious Comp</label>
      </div>
    </div>
  );
}

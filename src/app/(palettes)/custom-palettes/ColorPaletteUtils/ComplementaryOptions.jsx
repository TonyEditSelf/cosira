import { useEffect } from "react";
import { useColorPaletteContext } from "../../ColorContext";
import complementaryPalGen from "./complementaryPalGen";

export default function ComplementaryOptions() {
  const {
    setPalette,
    setDuplicatePalette,
    setDuplicatePaletteType,
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
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="classicComp">Classic Comp</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="compPal"
          id="OpalComp"
          value={"OpalComp"}
          checked={compPalType === "OpalComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
            const pal = complementaryPalGen(oklch, e.target.value, null);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="OpalComp">Opalescent Comp</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="compPal"
          id="BioLumComp"
          value={"BioLumComp"}
          checked={compPalType === "BioLumComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
            const pal = complementaryPalGen(oklch, e.target.value, null);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="BioLumComp">Bioluminescent Comp</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="compPal"
          id="TemporalComp"
          value={"TemporalComp"}
          checked={compPalType === "TemporalComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
            const pal = complementaryPalGen(oklch, e.target.value, null);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="TemporalComp">Temporal Comp</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="compPal"
          id="AtmosphericComp"
          value={"AtmosphericComp"}
          checked={compPalType === "AtmosphericComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
            const pal = complementaryPalGen(oklch, e.target.value, null);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="AtmosphericComp">Atmospheric Comp</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="compPal"
          id="EtherealComp"
          value={"EtherealComp"}
          checked={compPalType === "EtherealComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
            const pal = complementaryPalGen(oklch, e.target.value, null);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="EtherealComp">Ethereal Comp</label>
      </div>
      {/* ==================================================== */}
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
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="vintageComp">Vintage Comp</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="compPal"
          id="80sNeonComp"
          value={"80sNeonComp"}
          checked={compPalType === "80sNeonComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
            const pal = complementaryPalGen(oklch, e.target.value, null);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="80sNeonComp">80sNeon Comp</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="compPal"
          id="MCMComp"
          value={"MCMComp"}
          checked={compPalType === "MCMComp"}
          onChange={(e) => {
            setCompPalType(e.target.value);
            const pal = complementaryPalGen(oklch, e.target.value, null);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="MCMComp">Mid-Century Modern</label>
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
            setDuplicatePalette(pal);
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
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="moodyComp">Moody Comp</label>
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
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="earthyComp">Earthy/Muted Comp</label>
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
            setDuplicatePalette(pal);
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
            setDuplicatePalette(pal);
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
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="pastelComp">Pastel Comp</label>
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
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="neonComp">Neon Comp</label>
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
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="luxuriousComp">Luxurious Comp</label>
      </div>
    </div>
  );
}

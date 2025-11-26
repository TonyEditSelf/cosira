import { useColorPaletteContext } from "../../ColorContext";
import dataVizPalettePalGen from "./dataVizPalettePalGen";

export default function DataVizOptions() {
  const {
    setPalette,
    setDuplicatePalette,
    oklch,
    dataVizPalType,
    setDataVizPalType,
    setSliderLightValue,
    setSliderChromaValue,
  } = useColorPaletteContext();

  return (
    <div>
      <div className="flex gap-4">
        <input
          type="radio"
          name="dataVizPal"
          id="dataVizPalOne"
          value={"dataVizPalOne"}
          checked={dataVizPalType === "dataVizPalOne"}
          onChange={(e) => {
            setDataVizPalType(e.target.value);
            const pal = dataVizPalettePalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="dataVizPalOne">Data Visualization 1</label>
      </div>
      <div className="flex gap-4">
        <input
          type="radio"
          name="dataVizPal"
          id="dataVizPalTwo"
          value={"dataVizPalTwo"}
          checked={dataVizPalType === "dataVizPalTwo"}
          onChange={(e) => {
            setDataVizPalType(e.target.value);
            const pal = dataVizPalettePalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="dataVizPalTwo">Data Visualization 2</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="dataVizPal"
          id="dataVizPalThree"
          value={"dataVizPalThree"}
          checked={dataVizPalType === "dataVizPalThree"}
          onChange={(e) => {
            setDataVizPalType(e.target.value);
            const pal = dataVizPalettePalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="dataVizPalThree">Data Visualization 3</label>
      </div>
      <div className="flex gap-4">
        <input
          type="radio"
          name="dataVizPal"
          id="dataVizPalFour"
          value={"dataVizPalFour"}
          checked={dataVizPalType === "dataVizPalFour"}
          onChange={(e) => {
            setDataVizPalType(e.target.value);
            const pal = dataVizPalettePalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="dataVizPalFour">Data Visualization 4</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="dataVizPal"
          id="dataVizPalFive"
          value={"dataVizPalFive"}
          checked={dataVizPalType === "dataVizPalFive"}
          onChange={(e) => {
            setDataVizPalType(e.target.value);
            const pal = dataVizPalettePalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="dataVizPalFive">Data Visualization 5</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="dataVizPal"
          id="dataVizPalSix"
          value={"dataVizPalSix"}
          checked={dataVizPalType === "dataVizPalSix"}
          onChange={(e) => {
            setDataVizPalType(e.target.value);
            const pal = dataVizPalettePalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="dataVizPalSix">Data Visualization 6</label>
      </div>
    </div>
  );
}

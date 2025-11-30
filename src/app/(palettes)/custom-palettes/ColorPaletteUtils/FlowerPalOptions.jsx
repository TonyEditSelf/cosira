import { useColorPaletteContext } from "../../ColorContext";
import flowerPalGen from "./flowerPalGen";

export default function FlowerPalOptions() {
  const {
    setPalette,
    setDuplicatePalette,
    oklch,
    setOklch,
    flowerPalType,
    setFlowerPalType,
  } = useColorPaletteContext();

  return (
    <div>
      <div className="flex gap-4">
        <input
          type="radio"
          name="flowerPal"
          id="sunflower"
          value={"sunflower"}
          checked={flowerPalType === "sunflower"}
          onChange={(e) => {
            setOklch({ l: 0.88, c: 0.25, h: 100, a: 1 });
            setFlowerPalType(e.target.value);

            const pal = flowerPalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="sunflower"> Sunflower</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="flowerPal"
          id="rose"
          value={"rose"}
          checked={flowerPalType === "rose"}
          onChange={(e) => {
            setOklch({ l: 0.63, c: 0.28, h: 25, a: 1 });
            setFlowerPalType(e.target.value);

            const pal = flowerPalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="rose">Rose</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="flowerPal"
          id="lavender"
          value={"lavender"}
          checked={flowerPalType === "lavender"}
          onChange={(e) => {
            setOklch({ l: 0.8, c: 0.16, h: 280 });
            setFlowerPalType(e.target.value);

            const pal = flowerPalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="lavender">Lavender</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="flowerPal"
          id="orchid"
          value={"orchid"}
          checked={flowerPalType === "orchid"}
          onChange={(e) => {
            setOklch({ l: 0.75, c: 0.22, h: 330 });
            setFlowerPalType(e.target.value);

            const pal = flowerPalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="orchid">Orchid</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="flowerPal"
          id="lotus"
          value={"lotus"}
          checked={flowerPalType === "lotus"}
          onChange={(e) => {
            setOklch({ l: 0.9, c: 0.12, h: 350 });
            setFlowerPalType(e.target.value);

            const pal = flowerPalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="lotus">Lotus</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="flowerPal"
          id="bluebell"
          value={"bluebell"}
          checked={flowerPalType === "bluebell"}
          onChange={(e) => {
            setOklch({ l: 0.72, c: 0.18, h: 260 });
            setFlowerPalType(e.target.value);

            const pal = flowerPalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="bluebell">Bluebell</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="flowerPal"
          id="marigold"
          value={"marigold"}
          checked={flowerPalType === "marigold"}
          onChange={(e) => {
            setOklch({ l: 0.82, c: 0.26, h: 65 });
            setFlowerPalType(e.target.value);

            const pal = flowerPalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="marigold">Marigold</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="flowerPal"
          id="hibiscus"
          value={"hibiscus"}
          checked={flowerPalType === "hibiscus"}
          onChange={(e) => {
            setOklch({ l: 0.7, c: 0.3, h: 40 });
            setFlowerPalType(e.target.value);

            const pal = flowerPalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="hibiscus">Hibiscus</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="flowerPal"
          id="morning-glory"
          value={"morning-glory"}
          checked={flowerPalType === "morning-glory"}
          onChange={(e) => {
            setOklch({ l: 0.68, c: 0.2, h: 215 });
            setFlowerPalType(e.target.value);

            const pal = flowerPalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="morning-glory">Morning Glory</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="flowerPal"
          id="tangerine-gerbera"
          value={"tangerine-gerbera"}
          checked={flowerPalType === "tangerine-gerbera"}
          onChange={(e) => {
            setOklch({ l: 0.75, c: 0.35, h: 50 });
            setFlowerPalType(e.target.value);

            const pal = flowerPalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="tangerine-gerbera">Tangerine Gerbera</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="flowerPal"
          id="cymbidium-orchid"
          value={"cymbidium-orchid"}
          checked={flowerPalType === "cymbidium-orchid"}
          onChange={(e) => {
            setOklch({ l: 0.8, c: 0.2, h: 105 });
            setFlowerPalType(e.target.value);

            const pal = flowerPalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="cymbidium-orchid">Cymbidium Orchid</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="flowerPal"
          id="chocolateCosmos"
          value={"chocolateCosmos"}
          checked={flowerPalType === "chocolateCosmos"}
          onChange={(e) => {
            setOklch({ l: 0.3, c: 0.18, h: 15 });
            setFlowerPalType(e.target.value);

            const pal = flowerPalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="chocolateCosmos">Chocolate Cosmos</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="flowerPal"
          id="gardenCosmos"
          value={"gardenCosmos"}
          checked={flowerPalType === "gardenCosmos"}
          onChange={(e) => {
            setOklch({ l: 0.78, c: 0.28, h: 320 });
            setFlowerPalType(e.target.value);

            const pal = flowerPalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="gardenCosmos">Garden Cosmos</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="flowerPal"
          id="birdOfParadise"
          value={"birdOfParadise"}
          checked={flowerPalType === "birdOfParadise"}
          onChange={(e) => {
            setOklch({ l: 0.7, c: 0.35, h: 55 });
            setFlowerPalType(e.target.value);

            const pal = flowerPalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="birdOfParadise">Bird of Paradise</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="flowerPal"
          id="passionFlower"
          value={"passionFlower"}
          checked={flowerPalType === "passionFlower"}
          onChange={(e) => {
            setOklch({ l: 0.9, c: 0.08, h: 280 });
            setFlowerPalType(e.target.value);

            const pal = flowerPalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="passionFlower">Passion Flower</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="flowerPal"
          id="kingProtea"
          value={"kingProtea"}
          checked={flowerPalType === "kingProtea"}
          onChange={(e) => {
            setOklch({ l: 0.65, c: 0.15, h: 350 });
            setFlowerPalType(e.target.value);

            const pal = flowerPalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="kingProtea">King Protea</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="flowerPal"
          id="plumeria"
          value={"plumeria"}
          checked={flowerPalType === "plumeria"}
          onChange={(e) => {
            setOklch({ l: 0.95, c: 0.05, h: 90 });
            setFlowerPalType(e.target.value);

            const pal = flowerPalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="plumeria">Plumeria</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="flowerPal"
          id="blackPansy"
          value={"blackPansy"}
          checked={flowerPalType === "blackPansy"}
          onChange={(e) => {
            setOklch({ l: 0.25, c: 0.05, h: 280 });
            setFlowerPalType(e.target.value);

            const pal = flowerPalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="blackPansy">Black Pansy</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="flowerPal"
          id="jadeVine"
          value={"jadeVine"}
          checked={flowerPalType === "jadeVine"}
          onChange={(e) => {
            setOklch({ l: 0.65, c: 0.25, h: 175 });
            setFlowerPalType(e.target.value);

            const pal = flowerPalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="jadeVine">Jade Vine</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="flowerPal"
          id="hydrangea"
          value={"hydrangea"}
          checked={flowerPalType === "hydrangea"}
          onChange={(e) => {
            setOklch({ l: 0.6, c: 0.18, h: 260 });
            setFlowerPalType(e.target.value);

            const pal = flowerPalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="hydrangea">Hydrangea</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="flowerPal"
          id="tigerLily"
          value={"tigerLily"}
          checked={flowerPalType === "tigerLily"}
          onChange={(e) => {
            setOklch({ l: 0.75, c: 0.35, h: 60 });
            setFlowerPalType(e.target.value);

            const pal = flowerPalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="tigerLily">Tiger Lily</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="flowerPal"
          id="callaLily"
          value={"callaLily"}
          checked={flowerPalType === "callaLily"}
          onChange={(e) => {
            setOklch({ l: 0.93, c: 0.07, h: 95 });
            setFlowerPalType(e.target.value);

            const pal = flowerPalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="callaLily">Calla Lily</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="flowerPal"
          id="bluePoppy"
          value={"bluePoppy"}
          checked={flowerPalType === "bluePoppy"}
          onChange={(e) => {
            setOklch({ l: 0.65, c: 0.28, h: 240 });
            setFlowerPalType(e.target.value);

            const pal = flowerPalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="bluePoppy">Blue Poppy</label>
      </div>

      <div className="flex gap-4">
        <input
          type="radio"
          name="flowerPal"
          id="foliage"
          value={"foliage"}
          checked={flowerPalType === "foliage"}
          onChange={(e) => {
            setOklch({ l: 0.82, c: 0.12, h: 150 });
            setFlowerPalType(e.target.value);

            const pal = flowerPalGen(oklch, e.target.value);
            setPalette(pal);
            setDuplicatePalette(pal);
          }}
        />
        <label htmlFor="foliage">Foliage</label>
      </div>
    </div>
  );
}

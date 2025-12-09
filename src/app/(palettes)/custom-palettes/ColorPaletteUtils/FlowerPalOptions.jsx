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

  const flowerOptions = [
    {
      id: "sunflower",
      label: "Sunflower",
      oklch: { l: 0.88, c: 0.25, h: 100, a: 1 },
    },
    { id: "rose", label: "Rose", oklch: { l: 0.63, c: 0.28, h: 25, a: 1 } },
    { id: "lavender", label: "Lavender", oklch: { l: 0.8, c: 0.16, h: 280 } },
    { id: "orchid", label: "Orchid", oklch: { l: 0.75, c: 0.22, h: 330 } },
    { id: "lotus", label: "Lotus", oklch: { l: 0.9, c: 0.12, h: 350 } },
    { id: "bluebell", label: "Bluebell", oklch: { l: 0.72, c: 0.18, h: 260 } },
    { id: "marigold", label: "Marigold", oklch: { l: 0.82, c: 0.26, h: 65 } },
    { id: "hibiscus", label: "Hibiscus", oklch: { l: 0.7, c: 0.3, h: 40 } },
    {
      id: "morning-glory",
      label: "Morning Glory",
      oklch: { l: 0.68, c: 0.2, h: 215 },
    },
    {
      id: "tangerine-gerbera",
      label: "Tangerine Gerbera",
      oklch: { l: 0.75, c: 0.35, h: 50 },
    },
    {
      id: "cymbidium-orchid",
      label: "Cymbidium Orchid",
      oklch: { l: 0.8, c: 0.2, h: 105 },
    },
    {
      id: "chocolateCosmos",
      label: "Chocolate Cosmos",
      oklch: { l: 0.3, c: 0.18, h: 15 },
    },
    {
      id: "gardenCosmos",
      label: "Garden Cosmos",
      oklch: { l: 0.78, c: 0.28, h: 320 },
    },
    {
      id: "birdOfParadise",
      label: "Bird of Paradise",
      oklch: { l: 0.7, c: 0.35, h: 55 },
    },
    {
      id: "passionFlower",
      label: "Passion Flower",
      oklch: { l: 0.9, c: 0.08, h: 280 },
    },
    {
      id: "kingProtea",
      label: "King Protea",
      oklch: { l: 0.65, c: 0.15, h: 350 },
    },
    { id: "plumeria", label: "Plumeria", oklch: { l: 0.95, c: 0.05, h: 90 } },
    {
      id: "blackPansy",
      label: "Black Pansy",
      oklch: { l: 0.25, c: 0.05, h: 280 },
    },
    { id: "jadeVine", label: "Jade Vine", oklch: { l: 0.65, c: 0.25, h: 175 } },
    { id: "hydrangea", label: "Hydrangea", oklch: { l: 0.6, c: 0.18, h: 260 } },
    {
      id: "tigerLily",
      label: "Tiger Lily",
      oklch: { l: 0.75, c: 0.35, h: 60 },
    },
    {
      id: "callaLily",
      label: "Calla Lily",
      oklch: { l: 0.93, c: 0.07, h: 95 },
    },
    {
      id: "bluePoppy",
      label: "Blue Poppy",
      oklch: { l: 0.65, c: 0.28, h: 240 },
    },
    { id: "foliage", label: "Foliage", oklch: { l: 0.82, c: 0.12, h: 150 } },
  ];

  const handleChange = (opt) => {
    setOklch(opt.oklch);
    setFlowerPalType(opt.id);
    const pal = flowerPalGen(oklch, opt.id);
    setPalette(pal);
    setDuplicatePalette(pal);
  };

  return (
    <div className="flex flex-col gap-0">
      {flowerOptions.map((opt) => (
        <div key={opt.id} className="flex gap-4">
          <input
            type="radio"
            name="flowerPal"
            id={opt.id}
            value={opt.id}
            checked={flowerPalType === opt.id}
            onChange={() => handleChange(opt)}
          />
          <label htmlFor={opt.id}>{opt.label}</label>
        </div>
      ))}
    </div>
  );
}

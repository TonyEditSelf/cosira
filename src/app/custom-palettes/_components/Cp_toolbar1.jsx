import { paletteTypes } from "@/app/data/paletteTypes";

export default function Cp_toolbar1() {
  return (
    <div>
      {paletteTypes.map((paltype, i) => (
        <span key={i}>{paltype}</span>
      ))}
    </div>
  );
}

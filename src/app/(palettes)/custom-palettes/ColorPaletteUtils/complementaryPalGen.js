import { converter } from "culori";

export default function complementaryPalGen(oklchColor, source) {
  let baseColor, compColor;

  if (source === 0) {
    baseColor = oklchColor;
    compColor = { ...oklchColor, h: (oklchColor.h + 180) % 360 };
  } else {
    compColor = oklchColor;
    baseColor = { ...oklchColor, h: (oklchColor.h + 180) % 360 };
  }

  return [baseColor, compColor];
}

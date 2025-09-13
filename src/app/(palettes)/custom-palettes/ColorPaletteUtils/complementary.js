import { converter, clampChroma, formatter, displayable } from "culori";

export default function complementary(ariaColor) {
  // console.log("ariaColor: ", ariaColor);

  // const ariaColorOklch = ariaColor.toString("oklch");

  // console.log("ariaColorOklch: ", ariaColorOklch);

  const toOKLCH = converter("oklch");

  const baseColor = toOKLCH(ariaColor);

  // console.log("baseColor: ", baseColor);

  // console.log("ariaColor: ", ariaColor);
  // console.log("basecolor: ", baseColor);

  const compColor = { ...baseColor, hue: (baseColor.hue + 180) % 360 };
  const ableToShowColor = displayable(compColor);

  let showableColor;

  if (!ableToShowColor) {
    showableColor = clampChroma(compColor);
  } else {
    showableColor = compColor;
  }

  // const baseColorString = format(baseColor, "oklch");
  // const showableColorString = format(compColor, "oklch");

  // console.log("baseColorString: ", baseColorString);
  // console.log("showableColorString: ", showableColorString);
}

// console.log('ariacolor: ',  ariaColor);

// console.log('h: ', baseColor.hue);
// console.log('l: ', baseColor.lightness);
// console.log('c: ', baseColor.saturation);
// console.log('a: ', baseColor.alpha);

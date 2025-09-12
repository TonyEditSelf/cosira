import { parse, converter, clampChroma, formatHex8, formatCss, displayable } from "culori";

export default function complementary(ariaColor) {

  const toOklcha = converter('oklch');
  const clampToSrgb = clampChroma('srgb');
  
  const baseColor = toOklcha(ariaColor);

  if (!baseColor) {
    return ["#000000", "#000000"];
  }

  // Calculate the complementary hue
  const compHue = (baseColor.h + 180) % 360;

  // Create the complementary color object with the correct property names
  const compColor = {
    mode: 'oklch',
    l: baseColor.l,
    c: baseColor.c,
    h: compHue,
    alpha: baseColor.alpha
  };

  // Clamp the color to the sRGB gamut
  const finalCompColor = clampToSrgb(compColor);
  
  // Format the colors to CSS strings
  const finalCompColorCss = formatCss(finalCompColor);
  const baseColorCss = formatCss(baseColor);

  const compPalette = [finalCompColorCss, baseColorCss];
  return compPalette;

}

  // console.log('ariacolor: ',  ariaColor);
  

  // console.log('h: ', baseColor.hue);
  // console.log('l: ', baseColor.lightness);
  // console.log('c: ', baseColor.saturation);
  // console.log('a: ', baseColor.alpha);
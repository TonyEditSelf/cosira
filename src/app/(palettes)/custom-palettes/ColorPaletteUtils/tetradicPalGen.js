export default function tetradicPalGen(oklch, tetradicOptions) {
  const baseColor = oklch;

  const baseColor2 = {
    ...baseColor,
    h: (baseColor.h + tetradicOptions.tetradicAngle) % 360,
  };

  

  return null;
}

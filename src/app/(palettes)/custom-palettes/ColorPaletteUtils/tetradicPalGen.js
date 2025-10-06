export default function tetradicPalGen(oklch, tetradicOptions) {
  const baseColor1 = oklch;

  const baseColor2 = {
    ...baseColor1,
    h: (baseColor1.h + 180) % 360,
  };

  return null;
}

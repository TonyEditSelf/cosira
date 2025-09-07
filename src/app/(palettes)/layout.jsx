import { ColorPaletteContextProvider } from "./ColorContext";

export default function PalettesLayout({ children }) {
  return <ColorPaletteContextProvider>{children}</ColorPaletteContextProvider>;
}

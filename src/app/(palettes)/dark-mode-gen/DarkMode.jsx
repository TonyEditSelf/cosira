import chroma from "chroma-js";
import { useColorPaletteContext } from "../ColorContext";

export default function DarkMode() {
  const { palette } = useColorPaletteContext();
  return <div>DarkMode</div>;
}

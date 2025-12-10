"use client";

import PaletteViewer from "./_components/Pickers/components/PaletteViewer";

import { colorNameUIrole } from "./_components/Pickers/components/colorNameUIrole";
import { MdGradient } from "react-icons/md";
import PalettteProperties from "./_components/PalettteProperties";

import PageWrapper from "@/components/ui/PageWrapper";
import MyColorPicker from "./_components/MyColorPicker";

export default function CustomPalettes() {
  return (
    <PageWrapper>
      <PaletteViewer />
    </PageWrapper>
  );
}

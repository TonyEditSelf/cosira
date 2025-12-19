"use client";

import PageWrapper from "@/components/ui/PageWrapper";
import FontPalettePreview from "./FontPalettePreview";
import FontPaletteToolbar from "./FontPaletteToolbar";

export default function PreviewFontsAndPalette() {
  return (
    <PageWrapper>
      <FontPalettePreview />
      <FontPaletteToolbar />
    </PageWrapper>
  );
}

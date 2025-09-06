"use client";

import { MySlider } from "./_components/MySlider";
import CustomPalToolbar1 from "./_components/CustomPalToolbar1";
import { useState } from "react";
import { AnimatePresence, easeIn, motion } from "framer-motion";
import PageWrapper from "@/components/ui/PageWrapper";

export default function CustomPalettes() {
  const [leftPaletteAdjusterOpen, setLeftPaletteAdjusterOpen] = useState(false);

  return (
    <PageWrapper>
      <main className="hidden lg:flex flex-col h-full">
        <section className="flex flex-1">
          <AnimatePresence>
            {leftPaletteAdjusterOpen && (
              <motion.aside
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -200, opacity: 0 }}
                transition={{ duration: 0.3, ease: easeIn }}
                className="flex flex-col items-center mb-2 ml-2 mr-0 pt-5 px-10 w-80 rounded-md border border-[var(--navBorder)]"
              >
                <div className="flex flex-col gap-4">
                  <MySlider
                    label="Hue"
                    defaultValue={180}
                    minValue={0}
                    maxValue={360}
                    step={1}
                  />
                  <MySlider
                    label="Lightness"
                    defaultValue={0.5}
                    minValue={0}
                    maxValue={1}
                    step={0.1}
                  />
                  <MySlider
                    label="Chroma"
                    defaultValue={0.5}
                    minValue={0}
                    maxValue={1}
                    step={0.1}
                  />
                  <MySlider
                    label="Alpha"
                    defaultValue={0.5}
                    minValue={0}
                    maxValue={1}
                    step={0.1}
                  />
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
          <section className="flex-1 ml-2 mr-2 mb-2 border rounded-md border-[var(--navBorder)] flex-col p-2">
            <div role="palette viewer" className="flex-1"></div>
          </section>
        </section>
        <CustomPalToolbar1
          setLeftPaletteAdjusterOpen={setLeftPaletteAdjusterOpen}
        />
      </main>
    </PageWrapper>
  );
}

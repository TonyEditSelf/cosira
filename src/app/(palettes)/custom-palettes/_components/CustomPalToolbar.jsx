import Link from "next/link";
import { IoContrast } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { SiShowtime } from "react-icons/si";
import { paletteTypes } from "@/app/data/paletteTypes";
import SelectComp from "./SelectComp";
import { HiMiniAdjustmentsHorizontal } from "react-icons/hi2";

import {
  FaAnglesUp,
  FaAnglesDown,
  FaAnglesLeft,
  FaAnglesRight,
} from "react-icons/fa6";
import { FaSave, FaPlay } from "react-icons/fa";
import { CgExport } from "react-icons/cg";
import { LuFullscreen } from "react-icons/lu";
import { useColorPaletteContext } from "../../ColorContext";

export default function CustomPalToolbar() {
  const {
    palette,
    setPalette,
    paletteHistory,
    setPaletteHistory,
    paletteHistoryCounter,
    setPaletteHistoryCounter,
    setLeftPaletteAdjusterOpen,
    setMyColorPickerOpen,
    leftPaletteAdjusterOpen,
    cssColor,
    selectedPaletteType,
    setSelectedPaletteType,
    showHidePanelOpen,
    setShowHidePanelOpen,
  } = useColorPaletteContext();

  const goBackPalHistory = () => {
    if (paletteHistoryCounter <= 0) return;
    if (paletteHistoryCounter === paletteHistory.length) {
      setPaletteHistory((prevHistory) => {
        if (palette.length > 0) {
          const lastEntry = prevHistory[prevHistory.length - 1];

          if (JSON.stringify(lastEntry) !== JSON.stringify(palette)) {
            const updatedHistory = [...prevHistory, palette];
            return updatedHistory;
          }
        }
        return prevHistory;
      });
      setPaletteHistory((prevHistory) => {
        if (palette.length > 0) {
          const lastEntry = prevHistory[prevHistory.length - 1];

          if (JSON.stringify(lastEntry) !== JSON.stringify(palette)) {
            const updatedHistory = [...prevHistory, palette];
            return updatedHistory;
          }
        }
        return prevHistory;
      });
    }
    setPalette(paletteHistory[paletteHistoryCounter - 1]);

    setPaletteHistoryCounter((prevCounter) => {
      const newCounter = prevCounter - 1;
      return newCounter;
    });
  };

  const goForwardPalHistory = () => {
    if (paletteHistoryCounter >= paletteHistory.length) return;
    setPalette(paletteHistory[paletteHistoryCounter + 1]);

    setPaletteHistoryCounter((prevCounter) => {
      const newCounter = prevCounter + 1;
      return newCounter;
    });
  };

  return (
    <section className="flex gap-3 items-center justify-center border border-[var(--navBorder)] py-2 ml-3 mr-2 mb-2 mt-2 rounded-md">
      {!showHidePanelOpen ? (
        <SiShowtime
          onClick={() => setShowHidePanelOpen((prev) => !prev)}
          className="size-9 cursor-pointer border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]"
        />
      ) : (
        <IoMdClose
          onClick={() => setShowHidePanelOpen((prev) => !prev)}
          className="size-9 cursor-pointer border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]"
        />
      )}

      {!leftPaletteAdjusterOpen ? (
        <HiMiniAdjustmentsHorizontal
          onClick={() => setLeftPaletteAdjusterOpen((prev) => !prev)}
          className={`size-9 cursor-pointer font-black py-2 px-2 rounded-md ${
            leftPaletteAdjusterOpen
              ? "border-[var(--navBorder)] hover:border-[var(--muted-foreground)] border"
              : "border-[var(--brand)] border-2 hover:border-2"
          } `}
        />
      ) : (
        <IoMdClose
          onClick={() => setLeftPaletteAdjusterOpen((prev) => !prev)}
          className="size-9 cursor-pointer border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]"
        />
      )}

      <SelectComp
        items={paletteTypes}
        value={selectedPaletteType}
        onChange={setSelectedPaletteType}
      />
      <FaAnglesUp className="size-9 cursor-pointer border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]" />
      <FaAnglesDown className="size-9 cursor-pointer border border-[var(--navBorder)] hover:border-[var(--muted-foreground)] p-2 rounded-md" />
      <section className="flex gap-5 items-center border border-[var(--navBorder)] hover:border-[var(--muted-foreground)] pl-5 rounded-md">
        <p className="h-full">Pick Color: </p>
        <button
          onClick={() => {
            setMyColorPickerOpen((prev) => !prev);
          }}
          className="rounded-md h-[35px]  py-1 px-20 cursor-pointer"
          style={{ backgroundColor: `${cssColor}` }}
        ></button>
      </section>
      <Link href={"/palette-tester"} className="size-9">
        <IoContrast className="size-9 cursor-pointer border border-[var(--navBorder)] hover:border-[var(--muted-foreground)] p-2 rounded-md" />
      </Link>
      <FaAnglesLeft
        className="size-9 cursor-pointer border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]"
        onClick={goBackPalHistory}
      />
      <FaPlay className="size-9 cursor-pointer border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]" />

      <FaAnglesRight
        className="size-9 cursor-pointer border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]"
        onClick={goForwardPalHistory}
      />

      <FaSave className="size-9 cursor-pointer border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]" />
      <CgExport className="size-9 cursor-pointer border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]" />
    </section>
  );
}

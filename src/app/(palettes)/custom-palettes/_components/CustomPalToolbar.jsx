"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoContrast } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { SiShowtime } from "react-icons/si";
import { paletteTypes } from "@/app/data/paletteTypes";
import { FaDatabase } from "react-icons/fa";
import SelectComp from "./SelectComp";
import { HiMiniAdjustmentsHorizontal } from "react-icons/hi2";

import {
  FaAnglesUp,
  FaAnglesDown,
  FaAnglesLeft,
  FaAnglesRight,
} from "react-icons/fa6";
import { FaSave, FaPlay } from "react-icons/fa";
// import { CgExport } from "cg-icons";
import { LuFullscreen } from "react-icons/lu";
import { useColorPaletteContext } from "../../ColorContext";

export default function CustomPalToolbar() {
  const pathname = usePathname();
  const {
    palette,
    setPalette,
    paletteHistory,
    setPaletteHistory,
    paletteHistoryCounter,
    setPaletteHistoryCounter,
    historyNavigation,
    setOklch,
    setHistoryNavigation,
    historyNavigationRef,
    setLeftPaletteAdjusterOpen,
    setMyColorPickerOpen,
    leftPaletteAdjusterOpen,
    cssColor,
    selectedPaletteType,
    setSelectedPaletteType,
    duplicatePaletteType,
    setDuplicatePaletteType,
    showHidePanelOpen,
    setShowHidePanelOpen,
    databaseOpen,
    setDatabaseOpen,
    favPalette,
    setFavPalette,
    generateRandomColor,
    generateRandomPalette,
  } = useColorPaletteContext();

  const isRandomPalettesPage = pathname === "/random-palettes";

  const goBackPalHistory = () => {
    if (paletteHistoryCounter <= 0) return;

    const newCounter = paletteHistoryCounter - 1;
    const historyEntry = paletteHistory[newCounter];

    historyNavigationRef.current = true;

    setPaletteHistoryCounter(newCounter);
    setPalette(historyEntry.palette);
    setDuplicatePaletteType(historyEntry.type);
    setSelectedPaletteType(historyEntry.type);
    setOklch(historyEntry.oklch);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        historyNavigationRef.current = false;
      });
    });
  };

  const goForwardPalHistory = () => {
    if (paletteHistoryCounter >= paletteHistory.length - 1) return;

    const newCounter = paletteHistoryCounter + 1;
    const historyEntry = paletteHistory[newCounter];

    historyNavigationRef.current = true;

    setPaletteHistoryCounter(newCounter);
    setPalette(historyEntry.palette);
    setDuplicatePaletteType(historyEntry.type);
    setSelectedPaletteType(historyEntry.type);
    setOklch(historyEntry.oklch);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        historyNavigationRef.current = false;
      });
    });
  };

  return (
    <section className="flex gap-3 items-center justify-center border border-[var(--navBorder)] py-3 ml-2 mr-2 mb-2 mt-2 rounded-md">
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
        onChange={(val) => {
          if (!isRandomPalettesPage) {
            setSelectedPaletteType(val);
          }
        }}
        disabled={isRandomPalettesPage}
      />

      <FaAnglesUp className="size-9 cursor-pointer border border-(--navBorder) py-2 px-2 rounded-md hover:border-muted-foreground" />
      <FaAnglesDown className="size-9 cursor-pointer border border-(--navBorder) hover:border-muted-foreground p-2 rounded-md" />
      <section className="flex gap-5 items-center border border-(--navBorder) hover:border-muted-foreground pl-5 rounded-md">
        <p className="h-full">Pick Color: </p>
        <button
          onClick={() => {
            setMyColorPickerOpen((prev) => !prev);
          }}
          className="rounded-md h-8.75 py-1 px-20 cursor-pointer"
          style={{ backgroundColor: `${cssColor}` }}
        ></button>
      </section>
      <FaAnglesLeft
        className="size-9 cursor-pointer py-2 px-2 rounded-md border border-(--navBorder) hover:border-muted-foreground"
        onClick={goBackPalHistory}
      />

      {isRandomPalettesPage && (
        <FaPlay
          onClick={generateRandomPalette}
          className="size-9 cursor-pointer border border-(--navBorder) py-2 px-2 rounded-md hover:border-muted-foreground"
        />
      )}

      <FaAnglesRight
        className="size-9 cursor-pointer border border-(--navBorder) py-2 px-2 rounded-md hover:border-muted-foreground"
        onClick={goForwardPalHistory}
      />

      <FaSave
        onClick={() => {
          const favpalObject = {
            palette: palette,
            type: selectedPaletteType,
          };

          const exists = favPalette.some((element) => {
            return JSON.stringify(element) === JSON.stringify(favpalObject);
          });

          if (!exists) {
            setFavPalette((prev) => [
              ...prev,
              { palette: palette, type: selectedPaletteType },
            ]);
          }
        }}
        className="size-9 cursor-pointer border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]"
      />

      {/* <CgExport className="size-9 cursor-pointer border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]" /> */}

      {!databaseOpen ? (
        <FaDatabase
          onClick={() => setDatabaseOpen((prev) => !prev)}
          className="size-9 cursor-pointer border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]"
        />
      ) : (
        <IoMdClose
          onClick={() => setDatabaseOpen((prev) => !prev)}
          className="size-9 cursor-pointer border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]"
        />
      )}
    </section>
  );
}

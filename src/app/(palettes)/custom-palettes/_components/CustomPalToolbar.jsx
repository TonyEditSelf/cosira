"use client";

import { usePathname, useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";
import { SiShowtime } from "react-icons/si";
import { paletteTypes } from "@/app/data/paletteTypes";
import { FaDatabase, FaSave, FaPlay } from "react-icons/fa";
import SelectComp from "./SelectComp";
import { HiMiniAdjustmentsHorizontal } from "react-icons/hi2";
import { TbArrowsMaximize } from "react-icons/tb";
import {
  FaAnglesUp,
  FaAnglesDown,
  FaAnglesLeft,
  FaAnglesRight,
} from "react-icons/fa6";
import { useColorPaletteContext } from "../../ColorContext";
import PaletteExportMenu from "../../shared/PaletteExportMenu";

export default function CustomPalToolbar() {
  const pathname = usePathname();
  const router = useRouter();

  const {
    palette,
    setPalette,
    paletteHistory,
    paletteHistoryCounter,
    setPaletteHistoryCounter,
    setOklch,
    historyNavigationRef,
    setLeftPaletteAdjusterOpen,
    setMyColorPickerOpen,
    leftPaletteAdjusterOpen,
    cssColor,
    selectedPaletteType,
    setSelectedPaletteType,
    setDuplicatePaletteType,
    showHidePanelOpen,
    setShowHidePanelOpen,
    databaseOpen,
    setDatabaseOpen,
    favPalette,
    setFavPalette,
    generateRandomPalette,
    prepareForExpander,
  } = useColorPaletteContext();

  const isRandomPalettesPage = pathname === "/random-palettes";
  const paletteTypeValues = paletteTypes.map((item) => item.value);

  const shiftPaletteType = (direction) => {
    if (!paletteTypeValues.length) return;

    const currentIndex = Math.max(
      0,
      paletteTypeValues.indexOf(selectedPaletteType),
    );
    const nextIndex =
      direction === "up"
        ? (currentIndex - 1 + paletteTypeValues.length) %
          paletteTypeValues.length
        : (currentIndex + 1) % paletteTypeValues.length;

    setSelectedPaletteType(paletteTypeValues[nextIndex]);
  };

  const handleExpand = () => {
    const { bases } = prepareForExpander();
    if (!bases || bases.length === 0) return;
    router.push("/palette-expander");
  };

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
    <section className="flex gap-3 items-center text-xs justify-center border border-[var(--navBorder)] py-1 ml-2 mr-2 mb-2 mt-2 rounded-md">
      {!showHidePanelOpen ? (
        <SiShowtime
          onClick={() => setShowHidePanelOpen((prev) => !prev)}
          className="size-7 cursor-pointer border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]"
        />
      ) : (
        <IoMdClose
          onClick={() => setShowHidePanelOpen((prev) => !prev)}
          className="size-7 cursor-pointer border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]"
        />
      )}

      {!leftPaletteAdjusterOpen ? (
        <HiMiniAdjustmentsHorizontal
          onClick={() => setLeftPaletteAdjusterOpen((prev) => !prev)}
          className={`size-7 cursor-pointer font-black py-2 px-2 rounded-md ${
            leftPaletteAdjusterOpen
              ? "border-[var(--navBorder)] hover:border-[var(--muted-foreground)] border"
              : "border-[var(--brand)] border-2 hover:border-2"
          }`}
        />
      ) : (
        <IoMdClose
          onClick={() => setLeftPaletteAdjusterOpen((prev) => !prev)}
          className="size-7 cursor-pointer border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]"
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

      {!isRandomPalettesPage && (
        <button
          type="button"
          onClick={() => shiftPaletteType("up")}
          className="size-7 cursor-pointer border border-(--navBorder) py-2 px-2 rounded-md hover:border-muted-foreground"
          title="Previous theme"
        >
          <FaAnglesUp className="size-3.5" />
        </button>
      )}

      {!isRandomPalettesPage && (
        <button
          type="button"
          onClick={() => shiftPaletteType("down")}
          className="size-7 cursor-pointer border border-(--navBorder) hover:border-muted-foreground p-2 rounded-md"
          title="Next theme"
        >
          <FaAnglesDown className="size-3.5" />
        </button>
      )}

      {!isRandomPalettesPage && (
        <section className="flex gap-5 items-center border border-(--navBorder) hover:border-muted-foreground pl-5 rounded-md">
          <p className="h-full">Pick Color: </p>
          <button
            type="button"
            onClick={() => setMyColorPickerOpen((prev) => !prev)}
            className="rounded-md h-8.75 py-1 px-20 cursor-pointer"
            style={{ backgroundColor: `${cssColor}` }}
          />
        </section>
      )}

      <FaAnglesLeft
        className="size-7 cursor-pointer py-2 px-2 rounded-md border border-(--navBorder) hover:border-muted-foreground"
        onClick={goBackPalHistory}
      />

      {isRandomPalettesPage && (
        <FaPlay
          onClick={generateRandomPalette}
          className="size-7 cursor-pointer border border-(--navBorder) py-2 px-2 rounded-md hover:border-muted-foreground"
        />
      )}

      <FaAnglesRight
        className="size-7 cursor-pointer border border-(--navBorder) py-2 px-2 rounded-md hover:border-muted-foreground"
        onClick={goForwardPalHistory}
      />

      <FaSave
        onClick={() => {
          const favpalObject = { palette, type: selectedPaletteType };
          const exists = favPalette.some(
            (element) =>
              JSON.stringify(element) === JSON.stringify(favpalObject),
          );
          if (!exists) {
            setFavPalette((prev) => [
              ...prev,
              { palette, type: selectedPaletteType },
            ]);
          }
        }}
        className="size-7 cursor-pointer border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]"
      />

      {!databaseOpen ? (
        <FaDatabase
          onClick={() => setDatabaseOpen((prev) => !prev)}
          className="size-7 cursor-pointer border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]"
        />
      ) : (
        <IoMdClose
          onClick={() => setDatabaseOpen((prev) => !prev)}
          className="size-7 cursor-pointer border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]"
        />
      )}
      <PaletteExportMenu
        palette={palette}
        paletteName={selectedPaletteType || "palette"}
        buttonLabel="Export"
        placement="up"
      />

      <button
        onClick={handleExpand}
        title="Expand this palette into a full design system"
        className="flex items-center gap-1.5 px-2.5 h-7 cursor-pointer border-2 border-[var(--brand)] rounded-md hover:bg-[var(--brand)] hover:text-white transition-all group"
      >
        <TbArrowsMaximize className="size-3.5 text-[var(--brand)] group-hover:text-white transition-colors" />
        <span className="text-[10px] font-bold text-[var(--brand)] group-hover:text-white transition-colors leading-none">
          Expand
        </span>
      </button>
    </section>
  );
}

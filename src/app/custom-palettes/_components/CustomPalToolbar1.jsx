import Link from "next/link";
import { IoContrast } from "react-icons/io5";
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
import { useState } from "react";

export default function Cp_toolbar1({ setLeftPaletteAdjusterOpen }) {
  const [baseColor, setBaseColor] = useState("#e60073");

  return (
    <section className="flex gap-3 items-center justify-center border border-[var(--navBorder)] py-2 ml-2 mr-2 mb-2 rounded-md">
      <HiMiniAdjustmentsHorizontal
        onClick={() => setLeftPaletteAdjusterOpen((prev) => !prev)}
        className="size-9 font-black border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]"
      />
      <SelectComp items={paletteTypes} />
      <FaAnglesUp className="size-9 border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]" />
      <FaAnglesDown className="size-9 border border-[var(--navBorder)] hover:border-[var(--muted-foreground)] p-2 rounded-md" />
      <section className="flex gap-5 items-center border border-[var(--navBorder)] hover:border-[var(--muted-foreground)] pl-5 rounded-md">
        <p className="h-full">Pick Color: </p>
        <button
          className="rounded-md h-[35px] py-1 px-10"
          style={{ backgroundColor: `${baseColor}` }}
        ></button>
      </section>
      <Link href={"/palette-tester"} className="size-9">
        <IoContrast className="size-9 border border-[var(--navBorder)] hover:border-[var(--muted-foreground)] p-2 rounded-md" />
      </Link>
      <FaAnglesLeft className="size-9 border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]" />
      <FaPlay className="size-9 border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]" />

      <FaAnglesRight className="size-9 border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]" />
      <FaSave className="size-9 border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]" />
      <CgExport className="size-9 border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]" />
      <LuFullscreen className="size-9 border border-[var(--navBorder)] py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]" />
    </section>
  );
}

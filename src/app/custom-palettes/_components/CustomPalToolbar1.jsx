"use client";

import Link from "next/link";
import { paletteTypes } from "@/app/data/paletteTypes";
import SelectComp from "./SelectComp";
import { FaAnglesUp, FaAnglesDown } from "react-icons/fa6";
import { useState } from "react";

export default function Cp_toolbar1() {
  const [baseColor, setBaseColor] = useState("#e60073");

  return (
    <section className="flex gap-3 items-center justify-center">
      <SelectComp items={paletteTypes} />
      <FaAnglesUp className="size-9 border border-[var(--navBorder)] text-3xl py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]" />
      <FaAnglesDown className="size-9 border border-[var(--navBorder)] hover:border-[var(--muted-foreground)] text-3xl p-2 rounded-md" />
      <section className="flex gap-5 items-center border border-[var(--navBorder)] hover:border-[var(--muted-foreground)] pl-5 rounded-md">
        <p className="h-full">Pick Color: </p>
        <button
          className="rounded-md h-[35px] py-1 px-10"
          style={{ backgroundColor: `${baseColor}` }}
        ></button>
      </section>
      <Link
        href={"/palette-tester"}
        className="border border-[var(--navBorder)] hover:border-[var(--muted-foreground)] rounded-md py-2 px-4 h-[35px] flex justify-center items-center"
      >
        Test Current Palette
      </Link>
    </section>
  );
}

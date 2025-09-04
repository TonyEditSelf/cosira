import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { FaSave } from "react-icons/fa";
import { CgExport } from "react-icons/cg";
import { LuFullscreen } from "react-icons/lu";

export default function CustomPalToolbar2() {
  return (
    <section className="flex gap-3 items-center justify-center">
      <FaAnglesLeft className="size-9 border border-[var(--navBorder)] text-3xl py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]" />
      <button className="border border-[var(--navBorder)] hover:border-[var(--muted-foreground)] rounded-md py-2 px-4 h-[35px] flex justify-center items-center">
        Generate
      </button>
      <FaAnglesRight className="size-9 border border-[var(--navBorder)] text-3xl py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]" />
      <FaSave className="size-9 border border-[var(--navBorder)] text-3xl py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]" />
      <CgExport className="size-9 border border-[var(--navBorder)] text-3xl py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]" />
      <LuFullscreen className="size-9 border border-[var(--navBorder)] text-3xl py-2 px-2 rounded-md hover:border-[var(--muted-foreground)]" />
    </section>
  );
}
